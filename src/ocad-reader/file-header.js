module.exports = class FileHeader {
  constructor(reader) {
    if (reader.buffer.length - reader.offset < 60) {
      throw new Error('Not an OCAD file (not large enough to hold header)')
    }

    this.ocadMark = reader.readSmallInt()
    this.fileType = reader.readByte()
    reader.readByte() // FileStatus, not used
    this.version = reader.readSmallInt()
    this.subVersion = reader.readByte()
    this.subSubVersion = reader.readByte()
    this.symbolIndexBlock = reader.readCardinal()
    this.objectIndexBlock = reader.readCardinal()
    this.offlineSyncSerial = reader.readInteger()
    this.currentFileVersion = reader.readInteger()
    reader.readCardinal() // Internal, not used
    reader.readCardinal() // Internal, not used
    this.stringIndexBlock = reader.readCardinal()
    this.fileNamePos = reader.readCardinal()
    this.fileNameSize = reader.readCardinal()
    reader.readCardinal() // Internal, not used
    reader.readCardinal() // Res1, not used
    reader.readCardinal() // Res2, not used
    this.mrStartBlockPosition = reader.readCardinal()
  }

  isValid() {
    return this.ocadMark === 0x0cad
  }
}
