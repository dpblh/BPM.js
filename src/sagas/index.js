/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all } from 'redux-saga/effects';
import {
  watchLoadSchemes,
  watchLoadGraph,
  watchLoadHistory,
  watchToggleHistory,
  watchSaveGraph,
  watchLoadGraphByHistory,
} from '../routes/home/saga';

export default function* root() {
  yield all([
    fork(watchLoadSchemes),
    fork(watchLoadGraph),
    fork(watchLoadHistory),
    fork(watchToggleHistory),
    fork(watchSaveGraph),
    fork(watchLoadGraphByHistory),
  ]);
}
