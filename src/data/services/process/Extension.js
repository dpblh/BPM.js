import _ from 'lodash';

import { getId } from './Utils';

async function evalDefaultStep({
  outgoingSimpleEdge,
  outgoingImmediateEdges,
  context,
  event,
}) {
  const separatedId = getId();

  const { sendImmediateEvent, setTehState, process } = this;

  if (outgoingImmediateEdges.length) {
    const state = {
      completedLength: 0,
      length: outgoingImmediateEdges.length,
    };

    setTehState({ id: separatedId, state });

    outgoingImmediateEdges.forEach(edge =>
      sendImmediateEvent({
        separatedId,
        edgeId: edge.id,
        nodeId: edge.target,
        parentContextId: context,
        parentContextPosition: process.context[context].stack.length,
      }),
    );
  }

  if (!outgoingSimpleEdge) {
    if (event && event.type === 'immediate') {
      this.incrementImmediateDone(event);
    }
    return console.log('Конец продпрограммы');
  }

  // выбираем следующую node
  const node = this.getNode(outgoingSimpleEdge.target);

  await this.next({ node, ingoingEdge: outgoingSimpleEdge, context, event });
}

async function evalAwaitAllStep({
  outgoingSimpleEdge,
  outgoingImmediateEdges,
  context,
  event,
}) {
  if (event && event.edgesId) {
    const stack = this.prepareStack(context);

    event.edgesId.forEach(id => {
      const ingoingEdge = this.getEdge(id);
      // выполняем пресеты на edge
      ingoingEdge.rolesEval(stack);
    });
  }
  if (!event || !event.separatedId) {
    evalDefaultStep.bind(this)({
      outgoingSimpleEdge,
      outgoingImmediateEdges,
      context,
      event,
    });
  } else {
    this.incrementImmediateDone(event);

    const { getTehState } = this;
    const state = getTehState(event.separatedId);
    if (!state.handler) {
      state.handler = {};
    }

    if (!state.handler[outgoingSimpleEdge.source]) {
      state.handler[outgoingSimpleEdge.source] = {
        edgesId: [],
      };
    }

    state.handler[outgoingSimpleEdge.source].edgesId.push(event.edgeId);

    if (state.completedLength === state.length) {
      _.mapKeys(state.handler, handler => {
        this.sendImmediateEvent({
          nodeId: outgoingSimpleEdge.source,
          parentContextId: event.parentContextId,
          parentContextPosition: event.parentContextPosition,
          edgesId: handler.edgesId,
        });
      });
    }
  }
}

export default {
  test_1: {
    handler: (getVar, setVar) => ({
      result: getVar('x') ** getVar('x'),
      status: 'done',
    }),
    behavior: evalDefaultStep,
  },
  test_2: {
    handler: (getVar, setVar) => ({
      result: getVar('y') - getVar('x'),
      status: 'done',
    }),
    behavior: evalDefaultStep,
  },
  test_await: {
    handler: (getVar, setVar) => ({
      result: 1,
      status: 'await',
    }),
    behavior: evalDefaultStep,
  },
  await_all: {
    handler: (getVar, setVar) => ({
      result: 1,
      status: 'done',
    }),
    behavior: evalAwaitAllStep,
  },
  throw_handler: {
    handler: (getVar, setVar) => {
      const a = null;
      // this need throw exception
      a.text;
    },
    behavior: evalDefaultStep,
  },
  throw_behavior: {
    handler: (getVar, setVar) => ({
      result: 1,
      status: 'done',
    }),
    behavior: () => {
      const a = null;
      // this need throw exception
      a.text;
    },
  },
  test_arguments: {
    handler: (getVar, setVar, args) => ({
      result: args.a + args.b,
      status: 'done',
    }),
    behavior: () => evalDefaultStep,
  },
};
