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
import TimeStampStringType from './TimeStampStringType';

const EdgeType = new ObjectType({
  name: 'Edge',
  fields: {
    id: { type: new NonNull(ID) },
    source: { type: new NonNull(StringType) },
    target: { type: new NonNull(StringType) },
    roles: { type: StringType },
    condition: { type: StringType },
  },
});

export default EdgeType;
