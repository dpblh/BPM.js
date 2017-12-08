import mongoose from './mongoose';
import TimeStampScheme from './TimeStampScheme';

const EdgeScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  source: { type: [new TimeStampScheme(String)] },
  target: { type: [new TimeStampScheme(String)] },
  roles: { type: [new TimeStampScheme(String)] },
  condition: { type: [new TimeStampScheme(String)] },
});

EdgeScheme.statics.createFromDTOs = function(edges) {
  return this.create(
    edges.map(({ id, source, target, roles, condition }) => ({
      _id: id,
      source: [{ timestamp: Date.now(), value: source }],
      target: [{ timestamp: Date.now(), value: target }],
      roles: [{ timestamp: Date.now(), value: roles }],
      condition: [{ timestamp: Date.now(), value: condition }],
    })),
  );
};

EdgeScheme.statics.updateFromDTO = function(n1, last) {
  const { id, source, target, roles, condition } = n1;
  const update = { $push: {} };
  const query = { _id: id };

  if (last.source !== source)
    update.$push.source = { timestamp: Date.now(), value: source };
  if (last.target !== target)
    update.$push.target = { timestamp: Date.now(), value: target };
  if (last.roles !== roles)
    update.$push.roles = { timestamp: Date.now(), value: roles };
  if (last.roles !== roles)
    update.$push.condition = { timestamp: Date.now(), value: condition };

  return this.update(query, update);
};

EdgeScheme.statics.updateFromDTOs = function(nodes, originMap) {
  return Promise.all(nodes.map(n1 => this.updateFromDTO(n1, originMap[n1.id])));
};

// EdgeScheme.methods = {
//   _source(timestamp = Date.now()) {
//     return this.source.reverse().find(src => src.timestamp < timestamp);
//   },
//   _target(timestamp = Date.now()) {
//     return this.target.reverse().find(src => src.timestamp < timestamp);
//   },
//   _roles(timestamp = Date.now()) {
//     return this.roles.reverse().find(src => src.timestamp < timestamp);
//   },
//   _condition(timestamp = Date.now()) {
//     return this.condition.reverse().find(src => src.timestamp < timestamp);
//   },
// };

export default EdgeScheme;
