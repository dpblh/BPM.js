import Scheme from './data/models/Scheme';
import Node from './data/models/Node';
import Edge from './data/models/Edge';

const seed = async () => {
  console.log('seed start !!!!');
  try {
    // const scheme1 = {
    //   _id: 'test_1',
    //   name: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: 'Первая схема 1',
    //     },
    //     {
    //       timestamp: Date.now(),
    //       value: 'Первая схема 2',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now() - 1000000,
    //       value: 'Описание 1',
    //     },
    //     {
    //       timestamp: Date.now() - 20000,
    //       value: 'Описание 2',
    //     },
    //   ],
    //   startNode: [],
    // };
    //
    // await Scheme.update({ _id: scheme1._id }, scheme1, { upsert: true });
    //
    // const scheme2 = {
    //   _id: 'test_2',
    //   name: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: 'Вторая схема 1',
    //     },
    //     {
    //       timestamp: Date.now(),
    //       value: 'Вторая схема 2',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now() - 1000000,
    //       value: 'Описание 1',
    //     },
    //     {
    //       timestamp: Date.now() - 20000,
    //       value: 'Описание 2',
    //     },
    //   ],
    //   startNode: [],
    // };
    //
    // await Scheme.update({ _id: scheme2._id }, scheme2, { upsert: true });
    //
    // const node1 = {
    //   _id: 'node_1',
    //   name: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: 'Первая нода название',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Первая нода описание',
    //     },
    //   ],
    //   position: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: {
    //         x: 100,
    //         y: 100,
    //       },
    //     },
    //     {
    //       timestamp: Date.now() - 10,
    //       value: {
    //         x: 300,
    //         y: 200,
    //       },
    //     },
    //   ],
    //   scheme: scheme1._id,
    // };
    //
    // await Node.update({ _id: node1._id }, node1, { upsert: true });
    //
    // const node2 = {
    //   _id: 'node_2',
    //   name: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: 'Вторая нода название',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Вторая нода описание',
    //     },
    //   ],
    //   position: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: {
    //         x: 400,
    //         y: 300,
    //       },
    //     },
    //     {
    //       timestamp: Date.now() - 10,
    //       value: {
    //         x: 540,
    //         y: 100,
    //       },
    //     },
    //   ],
    //   scheme: scheme2._id,
    // };
    //
    // await Node.update({ _id: node2._id }, node2, { upsert: true });
    //
    // const node3 = {
    //   _id: 'node_3',
    //   name: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: 'Вторая нода название',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Вторая нода описание',
    //     },
    //   ],
    //   position: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: {
    //         x: 400,
    //         y: 300,
    //       },
    //     },
    //     {
    //       timestamp: Date.now() - 10,
    //       value: {
    //         x: 540,
    //         y: 100,
    //       },
    //     },
    //   ],
    //   scheme: scheme2._id,
    // };
    //
    // await Node.update({ _id: node3._id }, node3, { upsert: true });
    //
    // const edge1 = {
    //   _id: 'edge_1',
    //   source: [
    //     {
    //       timestamp: Date.now(),
    //       value: node1._id,
    //     },
    //   ],
    //   target: [
    //     {
    //       timestamp: Date.now(),
    //       value: node1._id,
    //     },
    //   ],
    //   roles: [
    //     {
    //       timestamp: Date.now(),
    //       value: '11111',
    //     },
    //   ],
    //   condition: [],
    // };
    //
    // await Edge.update({ _id: edge1._id }, edge1, { upsert: true });
    //
    // const edge2 = {
    //   _id: 'edge_2',
    //   source: [
    //     {
    //       timestamp: Date.now(),
    //       value: node1._id,
    //     },
    //   ],
    //   target: [
    //     {
    //       timestamp: Date.now(),
    //       value: node2._id,
    //     },
    //   ],
    //   roles: [
    //     {
    //       timestamp: Date.now(),
    //       value: '112222111',
    //     },
    //   ],
    //   condition: [],
    // };
    //
    // await Edge.update({ _id: edge2._id }, edge2, { upsert: true });
    //
    // const edge3 = {
    //   _id: 'edge_3',
    //   source: [
    //     {
    //       timestamp: Date.now(),
    //       value: node2._id,
    //     },
    //   ],
    //   target: [
    //     {
    //       timestamp: Date.now(),
    //       value: node1._id,
    //     },
    //   ],
    //   roles: [
    //     {
    //       timestamp: Date.now(),
    //       value: '112222111',
    //     },
    //   ],
    //   condition: [],
    // };
    //
    // await Edge.update({ _id: edge3._id }, edge3, { upsert: true });
    //
    // const edge4 = {
    //   _id: 'edge_4',
    //   source: [
    //     {
    //       timestamp: Date.now(),
    //       value: node2._id,
    //     },
    //   ],
    //   target: [
    //     {
    //       timestamp: Date.now(),
    //       value: node3._id,
    //     },
    //   ],
    //   roles: [
    //     {
    //       timestamp: Date.now(),
    //       value: '112222111',
    //     },
    //   ],
    //   condition: [],
    // };
    //
    // await Edge.update({ _id: edge4._id }, edge4, { upsert: true });
    //
    // const edge5 = {
    //   _id: 'edge_5',
    //   source: [
    //     {
    //       timestamp: Date.now(),
    //       value: node3._id,
    //     },
    //   ],
    //   target: [
    //     {
    //       timestamp: Date.now(),
    //       value: node1._id,
    //     },
    //   ],
    //   roles: [
    //     {
    //       timestamp: Date.now(),
    //       value: '112222111',
    //     },
    //   ],
    //   condition: [],
    // };
    //
    // await Edge.update({ _id: edge5._id }, edge5, { upsert: true });
    //
    // const scheme3 = {
    //   _id: 'test_3',
    //   name: [
    //     {
    //       timestamp: Date.now() - 100000,
    //       value: 'Вторая схема 1',
    //     },
    //     {
    //       timestamp: Date.now(),
    //       value: 'Вторая схема 2',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now() - 1000000,
    //       value: 'Описание 1',
    //     },
    //     {
    //       timestamp: Date.now() - 20000,
    //       value: 'Описание 2',
    //     },
    //   ],
    //   startNode: [
    //     {
    //       timestamp: Date.now(),
    //       value: node1._id,
    //     },
    //   ],
    // };
    //
    // await Scheme.update({ _id: scheme3._id }, scheme3, { upsert: true });
    //
    // const scheme4 = {
    //   _id: 'test_await',
    //   name: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Схема await',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now() - 20000,
    //       value: 'Тест await',
    //     },
    //   ],
    //   startNode: [],
    // };
    //
    // await Scheme.update({ _id: scheme4._id }, scheme3, { upsert: true });

    // const scheme5 = {
    //   _id: 'await_all',
    //   name: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Схема await all',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now() - 20000,
    //       value: 'Тест await',
    //     },
    //   ],
    //   startNode: [],
    // };
    //
    // await Scheme.update({ _id: scheme5._id }, scheme5, { upsert: true });

    // const scheme6 = {
    //   _id: 'throw_handler',
    //   name: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Схема throw handler',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Тест исключения внутри handler',
    //     },
    //   ],
    //   startNode: [],
    // };
    //
    // await Scheme.update({ _id: scheme6._id }, scheme6, { upsert: true });

    // const scheme7 = {
    //   _id: 'throw_behavior',
    //   name: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Схема throw behavior',
    //     },
    //   ],
    //   desc: [
    //     {
    //       timestamp: Date.now(),
    //       value: 'Тест исключения внутри behavior',
    //     },
    //   ],
    //   startNode: [],
    // };
    //
    // await Scheme.update({ _id: scheme7._id }, scheme7, { upsert: true });

    const scheme8 = {
      _id: 'test_arguments',
      name: [
        {
          timestamp: Date.now(),
          value: 'Схема set arguments',
        },
      ],
      desc: [
        {
          timestamp: Date.now(),
          value: 'Тест передачи аргументов',
        },
      ],
      startNode: [],
    };

    await Scheme.update({ _id: scheme8._id }, scheme8, { upsert: true });
  } catch (e) {
    console.log(e);
  }

  console.log('seed end !!!!');
};

seed();
