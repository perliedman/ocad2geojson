const { AreaSymbolType, DblFillColorOn } = require('./ocad-reader/symbol-types')
const {
  LineObjectType,
  AreaObjectType,
  LineTextObjectType,
  FormattedTextObjectType,
  UnformattedTextObjectType,
} = require('./ocad-reader/object-types')
const {
  LineElementType,
  AreaElementType,
  CircleElementType,
  DotElementType,
} = require('./ocad-reader/symbol-element-types')
const transformFeatures = require('./transform-features')
const flatten = require('arr-flatten')
// TODO: there must be a better way to make Webpack handle this?
const _lineOffset = require('@turf/line-offset')
const lineOffset =
  _lineOffset.default ||
  /** @type {import('@turf/line-offset').default} */ (
    /** @type {unknown} */ (_lineOffset)
  )
const TdPoly = require('./ocad-reader/td-poly')
const {
  HorizontalAlignCenter,
  HorizontalAlignLeft,
  VerticalAlignTop,
  VerticalAlignBottom,
} = require('./ocad-reader/text-symbol')

const svgNamespace = 'http://www.w3.org/2000/svg'

const defaultOptions = {
  generateSymbolElements: true,
  exportHidden: false,
  fill: 'transparent',
}

const patternToSvg = (colors, s) => {
  const patterns = []

  if (s.hatchMode) {
    const height = s.hatchDist
    const width = 10
    const a1 = s.hatchAngle1
    const a2 = s.hatchAngle2

    patterns.push({
      id: `hatch-fill-${s.symNum}-1`,
      'data-symbol-name': s.name,
      type: 'pattern',
      attrs: {
        patternUnits: 'userSpaceOnUse',
        patternTransform: `rotate(${a1 / 10})`,
        width,
        height,
      },
      children: [
        {
          type: 'rect',
          attrs: {
            x: 0,
            y: 0,
            width,
            height: s.hatchLineWidth,
            fill: colors[s.hatchColor].rgb,
          },
        },
      ],
    })

    if (s.hatchMode === 2) {
      patterns.push({
        id: `hatch-fill-${s.symNum}-2`,
        'data-symbol-name': s.name,
        type: 'pattern',
        attrs: {
          patternUnits: 'userSpaceOnUse',
          patternTransform: `rotate(${a2 / 10})`,
          width,
          height,
        },
        children: [
          {
            type: 'rect',
            attrs: {
              x: 0,
              y: 0,
              width,
              height: s.hatchLineWidth,
              fill: colors[s.hatchColor].rgb,
            },
          },
        ],
      })
    }
  }

  if (s.structMode) {
    const width = s.structWidth
    const height = s.structHeight * (s.structMode === 2 ? 2 : 1)

    patterns.push({
      id: `struct-fill-${s.symNum}`,
      'data-symbol-name': s.name,
      type: 'pattern',
      // , viewbox: `${-width / 2} ${-height / 2} ${width * 1.5} ${height * 1.5}`
      attrs: {
        patternUnits: 'userSpaceOnUse',
        patternTransform: `rotate(${s.structAngle / 10})`,
        width,
        height: height,
      },
      children: s.elements
        .map((e, i) =>
          elementToSvg(
            s,
            '',
            i,
            e,
            [s.structWidth * 0.5, -s.structHeight * 0.5],
            0,
            { colors }
          )
        )
        .concat(
          s.structMode === 2
            ? s.elements
                .map((e, i) =>
                  elementToSvg(
                    s,
                    '',
                    i,
                    e,
                    [s.structWidth, -s.structHeight * 1.5],
                    0,
                    { colors }
                  )
                )
                .concat(
                  s.elements.map((e, i) =>
                    elementToSvg(s, '', i, e, [0, -s.structHeight * 1.5], 0, {
                      colors,
                    })
                  )
                )
            : []
        )
        .filter(Boolean),
    })
  }

  return patterns
}

/**
 * @typedef {object} SvgNodeDef
 * @property {string} type
 * @property {string=} text
 * @property {string=} id
 * @property {number=} order
 * @property {Record<string, string>=} attrs
 * @property {SvgNodeDef[]=} children
 */

