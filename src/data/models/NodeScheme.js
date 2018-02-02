import mongoose from './mongoose';
import TimeStampScheme from './TimeStampScheme';
import { last } from './Utils';

const PositionScheme = new mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false },
);

const NodeScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: [new TimeStampScheme(String)] },
  desc: { type: [new TimeStampScheme(String)] },
  position: { type: [new TimeStampScheme(PositionScheme)] },
  scheme: { type: String },
});

NodeScheme.methods.attrs = function(timestamp = Date.now()) {
  return {
    id: this.id,
    name: last(this.name, timestamp),
    desc: last(this.desc, timestamp),
    position: last(this.position, timestamp),
    scheme: this.scheme,
  };
};

NodeScheme.statics.createFromDTOs = function(nodes) {
  return this.create(
    nodes.map(({ id, name, desc, scheme, position }) => ({
      _id: id,
      name: [{ timestamp: Date.now(), value: name }],
      desc: [{ timestamp: Date.now(), value: desc }],
      position: [{ timestamp: Date.now(), value: position }],
      scheme,
    })),
  );
};

NodeScheme.statics.updateFromDTO = function(current, last) {
  const { id, name, desc, position } = current;
  const update = { $push: {} };
  const query = { _id: id };

  if (last.name !== name)
    update.$push.name = { timestamp: Date.now(), value: name };
  if (last.desc !== desc)
    update.$push.desc = { timestamp: Date.now(), value: desc };
  if (last.position.x !== position.x || last.position.y !== position.y)
    update.$push.position = { timestamp: Date.now(), value: position };

  return this.update(query, update);
};

NodeScheme.statics.updateFromDTOs = function(nodes, originMap) {
  return Promise.all(nodes.map(n1 => this.updateFromDTO(n1, originMap[n1.id])));
};

export default NodeScheme;
