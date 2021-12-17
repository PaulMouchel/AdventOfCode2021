const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let numbers
let grids = []
let currentGrid

readInterface
.on('line', function(line) {
    let currentRow

    if (!numbers) {
        numbers = line.split(",").map(value => parseInt(value))
    } else {
        if (line === "") {
            currentGrid = []
            currentRow = []
        } else {
            currentRow = line.replace("  ", " ").split(" ").filter(value => value !== '').map(value => parseInt(value))
            currentGrid.push(currentRow)
            if (currentGrid.length === 5) {
                grids.push(currentGrid)
            }
        }
    }
})
.on('close', function() {
    let lastWinningGrid
    let winningGrid
    let pickedNumbers
    
    for (let i=1 ; i<=numbers.length ; i++) {
        if (grids.length === 1 && lastWinningGrid === grids[0]) {
            break
        }
        pickedNumbers = numbers.slice(0, i);
        winningGrid = getTheWinningGrid(grids, pickedNumbers)
        while (winningGrid) {
            lastWinningGrid = winningGrid
            if (grids.length > 1) {
                let index = grids.indexOf(winningGrid);
                if (index !== -1) {
                    grids.splice(index, 1);
                }
            } else {
                break
            }
            winningGrid = getTheWinningGrid(grids, pickedNumbers)
        }
    }

    console.log(getUnmarkedNumbersSum(lastWinningGrid, pickedNumbers) * pickedNumbers[pickedNumbers.length - 1])
 });

function getUnmarkedNumbersSum (grid, numbers) {
    const marks = getMarks(grid, numbers)
    let sum = 0
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (!marks[row][col]) {
                sum += grid[row][col]
            }
        }
    }
    return sum
}

function getTheWinningGrid(grids, numbers) {
    let winningGrid = null
    grids.forEach(grid => {
        if (isWinningGrid(grid, numbers)) {
            winningGrid = grid
        }
    });
    return winningGrid
}

function getMarks(grid, numbers) {
    return (
        grid.map (
            line => line.map(
                value => numbers.includes(value)
            )
        )
    )
}

function isWinningGrid(grid, numbers) {
    const marks = getMarks(grid, numbers)
    return isWinningLine(marks[0]) ||
    isWinningLine(marks[1]) ||
    isWinningLine(marks[2]) ||
    isWinningLine(marks[3]) ||
    isWinningLine(marks[4]) ||
    isWinningLine(getColumn(marks, 0)) ||
    isWinningLine(getColumn(marks, 1)) ||
    isWinningLine(getColumn(marks, 2)) ||
    isWinningLine(getColumn(marks, 3)) ||
    isWinningLine(getColumn(marks, 4))
}

function getColumn (grid, index) {
    return [grid[0][index], grid[1][index], grid[2][index], grid[3][index], grid[4][index]]
}

function isWinningLine (row) {
    return row[0] && row[1] && row[2] && row[3] && row[4]
}