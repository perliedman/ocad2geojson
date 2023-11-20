const BufferReader = require('./buffer-reader')
const { Symbol10, Symbol11 } = require('./symbol')

/**
 * @typedef {import('./symbol-element')} SymbolElement
 */

/**
 * @typedef {Object} DecreaseDef
 * @property {number} decMode
 * @property {number} decLast
 * @property {number} res
 * @property {number} decSymbolSize
 */

/**
 * @typedef {Object} LineSymbol
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
 */

class LineSymbol10 extends Symbol10 {
  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader, 2)

    readLineSymbol(this, reader, DoubleLine10, Decrease10)
  }
}

class LineSymbol11 extends Symbol11 {
  /**
   * @param {BufferReader} reader
   */
  constructor(reader) {
    super(reader, 2)

    // TODO: why?
    reader.skip(64)

    readLineSymbol(this, reader, DoubleLine11, Decrease11)
  }
}

/**
 * @property {number} dblMode
 * @property {number} dblFlags
 * @property {number} dblFillColor
 * @property {number} dblLeftColor
 * @property {number} dblRightColor
 * @property {number} dblWidth
 * @property {number} dblLeftWidth
 * @property {number} dblRightWidth
 * @property {number} dblLength
 * @property {number} dblGap
 */
class BaseDoubleLine {
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

const readLineSymbol = (symbol, reader, DoubleLine, Decrease) => {
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
