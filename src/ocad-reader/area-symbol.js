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
  }
}

module.exports = {
  10: AreaSymbol10,
  11: AreaSymbol11,
  12: AreaSymbol11,
  2018: AreaSymbol11
}
