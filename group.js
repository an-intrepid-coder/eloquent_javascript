/* Group class exercise from Eloquent JavaScript. Is a good example of 
   giving an arbitrary class an Iterable interface, which is probably
   handy.  */

class Group {
    constructor() {
        this.contents = [];
    }

    add(element) {
        if (!this.has(element)) {
            this.contents.push(element);
        }
    }

    del(element) {
        if (this.has(element)) {
            this.contents = this.contents.filter(x => x != element);
        }
    }

    has(element) {  
        /* TODO: Recursive deepEqual (as this one will only go one level deep).
           Will wait until I am familiar with the module system so I can
           just important the deepEqual solution.  */
        for (let item of this.contents) {
            if (item == element) { // same object in memory
                return true;
            }
            let thisKeys = Object.keys(item);
            let thatKeys = Object.keys(element);
            // Check they have same number of keys:
            let checkKeys1 = thatKeys.filter(x => !thisKeys.includes(x));
            if (checkKeys1.length > 0) { // Different kinds of objects
                return false;
            }
            // Check the keys are the same:
            let checkKeys2 = thisKeys.map(x => x === thatKeys[thisKeys.indexOf(x)]);
            if (!checkKeys2.every(x => x === true)) { // Different kinds of objects
                return false;
            }
            // Check the contents of the keys are the same:
            for (let key of thisKeys) {
                if (item[key] === element[key]) {
                    return true; // Item found
                }
            }
            return false; // item not found
        }
    }

    static from(iterable) {
        let group = new Group();
        for (let element of iterable) {
            group.add(element);
        }
        return group;
    }
}

// Test: (TODO: a unit test here)
let test = Group.from([1, 2, 2, 3, 3, 3, 4, 5, 6, 6, 7]);
console.log(test);
console.log(test.has(7));
test.del(7);
console.log(test.has(7), "\n");

test = Group.from([{x: 1, y: 2}, {x: 1, y: 2}, {x: 0, y: 1}]);
console.log(test);

// TODO: GroupIterator 

