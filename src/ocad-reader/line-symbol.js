const { Symbol10, Symbol11 } = require('./symbol')

/**
 * @typedef {import('./symbol-element')} SymbolElement
 */
/**
 * @typedef {import('./symbol').BaseSymbolProps} BaseSymbolProps
 */

/**
 * @typedef {Object} DecreaseDef10
 * @property {number} decMode
 * @property {number} decLast
 * @property {number} res
 */

/**
 * @typedef {Object} DecreaseDef11
 * @property {number} decMode
 * @property {number} decSymbolSize
 * @property {boolean} decSymbolDistance
 * @property {boolean} decSymbolWidth
 * @property {number} decSymbolSize
 */

/**
 * @typedef {DecreaseDef10|Decrease11} DecreaseDef
 */

/**
 * @typedef {object} LineSymbolType
 * @property {2} type
 * @property {number} lineColor
 * @property {number} lineWidth
 * @property {number} lineStyle
 * @property {number} distFromStart
 * @property {number} distToEnd
 * @property {number} mainLength
 * @property {number} endLength
 * @property {number} mainGap
 * @property {number} secGap
 * @property {number} endGap
 * @property {number} minSym
 * @property {number} nPrimSym
 * @property {number} primSymDist

 * @property {BaseDoubleLine} doubleLine
 * @property {DecreaseDef} decrease

 * @property {number} frColor
 * @property {number} frWidth
 * @property {number} frStyle
 * @property {number} primDSize
 * @property {number} secDSize
 * @property {number} cornerDSize
 * @property {number} startDSize
 * @property {number} endDSize
 * @property {number} useSymbolFlags
 * @property {number} reserved

 * @property {SymbolElement[]} primSymElements
 * @property {SymbolElement[]} secSymElements
 * @property {SymbolElement[]} cornerSymElements
 * @property {SymbolElement[]} startSymElements
 * @property {SymbolElement[]} endSymElements
 * 
 * @property {(reader: BufferReader, dataSize: number) => SymbolElement[]} readElements
 * 
 * @typedef {BaseSymbolProps & LineSymbolType} LineSymbol
 * @property {import('./symbol-types').LineSymbolType} type
 */

/** @typedef {import("./buffer-reader")} BufferReader */

/** @implements {LineSymbolType} */
class LineSymbol10 extends Symbol10 {
  /** @type {2} */
  type
  /** @type {number} */
  lineColor
  /** @type {number} */
  lineWidth
  /** @type {number} */
  lineStyle
  /** @type {number} */
  distFromStart
  /** @type {number} */
  distToEnd
  /** @type {number} */
  mainLength
  /** @type {number} */
  endLength
  /** @type {number} */
  mainGap
  /** @type {number} */
  secGap
  /** @type {number} */
  endGap
  /** @type {number} */
  minSym
  /** @type {number} */
  nPrimSym
  /** @type {number} */
  primSymDist
  /** @type {BaseDoubleLine} */
  doubleLine
  /** @type {DecreaseDef} */
  decrease
  /** @type {number} */
  frColor
  /** @type {number} */
  frWidth
  /** @type {number} */
  frStyle
  /** @type {number} */
  primDSize
  /** @type {number} */
  secDSize
  /** @type {number} */
  cornerDSize
  /** @type {number} */
  startDSize
  /** @type {number} */
  endDSize
  /** @type {number} */
  useSymbolFlags
  /** @type {number} */
  reserved
  /** @type {SymbolElement[]} */
  primSymElements
  /** @type {SymbolElement[]} */
  secSymElements
  /** @type {SymbolElement[]} */
  cornerSymElements
  /** @type {SymbolElement[]} */
  startSymElements
  /** @type {SymbolElement[]} */
  endSymElements

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    readLineSymbol(this, reader, DoubleLine10, Decrease10)
  }
}

/** @implements {LineSymbolType} */
class LineSymbol11 extends Symbol11 {
  /** @type {2} */
  type
  /** @type {number} */
  lineColor
  /** @type {number} */
  lineWidth
  /** @type {number} */
  lineStyle
  /** @type {number} */
  distFromStart
  /** @type {number} */
  distToEnd
  /** @type {number} */
  mainLength
  /** @type {number} */
  endLength
  /** @type {number} */
  mainGap
  /** @type {number} */
  secGap
  /** @type {number} */
  endGap
  /** @type {number} */
  minSym
  /** @type {number} */
  nPrimSym
  /** @type {number} */
  primSymDist
  /** @type {BaseDoubleLine} */
  doubleLine
  /** @type {DecreaseDef} */
  decrease
  /** @type {number} */
  frColor
  /** @type {number} */
  frWidth
  /** @type {number} */
  frStyle
  /** @type {number} */
  primDSize
  /** @type {number} */
  secDSize
  /** @type {number} */
  cornerDSize
  /** @type {number} */
  startDSize
  /** @type {number} */
  endDSize
  /** @type {number} */
  useSymbolFlags
  /** @type {number} */
  reserved
  /** @type {SymbolElement[]} */
  primSymElements
  /** @type {SymbolElement[]} */
  secSymElements
  /** @type {SymbolElement[]} */
  cornerSymElements
  /** @type {SymbolElement[]} */
  startSymElements
  /** @type {SymbolElement[]} */
  endSymElements

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    // TODO: why?
    reader.skip(64)

