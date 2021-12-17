const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let pointsList = []
let listEnd = false
let foldingInstructions = []

readInterface
.on('line', function(line) {
    if (line === "") {
        console.log("test")
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
    pointsList = fold(pointsList, foldingInstructions[0][0], foldingInstructions[0][1])
    console.log(pointsList.length)
});


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