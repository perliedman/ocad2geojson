const flatten = require('arr-flatten')
const {
  PointSymbolType,
  LineSymbolType,
} = require('./ocad-reader/symbol-types')

const defaultOptions = {
  generateSymbolElements: true,
  exportHidden: false,
}

module.exports = transformFeatures

/**
 * @typedef {Object} TransformFeaturesOptions
 * @property {boolean?} generateSymbolElements generate features for symbol elements (default: `true`)
 * @property {boolean?} exportHidden export hidden objects (default: `false`)
 * @property {number[]?} includeSymbols only export features from the given symbols;
 *    symbols are identified by their OCAD internal symbol number (for example `40015`, not `400.15`);
 *    if undefined, all symbols will be exported
 * @property {import("./ocad-reader/tobject").TObject} objects only export the given objects;
 *    if undefined, all objects, filtered by the `exportHidden` option, will be exported
 */

function transformFeatures(ocadFile, createObject, createElement, options) {
  options = {
    ...defaultOptions,
    ...options,
    colors: ocadFile.colors,
    idCount: ocadFile.objects.length,
  }

  const symbols = ocadFile.symbols
    .filter(
      s =>
        !options.includeSymbols ||
        options.includeSymbols.find(symNum => symNum === s.symNum)
    )
    .reduce((ss, s) => {
      ss[s.symNum] = s
      return ss
    }, {})

  const objects = options.objects || ocadFile.objects
  let features = objects
    .map(createObject.bind(null, options, symbols))
    .filter(f => f)

  if (options.generateSymbolElements) {
    const elementFeatures = objects.map(
      generateSymbolElements.bind(null, createElement, options, symbols)
    )

    features = features.concat(flatten(elementFeatures)).filter(f => f)
  }

  return features
}

const generateSymbolElements = (
  createElement,
  options,
  symbols,
  object,
  objectIndex
) => {
  const symbol = symbols[object.sym]
  let elements = []

  if (!symbol || (!options.exportHidden && symbol.isHidden())) return

  switch (symbol.type) {
    case PointSymbolType: {
      const angle = object.ang ? (object.ang / 10 / 180) * Math.PI : 0
      elements = symbol.elements.map((e, i) =>
        createElement(
          symbol,
          'element',
          i,
          e,
          object.coordinates[0],
          angle,
          options,
          object,
          objectIndex
        )
      )
      break
    }
    case LineSymbolType:
      if (symbol.primSymElements.length > 0 && symbol.mainLength > 0) {
        const coords = object.coordinates
        const endLength = symbol.endLength
        const mainLength = symbol.mainLength
        const spotDist = symbol.primSymDist

        let d = endLength

        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          const u = v.unit()
          const segmentLength = v.vLength()

          let c = c0.add(u.mul(d))
          let j = 0
          while (d < segmentLength) {
            elements = elements.concat(
              symbol.primSymElements.map((e, i) =>
                createElement(
                  symbol,
                  'prim',
                  i,
                  e,
                  c,
                  angle,
                  options,
                  object,
                  objectIndex
                )
              )
            )

            j++
            const step = spotDist && j % symbol.nPrimSym ? spotDist : mainLength

            c = c.add(u.mul(step))
            d += step
          }

          d -= segmentLength
        }
      }

      if (symbol.cornerSymElements.length > 0) {
        const coords = object.coordinates
        for (let i = 1; i < coords.length - 1; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          elements = elements.concat(
            symbol.cornerSymElements.map((e, i) =>
              createElement(
                symbol,
                'corner',
                i,
                e,
                c1,
                angle,
                options,
                object,
                objectIndex
              )
            )
          )
        }
      }
  }

  return elements
}
