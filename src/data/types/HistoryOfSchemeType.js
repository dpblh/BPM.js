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
  GraphQLList as ListType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import TimeStampStringType from './TimeStampStringType';

const HistorySchemeType = new ObjectType({
  name: 'HistoryScheme',
  fields: {
    id: { type: new NonNull(ID) },
    name: { type: new ListType(TimeStampStringType) },
    desc: { type: new ListType(TimeStampStringType) },
    startNode: { type: new ListType(TimeStampStringType) }, // todo if was updated at least one node | edge. Need to update startNode timestamp
  },
});

export default HistorySchemeType;
