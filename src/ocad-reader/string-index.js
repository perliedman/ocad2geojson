const ParameterString = require('./parameter-string')

module.exports = class StringIndex {
  constructor(reader) {
    this.nextStringIndexBlock = reader.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      this.table[i] = {
        pos: reader.readInteger(),
        len: reader.readInteger(),
        recType: reader.readInteger(),
        objIndex: reader.readInteger(),
      }
    }
  }

  getStrings(reader) {
    const strings = this.table
      .filter(si => si.recType > 0)
      .map(si => {
        reader.push(si.pos)
        const s = new ParameterString(reader, si)
        reader.pop()
        return s
      })
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
