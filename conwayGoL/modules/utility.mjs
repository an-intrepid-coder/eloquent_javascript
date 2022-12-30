// Returns a random index from an array:
export function randomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Returns a random number within a range (start inclusive, end exclusive):
export function randInRange(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

// Takes a user prompt and checks that it is a number before returning it:
export function promptForNumber(promptString) {
    let input = Number(prompt(promptString));
    if (String(input) === "NaN") {
        alert("Please enter a number!");
        return null;
    } 
    return input;
}

export function randomBrightColor() {
    let brightColors = [
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
        "rgb(255, 0, 0)",
        "rgb(255, 255, 0)",
        "rgb(0, 255, 255)",
        "rgb(252, 168, 3)",
        "rgb(255, 255, 255)",
        "rgb(252, 3, 232)",
        "rgb(3, 252, 94)",
    ];
    return randomIndex(brightColors);
}

