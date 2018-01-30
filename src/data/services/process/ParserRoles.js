import parserjs from 'parserjs/dist';
import { getVal, setLocalVal, setGlobalVal } from './Stack';

const { parser, txt, or, reg } = parserjs;

const operators = {
  '**': (a, b) => a ** b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '%': (a, b) => a % b,
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b,
  '&&': (a, b) => a && b,
  '||': (a, b) => a || b,
};

// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
const operatorsPri = {
  '**': 15,
  '*': 14,
  '/': 14,
  '%': 14,
  '+': 13,
  '-': 13,
  '>': 11,
  '>=': 11,
  '<': 11,
  '<=': 11,
  '==': 11,
  '!=': 11,
  '&&': 6,
  '||': 5,
};

const fn = {
  random: ([n]) => Math.random(n),
  round: ([n]) => Math.round(n),
};

/**
 * Граммтика для строки
 */
export const string = reg(
  /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
).then(str => ({
  eval: _ => str.slice(1, str.length - 1),
}));

/**
 * Грамматика для Boolean
 */
export const boolean = reg(/\b(?:true|false)\b/).then(val => ({
  eval: _ => val === 'true',
}));

/**
 * Грамматика для числа. отсутствует поддержка double|float|long в связи с отсутствием поддержи в языке
 */
export const number = reg(/\b(\d*\.?\d+)\b/i).then(n => ({
  eval: _ => parseFloat(n),
})); // /\b(\d*\.?\d+\d*[dfl]?)\b/i

/**
 * Грамматика для операторов
 */
export const operator = reg(/!=|<=?|>=?|==|\+|-|\*|\/|%|&&|\|\|/).then(o => ({
  eval: _ => o,
}));

/**
 * Грамматика для пространства имен
 */
export const nameSpace = parser((str, offset) => {
  const part = reg(/[a-zA-Z\d]+/);
  const full = part.and(
    txt('.')
      .andr(part)
      .rep(),
  );
  return full.apply(str, offset);
}).then(path => ({ eval: _ => path.join('.') }));

/**
 * Грамматика для выражений.
 * Для корректной работы вополнения вырадения воспользуемся
 * "Поиск точки «перегиба» арифметического выражения"
 */
export const expression = parser((str, offset) => {
  const full = operand.and(
    operator
      .ws()
      .and(operand.ws())
      .rep()
      .ws(),
  );
  return full.apply(str, offset);
}).then(exp => {
  const findMin = (array, stack) => {
    if (array.length === 1) {
      return array[0].eval(stack);
    }
    let minIndex = 1;
    let minPriority = 1000;
    for (let index = 1; index <= array.length - 1; index += 2) {
      const op = array[index];
      const priority = operatorsPri[op.eval(stack)];
      if (minPriority >= priority) {
        minPriority = priority;
        minIndex = index;
      }
    }
    const left = array.slice(0, minIndex);
    const right = array.slice(minIndex + 1);
    const opt = array[minIndex];
    return operators[opt.eval(stack)](
      findMin(left, stack),
      findMin(right, stack),
    );
    // return {
    //   eval: stack => {
    //     const opt = array[minIndex];
    //     console.log('=====',opt)
    //     return operators[opt](findMin(right).eval(stack), findMin(left).eval(stack));
    //   },
    // };
  };

  return {
    eval: stack => findMin(exp, stack),
  };
});

/**
 * Грамматика для функций
 */
export const Function = parser((str, offset) => {
  const args = expression
    .and(
      reg(/\s*,\s*/)
        .andr(expression)
        .rep(),
    )
    .rep();

  const fn = nameSpace
    .andl(reg(/\(\s*/))
    .and(args)
    .andl(reg(/\s*\)/));

  return fn.apply(str, offset);
}).then(([name, ...args]) => ({
  eval: stack => fn[name.eval(stack)](args.map(_ => _.eval(stack))),
}));

/**
 * Грамматика для определения переменной в текущем блоке и ниже
 */
export const undefineVar = nameSpace
  .andl(reg(/\s*=\s*/))
  .and(expression)
  .then(([name, exp]) => ({
    eval: stack => {
      setGlobalVal(name.eval(stack), exp.eval(stack), stack);
    },
  }));

/**
 * Грамматика для присвоения переменной в блоке было определение или в main
 */
export const defineVar = reg(/var\s+/)
  .andr(nameSpace)
  .andl(reg(/\s*=\s*/))
  .and(expression)
  .then(([name, exp]) => ({
    eval: stack => {
      setLocalVal(name.eval(stack), exp.eval(stack), stack);
    },
  }));

export const yieldDef = reg(/yield\s+/)
  .andr(nameSpace)
  .then(name => ({
    eval: stack => {
      setLocalVal(
        name.eval(stack),
        stack[stack.length - 2].state.result,
        stack,
      );
    },
  }));

export const statement = parser((str, offset) =>
  or(block, ifElse, defineVar, undefineVar, yieldDef).apply(str, offset),
).then(st => ({
  eval: stack => st.eval(stack),
}));

const block = reg(/\s*{\s*/)
  .andr(statement.rep())
  .andl(reg(/\s*}\s*/))
  .then(statements => ({
    eval: stack => statements.forEach(sta => sta.eval(stack)),
  }));

const Else = reg(/\s*else\s*/).andr(statement);

export const ifElse = parser((str, offset) =>
  reg(/\s*if\s*\(\s*/)
    .andr(expression)
    .andl(reg(/\s*\)\s*/))
    .and(statement)
    .and(Else.opt())
    .apply(str, offset),
).then(([exp, st, els]) => ({
  eval: stack => {
    if (exp.eval(stack)) {
      st.eval(stack);
    } else if (els) {
      els.eval(stack);
    }
    return stack;
  },
}));

export const script = statement
  .ws()
  .rep()
  .then(statements => ({
    eval: stack => {
      statements.forEach(st => st.eval(stack));
    },
  }));

const nameSpaceGet = nameSpace.then(c => ({
  eval: stack => getVal(c.eval(stack), stack),
}));

const bracketExpression = parser((str, offset) =>
  reg(/\s*\(\s*/)
    .andr(expression)
    .andl(reg(/\s*\)\s*/))
    .apply(str, offset),
);

export const operand = reg(/([-!])/)
  .ws()
  .opt()
  .and(
    or(Function, string, number, boolean, nameSpaceGet, bracketExpression).ws(),
  )
  .then(([unary, op]) => ({
    eval: stack => {
      if (unary === '-') {
        return -op.eval(stack);
      } else if (unary === '!') {
        return !op.eval(stack);
      }
      return op.eval(stack);
    },
  }));

export default {
  script,
  ifElse,
  undefineVar,
  defineVar,
  string,
  boolean,
  Function,
  number,
  nameSpace,
  expression,
};
