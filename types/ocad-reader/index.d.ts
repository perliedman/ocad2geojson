export = readOcad;
/**
 * @typedef {Object} ReadOcadOptions
 * @property {boolean=} bypassVersionCheck bypass the version check and read the file anyway
 * @property {boolean=} quietWarnings do not print warnings to console
 * @property {boolean=} failOnWarning throw an error if a warning is encountered
 */
/**
 * Reads an OCAD file from the given path or `Buffer` object into an `OcadFile` object.
 *
 * @param {string|Buffer} path the path of the OCAD file or a binary buffer of the OCAD file contents
 * @param {ReadOcadOptions?} options
 * @returns {Promise<OcadFile>} a promise that resolves to an `OcadFile` object
 */
declare function readOcad(path: string | Buffer, options?: ReadOcadOptions | null): Promise<OcadFile>;
declare namespace readOcad {
    export { ReadOcadOptions };
}
import { Buffer } from "buffer";
import OcadFile = require("./ocad-file");
type ReadOcadOptions = {
    /**
     * bypass the version check and read the file anyway
     */
    bypassVersionCheck?: boolean | undefined;
    /**
     * do not print warnings to console
     */
    quietWarnings?: boolean | undefined;
    /**
     * throw an error if a warning is encountered
     */
    failOnWarning?: boolean | undefined;
};