/**
 *
 * @param {Document} document
 * @param {SvgNodeDef} n
 * @returns
 */
const createSvgNode = (document, n) => {
  let node
  if (n.text === undefined) {
    node = document.createElementNS(svgNamespace, n.type)
    const xmlnss = Object.entries(n.attrs || []).filter(([key, _]) =>
      key.startsWith('xmlns')
    )
    for (const [ns, uri] of xmlnss) {
      node.setAttributeNS('http://www.w3.org/2000/xmlns/', ns, uri)
    }
    n.id && (node.id = n.id)
    n.attrs &&
      Object.keys(n.attrs).forEach(attrName =>
        node.setAttribute(attrName, n.attrs[attrName])
      )
  } else {
    node = document.createTextNode(n.text)
  }

  n.children &&
    n.children
      .filter(Boolean)
      .forEach(child => node.appendChild(createSvgNode(document, child)))

  return node
}

module.exports = {
  /**
   *
   * @param {import('./ocad-reader/ocad-file')} ocadFile
   * @param {*} options
   * @returns
   */
  ocadToSvg: function (ocadFile, options) {
    options = { ...defaultOptions, ...options }
    const objects = options.objects || ocadFile.objects

    const usedSymbols = usedSymbolNumbers(objects)
      .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
      .filter(s => s)

    const patterns = flatten(
      usedSymbols
        .filter(
          s =>
            s.type === AreaSymbolType &&
            'hatchMode' in s &&
            (s.hatchMode || s.structMode)
        )
        .map(patternToSvg.bind(null, ocadFile.colors))
    )

    const bounds = ocadFile.getBounds()
    const childNodes = transformFeatures(
      ocadFile,
      objectToSvg,
      elementToSvg,
      options
    )
    let children
    if (options.fromColor == null && options.toColor == null) {
      children = childNodes
    } else {
      children = childNodes.filter(
        node =>
          (options.fromColor == null || node.order >= options.fromColor) &&
          (options.toColor == null || node.order <= options.toColor)
      )
    }

    children.sort((a, b) => b.order - a.order)
    const root = {
      type: 'svg',
      attrs: {
        xmlns: svgNamespace,
        fill: options.fill,
        viewBox:
          bounds.slice(0, 2) +
          ',' +
          (bounds[2] - bounds[0]) +
          ',' +
          (bounds[3] - bounds[1]),
      },
      children: [
        {
          type: 'defs',
          children: patterns,
        },
      ].concat([
        {
          type: 'g',
          attrs: {
            xmlns: svgNamespace,
            transform: `translate(0, ${bounds[1] + bounds[3]})`,
          },
          children,
        },
      ]),
    }

    return createSvgNode(options.document || window.document, root)
  },
  patternToSvg,
  createSvgNode,
}

const usedSymbolNumbers = objects =>
  Array.from(
    objects.reduce((seen, f) => {
      seen.add(f.sym)
      return seen
    }, new Set())
  )

/**
 *
 * @param {*} options
 * @param {Record<number, import('./ocad-reader/symbol').BaseSymbolDef>} symbols
 * @param {import('./ocad-reader/tobject').TObject} object
 * @returns
 */
