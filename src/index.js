const fs = require('fs')
const { Buffer } = require('buffer')
const { coordEach } = require('@turf/meta')

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

  resolve({
    header,
    parameterStrings,
    featureCollection
  })
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

class Block {
  constructor (buffer, offset) {
    this.buffer = buffer
    this.offset = offset || 0
  }

  readInteger () {
    const val = this.buffer.readInt32LE(this.offset)
    this.offset += 4
    return val
  }

  readCardinal () {
    const val = this.buffer.readUInt32LE(this.offset)
    this.offset += 4
    return val
  }

  readSmallInt () {
    const val = this.buffer.readInt16LE(this.offset)
    this.offset += 2
    return val
  }

  readByte () {
    const val = this.buffer.readInt8(this.offset)
    this.offset++
    return val
  }

  readWord () {
    const val = this.buffer.readUInt16LE(this.offset)
    this.offset += 2
    return val
  }

  readWordBool () {
    return !!this.readWord()
  }

  readDouble () {
    const val = this.buffer.readDoubleLE(this.offset)
    this.offset += 8
    return val
  }
}

class FileHeader extends Block {
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

class ObjectIndex extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.nextObjectIndexBlock = this.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      const rc = new LRect(buffer, this.offset)
      this.offset += rc.size()

      this.table[i] = {
        rc,
        pos: this.readInteger(),
        len: this.readInteger(),
        sym: this.readInteger(),
        objType: this.readByte(),
        encryptedMode: this.readByte(),
        status: this.readByte(),
        viewType: this.readByte(),
        color: this.readSmallInt(),
        group: this.readSmallInt(),
        impLayer: this.readSmallInt(),
        dbDatasetHash: this.readByte(),
        dbKeyHash: this.readByte()
      }
    }
  }

  parseObjects () {
    return this.table
      .map(o => this.parseObject(o))
      .filter(o => o)
  }

  parseObject (objIndex) {
    if (!objIndex.pos) return

    const object = new TObject(this.buffer, objIndex.pos)

    var geometry
    switch (objIndex.objType) {
      case 1:
        geometry = {
          type: 'Point',
          coordinates: object.coordinates[0]
        }
        break
      case 2:
        geometry = {
          type: 'LineString',
          coordinates: object.coordinates
        }
        break
      case 3:
        const rings = []
        let currentRing = []
        rings.push(currentRing)
        for (let i = 0; i < object.coordinates.length; i++) {
          const c = object.coordinates[i]
          if (c.isFirstHolePoint()) {
            // Copy first coordinate
            currentRing.push(currentRing[0].slice())
            currentRing = []
            rings.push(currentRing)
          }

          currentRing.push(c)
        }

        // Copy first coordinate
        currentRing.push(currentRing[0].slice())

        geometry = {
          type: 'Polygon',
          coordinates: rings
        }
        break
      default:
        return null
    }

    return {
      type: 'Feature',
      properties: object.getProperties(),
      geometry
    }
  }
}

class LRect extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)
    this.min = {
      x: this.readInteger(),
      y: this.readInteger()
    }
    this.max = {
      x: this.readInteger(),
      y: this.readInteger()
    }
  }

  size () {
    return 16
  }
}

class TObject extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this._customer = this.readByte()
    this.ang = this.readSmallInt()
    this.col = this.readInteger()
    this.lineWidth = this.readSmallInt()
    this.diamFlags = this.readSmallInt()
    this.serverObjectId = this.readInteger()
    this.height = this.readInteger()
    this.creationDate = this.readDouble()
    this.multirepresentationId = this.readCardinal()
    this.modificationDate = this.readDouble()
    this.nItem = this.readCardinal()
    this.nText = this.readWord()
    this.nObjectString = this.readWord()
    this.nDatabaseString = this.readWord()
    this.objectStringType = this.readByte()
    this.res1 = this.readByte()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
    }
  }

  getProperties () {
    return {
      sym: this.sym,
      otp: this.otp,
      _customer: this._customer,
      ang: this.ang,
      col: this.col,
      lineWidth: this.lineWidth,
      diamFlags: this.diamFlags,
      serverObjectId: this.serverObjectId,
      height: this.height,
      creationDate: this.creationDate,
      multirepresentationId: this.multirepresentationId,
      modificationDate: this.modificationDate,
      nItem: this.nItem,
      nText: this.nText,
      nObjectString: this.nObjectString,
      nDatabaseString: this.nDatabaseString,
      objectStringType: this.objectStringType,
      res1: this.res1
    }
  }
}

class StringIndex extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.nextStringIndexBlock = this.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      this.table[i] = {
        pos: this.readInteger(),
        len: this.readInteger(),
        recType: this.readInteger(),
        objIndex: this.readInteger()
      }
    }
  }

  getStrings () {
    const strings = this.table
      .filter(si => si.recType > 0)
      .map(si => new ParameterString(this.buffer, si.pos, si))
    return strings.reduce((pss, ps) => {
      let typeStrings = pss[ps.recType]
      if (!typeStrings) {
        pss[ps.recType] = typeStrings = []
      }

      typeStrings.push(ps)

      return pss
    }, {})
  }
}

class TdPoly extends Array {
  constructor (ocadX, ocadY) {
    super(ocadX >> 8, ocadY >> 8)
    this.xFlags = ocadX & 0xff
    this.yFlags = ocadY & 0xff
  }

  isFirstBezier () {
    return this.xFlags & 0x01
  }

  isSecondBezier () {
    return this.xFlags & 0x02
  }

  hasNoLeftLine () {
    return this.xFlags & 0x04
  }

  isBorderOrVirtualLine () {
    return this.xFlags & 0x08
  }

  isCornerPoint () {
    return this.yFlags & 0x01
  }

  isFirstHolePoint () {
    return this.yFlags & 0x02
  }

  hasNoRightLine () {
    return this.yFlags & 0x04
  }

  isDashPoint () {
    return this.yFlags & 0x08
  }
}

class ParameterString extends Block {
  constructor (buffer, offset, indexRecord) {
    super(buffer, offset)

    this.recType = indexRecord.recType

    let val = ''
    let nextByte = 0
    for (let i = 0; i < indexRecord.len && (nextByte = this.readByte()); i++) {
      val += String.fromCharCode(nextByte)
    }

    const vals = val.split('\t')
    this.first = vals[0]
    this.values = {}
    for (let i = 1; i < vals.length; i++) {
      this.values[vals[i][0]] = vals[i].substring(1)
    }
  }
}
