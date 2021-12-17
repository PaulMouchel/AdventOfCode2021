const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []
let paths = ["start"]

readInterface
.on('line', function(line) {
    grid.push(line.split('-'))
})
.on('close', function() {
    let tempPaths
    let stop = false
    do {
        tempPaths = []
        paths.forEach(currentPath => {
            let currentPathArray = currentPath.split(',')
            let currentCave = currentPathArray[currentPathArray.length - 1]
            if (currentCave != "end") {
                let options = getOptions(currentCave, currentPath, grid)
                options.forEach(option => {
                    tempPaths.push(`${currentPath},${option}`)
                })
            } else {
                tempPaths.push(currentPath)
            }
        })

        if (JSON.stringify(paths) !== JSON.stringify(tempPaths)) {
            
            paths = [...tempPaths]
            
            
        } else {
            stop = true
        }
    } while (!stop)
    console.log(paths.length)
});


function getOptions (currentCave, currentPath, grid) {
    if (currentCave !== 'end') {
        let filteredGrid = grid.filter(tunnel => tunnel.includes(currentCave))
        filteredGrid = filteredGrid.map(tunnel => tunnel.filter(cave => cave !== currentCave)[0]).filter(option => option !== "start")
        let splitedPath = currentPath.split(',')
        let options = [...filteredGrid]
        filteredGrid.forEach(element => {
            if(isLowercase(element)) {
                if(hasAlreadyVisitedASmallCaveTwice(splitedPath)) {
                    if(splitedPath.includes(element)) {
                        const index = options.indexOf(element)
                        options.splice(index, 1);
                    }
                }
            }
        });
        return options
    } else {
        return []
    }
}

function hasAlreadyVisitedASmallCaveTwice (splitedPath) {
    let visitedSmallCaves = splitedPath.filter(value => isLowercase(value))
    return new Set(visitedSmallCaves).size !== visitedSmallCaves.length
}

function isLowercase(text) {
    return text === text.toLowerCase()
}