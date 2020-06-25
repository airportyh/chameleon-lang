#include <stdio.h>

struct User {
    char *username;
    char *email;
};

int main() {
    struct User user;
    user.username = "airportyh";
    printf("%s", user.username);
}

