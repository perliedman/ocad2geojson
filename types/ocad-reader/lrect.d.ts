export = LRect;
declare class LRect {
    /**
     * @param {import('./buffer-reader')} reader
     */
    constructor(reader: import("./buffer-reader"));
    /**
     * @type {TdPoly}
     */
    min: TdPoly;
    /**
     * @type {TdPoly}
     */
    max: TdPoly;
}
import TdPoly = require("./td-poly");