const objectToSvg = (options, symbols, object) => {
  const symNum = options.sym || object.sym
  const symbol = symbols[symNum]
  if (!symbol || (!options.exportHidden && symbol.isHidden())) return

  /** @type {SvgNodeDef} */
  let node
  switch (options.objType || object.objType) {
    case LineObjectType: {
      if (symbol.type !== 2) {
        // This somehow seems to happen in some otherwise
        // normal OCAD files; ignore such objects for now.
        // throw new Error(
        //   `Symbol mismatch: line object with non-line symbol (${JSON.stringify(
        //     symbol
        //   )})`
        // )
        return
      }

      const dashPattern = getDashPattern(
        symbol.mainGap,
        symbol.secGap,
        symbol.mainLength,
        symbol.endLength,
        symbol.endGap
      )

      node = {
        type: 'g',
        children: [],
      }

      const dbl = symbol.doubleLine
      const dblMode = dbl?.dblMode ?? 0
      const hasFill = (dbl?.dblFlags ?? 0) & DblFillColorOn

      const totalFillWidth =
        (dbl?.dblLeftWidth ?? 0) +
        (dbl?.dblWidth ?? 0) +
        (dbl?.dblRightWidth ?? 0)

      if (
        dblMode === 1 &&
        hasFill &&
        totalFillWidth > 0 &&
        dbl.dblFillColor != null
      ) {
        node.children.push(
          lineToPath(
            object.coordinates,
            totalFillWidth,
            options.colors[dbl.dblFillColor],
            null,
            symbol.lineStyle,
            options.closePath
          )
        )
      }

      if (dblMode === 2 && dbl.dblFillColor != null && totalFillWidth > 0) {
        node.children.push(
          lineToPath(
            object.coordinates,
            totalFillWidth,
            options.colors[dbl.dblFillColor],
            null,
            symbol.lineStyle,
            options.closePath
          )
        )
      }

      if (
        dbl.dblLeftWidth > 0 &&
        dbl.dblRightWidth > 0 &&
        dbl.dblFlags & DblFillColorOn
      ) {
        node.children = node.children.concat([
          lineToPath(
            object.coordinates,
            dbl.dblLeftWidth + dbl.dblRightWidth + dbl.dblWidth,
            options.colors[dbl.dblLeftColor],
            dashPattern,
            symbol.lineStyle,
            options.closePath
          ),
          lineToPath(
            object.coordinates,
            dbl.dblWidth,
            options.colors[dbl.dblFillColor],
            dashPattern,
            symbol.lineStyle,
            options.closePath
          ),
        ])
      } else if (dblMode === 1 && !(dbl?.dblFlags & DblFillColorOn)) {
        node.children = node.children.concat(
          [
            -dbl.dblWidth / 2 - dbl.dblLeftWidth / 2,
            dbl.dblWidth / 2 + dbl.dblRightWidth / 2,
          ].map((offset, i) =>
            lineToPath(
              offsetLineCoordinates(object.coordinates, offset),
              i === 0 ? dbl.dblLeftWidth : dbl.dblRightWidth,
              options.colors[i === 0 ? dbl.dblLeftColor : dbl.dblRightColor],
              dashPattern,
              symbol.lineStyle,
              options.closePath
            )
          )
        )
      }

      if (symbol.lineWidth > 0) {
        node.children.push(
          lineToPath(
            object.coordinates,
            symbol.lineWidth,
            options.colors[symbol.lineColor],
            dashPattern,
            symbol.lineStyle,
            options.closePath
          )
        )
      }

      node.children = node.children.filter(Boolean)
      if (node.children.length === 0) {
        node = null
      } else {
        node.order = Math.max(...node.children.map(n => n.order ?? 0))
      }

      break
    }

    case AreaObjectType: {
      if (symbol.type !== 3)
        throw new Error('Symbol mismatch: area object with non-area symbol')
      const fillColorIndex =
        symbol.fillOn !== undefined
          ? symbol.fillOn
            ? symbol.fillColor
            : symbol.colors[0]
          : symbol.colors[0]
      const fillPattern =
        (symbol.hatchMode && `url(#hatch-fill-${symbol.symNum}-1)`) ||
        (symbol.structMode && `url(#struct-fill-${symbol.symNum})`)
      node = {
        type: 'g',
        children: [],
      }

      if (symbol.fillOn) {
        if (fillColorIndex != null) {
          node.children.push(
            areaToPath(object.coordinates, null, options.colors[fillColorIndex])
          )
        }
      }

      if (fillPattern) {
        node.children.push(
          areaToPath(
            object.coordinates,
            fillPattern,
            options.colors[fillColorIndex]
          )
        )

        if (symbol.hatchMode === 2) {
          node.children.push(
            areaToPath(
              object.coordinates,
              `url(#hatch-fill-${symbol.symNum}-2)`,
              options.colors[fillColorIndex]
            )
          )
        }
      }

      if (symbol.borderSym) {
        node.children.push(
          objectToSvg(
            {
              ...options,
              sym: symbol.borderSym,
              objType: LineObjectType,
              closePath: true,
            },
            symbols,
            object
          )
        )
      }

      node.order = Math.max.apply(
        Math,
        node.children.filter(Boolean).map(n => n.order)
      )

      break
    }
    case UnformattedTextObjectType:
    case FormattedTextObjectType:
    case LineTextObjectType: {
      if (symbol.type !== 4)
        throw new Error('Symbol mismatch: text object with non-text symbol')

      const horizontalAlign = symbol.getHorizontalAlignment()
      const verticalAlign = symbol.getVerticalAlignment()
      const [x, y] = object.coordinates[0]
      const fontSize = symbol.fontSize * 3.52778
      const lineHeight = fontSize * 1.2
      const textColor = options.colors[symbol.fontColor]

      node = {
        type: 'text',
        attrs: {
          x: x.toString(),
          y: (-y).toString(),
          fill: textColor.rgb,
          'font-family': symbol.fontName,
          'font-style': symbol.italic ? 'italic' : '',
          'font-weight': symbol.weight > 400 ? 'bold' : '',
          'font-size': fontSize.toString(), // pt to millimeters * 10
        },
        children: ocadTextToSvg(
          object.coordinates[0],
          object.text,
          horizontalAlign,
          verticalAlign,
          lineHeight
        ),
        order: textColor.renderOrder,
      }
      break
    }
    default:
      return
  }

  // TODO: remove(?) I think this is some old debug code
  // if (node) {
  //   node.geometry = { coordinates: object.coordinates }
  //   node.properties = { sym: object.sym }
  // }

  return node
}

