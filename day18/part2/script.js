import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let numbersList = []

readInterface
.on('line', function(line) {
    numbersList.push( line.split('').map(char => {
        if (char !== '[' && char !== ']' && char !== ',') {
            return parseInt(char)
        } else {
            return char
        }
    }) )
})
.on('close', function() {
    let largestMagnitude = 0


    for ( let i = 0 ; i < numbersList.length ; i++ ) {
        for ( let j = 0 ; j < numbersList.length ; j++ ) {
            if ( i !== j ) {
                const result = sum(numbersList[i], numbersList[j])
                const magnitude = getMagnitude(result)
                if ( magnitude > largestMagnitude ) {
                    largestMagnitude = magnitude
                }
            }
        }
    }
    console.log( largestMagnitude )
});

function sum ( number1, number2 ) {
    let sumResult = ['[', ...number1, ',', ...number2, ']']
    let reduced = false

    while (!reduced) { 
        let nestedLevel = 0
        let explode = false
        let split = false
        let explodeIndexes = [null, null]
        // Looking for explosion
        for ( let i = 0 ; i < sumResult.length ; i++ ) {
            if (sumResult[i] == '[') {
                nestedLevel++
                if (nestedLevel >= 5) {
                    explode = true
                    explodeIndexes[0] = i
                    explodeIndexes[1] = i + 4
                    const explodingNumber = [sumResult[explodeIndexes[0] + 1], sumResult[explodeIndexes[1] - 1]]
                    // find first number to the right
                    for (i = explodeIndexes[1] ; i < sumResult.length ; i++) {
                        if (typeof sumResult[i] === 'number') {
                            const before = sumResult.slice(0, i)
                            const after = sumResult.slice(i + 1, sumResult.length)
                            const number = sumResult[i] + explodingNumber[1]
                            sumResult = [...before, number, ...after]
                            break
                        }
                    }
                    // find first number to the left
                    for (i = explodeIndexes[0] ; i > 0 ; i--) {
                        if (typeof sumResult[i] === 'number') {
                            const before = sumResult.slice(0, i)
                            const after = sumResult.slice(i + 1, sumResult.length)
                            const number = sumResult[i] + explodingNumber[0]
                            sumResult = [...before, number, ...after]
                            break
                        }
                    }
                    const before = sumResult.slice(0, explodeIndexes[0])
                    const after = sumResult.slice(explodeIndexes[1] + 1, sumResult.length)
                    sumResult = [...before, 0, ...after]
                    break
                }
            }
            if (sumResult[i] == ']') {
                nestedLevel--
            }
        }
        // Looking for reduction
        if (!explode) {
            for ( let i = 0 ; i < sumResult.length ; i++ ) {
                if (typeof sumResult[i] === 'number' && sumResult[i] > 9) {
                    split = true
                    const before = sumResult.slice(0, i)
                    const after = sumResult.slice(i + 1, sumResult.length)
                    const number = sumResult[i]
                    const halfNumber = number / 2
                    const roundedDownHalfNumber = Math.trunc(halfNumber)
                    const roundedUphalfNumber = halfNumber === roundedDownHalfNumber ? roundedDownHalfNumber : roundedDownHalfNumber + 1
                    sumResult = [...before, '[', roundedDownHalfNumber, ',', roundedUphalfNumber, ']', ...after]
                    break
                }
            }
        }

        if (!explode && !split) {
            reduced = true
        }
    }

    return sumResult
}

function getMagnitude ( number ) {
    while (number.length > 1) {
        for ( let i = 0 ; i < number.length ; i++ ) {
            if ( typeof number[i] === 'number' && typeof number[i + 2] === 'number' && number[i - 1] === '[' && number[i + 3] === ']') {
                const before = number.slice(0, i - 1)
                const after = number.slice(i + 4, number.length)
                const magnitude = number[i] * 3 + number[i + 2] * 2
                number = [...before, magnitude, ...after]
                break
            }
        }
    }
    return number[0]
}