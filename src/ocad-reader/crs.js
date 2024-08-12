const crsGrids = require('./crs-grids')
const TdPoly = require('./td-poly')

// OCAD uses 1/100 mm of "paper coordinates" as units, we
// want to convert to meters in real world
const hundredsMmToMeter = 1 / (100 * 1000)

module.exports = class Crs {
  /**
   * @type {number}
   */
  easting
  /**
   * @type {number}
   **/
  northing
  /**
   * @type {number}
   **/
  scale
  /**
   * @type {number}
   **/
  gridId
  /**
   * @type {number}
   * @description Grivation in radians
   **/
  grivation
  /**
   * @type {number}
   */
  code
  /**
   * @type {string}
   */
  catalog
  /**
   * @type {string}
   **/
  name

  /**
   * @param {import('./parameter-string').ParameterStringValues} scalePar
   */
  constructor(scalePar) {
    const {
      x: easting,
      y: northing,
      m: scale,
      i: gridId,
      a: grivation,
    } = scalePar

    this.easting = Number(easting)
    this.northing = Number(northing)
    this.scale = Number(scale)
    this.gridId = Number(gridId)
    this.grivation = (Number(grivation) / 180) * Math.PI

    this.grid = crsGrids.find(g => g[0] === this.gridId)
    const [, code, catalog, name] = this.grid || [this.gridId, 0, null, null]
    this.code = code
    this.catalog = catalog
    this.name = name
  }

  /**
   * Converts an OCAD map coordinate (paper coordinates) to
   * a coordinate in this CRS.
   * @param {TdPoly|number[]} coord
   * @returns {TdPoly|number[]} the projected coordinate;
   * if the input is a TdPoly, the output is a TdPoly instance, otherwise just a coordinate array
   */
  toProjectedCoord(coord) {
    coord = rotate(coord, -this.grivation)

    const projected = [
      coord[0] * hundredsMmToMeter * this.scale + this.easting,
      coord[1] * hundredsMmToMeter * this.scale + this.northing,
    ]
    return coord instanceof TdPoly
      ? new TdPoly(projected[0], projected[1], coord.xFlags, coord.yFlags)
      : projected
  }

  /**
   * Converts a coordinate in this CRS to an OCAD map coordinate (paper coordinates).
   * @param {TdPoly|number[]} coord
   * @returns {TdPoly|number[]} the map coordinate;
   * if the input is a TdPoly, the output is a TdPoly instance, otherwise just a coordinate array
   */
  toMapCoord(coord) {
    const map = [
      (coord[0] - this.easting) / hundredsMmToMeter / this.scale,
      (coord[1] - this.northing) / hundredsMmToMeter / this.scale,
    ]
    coord = rotate(coord, this.grivation)
    return coord instanceof TdPoly
      ? new TdPoly(map[0], map[1], coord.xFlags, coord.yFlags)
      : map
  }
}

/**
 * Rotates a coordinate around the origin.
 *
 * @param {number[]|TdPoly} c the coordinate to rotate
 * @param {number} theta rotation angle in radians
 * @returns {number[]|TdPoly} the rotated coordinate;
 * if the input is a TdPoly, the output is a TdPoly instance, otherwise just a coordinate array
 */
function rotate(c, theta) {
  if (c instanceof TdPoly) {
    return c.rotate(theta)
  } else {
    return [
      c[0] * Math.cos(theta) - c[1] * Math.sin(theta),
      c[0] * Math.sin(theta) + c[1] * Math.cos(theta),
    ]
  }
}
