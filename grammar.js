// Generated automatically by nearley, version 2.19.4
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["lines"], "postprocess": 
        (data) => {
            return {
                type: "program",
                body: data[0]
            };
        }
            },
    {"name": "lines", "symbols": ["line"], "postprocess": id},
    {"name": "lines", "symbols": ["line", (lexer.has("NL") ? {type: "NL"} : NL), "lines"], "postprocess": 
        (data) => {
            return [...data[0], ...data[2]];
        }
                },
    {"name": "line", "symbols": ["_", "statement", "_"], "postprocess": 
        (data) => {
            return [data[1]];
        }
                },
    {"name": "line", "symbols": ["_"], "postprocess": 
        () => []
                },
    {"name": "statement", "symbols": ["fun_call"], "postprocess": id},
    {"name": "statement", "symbols": ["var_assign"], "postprocess": id},
    {"name": "statement", "symbols": ["fun_def"], "postprocess": id},
    {"name": "statement", "symbols": ["return"], "postprocess": id},
    {"name": "var_assign", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "type_def", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "var_assign",
                data_type: data[2],
                var_name: data[0],
                value: data[5]
            };
        }
                },
    {"name": "type_def", "symbols": [], "postprocess": () => null},
    {"name": "type_def", "symbols": [{"literal":":"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_"], "postprocess": 
        (data) => {
            return data[2];
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
    {"name": "argument_list", "symbols": ["expr", "__", "argument_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[2]];
        }
                },
    {"name": "fun_def", "symbols": [{"literal":"fun"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "paranthesized_parameter_list", "_", "type_def", "code_block"], "postprocess": 
        (data) => {
            return {
                type: "fun_def",
                fun_name: data[2],
                data_type: data[6],
                parameters: data[4],
                body: data[7]
            };
        }
                },
    {"name": "paranthesized_parameter_list", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": () => []},
    {"name": "paranthesized_parameter_list", "symbols": [{"literal":"("}, "_", "parameter_list", "_", {"literal":")"}], "postprocess": 
        (data) => data[2]
                },
    {"name": "parameter_list", "symbols": ["fun_param"], "postprocess": 
        (data) => {
            return [data[0]];
        }
                },
    {"name": "parameter_list", "symbols": ["fun_param", "parameter_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[1]];
        }
                },
    {"name": "fun_param", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "type_def"], "postprocess": 
        (data) => {
            return {
                type: "fun_param",
                name: data[0],
                data_type: data[2]
            }
        }
            },
    {"name": "code_block", "symbols": [{"literal":"["}, "lines", {"literal":"]"}], "postprocess": 
        (data) => {
            return data[1];
        }
                },
    {"name": "return", "symbols": [{"literal":"return"}, "__", "expr"], "postprocess": 
        (data) => {
            return {
                type: "return",
                value: data[2]
            };
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
