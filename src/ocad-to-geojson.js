const { coordEach } = require('@turf/meta')
const { featureCollection } = require('@turf/helpers')
const Bezier = require('bezier-js')
const flatten = require('arr-flatten')
const {
  PointObjectType,
  LineObjectType,
  AreaObjectType,
  UnformattedTextObjectType,
  FormattedTextObjectType,
  LineTextObjectType,
} = require('./ocad-reader/object-types')
const {
  LineElementType,
  AreaElementType,
  CircleElementType,
  DotElementType,
} = require('./ocad-reader/symbol-element-types')
const transformFeatures = require('./transform-features')
const TdPoly = require('./ocad-reader/td-poly')

const defaultOptions = {
  applyCrs: true,
  generateSymbolElements: true,
  exportHidden: false,
  coordinatePrecision: 6,
}

module.exports = ocadToGeoJson

/**
 * @typedef {import("./ocad-reader/tobject").TObject} TObject
 */

/** @typedef {import("@turf/helpers").Geometry} Geometry */
/**
 * @template {Object} TGeometry
 * @template {Object} TProperties
 * @typedef {import("@turf/helpers").FeatureCollection<TGeometry, TProperties>} FeatureCollection<TGeometry, TProperties>
 */

/**
 * @template {Object} TGeometry
 * @template {Object} TProperties
 * @typedef {import("@turf/helpers").Feature<TGeometry, TProperties>} Feature<TGeometry, TProperties>
 */

/**
 * @typedef {import("./transform-features").TransformFeaturesOptions} TransformFeaturesOptions
 *
 * @typedef {object} OcadToGeoJsonOptionsProps
 * @property {boolean=} applyCrs transform coordinates to the file's geographic coordinates (default: `true`)
 * @property {number=} coordinatePrecision number of digits after the decimal point (default: `6`)
 *
 * @typedef {TransformFeaturesOptions & OcadToGeoJsonOptionsProps} OcadToGeoJsonOptions
 */

/**
 * @typedef {Object} OcadObjectProperties
 * @property {number} sym
 * @property {number} otp
 * @property {boolean} unicode
 * @property {number} ang
 * @property {number} col
 * @property {number} lineWidth
 * @property {number} diamFlags
 * @property {number} serverObjectId
 * @property {number} height
 * @property {number} creationDate
 * @property {number} multirepresentationId
 * @property {number} modificationDate
 * @property {number} nItem
 * @property {number} nText
 * @property {number} nObjectString
 * @property {number} nDatabaseString
 * @property {number} objectStringType
 * @property {number} res1
 * @property {string} text
 * @property {string|undefined} objectString
 * @property {string|undefined} databaseString
 * @property {number} objectIndex
 */

/**
 * @typedef {Object} ElementProperties
 * @property {string} element
 * @property {number} parentId
 */

/**
 * Given an `OcadFile` object, returns a GeoJSON `FeatureCollection` of the file's objects.
 * @param {import("./ocad-reader/ocad-file")} ocadFile the OCAD file
 * @param {OcadToGeoJsonOptions=} options options
 * @returns {FeatureCollection<Geometry, OcadObjectProperties>}
 */
function ocadToGeoJson(ocadFile, options) {
  options = { ...defaultOptions, ...options }

  const features = transformFeatures(
    ocadFile,
    tObjectToGeoJson,
    createElement,
    options
  )
  const result = featureCollection(features)

  if (options.applyCrs) {
    applyCrs(result, ocadFile.getCrs())
  }

  coordEach(result, c => {
    c[0] = formatNum(c[0], options.coordinatePrecision)
    c[1] = formatNum(c[1], options.coordinatePrecision)
  })

  return result
}

/**
 *
 * @param {OcadToGeoJsonOptions} options
 * @param {Record<number, import('./ocad-reader/symbol').BaseSymbolDef>} symbols
 * @param {TObject} object
 * @param {number} i
 * @returns {Feature<Geometry, OcadObjectProperties>[]}
 */
