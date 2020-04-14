const { PointSymbolType, LineSymbolType, AreaSymbolType, TextSymbolType, DblFillColorOn } = require('./ocad-reader/symbol-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')
const { HorizontalAlignCenter, HorizontalAlignRight, VerticalAlignBottom, VerticalAlignMiddle, VerticalAlignTop } = require('./ocad-reader/text-symbol')

module.exports = function ocadToMapboxGlStyle (ocadFile, options) {
  options = { scaleFactor: ocadFile.getCrs().scale / 15000, ...options }
  const usedSymbols = usedSymbolNumbers(ocadFile)
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)

  const metadata = symbol => {
    const metadata = Object.keys(symbol).filter(k => symbol[k] !== Object(symbol[k])).reduce((a, k) => {
      a[k] = symbol[k]
      return a
    }, {})

    return layer => ({
      ...layer,
      metadata: {
        ...metadata,
        sort: layer.metadata.sort
      }
    })
  }

  const symbolLayers = Array.prototype.concat.apply([], usedSymbols
    .map(symbol => (symbolToMapboxLayer(symbol, ocadFile.colors, options) || []).map(metadata(symbol))))

  const elementLayers = Array.prototype.concat.apply([], usedSymbols
    .map(symbol => (symbolElementsToMapboxLayer(symbol, ocadFile.colors, options) || []).map(metadata(symbol))))

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
      layerFactory = lineLayer
      break
    case AreaSymbolType:
      layerFactory = areaLayer
      break
    case TextSymbolType:
      layerFactory = textLayer
      break
  }

  return layerFactory && layerFactory(id, options.source, options.sourceLayer, options.scaleFactor, filter, symbol, colors)
}

const symbolElementsToMapboxLayer = (symbol, colors, options) => {
  var elements = []
  switch (symbol.type) {
    case PointSymbolType:
      elements = symbol.elements.map(e => [e, 'element'])
      break
    case LineSymbolType:
      elements = symbol.primSymElements.map(e => [e, 'prim'])
        .concat(symbol.cornerSymElements.map(e => [e, 'corner']))
      break
  }

  return Array.prototype.concat.apply([], elements
    .map(([e, name], i) => createElementLayer(e, name, i, symbol, colors, options))
    .filter(l => l))
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
        options.scaleFactor,
        filter,
        element, colors)
    case AreaElementType:
      return areaLayer(
        id,
        options.source,
        options.sourceLayer,
        options.scaleFactor,
        filter,
        element, colors)
    case CircleElementType:
    case DotElementType:
      return circleLayer(
        id,
        options.source,
        options.sourceLayer,
        options.scaleFactor,
        filter,
        element, colors)
  }
}

const lineLayer = (id, source, sourceLayer, scaleFactor, filter, lineDef, colors) => {
  const createLayer = (id, width, length, gap, color) => {
    if (width <= 0 || color >= colors.length) return

    const baseWidth = (width / 10) * scaleFactor
    const baseMainLength = length / (10 * baseWidth)
    const baseMainGap = gap / (10 * baseWidth)

    const l = {
      id,
      source,
      'source-layer': sourceLayer,
      type: 'line',
      filter,
      paint: {
        'line-color': colors[color].rgb,
        'line-width': expFunc(baseWidth)
      },
      metadata: {
        sort: colors[color].renderOrder
      }
    }

    if (baseMainLength && baseMainGap) {
      l.paint['line-dasharray'] = [baseMainLength, baseMainGap]
    }

    return l
  }

  const isDoubleLine = lineDef.doubleLine && lineDef.doubleLine.dblMode
  let layers

  if (!isDoubleLine) {
    layers = [
      createLayer(
        id,
        lineDef.lineWidth,
        lineDef.mainLength,
        lineDef.mainGap,
        lineDef.lineColor !== undefined ? lineDef.lineColor : lineDef.color)
    ]
  } else {
    const dbl = lineDef.doubleLine

    // TODO: look into maybe using line-gap-width for some of this
    if (dbl.dblFlags & DblFillColorOn) {
      layers = [
        dbl.dblLeftWidth > 0 && dbl.dblRightWidth > 0 && createLayer(
          id,
          dbl.dblLeftWidth * 1.5 + dbl.dblRightWidth * 1.5 + dbl.dblWidth * 2,
          dbl.dblLength,
          dbl.dblGap,
          dbl.dblLeftColor),
        createLayer(
          id + '_fill',
          dbl.dblWidth * 2,
          dbl.dblLength,
          dbl.dblGap,
          dbl.dblFillColor)
      ]
    } else {
      layers = [
        -dbl.dblWidth - dbl.dblLeftWidth / 2,
        dbl.dblWidth + dbl.dblRightWidth / 2
      ].map((offset, i) => {
        const l = createLayer(
          id + '_' + i,
          i === 0 ? dbl.dblLeftWidth : dbl.dblRightWidth,
          dbl.dblLength,
          dbl.dblGap,
          i === 0 ? dbl.dblLeftColor : dbl.dblRightColor)

        if (l) {
          l.paint['line-offset'] = expFunc(offset / 10 * scaleFactor)
        }

        return l
      })
    }
  }

  return layers.filter(l => l)
}

const areaLayer = (id, source, sourceLayer, scaleFactor, filter, areaDef, colors) => {
  const fillColorIndex = areaDef.fillOn !== undefined
    ? areaDef.fillOn ? areaDef.fillColor : areaDef.colors[0]
    : areaDef.color
  return [{
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
  }]
}

const circleLayer = (id, source, sourceLayer, scaleFactor, filter, element, colors) => {
  const baseRadius = (element.diameter / 2 / 10) || 1
  const layer = {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'circle',
    filter,
    paint: {
      'circle-radius': expFunc(baseRadius * scaleFactor),
      'circle-pitch-alignment': 'map'
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

  return [layer]
}

const textLayer = (id, source, sourceLayer, scaleFactor, filter, element, colors) => {
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
      'text-size': expFunc(element.fontSize / 2.3 * scaleFactor),
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-max-width': Infinity,
      'text-justify': justify,
      'text-anchor': `${anchor}${justify !== 'center' ? `-${justify}` : ''}`,
      'text-pitch-alignment': 'map',
      'text-rotation-alignment': 'map'
    },
    paint: {
      'text-color': colors[element.fontColor].rgb
    },
    metadata: {
      sort: colors[element.fontColor].renderOrder
    }
  }

  return [layer]
}

const expFunc = base => ({
  'type': 'exponential',
  'base': 2,
  'stops': [
    [0, base * Math.pow(2, (0 - 15))],
    [24, base * Math.pow(2, (24 - 15))]
  ]
})
