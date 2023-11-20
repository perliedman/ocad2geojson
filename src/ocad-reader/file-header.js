module.exports = class FileHeader {
  /**
   * @type {number}
   */
  ocadMark
  /**
   * @type {number}
   */
  fileType
  /**
   * @type {number}
   */
  version
  /**
   * @type {number}
   */
  subVersion
  /**
   * @type {number}
   */
  subSubVersion
  /**
   * @type {number}
   */
  symbolIndexBlock
  /**
   * @type {number}
   */
  objectIndexBlock
  /**
   * @type {number}
   */
  offlineSyncSerial
  /**
   * @type {number}
   */
  currentFileVersion
  /**
   * @type {number}
   */
  stringIndexBlock
  /**
   * @type {number}
   */
  fileNamePos
  /**
   * @type {number}
   */
  fileNameSize
  /**
   * @type {number}
   */
  mrStartBlockPosition

  /**
   * @param {import('./buffer-reader')} reader
   */
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

  /**
   * Tells if this is a valid OCAD file (magic number is correct).
   * @returns {boolean}
   */
  isValid() {
    return this.ocadMark === 0x0cad
  }
}
