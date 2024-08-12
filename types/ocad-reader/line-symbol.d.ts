declare namespace _exports {
    export { SymbolElement, BaseSymbolProps, DecreaseDef10, DecreaseDef11, DecreaseDef, LineSymbolType, LineSymbol, BufferReader };
}
declare const _exports: {
    10: typeof LineSymbol10;
    11: typeof LineSymbol11;
    12: typeof LineSymbol11;
    2018: typeof LineSymbol11;
};
export = _exports;
type SymbolElement = import("./symbol-element");
type BaseSymbolProps = import("./symbol").BaseSymbolProps;
type DecreaseDef10 = {
    decMode: number;
    decLast: number;
    res: number;
};
type DecreaseDef11 = {
    decMode: number;
    decSymbolSize: number;
    decSymbolDistance: boolean;
    decSymbolWidth: boolean;
};
type DecreaseDef = DecreaseDef10 | Decrease11;
type LineSymbolType = {
    type: 2;
    lineColor: number;
    lineWidth: number;
    lineStyle: number;
    distFromStart: number;
    distToEnd: number;
    mainLength: number;
    endLength: number;
    mainGap: number;
    secGap: number;
    endGap: number;
    minSym: number;
    nPrimSym: number;
    primSymDist: number;
    doubleLine: BaseDoubleLine;
    decrease: DecreaseDef;
    frColor: number;
    frWidth: number;
    frStyle: number;
    primDSize: number;
    secDSize: number;
    cornerDSize: number;
    startDSize: number;
    endDSize: number;
    useSymbolFlags: number;
    reserved: number;
    primSymElements: SymbolElement[];
    secSymElements: SymbolElement[];
    cornerSymElements: SymbolElement[];
    startSymElements: SymbolElement[];
    endSymElements: SymbolElement[];
    readElements: (reader: BufferReader, dataSize: number) => SymbolElement[];
};
type LineSymbol = BaseSymbolProps & LineSymbolType;
type BufferReader = import("./buffer-reader");
/**
 * @typedef {import('./symbol-element')} SymbolElement
 */
/**
 * @typedef {import('./symbol').BaseSymbolProps} BaseSymbolProps
 */
/**
 * @typedef {Object} DecreaseDef10
 * @property {number} decMode
 * @property {number} decLast
 * @property {number} res
 */
/**
 * @typedef {Object} DecreaseDef11
 * @property {number} decMode
 * @property {number} decSymbolSize
 * @property {boolean} decSymbolDistance
 * @property {boolean} decSymbolWidth
 * @property {number} decSymbolSize
 */
/**
 * @typedef {DecreaseDef10|Decrease11} DecreaseDef
 */
/**
 * @typedef {object} LineSymbolType
 * @property {2} type
 * @property {number} lineColor
 * @property {number} lineWidth
 * @property {number} lineStyle
 * @property {number} distFromStart
 * @property {number} distToEnd
 * @property {number} mainLength
 * @property {number} endLength
 * @property {number} mainGap
 * @property {number} secGap
 * @property {number} endGap
 * @property {number} minSym
 * @property {number} nPrimSym
 * @property {number} primSymDist

 * @property {BaseDoubleLine} doubleLine
 * @property {DecreaseDef} decrease

 * @property {number} frColor
 * @property {number} frWidth
 * @property {number} frStyle
 * @property {number} primDSize
 * @property {number} secDSize
 * @property {number} cornerDSize
 * @property {number} startDSize
 * @property {number} endDSize
 * @property {number} useSymbolFlags
 * @property {number} reserved

 * @property {SymbolElement[]} primSymElements
 * @property {SymbolElement[]} secSymElements
 * @property {SymbolElement[]} cornerSymElements
 * @property {SymbolElement[]} startSymElements
 * @property {SymbolElement[]} endSymElements
 *
 * @property {(reader: BufferReader, dataSize: number) => SymbolElement[]} readElements
 *
 * @typedef {BaseSymbolProps & LineSymbolType} LineSymbol
 * @property {import('./symbol-types').LineSymbolType} type
 */
