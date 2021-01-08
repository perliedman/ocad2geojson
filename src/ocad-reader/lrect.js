const Block = require('./block')

module.exports = class LRect extends Block {
  constructor(buffer, offset) {
    super(buffer, offset)
    this.min = {
      x: this.readInteger(),
      y: this.readInteger(),
    }
    this.max = {
      x: this.readInteger(),
      y: this.readInteger(),
    }
  }

  size() {
    return 16
  }
}
