#include <memory>
#include <string>
#include <iostream>
using namespace std;

template <class T>
struct LinkedList {
    T data;
    std::unique_ptr<struct LinkedList<T>>next;
    
    LinkedList(T data, std::unique_ptr<struct LinkedList<T>> next):
        data(data), next(std::move(next)) {}
};

template <class T>
void print(std::unique_ptr<struct LinkedList<T>> next) {
    if (next) {
        cout << next->data << ", " << endl;
        print(std::move(next->next));
    }
}

int main() {
    auto ll = std::make_unique<LinkedList<int>>(
        4, 
        std::make_unique<LinkedList<int>>(
            5,
            nullptr
        )
    );
    print(std::move(ll));
}