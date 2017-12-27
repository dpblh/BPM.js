import joint, { V } from 'jointjs';
import _ from 'lodash';
import svgPanZoom from '../svg-pan-zoom';

joint.shapes.tm = {};

joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({
  toolMarkup: [
    '<g class="element-tools">',
    '<g class="tool-remove" event="node:remove">',
    '<circle fill="red" r="11" />',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',
    '<title>Remove link.</title>',
    '</g>',
    '<g class="tool-options" event="node:options">',
    '<circle fill="black" r="11" transform="translate(25)"/>',
    '<path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>',
    '<title>Link options.</title>',
    '</g>',
    '</g>',
  ].join(''),

  defaults: joint.util.deepSupplement(
    {
      attrs: {
        text: {
          'font-weight': 400,
          'font-size': 'small',
          fill: 'black',
          'text-anchor': 'middle',
          'ref-x': 0.5,
          'ref-y': 0.5,
          'y-alignment': 'middle',
        },
      },
    },
    joint.shapes.basic.Generic.prototype.defaults,
  ),
});

// joint.shapes.tm.Actor = joint.shapes.tm.toolElement.extend({
//   markup:
//     '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text/></g>',
//
//   defaults: joint.util.deepSupplement(
//     {
//       type: 'tm.Actor',
//       attrs: {
//         rect: {
//           fill: 'white',
//           stroke: 'black',
//           'stroke-width': 1,
//           'follow-scale': true,
//           width: 160,
//           height: 80,
//         },
//         text: { ref: 'rect' },
//       },
//       size: { width: 160, height: 80 },
//     },
//     joint.shapes.tm.toolElement.prototype.defaults,
//   ),
// });

joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({
  initialize() {
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
  },

  render() {
    joint.dia.ElementView.prototype.render.apply(this, arguments);

    this.renderTools();
    this.update();

    return this;
  },

  renderTools() {
    const toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');

    if (toolMarkup) {
      const nodes = V(toolMarkup);
      V(this.el).append(nodes);
    }

    return this;
  },
});

joint.shapes.MyLink = joint.shapes.fsa.Arrow.define('shapes.MyLink', {
  toolMarkup: [
    '<g class="link-tool">',
    '<g class="tool-remove" event="link:remove">',
    '<circle r="11" />',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',
    '<title>Remove link.</title>',
    '</g>',
    '<g class="tool-options" event="link:options">',
    '<circle r="11" transform="translate(25)"/>',
    '<path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>',
    '<title>Link options.</title>',
    '</g>',
    '</g>',
  ].join(''),
  doubleLinkTools: false,
  attrs: {
    '.link-tool .tool-options': {
      style: {
        display: 'block',
      },
    },
  },
});

joint.shapes.tm.Process = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable cccc"><g class="scalable"><circle class="element-process"/><circle class="element-process-2"/></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: 'tm.Process',
      attrs: {
        '.element-process': {
          magnet: true,
          'stroke-width': 1,
          r: 30,
          transform: 'translate(50, 50)',
        },
        '.element-process-2': {
          'stroke-width': 1,
          r: 25,
          stroke: 'black',
          transform: 'translate(50, 50)',
        },
        text: { ref: '.element-process' },
        '.element-tools': { refX: '100%' },
      },
      size: { width: 100, height: 100 },
    },
    joint.shapes.tm.toolElement.prototype.defaults,
  ),
});

joint.shapes.tm.StartProcess = joint.shapes.tm.Process.extend({
  defaults: joint.util.deepSupplement(
    {
      type: 'tm.StartProcess',
      attrs: {
        '.element-process': {
          r: 20,
        },
        '.element-process-2': {
          fill: 'black',
          r: 15,
        },
        text: {
          'paint-order': 'stroke',
          stroke: 'white',
          'stroke-width': '8px',
          'font-weight': 600,
        },
      },
      size: { width: 60, height: 60 },
    },
    joint.shapes.tm.Process.prototype.defaults,
  ),
});

joint.shapes.tm.ProcessView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.MyPaperFactory = ({ el }) => {
  const graph = new joint.dia.Graph();

  const paper = new joint.dia.Paper({
    el,
    width: '100%',
    height: '100%',
    gridSize: 1,
    linkView: joint.dia.LinkView,
    elementView: joint.shapes.tm.ProcessView,
    linkPinning: false,
    // disconnectLinks: true,
    defaultLink: () =>
      joint.shapes.tm.MyLinkFactory({
        data: { hock: true },
        graph,
        newLink: true,
      }),
    model: graph,
    validateConnection(
      sourceView,
      magnetS,
      targetView,
      magnetT,
      end,
      linkView,
    ) {
      const links = graph.getLinks();

      return links.find(l => {
        const target = l.getTargetElement();
        return (
          (target && target.id === sourceView.model.id) ||
          sourceView.model.attr('data/startNode')
        );
      });
    },
    interactive(cell) {
      return cell.model.isElement()
        ? {
            labelMove: true,
          }
        : {
            labelMove: false,
          };
    },
  });

  const myAdjustVertices = _.partial(joint.dia.adjustVertices, graph);
  _.each(graph.getLinks(), myAdjustVertices);
  graph.on('add remove change:source change:target', myAdjustVertices);
  paper.on('cell:pointerup', (a, b) => {
    if (a.model.isElement()) {
      myAdjustVertices(a, b);
    }
  });

  const highlighter = {
    highlighter: {
      name: 'addClass',
      options: {
        className: 'highlighted',
      },
    },
  };

  let currentCell;

  paper.on('cell:pointerclick', cellView => {
    currentCell && currentCell.unhighlight(null, highlighter);
    currentCell = cellView;
    currentCell.highlight(null, highlighter);
  });

  paper.on('blank:pointerdown', () => {
    currentCell && currentCell.unhighlight(null, highlighter);
  });

  const svgZoom = svgPanZoom(paper.svg, {
    center: false,
    zoomEnabled: true,
    panEnabled: true,
    fit: false,
    minZoom: 0.1,
    maxZoom: 2,
    zoomScaleSensitivity: 0.3,
  });

  paper.on('cell:pointerdown', svgZoom.disablePan);
  paper.on('cell:pointerup', svgZoom.enablePan);

  return paper;
};

