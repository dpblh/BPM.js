import React, { Component } from 'react';
import PropTypes from 'prop-types';
import vis from 'vis';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import FormNode from '../FormNode';
import FormEdge from '../FormEdge';
import FormScheme from '../FormScheme';
import DraggableButton from '../DraggableButton';
import s from './ControlPanel.css';

class ControlPanel extends Component {
  toggleNav = () => {
    const { setEditor, editor: { showMenu } } = this.props;
    setEditor({
      showMenu: !showMenu,
    });
  };

  toggleTab = tab => () => {
    const { setEditor } = this.props;
    setEditor({
      tab,
    });
  };

  openScheme = schemeNone => () => {
    if (schemeNone.startNode.length) {
      const timestamp = Date.now();
      const { loadGraph } = this.props;
      const { fetch } = this.context;

      loadGraph(schemeNone.id, timestamp, fetch);
    }
  };

  newScheme = () => {
    const { setCurrentScheme } = this.props;
    setCurrentScheme({
      id: vis.util.randomUUID(),
      name: 'Новая схема',
      desc: '',
      graph: {
        nodes: [],
        edges: [],
      },
    });
  };

  removeScheme = async () => {
    const {
      saveGraph,
      originScheme: { graph: { nodes, edges }, startNode, name, desc, id },
    } = this.props;
    const { fetch } = this.context;

    const updatedNodes = nodes.map(n => {
      const { startNode, ...node } = n;
      return node;
    });

    saveGraph(
      {
        id,
        name,
        desc,
        startNode,
        removed: true,
        edges,
        nodes: updatedNodes,
      },
      fetch,
    );
  };

  changeScheme = newScheme => {
    const { updateScheme, setEditor } = this.props;
    updateScheme(newScheme);
    setEditor({
      model: newScheme,
    });
  };

  changeNode = newNode => {
    const { updateNode, setEditor } = this.props;
    updateNode(newNode);
    setEditor({
      model: newNode,
    });
  };

  changeEdge = newEdge => {
    const { updateEdge, setEditor } = this.props;
    updateEdge(newEdge);
    setEditor({
      model: newEdge,
    });
  };

  showHistoryHandler = async () => {
    const { fetch } = this.context;
    const { toggleHistory } = this.props;
    toggleHistory(fetch);
  };

  schemeClear = () => {
    const { clearScheme } = this.props;
    clearScheme();
  };
  saveScheme = () => {
    const {
      saveGraph,
      scheme: { id, name, desc, removed, graph: { edges, nodes } },
    } = this.props;
    const { fetch } = this.context;

    const startNodeModel = nodes.find(n => n.startNode);
    if (!startNodeModel) return console.log('startNode not specific');
    const startNode = startNodeModel.id;

    const updatedNodes = nodes.map(n => {
      const { startNode, ...node } = n;
      return node;
    });

    saveGraph(
      {
        id,
        name,
        desc,
        startNode,
        removed,
        edges,
        nodes: updatedNodes,
      },
      fetch,
    );
  };

  dragHandler = (event, drag) => {
    const { props: { scheme, schemes, updateNode } } = this;
    if (!scheme.id) {
      console.log('Please select scheme');
      return;
    }
    const id = drag.attr('id');
    const templateScheme = schemes.find(s => s.id === id);
    const {
      scale: { sx, sy },
      translate: { tx, ty },
    } = this.props.paperProps();

    updateNode({
      id: vis.util.randomUUID(),
      position: {
        x: (event.clientX - tx) / sx - 50,
        y: (event.clientY - ty) / sy - 50,
      },
      name: templateScheme.name,
      desc: templateScheme.desc,
      scheme: templateScheme.id,
      startNode: false,
    });
  };

  optimizeScheme = () => {};

