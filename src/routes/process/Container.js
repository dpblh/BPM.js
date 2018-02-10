import { connect } from 'react-redux';
import Process from './Process';

function mapStateToProps(state) {
  return {
    ...state.process,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Process);
