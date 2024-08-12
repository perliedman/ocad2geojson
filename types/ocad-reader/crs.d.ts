export = Crs;
declare class Crs {
    /**
     * @param {import('./parameter-string').ParameterStringValues} scalePar
     */
    constructor(scalePar: import("./parameter-string").ParameterStringValues);
    /**
     * @type {number}
     */
    easting: number;
    /**
     * @type {number}
     **/
    northing: number;
    /**
     * @type {number}
     **/
    scale: number;
    /**
     * @type {number}
     **/
    gridId: number;
    /**
     * @type {number}
     * @description Grivation in radians
     **/
    grivation: number;
    /**
     * @type {number}
     */
    code: number;
    /**
     * @type {string}
     */
    catalog: string;
    /**
     * @type {string}
     **/
    name: string;
    grid: crsGrids.GridDef;
    /**
     * Converts an OCAD map coordinate (paper coordinates) to
     * a coordinate in this CRS.
     * @param {TdPoly|number[]} coord
     * @returns {TdPoly|number[]} the projected coordinate;
     * if the input is a TdPoly, the output is a TdPoly instance, otherwise just a coordinate array
     */
    toProjectedCoord(coord: TdPoly | number[]): TdPoly | number[];
    /**
     * Converts a coordinate in this CRS to an OCAD map coordinate (paper coordinates).
     * @param {TdPoly|number[]} coord
     * @returns {TdPoly|number[]} the map coordinate;
     * if the input is a TdPoly, the output is a TdPoly instance, otherwise just a coordinate array
     */
    toMapCoord(coord: TdPoly | number[]): TdPoly | number[];
}
import crsGrids = require("./crs-grids");
import TdPoly = require("./td-poly");