const elementToSvg = (symbol, name, index, element, c, angle, options) => {
  let node
  const rotatedCoords = angle
    ? element.coords.map(lc => lc.rotate(angle))
    : element.coords
  const translatedCoords = rotatedCoords.map(lc => lc.add(c))

  switch (element.type) {
    case LineElementType:
      node = lineToPath(
        translatedCoords,
        element.lineWidth,
        options.colors[element.color],
        getDashPattern(
          element.mainGap,
          element.secGap,
          element.mainLength,
          element.endLength,
          element.endGap
        )
      )
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
          r: element.diameter / 2,
        },
        order: options.colors[element.color].renderOrder,
      }

      node.attrs[element.type === CircleElementType ? 'stroke' : 'fill'] =
        options.colors[element.color].rgb
      if (element.type === CircleElementType) {
        node.attrs['stroke-width'] = element.lineWidth
      }

      break
  }

  return node
}

/**
 * Create a SVG node definition from a set of line coordinates and line styling.
 *
 * @param {TdPoly[]} coordinates
 * @param {number} width
 * @param {import('./ocad-reader/ocad-file').Color} color
 * @param {string|null} dashPattern
 * @param {number=} lineStyle
 * @param {boolean=} closePath
 * @returns {SvgNodeDef}
 */
function lineToPath(
  coordinates,
  width,
  color,
  dashPattern,
  lineStyle,
  closePath
) {
  if (width > 0) {
    return {
      type: 'path',
      attrs: {
        d: coordsToPath(coordinates, closePath),
        style: `stroke: ${color.rgb}; stroke-width: ${width}; ${
          dashPattern ? `stroke-dasharray: ${dashPattern};` : ''
        } stroke-linejoin: ${linejoin(lineStyle)}; stroke-linecap: ${linecap(
          lineStyle
        )};`,
      },
      order: color.renderOrder,
    }
  }
}

