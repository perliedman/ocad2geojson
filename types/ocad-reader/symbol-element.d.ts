export = SymbolElement;
declare class SymbolElement {
    /**
     * @param {import('./buffer-reader')} reader
     */
    constructor(reader: import("./buffer-reader"));
    /**
     * @type {number}
     */
    type: number;
    /**
     * @type {number}
     */
    flags: number;
    /**
     * @type {number}
     */
    color: number;
    /**
     * @type {number}
     */
    lineWidth: number;
    /**
     * @type {number}
     */
    diameter: number;
    /**
     * @type {number}
     */
    numberCoords: number;
    /**
     * @type {TdPoly[]}
     */
    coords: TdPoly[];
}
import TdPoly = require("./td-poly");
