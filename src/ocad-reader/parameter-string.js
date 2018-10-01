const Block = require('./block')

module.exports = class ParameterString extends Block {
  constructor (buffer, offset, indexRecord) {
    super(buffer, offset)

    this.recType = indexRecord.recType

    let val = ''
    let nextByte = 0
    for (let i = 0; i < indexRecord.len && (nextByte = this.readByte()); i++) {
      val += String.fromCharCode(nextByte)
    }

    const vals = val.split('\t')
    this.values = { _first: vals[0] }
    for (let i = 1; i < vals.length; i++) {
      this.values[vals[i][0]] = vals[i].substring(1)
    }
  }
}
