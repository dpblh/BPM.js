import Prism from 'prismjs';

Prism.languages.roles = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
    },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  keyword: /\b(?:if|else|var|yield|args)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /[a-z0-9_]+(?=\()/i,
  number: /\b(\d*\.?\d+e?\d*[dfl]?)\b/i,
  operator: /--?|\+\+?|!=?|<=?|>=?|==?|&&|\|\||\*|%/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.condition = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
    },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  boolean: /\b(?:true|false)\b/,
  function: /[a-z0-9_]+(?=\()/i,
  number: /\b(\d*\.?\d+e?\d*[dfl]?)\b/i,
  operator: /!=?|<=?|>=?|==?|&&|\|\||\*|%/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.planeText = {};

export default Prism;
