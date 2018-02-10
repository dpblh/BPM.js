/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Process from './Container';
import Layout from '../../components/Layout';
import { loadedProcess } from './actions';
import api from './api';

async function action({ fetch, store, params: { id } }) {
  const graphql = api(fetch);

  // todo thinking about
  await store.dispatch(async dispatch => {
    const process = await graphql.loadProcess(id);
    dispatch(loadedProcess(process));
  });

  return {
    chunks: ['process'],
    title: 'React Starter Kit',
    component: (
      <Layout>
        <Process />
      </Layout>
    ),
  };
}

export default action;
