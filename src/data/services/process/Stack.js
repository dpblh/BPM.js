export const getVal = (nameSpace, stack) => {
  /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
  for (let i = stack.length - 1; i >= 0; i--) {
    const val = stack[i].state[nameSpace];
    if (val !== undefined) {
      return val;
    }
  }
  return undefined;
};

export const setLocalVal = (nameSpace, val, stack) => {
  stack[stack.length - 1].state[nameSpace] = val;
};

export const setGlobalVal = (nameSpace, val, stack) => {
  let currentStack;
  for (let i = stack.length - 1; i >= 0; i--) {
    currentStack = stack[i];
    const currentVal = currentStack.state[nameSpace];
    if (currentVal !== undefined) {
      currentStack.state[nameSpace] = val;
      return;
    }
  }
  currentStack = stack[0];
  currentStack.state[nameSpace] = val;
};
