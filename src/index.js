const readOcad = require('./ocad-reader')
const ocadToGeoJson = require('./ocad-to-geojson')
const ocadToMapboxGlStyle = require('./ocad-to-mapbox-gl-style')

module.exports = {
  readOcad,
  ocadToGeoJson,
  ocadToMapboxGlStyle
}
