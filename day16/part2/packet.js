export class Packet {
    constructor ( frame ) {
        this.frame = frame
        this.getVersion()
        this.getTypeID()
        this.operatorType = this.getOperatorType()
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
        this.getValue()

        
        
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

    getOperatorType() {
        switch (this.typeID) {
            case 0:
                return "sum";
            case 1:
                return "product"
            case 2:
                return "minimum"
            case 3:
                return "maximum"
            case 5:
                return "greater than"
            case 6:
                return "less than"
            case 7:
                return "equal to"
            default:
                return null
        }
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
        this.rest = this.rest.substring(data.length, this.rest.length)
        // this.value = parseInt(dataWithoutFirstBit, 2) 
    }
    
    getValue() {
        if (this.isLiteral) {
            this.value = parseInt(this.data, 2)
        } else {
            const values = this.packets.map(packet => packet.value)
            switch (this.operatorType) {
                case "sum":
                    this.value = values.reduce((acc, val) => acc + val)
                    break
                case "product":
                    this.value = values.reduce((acc, val) => acc * val)
                    break
                case "minimum":
                    this.value = Math.min(...values)
                    break
                case "maximum":
                    this.value = Math.max(...values)
                    break
                case "greater than":
                    this.value = values[0] > values[1] ? 1 : 0
                    break
                case "less than":
                    this.value = values[0] < values[1] ? 1 : 0
                    break
                case "equal to":
                    this.value = values[0] === values[1] ? 1 : 0
                    break
            }       
                

        }
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
