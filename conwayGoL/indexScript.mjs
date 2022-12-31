import {LifeGrid} from "./modules/lifeGrid.mjs";
import {INDEX_CELL_SIZE, INDEX_ANIMATION_DELAY} from "./modules/constants.mjs";
import {populateCanvas, multiGen} from "./modules/canvasFunctions.mjs";
import {randomBrightColor} from "./modules/utility.mjs";

// canvas:
let canvas = document.querySelector("canvas");
canvas.width =  document.body.scrollWidth;
canvas.height =  document.body.scrollHeight;
let context = canvas.getContext("2d");

// App and display information bundled for pass-by-reference convenience:
let bundle = {
    animating: true,
    animationDelay: INDEX_ANIMATION_DELAY,
    partyMode: false,
    cellSize: INDEX_CELL_SIZE,
    cellsWide: Math.floor(canvas.width / INDEX_CELL_SIZE),
    cellsHigh: Math.floor(canvas.height / INDEX_CELL_SIZE),
    canvas: canvas,
    context: context,
    lifeGrid: new LifeGrid(Math.floor(canvas.width / INDEX_CELL_SIZE), Math.floor(canvas.height / INDEX_CELL_SIZE)),
    goMode: true,
    stonesMode: false,
    bg_color: "black",
    cellColor: randomBrightColor(),
    togglingEnabled: false
};

populateCanvas(bundle);
multiGen(bundle, 1, Infinity, false);

