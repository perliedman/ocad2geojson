const { Symbol10, Symbol11 } = require('./symbol')

class AreaSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
  }
}

class AreaSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
  }
}

module.exports = {
  10: AreaSymbol10,
  11: AreaSymbol11,
  12: AreaSymbol11
}
