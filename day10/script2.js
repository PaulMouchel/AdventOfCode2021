const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

openingBrackets = ['(', '[', '{', '<']
closingBrackets = [')', ']', '}', '>']

let legalLines = []

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
                }
            }
        }
    })
    if(!stop) {
        legalLines.push(line)
    }
})
.on('close', function() {
    let missingBrackets = []
    legalLines.forEach(line => {
        let linePattern = ""
        line.split('').forEach(character => {
            if (openingBrackets.includes(character)) {
                linePattern += character
            } else {
                linePattern = linePattern.slice(0, -1);
            }
        })
        
        missingBrackets.push(linePattern.split('').reverse().map(character => {
            let index = openingBrackets.indexOf(character)
            return closingBrackets[index]
        }).join(''))
    })

    let scores = []
    let bracketScore = [1, 2, 3, 4]

    missingBrackets.forEach(line => {
        let score = 0
        line.split('').forEach(character => {
            const index = closingBrackets.indexOf(character)
            score *= 5
            score += bracketScore[index]
        })
        scores.push(score)
    })
    
    scores = scores.sort((a, b) => a - b)
    let index = Math.trunc(scores.length/2)
    console.log(scores[index])
 });

