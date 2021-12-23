import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let diagram = []

readInterface
.on('line', function(line) {
    diagram.push(line)
})
.on('close', function() {

    let roomA = [ diagram[2][3], diagram[3][3] ]
    let roomB = [ diagram[2][5], diagram[3][5] ]
    let roomC = [ diagram[2][7], diagram[3][7] ]
    let roomD = [ diagram[2][9], diagram[3][9] ]

    const startPosition = {
        position: ['.', '.', roomA, '.', roomB, '.', roomC, '.', roomD, '.', '.'],
        cost: 0
    }

    let positions = [ startPosition ]
    let bestScore

    let newPositionsList = []
    while (positions.length > 0) {
        // console.log(positions.map(position => position.position))
        // console.log(positions.length)
        // for ( let positionId = 0 ; positionId < positions.length ; positionId++ ) {
        const currentPosition = positions[positions.length - 1]
            let newPositions = move( currentPosition )
            positions.pop()
            if (newPositions.length > 0) {
                const winningPositions = newPositions.filter(position => 
                    position.position[2][0] === 'A' && position.position[2][1] === 'A' &&
                    position.position[4][0] === 'B' && position.position[4][1] === 'B' &&
                    position.position[6][0] === 'C' && position.position[6][1] === 'C' &&
                    position.position[8][0] === 'D' && position.position[8][1] === 'D' 
                )
                if (winningPositions.length > 0) {
                    winningPositions.forEach(position => {
                        if (!bestScore || position.cost < bestScore) {
                            bestScore = position.cost
                        }
                    });
                    newPositions = newPositions.filter(position => 
                        position.position[2][0] !== 'A' || position.position[2][1] !== 'A' ||
                        position.position[4][0] !== 'B' || position.position[4][1] !== 'B' ||
                        position.position[6][0] !== 'C' || position.position[6][1] !== 'C' ||
                        position.position[8][0] !== 'D' || position.position[8][1] !== 'D'
                    )
                }
                positions.push(...newPositions)
            }
            
            
        // }

        // newPositionsList = newPositionsList.filter((value, index, self) =>
        //     index === self.findIndex(position => (
        //         position.position[0] === value.position[0] && 
        //         position.position[1] === value.position[1] && 
        //         position.position[2][0] === value.position[2][0] && 
        //         position.position[2][1] === value.position[2][1] && 
        //         position.position[3] === value.position[3] && 
        //         position.position[4][0] === value.position[4][0] && 
        //         position.position[4][1] === value.position[4][1] && 
        //         position.position[5] === value.position[5] && 
        //         position.position[6][0] === value.position[6][0] && 
        //         position.position[6][1] === value.position[6][1] && 
        //         position.position[7] === value.position[7] && 
        //         position.position[8][0] === value.position[8][0] && 
        //         position.position[8][1] === value.position[8][1] && 
        //         position.position[9] === value.position[9] && 
        //         position.position[10] === value.position[10] &&
        //         position.cost === value.cost
        //     ))
        // )

        // positions = newPositionsList
        // newPositionsList = []
    }
    console.log(bestScore)
});

function move ( position ) {
    let newPositions = []
    const initPosition = { ...position }

    for ( let i = 0 ; i < initPosition.position.length ; i++ ) {
        const positionValue = initPosition.position[i]
        // Mouvements du hall à la chambre cible
        if (typeof positionValue === 'string') {
            if (positionValue !== '.') {
                const target = getTargetRoomIndex( positionValue )
                let roomValues = [...initPosition.position[target]]
                while (roomValues[roomValues.length - 1] === positionValue) {
                    roomValues.pop()
                }
                if ( roomValues[roomValues.length - 1] === '.' ) {
                    const unitCost = getUnitCost ( positionValue )
                    const hallWay = getHallway( initPosition.position )
                    let horizontalPath
                    if ( i < target ) {
                        horizontalPath = hallWay.join('').substring(i, target + 1).split('')
                    } else {
                        horizontalPath = hallWay.join('').substring(target, i + 1).split('')
                    }
                    if (horizontalPath.filter(value => value !== '.').length === 1) {
                        // On peut passer
                        const totalMoves = horizontalPath.length - 1 + roomValues.length
                        const moveCost = totalMoves * unitCost
                        let newPosition = [...initPosition.position]
                        newPosition[i] = '.'
                        newPosition[target][roomValues.length - 1] = initPosition.position[i]
                        return [{
                            position: newPosition,
                            cost: initPosition.cost + moveCost
                        }]
                    }
                }
            }
        // Mouvements de la chambre de départ au hall
        } else {
            let nothingToMove = true
            let j
            for (j = 0 ; j < initPosition.position[i].length ; j++ ) {
                if (initPosition.position[i][j] !== '.') {
                    const value = initPosition.position[i][j]
                    if (getTargetRoomIndex(value) === i) {
                        // si l'amphipode est déjà dans la bonne chambre
                        for ( let l = j ; l < initPosition.position[i].length ; l++ ) {
                            if(getTargetRoomIndex(initPosition.position[i][l]) !== i) {
                                nothingToMove = false
                                break
                            }
                        }
                    } else {
                        nothingToMove = false
                    }
                    
                    break
                }
            }
            if (!nothingToMove) {
                let k
                const unitCost = getUnitCost (initPosition.position[i][j])
                for (k = i ; k >= 0 ; k-- ) {
                    if (typeof initPosition.position[k] === 'string') {
                        if (initPosition.position[k] === '.') {
                            const horizontalMoves = i - k
                            const totalMoves = horizontalMoves + j + 1
                            const moveCost = totalMoves * unitCost
                            let newPosition = [...initPosition.position]
                            newPosition[2] = [...initPosition.position[2]]
                            newPosition[4] = [...initPosition.position[4]]
                            newPosition[6] = [...initPosition.position[6]]
                            newPosition[8] = [...initPosition.position[8]]
                            newPosition[i][j] = '.'
                            newPosition[k] = initPosition.position[i][j]
                            newPositions.push ({
                                position: newPosition,
                                cost: initPosition.cost + moveCost
                            })
                        } else {
                            break
                        }
                    }
                }
                for (k = i ; k <= 10 ; k++ ) {
                    if (typeof initPosition.position[k] === 'string') {
                        if (initPosition.position[k] === '.') {
                            const horizontalMoves = k - i
                            const totalMoves = horizontalMoves + j + 1
                            const moveCost = totalMoves * unitCost
                            let newPosition = [...initPosition.position]
                            newPosition[2] = [...initPosition.position[2]]
                            newPosition[4] = [...initPosition.position[4]]
                            newPosition[6] = [...initPosition.position[6]]
                            newPosition[8] = [...initPosition.position[8]]
                            newPosition[i][j] = '.'
                            newPosition[k] = initPosition.position[i][j]
                            newPositions.push ({
                                position: newPosition,
                                cost: initPosition.cost + moveCost
                            })
                        } else {
                            break
                        }
                    }
                }
            }
            
        }
        
    }
    
    return newPositions
}

function getHallway ( position ) {
    return [position[0], position[1], '.', position[3], '.', position[5], '.', position[7], '.', position[9], position[10]]
}

function getTargetRoomIndex( amphipod ) {
    switch(amphipod) {
        case 'A':
            return 2
        case 'B':
            return 4
        case 'C':
            return 6
        case 'D':
            return 8
    }
}

function getUnitCost( amphipod ) {
    switch(amphipod) {
        case 'A':
            return 1
        case 'B':
            return 10
        case 'C':
            return 100
        case 'D':
            return 1000
    }
}