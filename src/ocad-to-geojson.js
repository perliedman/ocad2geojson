const { coordEach } = require('@turf/meta')
const { PointSymbolType, LineSymbolType } = require('./ocad-reader/symbol-types')
const { PointObjectType, LineObjectType, AreaObjectType } = require('./ocad-reader/object-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')

const defaultOptions = {
  assignIds: true,
  applyCrs: true,
  generateSymbolElements: true,
  exportHidden: false
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }

  let id = 1
  const symbols = ocadFile.symbols.reduce((ss, s) => {
    ss[s.symNum] = s
    return ss
  }, {})

  let features = ocadFile.objects
    .map(tObjectToGeoJson.bind(null, options, symbols))
    .filter(f => f)

  if (options.assignIds) {
    features.forEach(o => {
      o.id = id++
    })
  }

  if (options.generateSymbolElements) {
    const elementFeatures = features
      .map(generateSymbolElements.bind(null, options, symbols))
      .filter(f => f)

    if (options.assignIds) {
      elementFeatures.forEach(o => {
        o.id = id++
      })
    }

    features = features.concat(Array.prototype.concat.apply([], elementFeatures))
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features
  }

  if (options.applyCrs) {
    applyCrs(featureCollection, ocadFile.getCrs())
  }

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
        coordinates: object.coordinates[0]
      }
      break
    case LineObjectType:
      geometry = {
        type: 'LineString',
        coordinates: object.coordinates
      }
      break
    case AreaObjectType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(object.coordinates)
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

const generateSymbolElements = (options, symbols, feature) => {
  const symbol = symbols[feature.properties.sym]
  let elements = []

  if (!options.exportHidden && (!symbol || symbol.isHidden())) return elements

  switch (symbol.type) {
    case PointSymbolType:
      const angle = feature.properties.ang ? feature.properties.ang / 10 / 180 * Math.PI : 0
      elements = symbol.elements
        .map((e, i) => createElement(symbol, 'element', i, feature, e, feature.geometry.coordinates, angle))
      break
    case LineSymbolType:
      if (symbol.primSymElements.length > 0) {
        const coords = feature.geometry.coordinates
        const endLength = symbol.endLength
        const mainLength = symbol.mainLength
        const spotDist = symbol.primSymDist

        let d = endLength

        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          const u = v.unit()
          const segmentLength = v.vLength()

          let c = c0.add(u.mul(d))
          let j = 0
          while (d < segmentLength) {
            elements = elements.concat(symbol.primSymElements
              .map((e, i) => createElement(symbol, 'prim', i, feature, e, c, angle)))

            j++
            const step = (spotDist && j % symbol.nPrimSym) ? spotDist : mainLength

            c = c.add(u.mul(step))
            d += step
          }

          d -= segmentLength
        }
      }
  }

  return elements
}

const createElement = (symbol, name, index, parentFeature, element, c, angle) => {
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
