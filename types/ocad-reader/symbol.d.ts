export type BufferReader = import("./buffer-reader");
export type SymbolType = import("./symbol-types").SymbolType;
export type BaseSymbolProps = {
    warnings: Error[];
    size: number;
    symNum: number;
    number: string;
    otp: number;
    flags: number;
    selected: boolean;
    status: number;
    preferredDrawingTool: number;
    csMode: number;
    csObjType: number;
    csCdFlags: number;
    extent: number;
    filePos: number;
    group: number;
    nColors: number;
    colors: number[];
    description: string;
    iconBits: number[];
    isHidden: () => boolean;
};
export type AreaSymbol = import("./area-symbol").AreaSymbolDef;
export type LineSymbol = import("./line-symbol").LineSymbol;
export type PointSymbol = import("./point-symbol").PointSymbolDef;
export type TextSymbol = import("./text-symbol").TextSymbolDef;
export type BaseSymbolDef = AreaSymbol | LineSymbol | PointSymbol | TextSymbol;
export class Symbol10 extends BaseSymbol {
    colors: any[];
    iconBits: any[];
}
export class Symbol11 extends BaseSymbol {
    colors: any[];
    iconBits: any[];
    symbolTreeGroup: any[];
}
/**
 * @typedef {import('./buffer-reader')} BufferReader
 */
/**
 * @typedef {import('./symbol-types').SymbolType} SymbolType
 */
/**
 * @typedef {Object} BaseSymbolProps
 * @property  {Error[]} warnings
 * @property  {number} size
 * @property  {number} symNum
 * @property  {string} number
 * @property  {number} otp
 * @property  {number} flags
 * @property  {boolean} selected
 * @property  {number} status
 * @property  {number} preferredDrawingTool
 * @property  {number} csMode
 * @property  {number} csObjType
 * @property  {number} csCdFlags
 * @property  {number} extent
 * @property  {number} filePos
 * @property  {number} group
 * @property  {number} nColors
 * @property  {number[]} colors
 * @property  {string} description
 * @property  {number[]} iconBits
 * @property {() => boolean} isHidden
 */
/**
 * @typedef {import('./area-symbol').AreaSymbolDef} AreaSymbol
 */
/**
 * @typedef {import('./line-symbol').LineSymbol} LineSymbol
 */
/**
 * @typedef {import('./point-symbol').PointSymbolDef} PointSymbol
 */
/**
 * @typedef {import('./text-symbol').TextSymbolDef} TextSymbol
 */
/**
 * @typedef {AreaSymbol|LineSymbol|PointSymbol|TextSymbol} BaseSymbolDef
 */
declare class BaseSymbol {
    /**
     * @param {BufferReader} reader
     */
    constructor(reader: BufferReader);
    /**
     * @type {Error[]}
     */
    warnings: Error[];
    /**
     * @type {number}
     */
    size: number;
    /**
     * @type {number}
     */
    symNum: number;
    /**
     * @type {string}
     */
    number: string;
    /**
     * @type {number}
     */
    otp: number;
    /**
     * @type {number}
     */
    flags: number;
    /**
     * @type {boolean}
     */
    selected: boolean;
    /**
     * @type {number}
     */
    status: number;
    /**
     * @type {number}
     */
    preferredDrawingTool: number;
    /**
     * @type {number}
     */
    csMode: number;
    /**
     * @type {number}
     */
    csObjType: number;
    /**
     * @type {number}
     */
    csCdFlags: number;
    /**
     * @type {number}
     */
    extent: number;
    /**
     * @type {number}
     */
    filePos: number;
    /**
     * @type {number}
     */
    group: number;
    /**
     * @type {number}
     */
    nColors: number;
    /**
     * @type {number[]}
     */
    colors: number[];
    /**
     * @type {string}
     */
    description: string;
    /**
     * @type {number[]}
     */
    iconBits: number[];
    /**
     * @param {BufferReader} reader
     * @param {number} dataSize
     * @returns {SymbolElement[]}
     */
    readElements(reader: BufferReader, dataSize: number): SymbolElement[];
    isHidden(): boolean;
}
import SymbolElement = require("./symbol-element");
export {};
