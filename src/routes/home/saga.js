/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all } from 'redux-saga/effects';
import {
  LOAD_SCHEMES,
  LOADED_SCHEMES,
  LOAD_GRAPH,
  SAVE_GRAPH,
  SET_ORIGIN_SCHEME,
  LOAD_HISTORY,
  LOADED_HISTORY,
  TOGGLE_HISTORY,
  SHOW_HISTORY,
  UPDATE_SCHEME,
  LOAD_GRAPH_BY_HISTORY,
  SET_TIMESTAMP,
  REMOVE_NODE,
  REMOVE_EDGE,
} from '../../constants';
import { loadSchemes, loadGraph, loadHistory, saveGraph } from './api';

function* watchLoadSchemes() {
  while (true) {
    const { payload: { fetch } } = yield take(LOAD_SCHEMES);
    const schemes = yield call(loadSchemes, fetch);
    yield put({
      type: LOADED_SCHEMES,
      payload: schemes,
    });
  }
}

function* watchLoadGraph() {
  while (true) {
    const { payload: { id, timestamp, fetch } } = yield take(LOAD_GRAPH);
    const graph = yield call(loadGraph, fetch, id, timestamp);
    yield put({
      type: SET_ORIGIN_SCHEME,
      payload: graph,
    });
  }
}

function* watchRemoveNode() {
  while (true) {
    const { payload } = yield take(REMOVE_NODE);
    const { nodes, edges } = yield select(
      state => state.workSpace.scheme.graph,
    );
    const currentNode = nodes.find(n => n.id === payload);
    if (currentNode.startNode) {
      console.log(
        'You can not remove startNode. Please before remove startNode to select other startNode',
      );
      // todo I should add retry logic
    } else {
      const anotherNodes = nodes.filter(n => n.id !== payload);
      const anotherEdges = edges.filter(
        e => e.source !== payload && e.target !== payload,
      );
      yield put({
        type: UPDATE_SCHEME,
        payload: {
          graph: {
            nodes: anotherNodes,
            edges: anotherEdges,
          },
        },
      });
    }
  }
}

function* watchRemoveEdge() {
  while (true) {
    const { payload } = yield take(REMOVE_EDGE);
    const { edges, nodes } = yield select(
      state => state.workSpace.scheme.graph,
    );
    const anotherEdges = edges.filter(e => e.id !== payload);
    yield put({
      type: UPDATE_SCHEME,
      payload: {
        graph: {
          nodes,
          edges: anotherEdges,
        },
      },
    });
  }
}

function* watchLoadGraphByHistory() {
  while (true) {
    const { payload: { id, timestamp, fetch } } = yield take(
      LOAD_GRAPH_BY_HISTORY,
    );
    const graph = yield call(loadGraph, fetch, id, timestamp);
    yield put({
      type: SET_TIMESTAMP,
      payload: timestamp,
    });
    yield put({
      type: UPDATE_SCHEME,
      payload: graph,
    });
  }
}

function* watchSaveGraph() {
  while (true) {
    const { payload: { scheme, fetch } } = yield take(SAVE_GRAPH);
    const graph = yield call(saveGraph, fetch, scheme);
    yield put({
      type: SET_ORIGIN_SCHEME,
      payload: graph,
    });
    yield put({
      type: LOAD_SCHEMES,
      payload: { fetch },
    });
  }
}

function* watchLoadHistory() {
  while (true) {
    const { payload: { id, fetch } } = yield take(LOAD_HISTORY);
    const history = yield call(loadHistory, fetch, id);
    yield put({
      type: LOADED_HISTORY,
      payload: history,
    });
  }
}

function* watchToggleHistory() {
  while (true) {
    const { payload: { fetch } } = yield take(TOGGLE_HISTORY);
    const showHistory = yield select(state => state.workSpace.showHistory);
    if (!showHistory) {
      const id = yield select(state => state.workSpace.originScheme.id);
      yield put({
        type: LOAD_HISTORY,
        payload: {
          id,
          fetch,
        },
      });
    }
    yield put({
      type: SHOW_HISTORY,
      payload: !showHistory,
    });
  }
}

export {
  watchLoadSchemes,
  watchLoadGraph,
  watchLoadHistory,
  watchToggleHistory,
  watchSaveGraph,
  watchLoadGraphByHistory,
  watchRemoveNode,
  watchRemoveEdge,
};
