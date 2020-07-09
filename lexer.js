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
      match: /'(?:\\[nt]|[^\n'\\])'/, value: (value) => {
          if (value.length == 4) {
              const escapeCode = value[2];
              if (escapeCode === 'n') {
                  return 10;
              } else if (escapeCode === 't') {
                  return 9;
              } else {
                  throw new Error("Unexpected escape code: " + escapeCode);
              }
          } else {
              return value[1].charCodeAt(0);
          }
      }
  },
  string_literal: {
      match: /"(?:\\["\\tn]|[^\n"\\])*"/,
      value: (value) => {
          value = value
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\\"/g, "\"")
            .replace(/\\\\/g, "\\");
          return value
            .substring(1, value.length - 1);
      }
  },
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
  at: '@',
  NL:      { match: /\n/, lineBreaks: true },
});

module.exports = lexer;