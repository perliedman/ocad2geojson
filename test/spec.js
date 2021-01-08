const path = require('path')
const test = require('ava')
const { readOcad, ocadToGeoJson, ocadToSvg } = require('../')

const { Buffer } = require('buffer')
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
      x => x.tagName == 'path'
    )
  )
})
