// Iterative: O(n) time, O(1) space
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Formula: O(1) time, O(1) space
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}

// Recursive: O(n) time, O(n) space
function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
}

