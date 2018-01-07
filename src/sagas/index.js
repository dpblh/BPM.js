/* eslint-disable no-constant-condition */
import { fork, all } from 'redux-saga/effects';
import {
  watchLoadSchemes,
  watchLoadGraph,
  watchLoadHistory,
  watchToggleHistory,
  watchSaveGraph,
  watchLoadGraphByHistory,
  watchRemoveNode,
  watchRemoveEdge,
} from '../routes/home/saga';

export default function* root() {
  yield all([
    fork(watchLoadSchemes),
    fork(watchLoadGraph),
    fork(watchLoadHistory),
    fork(watchToggleHistory),
    fork(watchSaveGraph),
    fork(watchLoadGraphByHistory),
    fork(watchRemoveNode),
    fork(watchRemoveEdge),
  ]);
}
