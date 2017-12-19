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
  state = {
    scheme: {},
    originScheme: {},
  };
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

    $('.drag-me').dragged((event, drag) => {
      const id = drag.attr('id');
      const scheme = this.props.schemes.find(s => s.id === id);
      const { sx, sy } = paper.scale();
      const { tx, ty } = paper.translate();
      const newState = true;

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
        newState,
        graph,
      });
    });
  }

  saveSheme = () => {
    const links = this.graph.getLinks();
    const elements = this.graph.getElements();

    const { name, desc } = this.state.scheme;
    const { id } = this.state.originScheme;

    const updatedNodes = elements.map(el => ({
      id: el.id,
      name: el.attr('data/name') || null,
      desc: el.attr('data/desc') || null,
      scheme: el.attr('data/scheme'),
      position: el.position(),
    }));

    const startNode = elements.find(el => el.attr('data/startNode') === true)
      .id;

    const updatedEdge = links.map(el => ({
      id: el.id,
      source: el.getSourceElement().id,
      target: el.getTargetElement().id,
      condition: el.attr('data/condition') || null,
      roles: el.attr('data/roles') || null,
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

  openScheme = async schemeNone => {
    if (schemeNone.startNode.length) {
      const graph = this.graph;
      const { loadGraph } = this.props;

      const state = joint.shapes.tm.MyStateFactory;
      const link = joint.shapes.tm.MyLinkFactory;

      graph.clear();
      const originScheme = await loadGraph(schemeNone.id);

      const {
        graph: { nodes, edges },
        startNode,
        name,
        desc,
        id,
      } = originScheme;
      const scheme = { name, desc, id };
      // const startState = nodes.find(a => a.id === startNode);
      // const otherState = nodes.filter(a => a.id !== startNode);

      // start({ data: startState, graph });
      // otherState.forEach(data => state({ data, graph }));
      nodes.forEach(data =>
        state({ data: { ...data, startNode: data.id === startNode }, graph }),
      );
      edges.forEach(data =>
        link({
          data,
          graph,
        }),
      );

      this.setState({
        originScheme,
        scheme,
      });
    }
  };

  changeScheme = scheme => {
    this.setState({ scheme });
  };

  openSchemeDesc = () => {
    this.setState({
      tab: 4,
    });
  };

  render() {
    const { openScheme, saveSheme, changeScheme, openSchemeDesc } = this;
    const { schemes } = this.props;
    const {
      originScheme,
      scheme,
      scheme: { name, desc },
      node,
      link,
      tab,
    } = this.state;

    const nameClass = cx({
      [s.name]: true,
      [s.nameWasChanged]: originScheme.name !== name,
    });

    const descClass = cx({
      [s.desc]: true,
      [s.descWasChanged]: originScheme.desc !== desc,
    });

    return (
      <div className={s.root}>
        <ControlPanel
          {...{
            schemes,
            scheme,
            node,
            link,
            tab,
            handler: {
              openScheme,
              saveSheme,
              changeScheme,
            },
          }}
        />
        <div className={s.descCont} onClick={openSchemeDesc}>
          <div className={nameClass}>{name}</div>
          <div className={descClass}>{desc}</div>
        </div>
        <div
          className={cx(s.container, 'can-dropped')}
          ref={container => (this.container = container)}
        />
      </div>
    );
  }
}

export default withStyles(s, dragDropCss, jointjsCss, shapesCss)(Home);
