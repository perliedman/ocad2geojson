const { coordEach } = require('@turf/meta')
const Bezier = require('bezier-js')
const flatten = require('arr-flatten')
const { PointObjectType, LineObjectType, AreaObjectType, UnformattedTextObjectType, FormattedTextObjectType } = require('./ocad-reader/object-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')
const transformFeatures = require('./transform-features')
const TdPoly = require('./ocad-reader/td-poly')

const defaultOptions = {
  assignIds: true,
  applyCrs: true,
  generateSymbolElements: true,
  exportHidden: false,
  coordinatePrecision: 6
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }

  let features = transformFeatures(ocadFile, tObjectToGeoJson, createElement, options)

  if (options.assignIds) {
    let id = 1
    features.forEach(o => {
      o.id = id++
    })
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features
  }

  if (options.applyCrs) {
    applyCrs(featureCollection, ocadFile.getCrs())
  }

  coordEach(featureCollection, c => {
    c[0] = formatNum(c[0], options.coordinatePrecision)
    c[1] = formatNum(c[1], options.coordinatePrecision)
  })

  return featureCollection
}

const tObjectToGeoJson = (options, symbols, object) => {
  const symbol = symbols[object.sym]
  if (!options.exportHidden && (!symbol || symbol.isHidden())) return

  var geometry
  switch (object.objType) {
    case PointObjectType:
      geometry = {
        type: 'Point',
        coordinates: object.coordinates[0].slice()
      }
      break
    case LineObjectType:
      geometry = {
        type: 'LineString',
        coordinates: extractCoords(object.coordinates).map(c => c.slice())
      }
      break
    case AreaObjectType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(object.coordinates)
      }
      break
    case UnformattedTextObjectType:
    case FormattedTextObjectType:
      const lineHeight = symbol.fontSize / 10 * 0.352778 * 100
      const anchorCoord = [object.coordinates[0][0], object.coordinates[0][1] + lineHeight]

      geometry = {
        type: 'Point',
        coordinates: anchorCoord
      }
      break
    default:
      return
  }

  return {
    type: 'Feature',
    properties: object.getProperties(),
    geometry
  }
}

const extractCoords = coords => {
  const cs = []
  let lastC
  let cp1
  let cp2

  for (let i = 0; i < coords.length; i++) {
    const c = coords[i]

    if (c.isFirstBezier()) {
      cp1 = c
    } else if (c.isSecondBezier()) {
      cp2 = c
    } else if (cp1 && cp2) {
      const l = cp2.sub(cp1).vLength()
      const bezier = new Bezier(flatten([lastC, cp1, cp2, c]))
      const bezierCoords = bezier.getLUT(Math.round(l / 2)).map(bc => TdPoly.fromCoords(bc.x, bc.y))
      cs.push.apply(cs, bezierCoords.slice(1))
      cp1 = cp2 = undefined
      lastC = c
    } else {
      cs.push(c)
      lastC = c
    }
  }

  return cs
}

const createElement = (symbol, name, index, element, c, angle) => {
  var geometry
  const coords = extractCoords(element.coords)
  const rotatedCoords = angle ? coords.map(lc => lc.rotate(angle)) : coords
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
      element: `${symbol.symNum}-${name}-${index}`
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

    currentRing.push(c.slice())
  }

  // Copy first coordinate
  currentRing.push(currentRing[0].slice())

  return rings
}
