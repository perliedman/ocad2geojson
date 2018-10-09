module.exports = function ocadToMapboxGlStyle (ocadFile, options) {
  return usedSymbols(ocadFile)
    .symbolNums
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)
    .map(symbol => symbolToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l)
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
    case 1:
      const element = symbol.elements[0]

      switch (element.type) {
        case 3:
        case 4:
          const baseRadius = (element.diameter / 10) || 1
          return {
            id: `symbol-${symbol.symNum}`,
            source: options.source,
            type: 'circle',
            filter: ['==', ['get', 'sym'], symbol.symNum],
            paint: {
              'circle-color': colors[symbol.colors[element.color]].rgb,
              'circle-radius': {
                'type': 'exponential',
                'base': 2,
                'stops': [
                  [0, baseRadius * Math.pow(2, (0 - 16))],
                  [24, baseRadius * Math.pow(2, (24 - 16))]
                ]
              }
            },
            metadata: {
              sort: colors[symbol.colors[element.color]].renderOrder
            }
          }
      }

      break
    case 2:
      // TODO: figure out why width ended up in secDSize; should not be so
      const baseWidth = (symbol.secDSize / 10) || 1

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
              [0, baseWidth * Math.pow(2, (0 - 16))],
              [24, baseWidth * Math.pow(2, (24 - 16))]
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
