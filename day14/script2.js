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
    
    let pairReport = []
    

    // Get a report for each rule after 20 steps
    pairInsertionRules.forEach(rule => {
        let polymerTemplateFromPair = rule.pair
        for ( let step = 1 ; step <= 20 ; step++ ) {
            let done = ""
            let toDo = polymerTemplateFromPair
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
            polymerTemplateFromPair = done
        }
        const countingReport = countCharacters(polymerTemplateFromPair)
        const orderedCountingReport = countingReport.sort((a, b) => a.times - b.times )
        pairReport.push(orderedCountingReport)
    })

    for ( let step = 1 ; step <= 20 ; step++ ) {
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

    let countingReportToRemove = countCharacters(polymerTemplate.substring(1, polymerTemplate.length - 1))
    let orderedCountingReportToRemove = countingReportToRemove.sort((a, b) => a.times - b.times )

    let reportsToSum = []

    let toDo = polymerTemplate
    const pairArray = pairInsertionRules.map(rule => rule.pair)

    while (toDo.length > 1) {
        let currentPair = toDo.substring(0, 2)
        const index = pairArray.indexOf(currentPair)
        reportsToSum.push(pairReport[index])
        toDo = toDo.substring(1, toDo.length)
    }

    const sum = sumReports(reportsToSum)

    const finalReport = sum.map(report => { 
        let found = orderedCountingReportToRemove.find(x => x.char === report.char)
        if (found) {
            return {
                char:report.char, 
                times: report.times - (found.times)
            }
        } 
        return {
            char:report.char, 
            times: report.times
        }
    })

    const orderedFinalReport = finalReport.sort((a, b) => a.times - b.times )
    console.log(orderedFinalReport[orderedFinalReport.length - 1].times - orderedFinalReport[0].times)
});

function sumReports (reportsToSum) {
    let characters = []
    let values = []
    reportsToSum.forEach(report => {
        report.forEach(reportForChar => {
            const index = characters.indexOf(reportForChar.char)

            if (index === -1) {
                characters.push(reportForChar.char)
                values.push(reportForChar.times)
            } else {
                values[index] += reportForChar.times
            }
        })
    })
    return characters.map((character, index) => { return {char: character, times:values[index]}})
}

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