/**
 * Represents a TDPoly, which is a coordinate pair with optional flags.
 * The class is an array of X and Y coordinates, with the flags stored in
 * the `xFlags` and `yFlags` properties.
 *
 * OCAD coordinates use 1/100 mm units, unmanipulated coordinates from an OCAD
 * file are 24 bit signed integers.
 *
 * @extends {Array<number>}
 */
class TdPoly extends Array {
  /**
   * @type {number}
   */
  xFlags
  /**
   * @type {number}
   */
  yFlags

  /**
   * @param {number} ocadX
   * @param {number} ocadY
   * @param {number} [xFlags]
   * @param {number} [yFlags]
   */
  constructor(ocadX, ocadY, xFlags, yFlags) {
    super(
      xFlags === undefined ? ocadX >> 8 : ocadX,
      yFlags === undefined ? ocadY >> 8 : ocadY
    )
    this.xFlags = xFlags === undefined ? ocadX & 0xff : xFlags
    this.yFlags = yFlags === undefined ? ocadY & 0xff : yFlags
  }

  isFirstBezier() {
    return !!(this.xFlags & 0x01)
  }

  isSecondBezier() {
    return !!(this.xFlags & 0x02)
  }

  hasNoLeftLine() {
    return this.xFlags & 0x04
  }

  isBorderOrVirtualLine() {
    return !!(this.xFlags & 0x08)
  }

  isCornerPoint() {
    return !!(this.yFlags & 0x01)
  }

  isFirstHolePoint() {
    return !!(this.yFlags & 0x02)
  }

  hasNoRightLine() {
    return this.yFlags & 0x04
  }

  isDashPoint() {
    return !!(this.yFlags & 0x08)
  }

  vLength() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1])
  }

  add(c1) {
    return new TdPoly(
      this[0] + c1[0],
      this[1] + c1[1],
      this.xFlags,
      this.yFlags
    )
  }

  sub(c1) {
    return new TdPoly(
      this[0] - c1[0],
      this[1] - c1[1],
      this.xFlags,
      this.yFlags
    )
  }

  mul(f) {
    return new TdPoly(this[0] * f, this[1] * f, this.xFlags, this.yFlags)
  }

  unit() {
    const l = this.vLength()
    return this.mul(1 / l)
  }

  rotate(theta) {
    return new TdPoly(
      this[0] * Math.cos(theta) - this[1] * Math.sin(theta),
      this[0] * Math.sin(theta) + this[1] * Math.cos(theta),
      this.xFlags,
      this.yFlags
    )
  }
}

/**
 * Instantiate a TdPoly from a pair of coordinates.
 * @param {number} x
 * @param {number} y
 * @returns {TdPoly}
 */
TdPoly.fromCoords = (x, y) => new TdPoly(x << 8, y << 8)

module.exports = TdPoly
