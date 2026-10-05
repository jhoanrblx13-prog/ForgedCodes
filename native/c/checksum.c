#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

/* FNV-1a over stdin. Prints a decimal checksum. */
int main(void) {
    uint32_t hash = 2166136261u;
    int ch;
    size_t n = 0;
    while ((ch = getchar()) != EOF) {
        hash ^= (unsigned char)ch;
        hash *= 16777619u;
        n++;
    }
    printf("%lu %u\n", (unsigned long)n, hash);
    return 0;
}
