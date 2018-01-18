import mongoose from './mongoose';
import TimeStampScheme from './TimeStampScheme';

import Node from '../models/Node';
import Edge from '../models/Edge';

import EdgeV from '../virtualizers/edge';
import NodeV from '../virtualizers/node';
import SchemeV from '../virtualizers/scheme';

import _ from 'lodash';

const SchemeScheme = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: [new TimeStampScheme(String)] },
  desc: { type: [new TimeStampScheme(String)] },
  startNode: { type: [new TimeStampScheme(String)] },
  removed: { type: Boolean, default: false }, // todo make it as removed. in the future I must implement collector
});

// SchemeScheme.methods.id = function() {
//   return this._id
// } ;
SchemeScheme.statics.createFromDTO = function(scheme) {
  console.log('create');
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
  console.log('update');
  const { id, name, desc, startNode, removed } = current;
  console.log(id, name, desc, startNode);
  console.log(last);
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
  const startNode = new SchemeV(scheme).getV('startNode', timestamp);
  if (!startNode)
    return {
      nodes: [],
      edges: [],
    };

  const nodeMap = nodes
    .map(edge => new NodeV(edge))
    .reduce((nodes, node) => ({ ...nodes, [node.id]: node }), {});
  const edgeMap = edges
    .map(edge => new EdgeV(edge))
    .reduce((edges, edge) => ({ ...edges, [edge.id]: edge }), {});

  const readedNode = {};
  let readedEdge = {};
  const findSrc = node => {
    if (readedNode[node.id]) {
      return;
    }
    const edges2 = _.values(
      _.pickBy(edgeMap, (edge, id) =>
        edge.equalsV('source', node.id, timestamp),
      ),
    );

    readedNode[node.id] = node;
    readedEdge = edges2.reduce(
      (edges, edge) => ({ ...edges, [edge.id]: edge }),
      readedEdge,
    );
    edges2
      .map(edge => nodeMap[edge.getV('target', timestamp)])
      .forEach(findSrc);
  };
  findSrc(nodeMap[startNode]);
  return {
    nodes: _.values(readedNode).map(a => a.attrs(timestamp)),
    edges: _.values(readedEdge).map(a => a.attrs(timestamp)),
  };
};

SchemeScheme.methods = {
  async graph(timestamp = Date.now()) {
    const nodes = await Node.find({});
    const edges = await Edge.find({});

    return SchemeScheme.statics.graph(timestamp, this, nodes, edges);
  },
};

export default SchemeScheme;
