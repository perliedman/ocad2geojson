declare namespace _exports {
    export { BufferReader, TextSymbolProps, TextSymbolDef };
}
declare const _exports: {
    10: typeof TextSymbol10;
    11: typeof TextSymbol11;
    12: typeof TextSymbol11;
    2018: typeof TextSymbol11;
    VerticalAlignBottom: number;
    VerticalAlignMiddle: number;
    VerticalAlignTop: number;
    HorizontalAlignLeft: number;
    HorizontalAlignCenter: number;
    HorizontalAlignRight: number;
    HorizontalAlignAllLine: number;
};
export = _exports;
type BufferReader = import("./buffer-reader");
type TextSymbolProps = {
    type: 4;
    fontName: string;
    fontColor: number;
    fontSize: number;
    weight: number;
    italic: boolean;
    res1: number;
    charSpace: number;
    wordSpace: number;
    alignment: number;
    lineSpace: number;
    paraSpace: number;
    indentFirst: number;
    indentOther: number;
    nTabs: number;
    tabs: number[];
    lbOn: boolean;
    lbColor: number;
    lbWidth: number;
    lbDist: number;
    res2: number;
    frMode: number;
    frStyle: number;
    pointSymOn: boolean;
    pointSymNumber: number;
    getHorizontalAlignment: () => number;
    getVerticalAlignment: () => number;
};
type TextSymbolDef = TextSymbolProps & import("./symbol").BaseSymbolProps;
/** @typedef {import('./buffer-reader')} BufferReader */
/**
 * @typedef {object} TextSymbolProps
 * @property {4} type
 * @property {string} fontName
 * @property {number} fontColor
 * @property {number} fontSize
 * @property {number} weight
 * @property {boolean} italic
 * @property {number} res1
 * @property {number} charSpace
 * @property {number} wordSpace
 * @property {number} alignment
 * @property {number} lineSpace
 * @property {number} paraSpace
 * @property {number} indentFirst
 * @property {number} indentOther
 * @property {number} nTabs
 * @property {number[]} tabs
 * @property {boolean} lbOn
 * @property {number} lbColor
 * @property {number} lbWidth
 * @property {number} lbDist
 * @property {number} res2
 * @property {number} frMode
 * @property {number} frStyle
 * @property {boolean} pointSymOn
 * @property {number} pointSymNumber
 * @property {() => number} getHorizontalAlignment
 * @property {() => number} getVerticalAlignment
 */
/** @typedef {TextSymbolProps & import('./symbol').BaseSymbolProps} TextSymbolDef */
/** @implements {TextSymbolDef} */
declare class TextSymbol10 extends Symbol10 implements TextSymbolDef {
    /**
     * @type {4}
     */
    type: 4;
    /**
     * @type {string}
     */
    fontName: string;
    /**
     * @type {number}
     */
    fontColor: number;
    /**
     * @type {number}
     */
    fontSize: number;
    /**
     * @type {number}
     */
    weight: number;
    /**
     * @type {boolean}
     */
    italic: boolean;
    /**
     * @type {number}
     */
    res1: number;
    /**
     * @type {number}
     */
    charSpace: number;
    /**
     * @type {number}
     */
    wordSpace: number;
    /**
     * @type {number}
     */
    alignment: number;
    /**
     * @type {number}
     */
    lineSpace: number;
    /**
     * @type {number}
     */
    paraSpace: number;
    /**
     * @type {number}
     */
    indentFirst: number;
    /**
     * @type {number}
     */
    indentOther: number;
    /**
     * @type {number}
     */
    nTabs: number;
    /**
     * @type {number[]}
     */
    tabs: number[];
    /**
     * @type {boolean}
     */
    lbOn: boolean;
    /**
     * @type {number}
     */
    lbColor: number;
    /**
     * @type {number}
     */
    lbWidth: number;
    /**
     * @type {number}
     */
    lbDist: number;
    /**
     * @type {number}
     */
    res2: number;
    /**
     * @type {number}
     */
    frMode: number;
    /**
     * @type {number}
     */
    frStyle: number;
    /**
     * @type {boolean}
     */
    pointSymOn: boolean;
    /**
     * @type {number}
     */
    pointSymNumber: number;
    getVerticalAlignment(): number;
    getHorizontalAlignment(): number;
}
/** @implements {TextSymbolDef} */
declare class TextSymbol11 extends Symbol11 implements TextSymbolDef {
    constructor(reader: any);
    /**
     * @type {4}
     */
    type: 4;
    /**
     * @type {string}
     */
    fontName: string;
    /**
     * @type {number}
     */
    fontColor: number;
    /**
     * @type {number}
     */
    fontSize: number;
    /**
     * @type {number}
     */
    weight: number;
    /**
     * @type {boolean}
     */
    italic: boolean;
    /**
     * @type {number}
     */
    res1: number;
    /**
     * @type {number}
     */
    charSpace: number;
    /**
     * @type {number}
     */
    wordSpace: number;
    /**
     * @type {number}
     */
    alignment: number;
    /**
     * @type {number}
     */
    lineSpace: number;
    /**
     * @type {number}
     */
    paraSpace: number;
    /**
     * @type {number}
     */
    indentFirst: number;
    /**
     * @type {number}
     */
    indentOther: number;
    /**
     * @type {number}
     */
    nTabs: number;
    /**
     * @type {number[]}
     */
    tabs: number[];
    /**
     * @type {boolean}
     */
    lbOn: boolean;
    /**
     * @type {number}
     */
    lbColor: number;
    /**
     * @type {number}
     */
    lbWidth: number;
    /**
     * @type {number}
     */
    lbDist: number;
    /**
     * @type {number}
     */
    res2: number;
    /**
     * @type {number}
     */
    frMode: number;
    /**
     * @type {number}
     */
    frStyle: number;
    /**
     * @type {boolean}
     */
    pointSymOn: boolean;
    /**
     * @type {number}
     */
    pointSymNumber: number;
    getVerticalAlignment(): number;
    getHorizontalAlignment(): number;
}
import { Symbol10 } from "./symbol";
import { Symbol11 } from "./symbol";
