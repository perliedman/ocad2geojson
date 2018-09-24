const path = require('path')
const {test} = require('ava')
const ocad2geojson = require('../')

const {Buffer} = require('buffer')

test('too small files can not be opened', async t => {
  await t.throws(ocad2geojson(Buffer.alloc(10)))
})

test('can open valid file', async t => {
  const map = await ocad2geojson(path.join(__dirname, 'data', 'Tuve_Databas_075.ocd'))
  t.is(map.header.version, 12, 'Version mismatch')
  t.is(map.header.subVersion, 2, 'Subversion mismatch')
  t.is(map.header.subSubVersion, 0, 'Subsubversion mismatch')
  t.is(map.header.symbolIndexBlock, 9928, 'First symbol index block')
  t.is(map.header.objectIndexBlock, 199488, 'First object index block')
})

test('can read objects from file', async t => {
  const map = await ocad2geojson(path.join(__dirname, 'data', 'Tuve_Databas_075.ocd'))
  t.is(map.featureCollection.features.length, 15546)
})
