const Block = require('./block')
const LRect = require('./lrect')
const TObject = require('./tobject')

module.exports = class ObjectIndex extends Block {
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
