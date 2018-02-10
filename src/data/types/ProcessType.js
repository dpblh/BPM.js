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
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType,
  GraphQLList as ListType,
} from 'graphql';

const ProcessType = new ObjectType({
  name: 'Process',
  fields: {
    id: { type: new NonNull(ID) },
    scheme: { type: new NonNull(StringType) },
    status: { type: new NonNull(StringType) },
    context: {
      type: new ListType(
        new ObjectType({
          name: 'Context',
          fields: {
            id: { type: new NonNull(ID) },
            parentContextId: { type: ID },
            stack: {
              type: new ListType(
                new ObjectType({
                  name: 'Stack',
                  fields: {
                    id: { type: new NonNull(ID) },
                    name: { type: new NonNull(StringType) },
                    desc: { type: new NonNull(StringType) },
                    start_t: { type: new NonNull(FloatType) },
                    finish_t: { type: FloatType },
                    variables: { type: new NonNull(StringType) },
                  },
                }),
              ),
            },
          },
        }),
      ),
    },
    condition: { type: StringType },
    immediate: { type: BooleanType },
  },
});

export default ProcessType;
