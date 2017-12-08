import Virtualize from './virtualize';

export default class Scheme extends Virtualize {
  attrs(timestamp = Date.now()) {
    return {
      id: this.id,
      name: this.getV('name', timestamp),
      desc: this.getV('desc', timestamp),
      startNode: this.getV('startNode', timestamp),
    };
  }
}
