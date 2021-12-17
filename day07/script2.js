const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let positions

readInterface
.on('line', function(line) {
    positions = line.split(",").map(item => parseInt(item))
})
.on('close', function() {
    const min = Math.min(...positions)
    const max = Math.max(...positions)
    let bestDestination
    let bestFuel

    for (let position=min; position<=max; position++) {
        let fuel = calculateFuel(position, positions)
        if (!bestFuel || fuel < bestFuel) {
            bestFuel = fuel
            bestDestination = position
        }
    }

    console.log(bestDestination, bestFuel)
 });

 function calculateFuel(destination, positions) {
     return positions.reduce((acc, val) => (acc + calculateFuelForOnePosition(destination, val)),0)
 }

 function calculateFuelForOnePosition(destination, position) {
     const difference = getDifference(position, destination)
     if (difference === 0) return 0
     let sum = 0
     for (let i=1 ; i<=difference ; i++) {
        sum += i
     }
     return sum
 }

 function getDifference(destination, position) {
    return Math.abs(position - destination)
 }