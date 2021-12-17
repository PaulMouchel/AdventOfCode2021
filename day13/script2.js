const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let pointsList = []
let listEnd = false
let foldingInstructions = []

readInterface
.on('line', function(line) {
    if (line === "") {
        listEnd = true
    }

    if (!listEnd) {
        pointsList.push(
            {
                x: parseInt(line.split(',')[0]),
                y: parseInt(line.split(',')[1])
            }
        )
    } else if (line !== "") {
        let foldInstruction = line.split('=')
        foldInstruction[0] = foldInstruction[0][foldInstruction[0].length - 1]
        foldInstruction[1] = parseInt(foldInstruction[1])

        foldingInstructions.push(
            foldInstruction
        )
    }
})
.on('close', function() {
    foldingInstructions.forEach(instruction => {
        pointsList = fold(pointsList, instruction[0], instruction[1])
    })
    draw(pointsList)
});

function draw (pointsList) {
    const size = getDimentions(pointsList)
    let panel = []
    for (let row=0; row <= size.height ; row ++) {
        panel.push (new Array(size.width).fill('.'))
    }
    pointsList.forEach(point => {
        panel[point.y][point.x] = '#'
    })
    console.log(panel.map(line => line.join(' ')))
}

function fold (pointsList, foldingAxe, foldingPosition) {
    for (let index = 0 ; index < pointsList.length ; index++) {
        if (pointsList[index][foldingAxe] > foldingPosition) {
            let delta = pointsList[index][foldingAxe] - foldingPosition
            pointsList[index][foldingAxe] = foldingPosition - delta
        }
    }
    // suppression des doublons
    return pointsList.filter((value, index) => {
        const JsonValue = JSON.stringify(value);
        return index === pointsList.findIndex(obj => {
          return JSON.stringify(obj) === JsonValue;
        });
    });
}

function getDimentions (pointsList) {
    let height = 0
    let width = 0
    pointsList.forEach(point => {
        if (point.x > width) {
            width = point.x
        }
        if (point.y > height) {
            height = point.y
        }
    })
    return {width:width, height:height}
}