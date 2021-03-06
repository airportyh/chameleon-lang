@{%
const lexer = require("./lexer.js");
%}

@lexer lexer

program -> (_ memory_manager_directive _ %NL):? lines
    {%
        (data) => {
            return {
                type: "program",
                memory_manager: data[0] ? data[0][1].value : "none",
                body: data[1]
            };
        }
    %}

lines
    -> line   {% id %}
    |  lines %NL line
        {%
            (data) => {
                return [...data[0], ...data[2]];
            }
        %}

line
    -> _ statement _
        {%
            (data) => {
                return [data[1]];
            }
        %}
    |  _
        {%
            () => []
        %}
    

statement
    -> fun_call        {% id %}
    |  assign          {% id %}
    |  fun_def         {% id %}
    |  return          {% id %}
    |  if              {% id %}
    |  while           {% id %}
    |  struct_def      {% id %}
    |  free            {% id %}
    |  break           {% id %}
    |  comment         {% id %}

assign
    -> identifier _ type_def _ "=" _ expr
        {%
            (data) => {
                return {
                    type: "var_assign",
                    start: data[0].start,
                    end: data[6].end,
                    data_type: data[2],
                    var_name: data[0],
                    value: data[6]
                };
            }
        %}
    | expr _ "=" _ expr
        {%
            (data) => {
                let type;
                if (data[0].type === "identifier") {
                    return {
                        type: "var_assign",
                        start: data[0].start,
                        end: data[4].end,
                        var_name: data[0],
                        value: data[4]
                    }
                } else {
                    return {
                        type: "field_assign",
                        start: data[0].start,
                        end: data[4].end,
                        left: data[0],
                        right: data[4]
                    };
                }
            }
        %}

type_def -> ":" _ identifier
    {%
        (data) => {
            return data[2];
        }
    %}

expr -> bin_expr    {% id %}

