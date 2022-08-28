const path = require('path')
const test = require('ava')
const { readOcad, ocadToGeoJson, ocadToSvg } = require('../')

const { Buffer } = require('buffer')
const { coordEach } = require('@turf/meta')
const { readdirSync } = require('fs')
const DOMImplementation = new (require('xmldom').DOMImplementation)()

test('too small files can not be opened', async t => {
  await t.throwsAsync(() => readOcad(Buffer.alloc(10)))
})

test('can open valid file', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  t.is(12, map.header.version, 'Version mismatch')
  t.is(0, map.header.subVersion, 'Subversion mismatch')
  t.is(0, map.header.subSubVersion, 'Subsubversion mismatch')
  t.is(4164, map.header.symbolIndexBlock, 'First symbol index block')
  t.is(5196, map.header.objectIndexBlock, 'First object index block')
})

test('can read symbols from file', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  t.is(map.symbols.length, 289)
})

test('can read objects from file', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  t.is(map.objects.length, 2)
})

test('can convert GeoJSON', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const geoJson = ocadToGeoJson(map)

  t.is('FeatureCollection', geoJson.type)
  t.is(2, geoJson.features.length)

  const triangleFeature = geoJson.features[0]
  t.is('Feature', triangleFeature.type)
  t.is('Polygon', triangleFeature.geometry.type)
  t.is(1, triangleFeature.geometry.coordinates.length)
  t.is(4, triangleFeature.geometry.coordinates[0].length)

  const rectangleFeature = geoJson.features[1]
  t.is('Feature', rectangleFeature.type)
  t.is('LineString', rectangleFeature.geometry.type)
  t.is(5, rectangleFeature.geometry.coordinates.length)
})

test('can apply CRS to GeoJSON', async t => {
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

test('can convert limited number of objects', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const geoJson = ocadToGeoJson(map, { objects: map.objects.slice(0, 1) })

  t.is('FeatureCollection', geoJson.type)
  t.is(1, geoJson.features.length)

  const triangleFeature = geoJson.features[0]
  t.is('Feature', triangleFeature.type)
  t.is('Polygon', triangleFeature.geometry.type)
  t.is(1, triangleFeature.geometry.coordinates.length)
  t.is(4, triangleFeature.geometry.coordinates[0].length)
})

test('can convert to SVG', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
  })

  t.is('svg', svgDoc.tagName)
  t.is('defs', svgDoc.firstChild.tagName)
  t.is(2, svgDoc.firstChild.childNodes.length)
  t.truthy(
    Array.from(svgDoc.firstChild.childNodes).every(x => x.tagName === 'pattern')
  )
  const mainGroup = svgDoc.childNodes[1]
  t.is('g', mainGroup.tagName)
  t.is(2, mainGroup.childNodes.length)
  t.is('path', mainGroup.childNodes[0].tagName)
  t.is('g', mainGroup.childNodes[1].tagName)
  t.truthy(
    Array.from(mainGroup.childNodes[1].childNodes).every(
      x => x.tagName === 'path'
    )
  )
})

test('can get CRS', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const crs = map.getCrs()
  t.is(316000, crs.easting)
  t.is(6404000, crs.northing)
  t.is(15000, crs.scale)
  t.is(3006, crs.code)
  t.is('EPSG', crs.catalog)
})

test('can convert to projected CRS', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const crs = map.getCrs()
  t.deepEqual([316000, 6404000], crs.toProjectedCoord([0, 0]))
})

test('can convert to map coord', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const crs = map.getCrs()
  t.deepEqual([0, 0], crs.toMapCoord([316000, 6404000]))
})

test('can filter symbols', async t => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  let geoJson = ocadToGeoJson(map, { includeSymbols: [709003] })
  t.is(1, geoJson.features.length)
  geoJson = ocadToGeoJson(map, { includeSymbols: [709004] })
  t.is(0, geoJson.features.length)
})

test('can open all local test maps', async t => {
  const localDir = path.join(__dirname, 'data', 'local')
  const files = readdirSync(localDir).filter(f => f.endsWith('.ocd'))
  for (const file of files) {
    try {
      t.truthy(await readOcad(path.join(localDir, file)))
    } catch (e) {
      t.fail(`Failed to read ${file}: ${e}`)
    }
  }
})
