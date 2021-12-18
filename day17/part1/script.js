import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});
import { Shoot } from './shoot.js'

let targetArea

readInterface
.on('line', function(line) {
    let lineArray = line.split(' ')
    lineArray = [lineArray[2], lineArray[3]]
    lineArray = lineArray.map(value => value.substring(2, value.length))
    lineArray = lineArray.map(value => value.split('..'))
    lineArray = lineArray.map(value => value.map(val => parseInt(val)))
    targetArea = {
        x: lineArray[0],
        y: lineArray[1]
    }
})
.on('close', function() {
    const minXVelocity = getMinXVelocity( targetArea )

    let yVelocity = Math.abs(Math.min(...targetArea.y)) - 1

    const velocity = {
        x: minXVelocity,
        y: yVelocity
    }
    let newShoot = new Shoot(velocity, targetArea)

    console.log(newShoot.highestPoint)
});

function getMinXVelocity(targetArea) {
    let maxPosition = 0
    let minVelocity = 0
    while (maxPosition < Math.min(...targetArea.x)) {
        minVelocity++
        maxPosition += minVelocity
    }
    return minVelocity
}