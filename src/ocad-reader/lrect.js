module.exports = class LRect {
  constructor(reader) {
    this.min = {
      x: reader.readInteger(),
      y: reader.readInteger(),
    }
    this.max = {
      x: reader.readInteger(),
      y: reader.readInteger(),
    }
  }
}
