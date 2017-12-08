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
  GraphQLInputObjectType as InputObjectType,
  GraphQLString as StringType,
} from 'graphql';

const NodeInputType = new InputObjectType({
  name: 'NodeInput',
  fields: {
    id: { type: StringType },
    name: { type: StringType },
    desc: { type: StringType },
    scheme: { type: StringType },
    position: {
      type: new InputObjectType({
        name: 'PositionInput',
        fields: {
          x: { type: FloatType },
          y: { type: FloatType },
        },
      }),
    },
  },
});

export default NodeInputType;
