const TdPoly = require('./td-poly')

module.exports = class LRect {
  constructor(reader) {
    this.min = new TdPoly(reader.readInteger(), reader.readInteger())
    this.max = new TdPoly(reader.readInteger(), reader.readInteger())
  }
}
