/**
 * @typedef {import('../node_modules/ava/types/test-fn').ExecutionContext} ExecutionContext
 */
const path = require('path')
/** @type {import('ava').default} */
const test = require('ava')
const { readOcad, ocadToGeoJson } = require('..')

const { coordEach } = require('@turf/meta')

test('can convert GeoJSON', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const geoJson = ocadToGeoJson(map)

  t.is('FeatureCollection', geoJson.type)
  t.is(2, geoJson.features.length)

  const triangleFeature = geoJson.features[0]
  t.is('Feature', triangleFeature.type)
  t.is('Polygon', triangleFeature.geometry.type)
  if (triangleFeature.geometry.type !== 'Polygon') t.fail('Expected Polygon')
  else {
    const coords = triangleFeature.geometry.coordinates
    t.is(1, coords.length)
    t.is(4, coords[0].length)
  }

  const rectangleFeature = geoJson.features[1]
  t.is('Feature', rectangleFeature.type)
  t.is('LineString', rectangleFeature.geometry.type)
  if (rectangleFeature.geometry.type !== 'LineString')
    t.fail('Expected LineString')
  else {
    const coords = rectangleFeature.geometry.coordinates
    t.is(5, coords.length)
  }
})

test('can apply CRS to GeoJSON', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const geoJson = ocadToGeoJson(map)
  const crs = map.getCrs()

  coordEach(geoJson, c => {
    t.truthy(
      Math.abs(c[0] - crs.easting) < 4000 &&
        Math.abs(c[1] - crs.northing) < 4000
    )
  })
})

test('can convert limited number of objects', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const geoJson = ocadToGeoJson(map, {
    /** @type {import('../types/transform-features').TObject[]} */
    // Narrow pass-through of one object for the conversion test
    objects: /** @type {any} */ (map.objects.slice(0, 1)),
  })

  t.is('FeatureCollection', geoJson.type)
  t.is(1, geoJson.features.length)

  const triangleFeature = geoJson.features[0]
  t.is('Feature', triangleFeature.type)
  t.is('Polygon', triangleFeature.geometry.type)
  if (triangleFeature.geometry.type !== 'Polygon') t.fail('Expected Polygon')
  else {
    const coords = triangleFeature.geometry.coordinates
    t.is(1, coords.length)
    t.is(4, coords[0].length)
  }
})

test('can filter symbols', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  let geoJson = ocadToGeoJson(map, { includeSymbols: [709003] })
  t.is(1, geoJson.features.length)
  geoJson = ocadToGeoJson(map, { includeSymbols: [709004] })
  t.is(0, geoJson.features.length)
})
