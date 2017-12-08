import Virtualize from './virtualize';

export default class Edge extends Virtualize {
  attrs(timestamp = Date.now()) {
    return {
      id: this.id,
      source: this.getV('source', timestamp),
      target: this.getV('target', timestamp),
      roles: this.getV('roles', timestamp),
      condition: this.getV('condition', timestamp),
    };
  }
}
