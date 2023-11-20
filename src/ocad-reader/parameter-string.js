const { StringDecoder } = require('string_decoder')

const decoder = new StringDecoder('utf8')

/**
 * @typedef {string|string[]} StringIndexValue
 */

/**
 * @typedef {{ _first: string, _pairs: { code: string, value: StringIndexValue }[]}} SourceValues
 */

/** @typedef {import("./buffer-reader")} BufferReader */
/** @typedef {import("./string-index").TStringIndex} TStringIndex */
/**
 * @typedef {{[key: string]: string|string[]} & SourceValues } ParameterStringValues
 */

/**
 * Represents an OCAD parameter string. The string has the following format:
 * ```
 * <first value>\t<code1><value1>\t<code2><value2>\t...
 * ```
 *
 * The values can be accessed through the `values` property. The first value is
 * stored in the `_first` property. The code-value pairs are stored in the
 * `_pairs` property.
 */
module.exports = class ParameterString {
  /**
   * @type {number}
   */
  recType
  /**
   * @type {ParameterStringValues}
   */
  values

  /**
   * @param {BufferReader} reader
   * @param {TStringIndex} indexRecord
   */
  constructor(reader, indexRecord) {
    this.recType = indexRecord.recType

    const offset = reader.offset
    let strLen = 0
    while (reader.readByte()) strLen++
    const val = decoder.end(reader.buffer.subarray(offset, offset + strLen))

    const vals = val.split('\t')
    this.values = { _first: vals[0], _pairs: [] }
    for (let i = 1; i < vals.length; i++) {
      const code = vals[i][0]
      const value = vals[i].substring(1)
      let codeValues = this.values[code]
      if (!codeValues) {
        this.values[code] = value
      } else {
        if (!Array.isArray(codeValues)) {
          codeValues = this.values[code] = [codeValues]
        }
        codeValues.push(value)
      }

      this.values._pairs.push({ code, value })
    }
  }
}
