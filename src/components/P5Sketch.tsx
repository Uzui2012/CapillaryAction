import Sketch from 'react-p5';

function P5Sketch() {
    // Global grid constants & variables.
    const falling = 2;
    const stable = 1;
    const empty = 0;
    const glass = -1;
    const squareWidth = 8;
    let grid: any;
    let cols: number, rows: number;

    // Makes 2D Array of size cols by rows.
    function make2DArray(cols: number, rows: number) {
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
    function initGrid(width: number, height: number, squareWidth: number) {
        cols = width / squareWidth;
        rows = height / squareWidth;
        grid = make2DArray(cols, rows)
    }

    // Sets a stable liquid pixel on the left edge.
    function setStableLeftEdge(i: number, j: number, grid: any, nextGrid: any) {
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
    function setStableRightEdge(i: number, j: number, grid: any, nextGrid: any) {
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

    // Trys to move to an empty space on the left, returns true if this happened
    // and false if not.
    function tryMoveLeft(i: number, j: number, stateL: number, nextGrid: any) {
        if(stateL === empty && nextGrid[i-1][j] === empty){
            nextGrid[i-1][j]  = stable;
            return true;
        }else{
            nextGrid[i][j] = stable;
            return false;
        }
    }

    // Trys to move to an empty space on the right, returns true if this happened
    // and false if not.
    function tryMoveRight(i: number, j: number, stateR: number, nextGrid: any) {
        if(stateR === empty && nextGrid[i+1][j] === empty){
            nextGrid[i+1][j] = stable;
            return true;
        }else{
            nextGrid[i][j] = stable;
            return false;
        }
    }

    // Sets a stable liquid pixel in the middle.
    function setStableMiddle(i: number, j: number, grid: any, nextGrid: any) {
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
                if(!tryMoveRight(i, j, stateR, nextGrid)){
                    //tryMoveLeft(i, j, stateL, nextGrid);
                }
            }else{ // Try to go Left
                if(!tryMoveLeft(i, j, stateL, nextGrid)){
                    //tryMoveRight(i, j, stateR, nextGrid);
                }
            }
        }else{
            nextGrid[i][j] = stable;
        }
    }

    // Sets a stable liquid pixel.
    function setStableLiquid(i: number, j: number, grid: any, nextGrid: any) {
        if(j+1 > rows){
            nextGrid[i][j] = stable;
            return;
        }
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

    // Sets a falling liquid pixel.
    function setFallingLiquid(i: number, j: number, grid: any, nextGrid: any) {
        if(j+1 >= rows){
            nextGrid[i][j] = stable;
        }
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
            //console.log("freefalling pixel");
        }else{
            if(nextGrid[i][j+1] === empty){
                nextGrid[i][j+1] = stable;
            }else{
                nextGrid[i][j] = stable;
            }
        }
    }

    // Will always just check the left two pixels for an empty followed by more
    // glass. Returning true if so, false otherwise
    function checkForCapillary(i: number, j: number, grid: any) {
        // Catch left-edge edge case. 
        if(i - 1 < 0 || i - 2 < 0){
            return false;
        }

        if(grid[i-1][j] === empty && grid[i-2][j] === glass){
            return true;
        }
        return false;
    }

    // Sets glass position on the next grid.
    function setGlass(i: number, j: number, grid: any, nextGrid: any) {
        nextGrid[i][j] = grid[i][j];
    }

    // Applies algorithm for capillary action on this instance in the grid.
    function applyCapillaryAction(i: number, j: number, grid: any, nextGrid: any) {
        if(j-1 < 0 || j+1 >= rows){
            return false;
        }

        if(grid[i][j-1] === empty && grid[i][j+1] === stable
        && grid[i-1][j+1] === stable && grid[i+1][j+1] === stable){
            nextGrid[i][j] = stable;
            nextGrid[i][j+1] = empty;
            return true;   
        }else if(grid[i][j+1] === stable && grid[i-1][j+1] === glass 
                && grid[i+1][j+1] === glass && grid[i][j+2] === stable){
            nextGrid[i][j] = stable;
            nextGrid[i][j+1] = empty;
            return true;
        }else if(grid[i][j+1] === empty && grid[i-1][j+1] === glass 
                && grid[i+1][j+1] === glass && grid[i][j+2] === stable){
            nextGrid[i][j] = stable;
            nextGrid[i][j+1] = empty;
            return true;
        }
        return false;
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
                    case glass:
                        setGlass(i, j, grid, nextGrid);
                        if(checkForCapillary(i, j, grid)){
                            applyCapillaryAction(i-1, j, grid, nextGrid);
                        }
                        break;
                }
            }
        }
        return nextGrid;
    }

    // Returns a random integer between 0 and "max" argument 
    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    // Check if a row is within the bounds
    function withinCols(i: number) {
        return i >= 0 && i <= cols - 1;
    }

    // Check if a column is within the bounds
    function withinRows(j: number) {
        return j >= 0 && j <= rows - 1;
    }
   
    // Initialises positions of glass pixels on grid
    function initGlass() {
        for(let i = rows - 15; i < rows - 5; i++){
            grid[25][i] = glass;
            grid[27][i] = glass;
        }
    }

    // setup is the first thing called when p5-sketch.js is called.
    const setup = (p5: any, canvasParentRef: any) => {
        var canvas = p5.createCanvas(400, 200)
        canvas.parent(canvasParentRef);
        p5.frameRate(60);
        initGrid(canvas.width, canvas.height, squareWidth);
        initGlass();
        getNextGrid();
    }
    // Called when p5 detects the mouse is clicked and dragged on canvas.
    const mouseDragged = (p5: any) => {
        let mouseCol = p5.floor(p5.mouseX / squareWidth);
        let mouseRow = p5.floor(p5.mouseY / squareWidth);
        let mSize = 20;
        let colStart = mouseCol;
        let rowStart = mouseRow;
        for(let i = colStart; i < colStart + mSize; i++){
            for(let j = rowStart; j < rowStart + mSize; j++){
                if (withinCols(colStart) && withinRows(rowStart)
                    && grid[colStart][rowStart] === empty) {
                    grid[colStart][rowStart] = falling;
                }
            }
        }
    }

    // Called each new frame the canvas is rendered.
    const draw = (p5: any) => {
        let waterColour = p5.color(50, 100, 255);
        let waterfallColour =p5.color(80, 150, 255);
        let tankColour = p5.color(50, 50, 50);
        let glassColour = p5.color(100, 100, 100);
        for (let i = 0; i < cols; i++){
            for (let j = 0; j < rows; j++){
                if(grid[i][j] === stable){
                    p5.stroke(waterColour);
                    p5.fill(waterColour);
                }else if(grid[i][j] === falling){
                    p5.stroke(waterfallColour);
                    p5.fill(waterfallColour);
                }else if(grid[i][j] === empty){
                    p5.stroke(tankColour);
                    p5.fill(tankColour);
                }else if(grid[i][j] === glass){
                    p5.stroke(glassColour);
                    p5.fill(glassColour);
                }else{
                    p5.stroke(255);
                    p5.fill(180);
                }
                let x = i * squareWidth;
                let y = j * squareWidth;
                p5.square(x, y, squareWidth);
            }
        }
        grid = getNextGrid();
    }

    return (
        <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged}/>
    );
}

export default P5Sketch;