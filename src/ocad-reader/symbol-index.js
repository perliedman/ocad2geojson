const Block = require('./block')
const PointSymbol = require('./point-symbol')
const LineSymbol = require('./line-symbol')
const AreaSymbol = require('./area-symbol')
const TextSymbol = require('./text-symbol')
const { PointSymbolType, LineSymbolType, AreaSymbolType, TextSymbolType, RectangleSymbolType } = require('./symbol-types')

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
    let cls
    try {
      switch (type) {
        case PointSymbolType:
          cls = PointSymbol[this.version]
          break
        case LineSymbolType:
          cls = LineSymbol[this.version]
          break
        case AreaSymbolType:
          cls = AreaSymbol[this.version]
          break
        case TextSymbolType:
          cls = TextSymbol[this.version]
          break
        case RectangleSymbolType:
          this.warnings.push('Ignoring rectangle symbol.')
          return null
        default:
          throw new Error(`Unknown symbol type ${type}`)
      }

      const symbol = new cls(this.buffer, offset)
      this.warnings = this.warnings.concat(symbol.warnings)
      return symbol
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