const tObjectToGeoJson = (options, symbols, object, i) => {
  const symbol = symbols[object.sym]
  if (!symbol || (!options.exportHidden && symbol.isHidden())) return

  let geometry
  switch (object.objType) {
    case PointObjectType:
      geometry = {
        type: 'Point',
        coordinates: object.coordinates[0].slice(),
      }
      break
    case LineObjectType:
      geometry = {
        type: 'LineString',
        coordinates: extractCoords(object.coordinates).map(c => c.slice()),
      }
      break
    case AreaObjectType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(object.coordinates),
      }
      break
    case UnformattedTextObjectType:
    case FormattedTextObjectType:
    case LineTextObjectType: {
      if (!('fontSize' in symbol))
        throw new Error(`Text object's symbol is not a text symbol`)

      const lineHeight = (symbol.fontSize / 10) * 0.352778 * 100
      const anchorCoord = [
        object.coordinates[0][0],
        object.coordinates[0][1] + lineHeight,
      ]

      geometry = {
        type: 'Point',
        coordinates: anchorCoord,
      }
      break
    }
    default:
      return
  }

  return [
    {
      type: 'Feature',
      properties: getProperties(object),
      id: i + 1,
      geometry,
    },
  ]
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
      const bezierCoords = bezier
        .getLUT(Math.round(l / 2))
        .map(bc => TdPoly.fromCoords(bc.x, bc.y))
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

/**
 * @param {import('./ocad-reader/symbol').BaseSymbolDef} symbol
 * @param {string} name
 * @param {number} index
 * @param {import('./ocad-reader/symbol-element')} element
 * @param {TdPoly} c
 * @param {number} angle
 * @param {TransformFeaturesOptions} options
 * @param {TObject} object
 * @param {number} objectId
 * @returns {Feature<Geometry, ElementProperties>}
 */
const createElement = (
  symbol,
  name,
  index,
  element,
  c,
  angle,
  options,
  object,
  objectId
) => {
  let geometry
  const coords = extractCoords(element.coords)
  const rotatedCoords = angle ? coords.map(lc => lc.rotate(angle)) : coords
  const translatedCoords = rotatedCoords.map(lc => lc.add(c))

  switch (element.type) {
    case LineElementType:
      geometry = {
        type: 'LineString',
        coordinates: translatedCoords,
      }
      break
    case AreaElementType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(translatedCoords),
      }
      break
    case CircleElementType:
    case DotElementType:
      geometry = {
        type: 'Point',
        coordinates: translatedCoords[0],
      }
      break
  }

  return {
    type: 'Feature',
    properties: {
      element: `${symbol.symNum}-${name}-${index}`,
      parentId: objectId + 1,
    },
    id: ++options.idCount,
    geometry,
  }
}

const applyCrs = (featureCollection, crs) => {
  coordEach(featureCollection, coord => {
    const crsCoord = crs.toProjectedCoord(coord)

    coord[0] = crsCoord[0]
    coord[1] = crsCoord[1]
  })
}

function formatNum(num, digits) {
  const pow = Math.pow(10, digits === undefined ? 6 : digits)
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

/**
 * Returns the GeoJSON properties for this object.
 * @param {TObject} object
 * @returns {OcadObjectProperties}
 */
function getProperties(object) {
  return {
    sym: object.sym,
    otp: object.otp,
    unicode: object.unicode,
    ang: object.ang,
    col: object.col,
    lineWidth: object.lineWidth,
    diamFlags: object.diamFlags,
    serverObjectId: object.serverObjectId,
    height: object.height,
    creationDate: object.creationDate,
    multirepresentationId: object.multirepresentationId,
    modificationDate: object.modificationDate,
    nItem: object.nItem,
    nText: object.nText,
    nObjectString: object.nObjectString,
    nDatabaseString: object.nDatabaseString,
    objectStringType: object.objectStringType,
    res1: object.res1,
    text: object.text,
    objectString: object.objectString,
    databaseString: object.databaseString,
    objectIndex: object.objIndex._index,
  }
}
