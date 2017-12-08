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
  GraphQLInputObjectType as InputObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLList as ListType,
} from 'graphql';

const NodeInputType = new InputObjectType({
  name: 'EdgeInput',
  fields: {
    id: { type: StringType },
    source: { type: StringType },
    target: { type: StringType },
    roles: { type: StringType },
    condition: { type: StringType },
  },
});

export default NodeInputType;
