const { Symbol10, Symbol11 } = require('./symbol')

class AreaSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
    this.hatchMode = this.readSmallInt()
    this.hatchColor = this.readSmallInt()
    this.hatchLineWidth = this.readSmallInt()
    this.hatchDist = this.readSmallInt()
    this.hatchAngle1 = this.readSmallInt()
    this.hatchAngle2 = this.readSmallInt()
    this.fillOn = !!this.readByte()
    this.borderOn = !!this.readByte()
    this.structMode = this.readByte()
    this.structDraw = this.readByte()
    this.structWidth = this.readSmallInt()
    this.structHeight = this.readSmallInt()
    this.structAngle = this.readSmallInt()
    this.structRes = this.readSmallInt()
    this.dataSize = this.readWord()

    this.elements = this.readElements(this.dataSize)
  }
}

class AreaSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    // TODO: why?
    this.offset += 64

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
    this.hatchMode = this.readSmallInt()
    this.hatchColor = this.readSmallInt()
    this.hatchLineWidth = this.readSmallInt()
    this.hatchDist = this.readSmallInt()
    this.hatchAngle1 = this.readSmallInt()
    this.hatchAngle2 = this.readSmallInt()
    this.fillOn = !!this.readByte()
    this.borderOn = !!this.readByte()
    this.structMode = this.readByte()
    this.structDraw = this.readByte()
    this.structWidth = this.readSmallInt()
    this.structHeight = this.readSmallInt()
    this.structAngle = this.readSmallInt()
    this.structIrregularVarX = this.readByte()
    this.structIrregularVarY = this.readByte()
    this.structIrregularMinDist = this.readSmallInt()
    this.structRes = this.readSmallInt()
    this.dataSize = this.readWord()

    this.elements = this.readElements(this.dataSize)
  }
}

module.exports = {
  10: AreaSymbol10,
  11: AreaSymbol11,
  12: AreaSymbol11,
  2018: AreaSymbol11
}
