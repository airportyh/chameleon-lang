# Chameleon Programming Language

A programming language for me to learn how to implement various programming language
backends.

## Todos

* implement binary trees
* do some code challenges
* allow void functions to work
* garbage collector
* modules
* allow defining referenced functions later
* arrays
* strings (maybe implemented in the language)
* type classes / protocols
* lambdas and closures
* classes
* default function parameter values
* default field values for structs
* allow main to return void
* change type casting scheme to allow opt to optimize away casting instructions if possible (maybe type hints)
* separate type checker from generator
* make type checker give good error messages and protect against errors in the
generator stage
* nested inlined structs
* implement implicit type casting for ints to floats but not longs to floats
* implement implicit type casting for function inputs (function signatures)
* web assembly backend?
* experiment with optimization
* type checker that gives good error messages
* closure
* operator precedence

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