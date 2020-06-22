@{%
const lexer = require("./lexer.js");
%}

@lexer lexer

program -> statements
    {%
        (data) => {
            return {
                type: "program",
                body: data[0]
            };
        }
    %}

statements
    -> _ statement _
        {%
            (data) => {
                return [data[1]];
            }
        %}
    |  _ statement _ %NL statements
        {%
            (data) => {
                return [data[1], ...data[4]];
            }
        %}

statement
    -> fun_call        {% id %}
    |  var_assign      {% id %}

var_assign
    -> %identifier _ "=" _ expr
        {%
            (data) => {
                return {
                    type: "var_assign",
                    var_name: data[0],
                    value: data[4]
                };
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
    |  expr _ "," _ argument_list
        {%
            (data) => {
                return [data[0], ...data[4]];
            }
        %}
    
__ -> %WS:+

_  -> %WS:*