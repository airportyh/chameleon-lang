const moo = require("moo");

const lexer = moo.compile({
  WS:      /[ \t]+/,
  comment: /\#.*?$/,
  operator: /(?:==)|(?:>=)|(?:<=)|[\+\-\*\/\>\<\.]/,
  number:  /0|[1-9][0-9]*(?:\.[0-9]+)?/,
  identifier:      /[a-zA-Z_][a-zA-Z0-9_]*/,
  string:  /"(?:\\["\\]|[^\n"\\])*"/,
  lparen:  '(',
  rparen:  ')',
  lbracket: '[',
  rbracket: ']',
  lbrace: '{',
  rbrace: '}',
  comma: ',',
  assign: '=',
  colon: ':',
  dot: '.',
  NL:      { match: /\n/, lineBreaks: true },
});

module.exports = lexer;