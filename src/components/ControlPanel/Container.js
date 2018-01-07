import { connect } from 'react-redux';
import ControlPanel from './ControlPanel';
import {
  setEditor,
  loadGraph,
  saveGraph,
  toggleHistory,
  setCurrentScheme,
  updateScheme,
  updateNode,
  updateEdge,
  clearScheme,
} from './actions';

function mapStateToProps(state) {
  return {
    ...state.workSpace,
  };
}

const mapDispatchToProps = {
  setEditor,
  loadGraph,
  saveGraph,
  toggleHistory,
  setCurrentScheme,
  updateScheme,
  updateNode,
  updateEdge,
  clearScheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
