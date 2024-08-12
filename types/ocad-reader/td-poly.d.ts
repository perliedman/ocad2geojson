export = TdPoly;
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
declare class TdPoly extends Array<number> {
    /**
     * @param {number} ocadX
     * @param {number} ocadY
     * @param {number} [xFlags]
     * @param {number} [yFlags]
     */
    constructor(ocadX: number, ocadY: number, xFlags?: number, yFlags?: number);
    /**
     * @type {number}
     */
    xFlags: number;
    /**
     * @type {number}
     */
    yFlags: number;
    isFirstBezier(): boolean;
    isSecondBezier(): boolean;
    hasNoLeftLine(): number;
    isBorderOrVirtualLine(): boolean;
    isCornerPoint(): boolean;
    isFirstHolePoint(): boolean;
    hasNoRightLine(): number;
    isDashPoint(): boolean;
    vLength(): number;
    add(c1: any): TdPoly;
    sub(c1: any): TdPoly;
    mul(f: any): TdPoly;
    unit(): TdPoly;
    rotate(theta: any): TdPoly;
}
declare namespace TdPoly {
    /**
     * Instantiate a TdPoly from a pair of coordinates.
     * @param {number} x
     * @param {number} y
     * @returns {TdPoly}
     */
    function fromCoords(x: number, y: number): TdPoly;
}
