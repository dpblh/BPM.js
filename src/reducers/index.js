import { combineReducers } from 'redux';
import runtime from './runtime';
import workSpace from '../routes/home/reducer';

export default combineReducers({
  runtime,
  workSpace,
});
