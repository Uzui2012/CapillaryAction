// Global grid constants & variables.
const falling = 2;
const stable = 1;
const empty = 0;
const glass = -1;
let grid;
let nextGrid;
const squareWidth = 5;
let cols, rows;

// Makes 2D Array of size cols by rows.
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        // Fill the array with 0s
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

// Initialises grid with a 2D array of size scaled to the cols/rows to canvas
// dimensions.
function initGrid() {
    cols = width / squareWidth;
    rows = height / squareWidth;
    grid = make2DArray(cols, rows)
}

// Sets a stable liquid pixel on the left edge.
function setStableLeftEdge(i, j, grid, nextGrid){
    let stateR = grid[i+1][j];
    let stateBR = grid[i+1][j+1];
    let stateAR = grid[i+1][j-1];
    let below = grid[i][j+1];

    if(stateBR !== empty && stateR === empty && stateAR === empty
            && below === stable && nextGrid[i+1][j] === empty){
        nextGrid[i+1][j] = stable;
    }else if(grid[i][j+1] === empty){
        nextGrid[i][j+1] = falling;
    }else{
        nextGrid[i][j] = stable;
    }
}

// Sets a stable liquid pixel on the right edge.
function setStableRightEdge(i, j, grid, nextGrid){
    let stateL = grid[i-1][j];
    let stateBL = grid[i-1][j+1];
    let stateAL = grid[i-1][j-1];
    let below = grid[i][j+1];

    if(stateBL !== empty && stateL === empty && stateAL === empty
            && below === stable && nextGrid[i-1][j] === empty){
        nextGrid[i-1][j] = stable;
    }else if(grid[i][j+1] === empty){
        nextGrid[i][j+1] = falling;
    }else{
        nextGrid[i][j] = stable;
    }
}

// Sets a stable liquid pixel in the middle.
function setStableMiddle(i, j, grid, nextGrid){
    let stateL = grid[i-1][j];
    let stateR = grid[i+1][j];
    let below = grid[i][j+1];

    if(below === empty){
        if(nextGrid[i][j+1] === empty){
            nextGrid[i][j+1] = stable;
        }else{
            nextGrid[i][j] = falling;
        }
        return;
    }

    if(stateL === empty || stateR === empty){
        let randInt = getRandomInt(2);
        if(randInt === 0){
            randInt -= 1;
        }
        // Try to go Right
        if(randInt > 0){
            if(stateR === empty && nextGrid[i+1][j] === empty){
                nextGrid[i+1][j] = stable;
            }else{
                nextGrid[i][j] = stable;
            }
        }else{ // Try to go Left
            if(stateL === empty && nextGrid[i-1][j] === empty){
                nextGrid[i-1][j]  = stable;
            }else{
                nextGrid[i][j] = stable;
            }
        }
    }else{
        nextGrid[i][j] = stable;
    }
}

// Sets a stable liquid pixel.
function setStableLiquid(i, j, grid, nextGrid){
    if(j+1 > rows){
        nextGrid[i][j] = stable;
    }else{
        // Left Edge
        if(i-1 < 0){
            setStableLeftEdge(i, j, grid, nextGrid);
        // Right Edge
        }else if(i+1 >= cols){
            setStableRightEdge(i, j, grid, nextGrid);
        // Middle
        }else{
            setStableMiddle(i, j, grid, nextGrid);
        }
    }
}

// Sets a falling liquid pixel.
function setFallingLiquid(i, j, grid, nextGrid){
    if(j+1 >= rows){
        nextGrid[i][j] = stable;
    }else{
        let freefallFlag = true;
        for(let k = j+1; k <= rows; k++){
            if(grid[i][k] === empty){
                freefallFlag = true;
                break;
            }else{
                freefallFlag = false;
            }
        }
        if(!freefallFlag){
            nextGrid[i][j] = stable;
        }else{
            if (nextGrid[i][j+1] === empty){
                nextGrid[i][j+1] = stable;
            }else{
                nextGrid[i][j] = stable;
            }
        }
    }
}

function checkForCapillary(grid, row) {
    
}

// Calculates next iteration of the grid, returning that resultant grid
function getNextGrid() {
    let nextGrid = make2DArray(cols, rows)
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            let state = grid[i][j];
            switch(state){
                case stable:
                    setStableLiquid(i, j, grid, nextGrid);
                    break;
                case falling:
                    setFallingLiquid(i, j, grid, nextGrid);
                    break;
            }
        }
    }

    for(let row = 0; row < rows; row++){
        checkForCapillary(grid, row);
    }

    return nextGrid;
}

// Returns a random integer between 0 and "max" argument 
function getRandomInt(max) {
    answer = Math.floor(Math.random() * max);
    return answer;
}

// Check if a row is within the bounds
function withinCols(i) {
    return i >= 0 && i <= cols - 1;
}

// Check if a column is within the bounds
function withinRows(j) {
    return j >= 0 && j <= rows - 1;
}

// Called when p5 detects the mouse is clicked and dragged on canvas.
function mouseDragged() {
    let mouseCol = floor(mouseX / squareWidth);
    let mouseRow = floor(mouseY / squareWidth);

    mSize = 20;
    colStart = mouseCol;
    rowStart = mouseRow;
    for(let i = colStart; i < colStart + mSize; i++){
        for(let j = rowStart; j < rowStart + mSize; j++){
            if (withinCols(colStart) && withinRows(rowStart)) {
                grid[colStart][rowStart] = falling;
            }
        }
    }
}

function initGlass() {
    for(let i = 5; i < 15; i++){
        grid[22][i] = glass;
        grid[24][i] = glass;
    }
}

// Both setup() and draw() are called on saving of this file.
// createCanvas creates and renders a canvas space on index.html
function setup() {
    createCanvas(200, 100);
    frameRate(60);
    initGrid();
    initGlass();
}

// Rendering occurs in here, 60 times a second (default)
function draw() {
    let waterColour = color(50, 100, 255);
    let waterfallColour = color(80, 150, 255);
    let tankColour = color(50, 50, 50);
    let glassColour = color(100, 100, 100);

    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            if(grid[i][j] === stable){
                stroke(waterColour);
                fill(waterColour);
            }else if(grid[i][j] === falling){
                stroke(waterfallColour);
                fill(waterfallColour);
            }else if(grid[i][j] === empty){
                stroke(tankColour);
                fill(tankColour);
            }else if(grid[i][j] === glass){
                stroke(glassColour);
                fill(glassColour);
            }else{
                stroke(255);
                fill(180);
            }
            let x = i * squareWidth;
            let y = j * squareWidth;
            square(x, y, squareWidth);
        }
    }
    grid = getNextGrid();
    initGlass();

}
