/* eslint-disable import/prefer-default-export */

import { LOAD_SCHEMES, CLEAR_SCHEME, LOADED_SCHEMES, LOAD_GRAPH, SAVE_GRAPH, UPDATE_SCHEME, UPDATE_NODE, UPDATE_EDGE, SET_ORIGIN_SCHEME, LOAD_HISTORY, SET_EDITOR, TOGGLE_HISTORY, SHOW_HISTORY } from '../../constants';

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

export function showHistory(show) {
  return {
    type: SHOW_HISTORY,
    payload: show,
  };
}

export function updateScheme(scheme) {
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

export function clearScheme(scheme) {
  return {
    type: CLEAR_SCHEME,
    payload: scheme,
  };
}

// export function setEditableNode(node) {
//   return {
//     type: SET_EDITABLE_NODE,
//     payload: {
//       model: node,
//       tab: 3,
//       showMenu: true,
//     },
//   };
// }
