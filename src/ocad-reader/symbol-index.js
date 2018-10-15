const Block = require('./block')
const PointSymbol = require('./point-symbol')
const LineSymbol = require('./line-symbol')
const AreaSymbol = require('./area-symbol')

module.exports = class SymbolIndex extends Block {
  constructor (buffer, offset, version) {
    super(buffer, offset)

    this.version = version
    this.nextSymbolIndexBlock = this.readInteger()
    this.symbolPosition = new Array(256)
    for (let i = 0; i < this.symbolPosition.length; i++) {
      this.symbolPosition[i] = this.readInteger()
    }
  }

  parseSymbols () {
    return this.symbolPosition
      .filter(sp => sp > 0)
      .map(sp => this.parseSymbol(sp))
      .filter(s => s)
  }

  parseSymbol (offset) {
    if (!offset) return

    const type = this.buffer.readInt8(offset + 8)
    switch (type) {
      case 1:
        return new PointSymbol[this.version](this.buffer, offset)
      case 2:
        return new LineSymbol[this.version](this.buffer, offset)
      case 3:
        return new AreaSymbol[this.version](this.buffer, offset)
    }

    // Ignore other symbols for now
  }
}
