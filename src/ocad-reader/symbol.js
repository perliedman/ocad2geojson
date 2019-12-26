const Block = require('./block')
const SymbolElement = require('./symbol-element')

class BaseSymbol extends Block {
  constructor (buffer, offset, symbolType) {
    super(buffer, offset)

    this.type = symbolType
    this.size = this.readInteger()
    this.symNum = this.readInteger()
    this.number = `${Math.floor(this.symNum / 1000)}.${this.symNum % 1000}`
    this.otp = this.readByte()
    this.flags = this.readByte()
    this.selected = !!this.readByte()
    this.status = this.readByte()
    this.preferredDrawingTool = this.readByte()
    this.csMode = this.readByte()
    this.csObjType = this.readByte()
    this.csCdFlags = this.readByte()
    this.extent = this.readInteger()
    this.filePos = this.readCardinal()
  }

  readElements (dataSize) {
    const elements = []

    for (let i = 0; i < dataSize; i += 2) {
      const element = new SymbolElement(this.buffer, this.offset)
      this.offset += element.getSize()
      elements.push(element)

      i += element.numberCoords
    }

    return elements
  }

  isHidden () {
    return (this.status & 0xf) === 2
  }
}

class Symbol10 extends BaseSymbol {
  constructor (buffer, offset, symbolType) {
    super(buffer, offset, symbolType)

    this.group = this.readSmallInt()
    this.nColors = this.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = this.readSmallInt()
    }
    this.description = ''
    for (let i = 0; i < 32; i++) {
      const c = this.readByte()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }
    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = this.readByte()
    }
  }
}

class Symbol11 extends BaseSymbol {
  constructor (buffer, offset, symbolType) {
    super(buffer, offset, symbolType)

    this.readByte() // notUsed1
    this.readByte() // notUsed2
    this.nColors = this.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = this.readSmallInt()
    }
    this.description = ''
    // UTF-16 string, 64 bytes
    for (let i = 0; i < 64 / 2; i++) {
      const c = this.readWord()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }

    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = this.readByte()
    }

    this.symbolTreeGroup = new Array(64)
    for (let i = 0; i < this.symbolTreeGroup.length; i++) {
      this.symbolTreeGroup[i] = this.readWord()
    }
  }
}

module.exports = {
  Symbol10,
  Symbol11
}
