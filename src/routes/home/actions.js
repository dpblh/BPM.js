/* eslint-disable import/prefer-default-export */

import {
  LOAD_GRAPH_BY_HISTORY,
  REMOVE_EDGE,
  REMOVE_NODE,
  LOAD_SCHEMES,
  LOADED_SCHEMES,
  LOAD_GRAPH,
  SAVE_GRAPH,
  UPDATE_SCHEME,
  UPDATE_NODE,
  UPDATE_EDGE,
  SET_ORIGIN_SCHEME,
  LOAD_HISTORY,
  SET_EDITOR,
  TOGGLE_HISTORY,
  CLEAR_SCHEME,
} from '../../constants';

export function loadSchemes(fetch) {
  return {
    type: LOAD_SCHEMES,
    payload: { fetch },
  };
}

export function loadedSchemes(schemes) {
  return {
    type: LOADED_SCHEMES,
    payload: schemes,
  };
}

export function loadGraph(id, timestamp, fetch) {
  return {
    type: LOAD_GRAPH,
    payload: { id, timestamp, fetch },
  };
}

export function saveGraph(scheme, fetch) {
  return {
    type: SAVE_GRAPH,
    payload: { scheme, fetch },
  };
}

export function setCurrentScheme(graph) {
  return {
    type: SET_ORIGIN_SCHEME,
    payload: graph,
  };
}

export function loadHistory(id, fetch) {
  return {
    type: LOAD_HISTORY,
    payload: { id, fetch },
  };
}

export function setEditor(model) {
  return {
    type: SET_EDITOR,
    payload: model,
  };
}

export function toggleHistory(fetch) {
  return {
    type: TOGGLE_HISTORY,
    payload: { fetch },
  };
}

export function setScheme(scheme) {
  return {
    type: UPDATE_SCHEME,
    payload: scheme,
  };
}

export function updateNode(scheme) {
  return {
    type: UPDATE_NODE,
    payload: scheme,
  };
}

export function updateEdge(scheme) {
  return {
    type: UPDATE_EDGE,
    payload: scheme,
  };
}

export function loadByHistory(id, timestamp, fetch) {
  return {
    type: LOAD_GRAPH_BY_HISTORY,
    payload: { id, timestamp, fetch },
  };
}

export function removeNode(id) {
  return {
    type: REMOVE_NODE,
    payload: id,
  };
}

export function removeEdge(id) {
  return {
    type: REMOVE_EDGE,
    payload: id,
  };
}

export function updateScheme(scheme) {
  return {
    type: UPDATE_SCHEME,
    payload: scheme,
  };
}

export function clearScheme(scheme) {
  return {
    type: CLEAR_SCHEME,
    payload: scheme,
  };
}
