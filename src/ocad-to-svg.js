const { AreaSymbolType } = require('./ocad-reader/symbol-types')
const { LineObjectType, AreaObjectType, UnformattedTextObjectType, FormattedTextObjectType } = require('./ocad-reader/object-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')
const transformFeatures = require('./transform-features')
const flatten = require('arr-flatten')

const defaultOptions = {
  generateSymbolElements: true,
  exportHidden: false
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }

  const createSvgNode = n => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', n.type)
    n.id && (node.id = n.id)
    n.attrs && Object.keys(n.attrs).forEach(attrName => node.setAttribute(attrName, n.attrs[attrName]))
    n.children && n.children.forEach(child => node.appendChild(createSvgNode(child)))

    return node
  }

  const usedSymbols = usedSymbolNumbers(ocadFile)
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)

  const patterns = flatten(usedSymbols
    .filter(s => s.type === AreaSymbolType && s.hatchMode)
    .map(s => {
      const height = s.hatchLineWidth + s.hatchDist
      const width = 10
      const a1 = s.hatchAngle1
      const a2 = s.hatchAngle2

      const patterns = [{
        id: `fill-${s.symNum}-1`,
        'data-symbol-name': s.name,
        type: 'pattern',
        attrs: { patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${a1 / 10})`, width, height },
        children: [
          { type: 'rect', attrs: { x: 0, y: 0, width, height: s.hatchLineWidth, fill: ocadFile.colors[s.hatchColor].rgb } }
        ]
      }]

      if (s.hatchMode === 2) {
        patterns.push({
          id: `fill-${s.symNum}-2`,
          'data-symbol-name': s.name,
          type: 'pattern',
          attrs: { patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${a2 / 10})`, width, height },
          children: [
            { type: 'rect', attrs: { x: 0, y: 0, width, height: s.hatchLineWidth, fill: ocadFile.colors[s.hatchColor].rgb } }
          ]
        })
      }

      return patterns
    }))

  const root = {
    type: 'svg',
    attrs: { fill: 'transparent' },
    children: [
      {
        type: 'defs',
        children: patterns
      }
    ].concat({
      type: 'g',
      children: transformFeatures(ocadFile, objectToSvg, elementToSvg, options)
        .sort((a, b) => b.order - a.order)
    })
  }

  return createSvgNode(root)
}

const usedSymbolNumbers = ocadFile => ocadFile.objects.reduce((a, f) => {
  const symbolNum = f.sym
  if (!a.idSet.has(symbolNum)) {
    a.symbolNums.push(symbolNum)
    a.idSet.add(symbolNum)
  }

  return a
}, { symbolNums: [], idSet: new Set() }).symbolNums

const objectToSvg = (options, symbols, object) => {
  const symbol = symbols[object.sym]
  if (!options.exportHidden && (!symbol || symbol.isHidden())) return

  let node
  switch (object.objType) {
    case LineObjectType:
      node = symbol.lineWidth && lineToPath(object.coordinates, symbol.lineWidth, options.colors[symbol.lineColor], symbol.mainGap, symbol.mainLength)
      break
    case AreaObjectType:
      const fillColorIndex = symbol.fillOn !== undefined
        ? symbol.fillOn ? symbol.fillColor : symbol.colors[0]
        : symbol.color
      node = areaToPath(object.coordinates, symbol.hatchMode && `url(#fill-${symbol.symNum}-1)`, options.colors[fillColorIndex])

      if (symbol.hatchMode === 2) {
        node = {
          type: 'g',
          children: [
            node,
            areaToPath(object.coordinates, `url(#fill-${symbol.symNum}-2)`, options.colors[fillColorIndex])
          ],
          order: options.colors[fillColorIndex].renderOrder
        }
      }

      break
      // case UnformattedTextObjectType:
      // case FormattedTextObjectType:
      //   const lineHeight = symbol.fontSize / 10 * 0.352778 * 100
      //   const anchorCoord = [object.coordinates[0][0], object.coordinates[0][1] + lineHeight]

    //   node = {
    //     type: 'Point',
    //     coordinates: anchorCoord
    //   }
    //   break
    default:
      return
  }

  if (node) {
    node.geometry = { coordinates: object.coordinates }
    node.properties = { sym: object.sym }
  }

  return node
}

const elementToSvg = (symbol, name, index, element, c, angle, options) => {
  let node
  const rotatedCoords = angle ? element.coords.map(lc => lc.rotate(angle)) : element.coords
  const translatedCoords = rotatedCoords.map(lc => lc.add(c))

  switch (element.type) {
    case LineElementType:
      node = lineToPath(translatedCoords, element.lineWidth, options.colors[element.color], element.mainGap, element.mainLength)
      break
    case AreaElementType:
      node = areaToPath(translatedCoords, null, options.colors[element.color])
      break
    case CircleElementType:
    case DotElementType:
      node = {
        type: 'circle',
        attrs: {
          cx: c[0],
          cy: -c[1],
          r: element.diameter / 2
        },
        order: options.colors[element.color].renderOrder
      }

      node.attrs[element.type === CircleElementType ? 'stroke' : 'fill'] = options.colors[element.color].rgb
      if (element.type === CircleElementType) {
        node.attrs['stroke-width'] = element.lineWidth
      }

      break
  }

  return node
}

const lineToPath = (coordinates, width, color, baseMainGap, baseMainLength) => ({
  type: 'path',
  attrs: {
    d: coordsToPath(coordinates),
    style: `stroke: ${color.rgb}; stroke-width: ${width}; ${baseMainGap && baseMainLength ? `stroke-dasharray: ${baseMainLength} ${baseMainGap};` : ''}`
  },
  order: color.renderOrder
})

const areaToPath = (coordinates, fillPattern, color) => ({
  type: 'path',
  attrs: {
    d: coordsToPath(coordinates),
    style: `fill: ${fillPattern || color.rgb};`
  },
  order: color.renderOrder
})

const coordsToPath = coords => {
  const parts = coords.reduce((a, c) => {
    const currentPart = a[a.length - 1]
    currentPart.push(c)

    if (c.isSecondBezier()) {
      currentPart.isCurve = true
      a.push([])
    }

    return a
  }, [[]])

  return parts.map((p, i) => p.isCurve
    ? [`M ${coordToSvg(p[0])}`, `C ${p.slice(1).concat([parts[i + 1][0]]).map(c => coordToSvg(c)).join(', ')}`]
    : p.map((c, j) => `${j === 0 || c.isFirstHolePoint() ? 'M' : 'L'} ${coordToSvg(c)}`))
    .join(' ')
}

const coordToSvg = c => `${c[0]} ${-c[1]}`
