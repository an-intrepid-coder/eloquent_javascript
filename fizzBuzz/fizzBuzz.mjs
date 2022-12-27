/* FizBuzz exercise: Print all numbers from 1-100; for nums divisible by 3
   print "Fizz"; for div. by 5 print "Buzz"; for div by 3 and 5 
   -> print "FizzBuzz"  */

export function fizzBuzz() {
    for (let i = 1; i <= 100; i++) {
        let fizz = i % 3 == 0;
        let buzz = i % 5 == 0;
        if (fizz) {
            console.log("Fizz")
        }
        if (buzz) {
            console.log("Buzz")
        }
        if (!fizz && !buzz) {
            console.log(i)
        }
    }
}