/*
cell.on('change:attrs', (element, { data, origin_data }) => {
    const color = _.isEqual(data, origin_data) ? 'black' : 'red';
    const changedStartNode = data.startNode === origin_data.startNode;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (changedStartNode) {
        if (data.startNode) {
          const elements = graph.getElements();
          elements
            .filter(el => el.id !== data.id)
            .forEach(el => el.attr('data/startNode', false));
        }
        cell.attr('text', startNode
          ? {
            text: name,
          }
          : startAttrs.text);
      }
      cell.attr('text/stroke', color);
      cell.attr('text/text', data.name);
    }, 100);
  });



  const attrs = {
      elementProcess: {
        r: 20,
      },
      elementProcess2: {
        fill: 'black',
        r: 15,
      },
      text: {
        'paint-order': 'stroke',
        stroke: 'white',
        'stroke-width': '8px',
        'font-weight': 600,
      },
    },
    size = { width: 60, height: 60 };
 */

joint.shapes.tm.MyStateFactory = ({
  graph,
  data,
  newState = false,
  data: { id, name, position: { x, y }, startNode },
}) => {
  const startAttrs = {
    rotatable: { class: 'rotatable cccc start-node' },
    elementProcess: { r: 20, transform: 'translate(30, 30)' },
    elementProcess2: { r: 15, transform: 'translate(30, 30)' },
    size: { width: 60, height: 60 },
  };
  const otherAttrs = {
    rotatable: { class: 'rotatable cccc' },
    elementProcess: { r: 30, transform: 'translate(50, 50)' },
    elementProcess2: { r: 25, transform: 'translate(50, 50)' },
    size: { width: 100, height: 100 },
  };
  const makeStart = el => {
    el.attr('data/startNode', true);
    el.attr('.rotatable', startAttrs.rotatable);
    el.attr('.element-process', startAttrs.elementProcess);
    el.attr('.element-process-2', startAttrs.elementProcess2);
    el.prop('size', startAttrs.size);
  };

  const makeOther = el => {
    el.attr('data/startNode', false);
    el.attr('.rotatable', otherAttrs.rotatable);
    el.attr('.element-process', otherAttrs.elementProcess);
    el.attr('.element-process-2', otherAttrs.elementProcess2);
    el.prop('size', otherAttrs.size);
  };

  const cell = new joint.shapes.tm.Process({
    id,
    position: { x, y },
    attrs: {
      '.rotatable': startNode ? startAttrs.rotatable : otherAttrs.rotatable,
      '.element-process': startNode
        ? startAttrs.elementProcess
        : otherAttrs.elementProcess,
      '.element-process-2': startNode
        ? startAttrs.elementProcess2
        : otherAttrs.elementProcess2,
      text: { text: name, stroke: newState ? 'red' : 'black' },
      data,
      origin_data: newState ? {} : Object.assign({}, data),
    },
    size: startNode ? startAttrs.size : otherAttrs.size,
  });
  let timeout;
  cell.on('change:attrs', (element, { data, origin_data }) => {
    const color = _.isEqual(data, origin_data) ? 'black' : 'red';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (data.startNode) {
        const elements = graph.getElements();

        elements.filter(el => el.id !== data.id).forEach(makeOther);

        makeStart(cell);
      } else {
        makeOther(cell);
      }
      cell.attr('text/stroke', color);
      cell.attr('text/text', data.name);
    }, 100);
  });
  graph.addCell(cell);
  return cell;
};

// joint.shapes.tm.MyStartStateFactory = ({
//   graph,
//   data,
//   data: { id, name, position: { x, y } },
// }) => {
//   const cell = new joint.shapes.fsa.StartState({
//     id,
//     position: { x, y },
//     attrs: { text: { text: name }, data, origin_data: Object.assign({}, data) },
//   });
//   let timeout;
//   cell.on('change:attrs', (element, { data, origin_data }) => {
//     const color = _.isEqual(data, origin_data) ? 'black' : 'red';
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       cell.attr('text/stroke', color);
//       cell.attr('text/text', data.name);
//     }, 100);
//   });
//   graph.addCell(cell);
//   return cell;
// };

joint.shapes.tm.MyLinkFactory = ({
  data,
  data: { id, source, target, name },
  newLink = false,
  graph,
}) => {
  const cell = new joint.shapes.MyLink({
    id,
    source: { id: source },
    target: { id: target },
    labels: [{ attrs: { text: { text: name } } }],
    attrs: {
      '.connection': { stroke: newLink ? 'red' : 'black' },
      data,
      origin_data: newLink ? {} : Object.assign({}, data),
    },
  });
  let timeout;
  cell.on('change:target', cell => {
    const target = cell.get('target').id;
    if (target) {
      cell.attr('data/target', target);
    }
  });
  cell.on('change:source', cell => {
    const source = cell.get('source').id;
    if (source) {
      cell.attr('data/source', source);
    }
  });
  cell.on('change:attrs', (element, { data, origin_data }) => {
    const color = _.isEqual(data, origin_data) ? 'black' : 'red';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cell.attr('.connection/stroke', color);
    }, 100);
  });
  graph.addCell(cell);
  return cell;
};
