/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLID as ID,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import GraphType from '../types/GraphType';
import Scheme from '../models/Scheme';

const SchemeType = new ObjectType({
  name: 'Scheme',
  fields: {
    id: { type: new NonNull(ID) },
    name: { type: new NonNull(StringType) },
    desc: { type: new NonNull(StringType) },
    startNode: { type: StringType }, // todo if was updated at least one node | edge. Need to update startNode timestamp
    removed: { type: BooleanType },
    graph: {
      type: GraphType,
      async resolve({ id }, _, a, { variableValues: { timestamp } }) {
        const schema = await Scheme.findOne({ _id: id });
        return schema.graph(timestamp);
      },
    },
  },
});

export default SchemeType;
