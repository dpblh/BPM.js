import Virtualize from './virtualize';
import {
  expression as condition,
  script as roles,
} from '../services/process/ParserRoles';
import {
  ParseConditionError,
  ParseRolesError,
} from '../services/process/Errors';

export default class Edge extends Virtualize {
  attrs(timestamp = Date.now()) {
    return {
      id: this.id,
      source: this.getV('source', timestamp),
      target: this.getV('target', timestamp),
      roles: this.getV('roles', timestamp),
      condition: this.getV('condition', timestamp),
      immediate: this.getV('immediate', timestamp),
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
  }
}
