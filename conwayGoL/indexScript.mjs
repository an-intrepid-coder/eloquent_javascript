import {LifeGrid} from "./modules/lifeGrid.mjs";
import {CELL_SIZE} from "./modules/constants.mjs";
import {populateCanvas, multiGen} from "./modules/canvasFunctions.mjs";
import {randomBrightColor} from "./modules/utility.mjs";

// canvas:
let canvas = document.querySelector("canvas");
canvas.width =  window.innerWidth;
canvas.height =  document.body.scrollHeight;
let context = canvas.getContext("2d");

// App and display information bundled for pass-by-reference convenience:
let bundle = {
    animating: true,
    animationDelay: 200,
    partyMode: false,
    cellSize: 16,
    cellsWide: Math.floor(canvas.width / CELL_SIZE),
    cellsHigh: Math.floor(canvas.height / CELL_SIZE),
    canvas: canvas,
    context: context,
    lifeGrid: new LifeGrid(Math.floor(canvas.width / CELL_SIZE), Math.floor(canvas.height / CELL_SIZE)),
    goMode: false,
    stonesMode: false,
    bg_color: "black",
    cellColor: randomBrightColor(),
    togglingEnabled: false
};

populateCanvas(bundle);
multiGen(bundle, 1, Infinity);

