import mongoose from './mongoose';

const ProcessScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  scheme: { type: String, required: true },
  context: { type: Object, default: { main: { stack: [] } } },
  eventLoop: { type: Object, default: [] },
  eventAwaitLoop: { type: Object, default: [] },
  tehState: { type: Object, default: {} },
  status: { type: String, default: 'running' },
  error: { type: String },
});

export default ProcessScheme;
