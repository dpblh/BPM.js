import nodeFetch from 'node-fetch';
import p from './Manager';
import createFetch from '../../../createFetch';
import config from '../../../config';
import Process from '../../models/Process';

describe('ParserRoles', () => {
  const fetch = createFetch(nodeFetch, {
    baseUrl: config.api.serverUrl,
  });

  // test('expression', () => {
  //   expect.assertions(1);
  //
  //   const scheme = 'ed1473d3-6fe5-4a87-8376-9a69a3be267b';
  //
  //   return p
  //     .run(scheme, {
  //       x: 1,
  //     })
  //     .then(({ context }) => {
  //       const stack = JSON.parse(JSON.stringify(context.main.stack));
  //
  //       return expect(stack).toEqual([
  //         { state: { z: 1, result: 1, x: 3 }, edgeId: 'main' },
  //         {
  //           edgeId: 'a7f5418c-bc22-4363-be6c-3e791f753062',
  //           state: { result: -1, y: 100 },
  //         },
  //         {
  //           edgeId: 'b60ba004-7da2-436d-b0ab-36885dfc52e3',
  //           state: { result: 97 },
  //         },
  //       ]);
  //     });
  // });
  // test('expression', () => {
  //   expect.assertions(1);
  //
  //   const scheme = 'f6500c7c-b64c-420c-8b28-b64d2e2d8917';
  //
  //   return p
  //     .run(scheme, {
  //       x: 1,
  //     })
  //     .then(({ context }) =>
  //       expect(
  //         context.main.stack[context.main.stack.length - 2].state.y,
  //       ).toEqual(2),
  //     );
  // });
  //
  // test('expression', () => {
  //   expect.assertions(1);
  //
  //   const scheme = '63421444-e5ad-4739-a839-ab9d6636076b';
  //
  //   return p
  //     .run(scheme, {
  //       x: 1,
  //     })
  //     .then(({ context }) =>
  //       expect([1, 2, 3]).toEqual(
  //         expect.arrayContaining([
  //           context.main.stack[context.main.stack.length - 1].state.x,
  //         ]),
  //       ),
  //     );
  // });
  //
  // test('loop', () => {
  //   expect.assertions(1);
  //
  //   const scheme = 'bfa3ab96-68d2-4ac2-af3b-3f8f864317ea';
  //
  //   return p
  //     .run(scheme, {
  //       x: 1,
  //     })
  //     .then(({ context }) => expect(context.main.stack[0].state.x).toEqual(11));
  // });
  //
  // test('expression', () => {
  //   expect.assertions(1);
  //
  //   const scheme = '091d2aac-be73-4b88-a96b-d00fed2510f3';
  //
  //   return p
  //     .run(scheme, {
  //       x: 1,
  //       str: 'init',
  //     })
  //     .then(({ context }) =>
  //       expect(context.main.stack[0].state.str).toEqual('init 1 2 3 4'),
  //     );
  // });
  //
  // test('string multiplicator', () => {
  //   expect.assertions(1);
  //
  //   const scheme = '320093bb-6a0f-407f-9664-c5f861930e8d';
  //
  //   return p
  //     .run(scheme, {
  //       str: 'a',
  //       mul: 10,
  //     })
  //     .then(({ context }) =>
  //       expect(context.main.stack[0].state.str).toEqual('aaaaaaaaaa'),
  //     );
  // });
  // //
  // test('inner scheme', () => {
  //   expect.assertions(1);
  //
  //   const scheme = '96100180-d741-4535-aa0b-90ab591956f7';
  //
  //   return p
  //     .run(scheme, {})
  //     .then(({ context }) => expect(context.main.stack[0].state.z).toEqual(10));
  // });
  //
  // test('test inner scheme chain', () => {
  //   expect.assertions(1);
  //
  //   const scheme = '60f43ecc-285a-49d2-ad97-f6061c5e30bc';
  //
  //   return p.run(scheme).then(({ context }) => {
  //     console.log(context.main.stack);
  //     expect(context.main.stack[1].state.str).toEqual('fffff');
  //   });
  // });
  //
  // test('test await', async () => {
  //   expect.assertions(3);
  //
  //   const scheme = '5cc7c1b5-45bf-4a88-814a-31bfcd877c66';
  //
  //   const { context, _id } = await p.run(scheme);
  //
  //   expect(context.main.stack.length).toEqual(2);
  //
  //   const resp = await fetch('/graphql', {
  //     body: JSON.stringify({
  //       query: `mutation($processId: String!, $contextId: String!, $status: String!) {
  //         resumeScheme(processId: $processId, contextId: $contextId, status: $status)
  //       }`,
  //       variables: {
  //         processId: _id,
  //         contextId: 'main',
  //         status: 'done',
  //       },
  //     }),
  //   }).then(response => response.json());
  //
  //   expect(resp.data.resumeScheme).toEqual(true);
  //
  //   const process = await Process.findById(_id);
  //
  //   expect(process.context.main.stack.length).toEqual(3);
  // });

  test('complex async await', async () => {
    expect.assertions(4);

    const scheme = '4bfa14d2-6fe6-45d8-81bc-d981b44db5bb';

    let process = await p.run(scheme, {});
    // .then(async process => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!_id_id_id_id_id', process._id);

    const event1 = process.eventAwaitLoop[0];

    const resp1 = await fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation($processId: String!, $contextId: String!, $status: String!) {
            resumeScheme(processId: $processId, contextId: $contextId, status: $status)
          }`,
        variables: {
          processId: process._id,
          contextId: event1.contextId,
          status: 'done',
        },
      }),
    }).then(response => response.json());

    expect(resp1.data.resumeScheme).toEqual(true);

    process = await Process.findById(process._id);

    const event2 = process.eventAwaitLoop[0];
    const event3 = process.eventAwaitLoop[1];

    const resp2 = await fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation($processId: String!, $contextId: String!, $status: String!) {
            resumeScheme(processId: $processId, contextId: $contextId, status: $status)
          }`,
        variables: {
          processId: process._id,
          contextId: event2.contextId,
          status: 'done',
        },
      }),
    }).then(response => response.json());

    expect(resp2.data.resumeScheme).toEqual(true);

    const resp3 = await fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation($processId: String!, $contextId: String!, $status: String!) {
            resumeScheme(processId: $processId, contextId: $contextId, status: $status)
          }`,
        variables: {
          processId: process._id,
          contextId: event3.contextId,
          status: 'done',
        },
      }),
    }).then(response => response.json());

    expect(resp3.data.resumeScheme).toEqual(true);

    process = await Process.findById(process._id);

    expect(Object.values(process.context)).toMatchObject(
      Object.values({
        '5a72258f5990ad653c832bd1': {
          stack: [
            {
              state: {
                result: NaN,
                x: 15,
                a: 3,
              },
              edgeId: '4d7c57c8-40a3-4364-a9b1-75fed9d4c6c1',
            },
            {
              state: {
                result: 1,
                a: 999,
              },
              edgeId: 'cd1b9985-9536-4bb6-90a6-ced8d71d5ea7',
            },
            {
              edgeId: '6f8a16d1-7093-4082-9981-9d89cddd33be',
              state: {
                step3: 1,
                a: 5,
                result: 1,
              },
            },
          ],
          parentContextPosition: 1,
          parentContextId: 'main',
        },
        '5a72258f5990ad653c832bd0': {
          stack: [
            {
              state: {
                result: NaN,
                a: 4,
              },
              edgeId: 'b06339b0-bed5-44ba-97e2-ed81e1c2d259',
            },
            {
              state: {
                result: 1,
                a: 6,
                step4: NaN,
              },
              edgeId: '2c2cd1b8-1cca-4ee4-91f6-708f7f04abc5',
            },
          ],
          parentContextPosition: 1,
          parentContextId: 'main',
        },
        main: {
          stack: [
            {
              state: {
                result: 1,
                a: 3,
                x: 15,
              },
              edgeId: 'main',
            },
            {
              state: {
                result: -5,
                y: 5,
                x: 10,
                a: 1,
              },
              edgeId: '998bbdcf-5b25-496e-93fd-33062be6bdc0',
            },
            {
              state: {
                result: -5,
                a: 2,
                step: -5,
              },
              edgeId: '580e5381-ff26-44ef-8b47-10eef7f1d8e4',
            },
          ],
        },
        '5a722590b48b2362430893c9': {
          parentContextId: 'main',
          parentContextPosition: 1,
          stack: [
            {
              edgeId: '281682b9-0f9b-4aba-9a35-a98fe04e0d78',
              state: {
                a: 7,
                result: 1,
                str: 'second',
              },
            },
          ],
        },
        '5a722590b48b2362430893cc': {
          parentContextId: expect.stringMatching(/.+/),
          parentContextPosition: 1,
          stack: [
            {
              edgeId: '27438440-975c-40e4-9b52-cbe6ec8f37e8',
              state: {
                str: 'first',
                result: 1,
              },
            },
            {
              edgeId: '7ac7b467-852a-4e24-b4c4-8026220d7b96',
              state: {
                str: '3',
                result: 1,
              },
            },
          ],
        },
        '5a722590b48b2362430893cd': {
          parentContextId: expect.stringMatching(/.+/),
          parentContextPosition: 1,
          stack: [
            {
              edgeId: 'e67e3929-0b1b-4281-9997-817ac406656c',
              state: {
                str: 'second',
                result: 1,
              },
            },
            {
              edgeId: '0cc893c4-8b5d-4b63-a4e5-4bb4d00f1a23',
              state: {
                str: '5',
                result: 1,
              },
            },
          ],
        },
        '5a722590b48b2362430893d0': {
          parentContextId: expect.stringMatching(/.+/),
          parentContextPosition: 1,
          stack: [
            {
              edgeId: '6ffeab2a-b57d-4bd1-8d2d-366e645b64d6',
              state: {
                str: '6',
                result: NaN,
              },
            },
          ],
        },
      }),
    );
  });

  //  4bfa14d2-6fe6-45d8-81bc-d981b44db5bb
});
