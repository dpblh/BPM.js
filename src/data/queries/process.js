/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import _ from 'lodash';
import ProcessType from '../types/ProcessType';
import Process from '../models/Process';
import Node from '../models/Node';

const process = {
  type: ProcessType,
  args: {
    id: { type: new NonNull(StringType) },
  },
  async resolve(a, { id }) {
    return Process.findById(id).then(p =>
      Node.find({})
        .then(nodes =>
          nodes
            .map(n => n.attrs(p.timestamp))
            .reduce((r, e) => ({ ...r, [e.id]: e }), {}),
        )
        .then(nodeMap => ({
          id: p.id,
          scheme: p.scheme,
          status: p.status,
          context: _.keys(p.context).map(key => ({
            id: key,
            parentContextId: p.context[key].parentContextId,
            stack: p.context[key].stack.map(s => ({
              id: s.edgeId,
              name: (nodeMap[s.nodeId] && nodeMap[s.nodeId].name) || 'Start',
              desc:
                (nodeMap[s.nodeId] && nodeMap[s.nodeId].desc) ||
                'Start process',
              start_t: s.start_t,
              finish_t: s.finish_t,
              variables: JSON.stringify(s.state),
            })),
          })),
        })),
    );
  },
};

export default process;
