const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
  input: fs.createReadStream('./input.txt'),
  // output: process.stdout,
  console: false
});

let increases = 0
let previous = null

readInterface
.on('line', function(line) {
  const value = parseInt(line)
  if (previous) {
      if (value > previous) {
        increases++
      }
    }
    previous = value
})
.on('close', function(line) {
  console.log(increases)
 });

