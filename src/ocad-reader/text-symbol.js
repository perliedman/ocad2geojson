const { TextSymbolType } = require('./symbol-types')
const { Symbol10, Symbol11 } = require('./symbol')

class TextSymbol10 extends Symbol10 {
  constructor(reader) {
    super(reader, TextSymbolType)

    readTextSymbol(this, reader)
  }

  getVerticalAlignment() {
    return verticalAlignment(this.alignment)
  }

  getHorizontalAlignment() {
    return horizontalAlignment(this.alignment)
  }
}

class TextSymbol11 extends Symbol11 {
  constructor(reader) {
    super(reader, TextSymbolType)

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

const readTextSymbol = (symbol, reader) => {
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
