const { PointObjectType, LineObjectType, AreaObjectType, UnformattedTextObjectType, FormattedTextObjectType } = require('./ocad-reader/object-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')
const transformFeatures = require('./transform-features')

const defaultOptions = {
  generateSymbolElements: true,
  exportHidden: false
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }

  const createSvgNode = n => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', n.type)
    n.attrs && Object.keys(n.attrs).forEach(attrName => node.setAttribute(attrName, n.attrs[attrName]))
    n.children && n.children.forEach(child => node.appendChild(createSvgNode(child)))

    return node
  }

  const root = {
    type: 'g',
    children: transformFeatures(ocadFile, objectToSvg, elementToSvg, options)
  }

  return createSvgNode(root)
}

const objectToSvg = (options, symbols, object) => {
  const symbol = symbols[object.sym]
  if (!options.exportHidden && (!symbol || symbol.isHidden())) return

  let node
  switch (object.objType) {
    // case PointObjectType:
    //   node = symbol.elements.map(e => elementToSvg(symbol, null, 0, null, e, object.coordinates[0], 0))
    //   break
    case LineObjectType:
      node = {
        type: 'path',
        attrs: {
          d: `M ${object.coordinates[0][0]} ${-object.coordinates[0][1]} L ${object.coordinates.slice(1).map(c => `${c[0]} ${-c[1]}`).join(' L ')}`
        }
      }
      break
      // case AreaObjectType:
      //   node = {
      //     type: 'Polygon',
      //     coordinates: coordinatesToRings(object.coordinates)
      //   }
      //   break
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

const elementToSvg = (symbol, name, index, parentFeature, element, c, angle) => {
  var geometry
  const rotatedCoords = angle ? element.coords.map(lc => lc.rotate(angle)) : element.coords
  const translatedCoords = rotatedCoords.map(lc => lc.add(c))

  switch (element.type) {
    case LineElementType:
      geometry = {
        type: 'LineString',
        coordinates: translatedCoords
      }
      break
    case AreaElementType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(translatedCoords)
      }
      break
    case CircleElementType:
    case DotElementType:
      geometry = {
        type: 'Point',
        coordinates: translatedCoords[0]
      }
      break
  }

  return {
    type: 'Feature',
    properties: {
      element: `${symbol.symNum}-${name}-${index}`,
      parentId: parentFeature.id
    },
    geometry
  }
}

const applyCrs = (featureCollection, crs) => {
  // OCAD uses 1/100 mm of "paper coordinates" as units, we
  // want to convert to meters in real world
  const hundredsMmToMeter = 1 / (100 * 1000)

  coordEach(featureCollection, coord => {
    coord[0] = (coord[0] * hundredsMmToMeter) * crs.scale + crs.easting
    coord[1] = (coord[1] * hundredsMmToMeter) * crs.scale + crs.northing
  })
}

function formatNum (num, digits) {
  var pow = Math.pow(10, (digits === undefined ? 6 : digits))
  return Math.round(num * pow) / pow
}

const coordinatesToRings = coordinates => {
  const rings = []
  let currentRing = []
  rings.push(currentRing)
  for (let i = 0; i < coordinates.length; i++) {
    const c = coordinates[i]
    if (c.isFirstHolePoint()) {
      // Copy first coordinate
      currentRing.push(currentRing[0].slice())
      currentRing = []
      rings.push(currentRing)
    }

    currentRing.push(c)
  }

  // Copy first coordinate
  currentRing.push(currentRing[0].slice())

  return rings
}
