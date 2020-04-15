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
  let warnings = []

  const header = new FileHeader(buffer, 0)
  if (!header.isValid()) {
    throw new Error(`Not an OCAD file (invalid header ${header.ocadMark} !== ${0x0cad})`)
  }

  if (header.version < 10 && !options.bypassVersionCheck) {
    throw new Error(`Unsupport OCAD file version (${header.version}), only >= 10 supported for now.`)
  }

  const symbols = []
  let symbolIndexOffset = header.symbolIndexBlock
  while (symbolIndexOffset) {
    const symbolIndex = new SymbolIndex(buffer, symbolIndexOffset, header.version, options)
    Array.prototype.push.apply(symbols, symbolIndex.parseSymbols())
    warnings = warnings.concat(symbolIndex.warnings)

    symbolIndexOffset = symbolIndex.nextSymbolIndexBlock
  }

  const objects = []
  let objectIndexOffset = header.objectIndexBlock
  while (objectIndexOffset) {
    const objectIndex = new ObjectIndex(buffer, objectIndexOffset, header.version)
    Array.prototype.push.apply(objects, objectIndex.parseObjects())

    objectIndexOffset = objectIndex.nextObjectIndexBlock
  }

  const parameterStrings = {}
  let stringIndexOffset = header.stringIndexBlock
  while (stringIndexOffset) {
    const stringIndex = new StringIndex(buffer, stringIndexOffset)
    const strings = stringIndex.getStrings()

    Object.keys(strings).reduce((a, recType) => {
      const typeStrings = strings[recType]
      const concatStrings = a[recType] || []
      a[recType] = concatStrings.concat(typeStrings.map(s => s.values))
      return a
    }, parameterStrings)

    stringIndexOffset = stringIndex.nextStringIndexBlock
  }

  if (!options.quietWarnings) {
    warnings.forEach(w => console.warn(w))
  }

  resolve(new OcadFile(
    header,
    parameterStrings,
    objects,
    symbols,
    warnings
  ))
})

class OcadFile {
  constructor (header, parameterStrings, objects, symbols, warnings) {
    this.header = header
    this.parameterStrings = parameterStrings
    this.objects = objects
    this.symbols = symbols
    this.warnings = warnings

    this.colors = parameterStrings[9]
      .map((colorDef, i) => {
        const cmyk = [colorDef.c || 0, colorDef.m || 0, colorDef.y || 0, colorDef.k || 0].map(Number)
        const rgb = getRgb(cmyk)
        return {
          number: colorDef.n,
          cmyk: cmyk,
          name: colorDef._first,
          rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          renderOrder: i,
          rgbArray: rgb
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
