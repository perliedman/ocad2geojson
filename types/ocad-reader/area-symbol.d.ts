declare namespace _exports {
    export { BufferReader, SymbolElement, AreaSymbolProps, AreaSymbolDef };
}
declare const _exports: {
    10: typeof AreaSymbol10;
    11: typeof AreaSymbol11;
    12: typeof AreaSymbol12;
    2018: typeof AreaSymbol12;
};
export = _exports;
type BufferReader = import("./buffer-reader");
type SymbolElement = import("./symbol-element");
type AreaSymbolProps = {
    type: 3;
    borderSym: number;
    fillColor: number;
    hatchMode: number;
    hatchColor: number;
    hatchLineWidth: number;
    hatchDist: number;
    hatchAngle1: number;
    hatchAngle2: number;
    fillOn: boolean;
    borderOn: boolean;
    structMode: number;
    structWidth: number;
    structHeight: number;
    structAngle: number;
    structRes: number;
    dataSize: number;
    elements: SymbolElement[];
};
type AreaSymbolDef = import("./symbol").BaseSymbolProps & AreaSymbolProps;
/**
 * @typedef {import('./buffer-reader')} BufferReader
 */
/**
 * @typedef {import('./symbol-element')} SymbolElement
 */
/**
 * @typedef {object} AreaSymbolProps
 *
 * @property {3} type
 * @property {number} borderSym
 * @property {number} fillColor
 * @property {number} hatchMode
 * @property {number} hatchColor
 * @property {number} hatchLineWidth
 * @property {number} hatchDist
 * @property {number} hatchAngle1
 * @property {number} hatchAngle2
 * @property {boolean} fillOn
 * @property {boolean} borderOn
 * @property {number} structMode
 * @property {number} structWidth
 * @property {number} structHeight
 * @property {number} structAngle
 * @property {number} structRes
 * @property {number} dataSize
 * @property {SymbolElement[]} elements
 */
/** @typedef {import('./symbol').BaseSymbolProps & AreaSymbolProps} AreaSymbolDef */
/** @implements {AreaSymbolDef} */
declare class AreaSymbol10 extends Symbol10 implements AreaSymbolDef {
    /**
     * @type {3}
     */
    type: 3;
    /**
     * @type {number}
     */
    borderSym: number;
    /**
     * @type {number}
     */
    fillColor: number;
    /**
     * @type {number}
     */
    hatchMode: number;
    /**
     * @type {number}
     */
    hatchColor: number;
    /**
     * @type {number}
     */
    hatchLineWidth: number;
    /**
     * @type {number}
     */
    hatchDist: number;
    /**
     * @type {number}
     */
    hatchAngle1: number;
    /**
     * @type {number}
     */
    hatchAngle2: number;
    /**
     * @type {boolean}
     */
    fillOn: boolean;
    /**
     * @type {boolean}
     */
    borderOn: boolean;
    /**
     * @type {number}
     */
    structMode: number;
    /**
     * @type {number}
     */
    structWidth: number;
    /**
     * @type {number}
     */
    structHeight: number;
    /**
     * @type {number}
     */
    structAngle: number;
    /**
     * @type {number}
     */
    structRes: number;
    /**
     * @type {number}
     */
    dataSize: number;
    /**
     * @type {SymbolElement[]}
     */
    elements: SymbolElement[];
}
/** @implements {AreaSymbolDef} */
declare class AreaSymbol11 extends Symbol11 implements AreaSymbolDef {
    /**
     * @type {3}
     */
    type: 3;
    borderSym: number;
    fillColor: number;
    hatchMode: number;
    hatchColor: number;
    hatchLineWidth: number;
    hatchDist: number;
    hatchAngle1: number;
    hatchAngle2: number;
    fillOn: boolean;
    borderOn: boolean;
    structMode: number;
    structWidth: number;
    structHeight: number;
    structAngle: number;
    structRes: number;
    dataSize: number;
    elements: import("./symbol-element")[];
}
/** @implements {AreaSymbolDef} */
declare class AreaSymbol12 extends Symbol11 implements AreaSymbolDef {
    /**
     * @type {3}
     */
    type: 3;
    borderSym: number;
    fillColor: number;
    hatchMode: number;
    hatchColor: number;
    hatchLineWidth: number;
    hatchDist: number;
    hatchAngle1: number;
    hatchAngle2: number;
    fillOn: boolean;
    borderOn: boolean;
    structMode: number;
    structDraw: number;
    structWidth: number;
    structHeight: number;
    structAngle: number;
    structIrregularVarX: number;
    structIrregularVarY: number;
    structIrregularMinDist: number;
    structRes: number;
    dataSize: number;
    elements: import("./symbol-element")[];
}
import { Symbol10 } from "./symbol";
import { Symbol11 } from "./symbol";
