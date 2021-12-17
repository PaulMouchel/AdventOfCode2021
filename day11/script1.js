const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []

readInterface
.on('line', function(line) {
    grid.push(line.split('').map(char => parseInt(char)))
})
.on('close', function() {
    let explosionsCounter = 0
    for (let step = 1; step <= 100; step++) {
        // Début d'étape


        // Incrémentation
        for (let row=0; row<=9; row++) {
            for (let col=0; col<=9; col++) {
                grid[row][col] += 1
            }
        }

        // Explosions
        while (isExploding(grid)) {
            for (let row=0; row<=9; row++) {
                for (let col=0; col<=9; col++) {
                    if (grid[row][col] > 9) {
                        grid = explosion(row, col, grid)
                    }
                }
            }
        }

        //Réinitialisation et comptage
        for (let row=0; row<=9; row++) {
            for (let col=0; col<=9; col++) {
                if (grid[row][col] < 0) {
                    grid[row][col] = 0
                    explosionsCounter++
                }
            }
        }
    }

    console.log(explosionsCounter)
 });

function explosion (row, col, grid) {
    if (row > 0) {
        grid[row-1][col] += 1
        if (col > 0) {
            grid[row-1][col-1] += 1
        }
        if (col < 9) {
            grid[row-1][col+1] += 1
        }
    }
    if (col > 0) {
        grid[row][col-1] += 1
    }
    if (col < 9) {
        grid[row][col+1] += 1
    }
    if (row < 9) {
        grid[row+1][col] += 1
        if (col > 0) {
            grid[row+1][col-1] += 1
        }
        if (col < 9) {
            grid[row+1][col+1] += 1
        }
    }
    grid[row][col] = -999
    return grid
}

 function isExploding(grid) {
    return !mergeGrid(grid).every(x => x < 10)
 }

 function mergeGrid (grid) {
    return [
        ...grid[0],
        ...grid[1],
        ...grid[2],
        ...grid[3],
        ...grid[4],
        ...grid[5],
        ...grid[6],
        ...grid[7],
        ...grid[8],
        ...grid[9]
    ]
 }

