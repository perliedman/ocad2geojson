const fs = require('fs')
const { Buffer } = require('buffer')
const getRgb = require('../cmyk-to-rgb')

const FileHeader = require('./file-header')
const SymbolIndex = require('./symbol-index')
const ObjectIndex = require('./object-index')
const StringIndex = require('./string-index')

module.exports = async (path, options) => {
  options = options || {}

  if (Buffer.isBuffer(path)) {
    return parseOcadBuffer(path, options)
  } else {
    const buffer = await new Promise((resolve, reject) =>
      fs.readFile(path, (err, buffer) => {
        if (err) reject(err)

        resolve(buffer)
      }))
    return parseOcadBuffer(buffer, options)
  }
}

const parseOcadBuffer = async (buffer, options) => new Promise((resolve, reject) => {
  const header = new FileHeader(buffer)
  if (!header.isValid()) {
    reject(new Error(`Not an OCAD file (invalid header ${header.ocadMark} !== ${0x0cad})`))
  }

  if (header.version < 10 && !options.bypassVersionCheck) {
    throw new Error(`Unsupport OCAD file version (${header.version}), only >= 10 supported for now.`)
  }

  let symbols = []
  let symbolIndexOffset = header.symbolIndexBlock
  while (symbolIndexOffset) {
    let symbolIndex = new SymbolIndex(buffer, symbolIndexOffset, header.version)
    Array.prototype.push.apply(symbols, symbolIndex.parseSymbols())

    symbolIndexOffset = symbolIndex.nextObjectIndexBlock
  }

  let objects = []
  let objectIndexOffset = header.objectIndexBlock
  while (objectIndexOffset) {
    let objectIndex = new ObjectIndex(buffer, objectIndexOffset, header.version)
    Array.prototype.push.apply(objects, objectIndex.parseObjects())

    objectIndexOffset = objectIndex.nextObjectIndexBlock
  }

  let parameterStrings = {}
  let stringIndexOffset = header.stringIndexBlock
  while (stringIndexOffset) {
    let stringIndex = new StringIndex(buffer, stringIndexOffset)
    const strings = stringIndex.getStrings()

    Object.keys(strings).reduce((a, recType) => {
      const typeStrings = strings[recType]
      let concatStrings = a[recType] || []
      a[recType] = concatStrings.concat(typeStrings.map(s => s.values))
      return a
    }, parameterStrings)

    stringIndexOffset = stringIndex.nextStringIndexBlock
  }

  resolve(new OcadFile(
    header,
    parameterStrings,
    objects,
    symbols
  ))
})

class OcadFile {
  constructor (header, parameterStrings, objects, symbols) {
    this.header = header
    this.parameterStrings = parameterStrings
    this.objects = objects
    this.symbols = symbols

    this.colors = parameterStrings[9].map((colorDef, i) => {
      const cmyk = [colorDef.c, colorDef.m, colorDef.y, colorDef.k].map(Number)
      return {
        number: colorDef.n,
        cmyk: cmyk,
        name: colorDef._first,
        rgb: getRgb(cmyk),
        renderOrder: i
      }
    })
      .reduce((a, c) => {
        a[c.number] = c
        return a
      }, [])
  }

  getCrs () {
    const scalePar = this.parameterStrings['1039']
      ? this.parameterStrings['1039'][0]
      : { x: 0, y: 0, m: 1 }
    let { x, y, m } = scalePar

    x = Number(x)
    y = Number(y)
    m = Number(m)

    return {
      easting: x,
      northing: y,
      scale: m
    }
  }
}
