import { combineReducers } from 'redux';
import runtime from './runtime';
import workSpace from '../routes/home/reducer';
import process from '../routes/process/reducer';
import processes from '../routes/processes/reducer';

export default combineReducers({
  runtime,
  workSpace,
  process,
  processes,
});
