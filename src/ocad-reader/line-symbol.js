const Symbol = require('./symbol')

module.exports = class LineSymbol extends Symbol {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.lineColor = this.readSmallInt()
    this.lineWidth = this.readSmallInt()
    this.lineStyle = this.readSmallInt()
  }

  toMapboxLayer (colors, options) {
    return {
      id: `symbol-${this.symNum}`,
      source: options.source,
      type: 'line',
      filter: ['==', ['get', 'sym'], this.symNum],
      paint: {
        'line-color': colors[this.colors[this.lineColor]].rgb,
        'line-width': {
          'type': 'exponential',
          'base': 2,
          'stops': [
            [0, (this.lineWidth || 1) * Math.pow(2, (0 - 15))],
            [24, (this.lineWidth || 1) * Math.pow(2, (24 - 15))]
          ]
        }
      }
    }
  }
}
