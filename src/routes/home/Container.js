import { connect } from 'react-redux';
import Home from './Home';
import {
  loadGraph,
  loadSchemes,
  loadHistory,
  setEditor,
  toggleHistory,
  setCurrentScheme,
  saveGraph,
  setScheme,
  updateNode,
  updateEdge,
  loadByHistory,
  // setEditableEdge,
  // setEditableNode,
} from './actions';

function mapStateToProps(state) {
  return {
    ...state.workSpace,
  };
}

const mapDispatchToProps = {
  loadGraph,
  loadSchemes,
  loadHistory,
  setEditor,
  toggleHistory,
  setCurrentScheme,
  saveGraph,
  setScheme,
  updateNode,
  updateEdge,
  loadByHistory,
  // setEditableEdge,
  // setEditableNode,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
