const Symbol = require('./symbol')

module.exports = class LineSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset, 1)

    // TODO: why?
    this.offset += 64

    this.dataSize = this.readWord()
    this.readSmallInt() // Reserved

    this.elements = []

    for (let i = 0; i < this.dataSize; i += 2) {
      const element = {}
      element.type = this.readSmallInt()
      element.flags = this.readWord()
      element.color = this.readSmallInt()
      element.lineWidth = this.readSmallInt()
      element.diameter = this.readSmallInt()
      element.numberCoords = this.readSmallInt()
      this.readCardinal() // Reserved

      element.coords = new Array(element.numberCoords)
      for (let j = 0; j < element.numberCoords; j++) {
        element.coords[j] = {
          x: this.readInteger(),
          y: this.readInteger()
        }
        i++
      }

      this.elements.push(element)
    }
  }
}
