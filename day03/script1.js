const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let lineNumber = 0
let ones = []

readInterface
.on('line', function(line) {
    lineNumber += 1
    if (typeof(ones[0]) !== "number") {
        for(let i=0; i<line.length ; i++) {
            ones.push(parseInt(line[i]))
        }
    } else {
        for(let i=0; i<line.length ; i++) {
            ones[i] += parseInt(line[i])
        }
    }
})
.on('close', function() {
    const gammaRateArray = []
    const epsilonRateArray = []

    for(let i=0; i<ones.length ; i++) {
        const ratio = ones[i] * 2 / lineNumber
        gammaRateArray[i] = Math.trunc(ratio)
        epsilonRateArray[i] = + !gammaRateArray[i]
    }

    const gammaRateBinary = gammaRateArray.join('')
    const epsilonRateBinary = epsilonRateArray.join('')

    const gammaRate = parseInt( gammaRateBinary, 2 )
    const epsilonRate = parseInt( epsilonRateBinary, 2 )

    console.log(gammaRate * epsilonRate)
 });