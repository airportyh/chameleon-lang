#include <stdio.h>

int main() {
    char c;
    while (c = getchar()) {
        if (c == 10 || c == 13) {
            printf("NEWLINE %d", c);
        } else {
            printf("Got %c", c);
        }
    }
}