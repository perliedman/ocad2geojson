const Block = require('./block')

module.exports = class SymbolElement extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.type = this.readSmallInt()
    this.flags = this.readWord()
    this.color = this.readSmallInt()
    this.lineWidth = this.readSmallInt()
    this.diameter = this.readSmallInt()
    this.numberCoords = this.readSmallInt()
    this.readCardinal() // Reserved

    this.coords = new Array(this.numberCoords)
    for (let j = 0; j < this.numberCoords; j++) {
      this.coords[j] = {
        x: this.readInteger(),
        y: this.readInteger()
      }
    }
  }
}
