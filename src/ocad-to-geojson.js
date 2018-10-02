const { coordEach } = require('@turf/meta')

module.exports = function (ocadFile, options) {
  options = options || {}
  const features = ocadFile.objects.map(tObjectToGeoJson).filter(f => f)
  const featureCollection = {
    type: 'FeatureCollection',
    features
  }

  if (options.assignIds || options.assignIds === undefined) {
    features.forEach((o, i) => {
      o.id = i + 1
    })
  }

  if (ocadFile.parameterStrings['1039'] && (options.applyCrs || options.applyCrs === undefined)) {
    applyCrs(featureCollection, ocadFile.parameterStrings['1039'][0])
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

const applyCrs = (featureCollection, scalePar) => {
  // OCAD uses 1/100 mm of "paper coordinates" as units, we
  // want to convert to meters in real world
  const hundredsMmToMeter = 1 / (100 * 1000)
  let { x, y, m } = scalePar

  // Easting (meters)
  x = Number(x)
  // Northing (meters)
  y = Number(y)
  // Map scale
  m = Number(m)

  coordEach(featureCollection, coord => {
    coord[0] = (coord[0] * hundredsMmToMeter) * m + x
    coord[1] = (coord[1] * hundredsMmToMeter) * m + y
  })
}
