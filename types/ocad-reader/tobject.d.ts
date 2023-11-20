declare namespace _exports {
    export { BufferReader, ObjectIndex };
}
declare const _exports: {
    TObject: typeof BaseTObject;
    10: typeof TObject10;
    11: typeof TObject11;
    12: typeof TObject12;
    2018: typeof TObject12;
};
export = _exports;
type BufferReader = import("./buffer-reader");
type ObjectIndex = import("./object-index").ObjectIndex;
/** @typedef {import('./buffer-reader')} BufferReader */
/** @typedef {import('./object-index').ObjectIndex} ObjectIndex */
declare class BaseTObject {
    /**
     * @param {BufferReader} reader
     * @param {ObjectIndex} objIndex
     */
    constructor(reader: BufferReader, objIndex: ObjectIndex);
    /** @type {ObjectIndex} */
    objIndex: ObjectIndex;
    /** @type {number} */
    objType: number;
    /** @type {number} */
    sym: number;
    /** @type {number} */
    otp: number;
    /** @type {boolean} */
    unicode: boolean;
    /** @type {number} */
    ang: number;
    /** @type {number} */
    col: number;
    /** @type {number} */
    lineWidth: number;
    /** @type {number} */
    diamFlags: number;
    /** @type {number} */
    serverObjectId: number;
    /** @type {number} */
    height: number;
    /** @type {number} */
    creationDate: number;
    /** @type {number} */
    multirepresentationId: number;
    /** @type {number} */
    modificationDate: number;
    /** @type {number} */
    nItem: number;
    /** @type {number} */
    nText: number;
    /** @type {number} */
    nObjectString: number;
    /** @type {number} */
    nDatabaseString: number;
    /** @type {number} */
    objectStringType: number;
    /** @type {number} */
    res1: number;
    /** @type {string} */
    text: string;
    /** @type {string|undefined} */
    objectString: string | undefined;
    /** @type {string|undefined} */
    databaseString: string | undefined;
    /** @type {TdPoly[]} */
    coordinates: TdPoly[];
}
/**
 * OCAD version 10 TObject structure.
 */
declare class TObject10 extends BaseTObject {
    coordinates: any[];
}
/**
 * OCAD version 11 TObject structure.
 */
declare class TObject11 extends BaseTObject {
    mark: number;
    snappingMark: number;
    _date: number;
    coordinates: any[];
}
/**
 * OCAD version 12 and 2018 TObject structure.
 */
declare class TObject12 extends BaseTObject {
    coordinates: any[];
}
import TdPoly = require("./td-poly");
