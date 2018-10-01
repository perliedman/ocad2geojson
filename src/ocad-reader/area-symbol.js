const Symbol = require('./symbol')

module.exports = class AreaSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
  }

  toMapboxLayer (colors, options) {
    return {
      id: `symbol-${this.symNum}`,
      source: options.source,
      type: 'fill',
      filter: ['==', ['get', 'sym'], this.symNum],
      paint: {
        'fill-color': colors[this.colors[this.fillColor]].rgb
      }
    }
  }
}
