const TdPoly = require('./td-poly')

/** @typedef {import('./buffer-reader')} BufferReader */
/** @typedef {import('./object-index').ObjectIndex} ObjectIndex */

class BaseTObject {
  /** @type {ObjectIndex} */
  objIndex
  /** @type {number} */
  objType
  /** @type {number} */
  sym
  /** @type {number} */
  otp
  /** @type {boolean} */
  unicode
  /** @type {number} */
  ang
  /** @type {number} */
  col
  /** @type {number} */
  lineWidth
  /** @type {number} */
  diamFlags
  /** @type {number} */
  serverObjectId
  /** @type {number} */
  height
  /** @type {number} */
  creationDate
  /** @type {number} */
  multirepresentationId
  /** @type {number} */
  modificationDate
  /** @type {number} */
  nItem
  /** @type {number} */
  nText
  /** @type {number} */
  nObjectString
  /** @type {number} */
  nDatabaseString
  /** @type {number} */
  objectStringType
  /** @type {number} */
  res1
  /** @type {string} */
  text
  /** @type {string|undefined} */
  objectString
  /** @type {string|undefined} */
  databaseString
  /** @type {TdPoly[]} */
  coordinates

  /**
   * @param {BufferReader} reader
   * @param {ObjectIndex} objIndex
   */
  constructor(reader, objIndex) {
    this.objIndex = objIndex
    this.objType = objIndex.objType
  }
}

/**
 * OCAD version 10 TObject structure.
 */
class TObject10 extends BaseTObject {
  /**
   * @param {BufferReader} reader
   * @param {ObjectIndex} objIndex
   */
  constructor(reader, objIndex) {
    super(reader, objIndex)

    this.sym = reader.readInteger()
    this.otp = reader.readByte()
    this.unicode = !!reader.readByte()
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

/**
 * OCAD version 11 TObject structure.
 */
class TObject11 extends BaseTObject {
  /**
   * @param {BufferReader} reader
   * @param {ObjectIndex} objIndex
   */
  constructor(reader, objIndex) {
    super(reader, objIndex)

    this.sym = reader.readInteger()
    this.otp = reader.readByte()
    this.unicode = !!reader.readByte()
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

/**
 * OCAD version 12 and 2018 TObject structure.
 */
class TObject12 extends BaseTObject {
  /**
   * @param {BufferReader} reader
   * @param {ObjectIndex} objIndex
   */
  constructor(reader, objIndex) {
    super(reader, objIndex)

    this.sym = reader.readInteger()
    this.otp = reader.readByte()
    this.unicode = !!reader.readByte()
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
  TObject: BaseTObject,
  10: TObject10,
  11: TObject11,
  12: TObject12,
  2018: TObject12,
}
