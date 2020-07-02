// Generated automatically by nearley, version 2.19.4
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");


    
// Loosely based on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
const OperatorPrecedence = {
    ".": 20,
    "*": 15,
    "/": 15,
    "%": 15,
    "-": 14,
    "+": 14,
    ">=": 12,
    "<=": 12,
    "==": 11,
    "!=": 11,
    "and": 7,
    "or": 6
};

function tokenStart(token) {
    return {
        line: token.line,
        col: token.col - 1,
        offset: token.offset
    };
}

function tokenEnd(token) {
    const lastNewLine = token.text.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.text.length - 1,
        offset: token.offset + token.text.length
    };
}

function simplifyToken(token) {
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
}

function idSimplifyToken(data) {
    return simplifyToken(data[0]);
}


function print(node) {
    switch (node.type) {
        case "program":
            return node.body
                .map(statement => 
                    print(statement)).join("\n");
            break;
        case "fun_call":
            return `${node.fun_name.value}(` +
                node.arguments
                    .map(arg => print(arg)).join(", ") +
                ")";
            break;
        case "bin_expr":
            return `(${print(node.left)}${node.operator.value}${print(node.right)})`;
            break;
        default:
            if (node.value) {
                return node.value;
            } else {
                throw new Error(`Unsupported: ${node.type}`);
            }
    }
}


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
    {"name": "statement", "symbols": ["break"], "postprocess": id},
    {"name": "statement", "symbols": ["comment"], "postprocess": id},
    {"name": "var_assign", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "type_def", "_", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "var_assign",
                start: tokenStart(data[0]),
                end: data[6].end,
                data_type: data[2],
                var_name: data[0],
                value: data[6]
            };
        }
                },
    {"name": "var_assign", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "expr"], "postprocess": 
        (data) => {
            return {
                type: "var_assign",
                start: tokenStart(data[0]),
                end: data[4].end,
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
            const left = data[0];
            const right = data[4];
            const operator = data[2];
            console.log("parsed " + print(left) + " " + operator.value + " " + print(right));
            
            if (right.type === "bin_expr") {
                // Shunting Yard Algorithm
                const op1 = operator.value;
                const op2 = right.operator.value;
                const myPrec = OperatorPrecedence[op1];
                const theirPrec = OperatorPrecedence[op2];
                console.log(`${op1} = ${myPrec}  ${op2} = ${theirPrec}`);
                if (myPrec >= theirPrec) {
                    const newLeft = {
                        type: "bin_expr",
                        start: left.start,
                        end: right.left.end,
                        left: left,
                        operator: operator,
                        right: right.left
                    }
                    const fixed =  {
                        type: "bin_expr",
                        start: left.start,
                        end: right.end,
                        left: newLeft,
                        operator: right.operator,
                        right: right.right
                    };
                    console.log(`fixing tree to: ${print(fixed)}`);
                    
                    return fixed;
                }
            }
            return {
                type: "bin_expr",
                start: left.start,
                end: right.end,
                left: left,
                operator: operator,
                right: right
            };
        }
                },
    {"name": "unary_expr", "symbols": ["number"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["var_ref"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["fun_call"], "postprocess": id},
    {"name": "unary_expr", "symbols": [{"literal":"("}, "expr", {"literal":")"}], "postprocess": data => data[1]},
    {"name": "unary_expr", "symbols": ["struct_literal"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["alloc"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["null_literal"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["bool_literal"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["char_literal"], "postprocess": id},
    {"name": "unary_expr", "symbols": ["not"], "postprocess": id},
    {"name": "var_ref", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": idSimplifyToken},
    {"name": "fun_call", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "paranthesized_argument_list"], "postprocess": 
        (data) => {
            return {
                type: "fun_call",
                start: tokenStart(data[0]),
                end: data[2].end,
                fun_name: data[0],
                arguments: data[2]
            };
        }
                },
    {"name": "paranthesized_argument_list", "symbols": [{"literal":"("}, "_MLWS_", {"literal":")"}], "postprocess": () => []},
    {"name": "paranthesized_argument_list", "symbols": [{"literal":"("}, "_MLWS_", "argument_list", "_MLWS_", {"literal":")"}], "postprocess": 
        (data) => data[2]
                },
    {"name": "argument_list", "symbols": ["expr"], "postprocess": 
        (data) => {
            return [data[0]];
        }
                },
    {"name": "argument_list", "symbols": ["expr", "MLWS", "argument_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[2]];
        }
                },
    {"name": "fun_def", "symbols": [{"literal":"fun"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "paranthesized_parameter_list", "_", "type_def", "_", "code_block"], "postprocess": 
        (data) => {
            return {
                type: "fun_def",
                start: tokenStart(data[0]),
                end: data[8].end,
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
                start: tokenStart(data[0]),
                end: data[6].end,
                fun_name: data[2],
                parameters: data[4],
                body: data[6]
            };
        }
                },
    {"name": "paranthesized_parameter_list", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": () => []},
    {"name": "paranthesized_parameter_list", "symbols": [{"literal":"("}, "_MLWS_", "parameter_list", "_MLWS_", {"literal":")"}], "postprocess": 
        (data) => data[2]
                },
    {"name": "parameter_list", "symbols": ["fun_param"], "postprocess": 
        (data) => {
            return [data[0]];
        }
                },
    {"name": "parameter_list", "symbols": ["fun_param", "_MLWS_", "parameter_list"], "postprocess": 
        (data) => {
            return [data[0], ...data[2]];
        }
                },
    {"name": "fun_param", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "type_def"], "postprocess": 
        (data) => {
            return {
                type: "fun_param",
                start: tokenStart(data[0]),
                end: data[2].end,
                name: data[0],
                data_type: data[2]
            }
        }
                },
    {"name": "fun_param", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (data) => {
            return {
                type: "fun_param",
                start: tokenStart(data[0]),
                end: tokenEnd(data[0]),
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
                start: tokenStart(data[0]),
                end: data[2].end,
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
                start: tokenStart(data[0]),
                end: data[5] ? data[5][3].end : data[4].end,
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
                start: tokenStart(data[0]),
                end: data[4].end,
                cond: data[2],
                body: data[4]
            };
        }
                },
    {"name": "break", "symbols": [(lexer.has("break_statement") ? {type: "break_statement"} : break_statement)], "postprocess": idSimplifyToken},
    {"name": "struct_def", "symbols": [{"literal":"struct"}, "__", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"{"}, "MLWS", "struct_def_entry_list", "MLWS", {"literal":"}"}], "postprocess": 
        (data) => {
            return {
                type: "struct_def",
                start: tokenStart(data[0]),
                end: tokenEnd(data[8]),
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
                start: tokenStart(data[0]),
                end: data[2].end,
                field_name: data[0],
                field_type: data[2]
            };
        }
                },
    {"name": "struct_literal", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"{"}, "MLWS", "struct_literal_entry_list", "MLWS", {"literal":"}"}], "postprocess": 
        (data) => {
            return {
                type: "struct_literal",
                start: tokenStart(data[0]),
                end: tokenEnd(data[6]),
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
                start: tokenStart(data[0]),
                end: data[4].end,
                field_name: data[0],
                field_value: data[4]
            };
        }
                },
    {"name": "alloc", "symbols": [{"literal":"alloc"}, "__", "struct_literal"], "postprocess": 
        (data) => {
            return {
                type: "alloc",
                start: tokenStart(data[0]),
                end: data[2].end,
                struct: data[2]
            };
        }
                },
    {"name": "free", "symbols": [{"literal":"free"}, "__", "expr"], "postprocess": 
        (data) => {
            return {
                type: "free",
                start: tokenStart(data[0]),
                end: data[2].end,
                value: data[2]
            };
        }
                },
    {"name": "not", "symbols": [{"literal":"not"}, "__", "expr"], "postprocess": 
        (data) => {
            return {
                type: "not",
                start: tokenStart(data[0]),
                end: data[2].end,
                operand: data[2]
            };
        }
                },
    {"name": "null_literal", "symbols": [(lexer.has("null_literal") ? {type: "null_literal"} : null_literal)], "postprocess": idSimplifyToken},
    {"name": "bool_literal", "symbols": [(lexer.has("bool_literal") ? {type: "bool_literal"} : bool_literal)], "postprocess": idSimplifyToken},
    {"name": "char_literal", "symbols": [(lexer.has("char_literal") ? {type: "char_literal"} : char_literal)], "postprocess": idSimplifyToken},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": idSimplifyToken},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": idSimplifyToken},
    {"name": "_MLWS_$ebnf$1", "symbols": []},
    {"name": "_MLWS_$ebnf$1", "symbols": ["_MLWS_$ebnf$1", "nl_or_ws"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_MLWS_", "symbols": ["_MLWS_$ebnf$1"]},
    {"name": "MLWS$ebnf$1", "symbols": ["nl_or_ws"]},
    {"name": "MLWS$ebnf$1", "symbols": ["MLWS$ebnf$1", "nl_or_ws"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "MLWS", "symbols": ["MLWS$ebnf$1"]},
    {"name": "nl_or_ws", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
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
