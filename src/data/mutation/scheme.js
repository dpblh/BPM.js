/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import {
  GraphQLList as ListType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import _ from 'lodash';
import SchemeType from '../types/SchemeType';
import Scheme from '../models/Scheme';
import NodeInputType from '../types/NodeInputType';
import EdgeInputType from '../types/EdgeInputType';
import SchemeV from '../virtualizers/scheme';
import Node from '../models/Node';
import Edge from '../models/Edge';
import NodeV from '../virtualizers/node';
import EdgeV from '../virtualizers/edge';

const nodeEquals = (n1, { name, desc, position }) =>
  n1.name === name && n1.desc === desc && n1.position === position;
const edgeEquals = (n1, { source, target, roles, condition }) =>
  n1.source === source &&
  n1.target === target &&
  n1.roles === roles &&
  n1.condition === condition;
const toMap = list =>
  list.reduce((nodes, node) => ({ ...nodes, [node.id]: node }), {});

const scheme = {
  type: SchemeType,
  args: {
    id: { type: new NonNull(StringType) },
    name: { type: new NonNull(StringType) },
    desc: { type: new NonNull(StringType) },
    startNode: { type: new NonNull(StringType) },
    nodes: { type: new ListType(NodeInputType) },
    edges: { type: new ListType(EdgeInputType) },
    removed: { type: BooleanType },
  },
  async resolve(a, { id, name, desc, startNode, nodes, edges, removed }) {
    try {
      // find or create
      const { nodesOrigin, edgesOrigin } = await Scheme.findOne({ _id: id })
        // .then(s => new SchemeV(s).attrs())
        .then(async s => {
          const last = new SchemeV(s).attrs();
          await Scheme.updateFromDTO(
            { id, name, desc, startNode, removed },
            last,
          );
          return new SchemeV(s).graph().then(({ nodes, edges }) => ({
            nodesOrigin: nodes,
            edgesOrigin: edges,
          }));
        })
        .catch(async () => {
          await Scheme.createFromDTO({ id, name, desc, startNode, removed });
          return {
            nodesOrigin: [],
            edgesOrigin: [],
          };
        });

      // get last version graph
      const nodesOrigin2 = await Node.find({}).then(nodes =>
        nodes.map(edge => new NodeV(edge)),
      );
      const edgesOrigin2 = await Edge.find({}).then(edges =>
        edges.map(edge => new EdgeV(edge)),
      );
      // const { nodesOrigin, edgesOrigin } = await schema
      //   .graph()
      //   .then(({ nodes, edges }) => ({
      //     nodesOrigin: nodes,
      //     edgesOrigin: edges,
      //   }));
      // prepared hash table
      const nodesOriginMap = toMap(nodesOrigin);
      const edgesOriginMap = toMap(edgesOrigin);

      const nodesOriginMap2 = toMap(nodesOrigin2);
      const edgesOriginMap2 = toMap(edgesOrigin2);
      const nodesMap = toMap(nodes);
      const edgesMap = toMap(edges);
      // todo need transaction api
      // for delete
      const nodesForRemove = nodesOrigin.filter(node => !nodesMap[node.id]);
      const edgesForRemove = edgesOrigin.filter(node => !edgesMap[node.id]);
      await Edge.disconnectAll(edgesForRemove);
      // await Node.remove({ _id: { $in: nodesForRemove.map(a => a.id) } });
      // await Edge.remove({ _id: { $in: edgesForRemove.map(a => a.id) } });

      // remove reduced
      nodes = _.differenceBy(nodes, nodesForRemove, 'id');
      edges = _.differenceBy(edges, edgesForRemove, 'id');
      // for create
      const nodesForCreate = nodes.filter(node => !nodesOriginMap2[node.id]);
      const edgesForCreate = edges.filter(node => !edgesOriginMap2[node.id]);
      await Node.createFromDTOs(nodesForCreate);
      await Edge.createFromDTOs(edgesForCreate);

      // remove reduced
      nodes = _.differenceBy(nodes, nodesForCreate, 'id');
      edges = _.differenceBy(edges, edgesForCreate, 'id');
      // for update
      const nodesForUpdate = nodes.filter(
        node => !nodeEquals(nodesOriginMap2[node.id], node),
      );
      const edgesForUpdate = edges.filter(
        node => !edgeEquals(edgesOriginMap2[node.id], node),
      );

      await Node.updateFromDTOs(nodesForUpdate, nodesOriginMap2);
      await Edge.updateFromDTOs(edgesForUpdate, edgesOriginMap2);
    } catch (e) {
      console.log(e);
      throw e;
    }

    const schema = await Scheme.findOne({ _id: id });
    return new SchemeV(schema).attrs();
  },
};

export default scheme;
