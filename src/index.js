const fs = require('fs')
const { Buffer } = require('buffer')

module.exports = async path => {
  if (Buffer.isBuffer(path)) {
    return parseOcadBuffer(path)
  } else {
    const buffer = await new Promise((resolve, reject) =>
      fs.readFile(path, (err, buffer) => {
        if (err) reject(err)

        resolve(buffer)
      }))
    return parseOcadBuffer(buffer)
  }
}

const parseOcadBuffer = async buffer => new Promise((resolve, reject) => {
  const header = new FileHeader(buffer)
  if (!header.isValid()) {
    reject(new Error(`Not an OCAD file (invalid header ${header.OcadMark} !== ${0x0cad})`))
  }

  resolve({})
})

class FileHeader {
  constructor (buffer, offset) {
    offset = offset || 0

    if (buffer.length - offset < 60) {
      throw new Error('Buffer is not large enough to hold header')
    }

    this.OcadMark = buffer.readInt16LE(offset)
  }

  isValid () {
    return this.OcadMark === 0x0cad
  }
}