  render() {
    const {
      newScheme,
      removeScheme,
      schemeClear,
      saveScheme,
      changeScheme,
      changeNode,
      changeEdge,
      showHistoryHandler,
      openScheme,
      toggleNav,
      toggleTab,
      dragHandler,
      optimizeScheme,
      props: { editor: { tab, showMenu, model }, scheme, schemes, showHistory },
    } = this;

    const toggleClass = cx({
      [s.button]: true,
      [s.toggle]: true,
      [s.show]: showMenu,
    });

    const contentClass = cx({
      [s.navContent]: true,
      [s.show]: showMenu,
    });

    const controlClass = cx(s.button, s.control);

    return (
      <div className={s.root}>
        <div className={toggleClass} onClick={toggleNav}>
          <div className={s.buttonText}>x</div>
        </div>
        <div className={contentClass}>
          <div className={s.tabs}>
            <div
              className={cx(s.button, tab === 'helper' ? s.activeTab : '')}
              onClick={toggleTab('helper')}
            >
              <div className={s.buttonText}>Подсказки</div>
            </div>
            <div
              className={cx(s.button, tab === 'navigation' ? s.activeTab : '')}
              onClick={toggleTab('navigation')}
            >
              <div className={s.buttonText}>Управление</div>
            </div>
          </div>

          {tab === 'helper' && <div className={s.content}>1</div>}

          {tab === 'navigation' && (
            <div className={s.content}>
              <div className={s.groupButton}>
                <div
                  className={cx(controlClass, scheme.id ? '' : s.disabled)}
                  onClick={saveScheme}
                >
                  <div className={cx(s.buttonText)}>Save</div>
                </div>
                <div
                  className={cx(controlClass, scheme.id ? '' : s.disabled)}
                  onClick={schemeClear}
                >
                  <div className={cx(s.buttonText)}>Clear</div>
                </div>
                <div className={controlClass}>
                  <div className={s.buttonText} onClick={newScheme}>
                    New
                  </div>
                </div>
                <div
                  className={cx(controlClass, scheme.id ? '' : s.disabled)}
                  onClick={showHistoryHandler}
                >
                  <div className={cx(s.buttonText)}>
                    {showHistory ? 'History Hide' : 'History Show'}
                  </div>
                </div>
                <div
                  className={cx(controlClass, scheme.id ? '' : s.disabled)}
                  onClick={removeScheme}
                >
                  <div className={cx(s.buttonText)}>Remove</div>
                </div>
                <div
                  className={cx(controlClass, scheme.id ? '' : s.disabled)}
                  onClick={optimizeScheme}
                >
                  <div className={cx(s.buttonText)}>Optimize</div>
                </div>
              </div>
              <div className={s.groupButtonLabel}>Statements</div>
              <div className={s.groupButton}>
                {schemes.map(sch => (
                  <DraggableButton
                    key={sch.id}
                    callback={dragHandler}
                    className={cx(controlClass, 'drag-me')}
                    id={sch.id}
                    onDoubleClick={openScheme(sch)}
                  >
                    <div className={s.buttonText}>{sch.name}</div>
                  </DraggableButton>
                ))}
              </div>
            </div>
          )}

          {tab === 'node' && (
            <div className={s.content}>
              <FormNode {...{ model, onChange: changeNode }} />
            </div>
          )}

          {tab === 'edge' && (
            <div className={s.content}>
              <FormEdge {...{ model, onChange: changeEdge }} />
            </div>
          )}

          {tab === 'scheme' && (
            <div className={s.content}>
              <FormScheme {...{ model, onChange: changeScheme }} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

ControlPanel.contextTypes = {
  fetch: PropTypes.func,
};

ControlPanel.propTypes = {
  setEditor: PropTypes.func.isRequired,
  loadGraph: PropTypes.func.isRequired,
  saveGraph: PropTypes.func.isRequired,
  setCurrentScheme: PropTypes.func.isRequired,
  updateScheme: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  updateEdge: PropTypes.func.isRequired,
  clearScheme: PropTypes.func.isRequired,
  paperProps: PropTypes.func.isRequired,
  originScheme: PropTypes.object.isRequired,
  scheme: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  schemes: PropTypes.arrayOf(PropTypes.object).isRequired,
  showHistory: PropTypes.bool.isRequired,
};

export default withStyles(s)(ControlPanel);
