const fs = require('fs')
const { Buffer } = require('buffer')
const { coordEach } = require('@turf/meta')
const Color = require('color')

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

  let symbols = []
  let symbolIndexOffset = header.symbolIndexBlock
  while (symbolIndexOffset) {
    let symbolIndex = new SymbolIndex(buffer, symbolIndexOffset)
    Array.prototype.push.apply(symbols, symbolIndex.parseSymbols())

    symbolIndexOffset = symbolIndex.nextObjectIndexBlock
  }

  let objects = []
  let objectIndexOffset = header.objectIndexBlock
  while (objectIndexOffset) {
    let objectIndex = new ObjectIndex(buffer, objectIndexOffset)
    Array.prototype.push.apply(objects, objectIndex.parseObjects())

    objectIndexOffset = objectIndex.nextObjectIndexBlock
  }

  if (options.assignIds || options.assignIds === undefined) {
    objects.forEach((o, i) => {
      o.id = i + 1
    })
  }

  let featureCollection = {
    type: 'FeatureCollection',
    features: objects
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

  if (parameterStrings['1039'] && (options.applyCrs || options.applyCrs === undefined)) {
    applyCrs(featureCollection, parameterStrings['1039'][0])
  }

  resolve(new OcadFile(
    header,
    parameterStrings,
    featureCollection,
    symbols
  ))
})

const applyCrs = (featureCollection, scalePar) => {
  // OCAD uses 1/100 mm of "paper coordinates" as units, we
  // want to convert to meters in real world
  const hundredsMmToMeter = 1 / (100 * 1000)
  let { x, y, m } = scalePar

  // Easting (meters)
  x = Number(x)
  // Northing (meters)
  y = Number(y)
  // Map scale
  m = Number(m)

  coordEach(featureCollection, coord => {
    coord[0] = (coord[0] * hundredsMmToMeter) * m + x
    coord[1] = (coord[1] * hundredsMmToMeter) * m + y
  })
}

class OcadFile {
  constructor (header, parameterStrings, featureCollection, symbols) {
    this.header = header
    this.parameterStrings = parameterStrings
    this.featureCollection = featureCollection
    this.symbols = symbols

    this.colors = parameterStrings[9].map(colorDef => {
      const cmyk = [colorDef.c, colorDef.m, colorDef.y, colorDef.k].map(Number)
      return {
        number: colorDef.n,
        cmyk: cmyk,
        name: colorDef._first,
        rgb: Color.cmyk(cmyk).rgb().string()
      }
    })
      .reduce((a, c) => {
        a[c.number] = c
        return a
      }, [])
  }

  getMapboxStyleLayers (options) {
    const usedSymbols = this.featureCollection.features.reduce((a, f) => {
      const symbolId = f.properties.sym
      if (!a.idSet.has(symbolId)) {
        a.symbolIds.push(symbolId)
        a.idSet.add(symbolId)
      }

      return a
    }, { symbolIds: [], idSet: new Set() }).symbolIds

    return usedSymbols
      .map(symNum => this.symbols.find(s => symNum === s.symNum))
      .filter(s => s)
      .map(symbol => symbol.toMapboxLayer(this.colors, options))
  }
}
