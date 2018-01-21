import mongoose from 'mongoose';
import _ from 'lodash';
import Process from '../../models/Process';
import Scheme from '../../models/Scheme';
import Node from '../../models/Node';
import Edge from '../../models/Edge';
import { getVal, setLocalVal, setGlobalVal } from './Stack';
import { script as rules } from './ParserRoles';
import SchemeV from '../../virtualizers/scheme';
import NodeV from '../../virtualizers/node';
import EdgeV from '../../virtualizers/edge';

const listener = {
  test_1: (getVar, setVar) => ({
    result: getVar('x') ** getVar('x'),
    status: 'done',
  }),
  test_2: (getVar, setVar) => ({
    result: getVar('y') - getVar('x'),
    status: 'done',
  }),
  test_await: (getVar, setVar) => ({
    result: 1,
    status: 'await',
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
  async resume(id, status) {
    if (status === 'done') {
      const process = await Process.findById(id);

      const { edgeId } = process.stack[process.stack.length - 1];

      const nodeId = await Edge.findById(edgeId).then(
        e => new EdgeV(e).attrs(process.timestamp).target,
      );

      await this.next({ nodeId, process });
    }
  },
  async next({ nodeId, schemeId, process }) {
    const { timestamp } = process;

    const schemes = await Scheme.find({}).then(s =>
      s.map(edge => new SchemeV(edge).attrs(timestamp)),
    );
    const nodes = await Node.find({}).then(s =>
      s.map(edge => new NodeV(edge).attrs(timestamp)),
    );
    const edges = await Edge.find({}).then(s =>
      s.map(edge => new EdgeV(edge).attrs(timestamp)),
    );

    const schemeMap = toMap(schemes, 'id');
    const nodeMap = toMap(nodes, 'id');

    const edgesSourceMap = _.groupBy(edges, 'source');
    const getEdgesByNode = node => edgesSourceMap[node.id] || [];

    const nextScheme = async id => {
      const scheme = schemeMap[id];

      const startNode = nodeMap[scheme.startNode];

      await currentStep(startNode);
    };

    const nextStep = async prevNode => {
      // поиск следующего перехода
      const availableEdges = getEdgesByNode(prevNode);

      const edgesTrue = availableEdges.filter(e => {
        const ot = availableEdges.filter(e2 => e2.id !== e.id);

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
      const currentNode = nodeMap[currentEdge.target];

      const scheme = schemeMap[currentNode.scheme];

      if (scheme && scheme.startNode) {
        await nextScheme(currentNode.scheme);
      } else {
        await currentStep(currentNode);
      }
    };

    const currentStep = async currentNode => {
      const { status, result } = await runScheme(
        currentNode.scheme,
        process.stack,
      );

      setLocalVal('result', result, process.stack);

      // сохраняем промежуточный редультат
      await Process.update({ _id: process._id }, process, { upsert: true });

      // проверяем статус последнего шага
      if (status === 'done') {
        // запускаем подпрограмму
        await nextStep(currentNode);
      }
    };

    if (nodeId) {
      await nextStep(nodeMap[nodeId]);
    } else if (schemeId) {
      await nextScheme(schemeId);
    }
  },
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

    await this.next({ schemeId, process });

    return Process.findOne({ _id: process._id });
  },
};
