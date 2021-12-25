import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []

readInterface
.on('line', function(line) {
    grid.push(line.split(''))
})
.on('close', function() {
    // console.log( grid )
    let counter = 0
    let moved
    do {
        moved = move(grid)
        counter++
    } while (moved)
    console.log(counter)
});

function getNextRow ( rowNumber ) {
    return rowNumber !== grid.length - 1 ? rowNumber + 1 : 0
}

function getNextCol ( colNumber ) {
    return colNumber !== grid[0].length - 1 ? colNumber + 1 : 0
}



function moveEast ( grid ) {
    let move = false
    for ( let row = 0 ; row < grid.length ; row++ ) {
        for ( let col = 0 ; col < grid[0].length ; col++ ) {
            if ( grid[row][col] === '>' && grid[row][getNextCol(col)] === '.' ) {
                grid[row][col] = 'E'
                move = true
            }
        }
    }
    for ( let row = 0 ; row < grid.length ; row++ ) {
        for ( let col = 0 ; col < grid[0].length ; col++ ) {
            if ( grid[row][col] === 'E') {
                grid[row][col] = '.'
                grid[row][getNextCol(col)] = '>'
            }
        }
    }
    return move
}

function moveSouth ( grid ) {
    let move = false
    for ( let row = 0 ; row < grid.length ; row++ ) {
        for ( let col = 0 ; col < grid[0].length ; col++ ) {
            if ( grid[row][col] === 'v' && grid[getNextRow(row)][col] === '.' ) {
                grid[row][col] = 'S'
                move = true
            }
        }
    }
    for ( let row = 0 ; row < grid.length ; row++ ) {
        for ( let col = 0 ; col < grid[0].length ; col++ ) {
            if ( grid[row][col] === 'S') {
                grid[row][col] = '.'
                grid[getNextRow(row)][col] = 'v'
            }
        }
    }
    return move
}

function move ( grid ) {
    const movedEast = moveEast(grid)
    const movedSouth = moveSouth(grid)
    return movedEast || movedSouth
}