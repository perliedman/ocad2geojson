const Block = require('./block')
const LRect = require('./lrect')
const TObject = require('./tobject')

module.exports = class ObjectIndex extends Block {
  constructor(buffer, offset, version) {
    super(buffer, offset)

    this.version = version
    this.nextObjectIndexBlock = this.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      const rc = new LRect(buffer, this.offset)
      this.offset += rc.size()

      this.table[i] = {
        rc,
        pos: this.readInteger(),
        len: this.readInteger(),
        sym: this.readInteger(),
        objType: this.readByte(),
        encryptedMode: this.readByte(),
        status: this.readByte(),
        viewType: this.readByte(),
        color: this.readSmallInt(),
        group: this.readSmallInt(),
        impLayer: this.readSmallInt(),
        dbDatasetHash: this.readByte(),
        dbKeyHash: this.readByte(),
      }
    }
  }

  parseObjects() {
    return this.table
      .filter(o => o.status === 1) // Remove deleted and hidden objects
      .map(o => this.parseObject(o, o.objType))
      .filter(o => o)
  }

  parseObject(objIndex, objType) {
    if (!objIndex.pos) return

    return new TObject[this.version](this.buffer, objIndex.pos, objType)
  }
}
