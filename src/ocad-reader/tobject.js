const Block = require('./block')
const TdPoly = require('./td-poly')

class BaseTObject extends Block {
  constructor (buffer, offset, objType) {
    super(buffer, offset)
    this.objType = objType
  }

  getProperties () {
    return {
      sym: this.sym,
      otp: this.otp,
      unicode: this.unicode,
      ang: this.ang,
      col: this.col,
      lineWidth: this.lineWidth,
      diamFlags: this.diamFlags,
      serverObjectId: this.serverObjectId,
      height: this.height,
      creationDate: this.creationDate,
      multirepresentationId: this.multirepresentationId,
      modificationDate: this.modificationDate,
      nItem: this.nItem,
      nText: this.nText,
      nObjectString: this.nObjectString,
      nDatabaseString: this.nDatabaseString,
      objectStringType: this.objectStringType,
      res1: this.res1,
      text: this.text
    }
  }
}

class TObject10 extends BaseTObject {
  constructor (buffer, offset, objType) {
    super(buffer, offset, objType)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this.unicode = this.readByte()
    this.ang = this.readSmallInt()
    this.nItem = this.readCardinal()
    this.nText = this.readWord()
    this.readSmallInt() // Reserved
    this.col = this.readInteger()
    this.lineWidth = this.readSmallInt()
    this.diamFlags = this.readSmallInt()
    this.readInteger() // Reserved
    this.readByte() // Reserved
    this.readByte() // Reserved
    this.readSmallInt() // Reserved
    this.height = this.readInteger()
    this.coordinates = new Array(this.nItem)

    this.offset += 4

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
    }

    this.text = readWideString(this, this.nText)
  }
}

class TObject11 extends BaseTObject {
  constructor (buffer, offset, objType) {
    super(buffer, offset, objType)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this.unicode = this.readByte()
    this.ang = this.readSmallInt()
    this.nItem = this.readCardinal()
    this.nText = this.readWord()
    this.mark = this.readByte()
    this.snappingMark = this.readByte()
    this.col = this.readInteger()
    this.lineWidth = this.readSmallInt()
    this.diamFlags = this.readSmallInt()
    this.serverObjectId = this.readInteger()
    this.height = this.readInteger()
    this._date = this.readDouble()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
    }

    this.text = readWideString(this, this.nText)
  }
}

class TObject12 extends BaseTObject {
  constructor (buffer, offset, objType) {
    super(buffer, offset, objType)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this.unicode = this.readByte()
    this.ang = this.readSmallInt()
    this.col = this.readInteger()
    this.lineWidth = this.readSmallInt()
    this.diamFlags = this.readSmallInt()
    this.serverObjectId = this.readInteger()
    this.height = this.readInteger()
    this.creationDate = this.readDouble()
    this.multirepresentationId = this.readCardinal()
    this.modificationDate = this.readDouble()
    this.nItem = this.readCardinal()
    this.nText = this.readWord()
    this.nObjectString = this.readWord()
    this.nDatabaseString = this.readWord()
    this.objectStringType = this.readByte()
    this.res1 = this.readByte()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
    }

    this.text = readWideString(this, this.nText)
  }
}

const readWideString = (object, len) => {
  const textChars = []
  for (let i = 0; i < len * (object.unicode ? 2 : 4); i++) {
    const c = object.unicode ? object.readByte() : object.readWord()
    if (!c) break
    if (c !== 13) {
      textChars.push(String.fromCharCode(c))
    }
  }

  return textChars.join('').trim()
}

module.exports = {
  10: TObject10,
  11: TObject11,
  12: TObject12
}
