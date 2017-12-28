/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { GraphQLList as ListType } from 'graphql';
import SchemeType from '../types/SchemeType';
import Scheme from '../models/Scheme';
import SchemeV from '../virtualizers/scheme';

const scheme = {
  type: new ListType(SchemeType),
  async resolve({ request }) {
    const schema = await Scheme.find({ removed: { $ne: true } });
    return schema.map(a => new SchemeV(a).attrs());
  },
};

export default scheme;
