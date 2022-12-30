import {randomIndex} from "./utility.mjs";

export class LifeGrid {
    constructor(width, height, fresh = true, blank = false) {
        this.generation = 0;
        this.width = width;
        this.height = height;
        this.cells = []; // 1-dimensional array of bools in row-major order
        if (fresh) {
            for (let i = 0; i < width * height; i++) {
                let alive = Math.floor(Math.random() * 10) % 2 == 0;
                this.cells.push(alive);
            }
        } else if (blank) {
            for (let i = 0; i < width * height; i++) {
                this.cells.push(false);
            }
        }
    }

    // Returns a lifeGrid based on a state object:
    static fromStateObject(stateObject) { 
        let lifeGrid = new LifeGrid(stateObject.generation, stateObject.width, stateObject.height, stateObject.cells, false, true);
        for (let y = 0; y < lifeGrid.height; y++) {
            for (let x = 0; x < lifeGrid.width; x++) {
                if (stateObject.cells[y * lifeGrid.width + x]) {
                    lifeGrid.set(x, y, true);
                }
            }
        }
        return lifeGrid;
    }

    // Returns an object representing the state of the simulation:
    stateObject() { 
        return {
            generation: this.generation,
            width: this.width,
            height: this.height,
            cells: this.cells
        };
    }

    // Gets the given cell:                
    get(x, y) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            let i = y * this.width + x; // row * columns + column
            return this.cells[i];
        }
        return null; 
    }

    // Sets the given cell and returns its new value:
    set(x, y, aliveOrDead) {
        let i = y * this.width + x; // row * columns + column
        this.cells[i] = aliveOrDead;
        return this.cells[i];
    }

    // Returns the # of living neighbors of the cell at (x, y):
    livingNeighbors(x, y) { 
        let count = 0;
        for (let i = y - 1; i < y + 2; i++) {
            for (let j = x - 1; j < x + 2; j++) { 
                let tx = j;
                let ty = i;
                if (ty < 0) { 
                    ty = this.height - 1;
                } else if (ty >= this.height) {
                    ty = 0;
                }
                if (tx < 0) { 
                    tx = this.width - 1;
                } else if (tx >= this.width) {
                    tx = 0;
                }
                if (!(tx == x && ty == y) && this.get(tx, ty) == true) { 
                    count++;
                }
            }
        }
        return count;
    }

    // Returns true if the cell at (x, y) will live:
    lives(x, y) { 
        let alive = this.get(x, y);
        let livingNeighborCount = this.livingNeighbors(x, y);
        if (alive) {
            return livingNeighborCount == 2 || livingNeighborCount == 3;
        } else {
            return livingNeighborCount == 3;
        }
    }

    // Generate and return a new LifeGrid based on the previous state:
    nextLifeGen() { 
        let newGrid = new LifeGrid(this.width, this.height, false);
        for (let y = 0; y < newGrid.height; y++) {
            for (let x = 0; x < newGrid.width; x++) {
                let cellLives = this.lives(x, y);
                newGrid.cells.push(cellLives);
            }
        }
        newGrid.generation = this.generation + 1;
        return newGrid;
    }

    // Stamp a Glider in to a given spot:
    stampGlider(origin, orientation, configuration = null) {
        // TODO: Different starting frames
        // TODO: More refactoring: these sub-functions can be a scope out
        /* Returns the coordinates of the filled edge of the Glider based on 
           the given orientation and starting top-left point of the 3x3 space.  */
        function edge() { 
            if (orientation === "north") {
                return [
                    origin,
                    {x: origin.x + 1, y: origin.y},
                    {x: origin.x + 2, y: origin.y}
                ];
            } else if (orientation === "south") {
                return [
                    {x: origin.x, y: origin.y + 2},
                    {x: origin.x + 1, y: origin.y + 2},
                    {x: origin.x + 2, y: origin.y + 2}
                ];
            } else if (orientation === "east") {
                return [
                    {x: origin.x + 2, y: origin.y},
                    {x: origin.x + 2, y: origin.y + 1},
                    {x: origin.x + 2, y: origin.y + 2}
                ];
            } else if (orientation === "west") {
                return [
                    origin,
                    {x: origin.x, y: origin.y + 1},
                    {x: origin.x, y: origin.y + 2}
                ];
            }
        }

        /* Returns the central rear point of the Glider given the origin and 
           orientation.  */
        function centralRearPoint() {
            if (orientation == "north") {
                return {x: origin.x + 1, y: origin.y + 2};
            } else if (orientation == "south") {
                return {x: origin.x + 1, y: origin.y};
            } else if (orientation == "east") {
                return {x: origin.x, y: origin.y + 1};
            } else if (orientation == "west") {
                return {x: origin.x + 2, y: origin.y + 1};
            }
        }

        /* Returns the middle-offset point of the Glider given the origin and 
           orientation. if configuration == null then it will randomly pick the middle offset
           point, otherwise it will select from 0, or 1 statically.  */
        function middleOffsetPoint(configuration = null) {
            let candidates;
            if (orientation == "north") {
                candidates = [ 
                    {x: origin.x, y: origin.y + 1},
                    {x: origin.x + 2, y: origin.y + 1}
                ];
            } else if (orientation == "south") {
                candidates = [ 
                    {x: origin.x, y: origin.y + 1},
                    {x: origin.x + 2, y: origin.y + 1}
                ];
            } else if (orientation == "east") {
                candidates = [ 
                    {x: origin.x + 1, y: origin.y},
                    {x: origin.x + 1, y: origin.y + 2}
                ];
            } else if (orientation == "west") {
                candidates = [ 
                    {x: origin.x + 1, y: origin.y},
                    {x: origin.x + 1, y: origin.y + 2}
                ];
            }
            if (configuration == 0 || configuration == 1) return candidates[configuration];
            else return randomIndex(candidates);
        }

        let glider = [];
        let edgePoints = edge();
        for (let point of edgePoints) { 
            glider.push(point);
        }
        glider.push(centralRearPoint()); 
        glider.push(middleOffsetPoint(configuration));
        for (let cell of glider) { 
            this.set(cell.x, cell.y, true);
        }
    }

}

