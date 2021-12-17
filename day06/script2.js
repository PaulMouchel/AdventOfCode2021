const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let oldFishes
let fishes = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let lastDay = 256

readInterface
.on('line', function(line) {
    oldFishes = line.split(",").map(item => parseInt(item))
    oldFishes.forEach(fish => fishes[fish] += 1 )
})
.on('close', function() {
    for (let day = 1; day <= lastDay; day ++) {
        
        let newFishes = fishes[0]

        fishes.shift();

        fishes[6] += newFishes
        fishes.push(newFishes)
    }
    const total = fishes.reduce((acc, val) => acc + val)
    console.log("total : ", total, " fishes")
 });