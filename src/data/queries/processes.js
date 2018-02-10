/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import {
  GraphQLInt as IntType,
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';
import ProcessType from '../types/ProcessType';
import Process from '../models/Process';

const processes = {
  type: new ListType(ProcessType),
  args: {
    query: { type: StringType },
    skip: { type: IntType },
    limit: { type: IntType },
  },
  async resolve(a, { query, skip = 0, limit = 10 }) {
    const ps = await Process.find({})
      .skip(skip)
      .limit(limit)
      .sort({
        timestamp: -1,
      });
    return ps;
  },
};

export default processes;
