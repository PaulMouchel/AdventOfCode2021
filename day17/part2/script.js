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
    const maxXVelocity = Math.max(...targetArea.x)

    const minYVelocity = Math.min(...targetArea.y)
    const maxYVelocity = Math.abs(Math.min(...targetArea.y)) - 1

    let hitCounter = 0

    for (let x = minXVelocity ; x <= maxXVelocity ; x++) {
        for (let y = minYVelocity ; y <= maxYVelocity ; y++) {
            const velocity = {
                x: x,
                y: y
            }
            let newShoot = new Shoot(velocity, targetArea)
            if (newShoot.hit) {
                hitCounter++
            }
        }
    }

    console.log(hitCounter)
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