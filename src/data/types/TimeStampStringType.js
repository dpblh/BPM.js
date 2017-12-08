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
  GraphQLScalarType as ScalarType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
  GraphQLFloat as IntType,
} from 'graphql';

// class TimeStampType extends ObjectType {
//   constructor(type) {
//     super({
//       name: type.toString(),
//       fields: {
//         timestamp: { type: new NonNull(IntType) },
//         value: { type: new NonNull(type) },
//       },
//     });
//   }
// }

const TimeStampStringType = new ObjectType({
  name: 'TimeStampString',
  fields: {
    timestamp: { type: new NonNull(IntType) },
    value: { type: new NonNull(StringType) },
  },
});

export default TimeStampStringType;
