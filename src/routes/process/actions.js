/* eslint-disable import/prefer-default-export */

import { LOAD_PROCESS, LOADED_PROCESS } from '../../constants';

export function loadProcess(fetch) {
  return {
    type: LOAD_PROCESS,
    payload: { fetch },
  };
}

export function loadedProcess(process) {
  return {
    type: LOADED_PROCESS,
    payload: process,
  };
}
