/* Conway's Game of Life exercise from Chapter 18 (page 330) of Eloquent JavaScript. I just took the
   exercise and ran with it here, and now it's a whole project of its own.  */

import {randInRange, randomIndex, promptForNumber, randomBrightColor} from "./modules/utility.mjs";
import {LifeGrid} from "./modules/lifeGrid.mjs";
import {ANIMATION_DELAY, LIGHT_BROWN} from "./modules/constants.mjs";

// canvas:
let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

// Cell grid dimensions 
let cellSize = 20;
let cellsHigh = Math.floor(canvas.height / cellSize);
let cellsWide = Math.floor(canvas.width / cellSize);

// Cell grid colors: 
let partyMode = false;
let stonesMode = false;
let goMode = false;
let bg_color = "black";
let cellColor = randomBrightColor();

let animationDelay = ANIMATION_DELAY;
let animating = false;

let togglingEnabled = true;

// Generate grid:
let lifeGrid = new LifeGrid(cellsWide, cellsHigh);  

// Canvas functions:

// Manual cell toggling on canvas click (when enabled):
canvas.addEventListener("mouseup", event => { 
    /* Manually toggle clicked cells */      
    let canvasRect = canvas.getBoundingClientRect();
    let x = event.pageX - canvasRect.left;
    let y = event.pageY - canvasRect.top;
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height && !animating && togglingEnabled) {
        let cell = {x: Math.floor(x / cellSize), y: Math.floor(y / cellSize)};
        let cellState = lifeGrid.get(cell.x, cell.y);
        lifeGrid.set(cell.x, cell.y, !cellState);
        populateCanvas();
    }
});

