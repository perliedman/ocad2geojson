const getRgb = require('../cmyk-to-rgb')
const Crs = require('./crs')

module.exports = class OcadFile {
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
              cmyk,
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
