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

type_def
    -> null    {% () => null %}
    |  ":" _ %identifier _
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
    -> "fun" _ %identifier _ paranthesized_parameter_list _ type_def code_block
        {%
            (data) => {
                return {
                    type: "fun_def",
                    fun_name: data[2],
                    data_type: data[6],
                    parameters: data[4],
                    body: data[7]
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
                return [data[0], ...data[1]];
            }
        %}

fun_param -> %identifier _ type_def
    {%
        (data) => {
            return {
                type: "fun_param",
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
                    value: data[2]
                };
            }
        %}
    
__ -> %WS:+

_  -> %WS:*