const fs = require('fs')
const { Buffer } = require('buffer')

const FileHeader = require('./file-header')
const SymbolIndex = require('./symbol-index')
const ObjectIndex = require('./object-index')
const StringIndex = require('./string-index')
const BufferReader = require('./buffer-reader')
const InvalidObjectIndexBlockException = require('./invalid-object-index-block-exception')
const OcadFile = require('./ocad-file')

module.exports = readOcad

/**
 * @typedef {Object} ReadOcadOptions
 * @property {boolean=} bypassVersionCheck bypass the version check and read the file anyway
 * @property {boolean=} quietWarnings do not print warnings to console
 * @property {boolean=} failOnWarning throw an error if a warning is encountered
 */

/**
 * Reads an OCAD file from the given path or `Buffer` object into an `OcadFile` object.
 *
 * @param {string|Buffer} path the path of the OCAD file or a binary buffer of the OCAD file contents
 * @param {ReadOcadOptions?} options
 * @returns {Promise<OcadFile>} a promise that resolves to an `OcadFile` object
 */
async function readOcad(path, options = {}) {
  if (Buffer.isBuffer(path)) {
    return parseOcadBuffer(path, options)
  } else {
    const buffer = await new Promise((resolve, reject) =>
      fs.readFile(path, (err, buffer) => {
        if (err) reject(err)

        resolve(buffer)
      })
    )
    return parseOcadBuffer(buffer, options)
  }
}

function parseOcadBuffer(buffer, options) {
  let warnings = []

  const reader = new BufferReader(buffer)
  const header = new FileHeader(reader)
  if (!header.isValid()) {
    throw new Error(
      `Not an OCAD file (invalid header ${header.ocadMark} !== ${0x0cad})`
    )
  }

  if (header.version < 10 && !options.bypassVersionCheck) {
    throw new Error(
      `Unsupport OCAD file version (${header.version}), only >= 10 supported for now.`
    )
  }

  /**
   * @type {import('./symbol-index').Symbol[]}
   */
  const symbols = []
  let symbolIndexOffset = header.symbolIndexBlock
  while (symbolIndexOffset) {
    reader.push(symbolIndexOffset)
    const symbolIndex = new SymbolIndex(reader, header.version, options)
    reader.pop()
    Array.prototype.push.apply(symbols, symbolIndex.parseSymbols(reader))
    warnings = warnings.concat(symbolIndex.warnings)

    symbolIndexOffset = symbolIndex.nextSymbolIndexBlock
  }

  const objects = []
  let objectIndexOffset = header.objectIndexBlock
  let startIndex = 0
  while (objectIndexOffset) {
    reader.push(objectIndexOffset)
    try {
      const objectIndex = new ObjectIndex(reader, startIndex, header.version)
      startIndex += 256
      reader.pop()
      Array.prototype.push.apply(objects, objectIndex.readObjects(reader))

      objectIndexOffset = objectIndex.nextObjectIndexBlock
    } catch (e) {
      if (e instanceof InvalidObjectIndexBlockException) {
        warnings.push(e.toString())
      }
    }
  }

  /**
   * @type {Object.<number, import('./parameter-string').ParameterStringValues[]>}
   */
  const parameterStrings = {}
  let stringIndexOffset = header.stringIndexBlock
  while (stringIndexOffset) {
    reader.push(stringIndexOffset)
    const stringIndex = new StringIndex(reader)
    reader.pop()
    const strings = stringIndex.getStrings(reader)

    for (const recType of Object.keys(strings)) {
      const typeStrings = strings[recType]
      const concatStrings = parameterStrings[recType] || []
      parameterStrings[recType] = concatStrings.concat(
        typeStrings.map(s => s.values)
      )
    }

    stringIndexOffset = stringIndex.nextStringIndexBlock
  }

  if (!options.quietWarnings) {
    warnings.forEach(w => console.warn(w))
  }

  return new OcadFile(header, parameterStrings, objects, symbols, warnings)
}
