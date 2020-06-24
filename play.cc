#include <iostream>
#include <memory>
using namespace std;

struct User {
    string username;
    string email;
};

struct Company {
    std::unique_ptr<User> ceo;
    string name;
};

std::unique_ptr<User> createUser(string username, string email) {
    auto user = std::make_unique<User>();
    user->username = username;
    user->email = email;
    return user;
}

std::unique_ptr<Company> createCompany(std::unique_ptr<User> ceo, string name) {
    auto company = std::make_unique<Company>();
    company->ceo = std::move(ceo);
    company->name = name;
    return company;
}

int main() {
    auto user = createUser("airportyh", "airportyh@gmail.com");
    auto user2 = std::move(user);
    cout << user->username << endl;
    /*auto company = createCompany(std::move(user), "MySoft");
    cout << company->ceo->username << " : " << company->ceo->email << endl;
    cout << company->name << endl;*/
}

