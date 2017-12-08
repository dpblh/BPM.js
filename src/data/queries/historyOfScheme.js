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
  GraphQLFloat as FloatType,
  GraphQLList as ListType,
} from 'graphql';
import HistoryOfSchemeType from '../types/HistoryOfSchemeType';
import Scheme from '../models/Scheme';

const historyOfScheme = {
  type: HistoryOfSchemeType,
  args: {
    id: { type: StringType },
    timestamp: { type: FloatType },
  },
  async resolve(a, { id }) {
    return Scheme.findOne({ _id: id });
  },
};

export default historyOfScheme;
