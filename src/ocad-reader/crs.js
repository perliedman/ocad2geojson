const crsGrids = require('./crs-grids')

module.exports = class Crs {
  constructor(scalePar) {
    const { x: easting, y: northing, m: scale, i: gridId } = scalePar

    this.easting = Number(easting)
    this.northing = Number(northing)
    this.scale = Number(scale)
    this.gridId = Number(gridId)

    this.grid = crsGrids.find(g => g[0] === this.gridId)
    const [, code, catalog, name] = this.grid || [this.gridId, 0, null, null]
    this.code = code
    this.catalog = catalog
    this.name = name
  }
}
