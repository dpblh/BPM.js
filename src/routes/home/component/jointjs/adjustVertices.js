import joint, { g } from 'jointjs';

joint.dia.adjustVertices = (graph, cellView) => {
  cellView = cellView.model || cellView;

  if (cellView instanceof joint.dia.Element) {
    _.chain(graph.getConnectedLinks(cellView))
      .each(link => {
        joint.dia.adjustVertices(graph, link);
      })
      .value();

    return;
  }

  const srcId = cellView.get('source').id || cellView.previous('source').id;
  const trgId = cellView.get('target').id || cellView.previous('target').id;

  const gap = 20;

  if (!srcId || !trgId) return;

  const siblings = _.filter(graph.getLinks(), sibling => {
    const _srcId = sibling.get('source').id;
    const _trgId = sibling.get('target').id;

    return (
      (_srcId === srcId && _trgId === trgId) ||
      (_srcId === trgId && _trgId === srcId)
    );
  });

  switch (siblings.length) {
    case 0:
      break;

    case 1:
      if (srcId === trgId) {
        const { x, y } = graph.getCell(srcId).position();
        siblings[0].set('vertices', [{ x: x - gap, y }, { x, y: y - gap }]);
      } else {
        cellView.unset('vertices');
      }
      break;

    default:
      const srcCenter = graph
        .getCell(srcId)
        .getBBox()
        .center();
      const trgCenter = graph
        .getCell(trgId)
        .getBBox()
        .center();
      const midPoint = g.line(srcCenter, trgCenter).midpoint();

      const theta = srcCenter.theta(trgCenter);

      _.each(siblings, (sibling, index) => {
        const offset = gap * Math.ceil(index / 2);
        const sign = index % 2 ? 1 : -1;
        const angle = g.toRad(theta + sign * 90);

        let vertex;
        if (srcId === trgId) {
          const { x, y } = graph.getCell(srcId).position();
          vertex = [
            { x: x - gap * (index + 1), y },
            { x, y: y - gap * (index + 1) },
          ];
        } else {
          const { x, y } = g.point.fromPolar(offset, angle, midPoint);
          vertex = [{ x, y }];
        }

        sibling.set('vertices', vertex);
      });
  }
};
