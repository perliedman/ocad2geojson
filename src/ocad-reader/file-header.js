const Block = require('./block')

module.exports = class FileHeader extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    if (buffer.length - offset < 60) {
      throw new Error('Buffer is not large enough to hold header')
    }

    this.ocadMark = this.readSmallInt()
    this.fileType = this.readByte()
    this.readByte() // FileStatus, not used
    this.version = this.readSmallInt()
    this.subVersion = this.readByte()
    this.subSubVersion = this.readByte()
    this.symbolIndexBlock = this.readCardinal()
    this.objectIndexBlock = this.readCardinal()
    this.offlineSyncSerial = this.readInteger()
    this.currentFileVersion = this.readInteger()
    this.readCardinal() // Internal, not used
    this.readCardinal() // Internal, not used
    this.stringIndexBlock = this.readCardinal()
    this.fileNamePos = this.readCardinal()
    this.fileNameSize = this.readCardinal()
    this.readCardinal() // Internal, not used
    this.readCardinal() // Res1, not used
    this.readCardinal() // Res2, not used
    this.mrStartBlockPosition = this.readCardinal()
  }

  isValid () {
    return this.ocadMark === 0x0cad
  }
}
