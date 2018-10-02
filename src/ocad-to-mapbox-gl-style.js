module.exports = function ocadToMapboxGlStyle(ocadFile, options) {
  const usedSymbols = ocadFile.objects.reduce((a, f) => {
    const symbolId = f.sym
    if (!a.idSet.has(symbolId)) {
      a.symbolIds.push(symbolId)
      a.idSet.add(symbolId)
    }

    return a
  }, { symbolIds: [], idSet: new Set() }).symbolIds

  return usedSymbols
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)
    .map(symbol => symbolToMapboxLayer(symbol, ocadFile.colors, options))
}

const symbolToMapboxLayer = (symbol, colors, options) => {
  switch (symbol.type) {
    case 2:
      return {
        id: `symbol-${symbol.symNum}`,
        source: options.source,
        type: 'line',
        filter: ['==', ['get', 'sym'], symbol.symNum],
        paint: {
          'line-color': colors[symbol.colors[symbol.lineColor]].rgb,
          'line-width': {
            'type': 'exponential',
            'base': 2,
            'stops': [
              [0, (symbol.lineWidth || 1) * Math.pow(2, (0 - 15))],
              [24, (symbol.lineWidth || 1) * Math.pow(2, (24 - 15))]
            ]
          }
        }
      }
    case 3:
      return {
        id: `symbol-${symbol.symNum}`,
        source: options.source,
        type: 'fill',
        filter: ['==', ['get', 'sym'], symbol.symNum],
        paint: {
          'fill-color': colors[symbol.colors[symbol.fillColor]].rgb
        }
      }
  }
}