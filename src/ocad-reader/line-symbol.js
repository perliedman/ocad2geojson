const Block = require('./block')
const { Symbol10, Symbol11 } = require('./symbol')

class LineSymbol10 extends Symbol10 {
  constructor(buffer, offset) {
    super(buffer, offset, 2)

    readLineSymbol(this, DoubleLine10, Decrease10)
  }
}

class LineSymbol11 extends Symbol11 {
  constructor(buffer, offset) {
    super(buffer, offset, 2)

    // TODO: why?
    this.offset += 64

    readLineSymbol(this, DoubleLine11, Decrease11)
  }
}

class BaseDoubleLine extends Block {
  constructor(buffer, offset) {
    super(buffer, offset)

    this._startOffset = offset
    this.dblMode = this.readWord()
    this.dblFlags = this.readWord()
    this.dblFillColor = this.readSmallInt()
    this.dblLeftColor = this.readSmallInt()
    this.dblRightColor = this.readSmallInt()
    this.dblWidth = this.readSmallInt()
    this.dblLeftWidth = this.readSmallInt()
    this.dblRightWidth = this.readSmallInt()
    this.dblLength = this.readSmallInt()
    this.dblGap = this.readSmallInt()
  }
}

class DoubleLine10 extends BaseDoubleLine {
  constructor(buffer, offset) {
    super(buffer, offset)
    this.dblRes = new Array(3)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = this.readSmallInt()
    }
  }
}

class DoubleLine11 extends BaseDoubleLine {
  constructor(buffer, offset) {
    super(buffer, offset)

    this.dblBackgroundColor = this.readSmallInt()
    this.dblRes = new Array(2)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = this.readSmallInt()
    }
  }
}

class Decrease10 extends Block {
  constructor(buffer, offset) {
    super(buffer, offset)

    this.decMode = this.readWord()
    this.decLast = this.readWord()
    this.res = this.readWord()
  }
}

class Decrease11 extends Block {
  constructor(buffer, offset) {
    super(buffer, offset)

    this.decMode = this.readWord()
    this.decSymbolSize = this.readSmallInt()
    this.decSymbolDistance = !!this.readByte()
    this.decSymbolWidth = !!this.readByte()
  }
}

const readLineSymbol = (block, DoubleLine, Decrease) => {
  block.lineColor = block.readSmallInt()
  block.lineWidth = block.readSmallInt()
  block.lineStyle = block.readSmallInt()
  block.distFromStart = block.readSmallInt()
  block.distToEnd = block.readSmallInt()
  block.mainLength = block.readSmallInt()
  block.endLength = block.readSmallInt()
  block.mainGap = block.readSmallInt()
  block.secGap = block.readSmallInt()
  block.endGap = block.readSmallInt()
  block.minSym = block.readSmallInt()
  block.nPrimSym = block.readSmallInt()
  block.primSymDist = block.readSmallInt()

  block.doubleLine = new DoubleLine(block.buffer, block.offset)
  block.offset += block.doubleLine.getSize()

  block.decrease = new Decrease(block.buffer, block.offset)
  block.offset += block.decrease.getSize()

  block.frColor = block.readSmallInt()
  block.frWidth = block.readSmallInt()
  block.frStyle = block.readSmallInt()
  block.primDSize = block.readWord()
  block.secDSize = block.readWord()
  block.cornerDSize = block.readWord()
  block.startDSize = block.readWord()
  block.endDSize = block.readWord()
  block.useSymbolFlags = block.readByte()
  block.reserved = block.readByte()

  block.primSymElements = block.readElements(block.primDSize)
  block.secSymElements = block.readElements(block.secDSize)
  block.cornerSymElements = block.readElements(block.cornerDSize)
  block.startSymElements = block.readElements(block.startDSize)
  block.endSymElements = block.readElements(block.endDSize)
}

module.exports = {
  10: LineSymbol10,
  11: LineSymbol11,
  12: LineSymbol11,
  2018: LineSymbol11,
}
