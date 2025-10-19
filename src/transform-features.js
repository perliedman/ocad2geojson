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

/** @typedef {import('./ocad-reader/symbol').BaseSymbolDef} Symbol */
/** @typedef {import('./ocad-reader/symbol-element')} SymbolElement */
/** @typedef {import('./ocad-reader/tobject').TObject} TObject */
/** @typedef {import("./ocad-reader/ocad-file")} OcadFile */

/**
 * @typedef {Object} TransformFeaturesOptions
 * @property {boolean=} generateSymbolElements generate features for symbol elements (default: `true`)
 * @property {boolean=} exportHidden export hidden objects (default: `false`)
 * @property {number[]=} includeSymbols only export features from the given symbols;
 *    symbols are identified by their OCAD internal symbol number (for example `40015`, not `400.15`);
 *    if undefined, all symbols will be exported
 * @property {TObject[]=} objects only export the given objects;
 *    if undefined, all objects, filtered by the `exportHidden` option, will be exported
 * @property {import('./ocad-reader/ocad-file').Color[]=} [colors] the colors of the OCAD file
 * @property {number=} [idCount] the current id count
 */

/**
 * @template {Object} T
 * @typedef {function(TransformFeaturesOptions, Record<number, Symbol>, TObject, number): T|null|undefined} CreateObject
 */

/**
 * @template {Object} U
 * @typedef {(symbol: Symbol, name: string, index: number, element: SymbolElement, c: import('./ocad-reader/td-poly'), angle: number, options: TransformFeaturesOptions, object: TObject, objectId: number) => U|null|undefined} CreateElement
 */

/**
 * @template {Object} T result type
 * @template {Object} U element result type
 * @param {OcadFile} ocadFile
 * @param {CreateObject<T>} createObject
 * @param {CreateElement<U>} createElement
 * @param {TransformFeaturesOptions} options
 * @returns {T[]}
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

      if (symbol.startSymElements.length > 0 && object.coordinates.length > 1) {
        const coords = object.coordinates
        const c0 = coords[0]
        const c1 = coords[1]
        const v = c1.sub(c0)
        const angle = Math.atan2(v[1], v[0])
        elements = elements.concat(
          symbol.startSymElements.map((e, i) =>
            createElement(
              symbol,
              'start',
              i,
              e,
              object.coordinates[0],
              angle,
              options,
              object,
              objectIndex
            )
          )
        )
      }

      if (symbol.endSymElements.length > 0 && object.coordinates.length > 1) {
        const coords = object.coordinates
        const c0 = coords[coords.length - 2]
        const c1 = coords[coords.length - 1]
        const v = c1.sub(c0)
        const angle = Math.atan2(v[1], v[0])
        elements = elements.concat(
          symbol.endSymElements.map((e, i) =>
            createElement(
              symbol,
              'start',
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

  return elements
}
