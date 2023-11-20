/**
 * Encapsulates reading binary values for a buffer using the type names
 * used in the OCAD file format specification.
 *
 * The reader also supports pushing and popping the current offset like a stack,
 * which is useful when reading nested structures.
 *
 * @property {number} offset
 * @property {number[]} stack
 */
module.exports = class BufferReader {
  /**
   * @type {import('buffer').Buffer}
   */
  buffer
  /**
   * @type {number}
   */
  offset
  /**
   * @type {number[]}
   */
  stack

  /**
   * Constructs a new reader from the buffer, starting a the given offset.
   * @param {import('buffer').Buffer} buffer
   * @param {number} offset
   */
  constructor(buffer, offset = 0) {
    this.buffer = buffer
    this.offset = offset

    this.stack = []
  }

  readInteger() {
    const val = this.buffer.readInt32LE(this.offset)
    this.offset += 4
    return val
  }

  readCardinal() {
    const val = this.buffer.readUInt32LE(this.offset)
    this.offset += 4
    return val
  }

  readSmallInt() {
    const val = this.buffer.readInt16LE(this.offset)
    this.offset += 2
    return val
  }

  readByte() {
    const val = this.buffer.readInt8(this.offset)
    this.offset++
    return val
  }

  readWord() {
    const val = this.buffer.readUInt16LE(this.offset)
    this.offset += 2
    return val
  }

  readWordBool() {
    return !!this.readWord()
  }

  readDouble() {
    const val = this.buffer.readDoubleLE(this.offset)
    this.offset += 8
    return val
  }

  /**
   * Reads a OCAD "wide string" from the buffer. For some OCAD versions,
   * a wide string is a string of 16-bit characters, for others it is a
   * string of 32-bit characters; setting the unicode parameter to true
   * will read 16-bit characters.
   *
   * If the length parameter is not given, the length of the string is read
   * as the first byte from the buffer.
   *
   * @param {boolean} unicode Whether to read 16-bit or 32-bit characters
   * @param {number=} len The length of the string
   * @returns {string}
   */
  readWideString(unicode, len) {
    if (len == null) {
      len = this.readByte()
    }

    const textChars = []
    for (let i = 0; i < len * (unicode ? 2 : 4); i++) {
      const c = unicode ? this.readByte() : this.readWord()
      if (!c) continue
      if (c !== 13) {
        textChars.push(String.fromCharCode(c))
      }
    }

    return textChars.join('').trim()
  }

  /**
   * Returns the number of bytes read since the last push() call.
   * @returns {number}
   */
  getSize() {
    return this.offset - this.stack[this.stack.length - 1]
  }

  /**
   * Skips the given number of bytes.
   * @param {number} bytes
   */
  skip(bytes) {
    this.offset += bytes
  }

  /**
   * Pushes the current offset onto the stack and sets the offset to the given
   * value.
   * @param {number} offset
   */
  push(offset) {
    this.stack.push(this.offset)
    this.offset = offset
  }

  /**
   * Pops the current offset from the stack.
   */
  pop() {
    const nextOffset = this.stack.pop()
    if (nextOffset == null) throw new Error('Stack underflow')
    this.offset = nextOffset
  }
}
