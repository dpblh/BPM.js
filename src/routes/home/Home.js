/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import 'moment/locale/ru';
import vis from 'vis';
import visCss from 'vis/dist/vis.css';
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
    tab: 1,
    scheme: {},
    originScheme: {},
  };
  componentDidMount() {
    const groups = new vis.DataSet([
      {
        id: 'name',
        content: 'Name',
      },
      {
        id: 'desc',
        content: 'Desc',
      },
      {
        id: 'startNode',
        content: 'StartNode',
      },
    ]);
    const items = [
      { id: 1, group: 'name', content: 'item 1', start: '2013-04-20' },
      { id: 2, group: 'desc', content: 'item 2', start: '2013-04-14' },
      { id: 3, group: 'startNode', content: 'item 3', start: '2013-04-14' },
    ];

    const options = {
      autoResize: true,
      width: '100%',
      zoomMin: 1000,
      zoomMax: 1000 * 60 * 60 * 24 * 30 * 12,
      height: '100%',
      margin: {
        item: 20,
      },
      locales: {
        // create a new locale (text strings should be replaced with localized strings)
        ru: {
          current: 'Текущий',
          time: 'Время',
        },
      },
      locale: 'ru',
    };
    this.dataSet = new vis.DataSet(items);
    this.timelineE = new vis.Timeline(this.timeline);
    this.timelineE.setOptions(options);
    this.timelineE.setGroups(groups);
    this.timelineE.setItems(this.dataSet);

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
        showMenu: true,
      });
    });

    paper.on('node:remove', linkView => {
      linkView.model.remove();
    });

    paper.on('node:options', linkView => {
      this.setState({
        node: linkView.model,
        tab: 2,
        showMenu: true,
      });
    });

    $('.drag-me').dragged((event, drag) => {
      const { originScheme } = this.state;
      if (!originScheme.id) return console.log("scheme isn't exists");
      const id = drag.attr('id');
      const scheme = this.props.schemes.find(s => s.id === id);
      const { sx, sy } = paper.scale();
      const { tx, ty } = paper.translate();
      const newState = true;

      state({
        data: {
          id: vis.util.randomUUID(),
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

  saveSheme = async () => {
    const { saveGraph, loadHistory } = this.props;
    const links = this.graph.getLinks();
    const elements = this.graph.getElements();

    const { scheme: { name, desc }, showHistory } = this.state;
    const { id } = this.state.originScheme;

    const updatedNodes = elements.map(el => ({
      id: el.id,
      name: el.attr('data/name') || null,
      desc: el.attr('data/desc') || null,
      scheme: el.attr('data/scheme'),
      position: el.position(),
    }));

    const startNodeModel = elements.find(
      el => el.attr('data/startNode') === true,
    );
    // assept(true, 'message')
    if (!startNodeModel) return console.log('startNode not specific');
    const startNode = startNodeModel.id;

    const updatedEdge = links.map(el => ({
      id: el.id,
      source: el.getSourceElement().id,
      target: el.getTargetElement().id,
      condition: el.attr('data/condition') || null,
      roles: el.attr('data/roles') || null,
    }));

    const originSheme = await saveGraph({
      id,
      name,
      desc,
      startNode,
      edges: updatedEdge,
      nodes: updatedNodes,
    });

    this.drawScheme(originSheme);

    if (showHistory) {
      const history = await loadHistory(originSheme.id);

      this.drawHistory(history);
    }
  };

  drawScheme = originScheme => {
    const { graph: { nodes, edges }, startNode, name, desc, id } = originScheme;
    const graph = this.graph;
    const state = joint.shapes.tm.MyStateFactory;
    const link = joint.shapes.tm.MyLinkFactory;
    const scheme = { name, desc, id };

    graph.clear();

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
  };

  openScheme = async (schemeNone, timestamp = Date.now()) => {
    if (schemeNone.startNode.length) {
      const { loadGraph } = this.props;

      const originScheme = await loadGraph(schemeNone.id, timestamp);
      this.drawScheme(originScheme);
    }
  };

  schemeClear = () => {
    this.graph.clear();
    this.setState({
      originScheme: {},
      scheme: {},
    });
  };

  newScheme = () => {
    this.drawScheme({
      id: vis.util.randomUUID(),
      name: 'new',
      desc: 'new',
      graph: {
        nodes: [],
        edges: [],
      },
    });
  };

  changeScheme = scheme => {
    this.setState({ scheme });
  };

  openSchemeDesc = () => {
    this.setState({
      tab: 4,
    });
  };

  drawHistory = history => {
    const { originScheme } = this.state;
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

    this.dataSet.clear();
    this.dataSet.add([...names, ...descs, ...graphs]);
    this.timelineE.moveTo(Date.now());
    // this.timelineE.fit();

    this.timelineE.on('changed', event => {
      clearTimeout(this.timeout2);
      this.timeout2 = setTimeout(() => {
        const { start, end } = this.timelineE.getWindow();
        console.log(start.getTime(), end.getTime());
        const timestamp = Math.round((start.getTime() + end.getTime()) / 2);

        this.openScheme(originScheme, timestamp);
      }, 1000);
    });
  };

  showHistoryHandler = async () => {
    const { originScheme, showHistory } = this.state;
    if (showHistory) {
      return this.setState({
        showHistory: false,
      });
    }

    const { loadHistory } = this.props;
    const history = await loadHistory(originScheme.id);

    this.setState({
      showHistory: true,
    });

    this.drawHistory(history);
  };

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  };

  toggleTab = tab =>
    this.setState({
      tab,
    });

  render() {
    const {
      openScheme,
      newScheme,
      saveSheme,
      changeScheme,
      openSchemeDesc,
      showHistoryHandler,
      toggleMenu,
      toggleTab,
      schemeClear,
    } = this;
    const { schemes } = this.props;
    const {
      originScheme,
      scheme,
      scheme: { name, desc },
      node,
      link,
      tab,
      showMenu,
      showHistory,
    } = this.state;

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
        <ControlPanel
          {...{
            schemes,
            scheme,
            node,
            link,
            tab,
            showMenu,
            showHistory,
            handler: {
              toggleMenu,
              toggleTab,
              openScheme,
              newScheme,
              saveSheme,
              changeScheme,
              showHistoryHandler,
              schemeClear,
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
        <div
          className={timelineClass}
          ref={timeline => (this.timeline = timeline)}
        >
          <div className={s.ceparatorContainer}>
            <div className={s.ceparator} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s, dragDropCss, jointjsCss, shapesCss, visCss)(Home);
