const Block = require('./block')
const ParameterString = require('./parameter-string')

module.exports = class StringIndex extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.nextStringIndexBlock = this.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      this.table[i] = {
        pos: this.readInteger(),
        len: this.readInteger(),
        recType: this.readInteger(),
        objIndex: this.readInteger()
      }
    }
  }

  getStrings () {
    const strings = this.table
      .filter(si => si.recType > 0)
      .map(si => new ParameterString(this.buffer, si.pos, si))
    return strings.reduce((pss, ps) => {
      let typeStrings = pss[ps.recType]
      if (!typeStrings) {
        pss[ps.recType] = typeStrings = []
      }

      typeStrings.push(ps)

      return pss
    }, {})
  }
}
