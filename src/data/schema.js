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
  GraphQLSchema as Schema,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import historyOfScheme from './queries/historyOfScheme';
import scheme from './queries/scheme';
import schemes from './queries/schemes';
import process from './queries/process';
import processes from './queries/processes';
import schemeM from './mutation/scheme';
import resumeScheme from './mutation/resumeScheme';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      news,
      scheme,
      schemes,
      historyOfScheme,
      process,
      processes,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      resumeScheme,
      scheme: schemeM,
    },
  }),
});

export default schema;
