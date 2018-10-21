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
      _customer: this._customer,
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
      res1: this.res1
    }
  }
}

class TObject11 extends BaseTObject {
  constructor (buffer, offset, objType) {
    super(buffer, offset, objType)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this._customer = this.readByte()
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
  }
}

class TObject12 extends BaseTObject {
  constructor (buffer, offset, objType) {
    super(buffer, offset, objType)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this._customer = this.readByte()
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
  }
}

module.exports = {
  10: class TObject10 extends BaseTObject {
    constructor (buffer, offset, objType) {
      super(buffer, offset, objType)

      this.sym = this.readInteger()
      this.otp = this.readByte()
      this._customer = this.readByte()
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
    }
  },
  11: TObject11,
  12: TObject12
}
