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
      const rings = []
      let currentRing = []
      rings.push(currentRing)
      for (let i = 0; i < object.coordinates.length; i++) {
        const c = object.coordinates[i]
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

      geometry = {
        type: 'Polygon',
        coordinates: rings
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
  const elements = []

  if (!symbol) return elements

  switch (symbol.type) {
    case 2:
      if (symbol.primSymElements.length > 0) {
        const coords = feature.geometry.coordinates
        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = vSub(c1, c0)
          const u = vUnit(v)
          const segmentLength = vLength(v)
          const mainLength = symbol.mainLength
          const endLength = symbol.endLength

          let d = endLength
          let c = vAdd(c0, vMul(u, endLength))
          const mainV = vMul(u, mainLength)
          while (d < segmentLength) {
            elements.push(createElement(symbol, feature, symbol.primSymElements, c))

            c = vAdd(c, mainV)
            d += mainLength
          }
        }
      }
  }

  return elements
}

const createElement = (symbol, parentFeature, element, c) => ({
  type: 'Feature',
  properties: {
    element: `${symbol.symNum}-prim`,
    parentId: parentFeature.id
  },
  geometry: {
    type: 'Point',
    coordinates: c
  }
})

const applyCrs = (featureCollection, crs) => {
  // OCAD uses 1/100 mm of "paper coordinates" as units, we
  // want to convert to meters in real world
  const hundredsMmToMeter = 1 / (100 * 1000)

  coordEach(featureCollection, coord => {
    coord[0] = (coord[0] * hundredsMmToMeter) * crs.scale + crs.easting
    coord[1] = (coord[1] * hundredsMmToMeter) * crs.scale + crs.northing
  })
}

const vLength = (v) => {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

const vAdd = (c0, c1) => {
  return [c0[0] + c1[0], c0[1] + c1[1]]
}

const vSub = (c0, c1) => {
  return [c0[0] - c1[0], c0[1] - c1[1]]
}

const vMul = (v, f) => [v[0] * f, v[1] * f]

const vUnit = (v) => {
  const l = vLength(v)
  return [v[0] / l, v[1] / l]
}
