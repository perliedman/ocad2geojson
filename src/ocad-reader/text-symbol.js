const { TextSymbolType } = require('./symbol-types')
const { Symbol10, Symbol11 } = require('./symbol')

class TextSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, TextSymbolType)

    readTextSymbol(this)
  }

  getVerticalAlignment () {
    return verticalAlignment(this.alignment)
  }

  getHorizontalAlignment () {
    return horizontalAlignment(this.alignment)
  }
}

class TextSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, TextSymbolType)

    // TODO: why?
    this.offset += 64

    readTextSymbol(this)
  }

  getVerticalAlignment () {
    return verticalAlignment(this.alignment)
  }

  getHorizontalAlignment () {
    return horizontalAlignment(this.alignment)
  }
}

const readTextSymbol = block => {
  // ASCII string, 32 bytes
  block.fontName = ''
  for (let i = 0; i < 32; i++) {
    const c = block.readByte()
    if (c) {
      block.fontName += String.fromCharCode(c)
    }
  }

  block.fontColor = block.readSmallInt()
  block.fontSize = block.readSmallInt()
  block.weight = block.readSmallInt()
  block.italic = !!block.readByte()
  block.res1 = block.readByte()
  block.charSpace = block.readSmallInt()
  block.wordSpace = block.readSmallInt()
  block.alignment = block.readSmallInt()
  block.lineSpace = block.readSmallInt()
  block.paraSpace = block.readSmallInt()
  block.indentFirst = block.readSmallInt()
  block.indentOther = block.readSmallInt()
  block.nTabs = block.readSmallInt()
  block.tabs = []
  for (let i = 0; i < 32; i++) {
    block.tabs.push(block.readCardinal)
  }
  block.lbOn = block.readWordBool()
  block.lbColor = block.readSmallInt()
  block.lbWidth = block.readSmallInt()
  block.lbDist = block.readSmallInt()
  block.res2 = block.readSmallInt()
  block.frMode = block.readByte()
  block.frStyle = block.readByte()
  block.pointSymOn = !!block.readByte()
  block.pointSymNumber = block.readByte()
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
  HorizontalAlignAllLine: 3
}
