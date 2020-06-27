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
    {"name": "statement", "symbols": ["if"], "postprocess": id},
    {"name": "statement", "symbols": ["while"], "postprocess": id},
    {"name": "statement", "symbols": ["struct_def"], "postprocess": id},
    {"name": "statement", "symbols": ["free"], "postprocess": id},
    {"name": "var_assign", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "type_def", "_", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "var_assign",
                data_type: data[2],
                var_name: data[0],
                value: data[5]
            };
        }
                },
    {"name": "var_assign", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "var_assign",
                var_name: data[0],
                value: data[4]
            };
        }
                },
    {"name": "type_def", "symbols": [{"literal":":"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
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
    {"name": "unary_expr", "symbols": ["struct_literal"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["alloc"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["null_literal"], "postprocess": id},
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
    {"name": "fun_def", "symbols": [{"literal":"fun"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "paranthesized_parameter_list", "_", "type_def", "_", "code_block"], "postprocess": 
        (data) => {
            return {
                type: "fun_def",
                fun_name: data[2],
                data_type: data[6],
                parameters: data[4],
                body: data[8]
            };
        }
                },
    {"name": "fun_def", "symbols": [{"literal":"fun"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "paranthesized_parameter_list", "_", "code_block"], "postprocess": 
        (data) => {
            return {
                type: "fun_def",
                fun_name: data[2],
                parameters: data[4],
                body: data[6]
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
    {"name": "parameter_list", "symbols": ["fun_param", "__", "parameter_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[2]];
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
    {"name": "fun_param", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data) => {
            return {
                type: "fun_param",
                name: data[0]
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
    {"name": "if$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"else"}, "_", "if_alternate"]},
    {"name": "if$ebnf$1", "symbols": ["if$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "if$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "if", "symbols": [{"literal":"if"}, "__", "expr", "__", "code_block", "if$ebnf$1"], "postprocess": 
        (data) => {
            return {
                type: "if",
                cond: data[2],
                consequent: data[4],
                alternate: data[5] && data[5][3]
            };
        }
            },
    {"name": "if_alternate", "symbols": ["if"], "postprocess": id},
    {"name": "if_alternate", "symbols": ["code_block"], "postprocess": id},
    {"name": "while", "symbols": [{"literal":"while"}, "__", "expr", "__", "code_block"], "postprocess": 
        (data) => {
            return {
                type: "while",
                cond: data[2],
                body: data[4]
            };
        }
            },
    {"name": "struct_def", "symbols": [{"literal":"struct"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"{"}, "MLWS", "struct_def_entry_list", "MLWS", {"literal":"}"}], "postprocess": 
        (data) => {
            return {
                type: "struct_def",
                name: data[2],
                entries: data[6]
            };
        }
                },
    {"name": "struct_def_entry_list", "symbols": ["struct_def_entry"], "postprocess": 
        (data) => [data[0]]
                },
    {"name": "struct_def_entry_list", "symbols": ["struct_def_entry", "MLWS", "struct_def_entry_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[2]];
        }
                },
    {"name": "struct_def_entry", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "type_def"], "postprocess": 
        (data) => {
            return {
                type: "struct_def_entry",
                field_name: data[0],
                field_type: data[2]
            };
        }
                },
    {"name": "struct_literal", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"{"}, "MLWS", "struct_literal_entry_list", "MLWS", {"literal":"}"}], "postprocess": 
        (data) => {
            return {
                type: "struct_literal",
                structName: data[0],
                entries: data[4]
            };
        }
                },
    {"name": "struct_literal_entry_list", "symbols": ["struct_literal_entry"], "postprocess": 
        (data) => [data[0]]
                },
    {"name": "struct_literal_entry_list", "symbols": ["struct_literal_entry", "MLWS", "struct_literal_entry_list"], "postprocess": 
        (data) => [data[0], ...data[2]]
                },
    {"name": "struct_literal_entry", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "struct_literal_entry",
                field_name: data[0],
                field_value: data[4]
            };
        }
                },
    {"name": "alloc", "symbols": [{"literal":"alloc"}, "__", "struct_literal"], "postprocess": 
        (data) => {
            return {
                type: "alloc",
                struct: data[2]
            };
        }
                },
    {"name": "free", "symbols": [{"literal":"free"}, "__", "expr"], "postprocess": 
        (data) => {
            return {
                type: "free",
                value: data[2]
            };
        }
                },
    {"name": "null_literal", "symbols": [{"literal":"null"}], "postprocess":  
        () => {
            return {
                type: "null_literal"
            }
        }
                },
    {"name": "MLWS", "symbols": ["nl_or_ws"]},
    {"name": "MLWS", "symbols": ["nl_or_ws", "MLWS"]},
    {"name": "nl_or_ws", "symbols": ["__"]},
    {"name": "nl_or_ws", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)]},
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
