import _ from 'lodash';
import mongoose from 'mongoose';

import Scheme from '../../models/Scheme';
import Node from '../../models/Node';
import Edge from '../../models/Edge';

import SchemeV from '../../virtualizers/scheme';
import NodeV from '../../virtualizers/node';
import EdgeV from '../../virtualizers/edge';

import { getVal, setLocalVal, setGlobalVal } from './Stack';
import { script as rules } from './ParserRoles';

import extension from './Extension';

const getId = () => mongoose.Types.ObjectId();

const toMap = (array, key) =>
  array.reduce((r, c) => ({ ...r, [c[key]]: c }), {});

// todo
const runScheme = (scheme, stack) => {
  const get = name => getVal(name, stack);
  const set = (name, value) => setGlobalVal(name, value, stack);

  return extension[scheme].handler(get, set);
};

export default class Process {
  constructor(process) {
    this.process = process;
  }

  async resume({ contextId, status }) {
    if (status === 'done') {
      await this.init();
      const { process } = this;
      const event = process.eventAwaitLoop.find(e => e.context === contextId);
      const { context } = event;

      const stack = this.prepareStack(context);
      const currentNode = this.getNode(event.name);
      await this.stepDone(currentNode, stack, context);
      await this.eventLoop();
    }
  }

  async run({ schemeId }) {
    await this.init();
    const scheme = this.getScheme(schemeId);
    await this.evalScheme({ scheme, context: 'main' });
    await this.eventLoop();
  }

  eventLoop = async () => {
    const { process, eventLoop } = this;
    await Promise.all(
      // async event
      process.eventLoop.map(async event => {
        const index = process.eventLoop.indexOf(event);
        process.eventLoop.splice(index, 1);

        process.context[event.contextId] = {
          parentContextId: event.parentContextId,
          parentContextPosition: event.parentContextPosition,
          stack: [],
        };

        const node = this.getNode(event.nodeId);
        const ingoingEdge = this.getEdge(event.edgeId);

        await this.next({
          node,
          ingoingEdge,
          context: event.contextId,
          event,
        });

        event.callback && event.callback.fn();
        // process.context[event.name].finish_t = Date.now();
        // await eventLoop();
      }),
    );

    _.mapKeys(
      _.groupBy(process.eventJoinLoop, 'separatedId'),
      (events, separatedId) => {
        const state = this.getSharedState(separatedId);
        if (state.completedLength === state.length) {
          _.mapKeys(_.groupBy(events, 'nodeId'), (eqEvents, nodeId) => {
            const event = eqEvents[0];

            this.sendImmediateEvent({
              nodeId: event.nodeId,
              parentContextId: event.context,
              parentContextPosition: event.contextPosition,
              edgesId: eqEvents.map(a => a.edgeId),
            });

            eqEvents.forEach(e => {
              const index = process.eventJoinLoop.indexOf(e);
              process.eventJoinLoop.splice(index, 1);
            });
          });
        }
      },
    );

    if (process.eventLoop.length) {
      await eventLoop();
    } else {
      console.log(process.eventJoinLoop);
    }
  };

  async next({ node, ingoingEdge, context, event }) {
    if (this.isScheme(node)) {
      const scheme = this.getScheme(node.scheme);
      await this.evalScheme({ scheme, ingoingEdge, context, event });
    } else {
      await this.evalNode({ node, ingoingEdge, context, event });
    }
    // eventLoop
  }

  async evalScheme({ scheme, ingoingEdge, context, event }) {
    const startNode = this.getNode(scheme.startNode);

    await this.evalNode({ node: startNode, context, ingoingEdge, event });
    //  add edge
  }

  async evalNode({ node, ingoingEdge, context, event }) {
    if (ingoingEdge) {
      // добавляем стек
      this.process.context[context].stack.push({
        edgeId: ingoingEdge.id,
        state: {},
      });

      const stack = this.prepareStack(context);

      // выполняем пресеты на edge
      if (ingoingEdge.roles) {
        rules.apply(ingoingEdge.roles).res.eval(stack);
      }
    }

    const stack = this.prepareStack(context);

    const { status, result } = await runScheme(node.scheme, stack);

    setLocalVal('result', result, stack);

    // проверяем статус последнего шага
    if (status === 'done') {
      await this.stepDone(node, stack, context, event);
    } else if (status === 'await') {
      this.sendAwaitEvent({
        name: node.id,
        context,
      });
    }
  }

  async stepDone(currentNode, stack, context, event) {
    const outgoing = this.getOutgoing(currentNode, stack);

    const outgoingImmediateEdges = outgoing.filter(o => o.immediate);

    const simpleEdgesTrue = outgoing.filter(o => !o.immediate);
    const outgoingSimpleEdge = simpleEdgesTrue.find(e => {
      const ot = simpleEdgesTrue.filter(e2 => e2.id !== e.id);
      // условие вычислтять на месте
      const currentExp = e.conditionEval(stack);
      const otherExp = ot.map(e2 => e2.conditionEval(stack)).some(_ => _);
      return currentExp && !otherExp;
    });

    await extension[currentNode.scheme].evalStep.bind(this)({
      outgoingSimpleEdge,
      outgoingImmediateEdges,
      context,
      event,
    });
  }

  prepareStack(context, position) {
    const currentContext = this.process.context[context];
    if (currentContext.parentContextId) {
      const stack =
        position !== undefined
          ? currentContext.stack.slice(0, position)
          : [...currentContext.stack];
      return [
        ...this.prepareStack(
          currentContext.parentContextId,
          currentContext.parentContextPosition,
        ),
        ...stack,
      ];
    }
    return position !== undefined
      ? currentContext.stack.slice(0, position)
      : [...currentContext.stack];
  }

  getOutgoing(node, stack) {
    return (this.edgesSourceMap[node.id] || []).filter(e =>
      e.conditionEval(stack),
    );
  }

  getNode(id) {
    return this.nodeMap[id];
  }

  getEdge(id) {
    return this.edgeMap[id];
  }

  getScheme(id) {
    return this.schemeMap[id];
  }

  isScheme(node) {
    const scheme = this.getScheme(node.scheme);

    return scheme && scheme.startNode;
  }

  setSharedState = ({ id, state }) => {
    this.process.globalState[id] = state;
  };

  getSharedState = id => this.process.globalState[id];

  // events
  sendImmediateEvent = event => {
    this.process.eventLoop.push({
      type: 'immediate',
      contextId: getId(),
      ...event,
    });
  };

  sendAwaitEvent = event => {
    this.process.eventAwaitLoop.push({
      type: 'await',
      ...event,
    });
  };

  sendJoinEvent = event => {
    this.process.eventJoinLoop.push({
      type: 'join',
      ...event,
    });
  };

  inited = false;

  init = () =>
    new Promise(async accept => {
      if (!this.inited) {
        const { timestamp } = this.process;
        this.schemes = await Scheme.find({}).then(s =>
          s.map(edge => new SchemeV(edge).attrs(timestamp)),
        );
        this.nodes = await Node.find({}).then(s =>
          s.map(edge => new NodeV(edge).attrs(timestamp)),
        );
        this.edges = await Edge.find({}).then(s =>
          s.map(edge => new EdgeV(edge).attrs(timestamp)),
        );

        this.schemeMap = toMap(this.schemes, 'id');
        this.nodeMap = toMap(this.nodes, 'id');
        this.edgeMap = toMap(this.edges, 'id');

        this.edgesSourceMap = _.groupBy(this.edges, 'source');
        accept();
      } else {
        accept();
      }
    });
}
