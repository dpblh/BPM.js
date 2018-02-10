/* eslint-disable import/prefer-default-export */

import { LOAD_PROCESSES, LOADED_PROCESSES } from '../../constants';

export function loadProcesses(fetch) {
  return {
    type: LOAD_PROCESSES,
    payload: { fetch },
  };
}

export function loadedProcesses(process) {
  return {
    type: LOADED_PROCESSES,
    payload: process,
  };
}