    readLineSymbol(this, reader, DoubleLine11, Decrease11)
  }
}

class BaseDoubleLine {
  /** @type {number} */
  dblMode
  /** @type {number} */
  dblFlags
  /** @type {number} */
  dblFillColor
  /** @type {number} */
  dblLeftColor
  /** @type {number} */
  dblRightColor
  /** @type {number} */
  dblWidth
  /** @type {number} */
  dblLeftWidth
  /** @type {number} */
  dblRightWidth
  /** @type {number} */
  dblLength
  /** @type {number} */
  dblGap

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    this.dblMode = reader.readWord()
    this.dblFlags = reader.readWord()
    this.dblFillColor = reader.readSmallInt()
    this.dblLeftColor = reader.readSmallInt()
    this.dblRightColor = reader.readSmallInt()
    this.dblWidth = reader.readSmallInt()
    this.dblLeftWidth = reader.readSmallInt()
    this.dblRightWidth = reader.readSmallInt()
    this.dblLength = reader.readSmallInt()
    this.dblGap = reader.readSmallInt()
  }
}

class DoubleLine10 extends BaseDoubleLine {
  /** @type {number[]} */
  dblRes

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)
    this.dblRes = new Array(3)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = reader.readSmallInt()
    }
  }
}

class DoubleLine11 extends BaseDoubleLine {
  /** @type {number[]} */
  dblRes

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader)

    this.dblBackgroundColor = reader.readSmallInt()
    this.dblRes = new Array(2)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = reader.readSmallInt()
    }
  }
}

class Decrease10 {
  /** @type {number} */
  decMode
  /** @type {number} */
  decLast
  /** @type {number} */
  res

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    this.decMode = reader.readWord()
    this.decLast = reader.readWord()
    this.res = reader.readWord()
  }
}

class Decrease11 {
  /** @type {number} */
  decMode
  /** @type {number} */
  decSymbolSize
  /** @type {boolean} */
  decSymbolDistance
  /** @type {boolean} */
  decSymbolWidth

  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    this.decMode = reader.readWord()
    this.decSymbolSize = reader.readSmallInt()
    this.decSymbolDistance = !!reader.readByte()
    this.decSymbolWidth = !!reader.readByte()
  }
}

/**
 * @param {LineSymbol} symbol
 * @param {BufferReader} reader
 * @param {typeof DoubleLine10 | typeof DoubleLine11} DoubleLine
 * @param {typeof Decrease10 | typeof Decrease11} Decrease
 */
const readLineSymbol = (symbol, reader, DoubleLine, Decrease) => {
  symbol.type = 2
  symbol.lineColor = reader.readSmallInt()
  symbol.lineWidth = reader.readSmallInt()
  symbol.lineStyle = reader.readSmallInt()
  symbol.distFromStart = reader.readSmallInt()
  symbol.distToEnd = reader.readSmallInt()
  symbol.mainLength = reader.readSmallInt()
  symbol.endLength = reader.readSmallInt()
  symbol.mainGap = reader.readSmallInt()
  symbol.secGap = reader.readSmallInt()
  symbol.endGap = reader.readSmallInt()
  symbol.minSym = reader.readSmallInt()
  symbol.nPrimSym = reader.readSmallInt()
  symbol.primSymDist = reader.readSmallInt()

  symbol.doubleLine = new DoubleLine(reader)
  symbol.decrease = new Decrease(reader)

  symbol.frColor = reader.readSmallInt()
  symbol.frWidth = reader.readSmallInt()
  symbol.frStyle = reader.readSmallInt()
  symbol.primDSize = reader.readWord()
  symbol.secDSize = reader.readWord()
  symbol.cornerDSize = reader.readWord()
  symbol.startDSize = reader.readWord()
  symbol.endDSize = reader.readWord()
  symbol.useSymbolFlags = reader.readByte()
  symbol.reserved = reader.readByte()

  symbol.primSymElements = symbol.readElements(reader, symbol.primDSize)
  symbol.secSymElements = symbol.readElements(reader, symbol.secDSize)
  symbol.cornerSymElements = symbol.readElements(reader, symbol.cornerDSize)
  symbol.startSymElements = symbol.readElements(reader, symbol.startDSize)
  symbol.endSymElements = symbol.readElements(reader, symbol.endDSize)
}

module.exports = {
  10: LineSymbol10,
  11: LineSymbol11,
  12: LineSymbol11,
  2018: LineSymbol11,
}
