const InvalidObjectIndexBlockException = require('./invalid-object-index-block-exception')
const LRect = require('./lrect')
const TObject = require('./tobject')

/**
 * @typedef {import('./tobject')} TObject
 */

/**
 * @typedef {import('./buffer-reader')} BufferReader
 */

/**
 * @typedef {Object} ObjectIndex
 * @property {LRect} rc
 * @property {number} pos
 * @property {number} len
 * @property {number} sym
 * @property {number} objType
 * @property {number} encryptedMode
 * @property {number} status
 * @property {number} viewType
 * @property {number} color
 * @property {number} group
 * @property {number} impLayer
 * @property {number} dbDatasetHash
 * @property {number} dbKeyHash
 * @property {number} _index
 */

/**
 * @typedef {Object} ObjectIndexBlock
 */
module.exports = class ObjectIndexBlock {
  /** @type {number} */
  version
  /** @type {number} */
  nextObjectIndexBlock
  /** @type {ObjectIndex[]} */
  table

  /**
   * @param {BufferReader} reader
   * @param {number} startIndex
   * @param {number} version
   */
  constructor(reader, startIndex, version) {
    this.version = version

    // Ignore pointers that do not point to a valid location in the file.
    // Compare getBlockCheckedRaw() in Open Orienteering Mapper.
    this.nextObjectIndexBlock = reader.readInteger()
    if (this.nextObjectIndexBlock > reader.buffer.length - (256 * 40 + 4)) {
      throw new InvalidObjectIndexBlockException(
        `Invalid object index block pointer ${this.nextObjectIndexBlock} > ${
          reader.buffer.length - (256 * 40 + 4)
        }.`
      )
    }

    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      const rc = new LRect(reader)

      this.table[i] = {
        rc,
        pos: reader.readInteger(),
        len: reader.readInteger(),
        sym: reader.readInteger(),
        objType: reader.readByte(),
        encryptedMode: reader.readByte(),
        status: reader.readByte(),
        viewType: reader.readByte(),
        color: reader.readSmallInt(),
        group: reader.readSmallInt(),
        impLayer: reader.readSmallInt(),
        dbDatasetHash: reader.readByte(),
        dbKeyHash: reader.readByte(),
        _index: startIndex + i,
      }
    }
  }

  /**
   * Reads the objects contained in this object index.
   * @param {BufferReader} reader
   * @returns {TObject[]}
   */
  readObjects(reader) {
    return this.table
      .filter(o => o.status > 0 && o.status < 3) // Remove deleted objects, keep normal and hidden objects.
      .map(o => this.readObject(reader, o))
      .filter(o => o)
  }

  readObject(reader, objIndex) {
    if (!objIndex.pos) return

    reader.push(objIndex.pos)
    const tObject = new TObject[this.version](reader, objIndex)
    reader.pop()
    return tObject
  }
}