/** @typedef {import("./buffer-reader")} BufferReader */
/** @implements {LineSymbolType} */
declare class LineSymbol10 extends Symbol10 implements LineSymbolType {
    /** @type {2} */
    type: 2;
    /** @type {number} */
    lineColor: number;
    /** @type {number} */
    lineWidth: number;
    /** @type {number} */
    lineStyle: number;
    /** @type {number} */
    distFromStart: number;
    /** @type {number} */
    distToEnd: number;
    /** @type {number} */
    mainLength: number;
    /** @type {number} */
    endLength: number;
    /** @type {number} */
    mainGap: number;
    /** @type {number} */
    secGap: number;
    /** @type {number} */
    endGap: number;
    /** @type {number} */
    minSym: number;
    /** @type {number} */
    nPrimSym: number;
    /** @type {number} */
    primSymDist: number;
    /** @type {BaseDoubleLine} */
    doubleLine: BaseDoubleLine;
    /** @type {DecreaseDef} */
    decrease: DecreaseDef;
    /** @type {number} */
    frColor: number;
    /** @type {number} */
    frWidth: number;
    /** @type {number} */
    frStyle: number;
    /** @type {number} */
    primDSize: number;
    /** @type {number} */
    secDSize: number;
    /** @type {number} */
    cornerDSize: number;
    /** @type {number} */
    startDSize: number;
    /** @type {number} */
    endDSize: number;
    /** @type {number} */
    useSymbolFlags: number;
    /** @type {number} */
    reserved: number;
    /** @type {SymbolElement[]} */
    primSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    secSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    cornerSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    startSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    endSymElements: SymbolElement[];
}
/** @implements {LineSymbolType} */
declare class LineSymbol11 extends Symbol11 implements LineSymbolType {
    /** @type {2} */
    type: 2;
    /** @type {number} */
    lineColor: number;
    /** @type {number} */
    lineWidth: number;
    /** @type {number} */
    lineStyle: number;
    /** @type {number} */
    distFromStart: number;
    /** @type {number} */
    distToEnd: number;
    /** @type {number} */
    mainLength: number;
    /** @type {number} */
    endLength: number;
    /** @type {number} */
    mainGap: number;
    /** @type {number} */
    secGap: number;
    /** @type {number} */
    endGap: number;
    /** @type {number} */
    minSym: number;
    /** @type {number} */
    nPrimSym: number;
    /** @type {number} */
    primSymDist: number;
    /** @type {BaseDoubleLine} */
    doubleLine: BaseDoubleLine;
    /** @type {DecreaseDef} */
    decrease: DecreaseDef;
    /** @type {number} */
    frColor: number;
    /** @type {number} */
    frWidth: number;
    /** @type {number} */
    frStyle: number;
    /** @type {number} */
    primDSize: number;
    /** @type {number} */
    secDSize: number;
    /** @type {number} */
    cornerDSize: number;
    /** @type {number} */
    startDSize: number;
    /** @type {number} */
    endDSize: number;
    /** @type {number} */
    useSymbolFlags: number;
    /** @type {number} */
    reserved: number;
    /** @type {SymbolElement[]} */
    primSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    secSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    cornerSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    startSymElements: SymbolElement[];
    /** @type {SymbolElement[]} */
    endSymElements: SymbolElement[];
}
declare class Decrease11 {
    /**
     * @param {BufferReader} reader
     */
    constructor(reader: BufferReader);
    /** @type {number} */
    decMode: number;
    /** @type {number} */
    decSymbolSize: number;
    /** @type {boolean} */
    decSymbolDistance: boolean;
    /** @type {boolean} */
    decSymbolWidth: boolean;
}
declare class BaseDoubleLine {
    /**
     * @param {BufferReader} reader
     */
    constructor(reader: BufferReader);
    /** @type {number} */
    dblMode: number;
    /** @type {number} */
    dblFlags: number;
    /** @type {number} */
    dblFillColor: number;
    /** @type {number} */
    dblLeftColor: number;
    /** @type {number} */
    dblRightColor: number;
    /** @type {number} */
    dblWidth: number;
    /** @type {number} */
    dblLeftWidth: number;
    /** @type {number} */
    dblRightWidth: number;
    /** @type {number} */
    dblLength: number;
    /** @type {number} */
    dblGap: number;
}
import { Symbol10 } from "./symbol";
import { Symbol11 } from "./symbol";
