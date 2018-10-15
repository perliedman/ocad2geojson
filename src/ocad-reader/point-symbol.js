const { Symbol10, Symbol11 } = require('./symbol')

class PointSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, 1)

    // TODO: why?
    // this.offset += 64

    this.dataSize = this.readWord()
    this.readSmallInt() // Reserved

    this.elements = this.readElements(this.dataSize)
  }
}

class PointSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, 1)

    // TODO: why?
    this.offset += 64

    this.dataSize = this.readWord()
    this.readSmallInt() // Reserved

    this.elements = this.readElements(this.dataSize)
  }
}

module.exports = {
  10: PointSymbol10,
  11: PointSymbol11,
  12: PointSymbol11
}
