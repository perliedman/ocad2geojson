module.exports = function ocadToMapboxGlStyle (ocadFile, options) {
  return usedSymbols(ocadFile)
    .symbolNums
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)
    .map(symbol => symbolToMapboxLayer(symbol, ocadFile.colors, options))
    .sort((a, b) => b.metadata.sort - a.metadata.sort)
}

const usedSymbols = ocadFile => ocadFile.objects.reduce((a, f) => {
  const symbolNum = f.sym
  if (!a.idSet.has(symbolNum)) {
    a.symbolNums.push(symbolNum)
    a.idSet.add(symbolNum)
  }

  return a
}, { symbolNums: [], idSet: new Set() })

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
        },
        metadata: {
          sort: colors[symbol.colors[symbol.lineColor]].renderOrder
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
        },
        metadata: {
          sort: colors[symbol.colors[symbol.fillColor]].renderOrder
        }
      }
  }
}
