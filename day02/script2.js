const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./input.txt'),
  // output: process.stdout,
  console: false
});

let position = {
    horizontal: 0,
    vertical: 0,
    aim: 0
}

readInterface
.on('line', function(line) {
    position = move(position, line)
})
.on('close', function() {
    console.log(position.horizontal * position.vertical)
 });

function move(position, instruction) {
    const [command, movement] = instruction.split(" ")
    const movementValue = parseInt(movement)

    switch (command) {
        case 'forward':
            position.horizontal += movementValue
            position.vertical += (movementValue * position.aim)
            break;
        case 'up':
            position.aim -= movementValue
            break;
        case 'down':
            position.aim += movementValue
            break;
      }

      return position
}