const PointSymbol = require('./point-symbol')
const LineSymbol = require('./line-symbol')
const AreaSymbol = require('./area-symbol')
const TextSymbol = require('./text-symbol')
const {
  PointSymbolType,
  LineSymbolType,
  AreaSymbolType,
  TextSymbolType,
  RectangleSymbolType,
} = require('./symbol-types')

module.exports = class SymbolIndex {
  constructor(reader, version, options) {
    this.version = version
    this.nextSymbolIndexBlock = reader.readInteger()
    this.symbolPosition = new Array(256)
    this.warnings = []
    this.options = options || {}
    for (let i = 0; i < this.symbolPosition.length; i++) {
      this.symbolPosition[i] = reader.readInteger()
    }
  }

  parseSymbols(reader) {
    return this.symbolPosition
      .filter(sp => sp > 0)
      .map(sp => this.parseSymbol(reader, sp))
      .filter(s => s)
  }

  parseSymbol(reader, offset) {
    if (!offset) return

    reader.push(offset)

    const type = reader.buffer.readInt8(offset + 8)
    let symbol
    try {
      let Cls
      switch (type) {
        case PointSymbolType:
          Cls = PointSymbol[this.version]
          break
        case LineSymbolType:
          Cls = LineSymbol[this.version]
          break
        case AreaSymbolType:
          Cls = AreaSymbol[this.version]
          break
        case TextSymbolType:
          Cls = TextSymbol[this.version]
          break
        case RectangleSymbolType:
          this.warnings.push(
            `Ignoring rectangle symbol ${reader.buffer.readInt32LE(
              offset + 4
            )}.`
          )
          return null
        default:
          throw new Error(`Unknown symbol type ${type}`)
      }

      reader.push(offset)
      symbol = new Cls(reader)
      reader.pop()
      this.warnings = this.warnings.concat(symbol.warnings)
    } catch (e) {
      if (!this.options.failOnWarning) {
        this.warnings.push(e)
      } else {
        throw e
      }
    }

    reader.pop()
    return symbol
  }
}
