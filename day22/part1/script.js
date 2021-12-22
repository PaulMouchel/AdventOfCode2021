import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let grid = []
for ( let i = 0 ; i < 101 ; i++ ) {
    grid.push([])
    for ( let j = 0 ; j < 101 ; j++ ) {
        grid[grid.length - 1].push(new Array(101).fill(0))
    }
}

readInterface
.on('line', function(line) {
    let instructions = line.split(' ')
    instructions[0] = instructions[0] === 'on' ? 1 : 0
    instructions[1] = instructions[1].split(',')
    instructions[1] = instructions[1].map(value => value.substring(2, value.length))
    instructions[1] = instructions[1].map(value => value.split('..').map(value => parseInt(value) + 50))
    const cube = {
        value: instructions[0],
        x: instructions[1][0],
        y: instructions[1][1],
        z: instructions[1][2]
    }

    if (
        (cube.x[0] < 0 && cube.x[1] < 0) ||
        (cube.x[0] > 100 && cube.x[1] > 100) ||
        (cube.y[0] < 0 && cube.y[1] < 0) ||
        (cube.y[0] > 100 && cube.y[1] > 100) ||
        (cube.z[0] < 0 && cube.z[1] < 0) ||
        (cube.z[0] > 100 && cube.z[1] > 100)
    ) {
        console.log("cube hors zone")
    } else {
        if (cube.x[0] < 0) {
            cube.x[0] = 0
        }
        if (cube.x[0] > 100) {
            cube.x[0] = 100
        }
        if (cube.y[0] < 0) {
            cube.y[0] = 0
        }
        if (cube.y[0] > 100) {
            cube.y[0] = 100
        }
        if (cube.z[0] < 0) {
            cube.z[0] = 0
        }
        if (cube.z[0] > 100) {
            cube.z[0] = 100
        }
        for ( let x = cube.x[0] ; x <= cube.x[1] ; x++ ) {
            for ( let y = cube.y[0] ; y <= cube.y[1] ; y++ ) {
                for ( let z = cube.z[0] ; z <= cube.z[1] ; z++ ) {
                    grid[x][y][z] = cube.value
                }
            }
        }
    }

    
})
.on('close', function() {
    let counter = 0
    for ( let x = 0 ; x <= 100 ; x++ ) {
        for ( let y = 0 ; y <= 100 ; y++ ) {
            for ( let z = 0 ; z <= 100 ; z++ ) {
                counter += grid[x][y][z]
            }
        }
    }

    console.log(counter)
});

