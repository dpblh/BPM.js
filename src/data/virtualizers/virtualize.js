import _ from 'lodash';

export default class Virtualize {
  constructor(props) {
    _.extend(this, props);
    this.props = props;
  }
  getV(property, timestamp = Date.now()) {
    const s = _.findLast(this[property], src => src.timestamp < timestamp);
    return s && s.value;
  }
  equalsV(property, value, timestamp = Date.now()) {
    console.log(property);
    return _.isEqual(this.getV(property, timestamp), value);
  }
}
