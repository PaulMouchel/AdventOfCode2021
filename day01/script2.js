const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./input.txt'),
  // output: process.stdout,
  console: false
});

let increases = 0
let previousValues = []
let lineNumber = 0

readInterface
.on('line', function(line) {
  lineNumber += 1
  const value = parseInt(line)

  if (previousValues.length < 3) {
    previousValues.push(value)
  } else {
    
    
    const previousSum = previousValues.reduce((accumulator, curr) => accumulator + curr)
    const currentValues = [...previousValues]
    currentValues.shift()
    currentValues.push(value)
    
    const currentSum = currentValues.reduce((accumulator, curr) => accumulator + curr)

    if (currentSum > previousSum) {
        increases++
    }

    previousValues = currentValues
    
  }

})
.on('close', function(line) {
  console.log(increases)
 });

