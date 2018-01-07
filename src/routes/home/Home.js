/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'moment/locale/ru';
import vis from 'vis';
import visCss from 'vis/dist/vis.css';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ControlPanel from './component/ControlPanel';
import jointjsCss from './component/jointjs/jointjs.css';
import joint from './component/jointjs';
import shapesCss from './component/jointjs/shapes.css';

import $ from './component/jquery';
import s from './Home.css';

const groupsA = [
  { id: 'name', content: 'Name' },
  { id: 'desc', content: 'Desc' },
  { id: 'startNode', content: 'StartNode' },
];

const itemsA = [
  { id: 1, group: 'name', content: 'name', start: Date.now() },
  { id: 2, group: 'desc', content: 'desc', start: Date.now() },
  { id: 3, group: 'startNode', content: 'startNode', start: Date.now() },
];

const timeLineOptions = {
  autoResize: true,
  width: '100%',
  zoomMin: 1000,
  zoomMax: 1000 * 60 * 60 * 24 * 30 * 12,
  height: '100%',
  margin: {
    item: 20,
  },
  locales: {
    ru: {
      current: 'Текущий',
      time: 'Время',
    },
  },
  locale: 'ru',
};

class Home extends React.Component {
  componentDidMount() {
    const {
      changeConnector,
      props: { setEditor, removeNode, removeEdge },
    } = this;

    // jointjs settings
    this.paper = joint.shapes.tm.MyPaperFactory({
      el: $(this.paperEl),
      changeConnector,
    });
    this.graph = this.paper.model;

    this.paper.on('link:remove', linkView => {
      removeEdge(linkView.model.id);
    });

    this.paper.on('link:options', linkView => {
      setEditor({
        model: linkView.model.attr('data'),
        tab: 'edge',
        showMenu: true,
      });
    });

    this.paper.on('node:remove', linkView => {
      removeNode(linkView.model.id);
    });

    this.paper.on('node:options', linkView => {
      setEditor({
        model: linkView.model.attr('data'),
        tab: 'node',
        showMenu: true,
      });
    });

    // vis settings
    const groups = new vis.DataSet([...groupsA]);
    const items = new vis.DataSet([...itemsA]);

    this.dataSet = items;
    this.timeline = new vis.Timeline(this.tEl);
    this.timeline.setOptions(timeLineOptions);
    this.timeline.setData({
      groups,
      items,
    });

    this.drawScheme();
  }

  changeConnector = (id, target, source) => {
    const { scheme: { graph: { edges } }, updateEdge } = this.props;
    const eventEdge = edges.find(edge => edge.id === id);
    updateEdge({ ...eventEdge, id, target, source });
  };

  updatePosition = (id, position) => {
    const { scheme: { graph: { nodes } }, updateNode } = this.props;
    const eventNode = nodes.find(node => node.id === id);
    updateNode({ ...eventNode, position });
  };

  componentWillReceiveProps(props) {
    const {
      props: { scheme, history, showHistory },
      timeline,
      drawScheme,
      drawHistory,
    } = this;

    if (scheme !== props.scheme) {
      setTimeout(drawScheme);
    }
    if (history !== props.history) {
      setTimeout(drawHistory);
    }
    if (showHistory) {
      timeline.moveTo(props.timestamp || Date.now());
    }
  }

