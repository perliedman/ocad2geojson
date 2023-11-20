export = FileHeader;
declare class FileHeader {
    /**
     * @param {import('./buffer-reader')} reader
     */
    constructor(reader: import("./buffer-reader"));
    /**
     * @type {number}
     */
    ocadMark: number;
    /**
     * @type {number}
     */
    fileType: number;
    /**
     * @type {number}
     */
    version: number;
    /**
     * @type {number}
     */
    subVersion: number;
    /**
     * @type {number}
     */
    subSubVersion: number;
    /**
     * @type {number}
     */
    symbolIndexBlock: number;
    /**
     * @type {number}
     */
    objectIndexBlock: number;
    /**
     * @type {number}
     */
    offlineSyncSerial: number;
    /**
     * @type {number}
     */
    currentFileVersion: number;
    /**
     * @type {number}
     */
    stringIndexBlock: number;
    /**
     * @type {number}
     */
    fileNamePos: number;
    /**
     * @type {number}
     */
    fileNameSize: number;
    /**
     * @type {number}
     */
    mrStartBlockPosition: number;
    /**
     * Tells if this is a valid OCAD file (magic number is correct).
     * @returns {boolean}
     */
    isValid(): boolean;
}
