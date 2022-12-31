/* Conway's Game of Life exercise from Chapter 18 (page 330) of Eloquent JavaScript. I just took the exercise and ran with it here, and now it's a whole project of its own.  */

import {randInRange, randomIndex, promptForNumber, randomBrightColor} from "./modules/utility.mjs";
import {LifeGrid} from "./modules/lifeGrid.mjs";
import {ANIMATION_DELAY, CELL_SIZE} from "./modules/constants.mjs";
import {populateCanvas, advanceGen, multiGen, updateGenLabel} from "./modules/canvasFunctions.mjs";

// canvas:
let canvas = document.querySelector("canvas");
canvas.width =  window.innerWidth - 10;
canvas.height =  window.innerHeight - 100;
let context = canvas.getContext("2d");

// App and display information bundled for pass-by-reference convenience:
let bundle = {
    animating: false,
    animationDelay: ANIMATION_DELAY,
    partyMode: false,
    cellSize: CELL_SIZE,
    cellsWide: Math.floor(canvas.width / CELL_SIZE),
    cellsHigh: Math.floor(canvas.height / CELL_SIZE),
    canvas: canvas,
    context: context,
    lifeGrid: new LifeGrid(Math.floor(canvas.width / CELL_SIZE), Math.floor(canvas.height / CELL_SIZE)),
    goMode: false,
    stonesMode: false,
    bg_color: "black",
    cellColor: randomBrightColor(),
    togglingEnabled: true
};

// Manual cell toggling on canvas click (when enabled):
canvas.addEventListener("mouseup", event => { 
    /* Manually toggle clicked cells */      
    let canvasRect = canvas.getBoundingClientRect();
    let x = event.pageX - canvasRect.left;
    let y = event.pageY - canvasRect.top;
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height && !bundle.animating && bundle.togglingEnabled) {
        let cell = {x: Math.floor(x / bundle.cellSize), y: Math.floor(y / bundle.cellSize)};
        let cellState = bundle.lifeGrid.get(cell.x, cell.y);
        bundle.lifeGrid.set(cell.x, cell.y, !cellState);
        populateCanvas(bundle);
    }
});

// Populate the canvas initially:
populateCanvas(bundle);

// Buttons to advance generations:

let playButton = document.getElementById("playButton");
playButton.addEventListener("mouseup", event => {
    if (!bundle.animating) {
        bundle.animating = true;
        multiGen(bundle, 1, Infinity);
    }
});

let nextButton = document.getElementById("nextButton");
nextButton.addEventListener("mouseup", event => {
    if (!bundle.animating) {
        advanceGen(bundle);
        updateGenLabel(bundle);
    }
});

let nextXButton = document.getElementById("nextXButton");
nextXButton.addEventListener("mouseup", event => {
    if (!bundle.animating) {
        let gens = promptForNumber("Enter the # of generations: ");
        if (gens != null) {
            bundle.animating = true;
            multiGen(bundle, 1, gens); 
            updateGenLabel(bundle);
        }
    }
});

/* Re-scales the canvas based on the window size and 
   then adjusts the scale of the cells using a given
   cell edge length as an argument.  */
function reScale(newScale) {
    canvas.width =  window.innerWidth - 10;
    canvas.height =  window.innerHeight - 100;
    bundle.cellSize = newScale;
    bundle.cellsHigh = Math.floor(canvas.height / bundle.cellSize);
    bundle.cellsWide = Math.floor(canvas.width / bundle.cellSize);
}

// Button to change pixels-per-cell Scale:
let scaleButton = document.getElementById("scaleButton");
scaleButton.addEventListener("mouseup", event => {
    if (!bundle.animating) {
        let newScale = promptForNumber(`Enter a # for how many pixels-per-side each cell should have, between 1-32 (currently: ${bundle.cellSize}x${bundle.cellSize})`)
        if (newScale == null || newScale < 1 || newScale > 32) {
            alert("Invalid input!");
        } else {
            reScale(newScale);
            bundle.animating = false;
            bundle.lifeGrid = new LifeGrid(bundle.cellsWide, bundle.cellsHigh);
            populateCanvas(bundle);
            updateGenLabel(bundle);
        }
    }
});

// Button to change the animation delay:
let speedButton = document.getElementById("speedButton");
speedButton.addEventListener("mouseup", event => {
    if (!bundle.animating) {
        let input = promptForNumber(`Enter a # for the new animation delay (currently: ${bundle.animationDelay}ms)`);
        if (input != null) {
            bundle.animationDelay = input;
        }
    }
});

// Buttons to change foreground and background colors on the grid:

