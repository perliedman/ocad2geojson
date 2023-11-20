declare namespace _exports {
    export { BufferReader, PointSymbolProps, PointSymbolDef };
}
declare const _exports: {
    10: typeof PointSymbol10;
    11: typeof PointSymbol11;
    12: typeof PointSymbol11;
    2018: typeof PointSymbol11;
};
export = _exports;
type BufferReader = import("./buffer-reader");
type PointSymbolProps = {
    type: 1;
    dataSize: number;
};
type PointSymbolDef = import("./symbol").BaseSymbolProps & PointSymbolProps;
/**
 * @typedef {import('./buffer-reader')} BufferReader
 */
/**
 * @typedef {object} PointSymbolProps
 * @property {1} type
 * @property {number} dataSize
 */
/** @typedef {import('./symbol').BaseSymbolProps & PointSymbolProps} PointSymbolDef */
/** @implements {PointSymbolDef} */
declare class PointSymbol10 extends Symbol10 implements PointSymbolDef {
    /**
     * @type {1}
     */
    type: 1;
    /**
     * @type {number}
     */
    dataSize: number;
    elements: import("./symbol-element")[];
}
/** @implements {PointSymbolDef} */
declare class PointSymbol11 extends Symbol11 implements PointSymbolDef {
    /**
     * @type {1}
     */
    type: 1;
    /**
     * @type {number}
     */
    dataSize: number;
    elements: import("./symbol-element")[];
}
import { Symbol10 } from "./symbol";
import { Symbol11 } from "./symbol";