bin_expr
    -> unary_expr   {% id %}
    |  bin_expr _ operator _ unary_expr
        {%
            (data) => {
                const left = data[0];
                const right = data[4];
                const operator = data[2];
                
                if (left.type === "bin_expr") {
                    // Shunting Yard Algorithm
                    const op1 = operator.value;
                    const op2 = left.operator.value;
                    const myPrec = OperatorPrecedence[op1];
                    const theirPrec = OperatorPrecedence[op2];
                    if (!myPrec || !theirPrec) {
                        throw new Error(`Unknown operator ${op1} or ${op2}`);
                    }
                    if (myPrec > theirPrec) {
                        const newLeft = left.left;
                        const newRight = {
                            type: "bin_expr",
                            start: left.right.start,
                            operator: operator,
                            end: right.end,
                            left: left.right,
                            right: right
                        }
                        const fixed =  {
                            type: "bin_expr",
                            start: newLeft.start,
                            end: newRight.end,
                            left: newLeft,
                            operator: left.operator,
                            right: newRight
                        };
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
        %}

unary_expr
    -> number          {% id %}
    |  var_ref         {% id %}
    |  fun_call        {% id %}
    |  "(" expr ")"    {%  data => data[1] %}
    |  struct_literal  {% id %}
    |  alloc           {% id %}
    |  null_literal    {% id %}
    |  bool_literal    {% id %}
    |  char_literal    {% id %}
    |  string_literal  {% id %}
    |  not             {% id %}
    
var_ref
    -> identifier     {% id %}

fun_call
    -> identifier _ paranthesized_argument_list
        {%
            (data) => {
                return {
                    type: "fun_call",
                    start: data[0].start,
                    end: data[2].end,
                    fun_name: data[0],
                    arguments: data[2]
                };
            }
        %}
        
paranthesized_argument_list
    ->  "(" _MLWS_ ")"    {% () => [] %}
    |   "(" _MLWS_ argument_list _MLWS_ ")"
        {%
            (data) => data[2]
        %}

argument_list
    -> expr
        {%
            (data) => {
                return [data[0]];
            }
        %}
    |  argument_list MLWS expr
        {%
            (data) => {
                return [...data[0], data[2]];
            }
        %}

fun_def
    -> "fun" __ (memory_manager_off_directive __):? identifier _ paranthesized_parameter_list _ (type_def _):? code_block
        {%
            (data) => {
                return {
                    type: "fun_def",
                    start: tokenStart(data[0]),
                    end: data[8].end,
                    fun_name: data[3],
                    data_type: data[7] && data[7][0],
                    parameters: data[5],
                    body: data[8],
                    mm: data[2] ? false : true
                };
            }
        %}

memory_manager_off_directive -> "mm" _ ":" _ "off"

memory_manager_directive -> "memory_manager" _ ":" _ ("gc" | "arc" | "uptr" | "none")
    {%
        (data) => {
            return {
                type: "memory_manager_directive",
                start: tokenStart(data[0]),
                end: tokenEnd(data[4][0]),
                value: data[4][0].value
            };
        }
    %}

paranthesized_parameter_list
    ->  "(" _ ")"    {% () => [] %}
    |   "(" _MLWS_ parameter_list _MLWS_ ")"
        {%
            (data) => data[2]
        %}

parameter_list
    -> fun_param
        {%
            (data) => {
                return [data[0]];
            }
        %}
    |  parameter_list _MLWS_ fun_param
        {%
            (data) => {
                return [...data[0], data[2]];
            }
        %}

fun_param
    -> identifier _ type_def
        {%
            (data) => {
                return {
                    type: "fun_param",
                    start: data[0].start,
                    end: data[2].end,
                    name: data[0],
                    data_type: data[2]
                }
            }
        %}

code_block
    -> "[" lines "]"
        {%
            (data) => {
                return data[1];
            }
        %}

return
    -> "return" __ expr
        {%
            (data) => {
                return {
                    type: "return",
                    start: tokenStart(data[0]),
                    end: data[2].end,
                    value: data[2]
                };
            }
        %}
    |  "return"
        {%
            (data) => {
                return {
                    type: "return",
                    start: tokenStart(data[0]),
                    end: tokenEnd(data[0])
                };
            }
        %}

if
    -> "if" __ expr __ code_block
       (_ "else" _ if_alternate):?
        {%
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
        %}

if_alternate
    -> if          {% id %}
    |  code_block  {% id %}

while
    -> "while" __ expr __ code_block
        {%
            (data) => {
                return {
                    type: "while",
                    start: tokenStart(data[0]),
                    end: data[4].end,
                    cond: data[2],
                    body: data[4]
                };
            }
        %}

break
    -> %break_statement      {% idSimplifyToken %}

struct_def
    -> "struct" __ identifier _ "{" MLWS struct_def_entry_list MLWS "}"
        {%
            (data) => {
                return {
                    type: "struct_def",
                    start: tokenStart(data[0]),
                    end: tokenEnd(data[8]),
                    name: data[2],
                    entries: data[6]
                };
            }
        %}

struct_def_entry_list
    -> struct_def_entry
        {%
            (data) => [data[0]]
        %}
    |  struct_def_entry_list MLWS struct_def_entry
        {%
            (data) => {
                return [...data[0], data[2]];
            }
        %}

struct_def_entry
    -> identifier _ type_def
        {%
            (data) => {
                return {
                    type: "struct_def_entry",
                    start: data[0].start,
                    end: data[2].end,
                    field_name: data[0],
                    field_type: data[2]
                };
            }
        %}
        
struct_literal
    -> identifier _ "{" MLWS struct_literal_entry_list MLWS "}"
        {%
            (data) => {
                return {
                    type: "struct_literal",
                    start: data[0].start,
                    end: tokenEnd(data[6]),
                    structName: data[0],
                    entries: data[4]
                };
            }
        %}

struct_literal_entry_list
    -> struct_literal_entry
        {%
            (data) => [data[0]]
        %}
    |  struct_literal_entry_list MLWS struct_literal_entry
        {%
            (data) => [...data[0], data[2]]
        %}

struct_literal_entry
    -> identifier _ "=" _ expr
        {%
            (data) => {
                return {
                    type: "struct_literal_entry",
                    start: data[0].start,
                    end: data[4].end,
                    field_name: data[0],
                    field_value: data[4]
                };
            }
        %}

alloc
    -> "alloc" __ struct_literal
        {%
            (data) => {
                return {
                    type: "alloc",
                    start: tokenStart(data[0]),
                    end: data[2].end,
                    struct: data[2]
                };
            }
        %}
        
free
    -> "free" __ expr
        {%
            (data) => {
                return {
                    type: "free",
                    start: tokenStart(data[0]),
                    end: data[2].end,
                    value: data[2]
                };
            }
        %}

not
    -> "not" __ expr
        {%
            (data) => {
                return {
                    type: "not",
                    start: tokenStart(data[0]),
                    end: data[2].end,
                    operand: data[2]
                };
            }
        %}

null_literal
    -> %null_literal    {% idSimplifyToken %}
        
bool_literal
    -> %bool_literal    {% idSimplifyToken %}

char_literal
    -> %char_literal    {% idSimplifyToken %}

number
    -> %number          {% idSimplifyToken %}

comment
    -> %comment         {% idSimplifyToken %}
    
identifier
    -> %identifier      {% idSimplifyToken %}
    |  "@" %identifier
        {%
            (data) => {
                return {
                    type: "identifier",
                    value: "@" + data[1].value,
                    start: tokenStart(data[0]),
                    end: data[1].end
                }
            }
        %}

string_literal
    -> %string_literal
        {%
            (data) => {
                // Convert a string literal to a string
                // A string is represented as a linked list
                // So "hello" -> string('h' string('e' string('l' string('l' string('o' null)))))
                const stringToken = idSimplifyToken(data);
                const string = stringToken.value;
                let rootCallNode;
                let currentCallNode;
                for (let i = 0; i < string.length; i++) {
                    const char = string.charCodeAt(i);
                    const callNode =  {
                        type: "fun_call",
                        start: stringToken.start,
                        end: stringToken.end,
                        fun_name: {
                            type: "identifier",
                            value: "string",
                            start: stringToken.start,
                            end: stringToken.end
                        },
                        arguments: [
                            {
                                type: "char_literal",
                                value: char,
                                start: stringToken.start,
                                end: stringToken.end
                            }
                        ]
                    };
                    if (!rootCallNode) {
                        rootCallNode = callNode;
                    }
                    if (currentCallNode) {
                        currentCallNode.arguments.push(callNode);
                        
                    }
                    currentCallNode = callNode;
                }
                currentCallNode.arguments.push({
                    type: "null_literal",
                    value: "null",
                    start: stringToken.start,
                    end: stringToken.end
                });
                return rootCallNode;
            }
        %}

operator
    -> %operator        {% idSimplifyToken %}

# Multi-line whitespace

_MLWS_ -> nl_or_ws:*

MLWS -> nl_or_ws:+

nl_or_ws
    -> %WS
    |  %NL

__ -> %WS:+

_  -> %WS:*

@{%
    
// Loosely based on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
const OperatorPrecedence = {
    ".": 20,
    "*": 15,
    "/": 15,
    "%": 15,
    "-": 14,
    "+": 14,
    ">": 12,
    "<": 12,
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

%}