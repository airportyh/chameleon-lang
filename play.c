#include <stdio.h>

struct User {
    char *username;
    char *email;
};

void printUser(struct User *user) {
    printf("%s, %s", user->username, user->email);
}

struct User createUser(char *username, char *email) {
    struct User user;
    user.username = username;
    user.email = email;
    return user;
}

int main() {
    struct User *user = NULL;
}

