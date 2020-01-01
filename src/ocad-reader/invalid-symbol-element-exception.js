module.exports = class InvalidSymbolElementException extends Error {
  constructor (msg, symbolElement) {
    super(msg)
    this.symbolElement = symbolElement
  }
}
