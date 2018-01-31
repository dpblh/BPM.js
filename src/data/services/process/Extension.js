import _ from 'lodash';
import mongoose from 'mongoose';
import { script as rules } from './ParserRoles';
import { Done } from './States';

const getId = () => mongoose.Types.ObjectId().toString();

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
    console.log('Конец продпрограммы');
    throw new Done();
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
      if (ingoingEdge.roles) {
        rules.apply(ingoingEdge.roles).res.eval(stack);
      }
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

    throw new Done();
  }
}

export default {
  test_1: {
    handler: (getVar, setVar) => ({
      result: getVar('x') ** getVar('x'),
      status: 'done',
    }),
    evalStep: evalDefaultStep,
  },
  test_2: {
    handler: (getVar, setVar) => ({
      result: getVar('y') - getVar('x'),
      status: 'done',
    }),
    evalStep: evalDefaultStep,
  },
  test_await: {
    handler: (getVar, setVar) => ({
      result: 1,
      status: 'await',
    }),
    evalStep: evalDefaultStep,
  },
  await_all: {
    handler: (getVar, setVar) => ({
      result: 1,
      status: 'done',
    }),
    evalStep: evalAwaitAllStep,
  },
};
