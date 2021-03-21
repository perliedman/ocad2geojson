const { Symbol10, Symbol11 } = require('./symbol')

class LineSymbol10 extends Symbol10 {
  constructor(reader) {
    super(reader, 2)

    readLineSymbol(this, reader, DoubleLine10, Decrease10)
  }
}

class LineSymbol11 extends Symbol11 {
  constructor(reader) {
    super(reader, 2)

    // TODO: why?
    reader.skip(64)

    readLineSymbol(this, reader, DoubleLine11, Decrease11)
  }
}

class BaseDoubleLine {
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
  constructor(reader) {
    super(reader)
    this.dblRes = new Array(3)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = reader.readSmallInt()
    }
  }
}

class DoubleLine11 extends BaseDoubleLine {
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
  constructor(reader) {
    this.decMode = reader.readWord()
    this.decLast = reader.readWord()
    this.res = reader.readWord()
  }
}

class Decrease11 {
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

  symbol.primSymElements = symbol.readElements(reader, this.primDSize)
  symbol.secSymElements = symbol.readElements(reader, this.secDSize)
  symbol.cornerSymElements = symbol.readElements(reader, this.cornerDSize)
  symbol.startSymElements = symbol.readElements(reader, this.startDSize)
  symbol.endSymElements = symbol.readElements(reader, this.endDSize)
}

module.exports = {
  10: LineSymbol10,
  11: LineSymbol11,
  12: LineSymbol11,
  2018: LineSymbol11,
}
