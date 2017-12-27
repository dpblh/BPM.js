/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';
import Scheme from '../../data/virtualizers/scheme';
import Node from '../../data/virtualizers/node';
import Edge from '../../data/virtualizers/edge';

async function action({ fetch }) {
  const loadHistory = async id => {
    const resp = await fetch('/graphql', {
      body: JSON.stringify({
        query: `query($id: String!) {
          historyOfScheme(id: $id){
            id,
            name { value, timestamp },
            desc { value, timestamp },
            startNode { value, timestamp },
          }
        }`,
        variables: {
          id,
        },
      }),
    });
    const { data } = await resp.json();
    if (!data || !data.historyOfScheme)
      throw new Error('Failed to load the news feed.');
    return data.historyOfScheme;
  };

  const loadGraph = async (id, timestamp) => {
    const resp = await fetch('/graphql', {
      body: JSON.stringify({
        query: `query($id: String!, $timestamp: Float!) {
          scheme(id: $id, timestamp: $timestamp){
            id,
            name,
            desc,
            startNode,
            graph{
              edges{
                id,
                source,
                target,
                roles,
                condition
              },
              nodes{
                id,
                name,
                desc,
                position{x,y},
                scheme
              }
            }
          }
        }`,
        variables: {
          id,
          timestamp,
        },
      }),
    });
    const { data } = await resp.json();
    if (!data || !data.scheme) throw new Error('Failed to load the news feed.');
    return data.scheme;
  };

  const saveGraph = async ({ id, name, desc, startNode, nodes, edges }) => {
    const resp = await fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation($id: String!, $name: String!, $desc: String!, $startNode: String!, $nodes: [NodeInput], $edges: [EdgeInput]) {
          scheme(id: $id, name: $name, desc: $desc, startNode: $startNode, nodes: $nodes, edges: $edges) {
            id,
            name,
            desc,
            startNode,
            graph{
              edges{
                id,
                source,
                target,
                roles,
                condition
              },
              nodes{
                id,
                name,
                desc,
                position{x,y},
                scheme
              }
            }
          }
        }`,
        variables: { id, name, desc, startNode, nodes, edges },
      }),
    });
    const { data } = await resp.json();
    if (!data || !data.scheme) throw new Error('Failed to load the news feed.');
    return data.scheme;
  };

  const loadSchemes = async () => {
    const resp = await fetch('/graphql', {
      body: JSON.stringify({
        query: `{
      schemes{
        id,
        name,
        desc,
        startNode
      }
    }`,
      }),
    });
    const { data } = await resp.json();
    if (!data || !data.schemes)
      throw new Error('Failed to load the news feed.');
    return data.schemes;
  };

  const schemes = await loadSchemes();

  return {
    chunks: ['home'],
    title: 'React Starter Kit',
    component: (
      <Layout>
        <Home
          {...{ loadSchemes, loadGraph, loadHistory, saveGraph, schemes }}
        />
      </Layout>
    ),
  };
}

export default action;