let changeBgButton = document.getElementById("changeBgButton");
changeBgButton.addEventListener("mouseup", event => {
    if (!bundle.animating && !bundle.partyMode) {
        let r = promptForNumber("Enter RED rgb value between 0-255: ");
        let g = promptForNumber("Enter GREEN rgb value between 0-255: ");
        let b = promptForNumber("Enter BLUE rgb value between 0-255: ");
        for (let num of [r, g, b]) {
            if (num < 0 || num > 255) {
                alert("Please enter values between 0-255");
                return;
            }
        }
        bundle.bg_color = `rgb(${r}, ${g}, ${b})`;
        populateCanvas(bundle);
    }
});

let changeFgButton = document.getElementById("changeFgButton");
changeFgButton.addEventListener("mouseup", event => {
    if (!bundle.animating && !bundle.partyMode) {
        let r = promptForNumber("Enter RED rgb value between 0-255: ");
        let g = promptForNumber("Enter GREEN rgb value between 0-255: ");
        let b = promptForNumber("Enter BLUE rgb value between 0-255: ");
        for (let num of [r, g, b]) {
            if (num < 0 || num > 255) {
                alert("Please enter values between 0-255");
                return;
            }
        }
        bundle.cellColor = `rgb(${r}, ${g}, ${b})`;
        populateCanvas(bundle);
    }
});

// Checkbox to enable/disable manual cell toggling:
let manualToggle = document.getElementById("manualToggle");
manualToggle.addEventListener("mouseup", event => {
    bundle.togglingEnabled = !bundle.togglingEnabled;
});

// Checkbox to enable/disable party mode:
let partyToggle = document.getElementById("partyToggle");
partyToggle.addEventListener("mouseup", event => {
    bundle.partyMode = !bundle.partyMode;
    bundle.bg_color = "black";
    if (!bundle.animating) {
        populateCanvas(bundle);
    }
});

// Checkbox to enable/disable stones mode:
let stonesToggle = document.getElementById("stonesToggle");
stonesToggle.addEventListener("mouseup", event => {
    bundle.stonesMode = !bundle.stonesMode;
    if (!bundle.animating) {
        populateCanvas(bundle);
    }
});

// Checkbox to toggle Go Board mode:
let goToggle = document.getElementById("goToggle");
goToggle.addEventListener("mouseup", event => {
    if (bundle.cellSize < 4) {
        alert("Cell size should be at least 4x4px for this display mode. But I would recommend 8x8px or higher. Use other display modes for very small ((such as 1x1 and 2x2) cell sizes.");
    } else {
        bundle.goMode = !bundle.goMode;
        if (!bundle.animating) {
            populateCanvas(bundle);
        }
    }
});

// Button to stop any current animations:
let stopButton = document.getElementById("stopButton");
stopButton.addEventListener("mouseup", event => {
    bundle.animating = false;
});

// Button to clear the grid:
let clearButton = document.getElementById("clearButton");
clearButton.addEventListener("mouseup", event => {
    bundle.animating = false;
    setTimeout(() => {
        bundle.lifeGrid = new LifeGrid(bundle.lifeGrid.width, bundle.lifeGrid.height, false, true);
        populateCanvas(bundle);
        updateGenLabel(bundle);
    }, bundle.animationDelay);
});

// Button to reset the grid:
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("mouseup", event => {
    bundle.animating = false;
    setTimeout(() => {
        reScale(bundle.cellSize);
        bundle.lifeGrid = new LifeGrid(bundle.lifeGrid.width, bundle.lifeGrid.height, true);
        populateCanvas(bundle);
        updateGenLabel(bundle);
    }, bundle.animationDelay);
});

/* Button to produce a fleet of gliders in formation, to endlessly fly across the grid.  */
let gliderFleetButton = document.getElementById("gliderFleetButton");
gliderFleetButton.addEventListener("mouseup", event => {
    bundle.animating = false;
    setTimeout(() => {
        bundle.lifeGrid = new LifeGrid(bundle.lifeGrid.width, bundle.lifeGrid.height, false, true);
        let orientations = ["north", "south", "east", "west"];
        let fleetOrientation = randomIndex(orientations);
        let fleetConfiguration = Math.floor(Math.random() * 2);
        let superCellSize = 5;
        let superCellsWide = Math.floor(bundle.cellsWide / superCellSize);
        let superCellsHigh = Math.floor(bundle.cellsHigh / superCellSize);
        for (let y = 0; y < superCellsHigh; y++) {  
            for (let x = 0; x < superCellsWide; x++) {
                let gliderOrigin = {x: x * superCellSize + 1, y: y * superCellSize + 1};
                bundle.lifeGrid.stampGlider(gliderOrigin, fleetOrientation, fleetConfiguration);
            }
        }
        populateCanvas(bundle);
        updateGenLabel(bundle);
    }, bundle.animationDelay);
});

