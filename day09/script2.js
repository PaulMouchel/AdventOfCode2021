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
    let checked = []
    for (let row = 0 ; row < height ; row++) {
        checked.push(new Array(width))
    }
    let basinIdentifier = 1

    // Identification des bassins par ligne
    for ( let y = 0 ; y < height ; y++ ) {
        for ( let x = 0 ; x < width ; x++ ) {
            let current = grid[y][x]
            if (current == 9) {
                checked[y][x] = 0
                basinIdentifier++
            } else {
                checked[y][x] = basinIdentifier
            }
        }
        basinIdentifier++
    }

    // Propagation des bassins
    for ( let y = 0 ; y < height - 1 ; y++ ) {
        for ( let x = 0 ; x < width ; x++ ) {
            if (checked[y][x]) {
                //Propagation
                checked = propagation(x, y, checked)
            } 
        }
    }

    let basinSize = []
    for ( let i = 1 ; i <= basinIdentifier ; i++ ) {
        let counter = 0
        for ( let y = 0 ; y < height ; y++ ) {
            for ( let x = 0 ; x < width ; x++ ) {
                if (checked[y][x] == i) {
                    counter++
                } 
            }
        }
        if (counter > 0) {
            basinSize.push(counter)
        }
    }
    basinSize = basinSize.sort((a, b) => b - a)

    console.log(basinSize[0] * basinSize[1] * basinSize[2] )

 });

function propagation(x, y, grid) {
    value = grid[y][x]
    adjacent = grid[y + 1][x]
    if (adjacent) {
        grid = grid.map(line => line.map(item => {
            if (item === adjacent) {
                return value
            } else {
                return item
            }
        }))
    }
    return grid
}

function getGridHeigthAndWidth (grid) {
    return [ grid.length, grid[0].length]
}