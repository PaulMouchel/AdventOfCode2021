import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let algorithm
let image = []

readInterface
.on('line', function(line) {
    if (!algorithm) {
        algorithm = line
    } else {
        if (line !== '') {
            image.push(line.split(''))
        }
    }
})
.on('close', function() {
    let infiniteValue = '.'

    image = expendImage(image, infiniteValue)
    image = expendImage(image, infiniteValue)
    let newImage = []
    if (infiniteValue === '.') {
        infiniteValue = algorithm[0]
    } else {
        infiniteValue = algorithm[255]
    }
    for ( let i = 1 ; i < image.length - 1 ; i++ ) {
        newImage.push(new Array(image[1].length - 2))
    }
    for ( let y = 1 ; y < image.length - 1 ; y++) {
        for ( let x = 1 ; x < image[1].length - 1 ; x++) {
            const value = getNinePointsValue( x, y, image)
            newImage[y - 1][x - 1] = algorithm[value]
        }
    }
    image = newImage
    image = expendImage(image, infiniteValue)
    image = expendImage(image, infiniteValue)
    newImage = []
    if (infiniteValue === '.') {
        infiniteValue = algorithm[0]
    } else {
        infiniteValue = algorithm[255]
    }
    for ( let i = 1 ; i < image.length - 1 ; i++ ) {
        newImage.push(new Array(image[1].length - 2))
    }
    for ( let y = 1 ; y < image.length - 1 ; y++) {
        for ( let x = 1 ; x < image[1].length - 1 ; x++) {
            const value = getNinePointsValue( x, y, image)
            newImage[y - 1][x - 1] = algorithm[value]
        }
    }
    image = newImage
    console.log(
        count('#', image)
    )
});

function count (char, image) {
    return image.map(line => line.join('')).join('').split('').filter(value => value === char).length
}

function expendImage (image, infiniteValue) {
    const width = image[0].length
    const topAndBottomLine = new Array(width + 2).fill(infiniteValue)
    const largeImage = image.map(line => [ infiniteValue, ...line, infiniteValue])
    return [ topAndBottomLine, ...largeImage, topAndBottomLine ]
}

function getNinePointsValue ( x, y, image ) {
    const ninePoints = [ image[y - 1][x - 1], image[y - 1][x], image[y - 1][x + 1], image[y][x - 1], image[y][x], image[y][x + 1], image[y + 1][x - 1],image[y + 1][x],image[y + 1][x + 1] ]
    const ninePointsString = ninePoints.join('').replaceAll('.', '0').replaceAll('#', '1')
    const value = parseInt(ninePointsString, 2)
    return value
}