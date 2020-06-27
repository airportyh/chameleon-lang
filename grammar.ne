@{%
const lexer = require("./lexer.js");
%}

@lexer lexer

program -> lines
    {%
        (data) => {
            return {
                type: "program",
                body: data[0]
            };
        }
    %}

lines
    -> line   {% id %}
    |  line %NL lines
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
    |  var_assign      {% id %}
    |  fun_def         {% id %}
    |  return          {% id %}
    |  if              {% id %}
    |  while           {% id %}
    |  struct_def      {% id %}
    |  free            {% id %}

var_assign
    -> %identifier _ type_def "=" _ expr
        {%
            (data) => {
                return {
                    type: "var_assign",
                    data_type: data[2],
                    var_name: data[0],
                    value: data[5]
                };
            }
        %}
    | %identifier _ "=" _ expr
        {%
            (data) => {
                return {
                    type: "var_assign",
                    var_name: data[0],
                    value: data[4]
                };
            }
        %}

type_def -> ":" _ %identifier
    {%
        (data) => {
            return data[2];
        }
    %}

expr -> bin_expr    {% id %}

bin_expr
    -> unary_expr   {% id %}
    |  unary_expr _ %operator _ bin_expr
        {%
            (data) => {
                return {
                    type: "bin_expr",
                    left: data[0],
                    operator: data[2],
                    right: data[4]
                };
            }
        %}

unary_expr
    -> %number      {% id %}
    |  var_ref      {% id %}
    |  fun_call     {% id %}
    |  "(" expr ")"
        {%
            (data) => {
                return data[1];
            }
        %}
    |  struct_literal  {% id %}
    |  alloc           {% id %}
    |  null_literal    {% id %}
    
var_ref
    -> %identifier  {% id %}

fun_call
    -> %identifier _ paranthesized_argument_list
        {%
            (data) => {
                return {
                    type: "fun_call",
                    fun_name: data[0],
                    arguments: data[2]
                };
            }
        %}
        
paranthesized_argument_list
    ->  "(" _ ")"    {% () => [] %}
    |   "(" _ argument_list _ ")"
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
    |  expr __ argument_list
        {%
            (data) => {
                return [data[0], ...data[2]];
            }
        %}

fun_def
    -> "fun" __ %identifier _ paranthesized_parameter_list _ type_def _ code_block
        {%
            (data) => {
                return {
                    type: "fun_def",
                    fun_name: data[2],
                    data_type: data[6],
                    parameters: data[4],
                    body: data[8]
                };
            }
        %}
    | "fun" __ %identifier _ paranthesized_parameter_list _ code_block
        {%
            (data) => {
                return {
                    type: "fun_def",
                    fun_name: data[2],
                    parameters: data[4],
                    body: data[6]
                };
            }
        %}
    

paranthesized_parameter_list
    ->  "(" _ ")"    {% () => [] %}
    |   "(" _ parameter_list _ ")"
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
    |  fun_param __ parameter_list
        {%
            (data) => {
                return [data[0], ...data[2]];
            }
        %}

fun_param
    -> %identifier _ type_def
        {%
            (data) => {
                return {
                    type: "fun_param",
                    name: data[0],
                    data_type: data[2]
                }
            }
        %}
    |  %identifier
        {%
            (data) => {
                return {
                    type: "fun_param",
                    name: data[0]
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
                    value: data[2]
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
                cond: data[2],
                body: data[4]
            };
        }
    %}

struct_def
    -> "struct" __ %identifier _ "{" MLWS struct_def_entry_list MLWS "}"
        {%
            (data) => {
                return {
                    type: "struct_def",
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
    |  struct_def_entry MLWS struct_def_entry_list
        {%
            (data) => {
                return [data[0], ...data[2]];
            }
        %}

struct_def_entry
    -> %identifier _ type_def
        {%
            (data) => {
                return {
                    type: "struct_def_entry",
                    field_name: data[0],
                    field_type: data[2]
                };
            }
        %}
        
struct_literal
    -> %identifier _ "{" MLWS struct_literal_entry_list MLWS "}"
        {%
            (data) => {
                return {
                    type: "struct_literal",
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
    |  struct_literal_entry MLWS struct_literal_entry_list
        {%
            (data) => [data[0], ...data[2]]
        %}

struct_literal_entry
    -> %identifier _ "=" _ expr
        {%
            (data) => {
                return {
                    type: "struct_literal_entry",
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
                    value: data[2]
                };
            }
        %}

null_literal
    -> "null"
        {% 
            () => {
                return {
                    type: "null_literal"
                }
            }
        %}
        

# Multi-line whitespace
MLWS
    -> nl_or_ws
    |  nl_or_ws MLWS

nl_or_ws
    -> __
    |  %NL

__ -> %WS:+

_  -> %WS:*