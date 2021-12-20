export class Packet {
    constructor ( frame ) {
        this.frame = frame
        this.getVersion()
        this.getTypeID()
        this.data = ''
        this.rest = frame.substring(6, frame.length)
        if (this.isLiteral) {
            this.readLiteralValue()
        }

        if (this.isOperator) {
            this.lengthTypeID = parseInt(this.frame[6])
            this.rest = this.rest.substring(1, this.rest.length)
            this.packets = []
            if (this.lengthTypeID) {
                // the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.
                this.getNumberOfSubPackets()
                this.readOperatorFromNumberOfSubpackets()
            } else {
                // the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
                this.getTotalLengthInBit()
                this.readOperatorFromTotalLength()
            }
        }

        
        
    }

    getVersion () {
        const versionBinary = this.frame.substring(0, 3)
        this.version = parseInt(versionBinary, 2)
    }
    
    getTypeID () {
        const typeIDBinary = this.frame.substring(3, 6)
        this.typeID = parseInt(typeIDBinary, 2)
    }

    get isOperator() {
        return this.typeID !== 4
    }

    get isLiteral() {
        return this.typeID === 4
    }

    readLiteralValue() {
        let fiveCharactersGroups =  this.rest.match(/.{1,5}/g)
        let index
        for (index = 0 ; index < fiveCharactersGroups.length ; index++) {
            if(parseInt(fiveCharactersGroups[index][0]) === 0) {
                break
            }
        }
        const dataArray = fiveCharactersGroups.slice(0, index + 1)
        const dataArrayWithoutFirstBit = dataArray.map(value => value.substring(1, 5))
        const data = dataArray.join('')
        const dataWithoutFirstBit = dataArrayWithoutFirstBit.join('')
        this.data = dataWithoutFirstBit
        this.rest = this.rest.substring(data.length, this.rest.length), 
        this.value = parseInt(dataWithoutFirstBit, 2) 
    }

    getTotalLengthInBit() {
        const totalLengthInBitBinary = this.rest.substring(0, 15)
        this.totalLengthInBit = parseInt(totalLengthInBitBinary, 2)
        this.rest = this.rest.substring(15, this.rest.length)
    }
    
    getNumberOfSubPackets() {
        const numberOfSubPacketsBinary = this.rest.substring(0, 11)
        this.numberOfSubPackets = parseInt(numberOfSubPacketsBinary, 2)
        this.rest = this.rest.substring(11, this.rest.length)
    }

    readOperatorFromTotalLength() {
        this.data = this.rest.substring(0, this.totalLengthInBit)
        this.rest = this.rest.substring(this.totalLengthInBit, this.rest.length)
        while (this.data.includes('1')) {
            this.packets.push(new Packet( this.data ))
            this.data = this.packets[this.packets.length - 1].rest
        }
    }

    readOperatorFromNumberOfSubpackets() {
        let remainingPackets = this.numberOfSubPackets
        this.data = this.rest
        while (remainingPackets > 0) {
            this.packets.push(new Packet( this.rest ))
            this.rest = this.packets[this.packets.length - 1].rest
            remainingPackets--
        }
    }
}
