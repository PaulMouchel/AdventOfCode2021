const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});

let diagram = new Array(1000);

for (let i = 0; i < 1000; i++) {
    diagram[i] = new Array(1000).fill(0);
}

readInterface
.on('line', function(line) {

    const [ begin, end ] = line.split(" -> ")
    let [ beginXString, beginYString ] = begin.split(",")
    let [ endXString, endYString ] = end.split(",")

    let beginX = parseInt(beginXString)
    let beginY = parseInt(beginYString)
    let endX = parseInt(endXString)
    let endY = parseInt(endYString)

    let points = []

    if (beginX === endX) {
        [ beginY, endY ] = putInRightOrder(beginY, endY)
        for (let i = beginY ; i <= endY ; i++) {
            points.push({x: beginX, y: i})
        }
    } else if (beginY === endY) {
        [ beginX, endX ] = putInRightOrder(beginX, endX)
        for (let i = beginX ; i <= endX ; i++) {
            points.push({x: i, y: beginY})
        }
    } else {
        const modifyX = getIncreaseOrDescrease(beginX, endX)
        const modifyY = getIncreaseOrDescrease(beginY, endY)
        x = beginX
        y = beginY
        while ((x <= endX && modifyX === 1) || (x >= endX && modifyX === -1)) {
            points.push({x:x, y:y})
            x += modifyX
            y += modifyY
        }
    }
    
    points.forEach(point => {
        diagram[point.y][point.x] += 1
    });

})
.on('close', function() {
    

    let sum = 0

    diagram.forEach(line => {
        line.forEach(value => {
            if(value >= 2) {
                sum++
            }
        })
    })

    console.log(sum)

 });

 function putInRightOrder(num1, num2) {
     if (num1 > num2) {
         const temp = num1
         num1 = num2
         num2 = temp
     }
     return [num1, num2]
 }

 function getIncreaseOrDescrease(start, end) {
     if (start < end) {
         return 1
     }
     return -1
 }