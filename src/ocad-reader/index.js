const fs = require('fs')
const { Buffer } = require('buffer')
const getRgb = require('../cmyk-to-rgb')

const FileHeader = require('./file-header')
const SymbolIndex = require('./symbol-index')
const ObjectIndex = require('./object-index')
const StringIndex = require('./string-index')
const Crs = require('./crs')
const BufferReader = require('./buffer-reader')
const InvalidObjectIndexBlockException = require('./invalid-object-index-block-exception')

module.exports = async (path, options) => {
  options = options || {}

  if (Buffer.isBuffer(path)) {
    return parseOcadBuffer(path, options)
  } else {
    const buffer = await new Promise((resolve, reject) =>
      fs.readFile(path, (err, buffer) => {
        if (err) reject(err)

        resolve(buffer)
      })
    )
    return parseOcadBuffer(buffer, options)
  }
}

function parseOcadBuffer(buffer, options) {
  let warnings = []

  const reader = new BufferReader(buffer)
  const header = new FileHeader(reader)
  if (!header.isValid()) {
    throw new Error(
      `Not an OCAD file (invalid header ${header.ocadMark} !== ${0x0cad})`
    )
  }

  if (header.version < 10 && !options.bypassVersionCheck) {
    throw new Error(
      `Unsupport OCAD file version (${header.version}), only >= 10 supported for now.`
    )
  }

  const symbols = []
  let symbolIndexOffset = header.symbolIndexBlock
  while (symbolIndexOffset) {
    reader.push(symbolIndexOffset)
    const symbolIndex = new SymbolIndex(reader, header.version, options)
    reader.pop()
    Array.prototype.push.apply(symbols, symbolIndex.parseSymbols(reader))
    warnings = warnings.concat(symbolIndex.warnings)

    symbolIndexOffset = symbolIndex.nextSymbolIndexBlock
  }

  const objects = []
  let objectIndexOffset = header.objectIndexBlock
  while (objectIndexOffset) {
    reader.push(objectIndexOffset)
    try {
      const objectIndex = new ObjectIndex(reader, header.version)
      reader.pop()
      Array.prototype.push.apply(objects, objectIndex.parseObjects(reader))

      objectIndexOffset = objectIndex.nextObjectIndexBlock
    } catch (e) {
      if (e instanceof InvalidObjectIndexBlockException) {
        warnings.push(e.toString())
      }
    }
  }

  const parameterStrings = {}
  let stringIndexOffset = header.stringIndexBlock
  while (stringIndexOffset) {
    reader.push(stringIndexOffset)
    const stringIndex = new StringIndex(reader)
    reader.pop()
    const strings = stringIndex.getStrings(reader)

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

  return new OcadFile(header, parameterStrings, objects, symbols, warnings)
}

class OcadFile {
  constructor(header, parameterStrings, objects, symbols, warnings) {
    this.header = header
    this.parameterStrings = parameterStrings
    this.objects = objects
    this.symbols = symbols
    this.warnings = warnings

    this.colors = parameterStrings[9]
      ? parameterStrings[9]
          .map((colorDef, i) => {
            const cmyk = [
              colorDef.c || 0,
              colorDef.m || 0,
              colorDef.y || 0,
              colorDef.k || 0,
            ].map(Number)
            const rgb = getRgb(cmyk)
            return {
              number: colorDef.n,
              cmyk: cmyk,
              name: colorDef._first,
              rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
              renderOrder: i,
              rgbArray: rgb,
            }
          })
          .reduce((a, c) => {
            a[c.number] = c
            return a
          }, [])
      : {}
  }

  getCrs() {
    const scalePar = this.parameterStrings['1039']
      ? this.parameterStrings['1039'][0]
      : { x: 0, y: 0, m: 1 }
    return new Crs(scalePar)
  }

  getBounds(projection = v => v) {
    const bounds = [
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
    ]
  
    for (const [[x1, y1], [x2, y2]] of this.objects
      .map(o => Object.values(o.objIndex.rc).map(projection))) {
      bounds[0] = Math.min(x1, x2, bounds[0])
      bounds[1] = Math.min(y1, y2, bounds[1])
      bounds[2] = Math.max(x1, x2, bounds[2])
      bounds[3] = Math.max(y1, y2, bounds[3])
    }
  
    return bounds
  }
  
}
