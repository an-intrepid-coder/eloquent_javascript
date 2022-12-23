/* A mathematical vector class, from Eloquent JavaScript's exercises.  */

// Might be useful in conjunction with the matrixes and a coordinate system,
// for Roguelikes.

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    distanceFrom(other) {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
        );
    }

    length() {
        return this.distanceFrom(new Vector(0, 0));
    }
}

let a = new Vector(1, 3);
let b = new Vector(2, 4);

console.log(a.plus(b));
console.log(a.minus(b));
console.log(a.distanceFrom(b));
console.log(a.length(), b.length());

