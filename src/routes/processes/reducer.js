import { LOADED_PROCESSES } from '../../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case LOADED_PROCESSES:
      return { ...state, processes: action.payload };
    default:
      return state;
  }
}
