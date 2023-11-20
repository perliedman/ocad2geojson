const { Symbol10, Symbol11 } = require('./symbol')

/**
 * @typedef {import('./buffer-reader')} BufferReader
 */

/**
 * @typedef {import('./symbol-element')} SymbolElement
 */

/**
 * @typedef {object} AreaSymbolProps
 *
 * @property {3} type
 * @property {number} borderSym
 * @property {number} fillColor
 * @property {number} hatchMode
 * @property {number} hatchColor
 * @property {number} hatchLineWidth
 * @property {number} hatchDist
 * @property {number} hatchAngle1
 * @property {number} hatchAngle2
 * @property {boolean} fillOn
 * @property {boolean} borderOn
 * @property {number} structMode
 * @property {number} structWidth
 * @property {number} structHeight
 * @property {number} structAngle
 * @property {number} structRes
 * @property {number} dataSize
 * @property {SymbolElement[]} elements
 */

/** @typedef {import('./symbol').BaseSymbolProps & AreaSymbolProps} AreaSymbolDef */

/** @implements {AreaSymbolDef} */
class AreaSymbol10 extends Symbol10 {
  /**
   * @type {3}
   */
  type
  /**
   * @type {number}
   */
  borderSym
  /**
   * @type {number}
   */
  fillColor
  /**
   * @type {number}
   */
  hatchMode
  /**
   * @type {number}
   */
  hatchColor
  /**
   * @type {number}
   */
  hatchLineWidth
  /**
   * @type {number}
   */
  hatchDist
  /**
   * @type {number}
   */
  hatchAngle1
  /**
   * @type {number}
   */
  hatchAngle2
  /**
   * @type {boolean}
   */
  fillOn
  /**
   * @type {boolean}
   */
  borderOn
  /**
   * @type {number}
   */
  structMode
  /**
   * @type {number}
   */
  structWidth
  /**
   * @type {number}
   */
  structHeight
  /**
   * @type {number}
   */
  structAngle
  /**
   * @type {number}
   */
  structRes
  /**
   * @type {number}
   */
  dataSize
  /**
   * @type {SymbolElement[]}
   */
  elements

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    this.type = 3
    this.borderSym = reader.readInteger()
    this.fillColor = reader.readSmallInt()
    this.hatchMode = reader.readSmallInt()
    this.hatchColor = reader.readSmallInt()
    this.hatchLineWidth = reader.readSmallInt()
    this.hatchDist = reader.readSmallInt()
    this.hatchAngle1 = reader.readSmallInt()
    this.hatchAngle2 = reader.readSmallInt()
    this.fillOn = !!reader.readByte()
    this.borderOn = !!reader.readByte()
    this.structMode = reader.readSmallInt()
    this.structWidth = reader.readSmallInt()
    this.structHeight = reader.readSmallInt()
    this.structAngle = reader.readSmallInt()
    this.structRes = reader.readSmallInt()
    this.dataSize = reader.readWord()

    this.elements = this.readElements(reader, this.dataSize)
  }
}

/** @implements {AreaSymbolDef} */
class AreaSymbol11 extends Symbol11 {
  /**
   * @type {3}
   */
  type

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    // TODO: why?
    reader.skip(64)

    this.type = 3
    this.borderSym = reader.readInteger()
    this.fillColor = reader.readSmallInt()
    this.hatchMode = reader.readSmallInt()
    this.hatchColor = reader.readSmallInt()
    this.hatchLineWidth = reader.readSmallInt()
    this.hatchDist = reader.readSmallInt()
    this.hatchAngle1 = reader.readSmallInt()
    this.hatchAngle2 = reader.readSmallInt()
    this.fillOn = !!reader.readByte()
    this.borderOn = !!reader.readByte()
    this.structMode = reader.readSmallInt()
    this.structWidth = reader.readSmallInt()
    this.structHeight = reader.readSmallInt()
    this.structAngle = reader.readSmallInt()
    this.structRes = reader.readSmallInt()
    this.dataSize = reader.readWord()

    this.elements = this.readElements(reader, this.dataSize)
  }
}

/** @implements {AreaSymbolDef} */
class AreaSymbol12 extends Symbol11 {
  /**
   * @type {3}
   */
  type

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    // TODO: why?
    reader.skip(64)

    this.type = 3
    this.borderSym = reader.readInteger()
    this.fillColor = reader.readSmallInt()
    this.hatchMode = reader.readSmallInt()
    this.hatchColor = reader.readSmallInt()
    this.hatchLineWidth = reader.readSmallInt()
    this.hatchDist = reader.readSmallInt()
    this.hatchAngle1 = reader.readSmallInt()
    this.hatchAngle2 = reader.readSmallInt()
    this.fillOn = !!reader.readByte()
    this.borderOn = !!reader.readByte()
    this.structMode = reader.readByte()
    this.structDraw = reader.readByte()
    this.structWidth = reader.readSmallInt()
    this.structHeight = reader.readSmallInt()
    this.structAngle = reader.readSmallInt()
    this.structIrregularVarX = reader.readByte()
    this.structIrregularVarY = reader.readByte()
    this.structIrregularMinDist = reader.readSmallInt()
    this.structRes = reader.readSmallInt()
    this.dataSize = reader.readWord()

    this.elements = this.readElements(reader, this.dataSize)
  }
}

module.exports = {
  10: AreaSymbol10,
  11: AreaSymbol11,
  12: AreaSymbol12,
  2018: AreaSymbol12,
}