// Fills in the whole background with the given color:
function fillBackground(color) {
    context.fillStyle = color; 
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// Fills in a given cell with the given color:
function fillCell(x, y, color, circle = false) {
    if (circle) {
        let goCellSize = cellSize - 3;
        let origin = {x: Math.floor(x * cellSize + cellSize / 2), y: Math.floor(y * cellSize + cellSize / 2)};
        context.fillStyle = color;
        context.beginPath();
        if (goMode) {
            context.arc(origin.x, origin.y, goCellSize / 2, 0, Math.PI * 2);
        } else {
            context.arc(origin.x, origin.y, cellSize / 2, 0, Math.PI * 2);
        }
        context.fill();
    } else {
        context.fillStyle = color;
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
}

// Populate canvas from lifeGrid:  
function populateCanvas() {
    if (goMode) {
        fillBackground(LIGHT_BROWN);
        context.fillStyle = "black";
        context.lineWidth = 1;
        for (let y = 0; y < cellsHigh; y++) {
            let ty = y * cellSize + cellSize / 2;
            context.beginPath();
            context.moveTo(0, ty);
            context.lineTo(canvas.width - 1, ty);
            context.stroke(); 
        }
        for (let x = 0; x < cellsWide; x++) {
            let tx = x * cellSize + cellSize / 2;
            context.beginPath();
            context.moveTo(tx, 0);
            context.lineTo(tx, canvas.height - 1);
            context.stroke(); 
        }
        for (let y = 0; y < cellsHigh; y++) {
            for (let x = 0; x < cellsWide; x++) {
                if (lifeGrid.get(x, y) == true) {
                    fillCell(x, y, "white", true);
                } else {
                    fillCell(x, y, "black", true);
                }
            }
        }
    } else {
        fillBackground(bg_color);
        for (let y = 0; y < cellsHigh; y++) {
            for (let x = 0; x < cellsWide; x++) {
                let color = partyMode ? randomBrightColor() : cellColor;
                if (lifeGrid.get(x, y) == true) fillCell(x, y, color, stonesMode); // TODO: add shape in here
            }
        }
    }
}

// Populate the canvas initially:
populateCanvas();

// Update the text label with the current generation on it:
function updateGenLabel() {
    let generationLabel = document.getElementById("generationLabel");
    generationLabel.textContent = `| Generation ${lifeGrid.generation}`;
    generationLabel.style = "color: white";
}

// Advance the simulation by 1 generation, populate the DOM, and update the gen label:
function advanceGen() {
    lifeGrid = lifeGrid.nextLifeGen();
    populateCanvas();
    updateGenLabel();
}

// Applies advanceGen() a given number of times:
function multiGen(count, countLimit) {
    let start = Date.now();
    advanceGen();
    if (count < countLimit && animating) {
        requestAnimationFrame(_ => {
            let end = Date.now();
            let dt = end - start;
            setTimeout(() => {
                multiGen(count + 1, countLimit);
            }, animationDelay - dt);
        });
    } else {
        animating = false;
    }
}

// Buttons to advance generations:

let playButton = document.getElementById("playButton");
playButton.addEventListener("mouseup", event => {
    if (!animating) {
        animating = true;
        multiGen(1, Infinity);
    }
});

let nextButton = document.getElementById("nextButton");
nextButton.addEventListener("mouseup", event => {
    if (!animating) {
        advanceGen();
    }
});

let nextXButton = document.getElementById("nextXButton");
nextXButton.addEventListener("mouseup", event => {
    if (!animating) {
        let gens = promptForNumber("Enter the # of generations: ");
        if (gens != null) {
            animating = true;
            multiGen(1, gens); 
        }
    }
});

// Button to change pixels-per-cell Scale:
let scaleButton = document.getElementById("scaleButton");
scaleButton.addEventListener("mouseup", event => {
    if (!animating) {
        let newScale = promptForNumber(`Enter a # for how many pixels-per-side each cell should have, between 1-32 (currently: ${cellSize}x${cellSize})`)
        if (newScale == null || newScale < 1 || newScale > 32) {
            alert("Invalid input!");
        } else {
            cellSize = newScale;
            cellsHigh = Math.floor(canvas.height / cellSize);
            cellsWide = Math.floor(canvas.width / cellSize);
            animating = false;
            lifeGrid = new LifeGrid(cellsWide, cellsHigh);  
            populateCanvas();
            updateGenLabel();
        }
    }
});

// Button to change the animation delay:
let speedButton = document.getElementById("speedButton");
speedButton.addEventListener("mouseup", event => {
    if (!animating) {
        let input = promptForNumber(`Enter a # for the new animation delay (currently: ${animationDelay}ms)`);
        if (input != null) {
            animationDelay = input;
        }
    }
});

// Buttons to change foreground and background colors on the grid:

let changeBgButton = document.getElementById("changeBgButton");
changeBgButton.addEventListener("mouseup", event => {
    if (!animating && !partyMode) {
        let r = promptForNumber("Enter RED rgb value between 0-255: ");
        let g = promptForNumber("Enter GREEN rgb value between 0-255: ");
        let b = promptForNumber("Enter BLUE rgb value between 0-255: ");
        for (let num of [r, g, b]) {
            if (num < 0 || num > 255) {
                alert("Please enter values between 0-255");
                return;
            }
        }
        bg_color = `rgb(${r}, ${g}, ${b})`;
        populateCanvas();
    }
});

let changeFgButton = document.getElementById("changeFgButton");
changeFgButton.addEventListener("mouseup", event => {
    if (!animating && !partyMode) {
        let r = promptForNumber("Enter RED rgb value between 0-255: ");
        let g = promptForNumber("Enter GREEN rgb value between 0-255: ");
        let b = promptForNumber("Enter BLUE rgb value between 0-255: ");
        for (let num of [r, g, b]) {
            if (num < 0 || num > 255) {
                alert("Please enter values between 0-255");
                return;
            }
        }
        cellColor = `rgb(${r}, ${g}, ${b})`;
        populateCanvas();
    }
});

// Checkbox to enable/disable manual cell toggling:
let manualToggle = document.getElementById("manualToggle");
manualToggle.addEventListener("mouseup", event => {
    togglingEnabled = !togglingEnabled;
});

// Checkbox to enable/disable party mode:
let partyToggle = document.getElementById("partyToggle");
partyToggle.addEventListener("mouseup", event => {
    partyMode = !partyMode;
    bg_color = "black";
    if (!animating) {
        populateCanvas();
    }
});

// Checkbox to enable/disable stones mode:
let stonesToggle = document.getElementById("stonesToggle");
stonesToggle.addEventListener("mouseup", event => {
    stonesMode = !stonesMode;
    if (!animating) {
        populateCanvas();
    }
});

// Checkbox to toggle Go Board mode:
let goToggle = document.getElementById("goToggle");
goToggle.addEventListener("mouseup", event => {
    if (cellSize < 4) {
        alert("Cell size should be at least 4x4px for this display mode. But I would recommend 8x8px or higher. Use other display modes for very small ((such as 1x1 and 2x2) cell sizes.");
    } else {
        goMode = !goMode;
        if (!animating) {
            populateCanvas();
        }
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
        populateCanvas();
        updateGenLabel();
    }, animationDelay);
});

// Button to reset the grid:
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("mouseup", event => {
    animating = false;
    setTimeout(() => {
        lifeGrid = new LifeGrid(lifeGrid.width, lifeGrid.height, true);
        populateCanvas();
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
        populateCanvas();
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
        populateCanvas();
        updateGenLabel();
    }, animationDelay);
});

// Button to clear the grid and spawn a single glider gun:
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
        populateCanvas();
        updateGenLabel();
    }, animationDelay);
});

