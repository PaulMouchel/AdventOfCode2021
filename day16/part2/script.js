import readline from 'readline'
import fs from 'fs'
const readInterface = readline.createInterface({ input: fs.createReadStream('./input.txt')});
import { Packet } from './packet.js'

let hexFrameArray

readInterface
.on('line', function(line) {
    hexFrameArray = line.split('')
})
.on('close', function() {
    const fullFrame = hexFrameArray.map(char => hex2bin(char)).join('')

    let mainPacket = new Packet( fullFrame )
    console.log(mainPacket)
    // console.log(getVersionSum(mainPacket))

});


function hex2bin(hex){
    return ("0000" + (parseInt(hex, 16)).toString(2)).substr(-4);
}

function getSubPacketsVersionSum (packet, total) {
    total += packet.version
    packet.packets?.forEach(packet => {
        total = getSubPacketsVersionSum (packet, total)
    })
    return total
}

function getVersionSum (packet) {
    let total = 0
    total = getSubPacketsVersionSum(packet, total)
    return total
}