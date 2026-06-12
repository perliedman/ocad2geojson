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
 * @typedef {function(TransformFeaturesOptions, Record<number, Symbol>, TObject, number): T[]|null|undefined} CreateObjects
 */

/**
 * @template {Object} U
 * @typedef {(symbol: Symbol, name: string, index: number, element: SymbolElement, c: import('./ocad-reader/td-poly'), angle: number, options: TransformFeaturesOptions, object: TObject, objectId: number) => U|null|undefined} CreateElement
 */

/**
 * @template {Object} T result type
 * @template {Object} U element result type
 * @param {OcadFile} ocadFile
 * @param {CreateObjects<T>} createObjects
 * @param {CreateElement<U>} createElement
 * @param {TransformFeaturesOptions} options
 * @returns {T[]}
 */
function transformFeatures(ocadFile, createObjects, createElement, options) {
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
    .map(createObjects.bind(null, options, symbols))
    .flat()
    .filter(Boolean)

  if (options.generateSymbolElements) {
    const elementFeatures = objects
      .map(generateSymbolElements.bind(null, createElement, options, symbols))
      .flat()

    features = features.concat(elementFeatures).filter(Boolean)
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
  /** @type {number[]} */
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
        let coords = []
        for (let i = 0; i < object.coordinates.length; i++) {
          const coord = object.coordinates[i]
          coords.push(coord)
          if (coord.isCornerPoint()) {
            addPrimSymsAlongLine(coords, symbol)
            coords = [coord]
          }
        }

        if (coords.length > 1) {
          addPrimSymsAlongLine(coords, symbol)
        }
      }

      if (symbol.cornerSymElements.length > 0) {
        const coords = object.coordinates
        for (let i = 1; i < coords.length - 1; i++) {
          const c1 = coords[i]

          if (c1.isCornerPoint()) {
            const c0 = coords[i - 1]
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

      return elements
  }

  /**
   * @param {import('./ocad-reader/td-poly')[]} coords
   * @param {import('./ocad-reader/symbol').LineSymbol} symbol
   */
  function addPrimSymsAlongLine(coords, symbol) {
    const endLength = symbol.endLength
    const mainLength = symbol.mainLength
    const spotDist = symbol.primSymDist
    const nPrimSym = symbol.nPrimSym || 1

    // Total length of the polyline.
    let totalLength = 0
    for (let i = 1; i < coords.length; i++) {
      totalLength += coords[i].sub(coords[i - 1]).vLength()
    }

    // Length occupied by the symbols inside a single group.
    const groupLength = (nPrimSym - 1) * spotDist
    // Length available for distributing the symbol groups, i.e. the line
    // minus the empty space at each end.
    const span = totalLength - 2 * endLength

    // OCAD does not place primary symbols at a fixed `mainLength` stride;
    // it distributes the groups evenly so that the line both starts and
    // ends `endLength` away from a symbol, stretching or compressing the
    // main length to fit a whole number of groups. Build the list of
    // distances (measured from the start of the line) at which an
    // individual primary symbol should be placed.
    const distances = []
    if (span <= groupLength) {
      // The line is too short for the configured spacing: draw the minimum
      // number of groups, centered on the line.
      const nGroups = Math.max(1, symbol.minSym + 1)
      const groupSpacing = nGroups > 1 ? totalLength / (nGroups - 1) : 0
      const start = nGroups > 1 ? 0 : (totalLength - groupLength) / 2
      for (let g = 0; g < nGroups; g++) {
        for (let k = 0; k < nPrimSym; k++) {
          distances.push(start + g * groupSpacing + k * spotDist)
        }
      }
    } else {
      const nGaps = Math.max(
        symbol.minSym,
        Math.round((span - groupLength) / mainLength)
      )
      const nGroups = nGaps + 1
      const groupSpacing = nGroups > 1 ? (span - groupLength) / nGaps : 0
      for (let g = 0; g < nGroups; g++) {
        const groupStart = endLength + g * groupSpacing
        for (let k = 0; k < nPrimSym; k++) {
          distances.push(groupStart + k * spotDist)
        }
      }
    }

    // Walk the polyline and place a symbol at each precomputed distance.
    let di = 0
    let segStart = 0
    for (let i = 1; i < coords.length && di < distances.length; i++) {
      const c0 = coords[i - 1]
      const c1 = coords[i]
      const v = c1.sub(c0)
      const angle = Math.atan2(v[1], v[0])
      const u = v.unit()
      const segEnd = segStart + v.vLength()

      while (di < distances.length && distances[di] <= segEnd + 1e-6) {
        const c = c0.add(u.mul(distances[di] - segStart))
        elements = elements.concat(
          symbol.primSymElements.map((e, idx) =>
            createElement(
              symbol,
              'prim',
              idx,
              e,
              c,
              angle,
              options,
              object,
              objectIndex
            )
          )
        )
        di++
      }

      segStart = segEnd
    }
  }
}
