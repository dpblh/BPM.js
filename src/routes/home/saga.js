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
};
