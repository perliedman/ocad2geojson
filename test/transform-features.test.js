/**
 * @typedef {import('../node_modules/ava/types/test-fn').ExecutionContext} ExecutionContext
 */
/** @type {import('ava').default} */
const test = require('ava')
const transformFeatures = require('../src/transform-features')
const {
  PointSymbolType,
  LineSymbolType,
} = require('../src/ocad-reader/symbol-types')

// Minimal stand-ins for the OCAD reader types. `generateSymbolElements` only
// touches `object.coordinates`, `object.ang` and `symbol.elements`/`isHidden`
// for point symbols, so we can mock everything the code path needs.
const makeOcadFile = (/** @type {any} */ symbol, /** @type {any} */ object) => ({
  colors: [],
  symbols: [symbol],
  objects: [object],
})

// We don't care about the primary object features here, only the generated
// symbol element features, so `createObjects` yields nothing.
const createObjects = () => null
// Every element becomes a distinct truthy feature.
const createElement = (
  /** @type {any} */ _symbol,
  /** @type {any} */ name,
  /** @type {any} */ index
) => ({ name, index })

test('generates features for point symbol elements', (/** @type {ExecutionContext} */ t) => {
  const symbol = {
    symNum: 1,
    type: PointSymbolType,
    elements: [{}, {}, {}],
    isHidden: () => false,
  }
  const object = {
    sym: 1,
    ang: 0,
    coordinates: [{}],
  }

  const features = transformFeatures(
    makeOcadFile(symbol, object),
    createObjects,
    createElement,
    {}
  )

  // The point symbol has three elements, so three element features are
  // expected. This currently fails because `generateSymbolElements` returns
  // `undefined` for point symbols (the `return elements` statement was moved
  // inside the `LineSymbolType` case), so no element features are produced.
  t.is(features.length, 3)
})

test('generates features for line symbol start elements', (/** @type {ExecutionContext} */ t) => {
  // Sanity check that the line symbol path still returns its elements, to
  // contrast with the broken point symbol path above.
  const symbol = {
    symNum: 2,
    type: LineSymbolType,
    primSymElements: [],
    cornerSymElements: [],
    startSymElements: [{}, {}],
    endSymElements: [],
    isHidden: () => false,
  }
  const object = {
    sym: 2,
    coordinates: [
      { sub: () => ({ 0: 1, 1: 0 }) },
      { sub: () => ({ 0: 1, 1: 0 }) },
    ],
  }

  const features = transformFeatures(
    makeOcadFile(symbol, object),
    createObjects,
    createElement,
    {}
  )

  t.is(features.length, 2)
})
