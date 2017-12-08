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
});

// SchemeScheme.methods.id = function() {
//   return this._id
// } ;

SchemeScheme.methods = {
  // _name(timestamp = Date.now()) {
  //   return this.name.reverse().find(src => src.timestamp < timestamp);
  // },
  // _desc(timestamp = Date.now()) {
  //   return this.desc.reverse().find(src => src.timestamp < timestamp);
  // },
  // _startNode(timestamp = Date.now()) {
  //   return this.startNode.reverse().find(src => src.timestamp < timestamp);
  // },
  async graph(timestamp) {
    const startNode = new SchemeV(this).getV('startNode', timestamp);

    // console.log(startNode)

    const nodes = await Node.find({}).then(nodes =>
      nodes
        .map(edge => new NodeV(edge))
        .reduce((nodes, node) => ({ ...nodes, [node.id]: node }), {}),
    );
    const edges = await Edge.find({}).then(edges =>
      edges
        .map(edge => new EdgeV(edge))
        .reduce((edges, edge) => ({ ...edges, [edge.id]: edge }), {}),
    );
    const readedNode = {};
    let readedEdge = {};
    const findSrc = node => {
      if (readedNode[node.id]) {
        return;
      }
      // console.log(edges)
      const edges2 = _.values(
        _.pickBy(edges, (edge, id) =>
          edge.equalsV('source', node.id, timestamp),
        ),
      );

      // console.log(edges2)
      readedNode[node.id] = node;
      readedEdge = edges2.reduce(
        (edges, edge) => ({ ...edges, [edge.id]: edge }),
        readedEdge,
      );
      edges2
        .map(edge => nodes[edge.getV('target', timestamp)])
        .forEach(findSrc);
    };
    findSrc(nodes[startNode]);
    return {
      nodes: _.values(readedNode).map(a => a.attrs(timestamp)),
      edges: _.values(readedEdge).map(a => a.attrs(timestamp)),
    };
  },
};

export default SchemeScheme;