/* Button to clear the grid and spawn 2 (for now) randomly-oriented gliders located 
   semi-randomly within the grid. Sometimes they collide, sometimes they don't.  */
let duellingGlidersButton = document.getElementById("duellingGlidersButton");
duellingGlidersButton.addEventListener("mouseup", event => {
    bundle.animating = false;
    setTimeout(() => {
        bundle.lifeGrid = new LifeGrid(bundle.lifeGrid.width, bundle.lifeGrid.height, false, true);
        let orientations = ["north", "south", "east", "west"];
        let superCellSize = 5;
        let superCellsWide = Math.floor(bundle.cellsWide / superCellSize);
        let superCellsHigh = Math.floor(bundle.cellsHigh / superCellSize);
        let availableSuperCells = [];
        for (let y = 0; y < superCellsHigh; y++) {
            for (let x = 0; x < superCellsWide; x++) {
                availableSuperCells.push({x: x, y: y});
            }
        }
        let numGliders = 2; // for now
        for (let i = 0; i < numGliders; i++) {
            let orientation = randomIndex(orientations);
            let configuration = Math.floor(Math.random() * 2);
            let gliderOrigin = randomIndex(availableSuperCells);
            availableSuperCells = availableSuperCells.filter(cell => !(cell.x === gliderOrigin.x && cell.y === gliderOrigin.y));
            gliderOrigin = {x: gliderOrigin.x * superCellSize + 1, y: gliderOrigin.y + superCellSize + 1};
            bundle.lifeGrid.stampGlider(gliderOrigin, orientation, configuration);
        }
        populateCanvas(bundle);
        updateGenLabel(bundle);
    }, bundle.animationDelay);
});

// Button to clear the grid and spawn a single glider gun:
let gliderGunButton = document.getElementById("gliderGunButton");
gliderGunButton.addEventListener("mouseup", event => {
    bundle.animating = false;
    setTimeout(() => {
        bundle.lifeGrid = new LifeGrid(bundle.lifeGrid.width, bundle.lifeGrid.height, false, true);
        let start = {x: 4, y: 9}
        bundle.lifeGrid.set(start.x, start.y, true);
        bundle.lifeGrid.set(start.x + 1, start.y, true);
        bundle.lifeGrid.set(start.x, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 1, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 10, start.y, true);
        bundle.lifeGrid.set(start.x + 10, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 10, start.y + 2, true);
        bundle.lifeGrid.set(start.x + 11, start.y - 1, true);
        bundle.lifeGrid.set(start.x + 12, start.y - 2, true);
        bundle.lifeGrid.set(start.x + 13, start.y - 2, true);
        bundle.lifeGrid.set(start.x + 11, start.y + 3, true);
        bundle.lifeGrid.set(start.x + 12, start.y + 4, true);
        bundle.lifeGrid.set(start.x + 13, start.y + 4, true);
        bundle.lifeGrid.set(start.x + 14, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 15, start.y - 1, true);
        bundle.lifeGrid.set(start.x + 15, start.y + 3, true);
        bundle.lifeGrid.set(start.x + 16, start.y, true);
        bundle.lifeGrid.set(start.x + 16, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 16, start.y + 2, true);
        bundle.lifeGrid.set(start.x + 17, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 20, start.y, true);
        bundle.lifeGrid.set(start.x + 21, start.y, true);
        bundle.lifeGrid.set(start.x + 20, start.y - 1, true);
        bundle.lifeGrid.set(start.x + 21, start.y - 1, true);
        bundle.lifeGrid.set(start.x + 20, start.y - 2, true);
        bundle.lifeGrid.set(start.x + 21, start.y - 2, true);
        bundle.lifeGrid.set(start.x + 22, start.y - 3, true);
        bundle.lifeGrid.set(start.x + 22, start.y + 1, true); 
        bundle.lifeGrid.set(start.x + 24, start.y - 3, true);
        bundle.lifeGrid.set(start.x + 24, start.y - 4, true);
        bundle.lifeGrid.set(start.x + 24, start.y + 1, true);
        bundle.lifeGrid.set(start.x + 24, start.y + 2, true); 
        bundle.lifeGrid.set(start.x + 34, start.y - 1, true); 
        bundle.lifeGrid.set(start.x + 34, start.y - 2, true); 
        bundle.lifeGrid.set(start.x + 35, start.y - 1, true); 
        bundle.lifeGrid.set(start.x + 35, start.y - 2, true); 
        populateCanvas(bundle);
        updateGenLabel(bundle);
    }, bundle.animationDelay);
});

