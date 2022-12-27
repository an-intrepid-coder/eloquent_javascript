// Conway's Game of Life exercise from Chapter 18 of Eloquent JavaScript.

const animationDelay = 500;

// Returns a random index from an array:
function randomIndex(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Returns a random number within a range (start inclusive, end exclusive):
function randInRange(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

class LifeGrid {
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
        return null; // should this be undefined or null? Does it matter?
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

// Generate grid:
let lifeGrid = new LifeGrid(50, 25);  

// Populate DOM from lifeGrid:  
function populateTable() {
    let lgtable = document.getElementById("lifeGrid"); 
    let lifeDiv = document.getElementById("lifeDiv");
    // Replace table element with new generated instance:
    lgtable.remove(); 
    lgtable = document.createElement("table");
    lgtable.id = "lifeGrid";
    for (let y = 0; y < lifeGrid.height; y++) {
        let row = document.createElement("tr");
        for (let x = 0; x < lifeGrid.width; x++) {
            let datum = document.createElement("td");
            let cell = document.createElement("label");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = lifeGrid.get(x, y) == true;
            cell.x = x;
            cell.y = y; 
            cell.addEventListener("mouseup", event => {
                // Interacts with the LifeGrid object on mouseup
                let cellIsAlive = lifeGrid.get(cell.x, cell.y);
                lifeGrid.set(cell.x, cell.y, !cellIsAlive);
            });
            cell.appendChild(checkbox);
            datum.appendChild(cell);
            row.appendChild(datum);
        }
        lgtable.appendChild(row);
    }
    lifeDiv.appendChild(lgtable);
}

// Populate the DOM initially:
populateTable();

let animating = false;

// Update the text label with the current generation on it:
function updateGenLabel() {
    let generationLabel = document.getElementById("generationLabel");
    generationLabel.textContent = `Generation ${lifeGrid.generation}`;
    generationLabel.style = "color: white";
}

// Advance the simulation by 1 generation, populate the DOM, and update the gen label:
function advanceGen() {
    lifeGrid = lifeGrid.nextLifeGen();
    populateTable();
    updateGenLabel();
}

// Applies advanceGen() a given number of times:
function multiGen(count, countLimit) {
    let start = Date.now();
    advanceGen();
    count++;
    if (count < countLimit && animating) {
        let end = Date.now();
        let dt = end - start;
        setTimeout(() => multiGen(count, countLimit), animationDelay - dt);
    } else {
        animating = false;
    }
}

// Buttons to advance generations:

let nextButton = document.getElementById("nextButton");
nextButton.addEventListener("mouseup", event => {
    if (!animating) {
        advanceGen();
    }
});

let nextTenButton = document.getElementById("nextTenButton");
nextTenButton.addEventListener("mouseup", event => {
    if (!animating) {
        animating = true;
        multiGen(0, 10);
    }
});

let nextHundredButton = document.getElementById("nextHundredButton");
nextHundredButton.addEventListener("mouseup", event => {
    if (!animating) {
        animating = true;
        multiGen(0, 100);
    }
});

let nextThousandButton = document.getElementById("nextThousandButton");
nextThousandButton.addEventListener("mouseup", event => {
    if (!animating) {
        animating = true;
        multiGen(0, 1000);
    }
});

// Button to stop any current animations:
let stopButton = document.getElementById("stopButton");
stopButton.addEventListener("mouseup", event => {
    animating = false;
});

// Button to clear the grid:
let clearButton = document.getElementById("clearButton");
clearButton.addEventListener("mouseup", event => {
    animating = false;
    setTimeout(() => {
        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, false, true);
        populateTable();
        updateGenLabel();
    }, animationDelay);
});

// Button to reset the grid:
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("mouseup", event => {
    animating = false;
    setTimeout(() => {
        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, true);
        populateTable();
        updateGenLabel();
    }, animationDelay);
});

/* Button to clear the grid and spawn 2 (for now) randomly-oriented gliders located 
   semi-randomly within the grid. Sometimes they collide, sometimes they don't.  */
let duellingGlidersButton = document.getElementById("duellingGlidersButton");
duellingGlidersButton.addEventListener("mouseup", event => {
    animating = false;
    setTimeout(() => {
        function getStartingPoints() {
            let points = [];
            let candidates = [
                // northwest quadrant:
                {x: randInRange(3, lifeGrid.width / 2 - 3),  
                 y: randInRange(3, lifeGrid.height / 2 - 3)},
                // northeast quadrant:
                {x: randInRange(lifeGrid.width / 2 + 3, lifeGrid.width - 3),  
                 y: randInRange(3, lifeGrid.height / 2 - 3)},
                // southwest quadrant:
                {x: randInRange(3, lifeGrid.width / 2 - 3),
                 y: randInRange(lifeGrid.height / 2 + 3, lifeGrid.height - 3)},
                // southeast quadrant:
                {x: randInRange(lifeGrid.width / 2 + 3, lifeGrid.width - 3),  
                 y: randInRange(lifeGrid.height / 2 + 3, lifeGrid.height - 3)},
            ];
            for (let i = 0; i < 2; i++) { 
                let candidate = randomIndex(candidates);
                candidates = candidates.filter(x => x != candidate);
                points.push(candidate);
            }
            return points;
        }

        /* Each point represents the top-left point in a 3x3 grid, each of which will
           contain a randomly-oriented glider.  */
        function paintGliders(points, lg) {
            // TODO: Different starting frames
            let orientations = ["north", "south", "east", "west"];
            
            /* Returns the coordinates of the filled edge of the Glider based on 
               the given orientation and starting top-left point of the 3x3 space.  */
            function edge(origin, orientation) { 
                if (orientation == "north") {
                    return [
                        origin,
                        {x: origin.x + 1, y: origin.y},
                        {x: origin.x + 2, y: origin.y}
                    ];
                } else if (orientation == "south") {
                    return [
                        {x: origin.x, y: origin.y + 2},
                        {x: origin.x + 1, y: origin.y + 2},
                        {x: origin.x + 2, y: origin.y + 2}
                    ];
                } else if (orientation == "east") {
                    return [
                        {x: origin.x + 2, y: origin.y},
                        {x: origin.x + 2, y: origin.y + 1},
                        {x: origin.x + 2, y: origin.y + 2}
                    ];
                } else if (orientation == "west") {
                    return [
                        origin,
                        {x: origin.x, y: origin.y + 1},
                        {x: origin.x, y: origin.y + 2}
                    ];
                }
            }

            /* Returns the central rear point of the Glider given the origin and 
               orientation.  */
            function centralRearPoint(origin, orientation) {
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
               orientation.  */
            function middleOffsetPoint(origin, orientation) {
                if (orientation == "north") {
                    let candidates = [ 
                        {x: origin.x, y: origin.y + 1},
                        {x: origin.x + 2, y: origin.y + 1}
                    ];
                    return randomIndex(candidates);
                } else if (orientation == "south") {
                    let candidates = [ 
                        {x: origin.x, y: origin.y + 1},
                        {x: origin.x + 2, y: origin.y + 1}
                    ];
                    return randomIndex(candidates);
                } else if (orientation == "east") {
                    let candidates = [ 
                        {x: origin.x + 1, y: origin.y},
                        {x: origin.x + 1, y: origin.y + 2}
                    ];
                    return randomIndex(candidates);
                } else if (orientation == "west") {
                    let candidates = [ 
                        {x: origin.x + 1, y: origin.y},
                        {x: origin.x + 1, y: origin.y + 2}
                    ];
                    return randomIndex(candidates);
                }
            }

            for (let point of points) { 
                let glider = [];
                let orientation = randomIndex(orientations);
                let edgePoints = edge(point, orientation);
                for (let edgePoint of edgePoints) { 
                    glider.push(edgePoint);
                }
                glider.push(centralRearPoint(point, orientation)); 
                glider.push(middleOffsetPoint(point, orientation));
                for (let cell of glider) { 
                    lifeGrid.set(cell.x, cell.y, true);
                }
            }
        }

        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, false, true);
        let points = getStartingPoints();
        paintGliders(points, lifeGrid); 
        populateTable();
        updateGenLabel();
    }, animationDelay);
});

// Button to clear the grid and spawn a single glider gun:
/* Note: It will survive for about 200 turns before the wrapping universe causes the
   gliders to collide with the gun, and the whole pattern remains alive for about 280
   turns before settling to embers (with the current width/height).  */
let gliderGunButton = document.getElementById("gliderGunButton");
gliderGunButton.addEventListener("mouseup", event => {
    animating = false;
    setTimeout(() => {
        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, false, true);
        let start = {x: 4, y: 9}
        lifeGrid.set(start.x, start.y, true);
        lifeGrid.set(start.x + 1, start.y, true);
        lifeGrid.set(start.x, start.y + 1, true);
        lifeGrid.set(start.x + 1, start.y + 1, true);
        lifeGrid.set(start.x + 10, start.y, true);
        lifeGrid.set(start.x + 10, start.y + 1, true);
        lifeGrid.set(start.x + 10, start.y + 2, true);
        lifeGrid.set(start.x + 11, start.y - 1, true);
        lifeGrid.set(start.x + 12, start.y - 2, true);
        lifeGrid.set(start.x + 13, start.y - 2, true);
        lifeGrid.set(start.x + 11, start.y + 3, true);
        lifeGrid.set(start.x + 12, start.y + 4, true);
        lifeGrid.set(start.x + 13, start.y + 4, true);
        lifeGrid.set(start.x + 14, start.y + 1, true);
        lifeGrid.set(start.x + 15, start.y - 1, true);
        lifeGrid.set(start.x + 15, start.y + 3, true);
        lifeGrid.set(start.x + 16, start.y, true);
        lifeGrid.set(start.x + 16, start.y + 1, true);
        lifeGrid.set(start.x + 16, start.y + 2, true);
        lifeGrid.set(start.x + 17, start.y + 1, true);
        lifeGrid.set(start.x + 20, start.y, true);
        lifeGrid.set(start.x + 21, start.y, true);
        lifeGrid.set(start.x + 20, start.y - 1, true);
        lifeGrid.set(start.x + 21, start.y - 1, true);
        lifeGrid.set(start.x + 20, start.y - 2, true);
        lifeGrid.set(start.x + 21, start.y - 2, true);
        lifeGrid.set(start.x + 22, start.y - 3, true);
        lifeGrid.set(start.x + 22, start.y + 1, true); 
        lifeGrid.set(start.x + 24, start.y - 3, true);
        lifeGrid.set(start.x + 24, start.y - 4, true);
        lifeGrid.set(start.x + 24, start.y + 1, true);
        lifeGrid.set(start.x + 24, start.y + 2, true); 
        lifeGrid.set(start.x + 34, start.y - 1, true); 
        lifeGrid.set(start.x + 34, start.y - 2, true); 
        lifeGrid.set(start.x + 35, start.y - 1, true); 
        lifeGrid.set(start.x + 35, start.y - 2, true); 
        populateTable();
        updateGenLabel();
    }, animationDelay);
});

