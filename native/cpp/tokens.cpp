#include <cctype>
#include <iostream>
#include <string>

int main() {
    std::string text, word;
    std::getline(std::cin, text);
    int count = 0;
    bool in = false;
    for (char ch : text) {
        if (std::isalnum(static_cast<unsigned char>(ch))) {
            if (!in) {
                count++;
                in = true;
            }
        } else {
            in = false;
        }
    }
    std::cout << count << "\n";
    return 0;
}
