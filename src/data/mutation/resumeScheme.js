/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLList as ListType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import Manager from '../services/process/Manager';

const resumeScheme = {
  type: BooleanType,
  args: {
    id: { type: new NonNull(StringType) },
    status: { type: new NonNull(StringType) },
  },
  async resolve(a, { id, status }) {
    try {
      await Manager.resume(id, status);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export default resumeScheme;
