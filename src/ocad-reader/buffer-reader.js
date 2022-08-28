module.exports = class BufferReader {
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

  getSize() {
    return this.offset - this.stack[this.stack.length - 1]
  }

  skip(bytes) {
    this.offset += bytes
  }

  push(offset) {
    this.stack.push(this.offset)
    this.offset = offset
  }

  pop() {
    this.offset = this.stack.pop()
  }
}
