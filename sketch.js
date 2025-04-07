// Global grid variables
let grid;
let nextGrid;
let squareWidth = 10;
let cols, rows;

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

function initGrid() {
    cols = width / squareWidth;
    rows = height / squareWidth;
    grid = make2DArray(cols, rows)
}

function getNextGrid() {
    let nextGrid = make2DArray(cols, rows)
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            let state = grid[i][j];
            
            if(state == 1){
                // Move
                if(j+1 >= rows){
                    nextGrid[i][j] = state;
                }else{
                    if(i-1 < 0 || i+1 == cols){
                        if(grid[i][j+1] == 0){
                            nextGrid[i][j+1] = 1;
                        }else{
                            nextGrid[i][j] = 1;
                        }
                    }else{
                        let stateB = grid[i][j+1];
                        let stateL = grid[i-1][j];
                        let stateR = grid[i+1][j];
                        let stateBL = grid[i-1][j+1];
                        let stateBR = grid[i+1][j+1];

                        if(stateB == 0){
                            nextGrid[i][j+1] = 1;
                            console.log(1);
                        }else{
                            if(!stateL && stateR && stateBL && stateBR){
                                nextGrid[i - 1][j] = 1;
                            }else if(stateL && !stateR && stateBL && stateBR){
                                nextGrid[i + 1][j] = 1;
                            }else if(!stateL && !stateR && !stateBL && stateBR){
                                nextGrid[i - 1][j + 1] = 1;
                            }else if(!stateL && !stateR && stateBL && !stateBR){
                                nextGrid[i + 1][j + 1] = 1;
                            
                            // Falls as a cube

                            }else if(stateL && !stateR && stateBL && !stateBR){
                                nextGrid[i + 1][j + 1] = 1;
                            }else if(!stateL && stateR && !stateBL && stateBR){
                                nextGrid[i - 1][j + 1] = 1;

                            }else if(stateL && !stateR && !stateBL && stateBR){
                                nextGrid[i][j] = 1;

                            }else if(!stateL && stateR && stateBL && !stateBR){
                                nextGrid[i][j] = 1;
                            

                            }else if(!stateL && !stateR && stateBL && stateBR){
                                let dir;
                                if(getRandomInt(2) == 0){
                                    dir = -1
                                }else{
                                    dir = 1
                                }
                                nextGrid[i + dir][j] = 1;
                                //console.log("random");
                            }else{
                                nextGrid[i][j] = 1;
                            }
                        }
                    }
                }
                
            }
        }
    }
    return nextGrid;
}

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

function mouseDragged() {
    let mouseCol = floor(mouseX / squareWidth);
    let mouseRow = floor(mouseY / squareWidth);

    mSize = 20;
    colStart = mouseCol;
    rowStart = mouseRow;
    for(let i = colStart; i < colStart + mSize; i++){
        for(let j = rowStart; j < rowStart + mSize; j++){
            if (withinCols(colStart) && withinRows(rowStart)) {
                grid[colStart][rowStart] = 1
            }
            
        }
    }
}

// Both setup() and draw() are called on saving of this file.
// createCanvas creates and renders a canvas space on index.html
function setup() {
    createCanvas(500, 500);
    frameRate(5);
    initGrid();

    
    
    //grid = getNextGrid();
}

// Rendering occurs in here, 60 times a second (default)
function draw() {
    background(220);
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            stroke(255);
            if(grid[i][j] > 0){
                fill(255);
            }
             else if(grid[i][j] == 0){
                 fill(0);
            }
            else{
                fill(180);
            }
            let x = i * squareWidth;
            let y = j * squareWidth;
            square(x, y, squareWidth);
        }
    }
    grid = getNextGrid();
}
