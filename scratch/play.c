#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct CharNode {
    char chr;
    struct CharNode *next;
};

struct CharNode *makeCharNode(char c, struct CharNode *next) {
    struct CharNode *retval = malloc(sizeof(struct CharNode));
    retval->chr = c;
    retval->next = next;
    return retval;
}

void printChars(struct CharNode *charNode) {
    
}

int main() {
    char message1[512] = "Hello, world!";
    char *message2;
    int length = strlen(message1);
    message2 = malloc(sizeof(char) * length);
    
    for (int i = length; i >= 0; i--) {
        message2[i] = message1[length - i];
    }
    
    struct CharNode *string = 
        makeCharNode('H', makeCharNode('e', makeCharNode('l',
            makeCharNode('l', makeCharNode('o', makeCharNode(' ',
            makeCharNode('w', makeCharNode('o', makeCharNode('r',
            makeCharNode('l', makeCharNode('d', makeCharNode('!', NULL))))))))))));
}