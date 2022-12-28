// Returns a random index from an array:
export function randomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Returns a random number within a range (start inclusive, end exclusive):
export function randInRange(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

