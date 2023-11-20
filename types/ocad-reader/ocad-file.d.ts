export = OcadFile;
declare class OcadFile {
    /**
     * @param {OcadHeader} header
     * @param {Object.<number, ParameterStringValues[]>} parameterStrings
     * @param {import('./object-index').TObject[]} objects
     * @param {Symbol[]} symbols
     * @param {string[]} warnings
     */
    constructor(header: OcadHeader, parameterStrings: {
        [x: number]: ParameterStringValues[];
    }, objects: import("./object-index").TObject[], symbols: Symbol[], warnings: string[]);
    /**
     * @type {OcadHeader}
     */
    header: OcadHeader;
    /**
     * @type {Object.<number, ParameterStringValues[]>}
     */
    parameterStrings: {
        [x: number]: ParameterStringValues[];
    };
    /**
     * @type {TObject[]}
     */
    objects: TObject[];
    /**
     * @type {Symbol[]}
     */
    symbols: Symbol[];
    /**
     * @type {string[]}
     */
    warnings: string[];
    /**
     * @type {Color[]}
     */
    colors: Color[];
    getCrs(): Crs;
    getBounds(projection?: (v: any) => any): number[];
}
declare namespace OcadFile {
    export { OcadHeader, TObject, Symbol, ParameterString, ParameterStringValues, Color };
}
import Crs = require("./crs");
type OcadHeader = import("./file-header");
type TObject = {
    TObject: {
        new (reader: import("./tobject").BufferReader, objIndex: import("./tobject").ObjectIndex): {
            objIndex: import("./tobject").ObjectIndex;
            objType: number;
            sym: number;
            otp: number;
            unicode: boolean;
            ang: number;
            col: number;
            lineWidth: number;
            diamFlags: number;
            serverObjectId: number;
            height: number;
            creationDate: number;
            multirepresentationId: number;
            modificationDate: number;
            nItem: number;
            nText: number;
            nObjectString: number;
            nDatabaseString: number;
            objectStringType: number;
            res1: number;
            text: string;
            objectString: string | undefined;
            databaseString: string | undefined;
            coordinates: import("./td-poly")[];
        };
    };
    10: {
        new (reader: import("./tobject").BufferReader, objIndex: import("./tobject").ObjectIndex): {
            sym: number;
            otp: number;
            unicode: boolean;
            ang: number;
            nItem: number;
            nText: number;
            col: number;
            lineWidth: number;
            diamFlags: number;
            height: number;
            coordinates: any[];
            text: string;
            objIndex: import("./tobject").ObjectIndex;
            objType: number;
            serverObjectId: number;
            creationDate: number;
            multirepresentationId: number;
            modificationDate: number;
            nObjectString: number;
            nDatabaseString: number;
            objectStringType: number;
            res1: number;
            objectString: string | undefined;
            databaseString: string | undefined;
        };
    };
    11: {
        new (reader: import("./tobject").BufferReader, objIndex: import("./tobject").ObjectIndex): {
            sym: number;
            otp: number;
            unicode: boolean;
            ang: number;
            nItem: number;
            nText: number;
            mark: number;
            snappingMark: number;
            col: number;
            lineWidth: number;
            diamFlags: number;
            serverObjectId: number;
            height: number;
            _date: number;
            coordinates: any[];
            text: string;
            objIndex: import("./tobject").ObjectIndex;
            objType: number;
            creationDate: number;
            multirepresentationId: number;
            modificationDate: number;
            nObjectString: number;
            nDatabaseString: number;
            objectStringType: number;
            res1: number;
            objectString: string | undefined;
            databaseString: string | undefined;
        };
    };
    12: {
        new (reader: import("./tobject").BufferReader, objIndex: import("./tobject").ObjectIndex): {
            sym: number;
            otp: number;
            unicode: boolean;
            ang: number;
            col: number;
            lineWidth: number;
            diamFlags: number;
            serverObjectId: number;
            height: number;
            creationDate: number;
            multirepresentationId: number;
            modificationDate: number;
            nItem: number;
            nText: number;
            nObjectString: number;
            nDatabaseString: number;
            objectStringType: number;
            res1: number;
            coordinates: any[];
            text: string;
            objectString: string;
            databaseString: string;
            objIndex: import("./tobject").ObjectIndex;
            objType: number;
        };
    };
    2018: {
        new (reader: import("./tobject").BufferReader, objIndex: import("./tobject").ObjectIndex): {
            sym: number;
            otp: number;
            unicode: boolean;
            ang: number;
            col: number;
            lineWidth: number;
            diamFlags: number;
            serverObjectId: number;
            height: number;
            creationDate: number;
            multirepresentationId: number;
            modificationDate: number;
            nItem: number;
            nText: number;
            nObjectString: number;
            nDatabaseString: number;
            objectStringType: number;
            res1: number;
            coordinates: any[];
            text: string;
            objectString: string;
            databaseString: string;
            objIndex: import("./tobject").ObjectIndex;
            objType: number;
        };
    };
};
type Symbol = import("./symbol").BaseSymbolDef;
type ParameterString = import("./parameter-string");
type ParameterStringValues = import("./parameter-string").ParameterStringValues;
type Color = {
    number: number;
    cmyk: number[];
    name: string;
    rgb: string;
    renderOrder: number;
    rgbArray: Uint8ClampedArray;
};
