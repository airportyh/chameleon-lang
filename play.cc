#include <iostream>
using namespace std;

int add(int x, int y) {
    return x + y;
}

int main() {
    auto c = add(4, 5);
    cout << c << endl;
}