import mongoose from './mongoose';
import TimeStampScheme from './TimeStampScheme';
import { last } from './Utils';

import {
  expression as condition,
  script as roles,
} from '../services/process/ParserRoles';
import {
  ParseConditionError,
  ParseRolesError,
} from '../services/process/Errors';

const EdgeScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  source: { type: [new TimeStampScheme(String)] },
  target: { type: [new TimeStampScheme(String)] },
  roles: { type: [new TimeStampScheme(String)] },
  condition: { type: [new TimeStampScheme(String)] },
  immediate: { type: [new TimeStampScheme(Boolean)] },
});

EdgeScheme.methods.attrs = function(timestamp = Date.now()) {
  return {
    id: this.id,
    source: last(this.source, timestamp),
    target: last(this.target, timestamp),
    roles: last(this.roles, timestamp),
    condition: last(this.condition, timestamp),
    immediate: last(this.immediate, timestamp),
    conditionEval(stack) {
      if (!this.condition) {
        return true;
      }
      if (!this.eval) {
        const parsed = condition.apply(this.condition);
        if (parsed && parsed.pos === this.condition.length) {
          this.eval = parsed.res.eval;
        } else {
          throw new ParseConditionError(
            `parse condition in position "${`${this.condition.substr(
              0,
              parsed.pos,
            )}ˇ${this.condition.substr(parsed.pos)}`}"`,
          );
        }
      }
      return this.eval(stack);
    },
    rolesEval(stack) {
      if (!this.roles) {
        return undefined;
      }
      if (!this.eval2) {
        const parsed = roles.apply(this.roles);
        if (parsed && parsed.pos === this.roles.length) {
          this.eval2 = parsed.res.eval;
        } else {
          throw new ParseRolesError(
            `parse roles in position "${`${this.roles.substr(
              0,
              parsed.pos,
            )}ˇ${this.roles.substr(parsed.pos)}`}"`,
          );
        }
      }
      return this.eval2(stack);
    },
  };
};

EdgeScheme.statics.createFromDTOs = function(edges) {
  return this.create(
    edges.map(({ id, source, target, roles, condition, immediate }) => ({
      _id: id,
      source: [{ timestamp: Date.now(), value: source }],
      target: [{ timestamp: Date.now(), value: target }],
      roles: [{ timestamp: Date.now(), value: roles }],
      condition: [{ timestamp: Date.now(), value: condition }],
      immediate: [{ timestamp: Date.now(), value: immediate }],
    })),
  );
};

EdgeScheme.statics.updateFromDTO = function(n1, last) {
  const { id, source, target, roles, condition, immediate } = n1;
  const update = { $push: {} };
  const query = { _id: id };

  if (last.source !== source)
    update.$push.source = { timestamp: Date.now(), value: source };
  if (last.target !== target)
    update.$push.target = { timestamp: Date.now(), value: target };
  if (last.roles !== roles)
    update.$push.roles = { timestamp: Date.now(), value: roles };
  if (last.condition !== condition)
    update.$push.condition = { timestamp: Date.now(), value: condition };
  if (last.immediate !== immediate)
    update.$push.immediate = { timestamp: Date.now(), value: immediate };

  return this.update(query, update);
};

EdgeScheme.statics.updateFromDTOs = function(nodes, originMap) {
  return Promise.all(nodes.map(n1 => this.updateFromDTO(n1, originMap[n1.id])));
};

EdgeScheme.statics.disconnect = function({ id }) {
  return this.update(
    { _id: id },
    {
      $push: {
        source: { timestamp: Date.now(), value: null },
        target: { timestamp: Date.now(), value: null },
      },
    },
  );
};

EdgeScheme.statics.disconnectAll = function(edges) {
  return Promise.all(edges.map(n1 => this.disconnect(n1)));
};

export default EdgeScheme;
