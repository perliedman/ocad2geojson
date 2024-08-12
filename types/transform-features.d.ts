export = transformFeatures;
/** @typedef {import('./ocad-reader/symbol').BaseSymbolDef} Symbol */
/** @typedef {import('./ocad-reader/symbol-element')} SymbolElement */
/** @typedef {import('./ocad-reader/tobject').TObject} TObject */
/** @typedef {import("./ocad-reader/ocad-file")} OcadFile */
/**
 * @typedef {Object} TransformFeaturesOptions
 * @property {boolean=} generateSymbolElements generate features for symbol elements (default: `true`)
 * @property {boolean=} exportHidden export hidden objects (default: `false`)
 * @property {number[]=} includeSymbols only export features from the given symbols;
 *    symbols are identified by their OCAD internal symbol number (for example `40015`, not `400.15`);
 *    if undefined, all symbols will be exported
 * @property {TObject[]=} objects only export the given objects;
 *    if undefined, all objects, filtered by the `exportHidden` option, will be exported
 * @property {import('./ocad-reader/ocad-file').Color[]=} [colors] the colors of the OCAD file
 * @property {number=} [idCount] the current id count
 */
/**
 * @template {Object} T
 * @typedef {function(TransformFeaturesOptions, Record<number, Symbol>, TObject, number): T|null|undefined} CreateObject
 */
/**
 * @template {Object} U
 * @typedef {(symbol: Symbol, name: string, index: number, element: SymbolElement, c: import('./ocad-reader/td-poly'), angle: number, options: TransformFeaturesOptions, object: TObject, objectId: number) => U|null|undefined} CreateElement
 */
/**
 * @template {Object} T result type
 * @template {Object} U element result type
 * @param {OcadFile} ocadFile
 * @param {CreateObject<T>} createObject
 * @param {CreateElement<U>} createElement
 * @param {TransformFeaturesOptions} options
 * @returns {T[]}
 */
declare function transformFeatures<T extends unknown, U extends unknown>(ocadFile: OcadFile, createObject: CreateObject<T>, createElement: CreateElement<U>, options: TransformFeaturesOptions): T[];
declare namespace transformFeatures {
    export { Symbol, SymbolElement, TObject, OcadFile, TransformFeaturesOptions, CreateObject, CreateElement };
}
type Symbol = import("./ocad-reader/symbol").BaseSymbolDef;
type SymbolElement = import("./ocad-reader/symbol-element");
type TObject = {
    objIndex: import("./ocad-reader/tobject").ObjectIndex;
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
    coordinates: import("./ocad-reader/td-poly")[];
};
type OcadFile = import("./ocad-reader/ocad-file");
type TransformFeaturesOptions = {
    /**
     * generate features for symbol elements (default: `true`)
     */
    generateSymbolElements?: boolean | undefined;
    /**
     * export hidden objects (default: `false`)
     */
    exportHidden?: boolean | undefined;
    /**
     * only export features from the given symbols;
     * symbols are identified by their OCAD internal symbol number (for example `40015`, not `400.15`);
     * if undefined, all symbols will be exported
     */
    includeSymbols?: number[] | undefined;
    /**
     * only export the given objects;
     * if undefined, all objects, filtered by the `exportHidden` option, will be exported
     */
    objects?: TObject[] | undefined;
    /**
     * the colors of the OCAD file
     */
    colors?: import("./ocad-reader/ocad-file").Color[] | undefined;
    /**
     * the current id count
     */
    idCount?: number | undefined;
};
type CreateObject<T extends unknown> = (arg0: TransformFeaturesOptions, arg1: Record<number, Symbol>, arg2: TObject, arg3: number) => T | null | undefined;
type CreateElement<U extends unknown> = (symbol: Symbol, name: string, index: number, element: SymbolElement, c: import("./ocad-reader/td-poly"), angle: number, options: TransformFeaturesOptions, object: TObject, objectId: number) => U | null | undefined;
