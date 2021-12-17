const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let sum = 0

readInterface
.on('line', function(line) {
    const code = decode(line.split("|")[0].split(" ").filter(element => element !== ''))
    
    const digits = line.split("|")[1].split(" ").filter(element => element !== '')

    const value = getValue(digits,code)
    sum += parseInt(value)
})
.on('close', function() {
    console.log(sum)
 });

function getValue(digits, code) {
    let decoded = digits.map(digit => decodeDigit(digit, code))
    return decoded.join('')
}

function decodeDigit(digit, code) {
    for (let value=0 ; value<=9 ; value++) {
        if (hasSameLetters(digit, code[value])) {
            return value
        }
    }
    return null
}

function hasSameLetters (digit, codeValue) {
    return digit.split('').sort().join('') === codeValue.split('').sort().join('')
}

 function decode(wires) {
    let decoded = new Array(10)
    let matches = {}

    let one = wires.find(element => element.length === 2);
    decoded[1] = one
    let seven = wires.find(element => element.length === 3);
    decoded[7] = seven
    let four = wires.find(element => element.length === 4);
    decoded[4] = four
    let eight = wires.find(element => element.length === 7);
    decoded[8] = eight

    let i
    for (i=0; i<=2; i++) {
        if (!decoded[1].includes(decoded[7][i])) {
            break
        }
    }
    matches['top'] = decoded[7][i]

    // On va charcher le 9
    let nine = decoded[4] + matches.top
    wires.forEach(element => {
        let char = findTheMissingChar(nine, element)
        if (char) {
            decoded[9] = element
            matches['bottom'] = char
        }
    });

    // On va charcher le 3
    let tree = decoded[1] + matches.top + matches.bottom
    wires.forEach(element => {
        let char = findTheMissingChar(tree, element)
        if (char) {
            decoded[3] = element
            matches['middle'] = char
        }
    });

    // On va charcher le 6
    let filteredWires = wires.filter(element => element !== decoded[1])
    filteredWires = filteredWires.filter(element => element !== decoded[3])
    filteredWires = filteredWires.filter(element => element !== decoded[4])
    filteredWires = filteredWires.filter(element => element !== decoded[7])
    filteredWires = filteredWires.filter(element => element !== decoded[8])
    filteredWires = filteredWires.filter(element => element !== decoded[9])

    // Il ne reste que 0, 2, 5 et 6
    let twoOrFive = filteredWires.filter(element => element.length === 5)
    let zeroOrSix = filteredWires.filter(element => element.length === 6)

    let result = null
    i = 0
    let j = 0
    for (i=0 ; i<=1 ; i++) {
        for (j=0 ; j<=1 ; j++) {
            result = findTheMissingChar(twoOrFive[i], zeroOrSix[j])
            if (result) {
                break
            }
        }
        if (result) {
            break
        }
    }
    decoded[5] = twoOrFive[i]
    decoded[6] = zeroOrSix[j]
    matches['bottomLeft'] = result

    filteredWires = filteredWires.filter(element => element !== decoded[5])
    filteredWires = filteredWires.filter(element => element !== decoded[6])
    decoded[2] = filteredWires.filter(element => element.length === 5)[0]
    decoded[0] = filteredWires.filter(element => element.length === 6)[0]

    return decoded
 }

function findTheMissingChar (shortString, longString) {
    if (shortString.length + 1 !== longString.length) {
        return null
    }

    let value = longString

    shortString.split('').forEach(letter => {
        value = value.replace(letter, '')
    })

    if (value.length !== 1) { return null }

    return value
 }