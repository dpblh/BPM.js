/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ControlPanel from '../../components/ControlPanel';
import dragDropCss from './component/dragDrop/dragDrop.css';
import jointjsCss from './component/jointjs/jointjs.css';
import joint from './component/jointjs';
import shapesCss from './component/jointjs/shapes.css';

import $ from './component/jquery';
import s from './Home.css';

class Home extends React.Component {
  state = {};
  componentDidMount() {
    const paper = joint.shapes.tm.MyPaperFactory({
      el: $(this.container),
    });
    const graph = (this.graph = paper.model);
    const state = joint.shapes.tm.MyStateFactory;
    const link = joint.shapes.tm.MyLinkFactory;

    paper.on('link:remove', linkView => {
      linkView.model.remove();
    });

    paper.on('link:options', linkView => {
      this.setState({
        link: linkView.model,
        tab: 3,
      });
    });

    paper.on('node:options', linkView => {
      this.setState({
        node: linkView.model,
        tab: 2,
      });
    });

    const start = new joint.shapes.fsa.StartState({
      position: { x: 50, y: 530 },
    });
    graph.addCell(start);

    const code = state({
      data: { position: { x: 180, y: 390 }, name: 'code' },
      graph,
    });
    const slash = state({
      data: { position: { x: 340, y: 220 }, name: 'slash' },
      graph,
    });
    const star = state({
      data: { position: { x: 600, y: 400 }, name: 'star' },
      graph,
    });
    const line = state({
      data: { position: { x: 190, y: 100 }, name: 'line' },
      graph,
    });
    const block = state({
      data: { position: { x: 560, y: 140 }, name: 'block' },
      graph,
    });

    link({ data: { source: start.id, target: code.id, name: 'start' }, graph });
    link({ data: { source: code.id, target: slash.id, name: '/' }, graph });
    link({ data: { source: slash.id, target: code.id, name: 'other' }, graph });
    link({ data: { source: slash.id, target: line.id, name: '/' }, graph });
    link({
      data: { source: line.id, target: code.id, name: 'new\n line' },
      graph,
    });
    link({ data: { source: slash.id, target: block.id, name: '*' }, graph });
    link({ data: { source: block.id, target: star.id, name: '*' }, graph });
    link({ data: { source: star.id, target: block.id, name: 'other' }, graph });
    link({ data: { source: star.id, target: code.id, name: '/' }, graph });
    link({ data: { source: line.id, target: line.id, name: 'other' }, graph });
    link({
      data: { source: block.id, target: block.id, name: 'other' },
      graph,
    });
    link({ data: { source: code.id, target: code.id, name: 'other' }, graph });

    $('.drag-me').dragged((event, drag) => {
      const id = drag.attr('id');
      const scheme = this.props.schemes.find(s => s.id === id);
      const { sx, sy } = paper.scale();
      const { tx, ty } = paper.translate();

      state({
        data: {
          position: {
            x: (event.clientX - tx) / sx - 50,
            y: (event.clientY - ty) / sy - 50,
          },
          name: scheme.name,
          desc: scheme.desc,
          scheme: scheme.id,
        },
        graph,
      });
    });
  }

  saveSheme = () => {
    const links = this.graph.getLinks();
    const elements = this.graph.getElements();

    const { id, name, desc, startNode } = this.scheme;

    const updatedNodes = elements.map(el => ({
      id: el.id,
      name: el.attr('data/name'),
      desc: el.attr('data/desc'),
      scheme: el.attr('data/scheme'),
      position: el.position(),
    }));

    const updatedEdge = links.map(el => ({
      id: el.id,
      source: el.getSourceElement().id,
      target: el.getTargetElement().id,
      condition: el.attr('data/condition'),
      roles: el.attr('data/roles'),
    }));

    this.props.saveGraph({
      id,
      name,
      desc,
      startNode,
      edges: updatedEdge,
      nodes: updatedNodes,
    });
  };

  openScheme = async scheme => {
    if (scheme.startNode.length) {
      const graph = this.graph;
      const state = joint.shapes.tm.MyStateFactory;
      const start = joint.shapes.tm.MyStartStateFactory;
      const link = joint.shapes.tm.MyLinkFactory;

      this.graph.clear();
      this.scheme = await this.props.loadGraph(scheme.id);

      const { graph: { nodes, edges }, startNode } = this.scheme;
      const startState = nodes.find(a => a.id === startNode);
      const otherState = nodes.filter(a => a.id !== startNode);

      start({ data: startState, graph });
      otherState.forEach(data => state({ data, graph }));
      edges.forEach(data =>
        link({
          data,
          graph,
        }),
      );
    }
  };

  render() {
    return (
      <div className={s.root}>
        <ControlPanel
          node={this.state.node}
          link={this.state.link}
          tab={this.state.tab}
          schemes={this.props.schemes}
          handler={{
            openScheme: this.openScheme,
            saveSheme: this.saveSheme,
          }}
        />
        <div
          className={cx(s.container, 'can-dropped')}
          ref={container => (this.container = container)}
        />
      </div>
    );
  }
}

export default withStyles(s, dragDropCss, jointjsCss, shapesCss)(Home);
