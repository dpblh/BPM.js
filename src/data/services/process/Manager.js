import mongoose from 'mongoose';
import _ from 'lodash';
import Process from '../../models/Process';
import Scheme from '../../models/Scheme';
import Node from '../../models/Node';
import Edge from '../../models/Edge';
import { getVal, setLocalVal, setGlobalVal } from './Stack';
import { script as rules } from './ParserRoles';
import SchemeV from '../../virtualizers/scheme';

const listener = {
  test_1: (getVar, setVar) => ({
    result: getVar('x') ** getVar('x'),
    status: 'done',
  }),
  test_2: (getVar, setVar) => ({
    result: getVar('y') - getVar('x'),
    status: 'done',
  }),
};

const runScheme = (scheme, stack) => {
  const get = name => getVal(name, stack);
  const set = (name, value) => setGlobalVal(name, value, stack);

  return listener[scheme](get, set);
};

const toMap = (array, key) =>
  array.reduce((r, c) => ({ ...r, [c[key]]: c }), {});

export default {
  async run(schemeId, initState = {}) {
    const _id = mongoose.Types.ObjectId();
    const timestamp = Date.now();
    const stack = [
      {
        edgeId: 'main',
        state: initState,
      },
    ];
    const process = {
      _id,
      timestamp,
      scheme: schemeId,
      stack,
    };
    await Process.create(process);

    const schemesAll = await Scheme.find({});
    const nodesAll = await Node.find({});
    const edgesAll = await Edge.find({});

    const schemeMap = toMap(schemesAll, 'id');

    const nextScheme = async id => {
      let scheme = schemeMap[id];
      const schemeV = new SchemeV(scheme).attrs(timestamp);
      const { nodes, edges } = await Scheme.graph(
        timestamp,
        scheme,
        nodesAll,
        edgesAll,
      );

      const edgesSourceMap = _.groupBy(edges, 'source');
      const nodeMap = toMap(nodes, 'id');

      const getEdgesByNode = node => edgesSourceMap[node.id] || [];

      const nextStep = async currentNode => {
        const { status, result } = await runScheme(
          currentNode.scheme,
          process.stack,
        );

        setLocalVal('result', result, process.stack);

        // сохраняем промежуточный редультат
        await Process.update({ _id: process._id }, process, { upsert: true });

        // проверяем статус последнего шага
        if (status === 'done') {
          const edges = getEdgesByNode(currentNode);

          const edgesTrue = edges.filter(e => {
            const ot = edges.filter(e2 => e2.id !== e.id);

            // условие вычислтять на месте
            const currentExp = e.conditionEval(process.stack);
            const otherExp = ot
              .map(e2 => e2.conditionEval(process.stack))
              .some(_ => _);

            return currentExp && !otherExp;
          });

          // если перехрд не найден. инициируем выход
          if (edgesTrue.length === 0) {
            return console.log('Конец продпрограммы');
          }

          // выбираем edge для перехода
          const index =
            edgesTrue.length > 1
              ? Math.round(Math.random() * (edgesTrue.length - 1))
              : 0;
          const currentEdge = edgesTrue[index];

          // добавляем стек
          process.stack.push({
            edgeId: currentEdge.id,
            state: {},
          });

          // выполняем пресеты на edge
          if (currentEdge.roles) {
            rules.apply(currentEdge.roles).res.eval(process.stack);
          }

          // выбираем следующую node
          const nextNode = nodeMap[currentEdge.target];
          scheme = schemeMap[nextNode.scheme];

          // запускаем подпрограмму
          if (scheme && scheme.startNode.length) {
            await nextScheme(nextNode.scheme);
          } else {
            await nextStep(nextNode, process);
          }
        }
      };

      const startNode = nodes.find(node => node.id === schemeV.startNode);

      await nextStep(startNode, process);
    };

    await nextScheme(schemeId);

    return Process.findOne({ _id: process._id });
  },
};
