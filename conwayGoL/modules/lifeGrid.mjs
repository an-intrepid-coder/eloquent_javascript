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

    nextLifeGen() { 
        // Generate and return a new LifeGrid:
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
}

