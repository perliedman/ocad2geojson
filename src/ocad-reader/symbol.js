const SymbolElement = require('./symbol-element')
const InvalidSymbolElementException = require('./invalid-symbol-element-exception')

/**
 * @typedef {import('./buffer-reader')} BufferReader
 */

/**
 * @typedef {import('./symbol-types').SymbolType} SymbolType
 */

/**
 * @typedef {Object} BaseSymbolProps
 * @property  {Error[]} warnings
 * @property  {number} size
 * @property  {number} symNum
 * @property  {string} number
 * @property  {number} otp
 * @property  {number} flags
 * @property  {boolean} selected
 * @property  {number} status
 * @property  {number} preferredDrawingTool
 * @property  {number} csMode
 * @property  {number} csObjType
 * @property  {number} csCdFlags
 * @property  {number} extent
 * @property  {number} filePos
 * @property  {number} group
 * @property  {number} nColors
 * @property  {number[]} colors
 * @property  {string} description
 * @property  {number[]} iconBits
 * @property {() => boolean} isHidden
 */

/**
 * @typedef {import('./area-symbol').AreaSymbolDef} AreaSymbol
 */

/**
 * @typedef {import('./line-symbol').LineSymbol} LineSymbol
 */

/**
 * @typedef {import('./point-symbol').PointSymbolDef} PointSymbol
 */

/**
 * @typedef {import('./text-symbol').TextSymbolDef} TextSymbol
 */

/**
 * @typedef {AreaSymbol|LineSymbol|PointSymbol|TextSymbol} BaseSymbolDef
 */

class BaseSymbol {
  /**
   * @type {Error[]}
   */
  warnings
  /**
   * @type {number}
   */
  size
  /**
   * @type {number}
   */
  symNum
  /**
   * @type {string}
   */
  number
  /**
   * @type {number}
   */
  otp
  /**
   * @type {number}
   */
  flags
  /**
   * @type {boolean}
   */
  selected
  /**
   * @type {number}
   */
  status
  /**
   * @type {number}
   */
  preferredDrawingTool
  /**
   * @type {number}
   */
  csMode
  /**
   * @type {number}
   */
  csObjType
  /**
   * @type {number}
   */
  csCdFlags
  /**
   * @type {number}
   */
  extent
  /**
   * @type {number}
   */
  filePos
  /**
   * @type {number}
   */
  group
  /**
   * @type {number}
   */
  nColors
  /**
   * @type {number[]}
   */
  colors
  /**
   * @type {string}
   */
  description
  /**
   * @type {number[]}
   */
  iconBits

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    this.warnings = []
    this.size = reader.readInteger()
    this.symNum = reader.readInteger()
    this.number = `${Math.floor(this.symNum / 1000)}.${this.symNum % 1000}`
    this.otp = reader.readByte()
    this.flags = reader.readByte()
    this.selected = !!reader.readByte()
    this.status = reader.readByte()
    this.preferredDrawingTool = reader.readByte()
    this.csMode = reader.readByte()
    this.csObjType = reader.readByte()
    this.csCdFlags = reader.readByte()
    this.extent = reader.readInteger()
    this.filePos = reader.readCardinal()
  }

  /**
   * @param {BufferReader} reader
   * @param {number} dataSize
   * @returns {SymbolElement[]}
   */
  readElements(reader, dataSize) {
    const elements = []

    for (let i = 0; i < dataSize; i += 2) {
      try {
        reader.push(reader.offset)
        const element = new SymbolElement(reader)
        elements.push(element)

        i += element.numberCoords
      } catch (e) {
        if (e instanceof InvalidSymbolElementException) {
          this.warnings.push(e)
        } else {
          throw e
        }
      } finally {
        const size = reader.getSize()
        reader.pop()
        reader.skip(size)
      }
    }

    return elements
  }

  isHidden() {
    return (this.status & 0x02) === 2
  }
}

class Symbol10 extends BaseSymbol {
  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    this.group = reader.readSmallInt()
    this.nColors = reader.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = reader.readSmallInt()
    }
    this.description = ''
    reader.readByte() // String length
    for (let i = 1; i < 32; i++) {
      const c = reader.readByte()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }
    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = reader.readByte()
    }
  }
}

class Symbol11 extends BaseSymbol {
  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    reader.readByte() // notUsed1
    reader.readByte() // notUsed2
    this.nColors = reader.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = reader.readSmallInt()
    }
    this.description = ''
    // UTF-16 string, 64 bytes
    // TODO: replace with BufferReader.readWideString()
    for (let i = 0; i < 64 / 2; i++) {
      const c = reader.readWord()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }

    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = reader.readByte()
    }

    this.symbolTreeGroup = new Array(64)
    for (let i = 0; i < this.symbolTreeGroup.length; i++) {
      this.symbolTreeGroup[i] = reader.readWord()
    }
  }
}

module.exports = {
  Symbol10,
  Symbol11,
}
