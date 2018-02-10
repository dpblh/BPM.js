import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import vis from 'vis';
import _ from 'lodash';
import visCss from 'vis/dist/vis.css';
import s from './Process.css';

const timeLineOptions = {
  autoResize: true,
  width: '100%',
  zoomMin: 1,
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
  stack: false,
  stackSubgroups: false,
};

const colors = [
  '#91b8e8',
  '#f2d181',
  '#af9be9',
  '#91c187',
  '#dddddd',
  '#f3f3f3',
  '#85cabe',
  '#494961',
  '#26898E',
  '#2E628C',
  '#C89185',
  '#85CABE',
];

class Process extends Component {
  componentDidMount() {
    const { process: { context } } = this.props;

    const groups2 = [];
    const items2 = [];
    context.forEach(c => {
      c.start_t = _.minBy(c.stack, e => e.start_t).start_t;
      c.finish_t = _.maxBy(c.stack, e => e.finish_t).finish_t;
      c.time = Math.max(c.finish_t - c.start_t, 1);
    });

    const contextMap = context.reduce((r, e) => ({ ...r, [e.id]: e }), {});

    const contextsIndex = id => context.map(_ => _.id).indexOf(id);

    context.sort((a, b) => a.start_t > b.start_t).forEach((c, i) => {
      let width = 100;
      const context = c;
      if (c.parentContextId) {
        const parentContext = contextMap[c.parentContextId];
        width = context.time / ((context.time + parentContext.time) / 100);
        width = Math.max(width - 10, 10);
      }

      groups2.push({
        id: c.id,
        content: `<div class="inner">
          <div class="content">${c.id}</div>
          <div class="context">
            <div class="parent" style="background-color: ${
              colors[contextsIndex(c.parentContextId)]
            };width: ${100 - width}%"></div>
            <div class="current" style="background-color: ${
              colors[i]
            };width: ${width}%"></div>
          </div>
        </div>`,
      });

      c.stack.forEach((s, j) => {
        items2.push({
          group: c.id,
          style: !j
            ? `z-index:2;background-color: ${
                colors[i]
              }; border-left:2px solid ${
                colors[contextsIndex(c.parentContextId)]
              }`
            : '',
          content: s.name,
          title: `<div><span style="font-weight: bold">${s.name}</span><br/>${
            s.desc
          }<br/>${s.variables}</div>`,
          start: s.start_t,
          end: s.finish_t,
        });
      });
    });

    const groups = new vis.DataSet([...groups2]);
    const items = new vis.DataSet([...items2]);

    this.timeline = new vis.Timeline(this.tEl);
    this.timeline.setOptions(timeLineOptions);
    this.timeline.setData({
      groups,
      items,
    });
    this.timeline.fit({ animation: true });
  }

  render() {
    return <div className={s.timeline} ref={el => (this.tEl = el)} />;
  }
}

export default withStyles(s, visCss)(Process);
