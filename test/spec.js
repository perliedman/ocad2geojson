const path = require('path')
const {test} = require('ava')
const ocad2geojson = require('../')

const {Buffer} = require('buffer')

test('too small files can not be opened', async t => {
  await t.throws(ocad2geojson(Buffer.alloc(10)))
})

test('can open valid file', async t => {
  await t.notThrows(ocad2geojson(path.join(__dirname, 'data', 'Tuve_Databas_075.ocd')))
})
