const InvalidObjectIndexBlockException = require('./invalid-object-index-block-exception')
const LRect = require('./lrect')
const TObject = require('./tobject')

module.exports = class ObjectIndex {
  constructor(reader, version) {
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
      }

      // console.log(i, this.table[i].pos, this.table[i].status)
    }
  }

  parseObjects(reader) {
    return this.table
      .filter(o => o.status === 1) // Remove deleted and hidden objects
      .map(o => this.parseObject(reader, o, o.objType))
      .filter(o => o)
  }

  parseObject(reader, objIndex, objType) {
    if (!objIndex.pos) return

    reader.push(objIndex.pos)
    const tObject = new TObject[this.version](reader, objType)
    reader.pop()
    return tObject
  }
}
