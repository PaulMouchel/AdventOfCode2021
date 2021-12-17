const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []
let costGrid = []
let maxX
let maxY

readInterface
.on('line', function(line) {
    grid.push(line.split('').map(value => parseInt(value)))
})
.on('close', function() {
    grid = createFullGrid( grid )

    grid.forEach(line => {
        costGrid.push(new Array(line.length))
    })
    costGrid[0][0] = 0

    let positionsQueue = [ 
        { 
            cost: 0, 
            X:0, 
            Y:0 
        } 
    ]

    maxX = grid[0].length - 1
    maxY = grid.length - 1

    let pointsToVisit = []
    let lastPrint 
    while (positionsQueue.length > 0) {
        pointsToVisit = getPointsToVisit( positionsQueue[positionsQueue.length - 1] )
        
        positionsQueue.pop()

        for (let i = 0; i < pointsToVisit.length ; i++) {
            const point = pointsToVisit[i]
            if (costGrid[point.Y][point.X] == undefined || costGrid[point.Y][point.X] > point.cost) {
                costGrid[point.Y][point.X] = point.cost
                positionsQueue.push( point )
            }
        }

        if ( positionsQueue.length % 1000 === 0 && positionsQueue.length !== lastPrint) { 
            console.log(positionsQueue.length) 
            lastPrint = positionsQueue.length
        }
    }
    console.log(costGrid[grid.length - 1][grid[0].length - 1])

});

function getPointsToVisit (position) {
    let pointsToVisit = []
    if ((position.X === maxX && position.Y === maxY) || (costGrid[maxY][maxY] && costGrid[maxY][maxY] < position.cost)) {
        return pointsToVisit
    }
    let X = position.X - 1
    let Y = position.Y
    if (X >= 0 && (!costGrid[Y][X] || costGrid[Y][X] > position.cost + grid[Y][X])) {
        // Explore Left
        pointsToVisit.push( {
            X: X,
            Y: Y,
            cost: position.cost + grid[Y][X]
        })
    }
    X = position.X + 1
    if (X <= maxX && (!costGrid[Y][X] || costGrid[Y][X] > position.cost + grid[Y][X])) {
        // Explore Right
        pointsToVisit.push( {
            X: X,
            Y: Y,
            cost: position.cost + grid[Y][X]
        })
    }
    X = position.X
    Y = position.Y - 1
    if (Y >= 0 && (!costGrid[Y][X] || costGrid[Y][X] > position.cost + grid[Y][X])) {
        // Explore Up
        pointsToVisit.push( {
            X: X,
            Y: Y,
            cost: position.cost + grid[Y][X]
        })
    }
    Y = position.Y + 1
    if (Y <= maxY && (!costGrid[Y][X] || costGrid[Y][X] > position.cost + grid[Y][X])) {
        // Explore Down
        pointsToVisit.push( {
            X: X,
            Y: Y,
            cost: position.cost + grid[Y][X]
        })
    }
    return pointsToVisit
}

function createFullGrid ( grid ) {
    grid = grid.map(line => createFullLine(line))
    const grid2 = grid.map(line => increaseLine(line))
    const grid3 = grid2.map(line => increaseLine(line))
    const grid4 = grid3.map(line => increaseLine(line))
    const grid5 = grid4.map(line => increaseLine(line))
    newGrid = [
        ...grid, 
        ...grid2, 
        ...grid3, 
        ...grid4, 
        ...grid5
    ]
    return newGrid
}

function createFullLine ( line ) {
    const line2 = increaseLine(line)
    const line3 = increaseLine(line2)
    const line4 = increaseLine(line3)
    const line5 = increaseLine(line4)
    let newLine = [
        ...line, 
        ...line2, 
        ...line3, 
        ...line4, 
        ...line5
    ]
    return newLine
}

function increaseLine ( line ) {
    return line.map(riskFactor => riskFactor%9 + 1) 
}