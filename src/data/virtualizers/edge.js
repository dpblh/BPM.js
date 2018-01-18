import Virtualize from './virtualize';
import { expression as condition } from '../services/process/ParserRoles';

export default class Edge extends Virtualize {
  attrs(timestamp = Date.now()) {
    return {
      id: this.id,
      source: this.getV('source', timestamp),
      target: this.getV('target', timestamp),
      roles: this.getV('roles', timestamp),
      condition: this.getV('condition', timestamp),
      conditionEval(stack) {
        if (!this.eval) {
          this.eval = condition.apply(this.condition || 'true').res.eval;
        }
        return this.eval(stack);
      },
    };
  }
}
