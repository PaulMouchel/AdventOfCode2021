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
     return positions.reduce((acc, val) => (acc + Math.abs(val - destination)),0)
 }