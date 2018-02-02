import _ from 'lodash';

import mongoose from './mongoose';
import TimeStampScheme from './TimeStampScheme';

import Node from '../models/Node';
import Edge from '../models/Edge';

import { last } from './Utils';

const SchemeScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: [new TimeStampScheme(String)] },
  desc: { type: [new TimeStampScheme(String)] },
  startNode: { type: [new TimeStampScheme(String)] },
  removed: { type: Boolean, default: false }, // todo make it as removed. in the future I must implement collector
});

SchemeScheme.methods = {
  async graph(timestamp = Date.now()) {
    const nodes = await Node.find({});
    const edges = await Edge.find({});

    return SchemeScheme.statics.graph(timestamp, this, nodes, edges);
  },
  attrs(timestamp = Date.now()) {
    return {
      id: this.id,
      removed: this.removed,
      name: last(this.name, timestamp) || '',
      desc: last(this.desc, timestamp) || '',
      startNode: last(this.startNode, timestamp) || '',
    };
  },
};

SchemeScheme.statics.createFromDTO = function(scheme) {
  const { id, name, desc, startNode, removed } = scheme;
  return this.create({
    _id: id,
    name: [{ timestamp: Date.now(), value: name }],
    desc: [{ timestamp: Date.now(), value: desc }],
    startNode: [{ timestamp: Date.now(), value: startNode }],
    removed,
    scheme,
  });
};

SchemeScheme.statics.updateFromDTO = function(current, last) {
  const { id, name, desc, startNode, removed } = current;
  const update = { $push: {} };
  const query = { _id: id };

  if (last.name !== name)
    update.$push.name = { timestamp: Date.now(), value: name };
  if (last.desc !== desc)
    update.$push.desc = { timestamp: Date.now(), value: desc };
  if (last.removed !== removed) update.removed = removed;
  // it need to update
  update.$push.startNode = { timestamp: Date.now(), value: startNode };

  return this.update(query, update);
};

SchemeScheme.statics.graph = async function(
  timestamp = Date.now(),
  scheme,
  nodes,
  edges,
) {
  const { startNode } = scheme.attrs(timestamp);
  if (!startNode)
    return {
      nodes: [],
      edges: [],
    };

  const nodeMap = nodes
    .map(node => node.attrs(timestamp))
    .reduce((nodes, node) => ({ ...nodes, [node.id]: node }), {});
  const edgeMap = edges
    .map(edge => edge.attrs(timestamp))
    .reduce((edges, edge) => ({ ...edges, [edge.id]: edge }), {});

  const readedNode = {};
  let readedEdge = {};
  const findSrc = node => {
    if (readedNode[node.id]) {
      return;
    }
    const edges2 = _.values(
      _.pickBy(edgeMap, (edge, id) => edge.source === node.id),
    );

    readedNode[node.id] = node;
    readedEdge = edges2.reduce(
      (edges, edge) => ({ ...edges, [edge.id]: edge }),
      readedEdge,
    );
    edges2.map(edge => nodeMap[edge.target]).forEach(findSrc);
  };
  findSrc(nodeMap[startNode]);
  return {
    nodes: _.values(readedNode),
    edges: _.values(readedEdge),
  };
};

export default SchemeScheme;
