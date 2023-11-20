const getRgb = require('../cmyk-to-rgb')
const Crs = require('./crs')

/** @typedef {import('./file-header')} OcadHeader */
/** @typedef {import('./tobject')} TObject */
/** @typedef {import('./symbol').BaseSymbolDef} Symbol */
/** @typedef {import('./parameter-string')} ParameterString */
/** @typedef {import('./parameter-string').ParameterStringValues} ParameterStringValues */

/**
 * @typedef {Object} Color
 * @property {number} number
 * @property {number[]} cmyk
 * @property {string} name
 * @property {string} rgb
 * @property {number} renderOrder
 * @property {Uint8ClampedArray} rgbArray
 */

module.exports = class OcadFile {
  /**
   * @type {OcadHeader}
   */
  header
  /**
   * @type {Object.<number, ParameterStringValues[]>}
   */
  parameterStrings
  /**
   * @type {TObject[]}
   */
  objects
  /**
   * @type {Symbol[]}
   */
  symbols
  /**
   * @type {string[]}
   */
  warnings
  /**
   * @type {Color[]}
   */
  colors

  /**
   * @param {OcadHeader} header
   * @param {Object.<number, ParameterStringValues[]>} parameterStrings
   * @param {import('./object-index').TObject[]} objects
   * @param {Symbol[]} symbols
   * @param {string[]} warnings
   */
  constructor(header, parameterStrings, objects, symbols, warnings) {
    this.header = header
    this.parameterStrings = parameterStrings
    this.objects = objects
    this.symbols = symbols
    this.warnings = warnings

    this.colors = []
    const colorDefs = parameterStrings[9] || []
    for (let i = 0; i < colorDefs.length; i++) {
      const colorDef = colorDefs[i]
      const cmyk = [
        colorDef.c || 0,
        colorDef.m || 0,
        colorDef.y || 0,
        colorDef.k || 0,
      ].map(Number)
      // @ts-ignore
      const rgb = getRgb(cmyk)
      /**
       * @type {Color}
       */
      const color = {
        number: Number(colorDef.n),
        cmyk,
        name: colorDef._first,
        rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        renderOrder: i,
        rgbArray: rgb,
      }
      this.colors[Number(color.number)] = color
    }
  }

  getCrs() {
    const scalePar = this.parameterStrings['1039']
      ? this.parameterStrings['1039'][0]
      : { x: '0', y: '0', m: '1', _first: '', _pairs: [] }
    return new Crs(scalePar)
  }

  getBounds(projection = v => v) {
    const bounds = [
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
    ]

    for (const [[x1, y1], [x2, y2]] of this.objects.map(o =>
      Object.values(o.objIndex.rc).map(projection)
    )) {
      bounds[0] = Math.min(x1, x2, bounds[0])
      bounds[1] = Math.min(y1, y2, bounds[1])
      bounds[2] = Math.max(x1, x2, bounds[2])
      bounds[3] = Math.max(y1, y2, bounds[3])
    }

    return bounds
  }
}
