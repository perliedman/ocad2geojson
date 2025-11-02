/**
 * @typedef {import('../node_modules/ava/types/test-fn').ExecutionContext} ExecutionContext
 */
const path = require('path')
/** @type {import('ava').default} */
const test = require('ava')
const { readOcad } = require('..')

const { Buffer } = require('buffer')

test('too small files can not be opened', async (/** @type {ExecutionContext} */ t) => {
  await t.throwsAsync(() => readOcad(Buffer.alloc(10)))
})

test('can open valid file', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  t.is(12, map.header.version, 'Version mismatch')
  t.is(0, map.header.subVersion, 'Subversion mismatch')
  t.is(0, map.header.subSubVersion, 'Subsubversion mismatch')
  t.is(4164, map.header.symbolIndexBlock, 'First symbol index block')
  t.is(5196, map.header.objectIndexBlock, 'First object index block')
})

test('can read symbols from file', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  t.is(map.symbols.length, 289)
})

test('can read objects from file', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  t.is(map.objects.length, 2)
})

test('can get CRS', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const crs = map.getCrs()
  t.is(316000, crs.easting)
  t.is(6404000, crs.northing)
  t.is(15000, crs.scale)
  t.is(3006, crs.code)
  t.is('EPSG', crs.catalog)
})

test('can convert to projected CRS', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const crs = map.getCrs()
  t.deepEqual([316000, 6404000], crs.toProjectedCoord([0, 0]))
})

test('can convert to map coord', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const crs = map.getCrs()
  t.deepEqual([0, 0], crs.toMapCoord([316000, 6404000]))
})
