const Block = require('./block')
const PointSymbol = require('./point-symbol')
const LineSymbol = require('./line-symbol')
const AreaSymbol = require('./area-symbol')
const TextSymbol = require('./text-symbol')
const { PointSymbolType, LineSymbolType, AreaSymbolType, TextSymbolType } = require('./symbol-types')

module.exports = class SymbolIndex extends Block {
  constructor (buffer, offset, version, options) {
    super(buffer, offset)

    this.version = version
    this.nextSymbolIndexBlock = this.readInteger()
    this.symbolPosition = new Array(256)
    this.warnings = []
    this.options = options || {}
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
    try {
      switch (type) {
        case PointSymbolType:
          return new PointSymbol[this.version](this.buffer, offset)
        case LineSymbolType:
          return new LineSymbol[this.version](this.buffer, offset)
        case AreaSymbolType:
          return new AreaSymbol[this.version](this.buffer, offset)
        case TextSymbolType:
          return new TextSymbol[this.version](this.buffer, offset)
      }
    } catch (e) {
      if (!this.options.failOnWarning) {
        this.warnings.push(e)
      } else {
        throw e
      }
    }

    // Ignore other symbols for now
  }
}
