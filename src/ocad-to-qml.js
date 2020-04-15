const { LineSymbolType, AreaSymbolType } = require('./ocad-reader/symbol-types')
const { PointObjectType, LineObjectType, AreaObjectType, UnformattedTextObjectType, FormattedTextObjectType } = require('./ocad-reader/object-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')
const transformFeatures = require('./transform-features')
const flatten = require('arr-flatten')
const uuidv4 = require('uuid/v4')
const DOMImplementation = global.DOMImplementation
  ? global.DOMImplementation
  : new (require('xmldom').DOMImplementation)()
const XMLSerializer = global.XMLSerializer || (require('xmldom').XMLSerializer)

const defaultOptions = {
  generateSymbolElements: true,
  exportHidden: false
}

module.exports = function ocadToQml (ocadFile, options) {
  options = { ...defaultOptions, ...options }

  const usedSymbols = usedSymbolNumbers(ocadFile)
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)

  const root = {
    type: 'qgis',
    attrs: {
      simplifyMaxScale: 1,
      minScale: 1e+08,
      readOnly: 0,
      simplifyDrawingTol: 1,
      hasScaleBasedVisibilityFlag: 0,
      simplifyAlgorithm: 0,
      maxScale: 0,
      labelsEnabled: 0,
      styleCategories: 'AllStyleCategories',
      simplifyDrawingHints: 1,
      simplifyLocal: 1
    },
    children: [
      {
        type: 'renderer-v2',
        attrs: {
          forceraster: 0,
          symbollevels: 0,
          type: 'RuleRenderer',
          enableorderby: 0
        },
        children: [
          {
            type: 'rules',
            attrs: {
              key: `{${uuidv4()}}`
            },
            children: usedSymbols.map((sym, i) => ({
              type: 'rule',
              attrs: {
                key: `{${uuidv4()}}`,
                symbol: i,
                label: `${Math.floor(sym.symNum / 1000)}.${sym.symNum % 1000} ${sym.description}`,
                filter: `sym=${sym.symNum}`
              }
            }))
          },
          {
            type: 'symbols',
            children: usedSymbols.map((sym, i) => ({
              ...symbolToQml(ocadFile.getCrs().scale, ocadFile.colors, sym),
              type: 'symbol',
              attrs: {
                name: i,
                clip_to_extent: 1,
                alpha: 1,
                type: sym.type === LineSymbolType
                  ? 'line'
                  : sym.type === AreaSymbolType
                    ? 'fill'
                    : '',
                force_rhr: 0
              }
            })).sort((a, b) => a.order - b.order)
          }
        ]
      }
    ]
  }

  const doc = DOMImplementation.createDocument(null, 'xml', null)
  return createXmlNode(doc, root)
}

const createXmlNode = (document, n) => {
  const node = document.createElement(n.type)
  n.id && (node.id = n.id)
  n.attrs && Object.keys(n.attrs).forEach(attrName => node.setAttribute(attrName, n.attrs[attrName]))
  n.children && n.children.forEach(child => node.appendChild(createXmlNode(document, child)))

  return node
}

const usedSymbolNumbers = ocadFile => ocadFile.objects.reduce((a, f) => {
  const symbolNum = f.sym
  if (!a.idSet.has(symbolNum)) {
    a.symbolNums.push(symbolNum)
    a.idSet.add(symbolNum)
  }

  return a
}, { symbolNums: [], idSet: new Set() }).symbolNums

const symbolToQml = (scale, colors, sym) => {
  let children

  switch (sym.type) {
    case LineSymbolType: {
      const lineColor = colors[sym.lineColor]
      if (lineColor) {
        const baseMainGap = sym.mainGap
        const baseMainLength = sym.mainLength
        children = [{
          type: 'layer',
          attrs: {
            class: 'SimpleLine',
            pass: 1000 - lineColor.renderOrder,
            enabled: 1,
            locked: 0
          },
          children: [
            prop('line_color', Array.from(lineColor.rgbArray).concat([255]).join(',')),
            prop('line_style', 'solid'),
            prop('line_width', toMapUnit(scale, sym.lineWidth)),
            prop('line_width_unit', 'MapUnit'),
            prop('joinstyle', 'bevel'),
            prop('capstyle', 'flat')
          ].concat(baseMainGap && baseMainLength
            ? [
              prop('customdash', [baseMainLength, baseMainGap].map(x => toMapUnit(scale, x)).join(';')),
              prop('customdash_unit', 'MapUnit'),
              prop('use_custom_dash', 1)
            ]
            : [])
        }]
      }
      break
    }
    case AreaSymbolType: {
      const fillColor = colors[sym.fillColor]
      if (fillColor) {
        children = [{
          type: 'layer',
          attrs: {
            class: 'SimpleFill',
            pass: 1000 - fillColor.renderOrder,
            enabled: 1,
            locked: 0
          },
          children: [
            prop('color', Array.from(fillColor.rgbArray).concat([255]).join(',')),
            prop('outline_style', 'no'),
            prop('style', 'solid')
          ]
        }]
      }
      break
    }
  }

  return {
    children
  }
}

const prop = (k, v) => ({
  type: 'prop',
  attrs: { k, v }
})

const toMapUnit = (scale, x) => x / (100 * 1000) * scale

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
      const fillPattern = (symbol.hatchMode && `url(#hatch-fill-${symbol.symNum}-1)`) ||
        (symbol.structMode && `url(#struct-fill-${symbol.symNum})`)
      node = areaToPath(object.coordinates, fillPattern, options.colors[fillColorIndex])

      if (symbol.hatchMode === 2) {
        node = {
          type: 'g',
          children: [
            node,
            areaToPath(object.coordinates, `url(#hatch-fill-${symbol.symNum}-2)`, options.colors[fillColorIndex])
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

const coordsToPath = coords =>
  coords
    .map((c, i) => `${i === 0 || c.isFirstHolePoint() ? 'M' : 'L'} ${c[0]} ${-c[1]}`)
    .join(' ')
