const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []

readInterface
.on('line', function(line) {
    grid.push(line)
})
.on('close', function() {
    const [ height, width ] = getGridHeigthAndWidth(grid)
    let riskLevel = 0

    for ( let y = 0 ; y < height ; y++ ) {
        for ( let x = 0 ; x < width ; x++ ) {
            if ( parseInt(grid[y][x]) < getAdjacentLowestPoint(x, y, grid)) {
                riskLevel += (1 + parseInt(grid[y][x]))
            }
        }
    }

    console.log(riskLevel)
 });

function getAdjacentLowestPoint(x, y, grid) {
    const [ height, width ] = getGridHeigthAndWidth(grid)
    let lowest
    
    if ( y !== 0) {
        lowest = parseInt(grid[y-1][x])
    }
    if ( x !== 0) {
        if( lowest == null || parseInt(grid[y][x-1]) < lowest) {
            lowest = parseInt(grid[y][x-1])
        }
    }
    if ( x !== (width - 1)) {
        
        if( lowest == null || parseInt(grid[y][x+1]) < lowest) {
            lowest = parseInt(grid[y][x+1])   
        }
    }
    if ( y !== (height - 1)) {
        if( lowest == null || parseInt(grid[y+1][x]) < lowest) {
            lowest = parseInt(grid[y+1][x])
        }
    }
    return lowest
}

function getGridHeigthAndWidth (grid) {
    return [ grid.length, grid[0].length]
}