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
  // currentNode: { type: String },//todo only first
  stack: { type: [Stack], default: [] },
});

export default ProcessScheme;
