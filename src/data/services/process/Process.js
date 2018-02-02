import _ from 'lodash';

import Scheme from '../../models/Scheme';
import Node from '../../models/Node';
import Edge from '../../models/Edge';

import { getVal, setLocalVal, setGlobalVal } from './Stack';

import extension from './Extension';

import {
  HandlerError,
  BehaviorError,
  ParseConditionError,
  ParseRolesError,
  TehError,
} from './Errors';
import { getId } from './Utils';

const toMap = (array, key) =>
  array.reduce((r, c) => ({ ...r, [c[key]]: c }), {});

// todo тест на путь по умолчанию
// todo перенести virtual в model
// todo убрать ws()
export default class Process {
  constructor(process) {
    this.process = process;
  }

  async resume({ contextId, status }) {
    if (status === 'done') {
      await this.init();
      const { process } = this;
      const event = process.eventAwaitLoop.find(e => e.contextId === contextId);

      const stack = this.prepareStack(event.contextId);
      const currentNode = this.getNode(event.nodeId);

      try {
        await this.stepDone(currentNode, stack, event.contextId, event);
      } catch (e) {
        if (
          e instanceof HandlerError ||
          e instanceof BehaviorError ||
          e instanceof ParseConditionError ||
          e instanceof ParseRolesError ||
          e instanceof Error
        ) {
          process.status = 'failed';
          process.error = e.type ? `${e.type}: ${e.message}` : e.message;
          throw new TehError(e.message, process._id);
        }
      }

      const index = process.eventAwaitLoop.indexOf(event);
      process.eventAwaitLoop.splice(index, 1);

      await this.eventLoop();
      this.updateProcessStatus();
    }
  }

  async run({ schemeId }) {
    await this.init();
    const { process } = this;
    const scheme = this.getScheme(schemeId);
    try {
      await this.evalScheme({ scheme, context: 'main' });
    } catch (e) {
      if (
        e instanceof HandlerError ||
        e instanceof BehaviorError ||
        e instanceof ParseConditionError ||
        e instanceof ParseRolesError ||
        e instanceof Error
      ) {
        process.status = 'failed';
        process.error = e.type ? `${e.type}: ${e.message}` : e.message;
        throw new TehError(e.message, process._id);
      }
    }
    await this.eventLoop();
    this.updateProcessStatus();
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

        // process.context[event.name].finish_t = Date.now();
        // await eventLoop();
      }),
    );

    if (process.eventLoop.length) {
      await eventLoop();
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
      ingoingEdge.rolesEval(stack);
    }

    const stack = this.prepareStack(context);

    const { status, result } = await this.runScheme(node.scheme, stack);

    setLocalVal('result', result, stack);

    // проверяем статус последнего шага
    if (status === 'done') {
      await this.stepDone(node, stack, context, event);
    } else if (status === 'await') {
      this.sendAwaitEvent({
        ...event,
        nodeId: node.id,
        contextId: context,
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

    try {
      await extension[currentNode.scheme].behavior.bind(this)({
        outgoingSimpleEdge,
        outgoingImmediateEdges,
        context,
        event,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new BehaviorError(e.message);
      }
      throw e;
    }
  }

  runScheme(scheme, stack) {
    const get = name => getVal(name, stack);
    const set = (name, value) => setGlobalVal(name, value, stack);

    try {
      return extension[scheme].handler(get, set);
    } catch (e) {
      throw new HandlerError(e.message);
    }
  }

  updateProcessStatus() {
    const { process } = this;
    process.status = process.eventAwaitLoop.length > 0 ? 'waiting' : 'finished';
  }

  incrementImmediateDone(event) {
    const sharedState = this.getTehState(event.separatedId);
    sharedState.completedLength += 1;
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

  setTehState = ({ id, state }) => {
    this.process.tehState[id] = state;
  };

  getTehState = id => this.process.tehState[id];

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

  inited = false;

  init = () =>
    new Promise(async accept => {
      if (!this.inited) {
        const { timestamp } = this.process;
        this.schemes = await Scheme.find({}).then(s =>
          s.map(edge => edge.attrs(timestamp)),
        );
        this.nodes = await Node.find({}).then(s =>
          s.map(edge => edge.attrs(timestamp)),
        );
        this.edges = await Edge.find({}).then(s =>
          s.map(edge => edge.attrs(timestamp)),
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
