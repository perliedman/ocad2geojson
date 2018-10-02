const Symbol = require('./symbol')

module.exports = class AreaSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
  }
}
