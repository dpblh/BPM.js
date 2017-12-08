/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLFloat as FloatType,
  GraphQLID as ID,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const NodeType = new ObjectType({
  name: 'Node',
  fields: {
    id: { type: new NonNull(ID) },
    name: {
      type: new NonNull(StringType),
    },
    desc: { type: new NonNull(StringType) },
    position: {
      type: new NonNull(
        new ObjectType({
          name: 'Position',
          fields: {
            x: { type: FloatType },
            y: { type: FloatType },
          },
        }),
      ),
    },
    scheme: { type: new NonNull(ID) },
  },
});

export default NodeType;
