const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []
let costGrid = []

readInterface
.on('line', function(line) {
    grid.push(line.split('').map(value => parseInt(value)))
})
.on('close', function() {

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

    let pointsToVisit = []

    
    while (positionsQueue.length > 0) {
        pointsToVisit = getPointsToVisit( positionsQueue[0] )
        positionsQueue.shift()

        
        pointsToVisit.forEach(point => {
            const cost = point.from.cost + grid[point.Y][point.X]
            if (costGrid[point.Y][point.X] == undefined || costGrid[point.Y][point.X] > cost) {
                costGrid[point.Y][point.X] = cost
                positionsQueue.push( {
                    cost: cost,
                    X: point.X,
                    Y: point.Y
                })
            }
            
        })
        
    }
    console.log(costGrid[grid.length - 1][grid[0].length - 1])

});

function getPointsToVisit (position) {
    const width = grid[0].length
    const heigth = grid.length
    let pointsToVisit = []

    if (position.X > 0) {
        // Explore Left
        pointsToVisit.push( {
            X: position.X - 1,
            Y: position.Y,
            from: position
        })
    }
    if (position.X < width - 1) {
        // Explore Right
        pointsToVisit.push( {
            X: position.X + 1,
            Y: position.Y,
            from: position
        })
    }
    if (position.Y > 0) {
        // Explore Up
        pointsToVisit.push( {
            X: position.X,
            Y: position.Y - 1,
            from: position
        })
    }
    if (position.Y < heigth - 1) {
        // Explore Down
        pointsToVisit.push( {
            X: position.X,
            Y: position.Y + 1,
            from: position
        })
    }
    return pointsToVisit
}

