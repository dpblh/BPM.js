import { connect } from 'react-redux';
import Processes from './Processes';

function mapStateToProps(state) {
  return {
    ...state.processes,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Processes);
