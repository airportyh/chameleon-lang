const moo = require("moo");

const lexer = moo.compile({
  WS:      /[ \t]+/,
  comment: /\#.*?$/,
  operator: /(?:==)|(?:>=)|(?:<=)|(?:!=)|[\+\-\*\/\>\<\.\%]/,
  number:  /0|[1-9][0-9]*(?:\.[0-9]+)?/,
  identifier: {
      match: /[a-zA-Z_][a-zA-Z0-9_]*/,
      type: moo.keywords({
          keyword: [
              "alloc", "free", "fun", 
              "return", "if", "else", "while", "struct"
          ],
          bool_literal: [
              "true", "false"
          ],
          null_literal: [
              "null"
          ],
          break_statement: [ "break" ],
          operator: ["and", "or"],
          unary_operator: ["not"]
      })
  },
  char_literal: {
      match: /'[^\n"\\]'/, value: (value) => value[1]
  },
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