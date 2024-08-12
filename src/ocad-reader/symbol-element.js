const TdPoly = require('./td-poly')
const InvalidSymbolElementException = require('./invalid-symbol-element-exception')

/**
 * @class SymbolElement
 * @property {number} type
 * @property {number} flags
 * @property {number} color
 * @property {number} lineWidth
 * @property {number} diameter
 * @property {number} numberCoords
 * @property {TdPoly[]} coords
 */

module.exports = class SymbolElement {
  /**
   * @type {number}
   */
  type
  /**
   * @type {number}
   */
  flags
  /**
   * @type {number}
   */
  color
  /**
   * @type {number}
   */
  lineWidth
  /**
   * @type {number}
   */
  diameter
  /**
   * @type {number}
   */
  numberCoords
  /**
   * @type {TdPoly[]}
   */
  coords

  /**
   * @param {import('./buffer-reader')} reader
   */
  constructor(reader) {
    this.type = reader.readSmallInt()
    this.flags = reader.readWord()
    this.color = reader.readSmallInt()
    this.lineWidth = reader.readSmallInt()
    this.diameter = reader.readSmallInt()
    this.numberCoords = reader.readSmallInt()
    reader.readCardinal() // Reserved

    if (this.type < 1 || this.type > 4) {
      throw new InvalidSymbolElementException(
        `Symbol element with invalid type (${this.type}).`
      )
    }

    if (this.numberCoords >= 0) {
      this.coords = new Array(this.numberCoords)
      for (let j = 0; j < this.numberCoords; j++) {
        this.coords[j] = new TdPoly(reader.readInteger(), reader.readInteger())
      }
    } else {
      // Negative number of coords seems to happen in some files; we ignore it for now.
      throw new InvalidSymbolElementException(
        `Symbol element with invalid (${this.numberCoords}) number of coordinates.`,
        this
      )
    }
  }
}
