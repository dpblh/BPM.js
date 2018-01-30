import mongoose from './mongoose';

const Stack = new mongoose.Schema(
  {
    edgeId: { type: String, required: true },
    state: { type: Object },
  },
  { _id: false },
);

const ProcessScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  scheme: { type: String, required: true },
  context: { type: Object, default: { main: { stack: [] } } },
  eventLoop: { type: Object, default: [] },
  eventAwaitLoop: { type: Object, default: [] },
  eventJoinLoop: { type: Object, default: [] },
  globalState: { type: Object, default: {} },
});

export default ProcessScheme;
