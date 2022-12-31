import {LIGHT_BROWN} from "./constants.mjs";
import {randomBrightColor} from "./utility.mjs";

// Fills in the whole background with the given color:
function fillBackground(canvas, context, color) {
    context.fillStyle = color; 
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// Fills in a given cell with the given color:
function fillCell(context, cellSize, x, y, color, circle = false) {
    if (circle) {
        let origin = {x: Math.floor(x * cellSize + cellSize / 2), y: Math.floor(y * cellSize + cellSize / 2)};
        context.fillStyle = color;
        context.beginPath();
        if (goMode) {
            let goCellSize = cellSize - 3;
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
export function populateCanvas(bundle) {
    if (bundle.goMode) {
        fillBackground(bundle.canvas, bundle.context, LIGHT_BROWN);
        bundle.context.fillStyle = "black";
        bundle.context.lineWidth = 1;
        for (let y = 0; y < bundle.cellsHigh; y++) {
            let ty = y * bundle.cellSize + bundle.cellSize / 2;
            bundle.context.beginPath();
            bundle.context.moveTo(0, ty);
            bundle.context.lineTo(canvas.width - 1, ty);
            bundle.context.stroke(); 
        }
        for (let x = 0; x < bundle.cellsWide; x++) {
            let tx = x * bundle.cellSize + bundle.cellSize / 2;
            bundle.context.beginPath();
            bundle.context.moveTo(tx, 0);
            bundle.context.lineTo(tx, bundle.canvas.height - 1);
            bundle.context.stroke(); 
        }
        for (let y = 0; y < bundle.cellsHigh; y++) {
            for (let x = 0; x < bundle.cellsWide; x++) {
                if (bundle.lifeGrid.get(x, y) == true) {
                    fillCell(bundle.context, bundle.cellSize, x, y, "white", true);
                } else {
                    fillCell(bundle.context, bundle.cellSize, x, y, "black", true);
                }
            }
        }
    } else {
        fillBackground(bundle.canvas, bundle.context, bundle.bg_color);
        for (let y = 0; y < bundle.cellsHigh; y++) {
            for (let x = 0; x < bundle.cellsWide; x++) {
                let color = bundle.partyMode ? randomBrightColor() : bundle.cellColor;
                if (bundle.lifeGrid.get(x, y) == true) fillCell(bundle.context, bundle.cellSize, x, y, color, bundle.stonesMode); 
            }
        }
    }
}

// Advance the simulation by 1 generation, populate the canvas, and update the gen label:
export function advanceGen(bundle) {
    bundle.lifeGrid = bundle.lifeGrid.nextLifeGen();
    populateCanvas(bundle);
}

// Applies advanceGen() a given number of times:
export function multiGen(bundle, count, countLimit) { 
    let start = Date.now();
    advanceGen(bundle);
    if (count < countLimit && bundle.animating) {
        requestAnimationFrame(_ => {
            let end = Date.now();
            let dt = end - start;
            setTimeout(() => {
                multiGen(bundle, count + 1, countLimit);
            }, bundle.animationDelay - dt);
        });
    } else {
        bundle.animating = false;
    }
}

