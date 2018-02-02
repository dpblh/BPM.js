import _ from 'lodash';

export const last = (list, timestamp = Date.now()) => {
  const s = _.findLast(list, src => src.timestamp < timestamp);
  return s && s.value;
};

export default last;
