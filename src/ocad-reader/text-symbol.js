const { Symbol10, Symbol11 } = require('./symbol')

/** @typedef {import('./buffer-reader')} BufferReader */

/**
 * @typedef {object} TextSymbolProps
 * @property {4} type
 * @property {string} fontName
 * @property {number} fontColor
 * @property {number} fontSize
 * @property {number} weight
 * @property {boolean} italic
 * @property {number} res1
 * @property {number} charSpace
 * @property {number} wordSpace
 * @property {number} alignment
 * @property {number} lineSpace
 * @property {number} paraSpace
 * @property {number} indentFirst
 * @property {number} indentOther
 * @property {number} nTabs
 * @property {number[]} tabs
 * @property {boolean} lbOn
 * @property {number} lbColor
 * @property {number} lbWidth
 * @property {number} lbDist
 * @property {number} res2
 * @property {number} frMode
 * @property {number} frStyle
 * @property {boolean} pointSymOn
 * @property {number} pointSymNumber
 * @property {() => number} getHorizontalAlignment
 * @property {() => number} getVerticalAlignment
 */

/** @typedef {TextSymbolProps & import('./symbol').BaseSymbolProps} TextSymbolDef */

/** @implements {TextSymbolDef} */
class TextSymbol10 extends Symbol10 {
  // Specifying all these in both TextSymbol10 and TextSymbol11 is a bit annoying,
  // but it's the only way I've found to get the TypeScript compiler to understand that
  // TextSymbol10 and TextSymbol11 have the same properties. Maybe there's some JSDoc
  // cleverness that can be used to avoid this duplication.

  /**
   * @type {4}
   */
  type

  /**
   * @type {string}
   */
  fontName
  /**
   * @type {number}
   */
  fontColor
  /**
   * @type {number}
   */
  fontSize
  /**
   * @type {number}
   */
  weight
  /**
   * @type {boolean}
   */
  italic
  /**
   * @type {number}
   */
  res1
  /**
   * @type {number}
   */
  charSpace
  /**
   * @type {number}
   */
  wordSpace
  /**
   * @type {number}
   */
  alignment
  /**
   * @type {number}
   */
  lineSpace
  /**
   * @type {number}
   */
  paraSpace
  /**
   * @type {number}
   */
  indentFirst
  /**
   * @type {number}
   */
  indentOther
  /**
   * @type {number}
   */
  nTabs
  /**
   * @type {number[]}
   */
  tabs
  /**
   * @type {boolean}
   */
  lbOn
  /**
   * @type {number}
   */
  lbColor
  /**
   * @type {number}
   */
  lbWidth
  /**
   * @type {number}
   */
  lbDist
  /**
   * @type {number}
   */
  res2
  /**
   * @type {number}
   */
  frMode
  /**
   * @type {number}
   */
  frStyle
  /**
   * @type {boolean}
   */
  pointSymOn
  /**
   * @type {number}
   */
  pointSymNumber

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    readTextSymbol(this, reader)
  }

  getVerticalAlignment() {
    return verticalAlignment(this.alignment)
  }

  getHorizontalAlignment() {
    return horizontalAlignment(this.alignment)
  }
}

/** @implements {TextSymbolDef} */
class TextSymbol11 extends Symbol11 {
  /**
   * @type {4}
   */
  type

  /**
   * @type {string}
   */
  fontName
  /**
   * @type {number}
   */
  fontColor
  /**
   * @type {number}
   */
  fontSize
  /**
   * @type {number}
   */
  weight
  /**
   * @type {boolean}
   */
  italic
  /**
   * @type {number}
   */
  res1
  /**
   * @type {number}
   */
  charSpace
  /**
   * @type {number}
   */
  wordSpace
  /**
   * @type {number}
   */
  alignment
  /**
   * @type {number}
   */
  lineSpace
  /**
   * @type {number}
   */
  paraSpace
  /**
   * @type {number}
   */
  indentFirst
  /**
   * @type {number}
   */
  indentOther
  /**
   * @type {number}
   */
  nTabs
  /**
   * @type {number[]}
   */
  tabs
  /**
   * @type {boolean}
   */
  lbOn
  /**
   * @type {number}
   */
  lbColor
  /**
   * @type {number}
   */
  lbWidth
  /**
   * @type {number}
   */
  lbDist
  /**
   * @type {number}
   */
  res2
  /**
   * @type {number}
   */
  frMode
  /**
   * @type {number}
   */
  frStyle
  /**
   * @type {boolean}
   */
  pointSymOn
  /**
   * @type {number}
   */
  pointSymNumber

  constructor(reader) {
    super(reader)

    // TODO: why?
    reader.skip(64)

    readTextSymbol(this, reader)
  }

  getVerticalAlignment() {
    return verticalAlignment(this.alignment)
  }

  getHorizontalAlignment() {
    return horizontalAlignment(this.alignment)
  }
}

/**
 *
 * @param {TextSymbolDef} symbol
 * @param {BufferReader} reader
 */
const readTextSymbol = (symbol, reader) => {
  symbol.type = 4
  // ASCII string, 32 bytes
  symbol.fontName = ''
  const fontLength = reader.readByte() // String length
  for (let i = 0; i < fontLength; i++) {
    const c = reader.readByte()
    if (c) {
      symbol.fontName += String.fromCharCode(c)
    }
  }
  for (let i = 1; i < 32 - fontLength; i++) {
    reader.readByte()
  }

  symbol.fontColor = reader.readSmallInt()
  symbol.fontSize = reader.readSmallInt()
  symbol.weight = reader.readSmallInt()
  symbol.italic = !!reader.readByte()
  symbol.res1 = reader.readByte()
  symbol.charSpace = reader.readSmallInt()
  symbol.wordSpace = reader.readSmallInt()
  symbol.alignment = reader.readSmallInt()
  symbol.lineSpace = reader.readSmallInt()
  symbol.paraSpace = reader.readSmallInt()
  symbol.indentFirst = reader.readSmallInt()
  symbol.indentOther = reader.readSmallInt()
  symbol.nTabs = reader.readSmallInt()
  symbol.tabs = []
  for (let i = 0; i < 32; i++) {
    symbol.tabs.push(reader.readCardinal())
  }
  symbol.lbOn = reader.readWordBool()
  symbol.lbColor = reader.readSmallInt()
  symbol.lbWidth = reader.readSmallInt()
  symbol.lbDist = reader.readSmallInt()
  symbol.res2 = reader.readSmallInt()
  symbol.frMode = reader.readByte()
  symbol.frStyle = reader.readByte()
  symbol.pointSymOn = !!reader.readByte()
  symbol.pointSymNumber = reader.readByte()
  // TODO: Some frame parameters ignored here
}

const verticalAlignment = a => a & 0xfc
const horizontalAlignment = a => a & 0x03

module.exports = {
  10: TextSymbol10,
  11: TextSymbol11,
  12: TextSymbol11,
  2018: TextSymbol11,
  VerticalAlignBottom: 0,
  VerticalAlignMiddle: 4,
  VerticalAlignTop: 8,
  HorizontalAlignLeft: 0,
  HorizontalAlignCenter: 1,
  HorizontalAlignRight: 2,
  HorizontalAlignAllLine: 3,
}
