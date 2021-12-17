const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let score = 0

openingBrackets = ['(', '[', '{', '<']
closingBrackets = [')', ']', '}', '>']
illegalScore = [3, 57, 1197, 25137]

readInterface
.on('line', function(line) {
    let linePattern = ""
    let stop = false
    line.split('').forEach(character => {
        if (!stop) {
            if (openingBrackets.includes(character)) {
                linePattern += character

            } else {
                index = closingBrackets.indexOf(character)
                if (linePattern[linePattern.length - 1] === openingBrackets[index]) {
                    //tout va bien
                    linePattern = linePattern.slice(0, -1);
                } else {
                    // caractère illégal !
                    stop = true
                    score += illegalScore[index]
                }
            }
        }
    })
})
.on('close', function() {
    console.log(score)

 });
