import { LOADED_PROCESS } from '../../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case LOADED_PROCESS:
      return { ...state, process: action.payload };
    default:
      return state;
  }
}
