const { Symbol10, Symbol11 } = require('./symbol')

class PointSymbol10 extends Symbol10 {
  constructor(reader) {
    super(reader, 1)

    this.dataSize = reader.readWord()
    reader.readSmallInt() // Reserved

    this.elements = reader.readElements(this.dataSize)
  }
}

class PointSymbol11 extends Symbol11 {
  constructor(reader) {
    super(reader, 1)

    // TODO: why?
    reader.skip(64)

    this.dataSize = reader.readWord()
    reader.readSmallInt() // Reserved

    this.elements = this.readElements(this.dataSize)
  }
}

module.exports = {
  10: PointSymbol10,
  11: PointSymbol11,
  12: PointSymbol11,
  2018: PointSymbol11,
}
