import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let cubesWithValueOne = []

let cubesList = []

readInterface
.on('line', function(line) {
    let instructions = line.split(' ')
    instructions[0] = instructions[0] === 'on' ? 1 : 0
    instructions[1] = instructions[1].split(',')
    instructions[1] = instructions[1].map(value => value.substring(2, value.length))
    instructions[1] = instructions[1].map(value => value.split('..').map(value => parseInt(value)))
    const cube = {
        value: instructions[0],
        x: instructions[1][0],
        y: instructions[1][1],
        z: instructions[1][2]
    }
    cubesList.push(cube)
})
.on('close', function() {
    
    cubesList.forEach(cube => {
        if (cubesWithValueOne.length === 0) {
            if (cube.value = 1) {
                cubesWithValueOne.push(cube)
            }
        } else {
            let restart
            do {
                restart = false
                for ( let i = 0 ; i < cubesWithValueOne.length ; i++ ) {
                    if (cover(cubesWithValueOne[i], cube)) {
                        restart = true
                        const coverArea = getCoverArea(cubesWithValueOne[i], cube)
                        const newCubes = getNewCubes(cubesWithValueOne[i], coverArea)
                        cubesWithValueOne = [ ...cubesWithValueOne.slice(0, i), ...cubesWithValueOne.slice(i + 1, cubesWithValueOne.length), ...newCubes ]
                        break
                    }
                }
            } while( restart )
            if (cube.value === 1) {
                cubesWithValueOne.push(cube)
            }
        }
    })
    const values = cubesWithValueOne.map(cube => getValue(cube))
    console.log(values.reduce((acc, val) => acc + val))

});

function getValue (cube) {
    const x = cube.x[1] - cube.x[0] + 1
    const y = cube.y[1] - cube.y[0] + 1
    const z = cube.z[1] - cube.z[0] + 1
    return x * y * z
}

function getNewCubes ( cube, coverArea ) {
    let newCubes = []

    // X
    if (cube.x[0] === coverArea.x[0] && cube.x[1] > coverArea.x[1]) {
        newCubes.push({
            x: [coverArea.x[1] + 1 , cube.x[1]],
            y: cube.y,
            z: cube.z
        })
    } else if (cube.x[1] === coverArea.x[1] && cube.x[0] < coverArea.x[0]) {
        newCubes.push({
            x: [cube.x[0], coverArea.x[0] - 1],
            y: cube.y,
            z: cube.z
        })
    } else if (cube.x[0] < coverArea.x[0] && cube.x[1] > coverArea.x[1]) {
        newCubes.push({
            x: [cube.x[0], coverArea.x[0] - 1],
            y: cube.y,
            z: cube.z
        })
        newCubes.push({
            x: [ coverArea.x[1] + 1, cube.x[1]],
            y: cube.y,
            z: cube.z
        })
    }

    // Y
    if (cube.y[0] === coverArea.y[0] && cube.y[1] > coverArea.y[1]) {
        newCubes.push({
            x: coverArea.x,
            y: [coverArea.y[1] + 1 , cube.y[1]],
            z: cube.z
        })
    } else if (cube.y[1] === coverArea.y[1] && cube.y[0] < coverArea.y[0]) {
        newCubes.push({
            x: coverArea.x,
            y: [cube.y[0], coverArea.y[0] - 1],
            z: cube.z
        })
    } else if (cube.y[0] < coverArea.y[0] && cube.y[1] > coverArea.y[1]) {
        newCubes.push({
            x: coverArea.x,
            y: [cube.y[0], coverArea.y[0] - 1],
            z: cube.z
        })
        newCubes.push({
            x: coverArea.x,
            y: [ coverArea.y[1] + 1, cube.y[1]],
            z: cube.z
        })
    }

    // Z
    if (cube.z[0] === coverArea.z[0] && cube.z[1] > coverArea.z[1]) {
        newCubes.push({
            x: coverArea.x,
            y: coverArea.y,
            z: [coverArea.z[1] + 1 , cube.z[1]],
        })
    } else if (cube.z[1] === coverArea.z[1] && cube.z[0] < coverArea.z[0]) {
        newCubes.push({
            x: coverArea.x,
            y: coverArea.y,
            z: [cube.z[0], coverArea.z[0] - 1],
        })
    } else if (cube.z[0] < coverArea.z[0] && cube.z[1] > coverArea.z[1]) {
        newCubes.push({
            x: coverArea.x,
            y: coverArea.y,
            z: [cube.z[0], coverArea.z[0] - 1],
        })
        newCubes.push({
            x: coverArea.x,
            y: coverArea.y,
            z: [ coverArea.z[1] + 1, cube.z[1]],
        })
    }

    return newCubes
}

function getCoverArea ( cube1, cube2 ) {
    const x = [ Math.max(cube1.x[0], cube2.x[0]) , Math.min(cube1.x[1], cube2.x[1])]
    const y = [ Math.max(cube1.y[0], cube2.y[0]) , Math.min(cube1.y[1], cube2.y[1])]
    const z = [ Math.max(cube1.z[0], cube2.z[0]) , Math.min(cube1.z[1], cube2.z[1])]
    return {
        x: x, y: y, z: z
    }
}

function cover (cube1, cube2) {
    return (coverAxe(cube1.x, cube2.x) && coverAxe(cube1.y, cube2.y) && coverAxe(cube1.z, cube2.z))
}

function coverAxe (coordonates1, coordonates2) {
    return (
        ( coordonates2[0] >= coordonates1[0] && coordonates2[0] <= coordonates1[1] ) || 
        ( coordonates2[1] >= coordonates1[0] && coordonates2[1] <= coordonates1[1] ) ||
        ( coordonates2[0] <= coordonates1[0] && coordonates2[1] >= coordonates1[1] ) ||
        ( coordonates2[0] >= coordonates1[0] && coordonates2[1] <= coordonates1[1] )
    )
}