// Heavily inspired from
// https://github.com/OpenOrienteering/mapper/blob/69da0d0218e3e46ce8e85976ccd12a3d2b4b8f0c/src/fileformats/ocd_file_import.cpp#L1267
function getDashPattern(mainGap, secGap, mainLength, endLength, endGap) {
  let dashLength
  let breakLength
  // let halfOuterDashes = false
  let dashesInGroup
  let inGroupBreakLength

  if (mainGap || secGap) {
    if (!mainLength) {
      // TODO: warning
    } else if (secGap && !mainGap) {
      dashLength = mainLength - secGap
      breakLength = secGap

      if (endLength) {
        // TODO: warning
      }
    } else {
      dashLength = mainLength
      breakLength = mainGap

      if (endLength && endLength !== mainLength) {
        if (mainLength && endLength / mainLength < 0.75) {
          // halfOuterDashes = true
        }

        if (Math.abs(mainLength - 2 * endLength) > 1) {
          // TODO: warn
        }
      }

      if (secGap) {
        dashesInGroup = 2
        inGroupBreakLength = secGap
        dashLength = (dashLength - inGroupBreakLength) / 2
      }
    }
  }

  if (dashLength) {
    if (dashesInGroup) {
      return `${dashLength} ${inGroupBreakLength} ${dashLength} ${breakLength}`
    } else {
      return `${dashLength} ${breakLength}`
    }
  } else {
    return null
  }
}

function linejoin(lineStyle) {
  lineStyle = lineStyle || 0
  switch (lineStyle) {
    case 0:
      return 'bevel'
    case 1:
      return 'round'
    case 2:
      return 'bevel'
    case 4:
      return 'miter'
    default:
      console.warn(`Unknown line join style ${lineStyle}.`)
      return ''
  }
}

function linecap(lineStyle) {
  lineStyle = lineStyle || 0
  switch (lineStyle) {
    case 0:
      return 'butt'
    case 1:
      return 'round'
    case 2:
      return 'butt'
    case 4:
      return 'butt'
    default:
      console.warn(`Unknown line cap style ${lineStyle}.`)
      return ''
  }
}

const areaToPath = (coordinates, fillPattern, color) => ({
  type: 'path',
  attrs: {
    d: coordsToPath(coordinates),
    style: `fill: ${fillPattern || color.rgb};`,
    'fill-rule': 'evenodd',
  },
  order: color.renderOrder,
})

/**
 *
 * @param {import('./ocad-reader/td-poly')[]} coords
 * @param {boolean=} closePath
 * @returns {string}
 */
const coordsToPath = (coords, closePath) => {
  if (coords.length === 0) {
    return ''
  }
  const cs = []
  let cp1
  let cp2
  // Move to the start of the path
  cs.push(`M ${coords[0][0]} ${-coords[0][1]}`)

  for (let i = 0; i < coords.length; i++) {
    const c = coords[i]

    if (c.isFirstBezier()) {
      cp1 = c
    } else if (c.isSecondBezier()) {
      cp2 = c
    } else if (c.isFirstHolePoint()) {
      cs.push(`M ${c[0]} ${-c[1]}`)
    } else if (cp1 && cp2) {
      const bezier = `C ${cp1[0]} ${-cp1[1]} ${cp2[0]} ${-cp2[1]} ${
        c[0]
      } ${-c[1]}`
      cp1 = cp2 = undefined
      cs.push(bezier)
    } else {
      cs.push(`L ${c[0]} ${-c[1]}`)
    }
  }

  if (closePath) {
    cs.push(`L ${coords[0][0]} ${-coords[0][1]}`)
  }

  return cs.join(' ')
}

const offsetLineCoordinates = (coordinates, offset) => {
  const offsetCoordinates = lineOffset(
    {
      type: 'LineString',
      coordinates,
    },
    offset,
    { units: 'degrees' }
  ).geometry.coordinates
  return offsetCoordinates.map(
    (c, i) =>
      new TdPoly(c[0], c[1], coordinates[i].xFlags, coordinates[i].yFlags)
  )
}

const ocadTextToSvg = (
  coord,
  s,
  horizontalAlign,
  verticalAlign,
  lineHeight
) => {
  const lines = s.split('\n')
  const baseY =
    verticalAlign === VerticalAlignTop
      ? lineHeight
      : verticalAlign === VerticalAlignBottom
      ? 0
      : 0.5 * lineHeight

  return lines.map((l, i) => ({
    type: 'tspan',
    attrs: {
      x: coord[0],
      y: `${-coord[1] + baseY + i * lineHeight}`,
      'text-anchor':
        horizontalAlign === HorizontalAlignCenter
          ? 'middle'
          : horizontalAlign === HorizontalAlignLeft
          ? 'start'
          : 'end',
    },
    children: [{ text: l }],
  }))
}
