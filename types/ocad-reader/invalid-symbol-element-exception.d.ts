export = InvalidSymbolElementException;
declare class InvalidSymbolElementException extends Error {
    constructor(msg: any, symbolElement: any);
    symbolElement: any;
}
