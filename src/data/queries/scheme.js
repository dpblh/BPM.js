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
  GraphQLString as StringType,
} from 'graphql';
import SchemeType from '../types/SchemeType';
import Scheme from '../models/Scheme';
import SchemeV from '../virtualizers/scheme';

const scheme = {
  type: SchemeType,
  args: {
    id: { type: StringType },
    timestamp: { type: FloatType },
  },
  async resolve(a, { id }) {
    const schema = await Scheme.findOne({ _id: id });
    return new SchemeV(schema).attrs();
  },
};

export default scheme;
