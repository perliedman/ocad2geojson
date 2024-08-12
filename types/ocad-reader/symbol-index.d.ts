export = SymbolIndexBlock;
declare class SymbolIndexBlock {
    /**
     * @param {BufferReader} reader
     * @param {number} version
     * @param {import('./').ReadOcadOptions} options
     */
    constructor(reader: BufferReader, version: number, options?: import("./").ReadOcadOptions);
    /**
     * @type {number}
     */
    nextSymbolIndexBlock: number;
    /**
     * @type {number[]}
     */
    symbolPosition: number[];
    /**
     * @type {string[]}
     */
    warnings: string[];
    version: number;
    options: import("./").ReadOcadOptions;
    /**
     * @param {BufferReader} reader
     * @returns {Symbol[]}
     */
    parseSymbols(reader: BufferReader): Symbol[];
    /**
     * @param {BufferReader} reader
     * @param {number} offset
     * @returns {Symbol}
     */
    parseSymbol(reader: BufferReader, offset: number): Symbol;
}
declare namespace SymbolIndexBlock {
    export { BufferReader, Symbol };
}
type BufferReader = import("./buffer-reader");
type Symbol = import("./symbol").BaseSymbolDef;
