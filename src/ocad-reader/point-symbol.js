const { Symbol10, Symbol11 } = require('./symbol')

/**
 * @typedef {import('./buffer-reader')} BufferReader
 */

/**
 * @typedef {object} PointSymbolProps
 * @property {1} type
 * @property {number} dataSize
 */

/** @typedef {import('./symbol').BaseSymbolProps & PointSymbolProps} PointSymbolDef */

/** @implements {PointSymbolDef} */
class PointSymbol10 extends Symbol10 {
  /**
   * @type {1}
   */
  type

  /**
   * @type {number}
   */
  dataSize

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    this.type = 1
    this.dataSize = reader.readWord()
    reader.readSmallInt() // Reserved

    this.elements = this.readElements(reader, this.dataSize)
  }
}

/** @implements {PointSymbolDef} */
class PointSymbol11 extends Symbol11 {
  /**
   * @type {1}
   */
  type

  /**
   * @type {number}
   */
  dataSize

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    // TODO: why?
    reader.skip(64)

    this.type = 1
    this.dataSize = reader.readWord()
    reader.readSmallInt() // Reserved

    this.elements = this.readElements(reader, this.dataSize)
  }
}

module.exports = {
  10: PointSymbol10,
  11: PointSymbol11,
  12: PointSymbol11,
  2018: PointSymbol11,
}
