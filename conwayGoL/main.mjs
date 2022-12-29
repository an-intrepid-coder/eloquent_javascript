// Conway's Game of Life exercise from Chapter 18 of Eloquent JavaScript.

import {randInRange, randomIndex} from "./modules/utility.mjs";
import {LifeGrid} from "./modules/lifeGrid.mjs";
import {animationDelay} from "./modules/constants.mjs";

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

/* Button to produce a fleet of gliders in formation, to endlessly fly across the grid.  */
let gliderFleetButton = document.getElementById("gliderFleetButton");
gliderFleetButton.addEventListener("mouseup", event => {
    animating = false;
    setTimeout(() => {
        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, false, true);
        let orientations = ["north", "south", "east", "west"];
        let fleetOrientation = randomIndex(orientations);
        let fleetConfiguration = Math.floor(Math.random() * 2);
        let origin = {x: 0, y: 0};
        const numGliders = 45;

        /* Checks a 5x5 square based on the current origin for any living cells and returns false if 
           it finds any. Returns true otherwise.  */
        function checkSquare() {
            for (let y = origin.y; y < origin.y + 5; y++) {
                for (let x = origin.x; x < origin.x + 5; x++) {
                    let ty = y;
                    let tx = x;
                    if (ty < 0 || ty >= lifeGrid.height) ty *= -1;
                    if (tx < 0 || tx >= lifeGrid.width) tx *= -1;
                    if (lifeGrid.get(tx, ty) == true) return false;
                }
            }
            return true;
        }

        for (let i = 0; i < numGliders; i++) {  // TODO: Fix -- it's close
            if (!checkSquare()) break;
            let gliderOrigin = {x: origin.x + 1, y: origin.y + 1};
            lifeGrid.stampGlider(gliderOrigin, fleetOrientation, fleetConfiguration);
            origin = {x: origin.x + 5, y: origin.y};
            if (origin.x + 5 >= lifeGrid.width - 1) {
                origin = {x: 0, y: origin.y + 5};
            }
        }
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

        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, false, true);
        let orientations = ["north", "south", "east", "west"];
        let points = getStartingPoints();
        for (let point of points) { 
            let orientation = randomIndex(orientations);
            lifeGrid.stampGlider(point, orientation);
        }
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

