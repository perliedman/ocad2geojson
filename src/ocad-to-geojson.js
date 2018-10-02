const { coordEach } = require('@turf/meta')

const defaultOptions = {
  assignIds: true,
  applyCrs: true
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }
  const features = ocadFile.objects.map(tObjectToGeoJson).filter(f => f)
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

const applyCrs = (featureCollection, crs) => {
  // OCAD uses 1/100 mm of "paper coordinates" as units, we
  // want to convert to meters in real world
  const hundredsMmToMeter = 1 / (100 * 1000)

  coordEach(featureCollection, coord => {
    coord[0] = (coord[0] * hundredsMmToMeter) * crs.scale + crs.easting
    coord[1] = (coord[1] * hundredsMmToMeter) * crs.scale + crs.northing
  })
}
