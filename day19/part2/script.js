import readline from 'readline'
import fs from 'fs'
import { maxHeaderSize } from 'http';
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let scanners = []
let scannerId = -1

readInterface
.on('line', function(line) {
    if (line.includes("scanner")) {
        scannerId++
        scanners.push([])
    } else if (line !== '') {
        scanners[scannerId].push(line.split(',').map(value => parseInt(value)))
    }
})
.on('close', function() {
    let scannersPositions = [ [0,0,0] ]
    while (scanners.length > 1) {
        console.log(scanners.length)
        for ( let i = 1 ; i < scanners.length ; i++ ) {
            const match = checkIfMatch(scanners[0], scanners[i])
            if (match.match) {
                scannersPositions.push(match.scannerPosition)
                match.points.forEach(point => {
                    scanners[0].push(point)
                })
                const before = scanners.slice(0, i)
                const after = scanners.slice(i + 1, scanners.length)
                scanners = [ ...before, ...after]
                break
            }
        }   
    }
    
    console.log(scannersPositions)    
    const largestManhattanDistance = getLargestManhattanDistance(scannersPositions)
    console.log(largestManhattanDistance)
});

function getLargestManhattanDistance(scannersPositions) {
    let result = 0
    for ( let i = 0 ; i < scannersPositions.length ; i++) {
        for ( let j = 0 ; j < scannersPositions.length ; j++) {
            if ( i !== j ) {
                const manhattanDistance = Math.abs(scannersPositions[i][0] - scannersPositions[j][0]) + Math.abs(scannersPositions[i][1] - scannersPositions[j][1]) + Math.abs(scannersPositions[i][2] - scannersPositions[j][2])
                if (manhattanDistance > result) {
                    result = manhattanDistance
                }
            }
        }
    }
    return result
}

function checkIfMatch (scanner1, scanner2) {
    const scanner2InEveryDirection = getCoordonatesFromEveryDirection( scanner2 )
    for (let direction = 0 ; direction < scanner2InEveryDirection.length ; direction ++) {
        const result = checkIfMatchForOneDirection( scanner1, scanner2InEveryDirection[direction], direction )
        if (result.match) {
            return result
        }
    }
    return {match: false, points:[]}
}

function checkIfMatchForOneDirection (scanner1, scanner2, direction) {
    for (let scanner1Point = 0 ; scanner1Point < scanner1.length ; scanner1Point++) {
        for (let scanner2Point = 0 ; scanner2Point < scanner2.length ; scanner2Point++) {
            const point1 = scanner1[scanner1Point]
            const point2 = scanner2[scanner2Point]
            const transform = [point1[0] - point2[0], point1[1] - point2[1], point1[2] - point2[2]]
            const transformedScanner2 = scanner2.map(point => {
                return [ point[0] + transform[0] , point[1] + transform[1] , point[2] + transform[2]]
            })
            const equalPoints = countEqualPoints (scanner1, transformedScanner2)
            if ( equalPoints >= 12 ) {
                const differentPoints = getDifferentPoints(scanner1, transformedScanner2)
                return {match: true, points: differentPoints, direction:getLiteralDirection(direction), scannerPosition:transform}
            }
        }
    }
    return {match: false, points:[], direction:getLiteralDirection(direction)}
}

function getDifferentPoints ( scanner1, scanner2 ) {
    let result = []
    for (let scanner2Point = 0 ; scanner2Point < scanner2.length ; scanner2Point++) {
        let equal = false
        for (let scanner1Point = 0 ; scanner1Point < scanner1.length ; scanner1Point++) {
            if (pointsEquals(scanner1[scanner1Point] , scanner2[scanner2Point])) {
                equal = true
                break
            }
        }
        if (!equal) {
            result.push(scanner2[scanner2Point])
        }
    }
    return result
}

function countEqualPoints ( scanner1, scanner2 ) {
    let equalPoints = 0
    for (let scanner1Point = 0 ; scanner1Point < scanner1.length ; scanner1Point++) {
        for (let scanner2Point = 0 ; scanner2Point < scanner2.length ; scanner2Point++) {
            if (pointsEquals(scanner1[scanner1Point] , scanner2[scanner2Point])) {
                equalPoints++
            }
        }
    }
    return equalPoints
}

function pointsEquals (point1, point2) {
    return point1[0] === point2[0] && point1[1] === point2[1] && point1[2] === point2[2]
}

function getCoordonatesFromEveryDirection ( scanner ) {
    let coordonatesList = []
    let positions = [...scanner]
    coordonatesList.push( positions )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    positions = positions.map(position => turnRight(position))
    coordonatesList.push( positions )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    positions = positions.map(position => turnRight(position))
    coordonatesList.push( positions )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    positions = positions.map(position => turnRight(position))
    coordonatesList.push( positions )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    positions = positions.map(position => turnRight(position))
    positions = positions.map(position => flipBack(position))
    coordonatesList.push( positions )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    positions = positions.map(position => flipBack(position))
    positions = positions.map(position => flipBack(position))
    coordonatesList.push( positions )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    coordonatesList.push( coordonatesList[coordonatesList.length - 1].map(position => spinRight( position ) ) )
    return coordonatesList
}

function getLiteralDirection (direction) {
    switch(direction) {
        case 0:
            return 'rotate: 0, spin: 0'
        case 1:
            return 'rotate: 0, spin: 90'
        case 2:
            return 'rotate: 0, spin: 180'
        case 3:
            return 'rotate: 0, spin: 270'
        case 4:
            return 'rotate: 90, spin: 0'
        case 5:
            return 'rotate: 90, spin: 90'
        case 6:
            return 'rotate: 90, spin: 180'
        case 7:
            return 'rotate: 90, spin: 270'
        case 8:
            return 'rotate: 180, spin: 0'
        case 9:
            return 'rotate: 180, spin: 90'
        case 10:
            return 'rotate: 180, spin: 180'
        case 11:
            return 'rotate: 180, spin: 270'
        case 12:
            return 'rotate: 270, spin: 0'
        case 13:
            return 'rotate: 270, spin: 90'
        case 14:
            return 'rotate: 270, spin: 180'
        case 15:
            return 'rotate: 270, spin: 270'
        case 16:
            return 'rotate: 0, spin: 0, flip: 90'
        case 17:
            return 'rotate: 0, spin: 90, flip: 90'
        case 18:
            return 'rotate: 0, spin: 180, flip: 90'
        case 19:
            return 'rotate: 0, spin: 270, flip: 90'
        case 20:
            return 'rotate: 0, spin: 0, flip: 270'
        case 21:
            return 'rotate: 0, spin: 90, flip: 270'
        case 22:
            return 'rotate: 0, spin: 180, flip: 270'
        case 23:
            return 'rotate: 0, spin: 270, flip: 270'
    }
}

function turnRight ( coordonates ) {
    return [  -coordonates[2], coordonates[1], coordonates[0]]
}

function flipBack ( coordonates ) {
    return [  coordonates[0], -coordonates[2], coordonates[1]]
}

function spinRight ( coordonates ) {
    return [  -coordonates[1], coordonates[0], coordonates[2]]
}