  drawScheme = () => {
    const {
      props: { scheme: { graph: { nodes, edges } }, originScheme },
      changeConnector,
      updatePosition,
      graph,
    } = this;

    const state = joint.shapes.tm.MyStateFactory;
    const link = joint.shapes.tm.MyLinkFactory;

    const elements = graph.getElements();
    const links = graph.getLinks();

    const nodesMap = nodes.reduce((r, e) => ({ ...r, [e.id]: e }), {});
    const originNodesMap = originScheme.graph.nodes.reduce(
      (r, e) => ({ ...r, [e.id]: e }),
      {},
    );

    const edgesMap = edges.reduce((r, e) => ({ ...r, [e.id]: e }), {});
    const originEdgesMap = originScheme.graph.edges.reduce(
      (r, e) => ({ ...r, [e.id]: e }),
      {},
    );

    // update or create
    nodes.forEach(data => {
      const cell = graph.getCell(data.id);
      const origin_data = originNodesMap[data.id] || {};
      if (cell) {
        cell.prop('attrs/origin_data', origin_data);
        cell.prop('attrs/data', data);
      } else {
        state({
          data,
          origin_data,
          graph,
          updatePosition,
        });
      }
    });
    // remove if not exists into model
    elements.forEach(node => {
      if (!nodesMap[node.id]) {
        node.remove();
      }
    });

    // update or create
    edges.forEach(data => {
      const cell = graph.getCell(data.id);
      const origin_data = originEdgesMap[data.id] || {};
      if (cell) {
        cell.attr('data', data);
        cell.attr('origin_data', origin_data);
      } else {
        link({
          data,
          origin_data,
          graph,
          changeConnector,
        });
      }
    });
    // remove if not exists into model
    links.forEach(link => {
      if (!edgesMap[link.id]) {
        link.remove();
      }
    });
  };

  openSchemeDesc = () => {
    const { setEditor, scheme } = this.props;
    setEditor({
      tab: 'scheme',
      model: scheme,
      showMenu: true,
    });
  };

  drawHistory = () => {
    const {
      context: { fetch },
      props: { originScheme, history, timestamp, loadByHistory },
      dataSet,
      timeline,
    } = this;
    const uuid = vis.util.randomUUID;
    const names = history.name.map(n => ({
      id: uuid(),
      group: 'name',
      content: n.value,
      start: n.timestamp,
    }));
    const descs = history.desc.map(n => ({
      id: uuid(),
      group: 'desc',
      content: n.value,
      start: n.timestamp,
    }));
    const graphs = history.startNode.map(n => ({
      id: uuid(),
      group: 'startNode',
      content: n.value,
      start: n.timestamp,
    }));

    dataSet.clear();
    dataSet.add([...names, ...descs, ...graphs]);
    timeline.moveTo(timestamp || Date.now());

    this.timeline.on('rangechanged', () => {
      const { start, end } = timeline.getWindow();
      const timestamp = Math.round((start.getTime() + end.getTime()) / 2);
      loadByHistory(originScheme.id, timestamp, fetch);
    });
  };

  paperProps = () => ({
    scale: this.paper.scale(),
    translate: this.paper.translate(),
  });

  render() {
    const {
      openSchemeDesc,
      paperProps,
      props: { originScheme, scheme: { name, desc }, showHistory },
    } = this;

    const nameClass = cx({
      [s.name]: true,
      [s.nameWasChanged]: originScheme.name !== name,
    });

    const descClass = cx({
      [s.desc]: true,
      [s.descWasChanged]: originScheme.desc !== desc,
    });

    const timelineClass = cx({
      [s.timeline]: true,
      [s.showHistory]: showHistory,
    });

    return (
      <div className={s.root}>
        <ControlPanel {...{ paperProps }} />
        <div className={s.descCont} onClick={openSchemeDesc}>
          <div className={nameClass}>{name}</div>
          <div className={descClass}>{desc}</div>
        </div>
        <div
          className={cx(s.container, 'can-dropped')}
          ref={el => (this.paperEl = el)}
        />
        <div className={timelineClass} ref={el => (this.tEl = el)} />
      </div>
    );
  }
}

Home.contextTypes = {
  fetch: PropTypes.func,
};

Home.propTypes = {
  setEditor: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  removeEdge: PropTypes.func.isRequired,
  updateEdge: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  loadByHistory: PropTypes.func.isRequired,
  scheme: PropTypes.object.isRequired,
  originScheme: PropTypes.object.isRequired,
  showHistory: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  timestamp: PropTypes.number.isRequired,
};

export default withStyles(s, jointjsCss, shapesCss, visCss)(Home);
