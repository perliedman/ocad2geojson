module.exports = function ocadToMapboxGlStyle (ocadFile, options) {
  const usedSymbols = usedSymbolNumbers(ocadFile)
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)

  const symbolLayers = usedSymbols
    .map(symbol => symbolToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l)

  const elementLayers = usedSymbols
    .map(symbol => symbolElementsToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l)

  return symbolLayers.concat(elementLayers)
    .sort((a, b) => b.metadata.sort - a.metadata.sort)
}

const usedSymbolNumbers = ocadFile => ocadFile.objects.reduce((a, f) => {
  const symbolNum = f.sym
  if (!a.idSet.has(symbolNum)) {
    a.symbolNums.push(symbolNum)
    a.idSet.add(symbolNum)
  }

  return a
}, { symbolNums: [], idSet: new Set() }).symbolNums

const symbolToMapboxLayer = (symbol, colors, options) => {
  const filter = ['==', ['get', 'sym'], symbol.symNum]

  switch (symbol.type) {
    case 1:
      const element = symbol.elements[0]

      switch (element.type) {
        case 3:
        case 4:
          return circleLayer(`symbol-${symbol.symNum}`, options.source, options.sourceLayer, filter, element, colors)
      }

      break
    case 2:
      if (!symbol.lineWidth) return
      const baseWidth = (symbol.lineWidth / 10)
      const baseMainLength = symbol.mainLength / (10 * baseWidth)
      const baseMainGap = symbol.mainGap / (10 * baseWidth)

      const layer = {
        id: `symbol-${symbol.symNum}`,
        source: options.source,
        'source-layer': options.sourceLayer,
        type: 'line',
        filter: ['==', ['get', 'sym'], symbol.symNum],
        paint: {
          'line-color': colors[symbol.lineColor].rgb,
          'line-width': expFunc(baseWidth)
        },
        metadata: {
          sort: colors[symbol.lineColor].renderOrder
        }
      }

      if (baseMainLength && baseMainGap) {
        layer.paint['line-dasharray'] = [baseMainLength, baseMainGap]
      }

      return layer
    case 3:
      const fillColorIndex = symbol.fillOn ? symbol.fillColor : symbol.colors[0]
      return {
        id: `symbol-${symbol.symNum}`,
        source: options.source,
        'source-layer': options.sourceLayer,
        type: 'fill',
        filter: ['==', ['get', 'sym'], symbol.symNum],
        paint: {
          'fill-color': colors[fillColorIndex].rgb,
          'fill-opacity': symbol.fillOn ? 1 : (symbol.hatchLineWidth / symbol.hatchDist) || 0.5 // TODO: not even close, but emulates hatch/patterns
        },
        metadata: {
          sort: colors[fillColorIndex].renderOrder
        }
      }
  }
}

const symbolElementsToMapboxLayer = (symbol, colors, options) => {
  switch (symbol.type) {
    case 2:
      if (symbol.primSymElements.length > 0 && symbol.primSymElements[0].type >= 3) {
        return circleLayer(
          `symbol-${symbol.symNum}-prim`,
          options.source,
          options.sourceLayer,
          ['==', ['get', 'element'], `${symbol.symNum}-prim`],
          symbol.primSymElements[0], colors)
      }
  }
}

const circleLayer = (id, source, sourceLayer, filter, element, colors) => {
  const baseRadius = (element.diameter / 10) || 1
  const layer = {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'circle',
    filter,
    paint: {
      'circle-radius': expFunc(baseRadius)
    },
    metadata: {
      sort: colors[element.color].renderOrder
    }
  }

  const color = colors[element.color].rgb
  if (element.type === 3) {
    const baseWidth = element.lineWidth / 10
    layer.paint['circle-opacity'] = 0
    layer.paint['circle-stroke-color'] = color
    layer.paint['circle-stroke-width'] = expFunc(baseWidth)
  } else {
    layer.paint['circle-color'] = color
  }

  return layer
}

const expFunc = base => ({
  'type': 'exponential',
  'base': 2,
  'stops': [
    [0, base * Math.pow(2, (0 - 16))],
    [24, base * Math.pow(2, (24 - 16))]
  ]
})
