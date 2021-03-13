const SymbolElement = require('./symbol-element')
const InvalidSymbolElementException = require('./invalid-symbol-element-exception')

class BaseSymbol {
  constructor(reader, symbolType) {
    this.warnings = []
    this.type = symbolType
    this.size = reader.readInteger()
    this.symNum = reader.readInteger()
    this.number = `${Math.floor(this.symNum / 1000)}.${this.symNum % 1000}`
    this.otp = reader.readByte()
    this.flags = reader.readByte()
    this.selected = !!reader.readByte()
    this.status = reader.readByte()
    this.preferredDrawingTool = reader.readByte()
    this.csMode = reader.readByte()
    this.csObjType = reader.readByte()
    this.csCdFlags = reader.readByte()
    this.extent = reader.readInteger()
    this.filePos = reader.readCardinal()
  }

  readElements(reader, dataSize) {
    const elements = []

    for (let i = 0; i < dataSize; i += 2) {
      try {
        reader.push(reader.offset)
        const element = new SymbolElement(reader)
        const size = reader.getSize()
        reader.pop()
        reader.skip(size)
        elements.push(element)

        i += element.numberCoords
      } catch (e) {
        if (e instanceof InvalidSymbolElementException) {
          const size = reader.getSize()
          reader.pop()
          reader.skip(size)
          this.warnings.push(e)
        } else {
          throw e
        }
      }
    }

    return elements
  }

  isHidden() {
    return (this.status & 0x02) === 2
  }
}

class Symbol10 extends BaseSymbol {
  constructor(reader, symbolType) {
    super(reader, symbolType)

    this.group = reader.readSmallInt()
    this.nColors = reader.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = reader.readSmallInt()
    }
    this.description = ''
    reader.readByte() // String length
    for (let i = 1; i < 32; i++) {
      const c = reader.readByte()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }
    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = reader.readByte()
    }
  }
}

class Symbol11 extends BaseSymbol {
  constructor(reader, symbolType) {
    super(reader, symbolType)

    reader.readByte() // notUsed1
    reader.readByte() // notUsed2
    this.nColors = reader.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = reader.readSmallInt()
    }
    this.description = ''
    // UTF-16 string, 64 bytes
    for (let i = 0; i < 64 / 2; i++) {
      const c = reader.readWord()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }

    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = reader.readByte()
    }

    this.symbolTreeGroup = new Array(64)
    for (let i = 0; i < this.symbolTreeGroup.length; i++) {
      this.symbolTreeGroup[i] = reader.readWord()
    }
  }
}

module.exports = {
  Symbol10,
  Symbol11,
}
