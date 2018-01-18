import p from './Manager';

describe('ParserRoles', () => {
  test('expression', () => {
    expect.assertions(1);

    const scheme = 'ed1473d3-6fe5-4a87-8376-9a69a3be267b';

    return p
      .run(scheme, {
        x: 1,
      })
      .then(({ stack }) => {
        stack = JSON.parse(JSON.stringify(stack));

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
      .then(({ stack }) => expect(stack[stack.length - 2].state.y).toEqual(2));
  });

  test('expression', () => {
    expect.assertions(1);

    const scheme = '63421444-e5ad-4739-a839-ab9d6636076b';

    return p
      .run(scheme, {
        x: 1,
      })
      .then(({ stack }) =>
        expect([1, 2, 3]).toEqual(
          expect.arrayContaining([stack[stack.length - 1].state.x]),
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
      .then(({ stack }) => expect(stack[0].state.x).toEqual(11));
  });

  test('expression', () => {
    expect.assertions(1);

    const scheme = '091d2aac-be73-4b88-a96b-d00fed2510f3';

    return p
      .run(scheme, {
        x: 1,
        str: 'init',
      })
      .then(({ stack }) => expect(stack[0].state.str).toEqual('init 1 2 3 4'));
  });

  test('string multiplicator', () => {
    expect.assertions(1);

    const scheme = '320093bb-6a0f-407f-9664-c5f861930e8d';

    return p
      .run(scheme, {
        str: 'a',
        mul: 10,
      })
      .then(({ stack }) => expect(stack[0].state.str).toEqual('aaaaaaaaaa'));
  });

  test('inner scheme', () => {
    expect.assertions(1);

    const scheme = '96100180-d741-4535-aa0b-90ab591956f7';

    return p
      .run(scheme, {})
      .then(({ stack }) => expect(stack[0].state.z).toEqual(10));
  });

  test('test inner scheme chain', () => {
    expect.assertions(1);

    const scheme = '60f43ecc-285a-49d2-ad97-f6061c5e30bc';

    return p
      .run(scheme, {})
      .then(({ stack }) => expect(stack[1].state.str).toEqual('fffff'));
  });
});
