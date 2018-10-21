const { coordEach } = require('@turf/meta')

const defaultOptions = {
  assignIds: true,
  applyCrs: true,
  generateSymbolElements: true
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }
  let features = ocadFile.objects
    .map(tObjectToGeoJson)
    .filter(f => f)

  if (options.generateSymbolElements) {
    const symbols = ocadFile.symbols.reduce((ss, s) => {
      ss[s.symNum] = s
      return ss
    }, {})
    const elementFeatures = features
      .map(generateSymbolElements.bind(null, symbols))
      .filter(f => f)
    features = features.concat(Array.prototype.concat.apply([], elementFeatures))
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features
  }

  if (options.assignIds) {
    features.forEach((o, i) => {
      o.id = i + 1
    })
  }

  if (options.applyCrs) {
    applyCrs(featureCollection, ocadFile.getCrs())
  }

  return featureCollection
}

const tObjectToGeoJson = object => {
  var geometry
  switch (object.objType) {
    case 1:
      geometry = {
        type: 'Point',
        coordinates: object.coordinates[0]
      }
      break
    case 2:
      geometry = {
        type: 'LineString',
        coordinates: object.coordinates
      }
      break
    case 3:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(object.coordinates)
      }
      break
    default:
      return null
  }

  return {
    type: 'Feature',
    properties: object.getProperties(),
    geometry
  }
}

const generateSymbolElements = (symbols, feature) => {
  const symbol = symbols[feature.properties.sym]
  let elements = []

  if (!symbol) return elements

  switch (symbol.type) {
    case 1:
      const angle = feature.properties.ang ? feature.properties.ang / 10 / 180 * Math.PI : 0
      elements = symbol.elements
        .map((e, i) => createElement(symbol, 'element', i, feature, e, feature.geometry.coordinates, angle))
      break
    case 2:
      if (symbol.primSymElements.length > 0) {
        const coords = feature.geometry.coordinates
        const endLength = symbol.endLength
        let d = endLength
        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          const u = v.unit()
          const segmentLength = v.vLength()
          const mainLength = symbol.mainLength

          let c = c0.add(u.mul(d))
          const mainV = u.mul(mainLength)
          while (d < segmentLength) {
            elements = elements.concat(symbol.primSymElements
              .map((e, i) => createElement(symbol, 'prim', i, feature, e, c, angle)))

            c = c.add(mainV)
            d += mainLength
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
    case 1:
      geometry = {
        type: 'LineString',
        coordinates: translatedCoords
      }
      break
    case 2:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(translatedCoords)
      }
      break
    case 3:
    case 4:
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
