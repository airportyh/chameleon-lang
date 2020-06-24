#include <string>
#include <iostream>
using namespace std;

struct User {
    char fi;
    char li;
    char *user;
    char *email;
    
    User() {
        fi = 4;
        li = 5;
    }
};

int main() {
    struct User users[16];
    cout << to_string(users[0].fi) << endl;
    cout << to_string(users[0].li) << endl;
}