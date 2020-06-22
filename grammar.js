// Generated automatically by nearley, version 2.19.4
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statements"], "postprocess": 
        (data) => {
            return {
                type: "program",
                body: data[0]
            };
        }
            },
    {"name": "statements", "symbols": ["_", "statement", "_"], "postprocess": 
        (data) => {
            return [data[1]];
        }
                },
    {"name": "statements", "symbols": ["_", "statement", "_", (lexer.has("NL") ? {type: "NL"} : NL), "statements"], "postprocess": 
        (data) => {
            return [data[1], ...data[4]];
        }
                },
    {"name": "statement", "symbols": ["fun_call"], "postprocess": id},
    {"name": "statement", "symbols": ["var_assign"], "postprocess": id},
    {"name": "var_assign", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "var_assign",
                var_name: data[0],
                value: data[4]
            };
        }
                },
    {"name": "expr", "symbols": ["bin_expr"], "postprocess": id},
    {"name": "bin_expr", "symbols": ["unary_expr"], "postprocess": id},
    {"name": "bin_expr", "symbols": ["unary_expr", "_", (lexer.has("operator") ? {type: "operator"} : operator), "_", "bin_expr"], "postprocess": 
        (data) => {
            return {
                type: "bin_expr",
                left: data[0],
                operator: data[2],
                right: data[4]
            };
        }
                },
    {"name": "unary_expr", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "unary_expr", "symbols": ["var_ref"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["fun_call"], "postprocess": id},
    {"name": "unary_expr", "symbols": [{"literal":"("}, "expr", {"literal":")"}], "postprocess": 
        (data) => {
            return data[1];
        }
                },
    {"name": "var_ref", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": id},
    {"name": "fun_call", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "paranthesized_argument_list"], "postprocess": 
        (data) => {
            return {
                type: "fun_call",
                fun_name: data[0],
                arguments: data[2]
            };
        }
                },
    {"name": "paranthesized_argument_list", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": () => []},
    {"name": "paranthesized_argument_list", "symbols": [{"literal":"("}, "_", "argument_list", "_", {"literal":")"}], "postprocess": 
        (data) => data[2]
                },
    {"name": "argument_list", "symbols": ["expr"], "postprocess": 
        (data) => {
            return [data[0]];
        }
                },
    {"name": "argument_list", "symbols": ["expr", "_", {"literal":","}, "_", "argument_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[4]];
        }
                },
    {"name": "__$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
