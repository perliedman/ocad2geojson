const Symbol = require('./symbol')

module.exports = class PointSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset, 1)

    // TODO: why?
    this.offset += 64

    this.dataSize = this.readWord()
    this.readSmallInt() // Reserved

    this.elements = this.readElements(this.dataSize)
  }
}
