const readline = require('readline');
const fs = require('fs');
const { exit } = require('process');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let inputs = []

readInterface
.on('line', function(line) {
    inputs.push(line)
})
.on('close', function() {
    let filteredInputs = [...inputs]
    for (let i=0 ; i<12; i++) {
        filteredInputs = filteredInputs.filter(input => input[i] == getMostCommonValue(filteredInputs, i));
        if (filteredInputs.length === 1) {
            break
        }
    }
    const oxygenGeneratorRatingBinary = filteredInputs[0]

    filteredInputs = [...inputs]
    for (let i=0 ; i<12; i++) {
        filteredInputs = filteredInputs.filter(input => input[i] == getLeastCommonValue(filteredInputs, i));
        if (filteredInputs.length === 1) {
            break
        }
    }
    const co2ScrubblerRatingBinary = filteredInputs[0]

    const oxygenGeneratorRating = parseInt( oxygenGeneratorRatingBinary, 2 )
    const co2ScrubblerRating = parseInt( co2ScrubblerRatingBinary, 2 )

    console.log (oxygenGeneratorRating * co2ScrubblerRating)
 });

 function getLeastCommonValue (inputs, position) {
    const totalOnes = getAmountOf(1, inputs, position)
    const totalZeros = getAmountOf(0, inputs, position)
    if ( totalOnes < totalZeros) {
        return 1
    } else {
        return 0
    }
 }

 function getMostCommonValue (inputs, position) {
    const totalOnes = getAmountOf(1, inputs, position)
    const totalZeros = getAmountOf(0, inputs, position)
    if ( totalOnes >= totalZeros) {
        return 1
    } else {
        return 0
    }
 }

 function getAmountOf (value, inputs, position) {
    const filteredArray = inputs.filter(input => input[position] == value);
    return filteredArray.length
 }