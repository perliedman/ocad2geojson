export = ParameterString;
declare class ParameterString {
    /**
     * @param {BufferReader} reader
     * @param {TStringIndex} indexRecord
     */
    constructor(reader: BufferReader, indexRecord: TStringIndex);
    /**
     * @type {number}
     */
    recType: number;
    /**
     * @type {ParameterStringValues}
     */
    values: ParameterStringValues;
}
declare namespace ParameterString {
    export { StringIndexValue, SourceValues, BufferReader, TStringIndex, ParameterStringValues };
}
type StringIndexValue = string | string[];
type SourceValues = {
    _first: string;
    _pairs: {
        code: string;
        value: StringIndexValue;
    }[];
};
type BufferReader = import("./buffer-reader");
type TStringIndex = import("./string-index").TStringIndex;
type ParameterStringValues = {
    [key: string]: string | string[];
} & SourceValues;
