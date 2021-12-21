import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let playerPosition = [null, null]
let playerScore = [0, 0]

readInterface
.on('line', function(line) {
    const position = parseInt(line.split(':')[1])
    if (playerPosition[0]) {
        playerPosition[1] = position
    } else {
        playerPosition[0] = position
    }
})
.on('close', function() {
    let dieValue = 0
    let playerTurn = 0

    while (playerScore[0] < 1000 && playerScore[1] < 1000) {
        // Throw dice 3 times
        let dicesSum = 0
        for ( let i = 1 ; i <= 3 ; i++ ) {
            dieValue++
            dicesSum += dieValue
        }
        dicesSum = dicesSum % 10

        const playerPositionFrom0To9 = playerPosition[playerTurn] - 1
        const playerPositionFrom0To9PlusDiceSum = playerPositionFrom0To9 + dicesSum
        const newPlayerPositionFrom0To9 = playerPositionFrom0To9PlusDiceSum % 10
        const newPlayerPosition = newPlayerPositionFrom0To9 + 1
        playerPosition[playerTurn] = newPlayerPosition
        playerScore[playerTurn] += newPlayerPosition

        // Switch player
        playerTurn = playerTurn === 0 ? 1 : 0
    }

    const loserScore = playerScore.filter(score => score < 1000)[0]
    console.log(loserScore * dieValue)
});

