const { Symbol10, Symbol11 } = require('./symbol')

class AreaSymbol10 extends Symbol10 {
  constructor(reader) {
    super(reader, 3)

    this.borderSym = reader.readInteger()
    this.fillColor = reader.readSmallInt()
    this.hatchMode = reader.readSmallInt()
    this.hatchColor = reader.readSmallInt()
    this.hatchLineWidth = reader.readSmallInt()
    this.hatchDist = reader.readSmallInt()
    this.hatchAngle1 = reader.readSmallInt()
    this.hatchAngle2 = reader.readSmallInt()
    this.fillOn = !!reader.readByte()
    this.borderOn = !!reader.readByte()
    this.structMode = reader.readByte()
    this.structDraw = reader.readByte()
    this.structWidth = reader.readSmallInt()
    this.structHeight = reader.readSmallInt()
    this.structAngle = reader.readSmallInt()
    this.structRes = reader.readSmallInt()
    this.dataSize = reader.readWord()

    this.elements = this.readElements(this.dataSize)
  }
}

class AreaSymbol11 extends Symbol11 {
  constructor(reader) {
    super(reader, 3)

    // TODO: why?
    reader.skip(64)

    this.borderSym = reader.readInteger()
    this.fillColor = reader.readSmallInt()
    this.hatchMode = reader.readSmallInt()
    this.hatchColor = reader.readSmallInt()
    this.hatchLineWidth = reader.readSmallInt()
    this.hatchDist = reader.readSmallInt()
    this.hatchAngle1 = reader.readSmallInt()
    this.hatchAngle2 = reader.readSmallInt()
    this.fillOn = !!reader.readByte()
    this.borderOn = !!reader.readByte()
    this.structMode = reader.readByte()
    this.structDraw = reader.readByte()
    this.structWidth = reader.readSmallInt()
    this.structHeight = reader.readSmallInt()
    this.structAngle = reader.readSmallInt()
    this.structIrregularVarX = reader.readByte()
    this.structIrregularVarY = reader.readByte()
    this.structIrregularMinDist = reader.readSmallInt()
    this.structRes = reader.readSmallInt()
    this.dataSize = reader.readWord()

    this.elements = this.readElements(reader, this.dataSize)
  }
}

module.exports = {
  10: AreaSymbol10,
  11: AreaSymbol11,
  12: AreaSymbol11,
  2018: AreaSymbol11,
}
