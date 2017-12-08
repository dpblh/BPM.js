import Virtualize from './virtualize';

export default class Node extends Virtualize {
  attrs(timestamp = Date.now()) {
    return {
      id: this.id,
      name: this.getV('name', timestamp),
      desc: this.getV('desc', timestamp),
      position: this.getV('position', timestamp),
      scheme: this.scheme,
    };
  }
}
