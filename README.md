# Chameleon Programming Language

A programming language for me to learn how to implement various programming language
backends.

# Pain Points

* null exceptions cause segfaults, and are hard to debug
* infinite recursion also causes segfaults
* the generated code is getting bulky and hard to read
* at the moment cannot print info in low-level code (that does't want gc to kick in)

## Todos

* support empty strings
* write test for gc
* free resources properly in gc
* integrate gc implicitly into program flow
* research minor gc
* error arrow is not perfectly aligned?
* allow comments next to code
* experiment with stack traces: https://spin.atomicobject.com/2013/01/13/exceptions-stack-traces-c/
* fix variables first declared in if blocks not dominating all cases (if should have scope?)
* for loops
* lambdas and closures
* var args for print statements?
* allow using void type explicitly
* format parser/lexer errors nicely
* preload structs similar to fun defs
* modules
* separate top-level statements from normal statements
* type resolution errors can happen earlier: at struct def time and fun def time
* error due to forgetting to alloc (and then dereferencing)
* error handling - what if null pointer dereference segfault? stackoverflow (looks like this results in segfault anyway)
* code blocks to have end pos info
* do some code challenges
* multiple return values for functions
* arrays
* type classes / protocols
* classes
* default function parameter values
* default field values for structs
* fix lexer string literal value converter to account for escape sequences
* allow main to return void
* change type casting scheme to allow opt to optimize away casting instructions if possible (maybe type hints)
* separate type checker from generator
* nested inlined structs
* web assembly backend?
* experiment with optimization

* type checker that gives good error messages (done)
* add to and remove from `@assoc_map` on field assignment (done)
* gc: collect (done)
* allow assigning to struct fields (done)
* string utility functions (done)
* allow tagging gc on functions instead of structs (perhaps use a block-based directive) (done)
* gc: de-initialize vars for void functions (done)
* implement binary trees
    * delete (done)
    * rotations (auto-balancing) (done)
* strings (maybe implemented in the language) (done)
* string literals (done)
* tests for erroring test cases (done)
* better error reporting: show a few lines of code and highlight the selected code (done)
* grammar: change all recursion to left recursion (done)
* automatic ret instruct generated for LL if needed (when all paths already return for example),
also return my error message instead of going through to LL (done)
* if a function doesn't not always return, report compiler error (done)
* if statement do not have exit block if both clauses return (done)
* write test for ex35.chm (done)
* comments (done)
* newline and tab literals (done)
* operator precedence (done)
* not operators (done)
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