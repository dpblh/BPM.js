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
import ControlPanel from '../../components/ControlPanel';
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
  // state = {
  //   tab: 1,
  //   scheme: {},
  //   originScheme: {},
  // };
  componentDidMount() {
    const groups = new vis.DataSet([...groupsA]);
    const items = new vis.DataSet([...itemsA]);

    // const options = {
    //   autoResize: true,
    //   width: '100%',
    //   zoomMin: 1000,
    //   zoomMax: 1000 * 60 * 60 * 24 * 30 * 12,
    //   height: '100%',
    //   margin: {
    //     item: 20,
    //   },
    //   locales: {
    //     ru: {
    //       current: 'Текущий',
    //       time: 'Время',
    //     },
    //   },
    //   locale: 'ru',
    // };
    this.dataSet = items;
    this.timeline = new vis.Timeline(this.tEl);
    this.timeline.setOptions(timeLineOptions);
    this.timeline.setData({
      groups,
      items,
    });
    const { changeTarget, updatePosition } = this;
    // this.timeline.setGroups(groups);
    // this.timeline.setItems(items);

    const paper = joint.shapes.tm.MyPaperFactory({
      el: $(this.container),
      changeTarget,
    });
    this.paper = paper;
    this.graph = paper.model;
    // graph = this.graph;
    // const state = joint.shapes.tm.MyStateFactory;
    // const link = joint.shapes.tm.MyLinkFactory;

    paper.on('link:remove', linkView => {
      linkView.model.remove();
    });

    paper.on('link:options', linkView => {
      const { setEditor } = this.props;
      setEditor({
        model: linkView.model.attr('data'),
        tab: 'edge',
        showMenu: true,
      });
      // this.setState({
      //   link: linkView.model,
      //   tab: 3,
      //   showMenu: true,
      // });
    });

    paper.on('node:remove', linkView => {
      linkView.model.remove();
    });

    paper.on('node:options', linkView => {
      const { setEditor } = this.props;
      setEditor({
        model: linkView.model.attr('data'),
        tab: 'node',
        showMenu: true,
      });
      // this.setState({
      //   node: linkView.model,
      //   tab: 2,
      //   showMenu: true,
      // });
    });

    // paper.on('*', cell => {
    //   console.log('change:target', arguments)
    //   // const target = cell.get('target').id;
    //   // if (target) {
    //   //   cell.attr('data/target', target);
    //   // }
    // });

    // this.addDragListener();

    this.drawScheme();
  }

  changeTarget = (id, target, source) => {
    // console.log('id, target', id, target)
    const { scheme: { graph: { edges } }, updateEdge } = this.props;
    const eventEdge = edges.find(edge => edge.id === id);
    updateEdge({ ...eventEdge, id, target, source });
  };

  updatePosition = (id, position) => {
    const { scheme: { graph: { nodes } }, updateNode } = this.props;
    const eventNode = nodes.find(node => node.id === id);
    updateNode({ ...eventNode, position });
  };

  // addDragListener = () => {
  //   return;
  //   const drag = $('.drag-me');
  //   drag.off();
  //   drag.dragged((event, drag) => {
  //     const { graph, paper, props: { schemes, updateNode } } = this;
  //     // const state = joint.shapes.tm.MyStateFactory;
  //     // const { originScheme } = this.props;
  //     // if (!originScheme.id) return console.log("scheme isn't exists");
  //     const id = drag.attr('id');
  //     const scheme = schemes.find(s => s.id === id);
  //     const { sx, sy } = paper.scale();
  //     const { tx, ty } = paper.translate();
  //     // const newState = true;
  //
  //     updateNode({
  //       id: vis.util.randomUUID(),
  //       position: {
  //         x: (event.clientX - tx) / sx - 50,
  //         y: (event.clientY - ty) / sy - 50,
  //       },
  //       name: scheme.name,
  //       desc: scheme.desc,
  //       scheme: scheme.id,
  //       startNode: false,
  //     });
  //
  //     // state({
  //     //   data: {
  //     //     id: vis.util.randomUUID(),
  //     //     position: {
  //     //       x: (event.clientX - tx) / sx - 50,
  //     //       y: (event.clientY - ty) / sy - 50,
  //     //     },
  //     //     name: scheme.name,
  //     //     desc: scheme.desc,
  //     //     scheme: scheme.id,
  //     //   },
  //     //   graph,
  //     // });
  //   });
  // };

  componentWillReceiveProps({ scheme, history, schemes }) {
    // if (new !== old)
    if (this.props.scheme !== scheme) {
      setTimeout(() => {
        this.drawScheme();
      });
    }
    if (this.props.history !== history) {
      setTimeout(() => {
        this.drawHistory();
      });
    }
    // if (this.props.schemes !== schemes) {
    //   setTimeout(() => {
    //     this.addDragListener();
    //   });
    // }
  }

  // saveSheme = async () => {
  //   const { saveGraph } = this.props;
  //   const { fetch } = this.context;
  //
  //   const links = this.graph.getLinks();
  //   const elements = this.graph.getElements();
  //
  //   // todo
  //   const { scheme: { name, desc, removed, id } } = this.props;
  //   // const { scheme: { name, desc, removed } } = this.state;
  //   // const { id } = this.state.originScheme;
  //
  //   const updatedNodes = elements.map(el => ({
  //     id: el.id,
  //     name: el.attr('data/name') || null,
  //     desc: el.attr('data/desc') || null,
  //     scheme: el.attr('data/scheme'),
  //     position: el.position(),
  //   }));
  //
  //   const startNodeModel = elements.find(
  //     el => el.attr('data/startNode') === true,
  //   );
  //   // assept(true, 'message')
  //   if (!startNodeModel) return console.log('startNode not specific');
  //   const startNode = startNodeModel.id;
  //
  //   const updatedEdge = links.map(el => ({
  //     id: el.id,
  //     source: el.getSourceElement().id,
  //     target: el.getTargetElement().id,
  //     condition: el.attr('data/condition') || null,
  //     roles: el.attr('data/roles') || null,
  //   }));
  //
  //   saveGraph(
  //     {
  //       id,
  //       name,
  //       desc,
  //       startNode,
  //       removed,
  //       edges: updatedEdge,
  //       nodes: updatedNodes,
  //     },
  //     fetch,
  //   );
  //
  //   // this.drawScheme(originSheme);
  //
  //   // if (showHistory) {
  //   //   /* const history = await */ loadHistory(fetch, originSheme.id);
  //
  //   // this.drawHistory();
  //   // }
  // };

  /**
   * стор должет быть один. не обновлять ребра и вершины напрямую. сравнивать оригинальные данные с новыми. если оригинальных данных нету
   * нужно добавить новый cell. если оригинальные есть, нужно удалить cell. если есть но изменились, нужно обновить.
   */
  drawScheme = () => {
    // const { originScheme } = this.props;
    // if (!originScheme) return;
    const {
      scheme: { graph: { nodes, edges }, startNode },
      originScheme,
      // name,
      // desc,
      // id,
      // removed,
    } = this.props;
    const { changeTarget, updatePosition } = this;
    const graph = this.graph;
    const state = joint.shapes.tm.MyStateFactory;
    const link = joint.shapes.tm.MyLinkFactory;
    // todo scheme не нужна. нужна
    // const scheme = { name, desc, id, removed };

    const elements = this.graph.getElements();
    const nodesMap = nodes.reduce((r, e) => ({ ...r, [e.id]: e }), {});
    const originNodesMap = originScheme.graph.nodes.reduce(
      (r, e) => ({ ...r, [e.id]: e }),
      {},
    );
    // update or create
    nodes.forEach(data => {
      const cell = graph.getCell(data.id);
      const origin_data = originNodesMap[data.id] || {};
      if (cell) {
        console.log(origin_data);
        cell.prop('attrs/origin_data', origin_data);
        cell.prop('attrs/data', data);
        // cell.attr({data,origin_data});
      } else {
        console.log(4324232423);
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

    const links = this.graph.getLinks();
    const edgesMap = edges.reduce((r, e) => ({ ...r, [e.id]: e }), {});
    const originEdgesMap = originScheme.graph.edges.reduce(
      (r, e) => ({ ...r, [e.id]: e }),
      {},
    );
    // update or create
    edges.forEach(data => {
      const cell = graph.getCell(data.id);
      const origin_data = originEdgesMap[data.id] || {};
      if (cell) {
        cell.attr('data', data);
        cell.attr('origin_data', origin_data);
      } else {
        console.log('data', data);
        link({
          data,
          origin_data,
          graph,
          changeTarget,
        });
      }
    });
    // remove if not exists into model
    links.forEach(link => {
      if (!edgesMap[link.id]) {
        link.remove();
      }
    });

    //   const elements = this.graph.getElements();

    // graph.clear();

    // nodes.forEach(data =>
    //   state({ data: { ...data, startNode: data.id === startNode }, graph }),
    // );
    // edges.forEach(data =>
    //   link({
    //     data,
    //     graph,
    //   }),
    // );

    // this.setState({
    //   originScheme,
    //   scheme,
    // });
  };

  // openScheme = async (schemeNone, timestamp = Date.now()) => {
  //   if (schemeNone.startNode.length) {
  //     const { loadGraph } = this.props;
  //     const { fetch } = this.context;
  //
  //     /* const originScheme = await */ loadGraph(
  //       schemeNone.id,
  //       timestamp,
  //       fetch,
  //     );
  //     // this.drawScheme(originScheme);
  //   }
  // };

  // revert
  // schemeClear = () => {
  //   // this.graph.clear();
  //   // this.setState({
  //   //   originScheme: {},
  //   //   scheme: {},
  //   // });
  // };

  // newScheme = () => {
  //   this.props.setCurrentScheme({
  //     name: 'Новая схема',
  //     desc: '',
  //     graph: {
  //       nodes: [],
  //       edges: [],
  //     },
  //   });
  //   // this.drawScheme({
  //   //   id: vis.util.randomUUID(),
  //   //   name: 'new',
  //   //   desc: 'new',
  //   //   graph: {
  //   //     nodes: [],
  //   //     edges: [],
  //   //   },
  //   // });
  // };

  // removeScheme = async () => {
  //   const { saveGraph } = this.props;
  //   const { fetch } = this.context;
  //   const {
  //     graph: { nodes, edges },
  //     startNode,
  //     name,
  //     desc,
  //     id,
  //   } = this.state.originScheme;
  //
  //   saveGraph(
  //     {
  //       startNode,
  //       name,
  //       desc,
  //       id,
  //       nodes,
  //       edges,
  //       removed: true,
  //     },
  //     fetch,
  //   );
  //
  //   // this.drawScheme(originSheme);
  // };

  // changeScheme = scheme => {
  //   this.props.setScheme({ ...this.props.scheme, ...scheme });
  //   // this.setState({ scheme });
  // };

  openSchemeDesc = () => {
    const { setEditor, scheme } = this.props;
    setEditor({
      tab: 'scheme',
      model: scheme,
      showMenu: true,
    });
    // this.setState({
    //   tab: 'scheme',
    // });
  };

  drawHistory = () => {
    const { originScheme, history, timestamp } = this.props;
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

    // console.log([...names, ...descs, ...graphs])
    this.dataSet.clear();
    this.dataSet.add([...names, ...descs, ...graphs]);
    this.timeline.moveTo(timestamp || Date.now());
    // this.timeline.fit();

    this.timeline.on('rangechanged', event => {
      // clearTimeout(this.timeout2);
      // this.timeout2 = setTimeout(() => {
      const { loadGraph, loadByHistory } = this.props;
      const { fetch } = this.context;
        const { start, end } = this.timeline.getWindow();
        console.log(start.getTime(), end.getTime());
        const timestamp = Math.round((start.getTime() + end.getTime()) / 2);

      loadByHistory(originScheme.id, timestamp, fetch);
      // loadGraph(originScheme.id, timestamp, fetch);
        // this.openScheme(originScheme, timestamp);
      // }, 1000);
    });
  };

  // showHistoryHandler = async () => {
  //   const { fetch } = this.context;
  //   const { toggleHistory } = this.props;
  //   toggleHistory(fetch);
  //   // const { originScheme } = this.state;
  //   // if (showHistory) {
  //   //   return this.setState({
  //   //     showHistory: false,
  //   //   });
  //   // }
  //
  //   // const { loadHistory } = this.props;
  //   // /*const history = await */loadHistory(originScheme.id, fetch);
  //
  //   // this.setState({
  //   //   showHistory: true,
  //   // });
  //
  //   // this.drawHistory();
  // };

  // toggleMenu = () => {
  //   const { setEditor, editor: { showMenu } } = this.props;
  //   // const { showMenu } = this.state;
  //   setEditor({
  //     showMenu: !showMenu,
  //   });
  //   // this.setState({ showMenu: !showMenu });
  // };

  // toggleTab = tab => {
  //   const { setEditor } = this.props;
  //   // const { showMenu } = this.state;
  //   setEditor({
  //     tab,
  //   });
  // };
  // this.setState({
  //   tab,
  // });

  paperProps = () => ({
    scale: this.paper.scale(),
    translate: this.paper.translate(),
  });

  render() {
    const {
      // openScheme,
      // newScheme,
      // saveSheme,
      // changeScheme,
      openSchemeDesc,
      paperProps,
      // showHistoryHandler,
      // toggleMenu,
      // toggleTab,
      // schemeClear,
      // removeScheme,
    } = this;
    const {
      // editor: { tab, showMenu, model },
      // schemes,
      originScheme,
      scheme: { name, desc },
      showHistory,
    } = this.props;
    // const {
    // originScheme,
    // scheme,
    // scheme: { name, desc },
    // node,
    // link,
    // tab,
    // showMenu,
    // showHistory,
    // } = this.state;

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
          ref={container => (this.container = container)}
        />
        <div className={timelineClass} ref={timeline => (this.tEl = timeline)}>
          <div className={s.ceparatorContainer}>
            <div className={s.ceparator} />
          </div>
        </div>
      </div>
    );
  }
}

Home.contextTypes = {
  fetch: PropTypes.func,
};

export default withStyles(s, jointjsCss, shapesCss, visCss)(Home);
