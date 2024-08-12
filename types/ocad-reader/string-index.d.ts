export = StringIndexBlock;
declare class StringIndexBlock {
    /**
     * @type {Object.<number, { pos: number, len: number, recType: number, objIndex: number }>}
     */
    constructor(reader: any);
    /**
     * @type {number}
     */
    nextStringIndexBlock: number;
    /**
     * @type {TStringIndex[]}
     */
    table: TStringIndex[];
    /**
     * @param {BufferReader} reader
     * @returns {Object.<number, ParameterString[]>}
     */
    getStrings(reader: BufferReader): {
        [x: number]: ParameterString[];
    };
}
declare namespace StringIndexBlock {
    export { BufferReader, TStringIndex };
}
import ParameterString = require("./parameter-string");
type BufferReader = import("./buffer-reader");
type TStringIndex = {
    pos: number;
    len: number;
    recType: number;
    objIndex: number;
};
