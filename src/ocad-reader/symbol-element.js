const Block = require('./block')
const TdPoly = require('./td-poly')
const InvalidSymbolElementException = require('./invalid-symbol-element-exception')

module.exports = class SymbolElement extends Block {
  constructor(buffer, offset) {
    super(buffer, offset)

    this.type = this.readSmallInt()
    this.flags = this.readWord()
    this.color = this.readSmallInt()
    this.lineWidth = this.readSmallInt()
    this.diameter = this.readSmallInt()
    this.numberCoords = this.readSmallInt()
    this.readCardinal() // Reserved

    if (this.numberCoords >= 0) {
      this.coords = new Array(this.numberCoords)
      for (let j = 0; j < this.numberCoords; j++) {
        this.coords[j] = new TdPoly(this.readInteger(), this.readInteger())
      }
    } else {
      // Negative number of coords seems to happen in some files; we ignore it for now.
      throw new InvalidSymbolElementException(
        `Symbol element with invalid (${this.numberCoords}) number of coordinates.`,
        this
      )
    }
  }
}
