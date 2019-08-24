const { PointSymbolType, LineSymbolType, AreaSymbolType, TextSymbolType } = require('./ocad-reader/symbol-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')
const { HorizontalAlignCenter, HorizontalAlignRight, VerticalAlignBottom, VerticalAlignMiddle, VerticalAlignTop } = require('./ocad-reader/text-symbol')

module.exports = function ocadToMapboxGlStyle (ocadFile, options) {
  const usedSymbols = usedSymbolNumbers(ocadFile)
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)

  const symbolLayers = usedSymbols
    .map(symbol => symbolToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l)

  const elementLayers = Array.prototype.concat.apply([], usedSymbols
    .map(symbol => symbolElementsToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l))

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
  const id = `symbol-${symbol.symNum}`
  const filter = ['==', ['get', 'sym'], symbol.symNum]
  let layerFactory

  switch (symbol.type) {
    case LineSymbolType:
      layerFactory = symbol.lineWidth && lineLayer
      break
    case AreaSymbolType:
      layerFactory = areaLayer
      break
    case TextSymbolType:
      layerFactory = textLayer
      break
  }

  return layerFactory && layerFactory(id, options.source, options.sourceLayer, filter, symbol, colors)
}

const symbolElementsToMapboxLayer = (symbol, colors, options) => {
  var elements = []
  var name
  switch (symbol.type) {
    case PointSymbolType:
      elements = symbol.elements
      name = 'element'
      break
    case LineSymbolType:
      elements = symbol.primSymElements
      name = 'prim'
      break
  }

  return elements
    .map((e, i) => createElementLayer(e, name, i, symbol, colors, options))
    .filter(l => l)
}

const createElementLayer = (element, name, index, symbol, colors, options) => {
  const id = `symbol-${symbol.symNum}-${name}-${index}`
  const filter = ['==', ['get', 'element'], `${symbol.symNum}-${name}-${index}`]

  switch (element.type) {
    case LineElementType:
      return lineLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
    case AreaElementType:
      return areaLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
    case CircleElementType:
    case DotElementType:
      return circleLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
  }
}

const lineLayer = (id, source, sourceLayer, filter, lineDef, colors) => {
  const baseWidth = (lineDef.lineWidth / 10)
  const baseMainLength = lineDef.mainLength / (10 * baseWidth)
  const baseMainGap = lineDef.mainGap / (10 * baseWidth)
  const colorIndex = lineDef.lineColor !== undefined ? lineDef.lineColor : lineDef.color

  if (baseWidth <= 0 || colorIndex >= colors.length) return

  const layer = {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'line',
    filter,
    paint: {
      'line-color': colors[colorIndex].rgb,
      'line-width': expFunc(baseWidth)
    },
    metadata: {
      sort: colors[colorIndex].renderOrder
    }
  }

  if (baseMainLength && baseMainGap) {
    layer.paint['line-dasharray'] = [baseMainLength, baseMainGap]
  }

  return layer
}

const areaLayer = (id, source, sourceLayer, filter, areaDef, colors) => {
  const fillColorIndex = areaDef.fillOn !== undefined
    ? areaDef.fillOn ? areaDef.fillColor : areaDef.colors[0]
    : areaDef.color
  return {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'fill',
    filter,
    paint: {
      'fill-color': colors[fillColorIndex].rgb,
      'fill-opacity': areaDef.fillOn === undefined || areaDef.fillOn
        ? 1
        : (areaDef.hatchLineWidth / areaDef.hatchDist) || 0.5 // TODO: not even close, but emulates hatch/patterns
    },
    metadata: {
      sort: colors[fillColorIndex].renderOrder
    }
  }
}

const circleLayer = (id, source, sourceLayer, filter, element, colors) => {
  const baseRadius = (element.diameter / 2 / 10) || 1
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
  if (element.type === CircleElementType) {
    const baseWidth = element.lineWidth / 10
    layer.paint['circle-opacity'] = 0
    layer.paint['circle-stroke-color'] = color
    layer.paint['circle-stroke-width'] = expFunc(baseWidth)
  } else {
    // DotElementType
    layer.paint['circle-color'] = color
  }

  return layer
}

const textLayer = (id, source, sourceLayer, filter, element, colors) => {
  const horizontalAlign = element.getHorizontalAlignment()
  const verticalAlign = element.getVerticalAlignment()
  const justify = horizontalAlign === HorizontalAlignCenter
    ? 'center'
    : horizontalAlign === HorizontalAlignRight
      ? 'right'
      : 'left'
  const anchor = verticalAlign === VerticalAlignMiddle
    ? 'center'
    : 'top'

  const weightModifier = element.weight > 400 ? ' Bold' : ''
  const fontVariant = `${weightModifier}${element.italic ? ' Italic' : !weightModifier ? ' Regular' : ''}`

  const layer = {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'symbol',
    filter,
    layout: {
      'symbol-placement': 'point',
      'text-font': [`Open Sans${fontVariant}`], // , `Arial Unicode MS${fontVariant}`
      'text-field': ['get', 'text'],
      'text-size': expFunc(element.fontSize / 2.3),
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-max-width': Infinity,
      'text-justify': justify,
      'text-anchor': `${anchor}${anchor !== 'center' ? `-${justify}` : ''}`
    },
    paint: {
      'text-color': colors[element.fontColor].rgb
    },
    metadata: {
      sort: colors[element.fontColor].renderOrder
    }
  }

  return layer
}

const expFunc = base => ({
  'type': 'exponential',
  'base': 2,
  'stops': [
    [0, base * Math.pow(2, (0 - 15))],
    [24, base * Math.pow(2, (24 - 15))]
  ]
})
