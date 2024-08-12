export = ocadToGeoJson;
/**
 * @typedef {import("./ocad-reader/tobject").TObject} TObject
 */
/** @typedef {import("@turf/helpers").Geometry} Geometry */
/**
 * @template {Object} TGeometry
 * @template {Object} TProperties
 * @typedef {import("@turf/helpers").FeatureCollection<TGeometry, TProperties>} FeatureCollection<TGeometry, TProperties>
 */
/**
 * @template {Object} TGeometry
 * @template {Object} TProperties
 * @typedef {import("@turf/helpers").Feature<TGeometry, TProperties>} Feature<TGeometry, TProperties>
 */
/**
 * @typedef {import("./transform-features").TransformFeaturesOptions} TransformFeaturesOptions
 *
 * @typedef {object} OcadToGeoJsonOptionsProps
 * @property {boolean=} applyCrs transform coordinates to the file's geographic coordinates (default: `true`)
 * @property {number=} coordinatePrecision number of digits after the decimal point (default: `6`)
 *
 * @typedef {TransformFeaturesOptions & OcadToGeoJsonOptionsProps} OcadToGeoJsonOptions
 */
/**
 * @typedef {Object} OcadObjectProperties
 * @property {number} sym
 * @property {number} otp
 * @property {boolean} unicode
 * @property {number} ang
 * @property {number} col
 * @property {number} lineWidth
 * @property {number} diamFlags
 * @property {number} serverObjectId
 * @property {number} height
 * @property {number} creationDate
 * @property {number} multirepresentationId
 * @property {number} modificationDate
 * @property {number} nItem
 * @property {number} nText
 * @property {number} nObjectString
 * @property {number} nDatabaseString
 * @property {number} objectStringType
 * @property {number} res1
 * @property {string} text
 * @property {string|undefined} objectString
 * @property {string|undefined} databaseString
 */
/**
 * @typedef {Object} ElementProperties
 * @property {string} element
 * @property {number} parentId
 */
/**
 * Given an `OcadFile` object, returns a GeoJSON `FeatureCollection` of the file's objects.
 * @param {import("./ocad-reader/ocad-file")} ocadFile the OCAD file
 * @param {OcadToGeoJsonOptions} options options
 * @returns {FeatureCollection<Geometry, OcadObjectProperties>}
 */
declare function ocadToGeoJson(ocadFile: import("./ocad-reader/ocad-file"), options: OcadToGeoJsonOptions): FeatureCollection<Geometry, OcadObjectProperties>;
declare namespace ocadToGeoJson {
    export { TObject, Geometry, FeatureCollection, Feature, TransformFeaturesOptions, OcadToGeoJsonOptionsProps, OcadToGeoJsonOptions, OcadObjectProperties, ElementProperties };
}
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
    coordinates: TdPoly[];
};
type Geometry = import("@turf/helpers").Geometry;
/**
 * <TGeometry, TProperties>
 */
type FeatureCollection<TGeometry extends unknown, TProperties extends unknown> = import("@turf/helpers").FeatureCollection<TGeometry, TProperties>;
/**
 * <TGeometry, TProperties>
 */
type Feature<TGeometry extends unknown, TProperties extends unknown> = import("@turf/helpers").Feature<TGeometry, TProperties>;
type TransformFeaturesOptions = import("./transform-features").TransformFeaturesOptions;
type OcadToGeoJsonOptionsProps = {
    /**
     * transform coordinates to the file's geographic coordinates (default: `true`)
     */
    applyCrs?: boolean | undefined;
    /**
     * number of digits after the decimal point (default: `6`)
     */
    coordinatePrecision?: number | undefined;
};
type OcadToGeoJsonOptions = TransformFeaturesOptions & OcadToGeoJsonOptionsProps;
type OcadObjectProperties = {
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
};
type ElementProperties = {
    element: string;
    parentId: number;
};
import TdPoly = require("./ocad-reader/td-poly");
