import nodeFetch from 'node-fetch';
import p from './Manager';
import createFetch from '../../../createFetch';
import config from '../../../config';
import Process from '../../models/Process';

describe('ParserRoles', () => {
  const fetch = createFetch(nodeFetch, {
    baseUrl: config.api.serverUrl,
  });

  test('expression', () => {
    expect.assertions(1);

    const scheme = 'ed1473d3-6fe5-4a87-8376-9a69a3be267b';

    return p
      .run(scheme, {
        x: 1,
      })
      .then(({ context }) => {
        const stack = JSON.parse(JSON.stringify(context.main.stack));

        return expect(stack).toEqual([
          { state: { z: 1, result: 1, x: 3 }, edgeId: 'main' },
          {
            edgeId: 'a7f5418c-bc22-4363-be6c-3e791f753062',
            state: { result: -1, y: 100 },
          },
          {
            edgeId: 'b60ba004-7da2-436d-b0ab-36885dfc52e3',
            state: { result: 97 },
          },
        ]);
      });
  });
  test('expression', () => {
    expect.assertions(1);

    const scheme = 'f6500c7c-b64c-420c-8b28-b64d2e2d8917';

    return p
      .run(scheme, {
        x: 1,
      })
      .then(({ context }) =>
        expect(
          context.main.stack[context.main.stack.length - 2].state.y,
        ).toEqual(2),
      );
  });

  test('expression', () => {
    expect.assertions(1);

    const scheme = '63421444-e5ad-4739-a839-ab9d6636076b';

    return p
      .run(scheme, {
        x: 1,
      })
      .then(({ context }) =>
        expect([1, 2, 3]).toEqual(
          expect.arrayContaining([
            context.main.stack[context.main.stack.length - 1].state.x,
          ]),
        ),
      );
  });

  test('loop', () => {
    expect.assertions(1);

    const scheme = 'bfa3ab96-68d2-4ac2-af3b-3f8f864317ea';

    return p
      .run(scheme, {
        x: 1,
      })
      .then(({ context }) => expect(context.main.stack[0].state.x).toEqual(11));
  });

  test('expression', () => {
    expect.assertions(1);

    const scheme = '091d2aac-be73-4b88-a96b-d00fed2510f3';

    return p
      .run(scheme, {
        x: 1,
        str: 'init',
      })
      .then(({ context }) =>
        expect(context.main.stack[0].state.str).toEqual('init 1 2 3 4'),
      );
  });

  test('string multiplicator', () => {
    expect.assertions(1);

    const scheme = '320093bb-6a0f-407f-9664-c5f861930e8d';

    return p
      .run(scheme, {
        str: 'a',
        mul: 10,
      })
      .then(({ context }) =>
        expect(context.main.stack[0].state.str).toEqual('aaaaaaaaaa'),
      );
  });
  //
  test('inner scheme', () => {
    expect.assertions(1);

    const scheme = '96100180-d741-4535-aa0b-90ab591956f7';

    return p
      .run(scheme, {})
      .then(({ context }) => expect(context.main.stack[0].state.z).toEqual(10));
  });

  test('test inner scheme chain', () => {
    expect.assertions(1);

    const scheme = '60f43ecc-285a-49d2-ad97-f6061c5e30bc';

    return p.run(scheme).then(({ context }) => {
      console.log(context.main.stack);
      expect(context.main.stack[1].state.str).toEqual('fffff');
    });
  });

  test('test await', async () => {
    expect.assertions(3);

    const scheme = '5cc7c1b5-45bf-4a88-814a-31bfcd877c66';

    const { context, _id } = await p.run(scheme);

    expect(context.main.stack.length).toEqual(2);

    const resp = await fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation($processId: String!, $contextId: String!, $status: String!) {
          resumeScheme(processId: $processId, contextId: $contextId, status: $status)
        }`,
        variables: {
          processId: _id,
          contextId: 'main',
          status: 'done',
        },
      }),
    }).then(response => response.json());

    expect(resp.data.resumeScheme).toEqual(true);

    const process = await Process.findById(_id);

    expect(process.context.main.stack.length).toEqual(3);
  });

  test('complex async await', () => {
    expect.assertions(1);

    const scheme = '4bfa14d2-6fe6-45d8-81bc-d981b44db5bb';

    return p.run(scheme, {}).then(process => {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!_id_id_id_id_id', process._id);
      expect(Object.values(process.context)).toMatchObject(
        Object.values({
          main: {
            stack: [
              { edgeId: 'main', state: { result: 1 } },
              {
                edgeId: '998bbdcf-5b25-496e-93fd-33062be6bdc0',
                state: { a: 1, x: 10, y: 5, result: -5 },
              },
              {
                edgeId: '580e5381-ff26-44ef-8b47-10eef7f1d8e4',
                state: { step: -5, a: 2, result: -5 },
              },
            ],
          },
          '5a6e1e929d20d53c242d03b3': {
            parentContextId: 'main',
            stack: [
              {
                edgeId: 'b06339b0-bed5-44ba-97e2-ed81e1c2d259',
                state: { a: 4, result: NaN },
              },
              {
                edgeId: '2c2cd1b8-1cca-4ee4-91f6-708f7f04abc5',
                state: { step4: NaN, a: 6, result: 1 },
              },
            ],
          },
          '5a6e1e929d20d53c242d03b2': {
            parentContextId: 'main',
            stack: [
              {
                edgeId: '4d7c57c8-40a3-4364-a9b1-75fed9d4c6c1',
                state: { a: 3, x: 15, result: NaN },
              },
              {
                edgeId: 'cd1b9985-9536-4bb6-90a6-ced8d71d5ea7',
                state: { step3: NaN, a: 5, result: 1 },
              },
            ],
          },
          '5a6e1e929d20d53c242d03ba': {
            parentContextId: 'main',
            stack: [
              {
                edgeId: '281682b9-0f9b-4aba-9a35-a98fe04e0d78',
                state: { a: 7, result: NaN },
              },
            ],
          },
        }),
      );
    });
  });

  //  4bfa14d2-6fe6-45d8-81bc-d981b44db5bb
});
