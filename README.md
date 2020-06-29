# Chameleon Programming Language

A programming language for me to learn how to implement various programming language
backends.

## Todos

* not operators
* comments
* operator precedence

* implement binary trees
* automatic ret instruct generated for LL if needed (when all paths already return for example),
also return my error message instead of going through to LL
* error due to forgetting to alloc (and then dereferencing)
* error handling - what if null pointer dereference segfault? stackoverflow (looks like this results in segfault anyway)
* garbage collector
* allow assigning to struct fields
* code blocks to have end pos info
* strings (maybe implemented in the language)
* string literals
* do some code challenges
* multiple return values for functions
* modules
* arrays
* type classes / protocols
* lambdas and closures
* classes
* default function parameter values
* default field values for structs
* allow main to return void
* change type casting scheme to allow opt to optimize away casting instructions if possible (maybe type hints)
* separate type checker from generator
* nested inlined structs
* web assembly backend?
* experiment with optimization
* type checker that gives good error messages

* and, or operators (done)
* check for fun call arguments mismatch (done)
* attach line number info with each AST node (like fun lang and play lang) (done)
* character literals (done)
* allow defining referenced functions later (done)
* prompt for input (done)
* break statement for while (done)
* implicit type cast for return statements (done)
* write a test for exec that needs stdin (done)
* allow void functions to work (done)
* implement implicit type casting for ints to floats but not longs to floats(done)
* implement implicit type casting for function inputs (function signatures) (done)
* improve code dealing with implicit casting (numbers and nulls) (done)
* make a test suite (done)
* function signature table for inferring argument types (for null for example) (done)
* linked lists (user land?) (done)
* pointers?? how to do linked lists wo pointers? (done)
* integrate malloc and free for dynamic memory (done)
* structs (done)
* while loops (done)
* allow main to not have to return 0 explicitly (done)
* comparison operators (done)
* if statements (done)
* function definitions (done)
* cast from integer to floats correctly (done)
* arithemetic for floats (done)
* fix implicit type casts (done)
* explicit casting functions (done)
* numeric types (done)
* lexer/parser (done)

## Features

* numbers
* linked-lists
* strings as linked-list of characters
* functions
* dictionary as binary tree

## Implicit Type Casts

The implicit type casts that are allowed:

* byte -> short -> int -> long
* float -> double
* null -> any struct

Concept of compatibility: two types are compatible if one of them can be implicitedly casted
to another. Examples:

* byte is compatible with int
* float is not compatible with double
* null is compatible with any struct
* struct User is not compatible with struct Game

After it's found that they are compatible. We could use a priority number to decide the
cast direction??? Or we already know the cast direction in the case of an assignment or
a function argument.