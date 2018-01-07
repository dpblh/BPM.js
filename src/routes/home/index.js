/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Container';
import Layout from '../../components/Layout';
import { loadedSchemes } from './actions';
import api from './api';

async function action({ fetch, store }) {
  const graphql = api(fetch);

  //todo thinking about
  await store.dispatch(async dispatch => {
    const schemes = await graphql.loadSchemes();
    dispatch(loadedSchemes(schemes));
  });

  return {
    chunks: ['home'],
    title: 'React Starter Kit',
    component: (
      <Layout>
        <Home {...{ ...graphql }} />
      </Layout>
    ),
  };
}

export default action;
