const Symbol = require('./symbol')

module.exports = class LineSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset, 2)

    this.lineColor = this.readSmallInt()
    this.lineWidth = this.readSmallInt()
    this.lineStyle = this.readSmallInt()
  }
}
