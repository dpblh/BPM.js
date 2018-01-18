/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */
import _ from 'lodash';
import { getVal, setLocalVal, setGlobalVal } from './Stack';

describe('Stack', () => {
  const stack = [
    {
      edgeId: 'main',
      state: {
        a: 1,
        b: 2,
      },
    },
    {
      edgeId: 'qwe',
      state: {
        a: 4,
      },
    },
    {
      edgeId: 'ert',
      state: {
        c: 5,
      },
    },
  ];

  let test1;

  beforeEach(() => {
    test1 = _.cloneDeep(stack);
  });

  test('getVal', () => {
    expect(getVal('a', stack)).toEqual(4);
    expect(getVal('b', stack)).toEqual(2);
    expect(getVal('c', stack)).toEqual(5);
  });

  test('setLocalVal', () => {
    setLocalVal('a', 5, test1);
    expect(test1).toEqual([
      {
        edgeId: 'main',
        state: {
          a: 1,
          b: 2,
        },
      },
      {
        edgeId: 'qwe',
        state: {
          a: 4,
        },
      },
      {
        edgeId: 'ert',
        state: {
          c: 5,
          a: 5,
        },
      },
    ]);
  });
  test('setGlobalVal', () => {
    setGlobalVal('a', 5, test1);
    expect(test1).toEqual([
      {
        edgeId: 'main',
        state: {
          a: 1,
          b: 2,
        },
      },
      {
        edgeId: 'qwe',
        state: {
          a: 5,
        },
      },
      {
        edgeId: 'ert',
        state: {
          c: 5,
        },
      },
    ]);
  });
});
