const TdPoly = require('./td-poly')

class BaseTObject {
  constructor(reader, objIndex) {
    this.objIndex = objIndex
    this.objType = objIndex.objType
  }

  getProperties() {
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
      text: this.text,
      objectString: this.objectString,
      databaseString: this.databaseString,
    }
  }
}

class TObject10 extends BaseTObject {
  constructor(reader, objIndex) {
    super(reader, objIndex)

    this.sym = reader.readInteger()
    this.otp = reader.readByte()
    this.unicode = reader.readByte()
    this.ang = reader.readSmallInt()
    this.nItem = reader.readCardinal()
    this.nText = reader.readWord()
    reader.readSmallInt() // Reserved
    this.col = reader.readInteger()
    this.lineWidth = reader.readSmallInt()
    this.diamFlags = reader.readSmallInt()
    reader.readInteger() // Reserved
    reader.readByte() // Reserved
    reader.readByte() // Reserved
    reader.readSmallInt() // Reserved
    this.height = reader.readInteger()
    this.coordinates = new Array(this.nItem)

    reader.skip(4)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(
        reader.readInteger(),
        reader.readInteger()
      )
    }

    this.text = reader.readWideString(this.unicode, this.nText)
  }
}

class TObject11 extends BaseTObject {
  constructor(reader, objIndex) {
    super(reader, objIndex)

    this.sym = reader.readInteger()
    this.otp = reader.readByte()
    this.unicode = reader.readByte()
    this.ang = reader.readSmallInt()
    this.nItem = reader.readCardinal()
    this.nText = reader.readWord()
    this.mark = reader.readByte()
    this.snappingMark = reader.readByte()
    this.col = reader.readInteger()
    this.lineWidth = reader.readSmallInt()
    this.diamFlags = reader.readSmallInt()
    this.serverObjectId = reader.readInteger()
    this.height = reader.readInteger()
    this._date = reader.readDouble()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(
        reader.readInteger(),
        reader.readInteger()
      )
    }

    this.text = reader.readWideString(this.unicode, this.nText)
  }
}

class TObject12 extends BaseTObject {
  constructor(reader, objIndex) {
    super(reader, objIndex)

    this.sym = reader.readInteger()
    this.otp = reader.readByte()
    this.unicode = reader.readByte()
    this.ang = reader.readSmallInt()
    this.col = reader.readInteger()
    this.lineWidth = reader.readSmallInt()
    this.diamFlags = reader.readSmallInt()
    this.serverObjectId = reader.readInteger()
    this.height = reader.readInteger()
    this.creationDate = reader.readDouble()
    this.multirepresentationId = reader.readCardinal()
    this.modificationDate = reader.readDouble()
    this.nItem = reader.readCardinal()
    this.nText = reader.readWord()
    this.nObjectString = reader.readWord()
    this.nDatabaseString = reader.readWord()
    this.objectStringType = reader.readByte()
    this.res1 = reader.readByte()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(
        reader.readInteger(),
        reader.readInteger()
      )
    }

    this.text = reader.readWideString(this.unicode, this.nText)
    this.objectString = reader.readWideString(this.unicode, this.nObjectString)
    this.databaseString = reader.readWideString(
      this.unicode,
      this.nDatabaseString
    )
  }
}

module.exports = {
  10: TObject10,
  11: TObject11,
  12: TObject12,
  2018: TObject12,
}
