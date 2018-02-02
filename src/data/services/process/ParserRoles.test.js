/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */
import _ from 'lodash';
import {
  string,
  boolean,
  Function,
  number,
  nameSpace,
  expression,
  defineVar,
  undefineVar,
  ifElse,
  script,
} from './ParserRoles';

describe('ParserRoles', () => {
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
        a: 1,
      },
    },
  ];

  let test1;

  beforeEach(() => {
    test1 = _.cloneDeep(stack);
  });

  test('string', () => {
    expect(string.apply('"a"').res.eval(test1)).toEqual('a');
    expect(string.apply('"a\\""').res.eval(test1)).toEqual('a\\"');
  });
  test('boolean', () => {
    expect(boolean.apply('true').res.eval(test1)).toEqual(true);
    expect(boolean.apply('false').res.eval(test1)).toEqual(false);
  });
  test('number', () => {
    expect(number.apply('1').res.eval(test1)).toEqual(1);
    expect(number.apply('123').res.eval(test1)).toEqual(123);
    expect(number.apply('123.12').res.eval(test1)).toEqual(123.12);
  });
  test('nameSpace', () => {
    expect(nameSpace.apply('a').res.eval(test1)).toEqual('a');
    expect(nameSpace.apply('Hello').res.eval(test1)).toEqual('Hello');
    expect(nameSpace.apply('Hello.World').res.eval(test1)).toEqual(
      'Hello.World',
    );
  });
  describe('test `defineVar`', () => {
    test('check simple name', () => {
      expect(defineVar.apply('var b = 1').res.eval(test1)).toEqual(undefined);
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
            a: 1,
            b: 1,
          },
        },
      ]);
    });
    test('check nameSpace', () => {
      expect(defineVar.apply('var a.w.r = 1+2').res.eval(test1)).toEqual(
        undefined,
      );
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
            a: 1,
            'a.w.r': 3,
          },
        },
      ]);
    });
  });
  describe('test `undefineVar`', () => {
    test('check simple name', () => {
      expect(undefineVar.apply('a = 2').res.eval(test1)).toEqual(undefined);
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
            a: 2,
          },
        },
      ]);
    });
    test('check nameSpace', () => {
      expect(undefineVar.apply('a.w.r = 1+2').res.eval(test1)).toEqual(
        undefined,
      );
      expect(test1).toEqual([
        {
          edgeId: 'main',
          state: {
            a: 1,
            b: 2,
            'a.w.r': 3,
          },
        },
        {
          edgeId: 'qwe',
          state: {
            a: 1,
          },
        },
      ]);
    });
  });
  test('expression', () => {
    expect(expression.apply('a').res.eval(test1)).toEqual(1);
    expect(expression.apply('a+b').res.eval(test1)).toEqual(3);
    expect(expression.apply('a +    b * 3 % 4').res.eval(test1)).toEqual(3);
    expect(expression.apply('a +  b -  b * 3 % 4').res.eval(test1)).toEqual(1);
    expect(expression.apply('a +  b || 1').res.eval(test1)).toEqual(3);
    expect(expression.apply('a +  b && b').res.eval(test1)).toEqual(2);
    expect(expression.apply('a && b').res.eval(test1)).toEqual(2);
    expect(expression.apply('a > b').res.eval(test1)).toEqual(false);
    expect(expression.apply('a > b && 5').res.eval(test1)).toEqual(false);
    expect(expression.apply('a < b && 5').res.eval(test1)).toEqual(5);
    expect(expression.apply('(a+1)').res.eval(test1)).toEqual(2);
    expect(expression.apply('(    a+1)*3').res.eval(test1)).toEqual(6);
    expect(expression.apply('a +  b -  b * (3 % 4)').res.eval(test1)).toEqual(
      -3,
    );
    expect(expression.apply('true || false && true').res.eval(test1)).toEqual(
      true,
    );
    expect(expression.apply('   !   true   ').res.eval(test1)).toEqual(false);
    expect(expression.apply('-1').res.eval(test1)).toEqual(-1);
    expect(expression.apply('-(a+b)').res.eval(test1)).toEqual(-3);
    expect(expression.apply('>== 1')).toEqual(false);
    expect(expression.apply('d >== 1').pos).toEqual(2);
    expect(expression.apply('a == 1').pos).toEqual(6);
  });
  test('Function', () => {
    expect(Function.apply('random(10)').res.eval(test1)).toBeGreaterThan(0);
    expect(Function.apply('random(10)').res.eval(test1)).toBeLessThan(10);
    expect(Function.apply('round( 3 / 100 * 50)').res.eval(test1)).toEqual(2);
    expect(Function.apply('a( a , b )').pos).toEqual(10);
    expect(Function.apply('asd.sdf.dfg( a , b )').pos).toEqual(20);
    expect(Function.apply('a(a,b,c)').pos).toEqual(8);
    expect(
      Function.apply(
        'a( a, b   ,c, 1, "asd asd + asd", a.s.v, true, false, asd())',
      ).pos,
    ).toEqual(60);
  });
  describe('test `if else`', () => {
    test('if statement 1', () => {
      expect(
        ifElse
          .apply(
            `if ( x ) {
            var x = 1
            y = 2
          }`,
          )
          .res.eval(test1),
      ).toEqual([
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
            a: 1,
          },
        },
      ]);
    });
    test('if statement 2', () => {
      expect(
        ifElse
          .apply(
            `if ( b == 2 ) {
            var b = round(5.5)
            a = 20
          }`,
          )
          .res.eval(test1),
      ).toEqual([
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
            a: 20,
            b: 6,
          },
        },
      ]);
    });
    test('nested if', () => {
      expect(
        ifElse
          .apply(
            `if ( b == 2 ) {
            var b = round(5.5)
            if (a > 0) {
              a = -20
              c = 3 + 2
            }
          }`,
          )
          .res.eval(test1),
      ).toEqual([
        {
          edgeId: 'main',
          state: {
            a: 1,
            b: 2,
            c: 5,
          },
        },
        {
          edgeId: 'qwe',
          state: {
            a: -20,
            b: 6,
          },
        },
      ]);
    });
    test('if else', () => {
      expect(
        ifElse
          .apply(
            `if ( x ) {
            a = 10
          } else {
            a = 20
          }`,
          )
          .res.eval(test1),
      ).toEqual([
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
            a: 20,
          },
        },
      ]);
    });
    test('if else without block', () => {
      expect(
        ifElse
          .apply(
            `if ( x ) a = 10 
           else a = 20`,
          )
          .res.eval(test1),
      ).toEqual([
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
            a: 20,
          },
        },
      ]);
    });
    test('if else if else', () => {
      expect(
        ifElse
          .apply(
            `if ( a == 3 ) a = 10 
           else if ( a == 2 ) a = 20
           else a = 30`,
          )
          .res.eval(test1),
      ).toEqual([
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
            a: 30,
          },
        },
      ]);
    });
  });
  describe('test `script`', () => {
    test('simple statement', () => {
      script.apply(`a = a + 1`).res.eval(test1);
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
            a: 2,
          },
        },
      ]);
    });
    test('test multiple statements', () => {
      script
        .apply(
          `b = b + 1
         a = 4`,
        )
        .res.eval(test1);
      expect(test1).toEqual([
        {
          edgeId: 'main',
          state: {
            a: 1,
            b: 3,
          },
        },
        {
          edgeId: 'qwe',
          state: {
            a: 4,
          },
        },
      ]);
    });
  });
});
