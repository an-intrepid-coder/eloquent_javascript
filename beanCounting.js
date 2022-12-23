/* "Bean Counting" exercise from Eloquent JavaScript: write a function that 
   takes a string and a character, and returns the number of times that 
   character appears in the string.  */

function countChar(s, c) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] == c) {
            count += 1;
        }
    }
    return count;
}

console.log(countChar("Sam", 'a'));
console.log(countChar("SamSamSamSamSam", 'S'));

