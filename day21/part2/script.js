import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let universes = [
    {
        playerPosition: [null, null],
        playerScore: [0, 0],
        times: 1,
    }
]

readInterface
.on('line', function(line) {
    const position = parseInt(line.split(':')[1])
    if (universes[0].playerPosition[0]) {
        universes[0].playerPosition[1] = position
    } else {
        universes[0].playerPosition[0] = position
    }
})
.on('close', function() {
    let winnerCounter = [0, 0]
    let newUniverses = []
    let playerTurn = 0
    while (universes.length > 0) {
    // for (let test = 0 ; test <= 18 ; test++ ) {
        console.log(universes.length)
        universes.forEach(universe => {
            // When throw die 3 times the sum could be
            // 3 in 1 case
            // 4 in 3 cases
            // 3 in 6 cases
            // 3 in 7 cases
            // 3 in 6 cases
            // 8 in 3 cases
            // 9 in 1 case
            const casesForEachValue = [ 0, 0, 0, 1, 3, 6, 7, 6, 3, 1]

            for ( let dicesSum = 3 ; dicesSum <= 9 ; dicesSum++) {
                const playerPositionFrom0To9 = universe.playerPosition[playerTurn] - 1
                const playerPositionFrom0To9PlusDiceSum = playerPositionFrom0To9 + dicesSum
                const newPlayerPositionFrom0To9 = playerPositionFrom0To9PlusDiceSum % 10
                const newPlayerPosition = newPlayerPositionFrom0To9 + 1
                const newPlayerScore = universe.playerScore[playerTurn] + newPlayerPosition
                const newTimes = universe.times * casesForEachValue[dicesSum]
                const newWinner = newPlayerScore >= 21

                let bothPlayerPosition = [universe.playerPosition[0], universe.playerPosition[1]]
                let bothPlayerScore = [universe.playerScore[0], universe.playerScore[1]]

                bothPlayerPosition[playerTurn] = newPlayerPosition
                bothPlayerScore[playerTurn] = newPlayerScore

                const newUniverse = {
                    playerPosition: bothPlayerPosition,
                    playerScore: bothPlayerScore,
                    times: newTimes
                }

                if (!newWinner) {
                    const index = newUniverses.findIndex(value => value.playerScore[0] === newUniverse.playerScore[0] &&
                        value.playerScore[1] === newUniverse.playerScore[1] &&
                        value.playerPosition[0] === newUniverse.playerPosition[0] &&
                        value.playerPosition[1] === newUniverse.playerPosition[1])

                    if (index !== -1 ) {
                            newUniverses[index].times += newUniverse.times
                        } else {
                            newUniverses.push(newUniverse)
                        }
                    
                } else {
                    winnerCounter[playerTurn] += newTimes
                }               
            }



        })
        universes = newUniverses
        newUniverses = []
        playerTurn = playerTurn === 0 ? 1 : 0
    }

    console.log(winnerCounter.sort((a, b) => a > b)[0])

});

