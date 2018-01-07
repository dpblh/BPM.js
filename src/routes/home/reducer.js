import _ from 'lodash';
import {
  LOADED_SCHEMES,
  SET_ORIGIN_SCHEME,
  UPDATE_SCHEME,
  UPDATE_NODE,
  LOADED_HISTORY,
  SET_EDITOR,
  SET_TIMESTAMP,
  SHOW_HISTORY,
  CLEAR_SCHEME,
} from '../../constants';
import { UPDATE_EDGE } from '../../constants/index';

const initializeState = {
  schemes: [],
  scheme: {
    name: 'Новая схема',
    desc: '',
    graph: {
      nodes: [],
      edges: [],
    },
  },
  originScheme: {
    name: 'Новая схема',
    desc: '',
    graph: {
      nodes: [],
      edges: [],
    },
  },
  history: {
    name: [],
    desc: [],
    startNode: [],
  },
  editor: {
    model: null,
    tab: 'navigation',
    showMenu: false,
  },
  showHistory: false,
  timestamp: null,
};

export default function runtime(state = initializeState, action) {
  switch (action.type) {
    case LOADED_SCHEMES:
      return { ...state, schemes: action.payload };
    case SET_ORIGIN_SCHEME:
      action.payload.graph.nodes.forEach(
        n => (n.startNode = n.id === action.payload.startNode),
      );
      return {
        ...state,
        timestamp: null,
        originScheme: action.payload,
        scheme: _.cloneDeep(action.payload),
      };
    case SET_TIMESTAMP:
      return { ...state, timestamp: action.payload };
    case CLEAR_SCHEME:
      return {
        ...state,
        scheme: _.cloneDeep(state.originScheme),
      };
    case UPDATE_SCHEME:
      if (action.payload.graph && action.payload.graph.nodes) {
        action.payload.graph.nodes.forEach(
          n => (n.startNode = n.id === action.payload.startNode),
        );
      }
      return { ...state, scheme: { ...state.scheme, ...action.payload } };
    case UPDATE_NODE: {
      let nodes;
      let currentNode;
      let anotherNodes;
      const { edges } = state.scheme.graph;

      currentNode = state.scheme.graph.nodes.find(
        node => node.id === action.payload.id,
      );
      if (currentNode) {
        anotherNodes = state.scheme.graph.nodes.filter(
          node => node.id !== action.payload.id,
        );
        const updatedNode = { ...currentNode, ...action.payload };
        nodes = [...anotherNodes, updatedNode];
      } else {
        anotherNodes = state.scheme.graph.nodes;
        currentNode = action.payload;
        nodes = [...anotherNodes, action.payload];
      }

      if (action.payload.startNode) {
        // console.log(anotherNodes)
        anotherNodes.forEach(n => (n.startNode = false));
      }

      return {
        ...state,
        scheme: { ...state.scheme, graph: { nodes, edges } },
      };
    }

    case UPDATE_EDGE: {
      let edges;
      const { nodes } = state.scheme.graph;

      const currentEdge = state.scheme.graph.edges.find(
        edge => edge.id === action.payload.id,
      );
      if (currentEdge) {
        const anotherEdges = state.scheme.graph.edges.filter(
          edge => edge.id !== action.payload.id,
        );
        const updatedEdge = { ...currentEdge, ...action.payload };
        edges = [...anotherEdges, updatedEdge];
      } else {
        edges = [...state.scheme.graph.edges, action.payload];
      }

      return {
        ...state,
        scheme: { ...state.scheme, graph: { nodes, edges } },
      };
    }
    case LOADED_HISTORY:
      return { ...state, history: action.payload };
    case SET_EDITOR:
      return { ...state, editor: { ...state.editor, ...action.payload } };
    case SHOW_HISTORY:
      return { ...state, showHistory: action.payload };
    default:
      return state;
  }
}
