// Global grid constants & variables
const falling = 2;
const static = 1;
const empty = 0;
let grid;
let nextGrid;
const squareWidth = 10;
let cols, rows;

// Makes 2D Array of size cols by rows
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

// Calculates next iteration of the grid, returning that resultant grid
function getNextGrid() {
    let nextGrid = make2DArray(cols, rows)
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            let state = grid[i][j];

            if(state == 1){ // Liquid is currently not in freefall
                // Check if liquid is now in freefall
                if(j+1 > rows){
                    nextGrid[i][j] = 1;
                }else{
                    // LIQUID PIXEL IS STATIC NOW HANDLE CLOSE RANGE

                    // Left Edge
                    if(i-1 < 0){
                        let stateR = grid[i+1][j];
                        let stateBR = grid[i+1][j+1];
                        let stateAR = grid[i+1][j-1];
                        let below = grid[i][j+1];

                        if(stateBR > 0 && stateR === 0 && stateAR === 0 
                            && below === static && nextGrid[i+1][j] === 0){
                            nextGrid[i+1][j] = static;
                        }else if(grid[i][j+1] === 0){
                            nextGrid[i][j+1] = falling;
                        }else{
                            nextGrid[i][j] = static;
                        }

                    // Right Edge
                    }else if(i+1 >= cols){
                        let stateL = grid[i-1][j];
                        let stateBL = grid[i-1][j+1];
                        let stateAL = grid[i-1][j-1];
                        let below = grid[i][j+1];

                        if(stateBL > 0 && stateL === 0 && stateAL === 0 
                            && below === static && nextGrid[i-1][j] === 0){
                            nextGrid[i-1][j] = static;
                        }else if(grid[i][j+1] === 0){
                            nextGrid[i][j+1] = falling;
                        }else{
                            nextGrid[i][j] = static;
                        }
                    
                    // Middle
                    }else{
                        let stateL = grid[i-1][j];
                        let stateR = grid[i+1][j];
                        let below = grid[i][j+1];

                        if(below === 0){
                            if(nextGrid[i][j+1] === 0){
                                nextGrid[i][j+1] = static;
                            }else{
                                nextGrid[i][j] = falling;
                            }
                            continue;
                        }

                        if(stateL === empty || stateR === empty){
                            let randInt = getRandomInt(2);
                            if(randInt === 0){
                                randInt -= 1;
                            }
                            // Try to go Right
                            if(randInt > 0){
                                if(stateR === 0 && nextGrid[i+1][j] === 0){
                                    nextGrid[i+1][j] = static;
                                }else{
                                    nextGrid[i][j] = static;
                                }
                            }else{ // Try to go Left
                                if(stateL === 0 && nextGrid[i-1][j] === 0){
                                    nextGrid[i-1][j]  = static;
                                }else{
                                    nextGrid[i][j] = static;
                                }
                            }
                        }else{
                            nextGrid[i][j] = static;
                        }
                    }
                }
            }else if(state == 2){ // Liquid is currently in freefall
                if(j+1 >= rows){
                    nextGrid[i][j] = static;
                }else{
                    let freefallFlag = true;
                    for(let k = j+1; k <= rows; k++){
                        if(grid[i][k] === 0){
                            freefallFlag = true;
                            break;
                        }else{
                            freefallFlag = false;
                        }
                    }
                    if(!freefallFlag){
                        nextGrid[i][j] = static;
                    }else{
                        if (nextGrid[i][j+1] === 0){
                            nextGrid[i][j+1] = static;
                        }else{
                            nextGrid[i][j] = static;
                        }
                    }
                }
            }
        }
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
                grid[colStart][rowStart] = 2;
            }
            
        }
    }
}

// Both setup() and draw() are called on saving of this file.
// createCanvas creates and renders a canvas space on index.html
function setup() {
    createCanvas(500, 500);
    frameRate(6000);
    initGrid();
}

// Rendering occurs in here, 60 times a second (default)
function draw() {
    background(220);
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            stroke(255);
            if(grid[i][j] == 1){
                fill(255);
            }else if(grid[i][j] == 2){
                 fill(100);
            }else if(grid[i][j] == 0){
                 fill(0);
            }else{
                fill(180);
            }
            let x = i * squareWidth;
            let y = j * squareWidth;
            square(x, y, squareWidth);
        }
    }
    grid = getNextGrid();
}
