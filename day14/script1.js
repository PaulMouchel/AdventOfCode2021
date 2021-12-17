const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let polymerTemplate
let pairInsertionRules = []

readInterface
.on('line', function(line) {
    if (!polymerTemplate) {
        polymerTemplate = line
    } else {
        if (line !== "") {
            let rule = line.split(' -> ')
            pairInsertionRules.push(
                {
                    pair: rule[0],
                    insert: rule[1]
                }
            )
        }
    }
})
.on('close', function() {
  
    for ( let step = 1 ; step <= 10 ; step++ ) {
        let done = ""
        let toDo = polymerTemplate
        while (toDo.length > 0) {
            if (toDo.length === 1) {
                done += toDo
                toDo = ""
            } else {
                let currentPair = toDo.substring(0, 2)
                let insertedElement = pairInsertionRules.find(o => o.pair === currentPair).insert;
                done += toDo[0] + insertedElement
                toDo = toDo.substring(1, toDo.length)
            }
        }
        polymerTemplate = done
    }

    
    const countingReport = countCharacters(polymerTemplate)
    const orderedCountingReport = countingReport.sort((a, b) => a.times - b.times )

    console.log(orderedCountingReport[orderedCountingReport.length - 1].times - orderedCountingReport[0].times)
});

function countCharacters (text) {
    let list = []
    text.split('').forEach(char => {
        if (!list.includes(char)) {
            list.push(char)
        }
    });
    
    let values = new Array(list.length).fill(0)
    text.split('').forEach(char => {
        const index = list.indexOf(char)
        values[index]++
    });
    return list.map((char, index) => { return {char:char, times:values[index]}})
    
}