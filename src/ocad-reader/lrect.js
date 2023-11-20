const TdPoly = require('./td-poly')

module.exports = class LRect {
  /**
   * @type {TdPoly}
   */
  min
  /**
   * @type {TdPoly}
   */
  max

  /**
   * @param {import('./buffer-reader')} reader
   */
  constructor(reader) {
    this.min = new TdPoly(reader.readInteger(), reader.readInteger())
    this.max = new TdPoly(reader.readInteger(), reader.readInteger())
  }
}
