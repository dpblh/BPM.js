/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';
import Node from '../types/NodeType';
import Edge from '../types/EdgeType';

const GraphType = new ObjectType({
  name: 'Graph',
  fields: {
    nodes: { type: new ListType(Node) },
    edges: { type: new ListType(Edge) },
  },
});

export default GraphType;
