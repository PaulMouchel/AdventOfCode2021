const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let fishes

let lastDay = 80

readInterface
.on('line', function(line) {
    fishes = line.split(",").map(item => parseInt(item))
})
.on('close', function() {
    for (let day = 1; day <= lastDay; day ++) {
        
        let newFishes = []
        fishes.forEach(fish => {
            if (fish <= 0) {
                newFishes.push(8)
            }
        });
        fishes = fishes.map(fish => renew(fish - 1))
        fishes = [...fishes, ...newFishes]
        // console.log("after ", day, " days : ", fishes)
    }
    console.log("total : ", fishes.length, " fishes")
 });

function renew(fish) {
    if (fish < 0) {
        return 6
    }
    return fish
}