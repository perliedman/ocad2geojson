const TdPoly = require('./td-poly')
const InvalidSymbolElementException = require('./invalid-symbol-element-exception')

module.exports = class SymbolElement {
  constructor(reader) {
    this.type = reader.readSmallInt()
    this.flags = reader.readWord()
    this.color = reader.readSmallInt()
    this.lineWidth = reader.readSmallInt()
    this.diameter = reader.readSmallInt()
    this.numberCoords = reader.readSmallInt()
    reader.readCardinal() // Reserved

    if (this.numberCoords >= 0) {
      this.coords = new Array(this.numberCoords)
      for (let j = 0; j < this.numberCoords; j++) {
        this.coords[j] = new TdPoly(reader.readInteger(), reader.readInteger())
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
