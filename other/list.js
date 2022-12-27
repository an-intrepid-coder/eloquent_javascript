/* The List data structure exercise from Eloquent JavaScript.  */

// TODO: Define this using class syntax

function prependToList(element, list) {
    return {value: element, rest: list};
}

function listRef(index, list) {
    let i = 0;
    while (i < index) {
        if (list.rest == null) {
            return undefined;
        }
        i++;
        list = list.rest;
    }
    return list.value;
}

function listValues(list) {
    let arr = [];
    while (list.rest != null) {
        arr.push(list.value);
        list = list.rest;
    }
    return arr;
}

function makeList(arr) { 
    if (arr.length == 0) {
        return null;
    }
    let list = {value: arr[0], rest: null};
    while (arr.length > 0) {
        let x = arr.pop();
        list = prependToList(x, list);
    }
    return list;
}

let test = makeList([1, 2, 3, 4, 5, 6]);

console.log(test);

console.log(listValues(test));

console.log(listRef(2, test));

