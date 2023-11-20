export = ObjectIndexBlock;
declare class ObjectIndexBlock {
    /**
     * @param {BufferReader} reader
     * @param {number} version
     */
    constructor(reader: BufferReader, version: number);
    /** @type {number} */
    version: number;
    /** @type {number} */
    nextObjectIndexBlock: number;
    /** @type {ObjectIndex[]} */
    table: ObjectIndex[];
    /**
     * Reads the objects contained in this object index.
     * @param {BufferReader} reader
     * @returns {TObject[]}
     */
    readObjects(reader: BufferReader): TObject[];
    readObject(reader: any, objIndex: any): any;
}
declare namespace ObjectIndexBlock {
    export { TObject, BufferReader, ObjectIndex, ObjectIndexBlock };
}
type TObject = {
    TObject: {
        new (reader: TObject.BufferReader, objIndex: TObject.ObjectIndex): {
            objIndex: TObject.ObjectIndex;
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
        new (reader: TObject.BufferReader, objIndex: TObject.ObjectIndex): {
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
            objIndex: TObject.ObjectIndex;
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
        new (reader: TObject.BufferReader, objIndex: TObject.ObjectIndex): {
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
            objIndex: TObject.ObjectIndex;
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
        new (reader: TObject.BufferReader, objIndex: TObject.ObjectIndex): {
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
            objIndex: TObject.ObjectIndex;
            objType: number;
        };
    };
    2018: {
        new (reader: TObject.BufferReader, objIndex: TObject.ObjectIndex): {
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
            objIndex: TObject.ObjectIndex;
            objType: number;
        };
    };
};
type BufferReader = import("./buffer-reader");
type ObjectIndex = {
    rc: LRect;
    pos: number;
    len: number;
    sym: number;
    objType: number;
    encryptedMode: number;
    status: number;
    viewType: number;
    color: number;
    group: number;
    impLayer: number;
    dbDatasetHash: number;
    dbKeyHash: number;
};
type ObjectIndexBlock = any;
import TObject = require("./tobject");
import LRect = require("./lrect");
