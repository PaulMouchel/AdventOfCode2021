const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let inputs = []

readInterface
.on('line', function(line) {
    inputs.push(
        line.split("|")[1].split(" ").filter(element => element !== '')
    )
})
.on('close', function() {
    let sum = 0

    inputs.forEach(input => {
        input.forEach(value => {
            if (value.length === 2 || value.length === 4 || value.length === 3 || value.length === 7) {
                sum++
            }
        })
    })

    console.log(sum)

 });