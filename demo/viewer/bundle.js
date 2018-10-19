(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = require("@turf/meta");
/**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {GeoJSON} geojson any GeoJSON object
 * @returns {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 * var bbox = turf.bbox(line);
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [line, bboxPolygon]
 */
function bbox(geojson) {
    var result = [Infinity, Infinity, -Infinity, -Infinity];
    meta_1.coordEach(geojson, function (coord) {
        if (result[0] > coord[0]) {
            result[0] = coord[0];
        }
        if (result[1] > coord[1]) {
            result[1] = coord[1];
        }
        if (result[2] < coord[0]) {
            result[2] = coord[0];
        }
        if (result[3] < coord[1]) {
            result[3] = coord[1];
        }
    });
    return result;
}
exports.default = bbox;

},{"@turf/meta":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module helpers
 */
/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 *
 * @memberof helpers
 * @type {number}
 */
exports.earthRadius = 6371008.8;
/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.factors = {
    centimeters: exports.earthRadius * 100,
    centimetres: exports.earthRadius * 100,
    degrees: exports.earthRadius / 111325,
    feet: exports.earthRadius * 3.28084,
    inches: exports.earthRadius * 39.370,
    kilometers: exports.earthRadius / 1000,
    kilometres: exports.earthRadius / 1000,
    meters: exports.earthRadius,
    metres: exports.earthRadius,
    miles: exports.earthRadius / 1609.344,
    millimeters: exports.earthRadius * 1000,
    millimetres: exports.earthRadius * 1000,
    nauticalmiles: exports.earthRadius / 1852,
    radians: 1,
    yards: exports.earthRadius / 1.0936,
};
/**
 * Units of measurement factors based on 1 meter.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.unitsFactors = {
    centimeters: 100,
    centimetres: 100,
    degrees: 1 / 111325,
    feet: 3.28084,
    inches: 39.370,
    kilometers: 1 / 1000,
    kilometres: 1 / 1000,
    meters: 1,
    metres: 1,
    miles: 1 / 1609.344,
    millimeters: 1000,
    millimetres: 1000,
    nauticalmiles: 1 / 1852,
    radians: 1 / exports.earthRadius,
    yards: 1 / 1.0936,
};
/**
 * Area of measurement factors based on 1 square meter.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.areaFactors = {
    acres: 0.000247105,
    centimeters: 10000,
    centimetres: 10000,
    feet: 10.763910417,
    inches: 1550.003100006,
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    miles: 3.86e-7,
    millimeters: 1000000,
    millimetres: 1000000,
    yards: 1.195990046,
};
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geom, properties, options) {
    if (options === void 0) { options = {}; }
    var feat = { type: "Feature" };
    if (options.id === 0 || options.id) {
        feat.id = options.id;
    }
    if (options.bbox) {
        feat.bbox = options.bbox;
    }
    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
}
exports.feature = feature;
/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<any>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = "Point";
 * var coordinates = [110, 50];
 * var geometry = turf.geometry(type, coordinates);
 * // => geometry
 */
function geometry(type, coordinates, options) {
    if (options === void 0) { options = {}; }
    switch (type) {
        case "Point": return point(coordinates).geometry;
        case "LineString": return lineString(coordinates).geometry;
        case "Polygon": return polygon(coordinates).geometry;
        case "MultiPoint": return multiPoint(coordinates).geometry;
        case "MultiLineString": return multiLineString(coordinates).geometry;
        case "MultiPolygon": return multiPolygon(coordinates).geometry;
        default: throw new Error(type + " is invalid");
    }
}
exports.geometry = geometry;
/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "Point",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.point = point;
/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
function points(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return point(coords, properties);
    }), options);
}
exports.points = points;
/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
function polygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
        var ring = coordinates_1[_i];
        if (ring.length < 4) {
            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error("First and last Position are not equivalent.");
            }
        }
    }
    var geom = {
        type: "Polygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.polygon = polygon;
/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
function polygons(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return polygon(coords, properties);
    }), options);
}
exports.polygons = polygons;
/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
function lineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    if (coordinates.length < 2) {
        throw new Error("coordinates must be an array of two or more positions");
    }
    var geom = {
        type: "LineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.lineString = lineString;
/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
function lineStrings(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return lineString(coords, properties);
    }), options);
}
exports.lineStrings = lineStrings;
/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
function featureCollection(features, options) {
    if (options === void 0) { options = {}; }
    var fc = { type: "FeatureCollection" };
    if (options.id) {
        fc.id = options.id;
    }
    if (options.bbox) {
        fc.bbox = options.bbox;
    }
    fc.features = features;
    return fc;
}
exports.featureCollection = featureCollection;
/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiLineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiLineString = multiLineString;
/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPoint",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiPoint = multiPoint;
/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPolygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiPolygon = multiPolygon;
/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = turf.geometry("Point", [100, 0]);
 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
 * var collection = turf.geometryCollection([pt, line]);
 *
 * // => collection
 */
function geometryCollection(geometries, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "GeometryCollection",
        geometries: geometries,
    };
    return feature(geom, properties, options);
}
exports.geometryCollection = geometryCollection;
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (precision === void 0) { precision = 0; }
    if (precision && !(precision >= 0)) {
        throw new Error("precision must be a positive number");
    }
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}
exports.round = round;
/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToLength(radians, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = exports.factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return radians * factor;
}
exports.radiansToLength = radiansToLength;
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} radians
 */
function lengthToRadians(distance, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = exports.factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return distance / factor;
}
exports.lengthToRadians = lengthToRadians;
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function lengthToDegrees(distance, units) {
    return radiansToDegrees(lengthToRadians(distance, units));
}
exports.lengthToDegrees = lengthToDegrees;
/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAzimuth(bearing) {
    var angle = bearing % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}
exports.bearingToAzimuth = bearingToAzimuth;
/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radiansToDegrees(radians) {
    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}
exports.radiansToDegrees = radiansToDegrees;
/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degreesToRadians(degrees) {
    var radians = degrees % 360;
    return radians * Math.PI / 180;
}
exports.degreesToRadians = degreesToRadians;
/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */
function convertLength(length, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "kilometers"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(length >= 0)) {
        throw new Error("length must be a positive number");
    }
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
exports.convertLength = convertLength;
/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
 * @param {number} area to be converted
 * @param {Units} [originalUnit="meters"] of the distance
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "meters"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(area >= 0)) {
        throw new Error("area must be a positive number");
    }
    var startFactor = exports.areaFactors[originalUnit];
    if (!startFactor) {
        throw new Error("invalid original units");
    }
    var finalFactor = exports.areaFactors[finalUnit];
    if (!finalFactor) {
        throw new Error("invalid final units");
    }
    return (area / startFactor) * finalFactor;
}
exports.convertArea = convertArea;
/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
}
exports.isNumber = isNumber;
/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
function isObject(input) {
    return (!!input) && (input.constructor === Object);
}
exports.isObject = isObject;
/**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */
function validateBBox(bbox) {
    if (!bbox) {
        throw new Error("bbox is required");
    }
    if (!Array.isArray(bbox)) {
        throw new Error("bbox must be an Array");
    }
    if (bbox.length !== 4 && bbox.length !== 6) {
        throw new Error("bbox must be an Array of 4 or 6 numbers");
    }
    bbox.forEach(function (num) {
        if (!isNumber(num)) {
            throw new Error("bbox must only contain numbers");
        }
    });
}
exports.validateBBox = validateBBox;
/**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */
function validateId(id) {
    if (!id) {
        throw new Error("id is required");
    }
    if (["string", "number"].indexOf(typeof id) === -1) {
        throw new Error("id must be a number or a string");
    }
}
exports.validateId = validateId;
// Deprecated methods
function radians2degrees() {
    throw new Error("method has been renamed to `radiansToDegrees`");
}
exports.radians2degrees = radians2degrees;
function degrees2radians() {
    throw new Error("method has been renamed to `degreesToRadians`");
}
exports.degrees2radians = degrees2radians;
function distanceToDegrees() {
    throw new Error("method has been renamed to `lengthToDegrees`");
}
exports.distanceToDegrees = distanceToDegrees;
function distanceToRadians() {
    throw new Error("method has been renamed to `lengthToRadians`");
}
exports.distanceToRadians = distanceToRadians;
function radiansToDistance() {
    throw new Error("method has been renamed to `radiansToLength`");
}
exports.radiansToDistance = radiansToDistance;
function bearingToAngle() {
    throw new Error("method has been renamed to `bearingToAzimuth`");
}
exports.bearingToAngle = bearingToAngle;
function convertDistance() {
    throw new Error("method has been renamed to `convertLength`");
}
exports.convertDistance = convertDistance;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helpers = require('@turf/helpers');

/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var j, k, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === 'FeatureCollection',
        isFeature = type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
            (isFeature ? geojson.geometry : geojson));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
            var multiFeatureIndex = 0;
            var geometryIndex = 0;
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

            // Handles null Geometry -- Skips this geometry
            if (geometry === null) continue;
            coords = geometry.coordinates;
            var geomType = geometry.type;

            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

            switch (geomType) {
            case null:
                break;
            case 'Point':
                if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                coordIndex++;
                multiFeatureIndex++;
                break;
            case 'LineString':
            case 'MultiPoint':
                for (j = 0; j < coords.length; j++) {
                    if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                    coordIndex++;
                    if (geomType === 'MultiPoint') multiFeatureIndex++;
                }
                if (geomType === 'LineString') multiFeatureIndex++;
                break;
            case 'Polygon':
            case 'MultiLineString':
                for (j = 0; j < coords.length; j++) {
                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
                        if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                        coordIndex++;
                    }
                    if (geomType === 'MultiLineString') multiFeatureIndex++;
                    if (geomType === 'Polygon') geometryIndex++;
                }
                if (geomType === 'Polygon') multiFeatureIndex++;
                break;
            case 'MultiPolygon':
                for (j = 0; j < coords.length; j++) {
                    geometryIndex = 0;
                    for (k = 0; k < coords[j].length; k++) {
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                            if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                            coordIndex++;
                        }
                        geometryIndex++;
                    }
                    multiFeatureIndex++;
                }
                break;
            case 'GeometryCollection':
                for (j = 0; j < geometry.geometries.length; j++)
                    if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;
                break;
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentCoord;
 * });
 */
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
    var previousValue = initialValue;
    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
    }, excludeWrapCoord);
    return previousValue;
}

/**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {Object} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
function propEach(geojson, callback) {
    var i;
    switch (geojson.type) {
    case 'FeatureCollection':
        for (i = 0; i < geojson.features.length; i++) {
            if (callback(geojson.features[i].properties, i) === false) break;
        }
        break;
    case 'Feature':
        callback(geojson.properties, 0);
        break;
    }
}


/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
function propReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    propEach(geojson, function (currentProperties, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
        else previousValue = callback(previousValue, currentProperties, featureIndex);
    });
    return previousValue;
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach(geojson, callback) {
    if (geojson.type === 'Feature') {
        callback(geojson, 0);
    } else if (geojson.type === 'FeatureCollection') {
        for (var i = 0; i < geojson.features.length; i++) {
            if (callback(geojson.features[i], i) === false) break;
        }
    }
}

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
function featureReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    featureEach(geojson, function (currentFeature, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex);
    });
    return previousValue;
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson) {
    var coords = [];
    coordEach(geojson, function (coord) {
        coords.push(coord);
    });
    return coords;
}

/**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {Geometry} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {Object} featureProperties The current Feature Properties being processed.
 * @param {Array<number>} featureBBox The current Feature BBox being processed.
 * @param {number|string} featureId The current Feature Id being processed.
 */

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 * });
 */
function geomEach(geojson, callback) {
    var i, j, g, geometry, stopG,
        geometryMaybeCollection,
        isGeometryCollection,
        featureProperties,
        featureBBox,
        featureId,
        featureIndex = 0,
        isFeatureCollection = geojson.type === 'FeatureCollection',
        isFeature = geojson.type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
            (isFeature ? geojson.geometry : geojson));
        featureProperties = (isFeatureCollection ? geojson.features[i].properties :
            (isFeature ? geojson.properties : {}));
        featureBBox = (isFeatureCollection ? geojson.features[i].bbox :
            (isFeature ? geojson.bbox : undefined));
        featureId = (isFeatureCollection ? geojson.features[i].id :
            (isFeature ? geojson.id : undefined));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

            // Handle null Geometry
            if (geometry === null) {
                if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
                continue;
            }
            switch (geometry.type) {
            case 'Point':
            case 'LineString':
            case 'MultiPoint':
            case 'Polygon':
            case 'MultiLineString':
            case 'MultiPolygon': {
                if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
                break;
            }
            case 'GeometryCollection': {
                for (j = 0; j < geometry.geometries.length; j++) {
                    if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) return false;
                }
                break;
            }
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
        // Only increase `featureIndex` per each feature
        featureIndex++;
    }
}

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Geometry} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {Object} featureProperties The current Feature Properties being processed.
 * @param {Array<number>} featureBBox The current Feature BBox being processed.
 * @param {number|string} featureId The current Feature Id being processed.
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 *   return currentGeometry
 * });
 */
function geomReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(geojson, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
        else previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
    });
    return previousValue;
}

/**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 */

/**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name flattenEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 * });
 */
function flattenEach(geojson, callback) {
    geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
        // Callback for single geometry
        var type = (geometry === null) ? null : geometry.type;
        switch (type) {
        case null:
        case 'Point':
        case 'LineString':
        case 'Polygon':
            if (callback(helpers.feature(geometry, properties, {bbox: bbox, id: id}), featureIndex, 0) === false) return false;
            return;
        }

        var geomType;

        // Callback for multi-geometry
        switch (type) {
        case 'MultiPoint':
            geomType = 'Point';
            break;
        case 'MultiLineString':
            geomType = 'LineString';
            break;
        case 'MultiPolygon':
            geomType = 'Polygon';
            break;
        }

        for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
            var coordinate = geometry.coordinates[multiFeatureIndex];
            var geom = {
                type: geomType,
                coordinates: coordinate
            };
            if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false) return false;
        }
    });
}

/**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 */

/**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @name flattenReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   return currentFeature
 * });
 */
function flattenReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    flattenEach(geojson, function (currentFeature, featureIndex, multiFeatureIndex) {
        if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
    });
    return previousValue;
}

/**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 * @returns {void}
 */

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //=currentSegment
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   //=segmentIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * });
 */
function segmentEach(geojson, callback) {
    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
        var segmentIndex = 0;

        // Exclude null Geometries
        if (!feature.geometry) return;
        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
        var type = feature.geometry.type;
        if (type === 'Point' || type === 'MultiPoint') return;

        // Generate 2-vertex line segments
        var previousCoords;
        var previousFeatureIndex = 0;
        var previousMultiIndex = 0;
        var prevGeomIndex = 0;
        if (coordEach(feature, function (currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
            // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
            if (previousCoords === undefined || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
                previousCoords = currentCoord;
                previousFeatureIndex = featureIndex;
                previousMultiIndex = multiPartIndexCoord;
                prevGeomIndex = geometryIndex;
                segmentIndex = 0;
                return;
            }
            var currentSegment = helpers.lineString([previousCoords, currentCoord], feature.properties);
            if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false) return false;
            segmentIndex++;
            previousCoords = currentCoord;
        }) === false) return false;
    });
}

/**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 */

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= featureIndex
 *   //= multiFeatureIndex
 *   //= geometryIndex
 *   //= segmentInex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
function segmentReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    var started = false;
    segmentEach(geojson, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
        if (started === false && initialValue === undefined) previousValue = currentSegment;
        else previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
        started = true;
    });
    return previousValue;
}

/**
 * Callback for lineEach
 *
 * @callback lineEachCallback
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 */

/**
 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
 * similar to Array.forEach.
 *
 * @name lineEach
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @example
 * var multiLine = turf.multiLineString([
 *   [[26, 37], [35, 45]],
 *   [[36, 53], [38, 50], [41, 55]]
 * ]);
 *
 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function lineEach(geojson, callback) {
    // validation
    if (!geojson) throw new Error('geojson is required');

    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
        if (feature.geometry === null) return;
        var type = feature.geometry.type;
        var coords = feature.geometry.coordinates;
        switch (type) {
        case 'LineString':
            if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false) return false;
            break;
        case 'Polygon':
            for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
                if (callback(helpers.lineString(coords[geometryIndex], feature.properties), featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
            }
            break;
        }
    });
}

/**
 * Callback for lineReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback lineReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name lineReduce
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var multiPoly = turf.multiPolygon([
 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
 * ]);
 *
 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentLine
 * });
 */
function lineReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    lineEach(geojson, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentLine;
        else previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
    });
    return previousValue;
}

/**
 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 * Point & MultiPoint will always return null.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.segmentIndex=0] Segment Index
 * @param {Object} [options.properties={}] Translate Properties to output LineString
 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
 * @param {number|string} [options.id={}] Translate Id to output LineString
 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findSegment(multiLine);
 * // => Feature<LineString<[[10, 10], [50, 30]]>>
 *
 * // First Segment of 2nd Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
 *
 * // Last Segment of Last Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
 */
function findSegment(geojson, options) {
    // Optional Parameters
    options = options || {};
    if (!helpers.isObject(options)) throw new Error('options is invalid');
    var featureIndex = options.featureIndex || 0;
    var multiFeatureIndex = options.multiFeatureIndex || 0;
    var geometryIndex = options.geometryIndex || 0;
    var segmentIndex = options.segmentIndex || 0;

    // Find FeatureIndex
    var properties = options.properties;
    var geometry;

    switch (geojson.type) {
    case 'FeatureCollection':
        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
        properties = properties || geojson.features[featureIndex].properties;
        geometry = geojson.features[featureIndex].geometry;
        break;
    case 'Feature':
        properties = properties || geojson.properties;
        geometry = geojson.geometry;
        break;
    case 'Point':
    case 'MultiPoint':
        return null;
    case 'LineString':
    case 'Polygon':
    case 'MultiLineString':
    case 'MultiPolygon':
        geometry = geojson;
        break;
    default:
        throw new Error('geojson is invalid');
    }

    // Find SegmentIndex
    if (geometry === null) return null;
    var coords = geometry.coordinates;
    switch (geometry.type) {
    case 'Point':
    case 'MultiPoint':
        return null;
    case 'LineString':
        if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
        return helpers.lineString([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
    case 'Polygon':
        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
        if (segmentIndex < 0) segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
        return helpers.lineString([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
    case 'MultiLineString':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
        return helpers.lineString([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
    case 'MultiPolygon':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
        return helpers.lineString([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
    }
    throw new Error('geojson is invalid');
}

/**
 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.coordIndex=0] Coord Index
 * @param {Object} [options.properties={}] Translate Properties to output Point
 * @param {BBox} [options.bbox={}] Translate BBox to output Point
 * @param {number|string} [options.id={}] Translate Id to output Point
 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findPoint(multiLine);
 * // => Feature<Point<[10, 10]>>
 *
 * // First Segment of the 2nd Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
 * // => Feature<Point<[-10, -10]>>
 *
 * // Last Segment of last Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
 * // => Feature<Point<[-30, -40]>>
 */
function findPoint(geojson, options) {
    // Optional Parameters
    options = options || {};
    if (!helpers.isObject(options)) throw new Error('options is invalid');
    var featureIndex = options.featureIndex || 0;
    var multiFeatureIndex = options.multiFeatureIndex || 0;
    var geometryIndex = options.geometryIndex || 0;
    var coordIndex = options.coordIndex || 0;

    // Find FeatureIndex
    var properties = options.properties;
    var geometry;

    switch (geojson.type) {
    case 'FeatureCollection':
        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
        properties = properties || geojson.features[featureIndex].properties;
        geometry = geojson.features[featureIndex].geometry;
        break;
    case 'Feature':
        properties = properties || geojson.properties;
        geometry = geojson.geometry;
        break;
    case 'Point':
    case 'MultiPoint':
        return null;
    case 'LineString':
    case 'Polygon':
    case 'MultiLineString':
    case 'MultiPolygon':
        geometry = geojson;
        break;
    default:
        throw new Error('geojson is invalid');
    }

    // Find Coord Index
    if (geometry === null) return null;
    var coords = geometry.coordinates;
    switch (geometry.type) {
    case 'Point':
        return helpers.point(coords, properties, options);
    case 'MultiPoint':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        return helpers.point(coords[multiFeatureIndex], properties, options);
    case 'LineString':
        if (coordIndex < 0) coordIndex = coords.length + coordIndex;
        return helpers.point(coords[coordIndex], properties, options);
    case 'Polygon':
        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
        if (coordIndex < 0) coordIndex = coords[geometryIndex].length + coordIndex;
        return helpers.point(coords[geometryIndex][coordIndex], properties, options);
    case 'MultiLineString':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex].length + coordIndex;
        return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
    case 'MultiPolygon':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
        return helpers.point(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
    }
    throw new Error('geojson is invalid');
}

exports.coordEach = coordEach;
exports.coordReduce = coordReduce;
exports.propEach = propEach;
exports.propReduce = propReduce;
exports.featureEach = featureEach;
exports.featureReduce = featureReduce;
exports.coordAll = coordAll;
exports.geomEach = geomEach;
exports.geomReduce = geomReduce;
exports.flattenEach = flattenEach;
exports.flattenReduce = flattenReduce;
exports.segmentEach = segmentEach;
exports.segmentReduce = segmentReduce;
exports.lineEach = lineEach;
exports.lineReduce = lineReduce;
exports.findSegment = findSegment;
exports.findPoint = findPoint;

},{"@turf/helpers":2}],4:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],5:[function(require,module,exports){
(function (Buffer){
/* global Blob, FileReader */

module.exports = function blobToBuffer (blob, cb) {
  if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
    throw new Error('first argument must be a Blob')
  }
  if (typeof cb !== 'function') {
    throw new Error('second argument must be a function')
  }

  var reader = new FileReader()

  function onLoadEnd (e) {
    reader.removeEventListener('loadend', onLoadEnd, false)
    if (e.error) cb(e.error)
    else cb(null, Buffer.from(reader.result))
  }

  reader.addEventListener('loadend', onLoadEnd, false)
  reader.readAsArrayBuffer(blob)
}

}).call(this,require("buffer").Buffer)

},{"buffer":7}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":4,"ieee754":8}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.proj4 = factory());
}(this, (function () { 'use strict';

	var globals = function(defs) {
	  defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
	  defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
	  defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");

	  defs.WGS84 = defs['EPSG:4326'];
	  defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
	  defs.GOOGLE = defs['EPSG:3857'];
	  defs['EPSG:900913'] = defs['EPSG:3857'];
	  defs['EPSG:102113'] = defs['EPSG:3857'];
	};

	var PJD_3PARAM = 1;
	var PJD_7PARAM = 2;
	var PJD_WGS84 = 4; // WGS84 or equivalent
	var PJD_NODATUM = 5; // WGS84 or equivalent
	var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
	var HALF_PI = Math.PI/2;
	// ellipoid pj_set_ell.c
	var SIXTH = 0.1666666666666666667;
	/* 1/6 */
	var RA4 = 0.04722222222222222222;
	/* 17/360 */
	var RA6 = 0.02215608465608465608;
	var EPSLN = 1.0e-10;
	// you'd think you could use Number.EPSILON above but that makes
	// Mollweide get into an infinate loop.

	var D2R = 0.01745329251994329577;
	var R2D = 57.29577951308232088;
	var FORTPI = Math.PI/4;
	var TWO_PI = Math.PI * 2;
	// SPI is slightly greater than Math.PI, so values that exceed the -180..180
	// degree range by a tiny amount don't get wrapped. This prevents points that
	// have drifted from their original location along the 180th meridian (due to
	// floating point error) from changing their sign.
	var SPI = 3.14159265359;

	var exports$1 = {};
	exports$1.greenwich = 0.0; //"0dE",
	exports$1.lisbon = -9.131906111111; //"9d07'54.862\"W",
	exports$1.paris = 2.337229166667; //"2d20'14.025\"E",
	exports$1.bogota = -74.080916666667; //"74d04'51.3\"W",
	exports$1.madrid = -3.687938888889; //"3d41'16.58\"W",
	exports$1.rome = 12.452333333333; //"12d27'8.4\"E",
	exports$1.bern = 7.439583333333; //"7d26'22.5\"E",
	exports$1.jakarta = 106.807719444444; //"106d48'27.79\"E",
	exports$1.ferro = -17.666666666667; //"17d40'W",
	exports$1.brussels = 4.367975; //"4d22'4.71\"E",
	exports$1.stockholm = 18.058277777778; //"18d3'29.8\"E",
	exports$1.athens = 23.7163375; //"23d42'58.815\"E",
	exports$1.oslo = 10.722916666667; //"10d43'22.5\"E"

	var units = {
	  ft: {to_meter: 0.3048},
	  'us-ft': {to_meter: 1200 / 3937}
	};

	var ignoredChar = /[\s_\-\/\(\)]/g;
	function match(obj, key) {
	  if (obj[key]) {
	    return obj[key];
	  }
	  var keys = Object.keys(obj);
	  var lkey = key.toLowerCase().replace(ignoredChar, '');
	  var i = -1;
	  var testkey, processedKey;
	  while (++i < keys.length) {
	    testkey = keys[i];
	    processedKey = testkey.toLowerCase().replace(ignoredChar, '');
	    if (processedKey === lkey) {
	      return obj[testkey];
	    }
	  }
	}

	var parseProj = function(defData) {
	  var self = {};
	  var paramObj = defData.split('+').map(function(v) {
	    return v.trim();
	  }).filter(function(a) {
	    return a;
	  }).reduce(function(p, a) {
	    var split = a.split('=');
	    split.push(true);
	    p[split[0].toLowerCase()] = split[1];
	    return p;
	  }, {});
	  var paramName, paramVal, paramOutname;
	  var params = {
	    proj: 'projName',
	    datum: 'datumCode',
	    rf: function(v) {
	      self.rf = parseFloat(v);
	    },
	    lat_0: function(v) {
	      self.lat0 = v * D2R;
	    },
	    lat_1: function(v) {
	      self.lat1 = v * D2R;
	    },
	    lat_2: function(v) {
	      self.lat2 = v * D2R;
	    },
	    lat_ts: function(v) {
	      self.lat_ts = v * D2R;
	    },
	    lon_0: function(v) {
	      self.long0 = v * D2R;
	    },
	    lon_1: function(v) {
	      self.long1 = v * D2R;
	    },
	    lon_2: function(v) {
	      self.long2 = v * D2R;
	    },
	    alpha: function(v) {
	      self.alpha = parseFloat(v) * D2R;
	    },
	    lonc: function(v) {
	      self.longc = v * D2R;
	    },
	    x_0: function(v) {
	      self.x0 = parseFloat(v);
	    },
	    y_0: function(v) {
	      self.y0 = parseFloat(v);
	    },
	    k_0: function(v) {
	      self.k0 = parseFloat(v);
	    },
	    k: function(v) {
	      self.k0 = parseFloat(v);
	    },
	    a: function(v) {
	      self.a = parseFloat(v);
	    },
	    b: function(v) {
	      self.b = parseFloat(v);
	    },
	    r_a: function() {
	      self.R_A = true;
	    },
	    zone: function(v) {
	      self.zone = parseInt(v, 10);
	    },
	    south: function() {
	      self.utmSouth = true;
	    },
	    towgs84: function(v) {
	      self.datum_params = v.split(",").map(function(a) {
	        return parseFloat(a);
	      });
	    },
	    to_meter: function(v) {
	      self.to_meter = parseFloat(v);
	    },
	    units: function(v) {
	      self.units = v;
	      var unit = match(units, v);
	      if (unit) {
	        self.to_meter = unit.to_meter;
	      }
	    },
	    from_greenwich: function(v) {
	      self.from_greenwich = v * D2R;
	    },
	    pm: function(v) {
	      var pm = match(exports$1, v);
	      self.from_greenwich = (pm ? pm : parseFloat(v)) * D2R;
	    },
	    nadgrids: function(v) {
	      if (v === '@null') {
	        self.datumCode = 'none';
	      }
	      else {
	        self.nadgrids = v;
	      }
	    },
	    axis: function(v) {
	      var legalAxis = "ewnsud";
	      if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
	        self.axis = v;
	      }
	    }
	  };
	  for (paramName in paramObj) {
	    paramVal = paramObj[paramName];
	    if (paramName in params) {
	      paramOutname = params[paramName];
	      if (typeof paramOutname === 'function') {
	        paramOutname(paramVal);
	      }
	      else {
	        self[paramOutname] = paramVal;
	      }
	    }
	    else {
	      self[paramName] = paramVal;
	    }
	  }
	  if(typeof self.datumCode === 'string' && self.datumCode !== "WGS84"){
	    self.datumCode = self.datumCode.toLowerCase();
	  }
	  return self;
	};

	var NEUTRAL = 1;
	var KEYWORD = 2;
	var NUMBER = 3;
	var QUOTED = 4;
	var AFTERQUOTE = 5;
	var ENDED = -1;
	var whitespace = /\s/;
	var latin = /[A-Za-z]/;
	var keyword = /[A-Za-z84]/;
	var endThings = /[,\]]/;
	var digets = /[\d\.E\-\+]/;
	// const ignoredChar = /[\s_\-\/\(\)]/g;
	function Parser(text) {
	  if (typeof text !== 'string') {
	    throw new Error('not a string');
	  }
	  this.text = text.trim();
	  this.level = 0;
	  this.place = 0;
	  this.root = null;
	  this.stack = [];
	  this.currentObject = null;
	  this.state = NEUTRAL;
	}
	Parser.prototype.readCharicter = function() {
	  var char = this.text[this.place++];
	  if (this.state !== QUOTED) {
	    while (whitespace.test(char)) {
	      if (this.place >= this.text.length) {
	        return;
	      }
	      char = this.text[this.place++];
	    }
	  }
	  switch (this.state) {
	    case NEUTRAL:
	      return this.neutral(char);
	    case KEYWORD:
	      return this.keyword(char)
	    case QUOTED:
	      return this.quoted(char);
	    case AFTERQUOTE:
	      return this.afterquote(char);
	    case NUMBER:
	      return this.number(char);
	    case ENDED:
	      return;
	  }
	};
	Parser.prototype.afterquote = function(char) {
	  if (char === '"') {
	    this.word += '"';
	    this.state = QUOTED;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.word = this.word.trim();
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
	};
	Parser.prototype.afterItem = function(char) {
	  if (char === ',') {
	    if (this.word !== null) {
	      this.currentObject.push(this.word);
	    }
	    this.word = null;
	    this.state = NEUTRAL;
	    return;
	  }
	  if (char === ']') {
	    this.level--;
	    if (this.word !== null) {
	      this.currentObject.push(this.word);
	      this.word = null;
	    }
	    this.state = NEUTRAL;
	    this.currentObject = this.stack.pop();
	    if (!this.currentObject) {
	      this.state = ENDED;
	    }

	    return;
	  }
	};
	Parser.prototype.number = function(char) {
	  if (digets.test(char)) {
	    this.word += char;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.word = parseFloat(this.word);
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
	};
	Parser.prototype.quoted = function(char) {
	  if (char === '"') {
	    this.state = AFTERQUOTE;
	    return;
	  }
	  this.word += char;
	  return;
	};
	Parser.prototype.keyword = function(char) {
	  if (keyword.test(char)) {
	    this.word += char;
	    return;
	  }
	  if (char === '[') {
	    var newObjects = [];
	    newObjects.push(this.word);
	    this.level++;
	    if (this.root === null) {
	      this.root = newObjects;
	    } else {
	      this.currentObject.push(newObjects);
	    }
	    this.stack.push(this.currentObject);
	    this.currentObject = newObjects;
	    this.state = NEUTRAL;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
	};
	Parser.prototype.neutral = function(char) {
	  if (latin.test(char)) {
	    this.word = char;
	    this.state = KEYWORD;
	    return;
	  }
	  if (char === '"') {
	    this.word = '';
	    this.state = QUOTED;
	    return;
	  }
	  if (digets.test(char)) {
	    this.word = char;
	    this.state = NUMBER;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
	};
	Parser.prototype.output = function() {
	  while (this.place < this.text.length) {
	    this.readCharicter();
	  }
	  if (this.state === ENDED) {
	    return this.root;
	  }
	  throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
	};

	function parseString(txt) {
	  var parser = new Parser(txt);
	  return parser.output();
	}

	function mapit(obj, key, value) {
	  if (Array.isArray(key)) {
	    value.unshift(key);
	    key = null;
	  }
	  var thing = key ? {} : obj;

	  var out = value.reduce(function(newObj, item) {
	    sExpr(item, newObj);
	    return newObj
	  }, thing);
	  if (key) {
	    obj[key] = out;
	  }
	}

	function sExpr(v, obj) {
	  if (!Array.isArray(v)) {
	    obj[v] = true;
	    return;
	  }
	  var key = v.shift();
	  if (key === 'PARAMETER') {
	    key = v.shift();
	  }
	  if (v.length === 1) {
	    if (Array.isArray(v[0])) {
	      obj[key] = {};
	      sExpr(v[0], obj[key]);
	      return;
	    }
	    obj[key] = v[0];
	    return;
	  }
	  if (!v.length) {
	    obj[key] = true;
	    return;
	  }
	  if (key === 'TOWGS84') {
	    obj[key] = v;
	    return;
	  }
	  if (!Array.isArray(key)) {
	    obj[key] = {};
	  }

	  var i;
	  switch (key) {
	    case 'UNIT':
	    case 'PRIMEM':
	    case 'VERT_DATUM':
	      obj[key] = {
	        name: v[0].toLowerCase(),
	        convert: v[1]
	      };
	      if (v.length === 3) {
	        sExpr(v[2], obj[key]);
	      }
	      return;
	    case 'SPHEROID':
	    case 'ELLIPSOID':
	      obj[key] = {
	        name: v[0],
	        a: v[1],
	        rf: v[2]
	      };
	      if (v.length === 4) {
	        sExpr(v[3], obj[key]);
	      }
	      return;
	    case 'PROJECTEDCRS':
	    case 'PROJCRS':
	    case 'GEOGCS':
	    case 'GEOCCS':
	    case 'PROJCS':
	    case 'LOCAL_CS':
	    case 'GEODCRS':
	    case 'GEODETICCRS':
	    case 'GEODETICDATUM':
	    case 'EDATUM':
	    case 'ENGINEERINGDATUM':
	    case 'VERT_CS':
	    case 'VERTCRS':
	    case 'VERTICALCRS':
	    case 'COMPD_CS':
	    case 'COMPOUNDCRS':
	    case 'ENGINEERINGCRS':
	    case 'ENGCRS':
	    case 'FITTED_CS':
	    case 'LOCAL_DATUM':
	    case 'DATUM':
	      v[0] = ['name', v[0]];
	      mapit(obj, key, v);
	      return;
	    default:
	      i = -1;
	      while (++i < v.length) {
	        if (!Array.isArray(v[i])) {
	          return sExpr(v, obj[key]);
	        }
	      }
	      return mapit(obj, key, v);
	  }
	}

	var D2R$1 = 0.01745329251994329577;
	function rename(obj, params) {
	  var outName = params[0];
	  var inName = params[1];
	  if (!(outName in obj) && (inName in obj)) {
	    obj[outName] = obj[inName];
	    if (params.length === 3) {
	      obj[outName] = params[2](obj[outName]);
	    }
	  }
	}

	function d2r(input) {
	  return input * D2R$1;
	}

	function cleanWKT(wkt) {
	  if (wkt.type === 'GEOGCS') {
	    wkt.projName = 'longlat';
	  } else if (wkt.type === 'LOCAL_CS') {
	    wkt.projName = 'identity';
	    wkt.local = true;
	  } else {
	    if (typeof wkt.PROJECTION === 'object') {
	      wkt.projName = Object.keys(wkt.PROJECTION)[0];
	    } else {
	      wkt.projName = wkt.PROJECTION;
	    }
	  }
	  if (wkt.UNIT) {
	    wkt.units = wkt.UNIT.name.toLowerCase();
	    if (wkt.units === 'metre') {
	      wkt.units = 'meter';
	    }
	    if (wkt.UNIT.convert) {
	      if (wkt.type === 'GEOGCS') {
	        if (wkt.DATUM && wkt.DATUM.SPHEROID) {
	          wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
	        }
	      } else {
	        wkt.to_meter = wkt.UNIT.convert, 10;
	      }
	    }
	  }
	  var geogcs = wkt.GEOGCS;
	  if (wkt.type === 'GEOGCS') {
	    geogcs = wkt;
	  }
	  if (geogcs) {
	    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
	    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
	    //}
	    if (geogcs.DATUM) {
	      wkt.datumCode = geogcs.DATUM.name.toLowerCase();
	    } else {
	      wkt.datumCode = geogcs.name.toLowerCase();
	    }
	    if (wkt.datumCode.slice(0, 2) === 'd_') {
	      wkt.datumCode = wkt.datumCode.slice(2);
	    }
	    if (wkt.datumCode === 'new_zealand_geodetic_datum_1949' || wkt.datumCode === 'new_zealand_1949') {
	      wkt.datumCode = 'nzgd49';
	    }
	    if (wkt.datumCode === 'wgs_1984') {
	      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
	        wkt.sphere = true;
	      }
	      wkt.datumCode = 'wgs84';
	    }
	    if (wkt.datumCode.slice(-6) === '_ferro') {
	      wkt.datumCode = wkt.datumCode.slice(0, - 6);
	    }
	    if (wkt.datumCode.slice(-8) === '_jakarta') {
	      wkt.datumCode = wkt.datumCode.slice(0, - 8);
	    }
	    if (~wkt.datumCode.indexOf('belge')) {
	      wkt.datumCode = 'rnb72';
	    }
	    if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
	      wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
	      if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
	        wkt.ellps = 'intl';
	      }

	      wkt.a = geogcs.DATUM.SPHEROID.a;
	      wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
	    }

	    if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
	      wkt.datum_params = geogcs.DATUM.TOWGS84;
	    }
	    if (~wkt.datumCode.indexOf('osgb_1936')) {
	      wkt.datumCode = 'osgb36';
	    }
	    if (~wkt.datumCode.indexOf('osni_1952')) {
	      wkt.datumCode = 'osni52';
	    }
	    if (~wkt.datumCode.indexOf('tm65')
	      || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
	      wkt.datumCode = 'ire65';
	    }
	    if (wkt.datumCode === 'ch1903+') {
	      wkt.datumCode = 'ch1903';
	    }
	    if (~wkt.datumCode.indexOf('israel')) {
	      wkt.datumCode = 'isr93';
	    }
	  }
	  if (wkt.b && !isFinite(wkt.b)) {
	    wkt.b = wkt.a;
	  }

	  function toMeter(input) {
	    var ratio = wkt.to_meter || 1;
	    return input * ratio;
	  }
	  var renamer = function(a) {
	    return rename(wkt, a);
	  };
	  var list = [
	    ['standard_parallel_1', 'Standard_Parallel_1'],
	    ['standard_parallel_2', 'Standard_Parallel_2'],
	    ['false_easting', 'False_Easting'],
	    ['false_northing', 'False_Northing'],
	    ['central_meridian', 'Central_Meridian'],
	    ['latitude_of_origin', 'Latitude_Of_Origin'],
	    ['latitude_of_origin', 'Central_Parallel'],
	    ['scale_factor', 'Scale_Factor'],
	    ['k0', 'scale_factor'],
	    ['latitude_of_center', 'Latitude_Of_Center'],
	    ['latitude_of_center', 'Latitude_of_center'],
	    ['lat0', 'latitude_of_center', d2r],
	    ['longitude_of_center', 'Longitude_Of_Center'],
	    ['longitude_of_center', 'Longitude_of_center'],
	    ['longc', 'longitude_of_center', d2r],
	    ['x0', 'false_easting', toMeter],
	    ['y0', 'false_northing', toMeter],
	    ['long0', 'central_meridian', d2r],
	    ['lat0', 'latitude_of_origin', d2r],
	    ['lat0', 'standard_parallel_1', d2r],
	    ['lat1', 'standard_parallel_1', d2r],
	    ['lat2', 'standard_parallel_2', d2r],
	    ['azimuth', 'Azimuth'],
	    ['alpha', 'azimuth', d2r],
	    ['srsCode', 'name']
	  ];
	  list.forEach(renamer);
	  if (!wkt.long0 && wkt.longc && (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === 'Lambert_Azimuthal_Equal_Area')) {
	    wkt.long0 = wkt.longc;
	  }
	  if (!wkt.lat_ts && wkt.lat1 && (wkt.projName === 'Stereographic_South_Pole' || wkt.projName === 'Polar Stereographic (variant B)')) {
	    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
	    wkt.lat_ts = wkt.lat1;
	  }
	}
	var wkt = function(wkt) {
	  var lisp = parseString(wkt);
	  var type = lisp.shift();
	  var name = lisp.shift();
	  lisp.unshift(['name', name]);
	  lisp.unshift(['type', type]);
	  var obj = {};
	  sExpr(lisp, obj);
	  cleanWKT(obj);
	  return obj;
	};

	function defs(name) {
	  /*global console*/
	  var that = this;
	  if (arguments.length === 2) {
	    var def = arguments[1];
	    if (typeof def === 'string') {
	      if (def.charAt(0) === '+') {
	        defs[name] = parseProj(arguments[1]);
	      }
	      else {
	        defs[name] = wkt(arguments[1]);
	      }
	    } else {
	      defs[name] = def;
	    }
	  }
	  else if (arguments.length === 1) {
	    if (Array.isArray(name)) {
	      return name.map(function(v) {
	        if (Array.isArray(v)) {
	          defs.apply(that, v);
	        }
	        else {
	          defs(v);
	        }
	      });
	    }
	    else if (typeof name === 'string') {
	      if (name in defs) {
	        return defs[name];
	      }
	    }
	    else if ('EPSG' in name) {
	      defs['EPSG:' + name.EPSG] = name;
	    }
	    else if ('ESRI' in name) {
	      defs['ESRI:' + name.ESRI] = name;
	    }
	    else if ('IAU2000' in name) {
	      defs['IAU2000:' + name.IAU2000] = name;
	    }
	    else {
	      console.log(name);
	    }
	    return;
	  }


	}
	globals(defs);

	function testObj(code){
	  return typeof code === 'string';
	}
	function testDef(code){
	  return code in defs;
	}
	 var codeWords = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS','GEOCCS','PROJCS','LOCAL_CS', 'GEODCRS', 'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];
	function testWKT(code){
	  return codeWords.some(function (word) {
	    return code.indexOf(word) > -1;
	  });
	}
	var codes = ['3857', '900913', '3785', '102113'];
	function checkMercator(item) {
	  var auth = match(item, 'authority');
	  if (!auth) {
	    return;
	  }
	  var code = match(auth, 'epsg');
	  return code && codes.indexOf(code) > -1;
	}
	function checkProjStr(item) {
	  var ext = match(item, 'extension');
	  if (!ext) {
	    return;
	  }
	  return match(ext, 'proj4');
	}
	function testProj(code){
	  return code[0] === '+';
	}
	function parse(code){
	  if (testObj(code)) {
	    //check to see if this is a WKT string
	    if (testDef(code)) {
	      return defs[code];
	    }
	    if (testWKT(code)) {
	      var out = wkt(code);
	      // test of spetial case, due to this being a very common and often malformed
	      if (checkMercator(out)) {
	        return defs['EPSG:3857'];
	      }
	      var maybeProjStr = checkProjStr(out);
	      if (maybeProjStr) {
	        return parseProj(maybeProjStr);
	      }
	      return out;
	    }
	    if (testProj(code)) {
	      return parseProj(code);
	    }
	  }else{
	    return code;
	  }
	}

	var extend = function(destination, source) {
	  destination = destination || {};
	  var value, property;
	  if (!source) {
	    return destination;
	  }
	  for (property in source) {
	    value = source[property];
	    if (value !== undefined) {
	      destination[property] = value;
	    }
	  }
	  return destination;
	};

	var msfnz = function(eccent, sinphi, cosphi) {
	  var con = eccent * sinphi;
	  return cosphi / (Math.sqrt(1 - con * con));
	};

	var sign = function(x) {
	  return x<0 ? -1 : 1;
	};

	var adjust_lon = function(x) {
	  return (Math.abs(x) <= SPI) ? x : (x - (sign(x) * TWO_PI));
	};

	var tsfnz = function(eccent, phi, sinphi) {
	  var con = eccent * sinphi;
	  var com = 0.5 * eccent;
	  con = Math.pow(((1 - con) / (1 + con)), com);
	  return (Math.tan(0.5 * (HALF_PI - phi)) / con);
	};

	var phi2z = function(eccent, ts) {
	  var eccnth = 0.5 * eccent;
	  var con, dphi;
	  var phi = HALF_PI - 2 * Math.atan(ts);
	  for (var i = 0; i <= 15; i++) {
	    con = eccent * Math.sin(phi);
	    dphi = HALF_PI - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
	    phi += dphi;
	    if (Math.abs(dphi) <= 0.0000000001) {
	      return phi;
	    }
	  }
	  //console.log("phi2z has NoConvergence");
	  return -9999;
	};

	function init() {
	  var con = this.b / this.a;
	  this.es = 1 - con * con;
	  if(!('x0' in this)){
	    this.x0 = 0;
	  }
	  if(!('y0' in this)){
	    this.y0 = 0;
	  }
	  this.e = Math.sqrt(this.es);
	  if (this.lat_ts) {
	    if (this.sphere) {
	      this.k0 = Math.cos(this.lat_ts);
	    }
	    else {
	      this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
	    }
	  }
	  else {
	    if (!this.k0) {
	      if (this.k) {
	        this.k0 = this.k;
	      }
	      else {
	        this.k0 = 1;
	      }
	    }
	  }
	}

	/* Mercator forward equations--mapping lat,long to x,y
	  --------------------------------------------------*/

	function forward(p) {
	  var lon = p.x;
	  var lat = p.y;
	  // convert to radians
	  if (lat * R2D > 90 && lat * R2D < -90 && lon * R2D > 180 && lon * R2D < -180) {
	    return null;
	  }

	  var x, y;
	  if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
	    return null;
	  }
	  else {
	    if (this.sphere) {
	      x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
	      y = this.y0 + this.a * this.k0 * Math.log(Math.tan(FORTPI + 0.5 * lat));
	    }
	    else {
	      var sinphi = Math.sin(lat);
	      var ts = tsfnz(this.e, lat, sinphi);
	      x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
	      y = this.y0 - this.a * this.k0 * Math.log(ts);
	    }
	    p.x = x;
	    p.y = y;
	    return p;
	  }
	}

	/* Mercator inverse equations--mapping x,y to lat/long
	  --------------------------------------------------*/
	function inverse(p) {

	  var x = p.x - this.x0;
	  var y = p.y - this.y0;
	  var lon, lat;

	  if (this.sphere) {
	    lat = HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
	  }
	  else {
	    var ts = Math.exp(-y / (this.a * this.k0));
	    lat = phi2z(this.e, ts);
	    if (lat === -9999) {
	      return null;
	    }
	  }
	  lon = adjust_lon(this.long0 + x / (this.a * this.k0));

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$1 = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
	var merc = {
	  init: init,
	  forward: forward,
	  inverse: inverse,
	  names: names$1
	};

	function init$1() {
	  //no-op for longlat
	}

	function identity(pt) {
	  return pt;
	}
	var names$2 = ["longlat", "identity"];
	var longlat = {
	  init: init$1,
	  forward: identity,
	  inverse: identity,
	  names: names$2
	};

	var projs = [merc, longlat];
	var names = {};
	var projStore = [];

	function add(proj, i) {
	  var len = projStore.length;
	  if (!proj.names) {
	    console.log(i);
	    return true;
	  }
	  projStore[len] = proj;
	  proj.names.forEach(function(n) {
	    names[n.toLowerCase()] = len;
	  });
	  return this;
	}

	function get(name) {
	  if (!name) {
	    return false;
	  }
	  var n = name.toLowerCase();
	  if (typeof names[n] !== 'undefined' && projStore[names[n]]) {
	    return projStore[names[n]];
	  }
	}

	function start() {
	  projs.forEach(add);
	}
	var projections = {
	  start: start,
	  add: add,
	  get: get
	};

	var exports$2 = {};
	exports$2.MERIT = {
	  a: 6378137.0,
	  rf: 298.257,
	  ellipseName: "MERIT 1983"
	};

	exports$2.SGS85 = {
	  a: 6378136.0,
	  rf: 298.257,
	  ellipseName: "Soviet Geodetic System 85"
	};

	exports$2.GRS80 = {
	  a: 6378137.0,
	  rf: 298.257222101,
	  ellipseName: "GRS 1980(IUGG, 1980)"
	};

	exports$2.IAU76 = {
	  a: 6378140.0,
	  rf: 298.257,
	  ellipseName: "IAU 1976"
	};

	exports$2.airy = {
	  a: 6377563.396,
	  b: 6356256.910,
	  ellipseName: "Airy 1830"
	};

	exports$2.APL4 = {
	  a: 6378137,
	  rf: 298.25,
	  ellipseName: "Appl. Physics. 1965"
	};

	exports$2.NWL9D = {
	  a: 6378145.0,
	  rf: 298.25,
	  ellipseName: "Naval Weapons Lab., 1965"
	};

	exports$2.mod_airy = {
	  a: 6377340.189,
	  b: 6356034.446,
	  ellipseName: "Modified Airy"
	};

	exports$2.andrae = {
	  a: 6377104.43,
	  rf: 300.0,
	  ellipseName: "Andrae 1876 (Den., Iclnd.)"
	};

	exports$2.aust_SA = {
	  a: 6378160.0,
	  rf: 298.25,
	  ellipseName: "Australian Natl & S. Amer. 1969"
	};

	exports$2.GRS67 = {
	  a: 6378160.0,
	  rf: 298.2471674270,
	  ellipseName: "GRS 67(IUGG 1967)"
	};

	exports$2.bessel = {
	  a: 6377397.155,
	  rf: 299.1528128,
	  ellipseName: "Bessel 1841"
	};

	exports$2.bess_nam = {
	  a: 6377483.865,
	  rf: 299.1528128,
	  ellipseName: "Bessel 1841 (Namibia)"
	};

	exports$2.clrk66 = {
	  a: 6378206.4,
	  b: 6356583.8,
	  ellipseName: "Clarke 1866"
	};

	exports$2.clrk80 = {
	  a: 6378249.145,
	  rf: 293.4663,
	  ellipseName: "Clarke 1880 mod."
	};

	exports$2.clrk58 = {
	  a: 6378293.645208759,
	  rf: 294.2606763692654,
	  ellipseName: "Clarke 1858"
	};

	exports$2.CPM = {
	  a: 6375738.7,
	  rf: 334.29,
	  ellipseName: "Comm. des Poids et Mesures 1799"
	};

	exports$2.delmbr = {
	  a: 6376428.0,
	  rf: 311.5,
	  ellipseName: "Delambre 1810 (Belgium)"
	};

	exports$2.engelis = {
	  a: 6378136.05,
	  rf: 298.2566,
	  ellipseName: "Engelis 1985"
	};

	exports$2.evrst30 = {
	  a: 6377276.345,
	  rf: 300.8017,
	  ellipseName: "Everest 1830"
	};

	exports$2.evrst48 = {
	  a: 6377304.063,
	  rf: 300.8017,
	  ellipseName: "Everest 1948"
	};

	exports$2.evrst56 = {
	  a: 6377301.243,
	  rf: 300.8017,
	  ellipseName: "Everest 1956"
	};

	exports$2.evrst69 = {
	  a: 6377295.664,
	  rf: 300.8017,
	  ellipseName: "Everest 1969"
	};

	exports$2.evrstSS = {
	  a: 6377298.556,
	  rf: 300.8017,
	  ellipseName: "Everest (Sabah & Sarawak)"
	};

	exports$2.fschr60 = {
	  a: 6378166.0,
	  rf: 298.3,
	  ellipseName: "Fischer (Mercury Datum) 1960"
	};

	exports$2.fschr60m = {
	  a: 6378155.0,
	  rf: 298.3,
	  ellipseName: "Fischer 1960"
	};

	exports$2.fschr68 = {
	  a: 6378150.0,
	  rf: 298.3,
	  ellipseName: "Fischer 1968"
	};

	exports$2.helmert = {
	  a: 6378200.0,
	  rf: 298.3,
	  ellipseName: "Helmert 1906"
	};

	exports$2.hough = {
	  a: 6378270.0,
	  rf: 297.0,
	  ellipseName: "Hough"
	};

	exports$2.intl = {
	  a: 6378388.0,
	  rf: 297.0,
	  ellipseName: "International 1909 (Hayford)"
	};

	exports$2.kaula = {
	  a: 6378163.0,
	  rf: 298.24,
	  ellipseName: "Kaula 1961"
	};

	exports$2.lerch = {
	  a: 6378139.0,
	  rf: 298.257,
	  ellipseName: "Lerch 1979"
	};

	exports$2.mprts = {
	  a: 6397300.0,
	  rf: 191.0,
	  ellipseName: "Maupertius 1738"
	};

	exports$2.new_intl = {
	  a: 6378157.5,
	  b: 6356772.2,
	  ellipseName: "New International 1967"
	};

	exports$2.plessis = {
	  a: 6376523.0,
	  rf: 6355863.0,
	  ellipseName: "Plessis 1817 (France)"
	};

	exports$2.krass = {
	  a: 6378245.0,
	  rf: 298.3,
	  ellipseName: "Krassovsky, 1942"
	};

	exports$2.SEasia = {
	  a: 6378155.0,
	  b: 6356773.3205,
	  ellipseName: "Southeast Asia"
	};

	exports$2.walbeck = {
	  a: 6376896.0,
	  b: 6355834.8467,
	  ellipseName: "Walbeck"
	};

	exports$2.WGS60 = {
	  a: 6378165.0,
	  rf: 298.3,
	  ellipseName: "WGS 60"
	};

	exports$2.WGS66 = {
	  a: 6378145.0,
	  rf: 298.25,
	  ellipseName: "WGS 66"
	};

	exports$2.WGS7 = {
	  a: 6378135.0,
	  rf: 298.26,
	  ellipseName: "WGS 72"
	};

	var WGS84 = exports$2.WGS84 = {
	  a: 6378137.0,
	  rf: 298.257223563,
	  ellipseName: "WGS 84"
	};

	exports$2.sphere = {
	  a: 6370997.0,
	  b: 6370997.0,
	  ellipseName: "Normal Sphere (r=6370997)"
	};

	function eccentricity(a, b, rf, R_A) {
	  var a2 = a * a; // used in geocentric
	  var b2 = b * b; // used in geocentric
	  var es = (a2 - b2) / a2; // e ^ 2
	  var e = 0;
	  if (R_A) {
	    a *= 1 - es * (SIXTH + es * (RA4 + es * RA6));
	    a2 = a * a;
	    es = 0;
	  } else {
	    e = Math.sqrt(es); // eccentricity
	  }
	  var ep2 = (a2 - b2) / b2; // used in geocentric
	  return {
	    es: es,
	    e: e,
	    ep2: ep2
	  };
	}
	function sphere(a, b, rf, ellps, sphere) {
	  if (!a) { // do we have an ellipsoid?
	    var ellipse = match(exports$2, ellps);
	    if (!ellipse) {
	      ellipse = WGS84;
	    }
	    a = ellipse.a;
	    b = ellipse.b;
	    rf = ellipse.rf;
	  }

	  if (rf && !b) {
	    b = (1.0 - 1.0 / rf) * a;
	  }
	  if (rf === 0 || Math.abs(a - b) < EPSLN) {
	    sphere = true;
	    b = a;
	  }
	  return {
	    a: a,
	    b: b,
	    rf: rf,
	    sphere: sphere
	  };
	}

	var exports$3 = {};
	exports$3.wgs84 = {
	  towgs84: "0,0,0",
	  ellipse: "WGS84",
	  datumName: "WGS84"
	};

	exports$3.ch1903 = {
	  towgs84: "674.374,15.056,405.346",
	  ellipse: "bessel",
	  datumName: "swiss"
	};

	exports$3.ggrs87 = {
	  towgs84: "-199.87,74.79,246.62",
	  ellipse: "GRS80",
	  datumName: "Greek_Geodetic_Reference_System_1987"
	};

	exports$3.nad83 = {
	  towgs84: "0,0,0",
	  ellipse: "GRS80",
	  datumName: "North_American_Datum_1983"
	};

	exports$3.nad27 = {
	  nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
	  ellipse: "clrk66",
	  datumName: "North_American_Datum_1927"
	};

	exports$3.potsdam = {
	  towgs84: "606.0,23.0,413.0",
	  ellipse: "bessel",
	  datumName: "Potsdam Rauenberg 1950 DHDN"
	};

	exports$3.carthage = {
	  towgs84: "-263.0,6.0,431.0",
	  ellipse: "clark80",
	  datumName: "Carthage 1934 Tunisia"
	};

	exports$3.hermannskogel = {
	  towgs84: "653.0,-212.0,449.0",
	  ellipse: "bessel",
	  datumName: "Hermannskogel"
	};

	exports$3.osni52 = {
	  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
	  ellipse: "airy",
	  datumName: "Irish National"
	};

	exports$3.ire65 = {
	  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
	  ellipse: "mod_airy",
	  datumName: "Ireland 1965"
	};

	exports$3.rassadiran = {
	  towgs84: "-133.63,-157.5,-158.62",
	  ellipse: "intl",
	  datumName: "Rassadiran"
	};

	exports$3.nzgd49 = {
	  towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
	  ellipse: "intl",
	  datumName: "New Zealand Geodetic Datum 1949"
	};

	exports$3.osgb36 = {
	  towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
	  ellipse: "airy",
	  datumName: "Airy 1830"
	};

	exports$3.s_jtsk = {
	  towgs84: "589,76,480",
	  ellipse: 'bessel',
	  datumName: 'S-JTSK (Ferro)'
	};

	exports$3.beduaram = {
	  towgs84: '-106,-87,188',
	  ellipse: 'clrk80',
	  datumName: 'Beduaram'
	};

	exports$3.gunung_segara = {
	  towgs84: '-403,684,41',
	  ellipse: 'bessel',
	  datumName: 'Gunung Segara Jakarta'
	};

	exports$3.rnb72 = {
	  towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
	  ellipse: "intl",
	  datumName: "Reseau National Belge 1972"
	};

	function datum(datumCode, datum_params, a, b, es, ep2) {
	  var out = {};

	  if (datumCode === undefined || datumCode === 'none') {
	    out.datum_type = PJD_NODATUM;
	  } else {
	    out.datum_type = PJD_WGS84;
	  }

	  if (datum_params) {
	    out.datum_params = datum_params.map(parseFloat);
	    if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
	      out.datum_type = PJD_3PARAM;
	    }
	    if (out.datum_params.length > 3) {
	      if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
	        out.datum_type = PJD_7PARAM;
	        out.datum_params[3] *= SEC_TO_RAD;
	        out.datum_params[4] *= SEC_TO_RAD;
	        out.datum_params[5] *= SEC_TO_RAD;
	        out.datum_params[6] = (out.datum_params[6] / 1000000.0) + 1.0;
	      }
	    }
	  }

	  out.a = a; //datum object also uses these values
	  out.b = b;
	  out.es = es;
	  out.ep2 = ep2;
	  return out;
	}

	function Projection(srsCode,callback) {
	  if (!(this instanceof Projection)) {
	    return new Projection(srsCode);
	  }
	  callback = callback || function(error){
	    if(error){
	      throw error;
	    }
	  };
	  var json = parse(srsCode);
	  if(typeof json !== 'object'){
	    callback(srsCode);
	    return;
	  }
	  var ourProj = Projection.projections.get(json.projName);
	  if(!ourProj){
	    callback(srsCode);
	    return;
	  }
	  if (json.datumCode && json.datumCode !== 'none') {
	    var datumDef = match(exports$3, json.datumCode);
	    if (datumDef) {
	      json.datum_params = datumDef.towgs84 ? datumDef.towgs84.split(',') : null;
	      json.ellps = datumDef.ellipse;
	      json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
	    }
	  }
	  json.k0 = json.k0 || 1.0;
	  json.axis = json.axis || 'enu';
	  json.ellps = json.ellps || 'wgs84';
	  var sphere_ = sphere(json.a, json.b, json.rf, json.ellps, json.sphere);
	  var ecc = eccentricity(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
	  var datumObj = json.datum || datum(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2);

	  extend(this, json); // transfer everything over from the projection because we don't know what we'll need
	  extend(this, ourProj); // transfer all the methods from the projection

	  // copy the 4 things over we calulated in deriveConstants.sphere
	  this.a = sphere_.a;
	  this.b = sphere_.b;
	  this.rf = sphere_.rf;
	  this.sphere = sphere_.sphere;

	  // copy the 3 things we calculated in deriveConstants.eccentricity
	  this.es = ecc.es;
	  this.e = ecc.e;
	  this.ep2 = ecc.ep2;

	  // add in the datum object
	  this.datum = datumObj;

	  // init the projection
	  this.init();

	  // legecy callback from back in the day when it went to spatialreference.org
	  callback(null, this);

	}
	Projection.projections = projections;
	Projection.projections.start();

	'use strict';
	function compareDatums(source, dest) {
	  if (source.datum_type !== dest.datum_type) {
	    return false; // false, datums are not equal
	  } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
	    // the tolerance for es is to ensure that GRS80 and WGS84
	    // are considered identical
	    return false;
	  } else if (source.datum_type === PJD_3PARAM) {
	    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2]);
	  } else if (source.datum_type === PJD_7PARAM) {
	    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6]);
	  } else {
	    return true; // datums are equal
	  }
	} // cs_compare_datums()

	/*
	 * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
	 * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
	 * according to the current ellipsoid parameters.
	 *
	 *    Latitude  : Geodetic latitude in radians                     (input)
	 *    Longitude : Geodetic longitude in radians                    (input)
	 *    Height    : Geodetic height, in meters                       (input)
	 *    X         : Calculated Geocentric X coordinate, in meters    (output)
	 *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
	 *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
	 *
	 */
	function geodeticToGeocentric(p, es, a) {
	  var Longitude = p.x;
	  var Latitude = p.y;
	  var Height = p.z ? p.z : 0; //Z value not always supplied

	  var Rn; /*  Earth radius at location  */
	  var Sin_Lat; /*  Math.sin(Latitude)  */
	  var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
	  var Cos_Lat; /*  Math.cos(Latitude)  */

	  /*
	   ** Don't blow up if Latitude is just a little out of the value
	   ** range as it may just be a rounding issue.  Also removed longitude
	   ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
	   */
	  if (Latitude < -HALF_PI && Latitude > -1.001 * HALF_PI) {
	    Latitude = -HALF_PI;
	  } else if (Latitude > HALF_PI && Latitude < 1.001 * HALF_PI) {
	    Latitude = HALF_PI;
	  } else if (Latitude < -HALF_PI) {
	    /* Latitude out of range */
	    //..reportError('geocent:lat out of range:' + Latitude);
	    return { x: -Infinity, y: -Infinity, z: p.z };
	  } else if (Latitude > HALF_PI) {
	    /* Latitude out of range */
	    return { x: Infinity, y: Infinity, z: p.z };
	  }

	  if (Longitude > Math.PI) {
	    Longitude -= (2 * Math.PI);
	  }
	  Sin_Lat = Math.sin(Latitude);
	  Cos_Lat = Math.cos(Latitude);
	  Sin2_Lat = Sin_Lat * Sin_Lat;
	  Rn = a / (Math.sqrt(1.0e0 - es * Sin2_Lat));
	  return {
	    x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
	    y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
	    z: ((Rn * (1 - es)) + Height) * Sin_Lat
	  };
	} // cs_geodetic_to_geocentric()

	function geocentricToGeodetic(p, es, a, b) {
	  /* local defintions and variables */
	  /* end-criterium of loop, accuracy of sin(Latitude) */
	  var genau = 1e-12;
	  var genau2 = (genau * genau);
	  var maxiter = 30;

	  var P; /* distance between semi-minor axis and location */
	  var RR; /* distance between center and location */
	  var CT; /* sin of geocentric latitude */
	  var ST; /* cos of geocentric latitude */
	  var RX;
	  var RK;
	  var RN; /* Earth radius at location */
	  var CPHI0; /* cos of start or old geodetic latitude in iterations */
	  var SPHI0; /* sin of start or old geodetic latitude in iterations */
	  var CPHI; /* cos of searched geodetic latitude */
	  var SPHI; /* sin of searched geodetic latitude */
	  var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
	  var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

	  var X = p.x;
	  var Y = p.y;
	  var Z = p.z ? p.z : 0.0; //Z value not always supplied
	  var Longitude;
	  var Latitude;
	  var Height;

	  P = Math.sqrt(X * X + Y * Y);
	  RR = Math.sqrt(X * X + Y * Y + Z * Z);

	  /*      special cases for latitude and longitude */
	  if (P / a < genau) {

	    /*  special case, if P=0. (X=0., Y=0.) */
	    Longitude = 0.0;

	    /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
	     *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
	    if (RR / a < genau) {
	      Latitude = HALF_PI;
	      Height = -b;
	      return {
	        x: p.x,
	        y: p.y,
	        z: p.z
	      };
	    }
	  } else {
	    /*  ellipsoidal (geodetic) longitude
	     *  interval: -PI < Longitude <= +PI */
	    Longitude = Math.atan2(Y, X);
	  }

	  /* --------------------------------------------------------------
	   * Following iterative algorithm was developped by
	   * "Institut for Erdmessung", University of Hannover, July 1988.
	   * Internet: www.ife.uni-hannover.de
	   * Iterative computation of CPHI,SPHI and Height.
	   * Iteration of CPHI and SPHI to 10**-12 radian resp.
	   * 2*10**-7 arcsec.
	   * --------------------------------------------------------------
	   */
	  CT = Z / RR;
	  ST = P / RR;
	  RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
	  CPHI0 = ST * (1.0 - es) * RX;
	  SPHI0 = CT * RX;
	  iter = 0;

	  /* loop to find sin(Latitude) resp. Latitude
	   * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
	  do {
	    iter++;
	    RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);

	    /*  ellipsoidal (geodetic) height */
	    Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);

	    RK = es * RN / (RN + Height);
	    RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
	    CPHI = ST * (1.0 - RK) * RX;
	    SPHI = CT * RX;
	    SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
	    CPHI0 = CPHI;
	    SPHI0 = SPHI;
	  }
	  while (SDPHI * SDPHI > genau2 && iter < maxiter);

	  /*      ellipsoidal (geodetic) latitude */
	  Latitude = Math.atan(SPHI / Math.abs(CPHI));
	  return {
	    x: Longitude,
	    y: Latitude,
	    z: Height
	  };
	} // cs_geocentric_to_geodetic()

	/****************************************************************/
	// pj_geocentic_to_wgs84( p )
	//  p = point to transform in geocentric coordinates (x,y,z)


	/** point object, nothing fancy, just allows values to be
	    passed back and forth by reference rather than by value.
	    Other point classes may be used as long as they have
	    x and y properties, which will get modified in the transform method.
	*/
	function geocentricToWgs84(p, datum_type, datum_params) {

	  if (datum_type === PJD_3PARAM) {
	    // if( x[io] === HUGE_VAL )
	    //    continue;
	    return {
	      x: p.x + datum_params[0],
	      y: p.y + datum_params[1],
	      z: p.z + datum_params[2],
	    };
	  } else if (datum_type === PJD_7PARAM) {
	    var Dx_BF = datum_params[0];
	    var Dy_BF = datum_params[1];
	    var Dz_BF = datum_params[2];
	    var Rx_BF = datum_params[3];
	    var Ry_BF = datum_params[4];
	    var Rz_BF = datum_params[5];
	    var M_BF = datum_params[6];
	    // if( x[io] === HUGE_VAL )
	    //    continue;
	    return {
	      x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
	      y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
	      z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
	    };
	  }
	} // cs_geocentric_to_wgs84

	/****************************************************************/
	// pj_geocentic_from_wgs84()
	//  coordinate system definition,
	//  point to transform in geocentric coordinates (x,y,z)
	function geocentricFromWgs84(p, datum_type, datum_params) {

	  if (datum_type === PJD_3PARAM) {
	    //if( x[io] === HUGE_VAL )
	    //    continue;
	    return {
	      x: p.x - datum_params[0],
	      y: p.y - datum_params[1],
	      z: p.z - datum_params[2],
	    };

	  } else if (datum_type === PJD_7PARAM) {
	    var Dx_BF = datum_params[0];
	    var Dy_BF = datum_params[1];
	    var Dz_BF = datum_params[2];
	    var Rx_BF = datum_params[3];
	    var Ry_BF = datum_params[4];
	    var Rz_BF = datum_params[5];
	    var M_BF = datum_params[6];
	    var x_tmp = (p.x - Dx_BF) / M_BF;
	    var y_tmp = (p.y - Dy_BF) / M_BF;
	    var z_tmp = (p.z - Dz_BF) / M_BF;
	    //if( x[io] === HUGE_VAL )
	    //    continue;

	    return {
	      x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
	      y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
	      z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
	    };
	  } //cs_geocentric_from_wgs84()
	}

	function checkParams(type) {
	  return (type === PJD_3PARAM || type === PJD_7PARAM);
	}

	var datum_transform = function(source, dest, point) {
	  // Short cut if the datums are identical.
	  if (compareDatums(source, dest)) {
	    return point; // in this case, zero is sucess,
	    // whereas cs_compare_datums returns 1 to indicate TRUE
	    // confusing, should fix this
	  }

	  // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
	  if (source.datum_type === PJD_NODATUM || dest.datum_type === PJD_NODATUM) {
	    return point;
	  }

	  // If this datum requires grid shifts, then apply it to geodetic coordinates.

	  // Do we need to go through geocentric coordinates?
	  if (source.es === dest.es && source.a === dest.a && !checkParams(source.datum_type) &&  !checkParams(dest.datum_type)) {
	    return point;
	  }

	  // Convert to geocentric coordinates.
	  point = geodeticToGeocentric(point, source.es, source.a);
	  // Convert between datums
	  if (checkParams(source.datum_type)) {
	    point = geocentricToWgs84(point, source.datum_type, source.datum_params);
	  }
	  if (checkParams(dest.datum_type)) {
	    point = geocentricFromWgs84(point, dest.datum_type, dest.datum_params);
	  }
	  return geocentricToGeodetic(point, dest.es, dest.a, dest.b);

	};

	var adjust_axis = function(crs, denorm, point) {
	  var xin = point.x,
	    yin = point.y,
	    zin = point.z || 0.0;
	  var v, t, i;
	  var out = {};
	  for (i = 0; i < 3; i++) {
	    if (denorm && i === 2 && point.z === undefined) {
	      continue;
	    }
	    if (i === 0) {
	      v = xin;
	      t = 'x';
	    }
	    else if (i === 1) {
	      v = yin;
	      t = 'y';
	    }
	    else {
	      v = zin;
	      t = 'z';
	    }
	    switch (crs.axis[i]) {
	    case 'e':
	      out[t] = v;
	      break;
	    case 'w':
	      out[t] = -v;
	      break;
	    case 'n':
	      out[t] = v;
	      break;
	    case 's':
	      out[t] = -v;
	      break;
	    case 'u':
	      if (point[t] !== undefined) {
	        out.z = v;
	      }
	      break;
	    case 'd':
	      if (point[t] !== undefined) {
	        out.z = -v;
	      }
	      break;
	    default:
	      //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
	      return null;
	    }
	  }
	  return out;
	};

	var toPoint = function (array){
	  var out = {
	    x: array[0],
	    y: array[1]
	  };
	  if (array.length>2) {
	    out.z = array[2];
	  }
	  if (array.length>3) {
	    out.m = array[3];
	  }
	  return out;
	};

	var checkSanity = function (point) {
	  checkCoord(point.x);
	  checkCoord(point.y);
	};
	function checkCoord(num) {
	  if (typeof Number.isFinite === 'function') {
	    if (Number.isFinite(num)) {
	      return;
	    }
	    throw new TypeError('coordinates must be finite numbers');
	  }
	  if (typeof num !== 'number' || num !== num || !isFinite(num)) {
	    throw new TypeError('coordinates must be finite numbers');
	  }
	}

	function checkNotWGS(source, dest) {
	  return ((source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM) && dest.datumCode !== 'WGS84') || ((dest.datum.datum_type === PJD_3PARAM || dest.datum.datum_type === PJD_7PARAM) && source.datumCode !== 'WGS84');
	}

	function transform(source, dest, point) {
	  var wgs84;
	  if (Array.isArray(point)) {
	    point = toPoint(point);
	  }
	  checkSanity(point);
	  // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
	  if (source.datum && dest.datum && checkNotWGS(source, dest)) {
	    wgs84 = new Projection('WGS84');
	    point = transform(source, wgs84, point);
	    source = wgs84;
	  }
	  // DGR, 2010/11/12
	  if (source.axis !== 'enu') {
	    point = adjust_axis(source, false, point);
	  }
	  // Transform source points to long/lat, if they aren't already.
	  if (source.projName === 'longlat') {
	    point = {
	      x: point.x * D2R,
	      y: point.y * D2R
	    };
	  }
	  else {
	    if (source.to_meter) {
	      point = {
	        x: point.x * source.to_meter,
	        y: point.y * source.to_meter
	      };
	    }
	    point = source.inverse(point); // Convert Cartesian to longlat
	  }
	  // Adjust for the prime meridian if necessary
	  if (source.from_greenwich) {
	    point.x += source.from_greenwich;
	  }

	  // Convert datums if needed, and if possible.
	  point = datum_transform(source.datum, dest.datum, point);

	  // Adjust for the prime meridian if necessary
	  if (dest.from_greenwich) {
	    point = {
	      x: point.x - dest.from_greenwich,
	      y: point.y
	    };
	  }

	  if (dest.projName === 'longlat') {
	    // convert radians to decimal degrees
	    point = {
	      x: point.x * R2D,
	      y: point.y * R2D
	    };
	  } else { // else project
	    point = dest.forward(point);
	    if (dest.to_meter) {
	      point = {
	        x: point.x / dest.to_meter,
	        y: point.y / dest.to_meter
	      };
	    }
	  }

	  // DGR, 2010/11/12
	  if (dest.axis !== 'enu') {
	    return adjust_axis(dest, true, point);
	  }

	  return point;
	}

	var wgs84 = Projection('WGS84');

	function transformer(from, to, coords) {
	  var transformedArray, out, keys;
	  if (Array.isArray(coords)) {
	    transformedArray = transform(from, to, coords);
	    if (coords.length === 3) {
	      return [transformedArray.x, transformedArray.y, transformedArray.z];
	    }
	    else {
	      return [transformedArray.x, transformedArray.y];
	    }
	  }
	  else {
	    out = transform(from, to, coords);
	    keys = Object.keys(coords);
	    if (keys.length === 2) {
	      return out;
	    }
	    keys.forEach(function (key) {
	      if (key === 'x' || key === 'y') {
	        return;
	      }
	      out[key] = coords[key];
	    });
	    return out;
	  }
	}

	function checkProj(item) {
	  if (item instanceof Projection) {
	    return item;
	  }
	  if (item.oProj) {
	    return item.oProj;
	  }
	  return Projection(item);
	}
	function proj4$1(fromProj, toProj, coord) {
	  fromProj = checkProj(fromProj);
	  var single = false;
	  var obj;
	  if (typeof toProj === 'undefined') {
	    toProj = fromProj;
	    fromProj = wgs84;
	    single = true;
	  }
	  else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
	    coord = toProj;
	    toProj = fromProj;
	    fromProj = wgs84;
	    single = true;
	  }
	  toProj = checkProj(toProj);
	  if (coord) {
	    return transformer(fromProj, toProj, coord);
	  }
	  else {
	    obj = {
	      forward: function(coords) {
	        return transformer(fromProj, toProj, coords);
	      },
	      inverse: function(coords) {
	        return transformer(toProj, fromProj, coords);
	      }
	    };
	    if (single) {
	      obj.oProj = toProj;
	    }
	    return obj;
	  }
	}

	/**
	 * UTM zones are grouped, and assigned to one of a group of 6
	 * sets.
	 *
	 * {int} @private
	 */
	var NUM_100K_SETS = 6;

	/**
	 * The column letters (for easting) of the lower left value, per
	 * set.
	 *
	 * {string} @private
	 */
	var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

	/**
	 * The row letters (for northing) of the lower left value, per
	 * set.
	 *
	 * {string} @private
	 */
	var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

	var A = 65; // A
	var I = 73; // I
	var O = 79; // O
	var V = 86; // V
	var Z = 90; // Z
	var mgrs = {
	  forward: forward$1,
	  inverse: inverse$1,
	  toPoint: toPoint$1
	};
	/**
	 * Conversion of lat/lon to MGRS.
	 *
	 * @param {object} ll Object literal with lat and lon properties on a
	 *     WGS84 ellipsoid.
	 * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
	 *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
	 * @return {string} the MGRS string for the given location and accuracy.
	 */
	function forward$1(ll, accuracy) {
	  accuracy = accuracy || 5; // default accuracy 1m
	  return encode(LLtoUTM({
	    lat: ll[1],
	    lon: ll[0]
	  }), accuracy);
	}

	/**
	 * Conversion of MGRS to lat/lon.
	 *
	 * @param {string} mgrs MGRS string.
	 * @return {array} An array with left (longitude), bottom (latitude), right
	 *     (longitude) and top (latitude) values in WGS84, representing the
	 *     bounding box for the provided MGRS reference.
	 */
	function inverse$1(mgrs) {
	  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
	  if (bbox.lat && bbox.lon) {
	    return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
	  }
	  return [bbox.left, bbox.bottom, bbox.right, bbox.top];
	}

	function toPoint$1(mgrs) {
	  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
	  if (bbox.lat && bbox.lon) {
	    return [bbox.lon, bbox.lat];
	  }
	  return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
	}
	/**
	 * Conversion from degrees to radians.
	 *
	 * @private
	 * @param {number} deg the angle in degrees.
	 * @return {number} the angle in radians.
	 */
	function degToRad(deg) {
	  return (deg * (Math.PI / 180.0));
	}

	/**
	 * Conversion from radians to degrees.
	 *
	 * @private
	 * @param {number} rad the angle in radians.
	 * @return {number} the angle in degrees.
	 */
	function radToDeg(rad) {
	  return (180.0 * (rad / Math.PI));
	}

	/**
	 * Converts a set of Longitude and Latitude co-ordinates to UTM
	 * using the WGS84 ellipsoid.
	 *
	 * @private
	 * @param {object} ll Object literal with lat and lon properties
	 *     representing the WGS84 coordinate to be converted.
	 * @return {object} Object literal containing the UTM value with easting,
	 *     northing, zoneNumber and zoneLetter properties, and an optional
	 *     accuracy property in digits. Returns null if the conversion failed.
	 */
	function LLtoUTM(ll) {
	  var Lat = ll.lat;
	  var Long = ll.lon;
	  var a = 6378137.0; //ellip.radius;
	  var eccSquared = 0.00669438; //ellip.eccsq;
	  var k0 = 0.9996;
	  var LongOrigin;
	  var eccPrimeSquared;
	  var N, T, C, A, M;
	  var LatRad = degToRad(Lat);
	  var LongRad = degToRad(Long);
	  var LongOriginRad;
	  var ZoneNumber;
	  // (int)
	  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

	  //Make sure the longitude 180.00 is in Zone 60
	  if (Long === 180) {
	    ZoneNumber = 60;
	  }

	  // Special zone for Norway
	  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
	    ZoneNumber = 32;
	  }

	  // Special zones for Svalbard
	  if (Lat >= 72.0 && Lat < 84.0) {
	    if (Long >= 0.0 && Long < 9.0) {
	      ZoneNumber = 31;
	    }
	    else if (Long >= 9.0 && Long < 21.0) {
	      ZoneNumber = 33;
	    }
	    else if (Long >= 21.0 && Long < 33.0) {
	      ZoneNumber = 35;
	    }
	    else if (Long >= 33.0 && Long < 42.0) {
	      ZoneNumber = 37;
	    }
	  }

	  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
	  // in middle of
	  // zone
	  LongOriginRad = degToRad(LongOrigin);

	  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

	  N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
	  T = Math.tan(LatRad) * Math.tan(LatRad);
	  C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
	  A = Math.cos(LatRad) * (LongRad - LongOriginRad);

	  M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

	  var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

	  var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
	  if (Lat < 0.0) {
	    UTMNorthing += 10000000.0; //10000000 meter offset for
	    // southern hemisphere
	  }

	  return {
	    northing: Math.round(UTMNorthing),
	    easting: Math.round(UTMEasting),
	    zoneNumber: ZoneNumber,
	    zoneLetter: getLetterDesignator(Lat)
	  };
	}

	/**
	 * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
	 * class where the Zone can be specified as a single string eg."60N" which
	 * is then broken down into the ZoneNumber and ZoneLetter.
	 *
	 * @private
	 * @param {object} utm An object literal with northing, easting, zoneNumber
	 *     and zoneLetter properties. If an optional accuracy property is
	 *     provided (in meters), a bounding box will be returned instead of
	 *     latitude and longitude.
	 * @return {object} An object literal containing either lat and lon values
	 *     (if no accuracy was provided), or top, right, bottom and left values
	 *     for the bounding box calculated according to the provided accuracy.
	 *     Returns null if the conversion failed.
	 */
	function UTMtoLL(utm) {

	  var UTMNorthing = utm.northing;
	  var UTMEasting = utm.easting;
	  var zoneLetter = utm.zoneLetter;
	  var zoneNumber = utm.zoneNumber;
	  // check the ZoneNummber is valid
	  if (zoneNumber < 0 || zoneNumber > 60) {
	    return null;
	  }

	  var k0 = 0.9996;
	  var a = 6378137.0; //ellip.radius;
	  var eccSquared = 0.00669438; //ellip.eccsq;
	  var eccPrimeSquared;
	  var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
	  var N1, T1, C1, R1, D, M;
	  var LongOrigin;
	  var mu, phi1Rad;

	  // remove 500,000 meter offset for longitude
	  var x = UTMEasting - 500000.0;
	  var y = UTMNorthing;

	  // We must know somehow if we are in the Northern or Southern
	  // hemisphere, this is the only time we use the letter So even
	  // if the Zone letter isn't exactly correct it should indicate
	  // the hemisphere correctly
	  if (zoneLetter < 'N') {
	    y -= 10000000.0; // remove 10,000,000 meter offset used
	    // for southern hemisphere
	  }

	  // There are 60 zones with zone 1 being at West -180 to -174
	  LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
	  // in middle of
	  // zone

	  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

	  M = y / k0;
	  mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

	  phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
	  // double phi1 = ProjMath.radToDeg(phi1Rad);

	  N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
	  T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
	  C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
	  R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
	  D = x / (N1 * k0);

	  var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
	  lat = radToDeg(lat);

	  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
	  lon = LongOrigin + radToDeg(lon);

	  var result;
	  if (utm.accuracy) {
	    var topRight = UTMtoLL({
	      northing: utm.northing + utm.accuracy,
	      easting: utm.easting + utm.accuracy,
	      zoneLetter: utm.zoneLetter,
	      zoneNumber: utm.zoneNumber
	    });
	    result = {
	      top: topRight.lat,
	      right: topRight.lon,
	      bottom: lat,
	      left: lon
	    };
	  }
	  else {
	    result = {
	      lat: lat,
	      lon: lon
	    };
	  }
	  return result;
	}

	/**
	 * Calculates the MGRS letter designator for the given latitude.
	 *
	 * @private
	 * @param {number} lat The latitude in WGS84 to get the letter designator
	 *     for.
	 * @return {char} The letter designator.
	 */
	function getLetterDesignator(lat) {
	  //This is here as an error flag to show that the Latitude is
	  //outside MGRS limits
	  var LetterDesignator = 'Z';

	  if ((84 >= lat) && (lat >= 72)) {
	    LetterDesignator = 'X';
	  }
	  else if ((72 > lat) && (lat >= 64)) {
	    LetterDesignator = 'W';
	  }
	  else if ((64 > lat) && (lat >= 56)) {
	    LetterDesignator = 'V';
	  }
	  else if ((56 > lat) && (lat >= 48)) {
	    LetterDesignator = 'U';
	  }
	  else if ((48 > lat) && (lat >= 40)) {
	    LetterDesignator = 'T';
	  }
	  else if ((40 > lat) && (lat >= 32)) {
	    LetterDesignator = 'S';
	  }
	  else if ((32 > lat) && (lat >= 24)) {
	    LetterDesignator = 'R';
	  }
	  else if ((24 > lat) && (lat >= 16)) {
	    LetterDesignator = 'Q';
	  }
	  else if ((16 > lat) && (lat >= 8)) {
	    LetterDesignator = 'P';
	  }
	  else if ((8 > lat) && (lat >= 0)) {
	    LetterDesignator = 'N';
	  }
	  else if ((0 > lat) && (lat >= -8)) {
	    LetterDesignator = 'M';
	  }
	  else if ((-8 > lat) && (lat >= -16)) {
	    LetterDesignator = 'L';
	  }
	  else if ((-16 > lat) && (lat >= -24)) {
	    LetterDesignator = 'K';
	  }
	  else if ((-24 > lat) && (lat >= -32)) {
	    LetterDesignator = 'J';
	  }
	  else if ((-32 > lat) && (lat >= -40)) {
	    LetterDesignator = 'H';
	  }
	  else if ((-40 > lat) && (lat >= -48)) {
	    LetterDesignator = 'G';
	  }
	  else if ((-48 > lat) && (lat >= -56)) {
	    LetterDesignator = 'F';
	  }
	  else if ((-56 > lat) && (lat >= -64)) {
	    LetterDesignator = 'E';
	  }
	  else if ((-64 > lat) && (lat >= -72)) {
	    LetterDesignator = 'D';
	  }
	  else if ((-72 > lat) && (lat >= -80)) {
	    LetterDesignator = 'C';
	  }
	  return LetterDesignator;
	}

	/**
	 * Encodes a UTM location as MGRS string.
	 *
	 * @private
	 * @param {object} utm An object literal with easting, northing,
	 *     zoneLetter, zoneNumber
	 * @param {number} accuracy Accuracy in digits (1-5).
	 * @return {string} MGRS string for the given UTM location.
	 */
	function encode(utm, accuracy) {
	  // prepend with leading zeroes
	  var seasting = "00000" + utm.easting,
	    snorthing = "00000" + utm.northing;

	  return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
	}

	/**
	 * Get the two letter 100k designator for a given UTM easting,
	 * northing and zone number value.
	 *
	 * @private
	 * @param {number} easting
	 * @param {number} northing
	 * @param {number} zoneNumber
	 * @return the two letter 100k designator for the given UTM location.
	 */
	function get100kID(easting, northing, zoneNumber) {
	  var setParm = get100kSetForZone(zoneNumber);
	  var setColumn = Math.floor(easting / 100000);
	  var setRow = Math.floor(northing / 100000) % 20;
	  return getLetter100kID(setColumn, setRow, setParm);
	}

	/**
	 * Given a UTM zone number, figure out the MGRS 100K set it is in.
	 *
	 * @private
	 * @param {number} i An UTM zone number.
	 * @return {number} the 100k set the UTM zone is in.
	 */
	function get100kSetForZone(i) {
	  var setParm = i % NUM_100K_SETS;
	  if (setParm === 0) {
	    setParm = NUM_100K_SETS;
	  }

	  return setParm;
	}

	/**
	 * Get the two-letter MGRS 100k designator given information
	 * translated from the UTM northing, easting and zone number.
	 *
	 * @private
	 * @param {number} column the column index as it relates to the MGRS
	 *        100k set spreadsheet, created from the UTM easting.
	 *        Values are 1-8.
	 * @param {number} row the row index as it relates to the MGRS 100k set
	 *        spreadsheet, created from the UTM northing value. Values
	 *        are from 0-19.
	 * @param {number} parm the set block, as it relates to the MGRS 100k set
	 *        spreadsheet, created from the UTM zone. Values are from
	 *        1-60.
	 * @return two letter MGRS 100k code.
	 */
	function getLetter100kID(column, row, parm) {
	  // colOrigin and rowOrigin are the letters at the origin of the set
	  var index = parm - 1;
	  var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
	  var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

	  // colInt and rowInt are the letters to build to return
	  var colInt = colOrigin + column - 1;
	  var rowInt = rowOrigin + row;
	  var rollover = false;

	  if (colInt > Z) {
	    colInt = colInt - Z + A - 1;
	    rollover = true;
	  }

	  if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
	    colInt++;
	  }

	  if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
	    colInt++;

	    if (colInt === I) {
	      colInt++;
	    }
	  }

	  if (colInt > Z) {
	    colInt = colInt - Z + A - 1;
	  }

	  if (rowInt > V) {
	    rowInt = rowInt - V + A - 1;
	    rollover = true;
	  }
	  else {
	    rollover = false;
	  }

	  if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
	    rowInt++;
	  }

	  if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
	    rowInt++;

	    if (rowInt === I) {
	      rowInt++;
	    }
	  }

	  if (rowInt > V) {
	    rowInt = rowInt - V + A - 1;
	  }

	  var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
	  return twoLetter;
	}

	/**
	 * Decode the UTM parameters from a MGRS string.
	 *
	 * @private
	 * @param {string} mgrsString an UPPERCASE coordinate string is expected.
	 * @return {object} An object literal with easting, northing, zoneLetter,
	 *     zoneNumber and accuracy (in meters) properties.
	 */
	function decode(mgrsString) {

	  if (mgrsString && mgrsString.length === 0) {
	    throw ("MGRSPoint coverting from nothing");
	  }

	  var length = mgrsString.length;

	  var hunK = null;
	  var sb = "";
	  var testChar;
	  var i = 0;

	  // get Zone number
	  while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
	    if (i >= 2) {
	      throw ("MGRSPoint bad conversion from: " + mgrsString);
	    }
	    sb += testChar;
	    i++;
	  }

	  var zoneNumber = parseInt(sb, 10);

	  if (i === 0 || i + 3 > length) {
	    // A good MGRS string has to be 4-5 digits long,
	    // ##AAA/#AAA at least.
	    throw ("MGRSPoint bad conversion from: " + mgrsString);
	  }

	  var zoneLetter = mgrsString.charAt(i++);

	  // Should we check the zone letter here? Why not.
	  if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
	    throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
	  }

	  hunK = mgrsString.substring(i, i += 2);

	  var set = get100kSetForZone(zoneNumber);

	  var east100k = getEastingFromChar(hunK.charAt(0), set);
	  var north100k = getNorthingFromChar(hunK.charAt(1), set);

	  // We have a bug where the northing may be 2000000 too low.
	  // How
	  // do we know when to roll over?

	  while (north100k < getMinNorthing(zoneLetter)) {
	    north100k += 2000000;
	  }

	  // calculate the char index for easting/northing separator
	  var remainder = length - i;

	  if (remainder % 2 !== 0) {
	    throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
	  }

	  var sep = remainder / 2;

	  var sepEasting = 0.0;
	  var sepNorthing = 0.0;
	  var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
	  if (sep > 0) {
	    accuracyBonus = 100000.0 / Math.pow(10, sep);
	    sepEastingString = mgrsString.substring(i, i + sep);
	    sepEasting = parseFloat(sepEastingString) * accuracyBonus;
	    sepNorthingString = mgrsString.substring(i + sep);
	    sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
	  }

	  easting = sepEasting + east100k;
	  northing = sepNorthing + north100k;

	  return {
	    easting: easting,
	    northing: northing,
	    zoneLetter: zoneLetter,
	    zoneNumber: zoneNumber,
	    accuracy: accuracyBonus
	  };
	}

	/**
	 * Given the first letter from a two-letter MGRS 100k zone, and given the
	 * MGRS table set for the zone number, figure out the easting value that
	 * should be added to the other, secondary easting value.
	 *
	 * @private
	 * @param {char} e The first letter from a two-letter MGRS 100´k zone.
	 * @param {number} set The MGRS table set for the zone number.
	 * @return {number} The easting value for the given letter and set.
	 */
	function getEastingFromChar(e, set) {
	  // colOrigin is the letter at the origin of the set for the
	  // column
	  var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
	  var eastingValue = 100000.0;
	  var rewindMarker = false;

	  while (curCol !== e.charCodeAt(0)) {
	    curCol++;
	    if (curCol === I) {
	      curCol++;
	    }
	    if (curCol === O) {
	      curCol++;
	    }
	    if (curCol > Z) {
	      if (rewindMarker) {
	        throw ("Bad character: " + e);
	      }
	      curCol = A;
	      rewindMarker = true;
	    }
	    eastingValue += 100000.0;
	  }

	  return eastingValue;
	}

	/**
	 * Given the second letter from a two-letter MGRS 100k zone, and given the
	 * MGRS table set for the zone number, figure out the northing value that
	 * should be added to the other, secondary northing value. You have to
	 * remember that Northings are determined from the equator, and the vertical
	 * cycle of letters mean a 2000000 additional northing meters. This happens
	 * approx. every 18 degrees of latitude. This method does *NOT* count any
	 * additional northings. You have to figure out how many 2000000 meters need
	 * to be added for the zone letter of the MGRS coordinate.
	 *
	 * @private
	 * @param {char} n Second letter of the MGRS 100k zone
	 * @param {number} set The MGRS table set number, which is dependent on the
	 *     UTM zone number.
	 * @return {number} The northing value for the given letter and set.
	 */
	function getNorthingFromChar(n, set) {

	  if (n > 'V') {
	    throw ("MGRSPoint given invalid Northing " + n);
	  }

	  // rowOrigin is the letter at the origin of the set for the
	  // column
	  var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
	  var northingValue = 0.0;
	  var rewindMarker = false;

	  while (curRow !== n.charCodeAt(0)) {
	    curRow++;
	    if (curRow === I) {
	      curRow++;
	    }
	    if (curRow === O) {
	      curRow++;
	    }
	    // fixing a bug making whole application hang in this loop
	    // when 'n' is a wrong character
	    if (curRow > V) {
	      if (rewindMarker) { // making sure that this loop ends
	        throw ("Bad character: " + n);
	      }
	      curRow = A;
	      rewindMarker = true;
	    }
	    northingValue += 100000.0;
	  }

	  return northingValue;
	}

	/**
	 * The function getMinNorthing returns the minimum northing value of a MGRS
	 * zone.
	 *
	 * Ported from Geotrans' c Lattitude_Band_Value structure table.
	 *
	 * @private
	 * @param {char} zoneLetter The MGRS zone to get the min northing for.
	 * @return {number}
	 */
	function getMinNorthing(zoneLetter) {
	  var northing;
	  switch (zoneLetter) {
	  case 'C':
	    northing = 1100000.0;
	    break;
	  case 'D':
	    northing = 2000000.0;
	    break;
	  case 'E':
	    northing = 2800000.0;
	    break;
	  case 'F':
	    northing = 3700000.0;
	    break;
	  case 'G':
	    northing = 4600000.0;
	    break;
	  case 'H':
	    northing = 5500000.0;
	    break;
	  case 'J':
	    northing = 6400000.0;
	    break;
	  case 'K':
	    northing = 7300000.0;
	    break;
	  case 'L':
	    northing = 8200000.0;
	    break;
	  case 'M':
	    northing = 9100000.0;
	    break;
	  case 'N':
	    northing = 0.0;
	    break;
	  case 'P':
	    northing = 800000.0;
	    break;
	  case 'Q':
	    northing = 1700000.0;
	    break;
	  case 'R':
	    northing = 2600000.0;
	    break;
	  case 'S':
	    northing = 3500000.0;
	    break;
	  case 'T':
	    northing = 4400000.0;
	    break;
	  case 'U':
	    northing = 5300000.0;
	    break;
	  case 'V':
	    northing = 6200000.0;
	    break;
	  case 'W':
	    northing = 7000000.0;
	    break;
	  case 'X':
	    northing = 7900000.0;
	    break;
	  default:
	    northing = -1.0;
	  }
	  if (northing >= 0.0) {
	    return northing;
	  }
	  else {
	    throw ("Invalid zone letter: " + zoneLetter);
	  }

	}

	function Point(x, y, z) {
	  if (!(this instanceof Point)) {
	    return new Point(x, y, z);
	  }
	  if (Array.isArray(x)) {
	    this.x = x[0];
	    this.y = x[1];
	    this.z = x[2] || 0.0;
	  } else if(typeof x === 'object') {
	    this.x = x.x;
	    this.y = x.y;
	    this.z = x.z || 0.0;
	  } else if (typeof x === 'string' && typeof y === 'undefined') {
	    var coords = x.split(',');
	    this.x = parseFloat(coords[0], 10);
	    this.y = parseFloat(coords[1], 10);
	    this.z = parseFloat(coords[2], 10) || 0.0;
	  } else {
	    this.x = x;
	    this.y = y;
	    this.z = z || 0.0;
	  }
	  console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
	}

	Point.fromMGRS = function(mgrsStr) {
	  return new Point(toPoint$1(mgrsStr));
	};
	Point.prototype.toMGRS = function(accuracy) {
	  return forward$1([this.x, this.y], accuracy);
	};

	var version = "2.5.0";

	var C00 = 1;
	var C02 = 0.25;
	var C04 = 0.046875;
	var C06 = 0.01953125;
	var C08 = 0.01068115234375;
	var C22 = 0.75;
	var C44 = 0.46875;
	var C46 = 0.01302083333333333333;
	var C48 = 0.00712076822916666666;
	var C66 = 0.36458333333333333333;
	var C68 = 0.00569661458333333333;
	var C88 = 0.3076171875;

	var pj_enfn = function(es) {
	  var en = [];
	  en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
	  en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
	  var t = es * es;
	  en[2] = t * (C44 - es * (C46 + es * C48));
	  t *= es;
	  en[3] = t * (C66 - es * C68);
	  en[4] = t * es * C88;
	  return en;
	};

	var pj_mlfn = function(phi, sphi, cphi, en) {
	  cphi *= sphi;
	  sphi *= sphi;
	  return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
	};

	var MAX_ITER = 20;

	var pj_inv_mlfn = function(arg, es, en) {
	  var k = 1 / (1 - es);
	  var phi = arg;
	  for (var i = MAX_ITER; i; --i) { /* rarely goes over 2 iterations */
	    var s = Math.sin(phi);
	    var t = 1 - es * s * s;
	    //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
	    //phi -= t * (t * Math.sqrt(t)) * k;
	    t = (pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
	    phi -= t;
	    if (Math.abs(t) < EPSLN) {
	      return phi;
	    }
	  }
	  //..reportError("cass:pj_inv_mlfn: Convergence error");
	  return phi;
	};

	// Heavily based on this tmerc projection implementation
	// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/tmerc.js

	function init$2() {
	  this.x0 = this.x0 !== undefined ? this.x0 : 0;
	  this.y0 = this.y0 !== undefined ? this.y0 : 0;
	  this.long0 = this.long0 !== undefined ? this.long0 : 0;
	  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

	  if (this.es) {
	    this.en = pj_enfn(this.es);
	    this.ml0 = pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
	  }
	}

	/**
	    Transverse Mercator Forward  - long/lat to x/y
	    long/lat in radians
	  */
	function forward$2(p) {
	  var lon = p.x;
	  var lat = p.y;

	  var delta_lon = adjust_lon(lon - this.long0);
	  var con;
	  var x, y;
	  var sin_phi = Math.sin(lat);
	  var cos_phi = Math.cos(lat);

	  if (!this.es) {
	    var b = cos_phi * Math.sin(delta_lon);

	    if ((Math.abs(Math.abs(b) - 1)) < EPSLN) {
	      return (93);
	    }
	    else {
	      x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
	      y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
	      b = Math.abs(y);

	      if (b >= 1) {
	        if ((b - 1) > EPSLN) {
	          return (93);
	        }
	        else {
	          y = 0;
	        }
	      }
	      else {
	        y = Math.acos(y);
	      }

	      if (lat < 0) {
	        y = -y;
	      }

	      y = this.a * this.k0 * (y - this.lat0) + this.y0;
	    }
	  }
	  else {
	    var al = cos_phi * delta_lon;
	    var als = Math.pow(al, 2);
	    var c = this.ep2 * Math.pow(cos_phi, 2);
	    var cs = Math.pow(c, 2);
	    var tq = Math.abs(cos_phi) > EPSLN ? Math.tan(lat) : 0;
	    var t = Math.pow(tq, 2);
	    var ts = Math.pow(t, 2);
	    con = 1 - this.es * Math.pow(sin_phi, 2);
	    al = al / Math.sqrt(con);
	    var ml = pj_mlfn(lat, sin_phi, cos_phi, this.en);

	    x = this.a * (this.k0 * al * (1 +
	      als / 6 * (1 - t + c +
	      als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c +
	      als / 42 * (61 + 179 * ts - ts * t - 479 * t))))) +
	      this.x0;

	    y = this.a * (this.k0 * (ml - this.ml0 +
	      sin_phi * delta_lon * al / 2 * (1 +
	      als / 12 * (5 - t + 9 * c + 4 * cs +
	      als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c +
	      als / 56 * (1385 + 543 * ts - ts * t - 3111 * t)))))) +
	      this.y0;
	  }

	  p.x = x;
	  p.y = y;

	  return p;
	}

	/**
	    Transverse Mercator Inverse  -  x/y to long/lat
	  */
	function inverse$2(p) {
	  var con, phi;
	  var lat, lon;
	  var x = (p.x - this.x0) * (1 / this.a);
	  var y = (p.y - this.y0) * (1 / this.a);

	  if (!this.es) {
	    var f = Math.exp(x / this.k0);
	    var g = 0.5 * (f - 1 / f);
	    var temp = this.lat0 + y / this.k0;
	    var h = Math.cos(temp);
	    con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
	    lat = Math.asin(con);

	    if (y < 0) {
	      lat = -lat;
	    }

	    if ((g === 0) && (h === 0)) {
	      lon = 0;
	    }
	    else {
	      lon = adjust_lon(Math.atan2(g, h) + this.long0);
	    }
	  }
	  else { // ellipsoidal form
	    con = this.ml0 + y / this.k0;
	    phi = pj_inv_mlfn(con, this.es, this.en);

	    if (Math.abs(phi) < HALF_PI) {
	      var sin_phi = Math.sin(phi);
	      var cos_phi = Math.cos(phi);
	      var tan_phi = Math.abs(cos_phi) > EPSLN ? Math.tan(phi) : 0;
	      var c = this.ep2 * Math.pow(cos_phi, 2);
	      var cs = Math.pow(c, 2);
	      var t = Math.pow(tan_phi, 2);
	      var ts = Math.pow(t, 2);
	      con = 1 - this.es * Math.pow(sin_phi, 2);
	      var d = x * Math.sqrt(con) / this.k0;
	      var ds = Math.pow(d, 2);
	      con = con * tan_phi;

	      lat = phi - (con * ds / (1 - this.es)) * 0.5 * (1 -
	        ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs -
	        ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c -
	        ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));

	      lon = adjust_lon(this.long0 + (d * (1 -
	        ds / 6 * (1 + 2 * t + c -
	        ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c -
	        ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi));
	    }
	    else {
	      lat = HALF_PI * sign(y);
	      lon = 0;
	    }
	  }

	  p.x = lon;
	  p.y = lat;

	  return p;
	}

	var names$3 = ["Transverse_Mercator", "Transverse Mercator", "tmerc"];
	var tmerc = {
	  init: init$2,
	  forward: forward$2,
	  inverse: inverse$2,
	  names: names$3
	};

	var sinh = function(x) {
	  var r = Math.exp(x);
	  r = (r - 1 / r) / 2;
	  return r;
	};

	var hypot = function(x, y) {
	  x = Math.abs(x);
	  y = Math.abs(y);
	  var a = Math.max(x, y);
	  var b = Math.min(x, y) / (a ? a : 1);

	  return a * Math.sqrt(1 + Math.pow(b, 2));
	};

	var log1py = function(x) {
	  var y = 1 + x;
	  var z = y - 1;

	  return z === 0 ? x : x * Math.log(y) / z;
	};

	var asinhy = function(x) {
	  var y = Math.abs(x);
	  y = log1py(y * (1 + y / (hypot(1, y) + 1)));

	  return x < 0 ? -y : y;
	};

	var gatg = function(pp, B) {
	  var cos_2B = 2 * Math.cos(2 * B);
	  var i = pp.length - 1;
	  var h1 = pp[i];
	  var h2 = 0;
	  var h;

	  while (--i >= 0) {
	    h = -h2 + cos_2B * h1 + pp[i];
	    h2 = h1;
	    h1 = h;
	  }

	  return (B + h * Math.sin(2 * B));
	};

	var clens = function(pp, arg_r) {
	  var r = 2 * Math.cos(arg_r);
	  var i = pp.length - 1;
	  var hr1 = pp[i];
	  var hr2 = 0;
	  var hr;

	  while (--i >= 0) {
	    hr = -hr2 + r * hr1 + pp[i];
	    hr2 = hr1;
	    hr1 = hr;
	  }

	  return Math.sin(arg_r) * hr;
	};

	var cosh = function(x) {
	  var r = Math.exp(x);
	  r = (r + 1 / r) / 2;
	  return r;
	};

	var clens_cmplx = function(pp, arg_r, arg_i) {
	  var sin_arg_r = Math.sin(arg_r);
	  var cos_arg_r = Math.cos(arg_r);
	  var sinh_arg_i = sinh(arg_i);
	  var cosh_arg_i = cosh(arg_i);
	  var r = 2 * cos_arg_r * cosh_arg_i;
	  var i = -2 * sin_arg_r * sinh_arg_i;
	  var j = pp.length - 1;
	  var hr = pp[j];
	  var hi1 = 0;
	  var hr1 = 0;
	  var hi = 0;
	  var hr2;
	  var hi2;

	  while (--j >= 0) {
	    hr2 = hr1;
	    hi2 = hi1;
	    hr1 = hr;
	    hi1 = hi;
	    hr = -hr2 + r * hr1 - i * hi1 + pp[j];
	    hi = -hi2 + i * hr1 + r * hi1;
	  }

	  r = sin_arg_r * cosh_arg_i;
	  i = cos_arg_r * sinh_arg_i;

	  return [r * hr - i * hi, r * hi + i * hr];
	};

	// Heavily based on this etmerc projection implementation
	// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/etmerc.js

	function init$3() {
	  if (this.es === undefined || this.es <= 0) {
	    throw new Error('incorrect elliptical usage');
	  }

	  this.x0 = this.x0 !== undefined ? this.x0 : 0;
	  this.y0 = this.y0 !== undefined ? this.y0 : 0;
	  this.long0 = this.long0 !== undefined ? this.long0 : 0;
	  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

	  this.cgb = [];
	  this.cbg = [];
	  this.utg = [];
	  this.gtu = [];

	  var f = this.es / (1 + Math.sqrt(1 - this.es));
	  var n = f / (2 - f);
	  var np = n;

	  this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675 ))))));
	  this.cbg[0] = n * (-2 + n * ( 2 / 3 + n * ( 4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

	  np = np * n;
	  this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
	  this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * ( -13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

	  np = np * n;
	  this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
	  this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

	  np = np * n;
	  this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
	  this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * ( -24832 / 14175)));

	  np = np * n;
	  this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
	  this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

	  np = np * n;
	  this.cgb[5] = np * (601676 / 22275);
	  this.cbg[5] = np * (444337 / 155925);

	  np = Math.pow(n, 2);
	  this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

	  this.utg[0] = n * (-0.5 + n * ( 2 / 3 + n * (-37 / 96 + n * ( 1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
	  this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

	  this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
	  this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

	  np = np * n;
	  this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720 ))));
	  this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

	  np = np * n;
	  this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
	  this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

	  np = np * n;
	  this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
	  this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

	  np = np * n;
	  this.utg[5] = np * (-20648693 / 638668800);
	  this.gtu[5] = np * (212378941 / 319334400);

	  var Z = gatg(this.cbg, this.lat0);
	  this.Zb = -this.Qn * (Z + clens(this.gtu, 2 * Z));
	}

	function forward$3(p) {
	  var Ce = adjust_lon(p.x - this.long0);
	  var Cn = p.y;

	  Cn = gatg(this.cbg, Cn);
	  var sin_Cn = Math.sin(Cn);
	  var cos_Cn = Math.cos(Cn);
	  var sin_Ce = Math.sin(Ce);
	  var cos_Ce = Math.cos(Ce);

	  Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
	  Ce = Math.atan2(sin_Ce * cos_Cn, hypot(sin_Cn, cos_Cn * cos_Ce));
	  Ce = asinhy(Math.tan(Ce));

	  var tmp = clens_cmplx(this.gtu, 2 * Cn, 2 * Ce);

	  Cn = Cn + tmp[0];
	  Ce = Ce + tmp[1];

	  var x;
	  var y;

	  if (Math.abs(Ce) <= 2.623395162778) {
	    x = this.a * (this.Qn * Ce) + this.x0;
	    y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
	  }
	  else {
	    x = Infinity;
	    y = Infinity;
	  }

	  p.x = x;
	  p.y = y;

	  return p;
	}

	function inverse$3(p) {
	  var Ce = (p.x - this.x0) * (1 / this.a);
	  var Cn = (p.y - this.y0) * (1 / this.a);

	  Cn = (Cn - this.Zb) / this.Qn;
	  Ce = Ce / this.Qn;

	  var lon;
	  var lat;

	  if (Math.abs(Ce) <= 2.623395162778) {
	    var tmp = clens_cmplx(this.utg, 2 * Cn, 2 * Ce);

	    Cn = Cn + tmp[0];
	    Ce = Ce + tmp[1];
	    Ce = Math.atan(sinh(Ce));

	    var sin_Cn = Math.sin(Cn);
	    var cos_Cn = Math.cos(Cn);
	    var sin_Ce = Math.sin(Ce);
	    var cos_Ce = Math.cos(Ce);

	    Cn = Math.atan2(sin_Cn * cos_Ce, hypot(sin_Ce, cos_Ce * cos_Cn));
	    Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

	    lon = adjust_lon(Ce + this.long0);
	    lat = gatg(this.cgb, Cn);
	  }
	  else {
	    lon = Infinity;
	    lat = Infinity;
	  }

	  p.x = lon;
	  p.y = lat;

	  return p;
	}

	var names$4 = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc"];
	var etmerc = {
	  init: init$3,
	  forward: forward$3,
	  inverse: inverse$3,
	  names: names$4
	};

	var adjust_zone = function(zone, lon) {
	  if (zone === undefined) {
	    zone = Math.floor((adjust_lon(lon) + Math.PI) * 30 / Math.PI) + 1;

	    if (zone < 0) {
	      return 0;
	    } else if (zone > 60) {
	      return 60;
	    }
	  }
	  return zone;
	};

	var dependsOn = 'etmerc';
	function init$4() {
	  var zone = adjust_zone(this.zone, this.long0);
	  if (zone === undefined) {
	    throw new Error('unknown utm zone');
	  }
	  this.lat0 = 0;
	  this.long0 =  ((6 * Math.abs(zone)) - 183) * D2R;
	  this.x0 = 500000;
	  this.y0 = this.utmSouth ? 10000000 : 0;
	  this.k0 = 0.9996;

	  etmerc.init.apply(this);
	  this.forward = etmerc.forward;
	  this.inverse = etmerc.inverse;
	}

	var names$5 = ["Universal Transverse Mercator System", "utm"];
	var utm = {
	  init: init$4,
	  names: names$5,
	  dependsOn: dependsOn
	};

	var srat = function(esinp, exp) {
	  return (Math.pow((1 - esinp) / (1 + esinp), exp));
	};

	var MAX_ITER$1 = 20;
	function init$6() {
	  var sphi = Math.sin(this.lat0);
	  var cphi = Math.cos(this.lat0);
	  cphi *= cphi;
	  this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
	  this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
	  this.phic0 = Math.asin(sphi / this.C);
	  this.ratexp = 0.5 * this.C * this.e;
	  this.K = Math.tan(0.5 * this.phic0 + FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + FORTPI), this.C) * srat(this.e * sphi, this.ratexp));
	}

	function forward$5(p) {
	  var lon = p.x;
	  var lat = p.y;

	  p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + FORTPI), this.C) * srat(this.e * Math.sin(lat), this.ratexp)) - HALF_PI;
	  p.x = this.C * lon;
	  return p;
	}

	function inverse$5(p) {
	  var DEL_TOL = 1e-14;
	  var lon = p.x / this.C;
	  var lat = p.y;
	  var num = Math.pow(Math.tan(0.5 * lat + FORTPI) / this.K, 1 / this.C);
	  for (var i = MAX_ITER$1; i > 0; --i) {
	    lat = 2 * Math.atan(num * srat(this.e * Math.sin(p.y), - 0.5 * this.e)) - HALF_PI;
	    if (Math.abs(lat - p.y) < DEL_TOL) {
	      break;
	    }
	    p.y = lat;
	  }
	  /* convergence failed */
	  if (!i) {
	    return null;
	  }
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$7 = ["gauss"];
	var gauss = {
	  init: init$6,
	  forward: forward$5,
	  inverse: inverse$5,
	  names: names$7
	};

	function init$5() {
	  gauss.init.apply(this);
	  if (!this.rc) {
	    return;
	  }
	  this.sinc0 = Math.sin(this.phic0);
	  this.cosc0 = Math.cos(this.phic0);
	  this.R2 = 2 * this.rc;
	  if (!this.title) {
	    this.title = "Oblique Stereographic Alternative";
	  }
	}

	function forward$4(p) {
	  var sinc, cosc, cosl, k;
	  p.x = adjust_lon(p.x - this.long0);
	  gauss.forward.apply(this, [p]);
	  sinc = Math.sin(p.y);
	  cosc = Math.cos(p.y);
	  cosl = Math.cos(p.x);
	  k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
	  p.x = k * cosc * Math.sin(p.x);
	  p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
	  p.x = this.a * p.x + this.x0;
	  p.y = this.a * p.y + this.y0;
	  return p;
	}

	function inverse$4(p) {
	  var sinc, cosc, lon, lat, rho;
	  p.x = (p.x - this.x0) / this.a;
	  p.y = (p.y - this.y0) / this.a;

	  p.x /= this.k0;
	  p.y /= this.k0;
	  if ((rho = Math.sqrt(p.x * p.x + p.y * p.y))) {
	    var c = 2 * Math.atan2(rho, this.R2);
	    sinc = Math.sin(c);
	    cosc = Math.cos(c);
	    lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
	    lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
	  }
	  else {
	    lat = this.phic0;
	    lon = 0;
	  }

	  p.x = lon;
	  p.y = lat;
	  gauss.inverse.apply(this, [p]);
	  p.x = adjust_lon(p.x + this.long0);
	  return p;
	}

	var names$6 = ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea","Oblique Stereographic Alternative","Double_Stereographic"];
	var sterea = {
	  init: init$5,
	  forward: forward$4,
	  inverse: inverse$4,
	  names: names$6
	};

	function ssfn_(phit, sinphi, eccen) {
	  sinphi *= eccen;
	  return (Math.tan(0.5 * (HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
	}

	function init$7() {
	  this.coslat0 = Math.cos(this.lat0);
	  this.sinlat0 = Math.sin(this.lat0);
	  if (this.sphere) {
	    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
	      this.k0 = 0.5 * (1 + sign(this.lat0) * Math.sin(this.lat_ts));
	    }
	  }
	  else {
	    if (Math.abs(this.coslat0) <= EPSLN) {
	      if (this.lat0 > 0) {
	        //North pole
	        //trace('stere:north pole');
	        this.con = 1;
	      }
	      else {
	        //South pole
	        //trace('stere:south pole');
	        this.con = -1;
	      }
	    }
	    this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
	    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
	      this.k0 = 0.5 * this.cons * msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / tsfnz(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
	    }
	    this.ms1 = msfnz(this.e, this.sinlat0, this.coslat0);
	    this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - HALF_PI;
	    this.cosX0 = Math.cos(this.X0);
	    this.sinX0 = Math.sin(this.X0);
	  }
	}

	// Stereographic forward equations--mapping lat,long to x,y
	function forward$6(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var sinlat = Math.sin(lat);
	  var coslat = Math.cos(lat);
	  var A, X, sinX, cosX, ts, rh;
	  var dlon = adjust_lon(lon - this.long0);

	  if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= EPSLN && Math.abs(lat + this.lat0) <= EPSLN) {
	    //case of the origine point
	    //trace('stere:this is the origin point');
	    p.x = NaN;
	    p.y = NaN;
	    return p;
	  }
	  if (this.sphere) {
	    //trace('stere:sphere case');
	    A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
	    p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
	    p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
	    return p;
	  }
	  else {
	    X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - HALF_PI;
	    cosX = Math.cos(X);
	    sinX = Math.sin(X);
	    if (Math.abs(this.coslat0) <= EPSLN) {
	      ts = tsfnz(this.e, lat * this.con, this.con * sinlat);
	      rh = 2 * this.a * this.k0 * ts / this.cons;
	      p.x = this.x0 + rh * Math.sin(lon - this.long0);
	      p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
	      //trace(p.toString());
	      return p;
	    }
	    else if (Math.abs(this.sinlat0) < EPSLN) {
	      //Eq
	      //trace('stere:equateur');
	      A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
	      p.y = A * sinX;
	    }
	    else {
	      //other case
	      //trace('stere:normal case');
	      A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
	      p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
	    }
	    p.x = A * cosX * Math.sin(dlon) + this.x0;
	  }
	  //trace(p.toString());
	  return p;
	}

	//* Stereographic inverse equations--mapping x,y to lat/long
	function inverse$6(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var lon, lat, ts, ce, Chi;
	  var rh = Math.sqrt(p.x * p.x + p.y * p.y);
	  if (this.sphere) {
	    var c = 2 * Math.atan(rh / (2 * this.a * this.k0));
	    lon = this.long0;
	    lat = this.lat0;
	    if (rh <= EPSLN) {
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	    lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
	    if (Math.abs(this.coslat0) < EPSLN) {
	      if (this.lat0 > 0) {
	        lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
	      }
	      else {
	        lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
	      }
	    }
	    else {
	      lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
	    }
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  else {
	    if (Math.abs(this.coslat0) <= EPSLN) {
	      if (rh <= EPSLN) {
	        lat = this.lat0;
	        lon = this.long0;
	        p.x = lon;
	        p.y = lat;
	        //trace(p.toString());
	        return p;
	      }
	      p.x *= this.con;
	      p.y *= this.con;
	      ts = rh * this.cons / (2 * this.a * this.k0);
	      lat = this.con * phi2z(this.e, ts);
	      lon = this.con * adjust_lon(this.con * this.long0 + Math.atan2(p.x, - 1 * p.y));
	    }
	    else {
	      ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
	      lon = this.long0;
	      if (rh <= EPSLN) {
	        Chi = this.X0;
	      }
	      else {
	        Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
	        lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
	      }
	      lat = -1 * phi2z(this.e, Math.tan(0.5 * (HALF_PI + Chi)));
	    }
	  }
	  p.x = lon;
	  p.y = lat;

	  //trace(p.toString());
	  return p;

	}

	var names$8 = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"];
	var stere = {
	  init: init$7,
	  forward: forward$6,
	  inverse: inverse$6,
	  names: names$8,
	  ssfn_: ssfn_
	};

	/*
	  references:
	    Formules et constantes pour le Calcul pour la
	    projection cylindrique conforme à axe oblique et pour la transformation entre
	    des systèmes de référence.
	    http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
	  */

	function init$8() {
	  var phy0 = this.lat0;
	  this.lambda0 = this.long0;
	  var sinPhy0 = Math.sin(phy0);
	  var semiMajorAxis = this.a;
	  var invF = this.rf;
	  var flattening = 1 / invF;
	  var e2 = 2 * flattening - Math.pow(flattening, 2);
	  var e = this.e = Math.sqrt(e2);
	  this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
	  this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
	  this.b0 = Math.asin(sinPhy0 / this.alpha);
	  var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
	  var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
	  var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
	  this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
	}

	function forward$7(p) {
	  var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
	  var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
	  var S = -this.alpha * (Sa1 + Sa2) + this.K;

	  // spheric latitude
	  var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

	  // spheric longitude
	  var I = this.alpha * (p.x - this.lambda0);

	  // psoeudo equatorial rotation
	  var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

	  var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

	  p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
	  p.x = this.R * rotI + this.x0;
	  return p;
	}

	function inverse$7(p) {
	  var Y = p.x - this.x0;
	  var X = p.y - this.y0;

	  var rotI = Y / this.R;
	  var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

	  var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
	  var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

	  var lambda = this.lambda0 + I / this.alpha;

	  var S = 0;
	  var phy = b;
	  var prevPhy = -1000;
	  var iteration = 0;
	  while (Math.abs(phy - prevPhy) > 0.0000001) {
	    if (++iteration > 20) {
	      //...reportError("omercFwdInfinity");
	      return;
	    }
	    //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
	    S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
	    prevPhy = phy;
	    phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
	  }

	  p.x = lambda;
	  p.y = phy;
	  return p;
	}

	var names$9 = ["somerc"];
	var somerc = {
	  init: init$8,
	  forward: forward$7,
	  inverse: inverse$7,
	  names: names$9
	};

	/* Initialize the Oblique Mercator  projection
	    ------------------------------------------*/
	function init$9() {
	  this.no_off = this.no_off || false;
	  this.no_rot = this.no_rot || false;

	  if (isNaN(this.k0)) {
	    this.k0 = 1;
	  }
	  var sinlat = Math.sin(this.lat0);
	  var coslat = Math.cos(this.lat0);
	  var con = this.e * sinlat;

	  this.bl = Math.sqrt(1 + this.es / (1 - this.es) * Math.pow(coslat, 4));
	  this.al = this.a * this.bl * this.k0 * Math.sqrt(1 - this.es) / (1 - con * con);
	  var t0 = tsfnz(this.e, this.lat0, sinlat);
	  var dl = this.bl / coslat * Math.sqrt((1 - this.es) / (1 - con * con));
	  if (dl * dl < 1) {
	    dl = 1;
	  }
	  var fl;
	  var gl;
	  if (!isNaN(this.longc)) {
	    //Central point and azimuth method

	    if (this.lat0 >= 0) {
	      fl = dl + Math.sqrt(dl * dl - 1);
	    }
	    else {
	      fl = dl - Math.sqrt(dl * dl - 1);
	    }
	    this.el = fl * Math.pow(t0, this.bl);
	    gl = 0.5 * (fl - 1 / fl);
	    this.gamma0 = Math.asin(Math.sin(this.alpha) / dl);
	    this.long0 = this.longc - Math.asin(gl * Math.tan(this.gamma0)) / this.bl;

	  }
	  else {
	    //2 points method
	    var t1 = tsfnz(this.e, this.lat1, Math.sin(this.lat1));
	    var t2 = tsfnz(this.e, this.lat2, Math.sin(this.lat2));
	    if (this.lat0 >= 0) {
	      this.el = (dl + Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
	    }
	    else {
	      this.el = (dl - Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
	    }
	    var hl = Math.pow(t1, this.bl);
	    var ll = Math.pow(t2, this.bl);
	    fl = this.el / hl;
	    gl = 0.5 * (fl - 1 / fl);
	    var jl = (this.el * this.el - ll * hl) / (this.el * this.el + ll * hl);
	    var pl = (ll - hl) / (ll + hl);
	    var dlon12 = adjust_lon(this.long1 - this.long2);
	    this.long0 = 0.5 * (this.long1 + this.long2) - Math.atan(jl * Math.tan(0.5 * this.bl * (dlon12)) / pl) / this.bl;
	    this.long0 = adjust_lon(this.long0);
	    var dlon10 = adjust_lon(this.long1 - this.long0);
	    this.gamma0 = Math.atan(Math.sin(this.bl * (dlon10)) / gl);
	    this.alpha = Math.asin(dl * Math.sin(this.gamma0));
	  }

	  if (this.no_off) {
	    this.uc = 0;
	  }
	  else {
	    if (this.lat0 >= 0) {
	      this.uc = this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
	    }
	    else {
	      this.uc = -1 * this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
	    }
	  }

	}

	/* Oblique Mercator forward equations--mapping lat,long to x,y
	    ----------------------------------------------------------*/
	function forward$8(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var dlon = adjust_lon(lon - this.long0);
	  var us, vs;
	  var con;
	  if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
	    if (lat > 0) {
	      con = -1;
	    }
	    else {
	      con = 1;
	    }
	    vs = this.al / this.bl * Math.log(Math.tan(FORTPI + con * this.gamma0 * 0.5));
	    us = -1 * con * HALF_PI * this.al / this.bl;
	  }
	  else {
	    var t = tsfnz(this.e, lat, Math.sin(lat));
	    var ql = this.el / Math.pow(t, this.bl);
	    var sl = 0.5 * (ql - 1 / ql);
	    var tl = 0.5 * (ql + 1 / ql);
	    var vl = Math.sin(this.bl * (dlon));
	    var ul = (sl * Math.sin(this.gamma0) - vl * Math.cos(this.gamma0)) / tl;
	    if (Math.abs(Math.abs(ul) - 1) <= EPSLN) {
	      vs = Number.POSITIVE_INFINITY;
	    }
	    else {
	      vs = 0.5 * this.al * Math.log((1 - ul) / (1 + ul)) / this.bl;
	    }
	    if (Math.abs(Math.cos(this.bl * (dlon))) <= EPSLN) {
	      us = this.al * this.bl * (dlon);
	    }
	    else {
	      us = this.al * Math.atan2(sl * Math.cos(this.gamma0) + vl * Math.sin(this.gamma0), Math.cos(this.bl * dlon)) / this.bl;
	    }
	  }

	  if (this.no_rot) {
	    p.x = this.x0 + us;
	    p.y = this.y0 + vs;
	  }
	  else {

	    us -= this.uc;
	    p.x = this.x0 + vs * Math.cos(this.alpha) + us * Math.sin(this.alpha);
	    p.y = this.y0 + us * Math.cos(this.alpha) - vs * Math.sin(this.alpha);
	  }
	  return p;
	}

	function inverse$8(p) {
	  var us, vs;
	  if (this.no_rot) {
	    vs = p.y - this.y0;
	    us = p.x - this.x0;
	  }
	  else {
	    vs = (p.x - this.x0) * Math.cos(this.alpha) - (p.y - this.y0) * Math.sin(this.alpha);
	    us = (p.y - this.y0) * Math.cos(this.alpha) + (p.x - this.x0) * Math.sin(this.alpha);
	    us += this.uc;
	  }
	  var qp = Math.exp(-1 * this.bl * vs / this.al);
	  var sp = 0.5 * (qp - 1 / qp);
	  var tp = 0.5 * (qp + 1 / qp);
	  var vp = Math.sin(this.bl * us / this.al);
	  var up = (vp * Math.cos(this.gamma0) + sp * Math.sin(this.gamma0)) / tp;
	  var ts = Math.pow(this.el / Math.sqrt((1 + up) / (1 - up)), 1 / this.bl);
	  if (Math.abs(up - 1) < EPSLN) {
	    p.x = this.long0;
	    p.y = HALF_PI;
	  }
	  else if (Math.abs(up + 1) < EPSLN) {
	    p.x = this.long0;
	    p.y = -1 * HALF_PI;
	  }
	  else {
	    p.y = phi2z(this.e, ts);
	    p.x = adjust_lon(this.long0 - Math.atan2(sp * Math.cos(this.gamma0) - vp * Math.sin(this.gamma0), Math.cos(this.bl * us / this.al)) / this.bl);
	  }
	  return p;
	}

	var names$10 = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "omerc"];
	var omerc = {
	  init: init$9,
	  forward: forward$8,
	  inverse: inverse$8,
	  names: names$10
	};

	function init$10() {

	  // array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
	  //double c_lat;                   /* center latitude                      */
	  //double c_lon;                   /* center longitude                     */
	  //double lat1;                    /* first standard parallel              */
	  //double lat2;                    /* second standard parallel             */
	  //double r_maj;                   /* major axis                           */
	  //double r_min;                   /* minor axis                           */
	  //double false_east;              /* x offset in meters                   */
	  //double false_north;             /* y offset in meters                   */

	  if (!this.lat2) {
	    this.lat2 = this.lat1;
	  } //if lat2 is not defined
	  if (!this.k0) {
	    this.k0 = 1;
	  }
	  this.x0 = this.x0 || 0;
	  this.y0 = this.y0 || 0;
	  // Standard Parallels cannot be equal and on opposite sides of the equator
	  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
	    return;
	  }

	  var temp = this.b / this.a;
	  this.e = Math.sqrt(1 - temp * temp);

	  var sin1 = Math.sin(this.lat1);
	  var cos1 = Math.cos(this.lat1);
	  var ms1 = msfnz(this.e, sin1, cos1);
	  var ts1 = tsfnz(this.e, this.lat1, sin1);

	  var sin2 = Math.sin(this.lat2);
	  var cos2 = Math.cos(this.lat2);
	  var ms2 = msfnz(this.e, sin2, cos2);
	  var ts2 = tsfnz(this.e, this.lat2, sin2);

	  var ts0 = tsfnz(this.e, this.lat0, Math.sin(this.lat0));

	  if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
	    this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
	  }
	  else {
	    this.ns = sin1;
	  }
	  if (isNaN(this.ns)) {
	    this.ns = sin1;
	  }
	  this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
	  this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
	  if (!this.title) {
	    this.title = "Lambert Conformal Conic";
	  }
	}

	// Lambert Conformal conic forward equations--mapping lat,long to x,y
	// -----------------------------------------------------------------
	function forward$9(p) {

	  var lon = p.x;
	  var lat = p.y;

	  // singular cases :
	  if (Math.abs(2 * Math.abs(lat) - Math.PI) <= EPSLN) {
	    lat = sign(lat) * (HALF_PI - 2 * EPSLN);
	  }

	  var con = Math.abs(Math.abs(lat) - HALF_PI);
	  var ts, rh1;
	  if (con > EPSLN) {
	    ts = tsfnz(this.e, lat, Math.sin(lat));
	    rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
	  }
	  else {
	    con = lat * this.ns;
	    if (con <= 0) {
	      return null;
	    }
	    rh1 = 0;
	  }
	  var theta = this.ns * adjust_lon(lon - this.long0);
	  p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
	  p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

	  return p;
	}

	// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
	// -----------------------------------------------------------------
	function inverse$9(p) {

	  var rh1, con, ts;
	  var lat, lon;
	  var x = (p.x - this.x0) / this.k0;
	  var y = (this.rh - (p.y - this.y0) / this.k0);
	  if (this.ns > 0) {
	    rh1 = Math.sqrt(x * x + y * y);
	    con = 1;
	  }
	  else {
	    rh1 = -Math.sqrt(x * x + y * y);
	    con = -1;
	  }
	  var theta = 0;
	  if (rh1 !== 0) {
	    theta = Math.atan2((con * x), (con * y));
	  }
	  if ((rh1 !== 0) || (this.ns > 0)) {
	    con = 1 / this.ns;
	    ts = Math.pow((rh1 / (this.a * this.f0)), con);
	    lat = phi2z(this.e, ts);
	    if (lat === -9999) {
	      return null;
	    }
	  }
	  else {
	    lat = -HALF_PI;
	  }
	  lon = adjust_lon(theta / this.ns + this.long0);

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$11 = ["Lambert Tangential Conformal Conic Projection", "Lambert_Conformal_Conic", "Lambert_Conformal_Conic_2SP", "lcc"];
	var lcc = {
	  init: init$10,
	  forward: forward$9,
	  inverse: inverse$9,
	  names: names$11
	};

	function init$11() {
	  this.a = 6377397.155;
	  this.es = 0.006674372230614;
	  this.e = Math.sqrt(this.es);
	  if (!this.lat0) {
	    this.lat0 = 0.863937979737193;
	  }
	  if (!this.long0) {
	    this.long0 = 0.7417649320975901 - 0.308341501185665;
	  }
	  /* if scale not set default to 0.9999 */
	  if (!this.k0) {
	    this.k0 = 0.9999;
	  }
	  this.s45 = 0.785398163397448; /* 45 */
	  this.s90 = 2 * this.s45;
	  this.fi0 = this.lat0;
	  this.e2 = this.es;
	  this.e = Math.sqrt(this.e2);
	  this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
	  this.uq = 1.04216856380474;
	  this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
	  this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
	  this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
	  this.k1 = this.k0;
	  this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
	  this.s0 = 1.37008346281555;
	  this.n = Math.sin(this.s0);
	  this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
	  this.ad = this.s90 - this.uq;
	}

	/* ellipsoid */
	/* calculate xy from lat/lon */
	/* Constants, identical to inverse transform function */
	function forward$10(p) {
	  var gfi, u, deltav, s, d, eps, ro;
	  var lon = p.x;
	  var lat = p.y;
	  var delta_lon = adjust_lon(lon - this.long0);
	  /* Transformation */
	  gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
	  u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
	  deltav = -delta_lon * this.alfa;
	  s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
	  d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
	  eps = this.n * d;
	  ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
	  p.y = ro * Math.cos(eps) / 1;
	  p.x = ro * Math.sin(eps) / 1;

	  if (!this.czech) {
	    p.y *= -1;
	    p.x *= -1;
	  }
	  return (p);
	}

	/* calculate lat/lon from xy */
	function inverse$10(p) {
	  var u, deltav, s, d, eps, ro, fi1;
	  var ok;

	  /* Transformation */
	  /* revert y, x*/
	  var tmp = p.x;
	  p.x = p.y;
	  p.y = tmp;
	  if (!this.czech) {
	    p.y *= -1;
	    p.x *= -1;
	  }
	  ro = Math.sqrt(p.x * p.x + p.y * p.y);
	  eps = Math.atan2(p.y, p.x);
	  d = eps / Math.sin(this.s0);
	  s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
	  u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
	  deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
	  p.x = this.long0 - deltav / this.alfa;
	  fi1 = u;
	  ok = 0;
	  var iter = 0;
	  do {
	    p.y = 2 * (Math.atan(Math.pow(this.k, - 1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
	    if (Math.abs(fi1 - p.y) < 0.0000000001) {
	      ok = 1;
	    }
	    fi1 = p.y;
	    iter += 1;
	  } while (ok === 0 && iter < 15);
	  if (iter >= 15) {
	    return null;
	  }

	  return (p);
	}

	var names$12 = ["Krovak", "krovak"];
	var krovak = {
	  init: init$11,
	  forward: forward$10,
	  inverse: inverse$10,
	  names: names$12
	};

	var mlfn = function(e0, e1, e2, e3, phi) {
	  return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
	};

	var e0fn = function(x) {
	  return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
	};

	var e1fn = function(x) {
	  return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
	};

	var e2fn = function(x) {
	  return (0.05859375 * x * x * (1 + 0.75 * x));
	};

	var e3fn = function(x) {
	  return (x * x * x * (35 / 3072));
	};

	var gN = function(a, e, sinphi) {
	  var temp = e * sinphi;
	  return a / Math.sqrt(1 - temp * temp);
	};

	var adjust_lat = function(x) {
	  return (Math.abs(x) < HALF_PI) ? x : (x - (sign(x) * Math.PI));
	};

	var imlfn = function(ml, e0, e1, e2, e3) {
	  var phi;
	  var dphi;

	  phi = ml / e0;
	  for (var i = 0; i < 15; i++) {
	    dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
	    phi += dphi;
	    if (Math.abs(dphi) <= 0.0000000001) {
	      return phi;
	    }
	  }

	  //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
	  return NaN;
	};

	function init$12() {
	  if (!this.sphere) {
	    this.e0 = e0fn(this.es);
	    this.e1 = e1fn(this.es);
	    this.e2 = e2fn(this.es);
	    this.e3 = e3fn(this.es);
	    this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
	  }
	}

	/* Cassini forward equations--mapping lat,long to x,y
	  -----------------------------------------------------------------------*/
	function forward$11(p) {

	  /* Forward equations
	      -----------------*/
	  var x, y;
	  var lam = p.x;
	  var phi = p.y;
	  lam = adjust_lon(lam - this.long0);

	  if (this.sphere) {
	    x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
	    y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
	  }
	  else {
	    //ellipsoid
	    var sinphi = Math.sin(phi);
	    var cosphi = Math.cos(phi);
	    var nl = gN(this.a, this.e, sinphi);
	    var tl = Math.tan(phi) * Math.tan(phi);
	    var al = lam * Math.cos(phi);
	    var asq = al * al;
	    var cl = this.es * cosphi * cosphi / (1 - this.es);
	    var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);

	    x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
	    y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);


	  }

	  p.x = x + this.x0;
	  p.y = y + this.y0;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$11(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var x = p.x / this.a;
	  var y = p.y / this.a;
	  var phi, lam;

	  if (this.sphere) {
	    var dd = y + this.lat0;
	    phi = Math.asin(Math.sin(dd) * Math.cos(x));
	    lam = Math.atan2(Math.tan(x), Math.cos(dd));
	  }
	  else {
	    /* ellipsoid */
	    var ml1 = this.ml0 / this.a + y;
	    var phi1 = imlfn(ml1, this.e0, this.e1, this.e2, this.e3);
	    if (Math.abs(Math.abs(phi1) - HALF_PI) <= EPSLN) {
	      p.x = this.long0;
	      p.y = HALF_PI;
	      if (y < 0) {
	        p.y *= -1;
	      }
	      return p;
	    }
	    var nl1 = gN(this.a, this.e, Math.sin(phi1));

	    var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
	    var tl1 = Math.pow(Math.tan(phi1), 2);
	    var dl = x * this.a / nl1;
	    var dsq = dl * dl;
	    phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
	    lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);

	  }

	  p.x = adjust_lon(lam + this.long0);
	  p.y = adjust_lat(phi);
	  return p;

	}

	var names$13 = ["Cassini", "Cassini_Soldner", "cass"];
	var cass = {
	  init: init$12,
	  forward: forward$11,
	  inverse: inverse$11,
	  names: names$13
	};

	var qsfnz = function(eccent, sinphi) {
	  var con;
	  if (eccent > 1.0e-7) {
	    con = eccent * sinphi;
	    return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
	  }
	  else {
	    return (2 * sinphi);
	  }
	};

	/*
	  reference
	    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
	    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
	  */

	var S_POLE = 1;

	var N_POLE = 2;
	var EQUIT = 3;
	var OBLIQ = 4;

	/* Initialize the Lambert Azimuthal Equal Area projection
	  ------------------------------------------------------*/
	function init$13() {
	  var t = Math.abs(this.lat0);
	  if (Math.abs(t - HALF_PI) < EPSLN) {
	    this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
	  }
	  else if (Math.abs(t) < EPSLN) {
	    this.mode = this.EQUIT;
	  }
	  else {
	    this.mode = this.OBLIQ;
	  }
	  if (this.es > 0) {
	    var sinphi;

	    this.qp = qsfnz(this.e, 1);
	    this.mmf = 0.5 / (1 - this.es);
	    this.apa = authset(this.es);
	    switch (this.mode) {
	    case this.N_POLE:
	      this.dd = 1;
	      break;
	    case this.S_POLE:
	      this.dd = 1;
	      break;
	    case this.EQUIT:
	      this.rq = Math.sqrt(0.5 * this.qp);
	      this.dd = 1 / this.rq;
	      this.xmf = 1;
	      this.ymf = 0.5 * this.qp;
	      break;
	    case this.OBLIQ:
	      this.rq = Math.sqrt(0.5 * this.qp);
	      sinphi = Math.sin(this.lat0);
	      this.sinb1 = qsfnz(this.e, sinphi) / this.qp;
	      this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
	      this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
	      this.ymf = (this.xmf = this.rq) / this.dd;
	      this.xmf *= this.dd;
	      break;
	    }
	  }
	  else {
	    if (this.mode === this.OBLIQ) {
	      this.sinph0 = Math.sin(this.lat0);
	      this.cosph0 = Math.cos(this.lat0);
	    }
	  }
	}

	/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
	  -----------------------------------------------------------------------*/
	function forward$12(p) {

	  /* Forward equations
	      -----------------*/
	  var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
	  var lam = p.x;
	  var phi = p.y;

	  lam = adjust_lon(lam - this.long0);
	  if (this.sphere) {
	    sinphi = Math.sin(phi);
	    cosphi = Math.cos(phi);
	    coslam = Math.cos(lam);
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
	      if (y <= EPSLN) {
	        return null;
	      }
	      y = Math.sqrt(2 / y);
	      x = y * cosphi * Math.sin(lam);
	      y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
	    }
	    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
	      if (this.mode === this.N_POLE) {
	        coslam = -coslam;
	      }
	      if (Math.abs(phi + this.phi0) < EPSLN) {
	        return null;
	      }
	      y = FORTPI - phi * 0.5;
	      y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
	      x = y * Math.sin(lam);
	      y *= coslam;
	    }
	  }
	  else {
	    sinb = 0;
	    cosb = 0;
	    b = 0;
	    coslam = Math.cos(lam);
	    sinlam = Math.sin(lam);
	    sinphi = Math.sin(phi);
	    q = qsfnz(this.e, sinphi);
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      sinb = q / this.qp;
	      cosb = Math.sqrt(1 - sinb * sinb);
	    }
	    switch (this.mode) {
	    case this.OBLIQ:
	      b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
	      break;
	    case this.EQUIT:
	      b = 1 + cosb * coslam;
	      break;
	    case this.N_POLE:
	      b = HALF_PI + phi;
	      q = this.qp - q;
	      break;
	    case this.S_POLE:
	      b = phi - HALF_PI;
	      q = this.qp + q;
	      break;
	    }
	    if (Math.abs(b) < EPSLN) {
	      return null;
	    }
	    switch (this.mode) {
	    case this.OBLIQ:
	    case this.EQUIT:
	      b = Math.sqrt(2 / b);
	      if (this.mode === this.OBLIQ) {
	        y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
	      }
	      else {
	        y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
	      }
	      x = this.xmf * b * cosb * sinlam;
	      break;
	    case this.N_POLE:
	    case this.S_POLE:
	      if (q >= 0) {
	        x = (b = Math.sqrt(q)) * sinlam;
	        y = coslam * ((this.mode === this.S_POLE) ? b : -b);
	      }
	      else {
	        x = y = 0;
	      }
	      break;
	    }
	  }

	  p.x = this.a * x + this.x0;
	  p.y = this.a * y + this.y0;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$12(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var x = p.x / this.a;
	  var y = p.y / this.a;
	  var lam, phi, cCe, sCe, q, rho, ab;
	  if (this.sphere) {
	    var cosz = 0,
	      rh, sinz = 0;

	    rh = Math.sqrt(x * x + y * y);
	    phi = rh * 0.5;
	    if (phi > 1) {
	      return null;
	    }
	    phi = 2 * Math.asin(phi);
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      sinz = Math.sin(phi);
	      cosz = Math.cos(phi);
	    }
	    switch (this.mode) {
	    case this.EQUIT:
	      phi = (Math.abs(rh) <= EPSLN) ? 0 : Math.asin(y * sinz / rh);
	      x *= sinz;
	      y = cosz * rh;
	      break;
	    case this.OBLIQ:
	      phi = (Math.abs(rh) <= EPSLN) ? this.phi0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
	      x *= sinz * this.cosph0;
	      y = (cosz - Math.sin(phi) * this.sinph0) * rh;
	      break;
	    case this.N_POLE:
	      y = -y;
	      phi = HALF_PI - phi;
	      break;
	    case this.S_POLE:
	      phi -= HALF_PI;
	      break;
	    }
	    lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
	  }
	  else {
	    ab = 0;
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      x /= this.dd;
	      y *= this.dd;
	      rho = Math.sqrt(x * x + y * y);
	      if (rho < EPSLN) {
	        p.x = 0;
	        p.y = this.phi0;
	        return p;
	      }
	      sCe = 2 * Math.asin(0.5 * rho / this.rq);
	      cCe = Math.cos(sCe);
	      x *= (sCe = Math.sin(sCe));
	      if (this.mode === this.OBLIQ) {
	        ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
	        q = this.qp * ab;
	        y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
	      }
	      else {
	        ab = y * sCe / rho;
	        q = this.qp * ab;
	        y = rho * cCe;
	      }
	    }
	    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
	      if (this.mode === this.N_POLE) {
	        y = -y;
	      }
	      q = (x * x + y * y);
	      if (!q) {
	        p.x = 0;
	        p.y = this.phi0;
	        return p;
	      }
	      ab = 1 - q / this.qp;
	      if (this.mode === this.S_POLE) {
	        ab = -ab;
	      }
	    }
	    lam = Math.atan2(x, y);
	    phi = authlat(Math.asin(ab), this.apa);
	  }

	  p.x = adjust_lon(this.long0 + lam);
	  p.y = phi;
	  return p;
	}

	/* determine latitude from authalic latitude */
	var P00 = 0.33333333333333333333;

	var P01 = 0.17222222222222222222;
	var P02 = 0.10257936507936507936;
	var P10 = 0.06388888888888888888;
	var P11 = 0.06640211640211640211;
	var P20 = 0.01641501294219154443;

	function authset(es) {
	  var t;
	  var APA = [];
	  APA[0] = es * P00;
	  t = es * es;
	  APA[0] += t * P01;
	  APA[1] = t * P10;
	  t *= es;
	  APA[0] += t * P02;
	  APA[1] += t * P11;
	  APA[2] = t * P20;
	  return APA;
	}

	function authlat(beta, APA) {
	  var t = beta + beta;
	  return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
	}

	var names$14 = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
	var laea = {
	  init: init$13,
	  forward: forward$12,
	  inverse: inverse$12,
	  names: names$14,
	  S_POLE: S_POLE,
	  N_POLE: N_POLE,
	  EQUIT: EQUIT,
	  OBLIQ: OBLIQ
	};

	var asinz = function(x) {
	  if (Math.abs(x) > 1) {
	    x = (x > 1) ? 1 : -1;
	  }
	  return Math.asin(x);
	};

	function init$14() {

	  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
	    return;
	  }
	  this.temp = this.b / this.a;
	  this.es = 1 - Math.pow(this.temp, 2);
	  this.e3 = Math.sqrt(this.es);

	  this.sin_po = Math.sin(this.lat1);
	  this.cos_po = Math.cos(this.lat1);
	  this.t1 = this.sin_po;
	  this.con = this.sin_po;
	  this.ms1 = msfnz(this.e3, this.sin_po, this.cos_po);
	  this.qs1 = qsfnz(this.e3, this.sin_po, this.cos_po);

	  this.sin_po = Math.sin(this.lat2);
	  this.cos_po = Math.cos(this.lat2);
	  this.t2 = this.sin_po;
	  this.ms2 = msfnz(this.e3, this.sin_po, this.cos_po);
	  this.qs2 = qsfnz(this.e3, this.sin_po, this.cos_po);

	  this.sin_po = Math.sin(this.lat0);
	  this.cos_po = Math.cos(this.lat0);
	  this.t3 = this.sin_po;
	  this.qs0 = qsfnz(this.e3, this.sin_po, this.cos_po);

	  if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
	    this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
	  }
	  else {
	    this.ns0 = this.con;
	  }
	  this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
	  this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
	}

	/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
	  -------------------------------------------------------------------*/
	function forward$13(p) {

	  var lon = p.x;
	  var lat = p.y;

	  this.sin_phi = Math.sin(lat);
	  this.cos_phi = Math.cos(lat);

	  var qs = qsfnz(this.e3, this.sin_phi, this.cos_phi);
	  var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
	  var theta = this.ns0 * adjust_lon(lon - this.long0);
	  var x = rh1 * Math.sin(theta) + this.x0;
	  var y = this.rh - rh1 * Math.cos(theta) + this.y0;

	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$13(p) {
	  var rh1, qs, con, theta, lon, lat;

	  p.x -= this.x0;
	  p.y = this.rh - p.y + this.y0;
	  if (this.ns0 >= 0) {
	    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
	    con = 1;
	  }
	  else {
	    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
	    con = -1;
	  }
	  theta = 0;
	  if (rh1 !== 0) {
	    theta = Math.atan2(con * p.x, con * p.y);
	  }
	  con = rh1 * this.ns0 / this.a;
	  if (this.sphere) {
	    lat = Math.asin((this.c - con * con) / (2 * this.ns0));
	  }
	  else {
	    qs = (this.c - con * con) / this.ns0;
	    lat = this.phi1z(this.e3, qs);
	  }

	  lon = adjust_lon(theta / this.ns0 + this.long0);
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	/* Function to compute phi1, the latitude for the inverse of the
	   Albers Conical Equal-Area projection.
	-------------------------------------------*/
	function phi1z(eccent, qs) {
	  var sinphi, cosphi, con, com, dphi;
	  var phi = asinz(0.5 * qs);
	  if (eccent < EPSLN) {
	    return phi;
	  }

	  var eccnts = eccent * eccent;
	  for (var i = 1; i <= 25; i++) {
	    sinphi = Math.sin(phi);
	    cosphi = Math.cos(phi);
	    con = eccent * sinphi;
	    com = 1 - con * con;
	    dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
	    phi = phi + dphi;
	    if (Math.abs(dphi) <= 1e-7) {
	      return phi;
	    }
	  }
	  return null;
	}

	var names$15 = ["Albers_Conic_Equal_Area", "Albers", "aea"];
	var aea = {
	  init: init$14,
	  forward: forward$13,
	  inverse: inverse$13,
	  names: names$15,
	  phi1z: phi1z
	};

	/*
	  reference:
	    Wolfram Mathworld "Gnomonic Projection"
	    http://mathworld.wolfram.com/GnomonicProjection.html
	    Accessed: 12th November 2009
	  */
	function init$15() {

	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  this.sin_p14 = Math.sin(this.lat0);
	  this.cos_p14 = Math.cos(this.lat0);
	  // Approximation for projecting points to the horizon (infinity)
	  this.infinity_dist = 1000 * this.a;
	  this.rc = 1;
	}

	/* Gnomonic forward equations--mapping lat,long to x,y
	    ---------------------------------------------------*/
	function forward$14(p) {
	  var sinphi, cosphi; /* sin and cos value        */
	  var dlon; /* delta longitude value      */
	  var coslon; /* cos of longitude        */
	  var ksp; /* scale factor          */
	  var g;
	  var x, y;
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	      -----------------*/
	  dlon = adjust_lon(lon - this.long0);

	  sinphi = Math.sin(lat);
	  cosphi = Math.cos(lat);

	  coslon = Math.cos(dlon);
	  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
	  ksp = 1;
	  if ((g > 0) || (Math.abs(g) <= EPSLN)) {
	    x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
	    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
	  }
	  else {

	    // Point is in the opposing hemisphere and is unprojectable
	    // We still need to return a reasonable point, so we project
	    // to infinity, on a bearing
	    // equivalent to the northern hemisphere equivalent
	    // This is a reasonable approximation for short shapes and lines that
	    // straddle the horizon.

	    x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
	    y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

	  }
	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$14(p) {
	  var rh; /* Rho */
	  var sinc, cosc;
	  var c;
	  var lon, lat;

	  /* Inverse equations
	      -----------------*/
	  p.x = (p.x - this.x0) / this.a;
	  p.y = (p.y - this.y0) / this.a;

	  p.x /= this.k0;
	  p.y /= this.k0;

	  if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
	    c = Math.atan2(rh, this.rc);
	    sinc = Math.sin(c);
	    cosc = Math.cos(c);

	    lat = asinz(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
	    lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
	    lon = adjust_lon(this.long0 + lon);
	  }
	  else {
	    lat = this.phic0;
	    lon = 0;
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$16 = ["gnom"];
	var gnom = {
	  init: init$15,
	  forward: forward$14,
	  inverse: inverse$14,
	  names: names$16
	};

	var iqsfnz = function(eccent, q) {
	  var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
	  if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
	    if (q < 0) {
	      return (-1 * HALF_PI);
	    }
	    else {
	      return HALF_PI;
	    }
	  }
	  //var phi = 0.5* q/(1-eccent*eccent);
	  var phi = Math.asin(0.5 * q);
	  var dphi;
	  var sin_phi;
	  var cos_phi;
	  var con;
	  for (var i = 0; i < 30; i++) {
	    sin_phi = Math.sin(phi);
	    cos_phi = Math.cos(phi);
	    con = eccent * sin_phi;
	    dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
	    phi += dphi;
	    if (Math.abs(dphi) <= 0.0000000001) {
	      return phi;
	    }
	  }

	  //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
	  return NaN;
	};

	/*
	  reference:
	    "Cartographic Projection Procedures for the UNIX Environment-
	    A User's Manual" by Gerald I. Evenden,
	    USGS Open File Report 90-284and Release 4 Interim Reports (2003)
	*/
	function init$16() {
	  //no-op
	  if (!this.sphere) {
	    this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
	  }
	}

	/* Cylindrical Equal Area forward equations--mapping lat,long to x,y
	    ------------------------------------------------------------*/
	function forward$15(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var x, y;
	  /* Forward equations
	      -----------------*/
	  var dlon = adjust_lon(lon - this.long0);
	  if (this.sphere) {
	    x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
	    y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
	  }
	  else {
	    var qs = qsfnz(this.e, Math.sin(lat));
	    x = this.x0 + this.a * this.k0 * dlon;
	    y = this.y0 + this.a * qs * 0.5 / this.k0;
	  }

	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
	    ------------------------------------------------------------*/
	function inverse$15(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var lon, lat;

	  if (this.sphere) {
	    lon = adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
	    lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
	  }
	  else {
	    lat = iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
	    lon = adjust_lon(this.long0 + p.x / (this.a * this.k0));
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$17 = ["cea"];
	var cea = {
	  init: init$16,
	  forward: forward$15,
	  inverse: inverse$15,
	  names: names$17
	};

	function init$17() {

	  this.x0 = this.x0 || 0;
	  this.y0 = this.y0 || 0;
	  this.lat0 = this.lat0 || 0;
	  this.long0 = this.long0 || 0;
	  this.lat_ts = this.lat_ts || 0;
	  this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

	  this.rc = Math.cos(this.lat_ts);
	}

	// forward equations--mapping lat,long to x,y
	// -----------------------------------------------------------------
	function forward$16(p) {

	  var lon = p.x;
	  var lat = p.y;

	  var dlon = adjust_lon(lon - this.long0);
	  var dlat = adjust_lat(lat - this.lat0);
	  p.x = this.x0 + (this.a * dlon * this.rc);
	  p.y = this.y0 + (this.a * dlat);
	  return p;
	}

	// inverse equations--mapping x,y to lat/long
	// -----------------------------------------------------------------
	function inverse$16(p) {

	  var x = p.x;
	  var y = p.y;

	  p.x = adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
	  p.y = adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
	  return p;
	}

	var names$18 = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
	var eqc = {
	  init: init$17,
	  forward: forward$16,
	  inverse: inverse$16,
	  names: names$18
	};

	var MAX_ITER$2 = 20;

	function init$18() {
	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  this.temp = this.b / this.a;
	  this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
	  this.e = Math.sqrt(this.es);
	  this.e0 = e0fn(this.es);
	  this.e1 = e1fn(this.es);
	  this.e2 = e2fn(this.es);
	  this.e3 = e3fn(this.es);
	  this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
	}

	/* Polyconic forward equations--mapping lat,long to x,y
	    ---------------------------------------------------*/
	function forward$17(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var x, y, el;
	  var dlon = adjust_lon(lon - this.long0);
	  el = dlon * Math.sin(lat);
	  if (this.sphere) {
	    if (Math.abs(lat) <= EPSLN) {
	      x = this.a * dlon;
	      y = -1 * this.a * this.lat0;
	    }
	    else {
	      x = this.a * Math.sin(el) / Math.tan(lat);
	      y = this.a * (adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
	    }
	  }
	  else {
	    if (Math.abs(lat) <= EPSLN) {
	      x = this.a * dlon;
	      y = -1 * this.ml0;
	    }
	    else {
	      var nl = gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
	      x = nl * Math.sin(el);
	      y = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
	    }

	  }
	  p.x = x + this.x0;
	  p.y = y + this.y0;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$17(p) {
	  var lon, lat, x, y, i;
	  var al, bl;
	  var phi, dphi;
	  x = p.x - this.x0;
	  y = p.y - this.y0;

	  if (this.sphere) {
	    if (Math.abs(y + this.a * this.lat0) <= EPSLN) {
	      lon = adjust_lon(x / this.a + this.long0);
	      lat = 0;
	    }
	    else {
	      al = this.lat0 + y / this.a;
	      bl = x * x / this.a / this.a + al * al;
	      phi = al;
	      var tanphi;
	      for (i = MAX_ITER$2; i; --i) {
	        tanphi = Math.tan(phi);
	        dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
	        phi += dphi;
	        if (Math.abs(dphi) <= EPSLN) {
	          lat = phi;
	          break;
	        }
	      }
	      lon = adjust_lon(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
	    }
	  }
	  else {
	    if (Math.abs(y + this.ml0) <= EPSLN) {
	      lat = 0;
	      lon = adjust_lon(this.long0 + x / this.a);
	    }
	    else {

	      al = (this.ml0 + y) / this.a;
	      bl = x * x / this.a / this.a + al * al;
	      phi = al;
	      var cl, mln, mlnp, ma;
	      var con;
	      for (i = MAX_ITER$2; i; --i) {
	        con = this.e * Math.sin(phi);
	        cl = Math.sqrt(1 - con * con) * Math.tan(phi);
	        mln = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
	        mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
	        ma = mln / this.a;
	        dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
	        phi -= dphi;
	        if (Math.abs(dphi) <= EPSLN) {
	          lat = phi;
	          break;
	        }
	      }

	      //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
	      cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
	      lon = adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
	    }
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$19 = ["Polyconic", "poly"];
	var poly = {
	  init: init$18,
	  forward: forward$17,
	  inverse: inverse$17,
	  names: names$19
	};

	/*
	  reference
	    Department of Land and Survey Technical Circular 1973/32
	      http://www.linz.govt.nz/docs/miscellaneous/nz-map-definition.pdf
	    OSG Technical Report 4.1
	      http://www.linz.govt.nz/docs/miscellaneous/nzmg.pdf
	  */

	/**
	 * iterations: Number of iterations to refine inverse transform.
	 *     0 -> km accuracy
	 *     1 -> m accuracy -- suitable for most mapping applications
	 *     2 -> mm accuracy
	 */


	function init$19() {
	  this.A = [];
	  this.A[1] = 0.6399175073;
	  this.A[2] = -0.1358797613;
	  this.A[3] = 0.063294409;
	  this.A[4] = -0.02526853;
	  this.A[5] = 0.0117879;
	  this.A[6] = -0.0055161;
	  this.A[7] = 0.0026906;
	  this.A[8] = -0.001333;
	  this.A[9] = 0.00067;
	  this.A[10] = -0.00034;

	  this.B_re = [];
	  this.B_im = [];
	  this.B_re[1] = 0.7557853228;
	  this.B_im[1] = 0;
	  this.B_re[2] = 0.249204646;
	  this.B_im[2] = 0.003371507;
	  this.B_re[3] = -0.001541739;
	  this.B_im[3] = 0.041058560;
	  this.B_re[4] = -0.10162907;
	  this.B_im[4] = 0.01727609;
	  this.B_re[5] = -0.26623489;
	  this.B_im[5] = -0.36249218;
	  this.B_re[6] = -0.6870983;
	  this.B_im[6] = -1.1651967;

	  this.C_re = [];
	  this.C_im = [];
	  this.C_re[1] = 1.3231270439;
	  this.C_im[1] = 0;
	  this.C_re[2] = -0.577245789;
	  this.C_im[2] = -0.007809598;
	  this.C_re[3] = 0.508307513;
	  this.C_im[3] = -0.112208952;
	  this.C_re[4] = -0.15094762;
	  this.C_im[4] = 0.18200602;
	  this.C_re[5] = 1.01418179;
	  this.C_im[5] = 1.64497696;
	  this.C_re[6] = 1.9660549;
	  this.C_im[6] = 2.5127645;

	  this.D = [];
	  this.D[1] = 1.5627014243;
	  this.D[2] = 0.5185406398;
	  this.D[3] = -0.03333098;
	  this.D[4] = -0.1052906;
	  this.D[5] = -0.0368594;
	  this.D[6] = 0.007317;
	  this.D[7] = 0.01220;
	  this.D[8] = 0.00394;
	  this.D[9] = -0.0013;
	}

	/**
	    New Zealand Map Grid Forward  - long/lat to x/y
	    long/lat in radians
	  */
	function forward$18(p) {
	  var n;
	  var lon = p.x;
	  var lat = p.y;

	  var delta_lat = lat - this.lat0;
	  var delta_lon = lon - this.long0;

	  // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
	  // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
	  var d_phi = delta_lat / SEC_TO_RAD * 1E-5;
	  var d_lambda = delta_lon;
	  var d_phi_n = 1; // d_phi^0

	  var d_psi = 0;
	  for (n = 1; n <= 10; n++) {
	    d_phi_n = d_phi_n * d_phi;
	    d_psi = d_psi + this.A[n] * d_phi_n;
	  }

	  // 2. Calculate theta
	  var th_re = d_psi;
	  var th_im = d_lambda;

	  // 3. Calculate z
	  var th_n_re = 1;
	  var th_n_im = 0; // theta^0
	  var th_n_re1;
	  var th_n_im1;

	  var z_re = 0;
	  var z_im = 0;
	  for (n = 1; n <= 6; n++) {
	    th_n_re1 = th_n_re * th_re - th_n_im * th_im;
	    th_n_im1 = th_n_im * th_re + th_n_re * th_im;
	    th_n_re = th_n_re1;
	    th_n_im = th_n_im1;
	    z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
	    z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
	  }

	  // 4. Calculate easting and northing
	  p.x = (z_im * this.a) + this.x0;
	  p.y = (z_re * this.a) + this.y0;

	  return p;
	}

	/**
	    New Zealand Map Grid Inverse  -  x/y to long/lat
	  */
	function inverse$18(p) {
	  var n;
	  var x = p.x;
	  var y = p.y;

	  var delta_x = x - this.x0;
	  var delta_y = y - this.y0;

	  // 1. Calculate z
	  var z_re = delta_y / this.a;
	  var z_im = delta_x / this.a;

	  // 2a. Calculate theta - first approximation gives km accuracy
	  var z_n_re = 1;
	  var z_n_im = 0; // z^0
	  var z_n_re1;
	  var z_n_im1;

	  var th_re = 0;
	  var th_im = 0;
	  for (n = 1; n <= 6; n++) {
	    z_n_re1 = z_n_re * z_re - z_n_im * z_im;
	    z_n_im1 = z_n_im * z_re + z_n_re * z_im;
	    z_n_re = z_n_re1;
	    z_n_im = z_n_im1;
	    th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
	    th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
	  }

	  // 2b. Iterate to refine the accuracy of the calculation
	  //        0 iterations gives km accuracy
	  //        1 iteration gives m accuracy -- good enough for most mapping applications
	  //        2 iterations bives mm accuracy
	  for (var i = 0; i < this.iterations; i++) {
	    var th_n_re = th_re;
	    var th_n_im = th_im;
	    var th_n_re1;
	    var th_n_im1;

	    var num_re = z_re;
	    var num_im = z_im;
	    for (n = 2; n <= 6; n++) {
	      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
	      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
	      th_n_re = th_n_re1;
	      th_n_im = th_n_im1;
	      num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
	      num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
	    }

	    th_n_re = 1;
	    th_n_im = 0;
	    var den_re = this.B_re[1];
	    var den_im = this.B_im[1];
	    for (n = 2; n <= 6; n++) {
	      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
	      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
	      th_n_re = th_n_re1;
	      th_n_im = th_n_im1;
	      den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
	      den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
	    }

	    // Complex division
	    var den2 = den_re * den_re + den_im * den_im;
	    th_re = (num_re * den_re + num_im * den_im) / den2;
	    th_im = (num_im * den_re - num_re * den_im) / den2;
	  }

	  // 3. Calculate d_phi              ...                                    // and d_lambda
	  var d_psi = th_re;
	  var d_lambda = th_im;
	  var d_psi_n = 1; // d_psi^0

	  var d_phi = 0;
	  for (n = 1; n <= 9; n++) {
	    d_psi_n = d_psi_n * d_psi;
	    d_phi = d_phi + this.D[n] * d_psi_n;
	  }

	  // 4. Calculate latitude and longitude
	  // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
	  var lat = this.lat0 + (d_phi * SEC_TO_RAD * 1E5);
	  var lon = this.long0 + d_lambda;

	  p.x = lon;
	  p.y = lat;

	  return p;
	}

	var names$20 = ["New_Zealand_Map_Grid", "nzmg"];
	var nzmg = {
	  init: init$19,
	  forward: forward$18,
	  inverse: inverse$18,
	  names: names$20
	};

	/*
	  reference
	    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
	    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
	  */


	/* Initialize the Miller Cylindrical projection
	  -------------------------------------------*/
	function init$20() {
	  //no-op
	}

	/* Miller Cylindrical forward equations--mapping lat,long to x,y
	    ------------------------------------------------------------*/
	function forward$19(p) {
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	      -----------------*/
	  var dlon = adjust_lon(lon - this.long0);
	  var x = this.x0 + this.a * dlon;
	  var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Miller Cylindrical inverse equations--mapping x,y to lat/long
	    ------------------------------------------------------------*/
	function inverse$19(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;

	  var lon = adjust_lon(this.long0 + p.x / this.a);
	  var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$21 = ["Miller_Cylindrical", "mill"];
	var mill = {
	  init: init$20,
	  forward: forward$19,
	  inverse: inverse$19,
	  names: names$21
	};

	var MAX_ITER$3 = 20;
	function init$21() {
	  /* Place parameters in static storage for common use
	    -------------------------------------------------*/


	  if (!this.sphere) {
	    this.en = pj_enfn(this.es);
	  }
	  else {
	    this.n = 1;
	    this.m = 0;
	    this.es = 0;
	    this.C_y = Math.sqrt((this.m + 1) / this.n);
	    this.C_x = this.C_y / (this.m + 1);
	  }

	}

	/* Sinusoidal forward equations--mapping lat,long to x,y
	  -----------------------------------------------------*/
	function forward$20(p) {
	  var x, y;
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	    -----------------*/
	  lon = adjust_lon(lon - this.long0);

	  if (this.sphere) {
	    if (!this.m) {
	      lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
	    }
	    else {
	      var k = this.n * Math.sin(lat);
	      for (var i = MAX_ITER$3; i; --i) {
	        var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
	        lat -= V;
	        if (Math.abs(V) < EPSLN) {
	          break;
	        }
	      }
	    }
	    x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
	    y = this.a * this.C_y * lat;

	  }
	  else {

	    var s = Math.sin(lat);
	    var c = Math.cos(lat);
	    y = this.a * pj_mlfn(lat, s, c, this.en);
	    x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
	  }

	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$20(p) {
	  var lat, temp, lon, s;

	  p.x -= this.x0;
	  lon = p.x / this.a;
	  p.y -= this.y0;
	  lat = p.y / this.a;

	  if (this.sphere) {
	    lat /= this.C_y;
	    lon = lon / (this.C_x * (this.m + Math.cos(lat)));
	    if (this.m) {
	      lat = asinz((this.m * lat + Math.sin(lat)) / this.n);
	    }
	    else if (this.n !== 1) {
	      lat = asinz(Math.sin(lat) / this.n);
	    }
	    lon = adjust_lon(lon + this.long0);
	    lat = adjust_lat(lat);
	  }
	  else {
	    lat = pj_inv_mlfn(p.y / this.a, this.es, this.en);
	    s = Math.abs(lat);
	    if (s < HALF_PI) {
	      s = Math.sin(lat);
	      temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
	      //temp = this.long0 + p.x / (this.a * Math.cos(lat));
	      lon = adjust_lon(temp);
	    }
	    else if ((s - EPSLN) < HALF_PI) {
	      lon = this.long0;
	    }
	  }
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$22 = ["Sinusoidal", "sinu"];
	var sinu = {
	  init: init$21,
	  forward: forward$20,
	  inverse: inverse$20,
	  names: names$22
	};

	function init$22() {}
	/* Mollweide forward equations--mapping lat,long to x,y
	    ----------------------------------------------------*/
	function forward$21(p) {

	  /* Forward equations
	      -----------------*/
	  var lon = p.x;
	  var lat = p.y;

	  var delta_lon = adjust_lon(lon - this.long0);
	  var theta = lat;
	  var con = Math.PI * Math.sin(lat);

	  /* Iterate using the Newton-Raphson method to find theta
	      -----------------------------------------------------*/
	  while (true) {
	    var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
	    theta += delta_theta;
	    if (Math.abs(delta_theta) < EPSLN) {
	      break;
	    }
	  }
	  theta /= 2;

	  /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
	       this is done here because of precision problems with "cos(theta)"
	       --------------------------------------------------------------------------*/
	  if (Math.PI / 2 - Math.abs(lat) < EPSLN) {
	    delta_lon = 0;
	  }
	  var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
	  var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$21(p) {
	  var theta;
	  var arg;

	  /* Inverse equations
	      -----------------*/
	  p.x -= this.x0;
	  p.y -= this.y0;
	  arg = p.y / (1.4142135623731 * this.a);

	  /* Because of division by zero problems, 'arg' can not be 1.  Therefore
	       a number very close to one is used instead.
	       -------------------------------------------------------------------*/
	  if (Math.abs(arg) > 0.999999999999) {
	    arg = 0.999999999999;
	  }
	  theta = Math.asin(arg);
	  var lon = adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
	  if (lon < (-Math.PI)) {
	    lon = -Math.PI;
	  }
	  if (lon > Math.PI) {
	    lon = Math.PI;
	  }
	  arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
	  if (Math.abs(arg) > 1) {
	    arg = 1;
	  }
	  var lat = Math.asin(arg);

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$23 = ["Mollweide", "moll"];
	var moll = {
	  init: init$22,
	  forward: forward$21,
	  inverse: inverse$21,
	  names: names$23
	};

	function init$23() {

	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  // Standard Parallels cannot be equal and on opposite sides of the equator
	  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
	    return;
	  }
	  this.lat2 = this.lat2 || this.lat1;
	  this.temp = this.b / this.a;
	  this.es = 1 - Math.pow(this.temp, 2);
	  this.e = Math.sqrt(this.es);
	  this.e0 = e0fn(this.es);
	  this.e1 = e1fn(this.es);
	  this.e2 = e2fn(this.es);
	  this.e3 = e3fn(this.es);

	  this.sinphi = Math.sin(this.lat1);
	  this.cosphi = Math.cos(this.lat1);

	  this.ms1 = msfnz(this.e, this.sinphi, this.cosphi);
	  this.ml1 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);

	  if (Math.abs(this.lat1 - this.lat2) < EPSLN) {
	    this.ns = this.sinphi;
	  }
	  else {
	    this.sinphi = Math.sin(this.lat2);
	    this.cosphi = Math.cos(this.lat2);
	    this.ms2 = msfnz(this.e, this.sinphi, this.cosphi);
	    this.ml2 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
	    this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
	  }
	  this.g = this.ml1 + this.ms1 / this.ns;
	  this.ml0 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
	  this.rh = this.a * (this.g - this.ml0);
	}

	/* Equidistant Conic forward equations--mapping lat,long to x,y
	  -----------------------------------------------------------*/
	function forward$22(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var rh1;

	  /* Forward equations
	      -----------------*/
	  if (this.sphere) {
	    rh1 = this.a * (this.g - lat);
	  }
	  else {
	    var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
	    rh1 = this.a * (this.g - ml);
	  }
	  var theta = this.ns * adjust_lon(lon - this.long0);
	  var x = this.x0 + rh1 * Math.sin(theta);
	  var y = this.y0 + this.rh - rh1 * Math.cos(theta);
	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$22(p) {
	  p.x -= this.x0;
	  p.y = this.rh - p.y + this.y0;
	  var con, rh1, lat, lon;
	  if (this.ns >= 0) {
	    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
	    con = 1;
	  }
	  else {
	    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
	    con = -1;
	  }
	  var theta = 0;
	  if (rh1 !== 0) {
	    theta = Math.atan2(con * p.x, con * p.y);
	  }

	  if (this.sphere) {
	    lon = adjust_lon(this.long0 + theta / this.ns);
	    lat = adjust_lat(this.g - rh1 / this.a);
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  else {
	    var ml = this.g - rh1 / this.a;
	    lat = imlfn(ml, this.e0, this.e1, this.e2, this.e3);
	    lon = adjust_lon(this.long0 + theta / this.ns);
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }

	}

	var names$24 = ["Equidistant_Conic", "eqdc"];
	var eqdc = {
	  init: init$23,
	  forward: forward$22,
	  inverse: inverse$22,
	  names: names$24
	};

	/* Initialize the Van Der Grinten projection
	  ----------------------------------------*/
	function init$24() {
	  //this.R = 6370997; //Radius of earth
	  this.R = this.a;
	}

	function forward$23(p) {

	  var lon = p.x;
	  var lat = p.y;

	  /* Forward equations
	    -----------------*/
	  var dlon = adjust_lon(lon - this.long0);
	  var x, y;

	  if (Math.abs(lat) <= EPSLN) {
	    x = this.x0 + this.R * dlon;
	    y = this.y0;
	  }
	  var theta = asinz(2 * Math.abs(lat / Math.PI));
	  if ((Math.abs(dlon) <= EPSLN) || (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN)) {
	    x = this.x0;
	    if (lat >= 0) {
	      y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
	    }
	    else {
	      y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
	    }
	    //  return(OK);
	  }
	  var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
	  var asq = al * al;
	  var sinth = Math.sin(theta);
	  var costh = Math.cos(theta);

	  var g = costh / (sinth + costh - 1);
	  var gsq = g * g;
	  var m = g * (2 / sinth - 1);
	  var msq = m * m;
	  var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
	  if (dlon < 0) {
	    con = -con;
	  }
	  x = this.x0 + con;
	  //con = Math.abs(con / (Math.PI * this.R));
	  var q = asq + g;
	  con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
	  if (lat >= 0) {
	    //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
	    y = this.y0 + con;
	  }
	  else {
	    //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
	    y = this.y0 - con;
	  }
	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Van Der Grinten inverse equations--mapping x,y to lat/long
	  ---------------------------------------------------------*/
	function inverse$23(p) {
	  var lon, lat;
	  var xx, yy, xys, c1, c2, c3;
	  var a1;
	  var m1;
	  var con;
	  var th1;
	  var d;

	  /* inverse equations
	    -----------------*/
	  p.x -= this.x0;
	  p.y -= this.y0;
	  con = Math.PI * this.R;
	  xx = p.x / con;
	  yy = p.y / con;
	  xys = xx * xx + yy * yy;
	  c1 = -Math.abs(yy) * (1 + xys);
	  c2 = c1 - 2 * yy * yy + xx * xx;
	  c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
	  d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
	  a1 = (c1 - c2 * c2 / 3 / c3) / c3;
	  m1 = 2 * Math.sqrt(-a1 / 3);
	  con = ((3 * d) / a1) / m1;
	  if (Math.abs(con) > 1) {
	    if (con >= 0) {
	      con = 1;
	    }
	    else {
	      con = -1;
	    }
	  }
	  th1 = Math.acos(con) / 3;
	  if (p.y >= 0) {
	    lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
	  }
	  else {
	    lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
	  }

	  if (Math.abs(xx) < EPSLN) {
	    lon = this.long0;
	  }
	  else {
	    lon = adjust_lon(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$25 = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
	var vandg = {
	  init: init$24,
	  forward: forward$23,
	  inverse: inverse$23,
	  names: names$25
	};

	function init$25() {
	  this.sin_p12 = Math.sin(this.lat0);
	  this.cos_p12 = Math.cos(this.lat0);
	}

	function forward$24(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var sinphi = Math.sin(p.y);
	  var cosphi = Math.cos(p.y);
	  var dlon = adjust_lon(lon - this.long0);
	  var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;
	  if (this.sphere) {
	    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
	      //North Pole case
	      p.x = this.x0 + this.a * (HALF_PI - lat) * Math.sin(dlon);
	      p.y = this.y0 - this.a * (HALF_PI - lat) * Math.cos(dlon);
	      return p;
	    }
	    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
	      //South Pole case
	      p.x = this.x0 + this.a * (HALF_PI + lat) * Math.sin(dlon);
	      p.y = this.y0 + this.a * (HALF_PI + lat) * Math.cos(dlon);
	      return p;
	    }
	    else {
	      //default case
	      cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
	      c = Math.acos(cos_c);
	      kp = c / Math.sin(c);
	      p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
	      p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
	      return p;
	    }
	  }
	  else {
	    e0 = e0fn(this.es);
	    e1 = e1fn(this.es);
	    e2 = e2fn(this.es);
	    e3 = e3fn(this.es);
	    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
	      //North Pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      Ml = this.a * mlfn(e0, e1, e2, e3, lat);
	      p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
	      p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
	      return p;
	    }
	    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
	      //South Pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      Ml = this.a * mlfn(e0, e1, e2, e3, lat);
	      p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
	      p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
	      return p;
	    }
	    else {
	      //Default case
	      tanphi = sinphi / cosphi;
	      Nl1 = gN(this.a, this.e, this.sin_p12);
	      Nl = gN(this.a, this.e, sinphi);
	      psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
	      Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));
	      if (Az === 0) {
	        s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
	      }
	      else if (Math.abs(Math.abs(Az) - Math.PI) <= EPSLN) {
	        s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
	      }
	      else {
	        s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
	      }
	      G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
	      H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
	      GH = G * H;
	      Hs = H * H;
	      s2 = s * s;
	      s3 = s2 * s;
	      s4 = s3 * s;
	      s5 = s4 * s;
	      c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
	      p.x = this.x0 + c * Math.sin(Az);
	      p.y = this.y0 + c * Math.cos(Az);
	      return p;
	    }
	  }


	}

	function inverse$24(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F;
	  if (this.sphere) {
	    rh = Math.sqrt(p.x * p.x + p.y * p.y);
	    if (rh > (2 * HALF_PI * this.a)) {
	      return;
	    }
	    z = rh / this.a;

	    sinz = Math.sin(z);
	    cosz = Math.cos(z);

	    lon = this.long0;
	    if (Math.abs(rh) <= EPSLN) {
	      lat = this.lat0;
	    }
	    else {
	      lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
	      con = Math.abs(this.lat0) - HALF_PI;
	      if (Math.abs(con) <= EPSLN) {
	        if (this.lat0 >= 0) {
	          lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
	        }
	        else {
	          lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
	        }
	      }
	      else {
	        /*con = cosz - this.sin_p12 * Math.sin(lat);
	        if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
	          //no-op, just keep the lon value as is
	        } else {
	          var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
	          lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
	        }*/
	        lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
	      }
	    }

	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  else {
	    e0 = e0fn(this.es);
	    e1 = e1fn(this.es);
	    e2 = e2fn(this.es);
	    e3 = e3fn(this.es);
	    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
	      //North pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      rh = Math.sqrt(p.x * p.x + p.y * p.y);
	      M = Mlp - rh;
	      lat = imlfn(M / this.a, e0, e1, e2, e3);
	      lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
	      //South pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      rh = Math.sqrt(p.x * p.x + p.y * p.y);
	      M = rh - Mlp;

	      lat = imlfn(M / this.a, e0, e1, e2, e3);
	      lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	    else {
	      //default case
	      rh = Math.sqrt(p.x * p.x + p.y * p.y);
	      Az = Math.atan2(p.x, p.y);
	      N1 = gN(this.a, this.e, this.sin_p12);
	      cosAz = Math.cos(Az);
	      tmp = this.e * this.cos_p12 * cosAz;
	      A = -tmp * tmp / (1 - this.es);
	      B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
	      D = rh / N1;
	      Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
	      F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
	      psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
	      lon = adjust_lon(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
	      lat = Math.atan((1 - this.es * F * this.sin_p12 / Math.sin(psi)) * Math.tan(psi) / (1 - this.es));
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	  }

	}

	var names$26 = ["Azimuthal_Equidistant", "aeqd"];
	var aeqd = {
	  init: init$25,
	  forward: forward$24,
	  inverse: inverse$24,
	  names: names$26
	};

	function init$26() {
	  //double temp;      /* temporary variable    */

	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  this.sin_p14 = Math.sin(this.lat0);
	  this.cos_p14 = Math.cos(this.lat0);
	}

	/* Orthographic forward equations--mapping lat,long to x,y
	    ---------------------------------------------------*/
	function forward$25(p) {
	  var sinphi, cosphi; /* sin and cos value        */
	  var dlon; /* delta longitude value      */
	  var coslon; /* cos of longitude        */
	  var ksp; /* scale factor          */
	  var g, x, y;
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	      -----------------*/
	  dlon = adjust_lon(lon - this.long0);

	  sinphi = Math.sin(lat);
	  cosphi = Math.cos(lat);

	  coslon = Math.cos(dlon);
	  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
	  ksp = 1;
	  if ((g > 0) || (Math.abs(g) <= EPSLN)) {
	    x = this.a * ksp * cosphi * Math.sin(dlon);
	    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
	  }
	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$25(p) {
	  var rh; /* height above ellipsoid      */
	  var z; /* angle          */
	  var sinz, cosz; /* sin of z and cos of z      */
	  var con;
	  var lon, lat;
	  /* Inverse equations
	      -----------------*/
	  p.x -= this.x0;
	  p.y -= this.y0;
	  rh = Math.sqrt(p.x * p.x + p.y * p.y);
	  z = asinz(rh / this.a);

	  sinz = Math.sin(z);
	  cosz = Math.cos(z);

	  lon = this.long0;
	  if (Math.abs(rh) <= EPSLN) {
	    lat = this.lat0;
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  lat = asinz(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
	  con = Math.abs(this.lat0) - HALF_PI;
	  if (Math.abs(con) <= EPSLN) {
	    if (this.lat0 >= 0) {
	      lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
	    }
	    else {
	      lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
	    }
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz), rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz));
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$27 = ["ortho"];
	var ortho = {
	  init: init$26,
	  forward: forward$25,
	  inverse: inverse$25,
	  names: names$27
	};

	// QSC projection rewritten from the original PROJ4
	// https://github.com/OSGeo/proj.4/blob/master/src/PJ_qsc.c

	/* constants */
	var FACE_ENUM = {
	    FRONT: 1,
	    RIGHT: 2,
	    BACK: 3,
	    LEFT: 4,
	    TOP: 5,
	    BOTTOM: 6
	};

	var AREA_ENUM = {
	    AREA_0: 1,
	    AREA_1: 2,
	    AREA_2: 3,
	    AREA_3: 4
	};

	function init$27() {

	  this.x0 = this.x0 || 0;
	  this.y0 = this.y0 || 0;
	  this.lat0 = this.lat0 || 0;
	  this.long0 = this.long0 || 0;
	  this.lat_ts = this.lat_ts || 0;
	  this.title = this.title || "Quadrilateralized Spherical Cube";

	  /* Determine the cube face from the center of projection. */
	  if (this.lat0 >= HALF_PI - FORTPI / 2.0) {
	    this.face = FACE_ENUM.TOP;
	  } else if (this.lat0 <= -(HALF_PI - FORTPI / 2.0)) {
	    this.face = FACE_ENUM.BOTTOM;
	  } else if (Math.abs(this.long0) <= FORTPI) {
	    this.face = FACE_ENUM.FRONT;
	  } else if (Math.abs(this.long0) <= HALF_PI + FORTPI) {
	    this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
	  } else {
	    this.face = FACE_ENUM.BACK;
	  }

	  /* Fill in useful values for the ellipsoid <-> sphere shift
	   * described in [LK12]. */
	  if (this.es !== 0) {
	    this.one_minus_f = 1 - (this.a - this.b) / this.a;
	    this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
	  }
	}

	// QSC forward equations--mapping lat,long to x,y
	// -----------------------------------------------------------------
	function forward$26(p) {
	  var xy = {x: 0, y: 0};
	  var lat, lon;
	  var theta, phi;
	  var t, mu;
	  /* nu; */
	  var area = {value: 0};

	  // move lon according to projection's lon
	  p.x -= this.long0;

	  /* Convert the geodetic latitude to a geocentric latitude.
	   * This corresponds to the shift from the ellipsoid to the sphere
	   * described in [LK12]. */
	  if (this.es !== 0) {//if (P->es != 0) {
	    lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
	  } else {
	    lat = p.y;
	  }

	  /* Convert the input lat, lon into theta, phi as used by QSC.
	   * This depends on the cube face and the area on it.
	   * For the top and bottom face, we can compute theta and phi
	   * directly from phi, lam. For the other faces, we must use
	   * unit sphere cartesian coordinates as an intermediate step. */
	  lon = p.x; //lon = lp.lam;
	  if (this.face === FACE_ENUM.TOP) {
	    phi = HALF_PI - lat;
	    if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
	      area.value = AREA_ENUM.AREA_0;
	      theta = lon - HALF_PI;
	    } else if (lon > HALF_PI + FORTPI || lon <= -(HALF_PI + FORTPI)) {
	      area.value = AREA_ENUM.AREA_1;
	      theta = (lon > 0.0 ? lon - SPI : lon + SPI);
	    } else if (lon > -(HALF_PI + FORTPI) && lon <= -FORTPI) {
	      area.value = AREA_ENUM.AREA_2;
	      theta = lon + HALF_PI;
	    } else {
	      area.value = AREA_ENUM.AREA_3;
	      theta = lon;
	    }
	  } else if (this.face === FACE_ENUM.BOTTOM) {
	    phi = HALF_PI + lat;
	    if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
	      area.value = AREA_ENUM.AREA_0;
	      theta = -lon + HALF_PI;
	    } else if (lon < FORTPI && lon >= -FORTPI) {
	      area.value = AREA_ENUM.AREA_1;
	      theta = -lon;
	    } else if (lon < -FORTPI && lon >= -(HALF_PI + FORTPI)) {
	      area.value = AREA_ENUM.AREA_2;
	      theta = -lon - HALF_PI;
	    } else {
	      area.value = AREA_ENUM.AREA_3;
	      theta = (lon > 0.0 ? -lon + SPI : -lon - SPI);
	    }
	  } else {
	    var q, r, s;
	    var sinlat, coslat;
	    var sinlon, coslon;

	    if (this.face === FACE_ENUM.RIGHT) {
	      lon = qsc_shift_lon_origin(lon, +HALF_PI);
	    } else if (this.face === FACE_ENUM.BACK) {
	      lon = qsc_shift_lon_origin(lon, +SPI);
	    } else if (this.face === FACE_ENUM.LEFT) {
	      lon = qsc_shift_lon_origin(lon, -HALF_PI);
	    }
	    sinlat = Math.sin(lat);
	    coslat = Math.cos(lat);
	    sinlon = Math.sin(lon);
	    coslon = Math.cos(lon);
	    q = coslat * coslon;
	    r = coslat * sinlon;
	    s = sinlat;

	    if (this.face === FACE_ENUM.FRONT) {
	      phi = Math.acos(q);
	      theta = qsc_fwd_equat_face_theta(phi, s, r, area);
	    } else if (this.face === FACE_ENUM.RIGHT) {
	      phi = Math.acos(r);
	      theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
	    } else if (this.face === FACE_ENUM.BACK) {
	      phi = Math.acos(-q);
	      theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
	    } else if (this.face === FACE_ENUM.LEFT) {
	      phi = Math.acos(-r);
	      theta = qsc_fwd_equat_face_theta(phi, s, q, area);
	    } else {
	      /* Impossible */
	      phi = theta = 0;
	      area.value = AREA_ENUM.AREA_0;
	    }
	  }

	  /* Compute mu and nu for the area of definition.
	   * For mu, see Eq. (3-21) in [OL76], but note the typos:
	   * compare with Eq. (3-14). For nu, see Eq. (3-38). */
	  mu = Math.atan((12 / SPI) * (theta + Math.acos(Math.sin(theta) * Math.cos(FORTPI)) - HALF_PI));
	  t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));

	  /* Apply the result to the real area. */
	  if (area.value === AREA_ENUM.AREA_1) {
	    mu += HALF_PI;
	  } else if (area.value === AREA_ENUM.AREA_2) {
	    mu += SPI;
	  } else if (area.value === AREA_ENUM.AREA_3) {
	    mu += 1.5 * SPI;
	  }

	  /* Now compute x, y from mu and nu */
	  xy.x = t * Math.cos(mu);
	  xy.y = t * Math.sin(mu);
	  xy.x = xy.x * this.a + this.x0;
	  xy.y = xy.y * this.a + this.y0;

	  p.x = xy.x;
	  p.y = xy.y;
	  return p;
	}

	// QSC inverse equations--mapping x,y to lat/long
	// -----------------------------------------------------------------
	function inverse$26(p) {
	  var lp = {lam: 0, phi: 0};
	  var mu, nu, cosmu, tannu;
	  var tantheta, theta, cosphi, phi;
	  var t;
	  var area = {value: 0};

	  /* de-offset */
	  p.x = (p.x - this.x0) / this.a;
	  p.y = (p.y - this.y0) / this.a;

	  /* Convert the input x, y to the mu and nu angles as used by QSC.
	   * This depends on the area of the cube face. */
	  nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
	  mu = Math.atan2(p.y, p.x);
	  if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
	    area.value = AREA_ENUM.AREA_0;
	  } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
	    area.value = AREA_ENUM.AREA_1;
	    mu -= HALF_PI;
	  } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
	    area.value = AREA_ENUM.AREA_2;
	    mu = (mu < 0.0 ? mu + SPI : mu - SPI);
	  } else {
	    area.value = AREA_ENUM.AREA_3;
	    mu += HALF_PI;
	  }

	  /* Compute phi and theta for the area of definition.
	   * The inverse projection is not described in the original paper, but some
	   * good hints can be found here (as of 2011-12-14):
	   * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
	   * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */
	  t = (SPI / 12) * Math.tan(mu);
	  tantheta = Math.sin(t) / (Math.cos(t) - (1 / Math.sqrt(2)));
	  theta = Math.atan(tantheta);
	  cosmu = Math.cos(mu);
	  tannu = Math.tan(nu);
	  cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));
	  if (cosphi < -1) {
	    cosphi = -1;
	  } else if (cosphi > +1) {
	    cosphi = +1;
	  }

	  /* Apply the result to the real area on the cube face.
	   * For the top and bottom face, we can compute phi and lam directly.
	   * For the other faces, we must use unit sphere cartesian coordinates
	   * as an intermediate step. */
	  if (this.face === FACE_ENUM.TOP) {
	    phi = Math.acos(cosphi);
	    lp.phi = HALF_PI - phi;
	    if (area.value === AREA_ENUM.AREA_0) {
	      lp.lam = theta + HALF_PI;
	    } else if (area.value === AREA_ENUM.AREA_1) {
	      lp.lam = (theta < 0.0 ? theta + SPI : theta - SPI);
	    } else if (area.value === AREA_ENUM.AREA_2) {
	      lp.lam = theta - HALF_PI;
	    } else /* area.value == AREA_ENUM.AREA_3 */ {
	      lp.lam = theta;
	    }
	  } else if (this.face === FACE_ENUM.BOTTOM) {
	    phi = Math.acos(cosphi);
	    lp.phi = phi - HALF_PI;
	    if (area.value === AREA_ENUM.AREA_0) {
	      lp.lam = -theta + HALF_PI;
	    } else if (area.value === AREA_ENUM.AREA_1) {
	      lp.lam = -theta;
	    } else if (area.value === AREA_ENUM.AREA_2) {
	      lp.lam = -theta - HALF_PI;
	    } else /* area.value == AREA_ENUM.AREA_3 */ {
	      lp.lam = (theta < 0.0 ? -theta - SPI : -theta + SPI);
	    }
	  } else {
	    /* Compute phi and lam via cartesian unit sphere coordinates. */
	    var q, r, s;
	    q = cosphi;
	    t = q * q;
	    if (t >= 1) {
	      s = 0;
	    } else {
	      s = Math.sqrt(1 - t) * Math.sin(theta);
	    }
	    t += s * s;
	    if (t >= 1) {
	      r = 0;
	    } else {
	      r = Math.sqrt(1 - t);
	    }
	    /* Rotate q,r,s into the correct area. */
	    if (area.value === AREA_ENUM.AREA_1) {
	      t = r;
	      r = -s;
	      s = t;
	    } else if (area.value === AREA_ENUM.AREA_2) {
	      r = -r;
	      s = -s;
	    } else if (area.value === AREA_ENUM.AREA_3) {
	      t = r;
	      r = s;
	      s = -t;
	    }
	    /* Rotate q,r,s into the correct cube face. */
	    if (this.face === FACE_ENUM.RIGHT) {
	      t = q;
	      q = -r;
	      r = t;
	    } else if (this.face === FACE_ENUM.BACK) {
	      q = -q;
	      r = -r;
	    } else if (this.face === FACE_ENUM.LEFT) {
	      t = q;
	      q = r;
	      r = -t;
	    }
	    /* Now compute phi and lam from the unit sphere coordinates. */
	    lp.phi = Math.acos(-s) - HALF_PI;
	    lp.lam = Math.atan2(r, q);
	    if (this.face === FACE_ENUM.RIGHT) {
	      lp.lam = qsc_shift_lon_origin(lp.lam, -HALF_PI);
	    } else if (this.face === FACE_ENUM.BACK) {
	      lp.lam = qsc_shift_lon_origin(lp.lam, -SPI);
	    } else if (this.face === FACE_ENUM.LEFT) {
	      lp.lam = qsc_shift_lon_origin(lp.lam, +HALF_PI);
	    }
	  }

	  /* Apply the shift from the sphere to the ellipsoid as described
	   * in [LK12]. */
	  if (this.es !== 0) {
	    var invert_sign;
	    var tanphi, xa;
	    invert_sign = (lp.phi < 0 ? 1 : 0);
	    tanphi = Math.tan(lp.phi);
	    xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
	    lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));
	    if (invert_sign) {
	      lp.phi = -lp.phi;
	    }
	  }

	  lp.lam += this.long0;
	  p.x = lp.lam;
	  p.y = lp.phi;
	  return p;
	}

	/* Helper function for forward projection: compute the theta angle
	 * and determine the area number. */
	function qsc_fwd_equat_face_theta(phi, y, x, area) {
	  var theta;
	  if (phi < EPSLN) {
	    area.value = AREA_ENUM.AREA_0;
	    theta = 0.0;
	  } else {
	    theta = Math.atan2(y, x);
	    if (Math.abs(theta) <= FORTPI) {
	      area.value = AREA_ENUM.AREA_0;
	    } else if (theta > FORTPI && theta <= HALF_PI + FORTPI) {
	      area.value = AREA_ENUM.AREA_1;
	      theta -= HALF_PI;
	    } else if (theta > HALF_PI + FORTPI || theta <= -(HALF_PI + FORTPI)) {
	      area.value = AREA_ENUM.AREA_2;
	      theta = (theta >= 0.0 ? theta - SPI : theta + SPI);
	    } else {
	      area.value = AREA_ENUM.AREA_3;
	      theta += HALF_PI;
	    }
	  }
	  return theta;
	}

	/* Helper function: shift the longitude. */
	function qsc_shift_lon_origin(lon, offset) {
	  var slon = lon + offset;
	  if (slon < -SPI) {
	    slon += TWO_PI;
	  } else if (slon > +SPI) {
	    slon -= TWO_PI;
	  }
	  return slon;
	}

	var names$28 = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
	var qsc = {
	  init: init$27,
	  forward: forward$26,
	  inverse: inverse$26,
	  names: names$28
	};

	// Robinson projection
	// Based on https://github.com/OSGeo/proj.4/blob/master/src/PJ_robin.c
	// Polynomial coeficients from http://article.gmane.org/gmane.comp.gis.proj-4.devel/6039

	var COEFS_X = [
	    [1.0000, 2.2199e-17, -7.15515e-05, 3.1103e-06],
	    [0.9986, -0.000482243, -2.4897e-05, -1.3309e-06],
	    [0.9954, -0.00083103, -4.48605e-05, -9.86701e-07],
	    [0.9900, -0.00135364, -5.9661e-05, 3.6777e-06],
	    [0.9822, -0.00167442, -4.49547e-06, -5.72411e-06],
	    [0.9730, -0.00214868, -9.03571e-05, 1.8736e-08],
	    [0.9600, -0.00305085, -9.00761e-05, 1.64917e-06],
	    [0.9427, -0.00382792, -6.53386e-05, -2.6154e-06],
	    [0.9216, -0.00467746, -0.00010457, 4.81243e-06],
	    [0.8962, -0.00536223, -3.23831e-05, -5.43432e-06],
	    [0.8679, -0.00609363, -0.000113898, 3.32484e-06],
	    [0.8350, -0.00698325, -6.40253e-05, 9.34959e-07],
	    [0.7986, -0.00755338, -5.00009e-05, 9.35324e-07],
	    [0.7597, -0.00798324, -3.5971e-05, -2.27626e-06],
	    [0.7186, -0.00851367, -7.01149e-05, -8.6303e-06],
	    [0.6732, -0.00986209, -0.000199569, 1.91974e-05],
	    [0.6213, -0.010418, 8.83923e-05, 6.24051e-06],
	    [0.5722, -0.00906601, 0.000182, 6.24051e-06],
	    [0.5322, -0.00677797, 0.000275608, 6.24051e-06]
	];

	var COEFS_Y = [
	    [-5.20417e-18, 0.0124, 1.21431e-18, -8.45284e-11],
	    [0.0620, 0.0124, -1.26793e-09, 4.22642e-10],
	    [0.1240, 0.0124, 5.07171e-09, -1.60604e-09],
	    [0.1860, 0.0123999, -1.90189e-08, 6.00152e-09],
	    [0.2480, 0.0124002, 7.10039e-08, -2.24e-08],
	    [0.3100, 0.0123992, -2.64997e-07, 8.35986e-08],
	    [0.3720, 0.0124029, 9.88983e-07, -3.11994e-07],
	    [0.4340, 0.0123893, -3.69093e-06, -4.35621e-07],
	    [0.4958, 0.0123198, -1.02252e-05, -3.45523e-07],
	    [0.5571, 0.0121916, -1.54081e-05, -5.82288e-07],
	    [0.6176, 0.0119938, -2.41424e-05, -5.25327e-07],
	    [0.6769, 0.011713, -3.20223e-05, -5.16405e-07],
	    [0.7346, 0.0113541, -3.97684e-05, -6.09052e-07],
	    [0.7903, 0.0109107, -4.89042e-05, -1.04739e-06],
	    [0.8435, 0.0103431, -6.4615e-05, -1.40374e-09],
	    [0.8936, 0.00969686, -6.4636e-05, -8.547e-06],
	    [0.9394, 0.00840947, -0.000192841, -4.2106e-06],
	    [0.9761, 0.00616527, -0.000256, -4.2106e-06],
	    [1.0000, 0.00328947, -0.000319159, -4.2106e-06]
	];

	var FXC = 0.8487;
	var FYC = 1.3523;
	var C1 = R2D/5; // rad to 5-degree interval
	var RC1 = 1/C1;
	var NODES = 18;

	var poly3_val = function(coefs, x) {
	    return coefs[0] + x * (coefs[1] + x * (coefs[2] + x * coefs[3]));
	};

	var poly3_der = function(coefs, x) {
	    return coefs[1] + x * (2 * coefs[2] + x * 3 * coefs[3]);
	};

	function newton_rapshon(f_df, start, max_err, iters) {
	    var x = start;
	    for (; iters; --iters) {
	        var upd = f_df(x);
	        x -= upd;
	        if (Math.abs(upd) < max_err) {
	            break;
	        }
	    }
	    return x;
	}

	function init$28() {
	    this.x0 = this.x0 || 0;
	    this.y0 = this.y0 || 0;
	    this.long0 = this.long0 || 0;
	    this.es = 0;
	    this.title = this.title || "Robinson";
	}

	function forward$27(ll) {
	    var lon = adjust_lon(ll.x - this.long0);

	    var dphi = Math.abs(ll.y);
	    var i = Math.floor(dphi * C1);
	    if (i < 0) {
	        i = 0;
	    } else if (i >= NODES) {
	        i = NODES - 1;
	    }
	    dphi = R2D * (dphi - RC1 * i);
	    var xy = {
	        x: poly3_val(COEFS_X[i], dphi) * lon,
	        y: poly3_val(COEFS_Y[i], dphi)
	    };
	    if (ll.y < 0) {
	        xy.y = -xy.y;
	    }

	    xy.x = xy.x * this.a * FXC + this.x0;
	    xy.y = xy.y * this.a * FYC + this.y0;
	    return xy;
	}

	function inverse$27(xy) {
	    var ll = {
	        x: (xy.x - this.x0) / (this.a * FXC),
	        y: Math.abs(xy.y - this.y0) / (this.a * FYC)
	    };

	    if (ll.y >= 1) { // pathologic case
	        ll.x /= COEFS_X[NODES][0];
	        ll.y = xy.y < 0 ? -HALF_PI : HALF_PI;
	    } else {
	        // find table interval
	        var i = Math.floor(ll.y * NODES);
	        if (i < 0) {
	            i = 0;
	        } else if (i >= NODES) {
	            i = NODES - 1;
	        }
	        for (;;) {
	            if (COEFS_Y[i][0] > ll.y) {
	                --i;
	            } else if (COEFS_Y[i+1][0] <= ll.y) {
	                ++i;
	            } else {
	                break;
	            }
	        }
	        // linear interpolation in 5 degree interval
	        var coefs = COEFS_Y[i];
	        var t = 5 * (ll.y - coefs[0]) / (COEFS_Y[i+1][0] - coefs[0]);
	        // find t so that poly3_val(coefs, t) = ll.y
	        t = newton_rapshon(function(x) {
	            return (poly3_val(coefs, x) - ll.y) / poly3_der(coefs, x);
	        }, t, EPSLN, 100);

	        ll.x /= poly3_val(COEFS_X[i], t);
	        ll.y = (5 * i + t) * D2R;
	        if (xy.y < 0) {
	            ll.y = -ll.y;
	        }
	    }

	    ll.x = adjust_lon(ll.x + this.long0);
	    return ll;
	}

	var names$29 = ["Robinson", "robin"];
	var robin = {
	  init: init$28,
	  forward: forward$27,
	  inverse: inverse$27,
	  names: names$29
	};

	var includedProjections = function(proj4){
	  proj4.Proj.projections.add(tmerc);
	  proj4.Proj.projections.add(etmerc);
	  proj4.Proj.projections.add(utm);
	  proj4.Proj.projections.add(sterea);
	  proj4.Proj.projections.add(stere);
	  proj4.Proj.projections.add(somerc);
	  proj4.Proj.projections.add(omerc);
	  proj4.Proj.projections.add(lcc);
	  proj4.Proj.projections.add(krovak);
	  proj4.Proj.projections.add(cass);
	  proj4.Proj.projections.add(laea);
	  proj4.Proj.projections.add(aea);
	  proj4.Proj.projections.add(gnom);
	  proj4.Proj.projections.add(cea);
	  proj4.Proj.projections.add(eqc);
	  proj4.Proj.projections.add(poly);
	  proj4.Proj.projections.add(nzmg);
	  proj4.Proj.projections.add(mill);
	  proj4.Proj.projections.add(sinu);
	  proj4.Proj.projections.add(moll);
	  proj4.Proj.projections.add(eqdc);
	  proj4.Proj.projections.add(vandg);
	  proj4.Proj.projections.add(aeqd);
	  proj4.Proj.projections.add(ortho);
	  proj4.Proj.projections.add(qsc);
	  proj4.Proj.projections.add(robin);
	};

	proj4$1.defaultDatum = 'WGS84'; //default datum
	proj4$1.Proj = Projection;
	proj4$1.WGS84 = new proj4$1.Proj('WGS84');
	proj4$1.Point = Point;
	proj4$1.toPoint = toPoint;
	proj4$1.defs = defs;
	proj4$1.transform = transform;
	proj4$1.mgrs = mgrs;
	proj4$1.version = version;
	includedProjections(proj4$1);

	return proj4$1;

})));

},{}],10:[function(require,module,exports){
'use strict';

var proj4 = require('proj4').hasOwnProperty('default') ? require('proj4').default : require('proj4');
// Checks if `list` looks like a `[x, y]`.
function isXY(list) {
  return list.length >= 2 &&
    typeof list[0] === 'number' &&
    typeof list[1] === 'number';
}

function traverseCoords(coordinates, callback) {
  if (isXY(coordinates)) return callback(coordinates);
  return coordinates.map(function(coord){return traverseCoords(coord, callback);});
}

// Simplistic shallow clone that will work for a normal GeoJSON object.
function clone(obj) {
  if (null == obj || 'object' !== typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function traverseGeoJson(geometryCb, nodeCb, geojson) {
  if (geojson == null) return geojson;

  var r = clone(geojson);
  var self = traverseGeoJson.bind(this, geometryCb, nodeCb);

  switch (geojson.type) {
  case 'Feature':
    r.geometry = self(geojson.geometry);
    break;
  case 'FeatureCollection':
    r.features = r.features.map(self);
    break;
  case 'GeometryCollection':
    r.geometries = r.geometries.map(self);
    break;
  default:
    geometryCb(r);
    break;
  }

  if (nodeCb) nodeCb(r);

  return r;
}

function detectCrs(geojson, projs) {
  var crsInfo = geojson.crs,
      crs;

  if (crsInfo === undefined) {
    throw new Error('Unable to detect CRS, GeoJSON has no "crs" property.');
  }

  if (crsInfo.type === 'name') {
    crs = projs[crsInfo.properties.name];
  } else if (crsInfo.type === 'EPSG') {
    crs = projs['EPSG:' + crsInfo.properties.code];
  }

  if (!crs) {
    throw new Error('CRS defined in crs section could not be identified: ' + JSON.stringify(crsInfo));
  }

  return crs;
}

function determineCrs(crs, projs) {
  if (typeof crs === 'string' || crs instanceof String) {
    return projs[crs] || proj4.Proj(crs);
  }

  return crs;
}

function calcBbox(geojson) {
  var min = [Number.MAX_VALUE, Number.MAX_VALUE],
      max = [-Number.MAX_VALUE, -Number.MAX_VALUE];
  traverseGeoJson(function(_gj) {
    traverseCoords(_gj.coordinates, function(xy) {
      min[0] = Math.min(min[0], xy[0]);
      min[1] = Math.min(min[1], xy[1]);
      max[0] = Math.max(max[0], xy[0]);
      max[1] = Math.max(max[1], xy[1]);
    });
  }, null, geojson);
  return [min[0], min[1], max[0], max[1]];
}

function reproject(geojson, from, to, projs) {
  projs = projs || {};
  if (!from) {
    from = detectCrs(geojson, projs);
  } else {
    from = determineCrs(from, projs);
  }

  to = determineCrs(to, projs);
  var transform = proj4(from, to).forward.bind(transform);

  var transformGeometryCoords = function(gj) {
    // No easy way to put correct CRS info into the GeoJSON,
    // and definitely wrong to keep the old, so delete it.
    if (gj.crs) {
      delete gj.crs;
    }
    gj.coordinates = traverseCoords(gj.coordinates, transform);
  }

  var transformBbox = function(gj) {
    if (gj.bbox) {
      gj.bbox = calcBbox(gj);
    }
  }

  return traverseGeoJson(transformGeometryCoords, transformBbox, geojson);
}

module.exports = {
  detectCrs: detectCrs,

  reproject: reproject,

  reverse: function(geojson) {
    return traverseGeoJson(function(gj) {
      gj.coordinates = traverseCoords(gj.coordinates, function(xy) {
        return [ xy[1], xy[0] ];
      });
    }, null, geojson);
  },

  toWgs84: function(geojson, from, projs) {
    return reproject(geojson, from, proj4.WGS84, projs);
  }
};

},{"proj4":9}],11:[function(require,module,exports){
/*const mapboxgl = window.mapboxgl

fetch('../tiles/hp/layers.json')
  .then(res => res.json())
  .then(layers => {
    const map = window._map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        name: 'OCAD demo',
        sources: {
          map: {
            type: 'vector',
            tiles: ['http://localhost:8081/tiles/hp/{z}/{x}/{y}.pbf'],
            maxzoom: 14
          }
        },
        layers
      },
      center: [11.92, 57.745],
      zoom: 13,
      customAttribution: '&copy; 2018 Tolereds AIK, Fältarbete: Maths Carlsson'
    })

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // map.on('load', function() {
    //   const bounds = bbox(geoJson)
    //   map.fitBounds(bounds, {
    //     padding: 20,
    //     animate: false
    //   })
    // })
  })
*/

const Vue = window.Vue
const toBuffer = require('blob-to-buffer')
const bbox = require('@turf/bbox').default
const { toWgs84 } = require('reproject')
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('../../')

Vue.component('upload-form', {
  template: '#upload-form-template',
  props: [],
  data () {
    return {
      files: [],
      epsg: 3006
    }
  },
  methods: {
    fileSelected (e) {
      this.files = e.target.files
    },
    loadFile () {
      const reader = new FileReader()
      reader.onload = () => {
        const blob = new Blob([reader.result], {type: 'application/octet-stream'})
        toBuffer(blob, (err, buffer) => {
          this.$emit('fileselected', {
            name: file.name,
            content: buffer,
            epsg: this.epsg
          })
        })
      }

      const file = this.files[0]
      reader.readAsArrayBuffer(file)
    }
  }
})

Vue.component('file-info', {
  template: '#file-info-template',
  props: ['name', 'file', 'error'],
  computed: {
    crs () {
      return this.file && this.file.parameterStrings[1039] && this.file.parameterStrings[1039][0]
    }
  }
})

Vue.component('map-view', {
  template: '#map-view-template',
  props: ['layers', 'geojson'],
  mounted () {
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: this.style()
    })

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-right');
  },
  watch: {
    layers () {
      this.refresh()
    },
    geojson () {
      this.refresh()
      const bounds = bbox(this.geojson)
      this.map.fitBounds(bounds, {
        padding: 20,
        animate: false
      })
    }
  },
  methods: {
    refresh () {
      if (!this.map) { return }

      this.map.setStyle(this.style())
    },
    style () {
      return {
        version: 8,
        name: 'OCAD demo',
        sources: {
          map: {
            type: 'geojson',
            data: this.geojson || {type: 'FeatureCollection', features: []}
          }
        },
        layers: this.layers || []
      }
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    name: null,
    file: null,
    mapConfig: null,
    error: null,
    layers: [],
    geojson: {type: 'FeatureCollection', features: []},
    epsgCache: {}
  },
  methods: {
    selectFile ({path, content, name, epsg}) {
      this.name = name
      this.file = null
      this.error = null

      const crsDef = this.epsgCache[epsg]
        ? Promise.resolve(this.epsgCache[epsg])
        : fetch(`http://epsg.io/${epsg}.proj4`)
          .then(res => res.text())
          .then(projDef => {
            this.epsgCache[epsg] = projDef
            return projDef
          })

      readOcad(content)
        .then(ocadFile => {
          this.file = Object.freeze(ocadFile)
          this.layers = ocadToMapboxGlStyle(this.file, {source: 'map', sourceLayer: ''})

          crsDef.then(projDef => {
            this.geojson = toWgs84(ocadToGeoJson(this.file), projDef)
          })
        })
        .catch(err => {
          this.error = err.message
        })
    }
  }
})

},{"../../":15,"@turf/bbox":1,"blob-to-buffer":5,"reproject":10}],12:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],13:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"@turf/helpers":12,"dup":3}],14:[function(require,module,exports){
/*  Adapted from pdf.js's colorspace module
    (https://github.com/mozilla/pdf.js/blob/a18290759227c894f8f97f58c8da8ce942f5a38f/src/core/colorspace.js)

    Released under the Apache 2.0 license:
    https://github.com/mozilla/pdf.js/blob/master/LICENSE
*/
module.exports = function convertToRgb (src) {
  const toFraction = 1 / 100
  const rgb = new Uint8ClampedArray(3)

  let c = src[0] * toFraction
  let m = src[1] * toFraction
  let y = src[2] * toFraction
  let k = src[3] * toFraction

  rgb[0] = 255 +
    c * (-4.387332384609988 * c + 54.48615194189176 * m +
         18.82290502165302 * y + 212.25662451639585 * k +
         -285.2331026137004) +
    m * (1.7149763477362134 * m - 5.6096736904047315 * y +
         -17.873870861415444 * k - 5.497006427196366) +
    y * (-2.5217340131683033 * y - 21.248923337353073 * k +
         17.5119270841813) +
    k * (-21.86122147463605 * k - 189.48180835922747)

  rgb[1] = 255 +
    c * (8.841041422036149 * c + 60.118027045597366 * m +
         6.871425592049007 * y + 31.159100130055922 * k +
         -79.2970844816548) +
    m * (-15.310361306967817 * m + 17.575251261109482 * y +
         131.35250912493976 * k - 190.9453302588951) +
    y * (4.444339102852739 * y + 9.8632861493405 * k - 24.86741582555878) +
    k * (-20.737325471181034 * k - 187.80453709719578)

  rgb[2] = 255 +
    c * (0.8842522430003296 * c + 8.078677503112928 * m +
         30.89978309703729 * y - 0.23883238689178934 * k +
         -14.183576799673286) +
    m * (10.49593273432072 * m + 63.02378494754052 * y +
         50.606957656360734 * k - 112.23884253719248) +
    y * (0.03296041114873217 * y + 115.60384449646641 * k +
         -193.58209356861505) +
    k * (-22.33816807309886 * k - 180.12613974708367)

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

},{}],15:[function(require,module,exports){
const readOcad = require('./ocad-reader')
const ocadToGeoJson = require('./ocad-to-geojson')
const ocadToMapboxGlStyle = require('./ocad-to-mapbox-gl-style')

module.exports = {
  readOcad,
  ocadToGeoJson,
  ocadToMapboxGlStyle
}

},{"./ocad-reader":19,"./ocad-to-geojson":31,"./ocad-to-mapbox-gl-style":32}],16:[function(require,module,exports){
const { Symbol10, Symbol11 } = require('./symbol')

class AreaSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
    this.hatchMode = this.readSmallInt()
    this.hatchColor = this.readSmallInt()
    this.hatchLineWidth = this.readSmallInt()
    this.hatchDist = this.readSmallInt()
    this.hatchAngle1 = this.readSmallInt()
    this.hatchAngle2 = this.readSmallInt()
    this.fillOn = !!this.readByte()
    this.borderOn = !!this.readByte()
  }
}

class AreaSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, 3)

    // TODO: why?
    this.offset += 64

    this.borderSym = this.readInteger()
    this.fillColor = this.readSmallInt()
    this.hatchMode = this.readSmallInt()
    this.hatchColor = this.readSmallInt()
    this.hatchLineWidth = this.readSmallInt()
    this.hatchDist = this.readSmallInt()
    this.hatchAngle1 = this.readSmallInt()
    this.hatchAngle2 = this.readSmallInt()
    this.fillOn = !!this.readByte()
    this.borderOn = !!this.readByte()
  }
}

module.exports = {
  10: AreaSymbol10,
  11: AreaSymbol11,
  12: AreaSymbol11
}

},{"./symbol":28}],17:[function(require,module,exports){
module.exports = class Block {
  constructor (buffer, offset) {
    this.buffer = buffer
    this._startOffset = this.offset = offset || 0
  }

  readInteger () {
    const val = this.buffer.readInt32LE(this.offset)
    this.offset += 4
    return val
  }

  readCardinal () {
    const val = this.buffer.readUInt32LE(this.offset)
    this.offset += 4
    return val
  }

  readSmallInt () {
    const val = this.buffer.readInt16LE(this.offset)
    this.offset += 2
    return val
  }

  readByte () {
    const val = this.buffer.readInt8(this.offset)
    this.offset++
    return val
  }

  readWord () {
    const val = this.buffer.readUInt16LE(this.offset)
    this.offset += 2
    return val
  }

  readWordBool () {
    return !!this.readWord()
  }

  readDouble () {
    const val = this.buffer.readDoubleLE(this.offset)
    this.offset += 8
    return val
  }

  getSize () {
    return this.offset - this._startOffset
  }
}

},{}],18:[function(require,module,exports){
const Block = require('./block')

module.exports = class FileHeader extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    if (buffer.length - offset < 60) {
      throw new Error('Buffer is not large enough to hold header')
    }

    this.ocadMark = this.readSmallInt()
    this.fileType = this.readByte()
    this.readByte() // FileStatus, not used
    this.version = this.readSmallInt()
    this.subVersion = this.readByte()
    this.subSubVersion = this.readByte()
    this.symbolIndexBlock = this.readCardinal()
    this.objectIndexBlock = this.readCardinal()
    this.offlineSyncSerial = this.readInteger()
    this.currentFileVersion = this.readInteger()
    this.readCardinal() // Internal, not used
    this.readCardinal() // Internal, not used
    this.stringIndexBlock = this.readCardinal()
    this.fileNamePos = this.readCardinal()
    this.fileNameSize = this.readCardinal()
    this.readCardinal() // Internal, not used
    this.readCardinal() // Res1, not used
    this.readCardinal() // Res2, not used
    this.mrStartBlockPosition = this.readCardinal()
  }

  isValid () {
    return this.ocadMark === 0x0cad
  }
}

},{"./block":17}],19:[function(require,module,exports){
const fs = require('fs')
const { Buffer } = require('buffer')
const getRgb = require('../cmyk-to-rgb')

const FileHeader = require('./file-header')
const SymbolIndex = require('./symbol-index')
const ObjectIndex = require('./object-index')
const StringIndex = require('./string-index')

module.exports = async (path, options) => {
  options = options || {}

  if (Buffer.isBuffer(path)) {
    return parseOcadBuffer(path, options)
  } else {
    const buffer = await new Promise((resolve, reject) =>
      fs.readFile(path, (err, buffer) => {
        if (err) reject(err)

        resolve(buffer)
      }))
    return parseOcadBuffer(buffer, options)
  }
}

const parseOcadBuffer = async (buffer, options) => new Promise((resolve, reject) => {
  const header = new FileHeader(buffer)
  if (!header.isValid()) {
    reject(new Error(`Not an OCAD file (invalid header ${header.ocadMark} !== ${0x0cad})`))
  }

  if (header.version < 10 && !options.bypassVersionCheck) {
    throw new Error(`Unsupport OCAD file version (${header.version}), only >= 10 supported for now.`)
  }

  let symbols = []
  let symbolIndexOffset = header.symbolIndexBlock
  while (symbolIndexOffset) {
    let symbolIndex = new SymbolIndex(buffer, symbolIndexOffset, header.version)
    Array.prototype.push.apply(symbols, symbolIndex.parseSymbols())

    symbolIndexOffset = symbolIndex.nextObjectIndexBlock
  }

  let objects = []
  let objectIndexOffset = header.objectIndexBlock
  while (objectIndexOffset) {
    let objectIndex = new ObjectIndex(buffer, objectIndexOffset, header.version)
    Array.prototype.push.apply(objects, objectIndex.parseObjects())

    objectIndexOffset = objectIndex.nextObjectIndexBlock
  }

  let parameterStrings = {}
  let stringIndexOffset = header.stringIndexBlock
  while (stringIndexOffset) {
    let stringIndex = new StringIndex(buffer, stringIndexOffset)
    const strings = stringIndex.getStrings()

    Object.keys(strings).reduce((a, recType) => {
      const typeStrings = strings[recType]
      let concatStrings = a[recType] || []
      a[recType] = concatStrings.concat(typeStrings.map(s => s.values))
      return a
    }, parameterStrings)

    stringIndexOffset = stringIndex.nextStringIndexBlock
  }

  resolve(new OcadFile(
    header,
    parameterStrings,
    objects,
    symbols
  ))
})

class OcadFile {
  constructor (header, parameterStrings, objects, symbols) {
    this.header = header
    this.parameterStrings = parameterStrings
    this.objects = objects
    this.symbols = symbols

    this.colors = parameterStrings[9].map((colorDef, i) => {
      const cmyk = [colorDef.c, colorDef.m, colorDef.y, colorDef.k].map(Number)
      return {
        number: colorDef.n,
        cmyk: cmyk,
        name: colorDef._first,
        rgb: getRgb(cmyk),
        renderOrder: i
      }
    })
      .reduce((a, c) => {
        a[c.number] = c
        return a
      }, [])
  }

  getCrs () {
    const scalePar = this.parameterStrings['1039']
      ? this.parameterStrings['1039'][0]
      : { x: 0, y: 0, m: 1 }
    let { x, y, m } = scalePar

    x = Number(x)
    y = Number(y)
    m = Number(m)

    return {
      easting: x,
      northing: y,
      scale: m
    }
  }
}

},{"../cmyk-to-rgb":14,"./file-header":18,"./object-index":22,"./string-index":25,"./symbol-index":27,"buffer":7,"fs":6}],20:[function(require,module,exports){
const Block = require('./block')
const { Symbol10, Symbol11 } = require('./symbol')

class LineSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, 2)

    readLineSymbol(this, DoubleLine10, Decrease10)
  }
}

class LineSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, 2)

    // TODO: why?
    this.offset += 64

    readLineSymbol(this, DoubleLine11, Decrease11)
  }
}

class BaseDoubleLine extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this._startOffset = offset
    this.dblMode = this.readWord()
    this.dblFlags = this.readWord()
    this.dblFillColor = this.readSmallInt()
    this.dblLeftColor = this.readSmallInt()
    this.dblRightColor = this.readSmallInt()
    this.dblWidth = this.readSmallInt()
    this.dblLeftWidth = this.readSmallInt()
    this.dblRightWidth = this.readSmallInt()
    this.dblLength = this.readSmallInt()
    this.dblGap = this.readSmallInt()
  }
}

class DoubleLine10 extends BaseDoubleLine {
  constructor (buffer, offset) {
    super(buffer, offset)
    this.dblRes = new Array(3)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = this.readSmallInt()
    }
  }
}

class DoubleLine11 extends BaseDoubleLine {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.dblBackgroundColor = this.readSmallInt()
    this.dblRes = new Array(2)
    for (let i = 0; i < this.dblRes.length; i++) {
      this.dblRes[i] = this.readSmallInt()
    }
  }
}

class Decrease10 extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.decMode = this.readWord()
    this.decLast = this.readWord()
    this.res = this.readWord()
  }
}

class Decrease11 extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.decMode = this.readWord()
    this.decSymbolSize = this.readSmallInt()
    this.decSymbolDistance = !!this.readByte()
    this.decSymbolWidth = !!this.readByte()
  }
}

const readLineSymbol = (block, DoubleLine, Decrease) => {
  block.lineColor = block.readSmallInt()
  block.lineWidth = block.readSmallInt()
  block.lineStyle = block.readSmallInt()
  block.distFromStart = block.readSmallInt()
  block.distToEnd = block.readSmallInt()
  block.mainLength = block.readSmallInt()
  block.endLength = block.readSmallInt()
  block.mainGap = block.readSmallInt()
  block.secGap = block.readSmallInt()
  block.endGap = block.readSmallInt()
  block.minSym = block.readSmallInt()
  block.nPrimSym = block.readSmallInt()
  block.primSymDist = block.readSmallInt()

  block.doubleLine = new DoubleLine(block.buffer, block.offset)
  block.offset += block.doubleLine.getSize()

  block.decrease = new Decrease(block.buffer, block.offset)
  block.offset += block.decrease.getSize()

  block.frColor = block.readSmallInt()
  block.frWidth = block.readSmallInt()
  block.frStyle = block.readSmallInt()
  block.primDSize = block.readWord()
  block.secDSize = block.readWord()
  block.cornerDSize = block.readWord()
  block.startDSize = block.readWord()
  block.endDSize = block.readWord()
  block.useSymbolFlags = block.readByte()
  block.reserved = block.readByte()

  block.primSymElements = block.readElements(block.primDSize)
  block.secSymElements = block.readElements(block.secDSize)
  block.cornerSymElements = block.readElements(block.cornerDSize)
  block.startSymElements = block.readElements(block.startDSize)
  block.endSymElements = block.readElements(block.endDSize)
}

module.exports = {
  10: LineSymbol10,
  11: LineSymbol11,
  12: LineSymbol11
}

},{"./block":17,"./symbol":28}],21:[function(require,module,exports){
const Block = require('./block')

module.exports = class LRect extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)
    this.min = {
      x: this.readInteger(),
      y: this.readInteger()
    }
    this.max = {
      x: this.readInteger(),
      y: this.readInteger()
    }
  }

  size () {
    return 16
  }
}

},{"./block":17}],22:[function(require,module,exports){
const Block = require('./block')
const LRect = require('./lrect')
const TObject = require('./tobject')

module.exports = class ObjectIndex extends Block {
  constructor (buffer, offset, version) {
    super(buffer, offset)

    this.version = version
    this.nextObjectIndexBlock = this.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      const rc = new LRect(buffer, this.offset)
      this.offset += rc.size()

      this.table[i] = {
        rc,
        pos: this.readInteger(),
        len: this.readInteger(),
        sym: this.readInteger(),
        objType: this.readByte(),
        encryptedMode: this.readByte(),
        status: this.readByte(),
        viewType: this.readByte(),
        color: this.readSmallInt(),
        group: this.readSmallInt(),
        impLayer: this.readSmallInt(),
        dbDatasetHash: this.readByte(),
        dbKeyHash: this.readByte()
      }
    }
  }

  parseObjects () {
    return this.table
      .map(o => this.parseObject(o, o.objType))
      .filter(o => o)
  }

  parseObject (objIndex, objType) {
    if (!objIndex.pos) return

    return new TObject[this.version](this.buffer, objIndex.pos, objType)
  }
}

},{"./block":17,"./lrect":21,"./tobject":30}],23:[function(require,module,exports){
const Block = require('./block')

module.exports = class ParameterString extends Block {
  constructor (buffer, offset, indexRecord) {
    super(buffer, offset)

    this.recType = indexRecord.recType

    let val = ''
    let nextByte = 0
    for (let i = 0; i < indexRecord.len && (nextByte = this.readByte()); i++) {
      val += String.fromCharCode(nextByte)
    }

    const vals = val.split('\t')
    this.values = { _first: vals[0] }
    for (let i = 1; i < vals.length; i++) {
      this.values[vals[i][0]] = vals[i].substring(1)
    }
  }
}

},{"./block":17}],24:[function(require,module,exports){
const { Symbol10, Symbol11 } = require('./symbol')

class PointSymbol10 extends Symbol10 {
  constructor (buffer, offset) {
    super(buffer, offset, 1)

    // TODO: why?
    // this.offset += 64

    this.dataSize = this.readWord()
    this.readSmallInt() // Reserved

    this.elements = this.readElements(this.dataSize)
  }
}

class PointSymbol11 extends Symbol11 {
  constructor (buffer, offset) {
    super(buffer, offset, 1)

    // TODO: why?
    this.offset += 64

    this.dataSize = this.readWord()
    this.readSmallInt() // Reserved

    this.elements = this.readElements(this.dataSize)
  }
}

module.exports = {
  10: PointSymbol10,
  11: PointSymbol11,
  12: PointSymbol11
}

},{"./symbol":28}],25:[function(require,module,exports){
const Block = require('./block')
const ParameterString = require('./parameter-string')

module.exports = class StringIndex extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.nextStringIndexBlock = this.readInteger()
    this.table = new Array(256)
    for (let i = 0; i < 256; i++) {
      this.table[i] = {
        pos: this.readInteger(),
        len: this.readInteger(),
        recType: this.readInteger(),
        objIndex: this.readInteger()
      }
    }
  }

  getStrings () {
    const strings = this.table
      .filter(si => si.recType > 0)
      .map(si => new ParameterString(this.buffer, si.pos, si))
    return strings.reduce((pss, ps) => {
      let typeStrings = pss[ps.recType]
      if (!typeStrings) {
        pss[ps.recType] = typeStrings = []
      }

      typeStrings.push(ps)

      return pss
    }, {})
  }
}

},{"./block":17,"./parameter-string":23}],26:[function(require,module,exports){
const Block = require('./block')
const TdPoly = require('./td-poly')

module.exports = class SymbolElement extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    this.type = this.readSmallInt()
    this.flags = this.readWord()
    this.color = this.readSmallInt()
    this.lineWidth = this.readSmallInt()
    this.diameter = this.readSmallInt()
    this.numberCoords = this.readSmallInt()
    this.readCardinal() // Reserved

    this.coords = new Array(this.numberCoords)
    for (let j = 0; j < this.numberCoords; j++) {
      this.coords[j] = new TdPoly(this.readInteger(), this.readInteger())
    }
  }
}

},{"./block":17,"./td-poly":29}],27:[function(require,module,exports){
const Block = require('./block')
const PointSymbol = require('./point-symbol')
const LineSymbol = require('./line-symbol')
const AreaSymbol = require('./area-symbol')

module.exports = class SymbolIndex extends Block {
  constructor (buffer, offset, version) {
    super(buffer, offset)

    this.version = version
    this.nextSymbolIndexBlock = this.readInteger()
    this.symbolPosition = new Array(256)
    for (let i = 0; i < this.symbolPosition.length; i++) {
      this.symbolPosition[i] = this.readInteger()
    }
  }

  parseSymbols () {
    return this.symbolPosition
      .filter(sp => sp > 0)
      .map(sp => this.parseSymbol(sp))
      .filter(s => s)
  }

  parseSymbol (offset) {
    if (!offset) return

    const type = this.buffer.readInt8(offset + 8)
    switch (type) {
      case 1:
        return new PointSymbol[this.version](this.buffer, offset)
      case 2:
        return new LineSymbol[this.version](this.buffer, offset)
      case 3:
        return new AreaSymbol[this.version](this.buffer, offset)
    }

    // Ignore other symbols for now
  }
}

},{"./area-symbol":16,"./block":17,"./line-symbol":20,"./point-symbol":24}],28:[function(require,module,exports){
const Block = require('./block')
const SymbolElement = require('./symbol-element')

class BaseSymbol extends Block {
  constructor (buffer, offset, symbolType) {
    super(buffer, offset)

    this.type = symbolType
    this.size = this.readInteger()
    this.symNum = this.readInteger()
    this.otp = this.readByte()
    this.flags = this.readByte()
    this.selected = !!this.readByte()
    this.status = this.readByte()
    this.preferredDrawingTool = this.readByte()
    this.csMode = this.readByte()
    this.csObjType = this.readByte()
    this.csCdFlags = this.readByte()
    this.extent = this.readInteger()
    this.filePos = this.readCardinal()
  }

  readElements (dataSize) {
    const elements = []

    for (let i = 0; i < dataSize; i += 2) {
      const element = new SymbolElement(this.buffer, this.offset)
      elements.push(element)

      i += element.numberCoords
    }

    return elements
  }
}

class Symbol10 extends BaseSymbol {
  constructor (buffer, offset, symbolType) {
    super(buffer, offset, symbolType)

    this.group = this.readSmallInt()
    this.nColors = this.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = this.readSmallInt()
    }
    this.description = ''
    for (let i = 0; i < 32; i++) {
      const c = this.readByte()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }
    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = this.readByte()
    }
  }
}

class Symbol11 extends BaseSymbol {
  constructor (buffer, offset, symbolType) {
    super(buffer, offset, symbolType)

    this.readByte() // notUsed1
    this.readByte() // notUsed2
    this.nColors = this.readSmallInt()
    this.colors = new Array(14)
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i] = this.readSmallInt()
    }
    this.description = ''
    // UTF-16 string, 64 bytes
    for (let i = 0; i < 64 / 2; i++) {
      const c = this.readWord()
      if (c) {
        this.description += String.fromCharCode(c)
      }
    }

    this.iconBits = new Array(484)
    for (let i = 0; i < this.iconBits.length; i++) {
      this.iconBits[i] = this.readByte()
    }

    this.symbolTreeGroup = new Array(64)
    for (let i = 0; i < this.symbolTreeGroup.length; i++) {
      this.symbolTreeGroup[i] = this.readWord()
    }
  }
}

module.exports = {
  Symbol10,
  Symbol11
}

},{"./block":17,"./symbol-element":26}],29:[function(require,module,exports){
module.exports = class TdPoly extends Array {
  constructor (ocadX, ocadY, xFlags, yFlags) {
    super(xFlags === undefined ? ocadX >> 8 : ocadX, yFlags === undefined ? ocadY >> 8 : ocadY)
    this.xFlags = xFlags === undefined ? ocadX & 0xff : xFlags
    this.yFlags = yFlags === undefined ? ocadY & 0xff : yFlags
  }

  isFirstBezier () {
    return this.xFlags & 0x01
  }

  isSecondBezier () {
    return this.xFlags & 0x02
  }

  hasNoLeftLine () {
    return this.xFlags & 0x04
  }

  isBorderOrVirtualLine () {
    return this.xFlags & 0x08
  }

  isCornerPoint () {
    return this.yFlags & 0x01
  }

  isFirstHolePoint () {
    return this.yFlags & 0x02
  }

  hasNoRightLine () {
    return this.yFlags & 0x04
  }

  isDashPoint () {
    return this.yFlags & 0x08
  }

  vLength () {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1])
  }

  add (c1) {
    return new TdPoly(this[0] + c1[0], this[1] + c1[1], this.xFlags, this.yFlags)
  }

  sub (c1) {
    return new TdPoly(this[0] - c1[0], this[1] - c1[1], this.xFlags, this.yFlags)
  }

  mul (f) {
    return new TdPoly(this[0] * f, this[1] * f, this.xFlags, this.yFlags)
  }

  unit () {
    const l = this.vLength()
    return this.mul(1 / l)
  }

  rotate (theta) {
    return new TdPoly(
      this[0] * Math.cos(theta) - this[1] * Math.sin(theta),
      this[0] * Math.sin(theta) + this[1] * Math.cos(theta),
      this.xFlags,
      this.yFlags)
  }
}

},{}],30:[function(require,module,exports){
const Block = require('./block')
const TdPoly = require('./td-poly')

class BaseTObject extends Block {
  constructor (buffer, offset, objType) {
    super(buffer, offset)
    this.objType = objType
  }

  getProperties () {
    return {
      sym: this.sym,
      otp: this.otp,
      _customer: this._customer,
      ang: this.ang,
      col: this.col,
      lineWidth: this.lineWidth,
      diamFlags: this.diamFlags,
      serverObjectId: this.serverObjectId,
      height: this.height,
      creationDate: this.creationDate,
      multirepresentationId: this.multirepresentationId,
      modificationDate: this.modificationDate,
      nItem: this.nItem,
      nText: this.nText,
      nObjectString: this.nObjectString,
      nDatabaseString: this.nDatabaseString,
      objectStringType: this.objectStringType,
      res1: this.res1
    }
  }
}

class TObject11 extends BaseTObject {
  constructor (buffer, offset, objType) {
    super(buffer, offset, objType)

    this.sym = this.readInteger()
    this.otp = this.readByte()
    this._customer = this.readByte()
    this.ang = this.readSmallInt()
    this.col = this.readInteger()
    this.lineWidth = this.readSmallInt()
    this.diamFlags = this.readSmallInt()
    this.serverObjectId = this.readInteger()
    this.height = this.readInteger()
    this.creationDate = this.readDouble()
    this.multirepresentationId = this.readCardinal()
    this.modificationDate = this.readDouble()
    this.nItem = this.readCardinal()
    this.nText = this.readWord()
    this.nObjectString = this.readWord()
    this.nDatabaseString = this.readWord()
    this.objectStringType = this.readByte()
    this.res1 = this.readByte()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
    }
  }
}

module.exports = {
  10: class TObject10 extends BaseTObject {
    constructor (buffer, offset, objType) {
      super(buffer, offset, objType)

      this.sym = this.readInteger()
      this.otp = this.readByte()
      this._customer = this.readByte()
      this.ang = this.readSmallInt()
      this.nItem = this.readCardinal()
      this.nText = this.readWord()
      this.readSmallInt() // Reserved
      this.col = this.readInteger()
      this.lineWidth = this.readSmallInt()
      this.diamFlags = this.readSmallInt()
      this.readInteger() // Reserved
      this.readByte() // Reserved
      this.readByte() // Reserved
      this.readSmallInt() // Reserved
      this.height = this.readInteger()
      this.coordinates = new Array(this.nItem)

      this.offset += 4

      for (let i = 0; i < this.nItem; i++) {
        this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
      }
    }
  },
  11: TObject11,
  12: TObject11
}

},{"./block":17,"./td-poly":29}],31:[function(require,module,exports){
const { coordEach } = require('@turf/meta')

const defaultOptions = {
  assignIds: true,
  applyCrs: true,
  generateSymbolElements: true
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }
  let features = ocadFile.objects
    .map(tObjectToGeoJson)
    .filter(f => f)

  if (options.generateSymbolElements) {
    const symbols = ocadFile.symbols.reduce((ss, s) => {
      ss[s.symNum] = s
      return ss
    }, {})
    const elementFeatures = features
      .map(generateSymbolElements.bind(null, symbols))
      .filter(f => f)
    features = features.concat(Array.prototype.concat.apply([], elementFeatures))
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features
  }

  if (options.assignIds) {
    features.forEach((o, i) => {
      o.id = i + 1
    })
  }

  if (options.applyCrs) {
    applyCrs(featureCollection, ocadFile.getCrs())
  }

  return featureCollection
}

const tObjectToGeoJson = object => {
  var geometry
  switch (object.objType) {
    case 1:
      geometry = {
        type: 'Point',
        coordinates: object.coordinates[0]
      }
      break
    case 2:
      geometry = {
        type: 'LineString',
        coordinates: object.coordinates
      }
      break
    case 3:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(object.coordinates)
      }
      break
    default:
      return null
  }

  return {
    type: 'Feature',
    properties: object.getProperties(),
    geometry
  }
}

const generateSymbolElements = (symbols, feature) => {
  const symbol = symbols[feature.properties.sym]
  let elements = []

  if (!symbol) return elements

  switch (symbol.type) {
    case 1:
      const angle = feature.properties.ang ? feature.properties.ang / 10 / 180 * Math.PI : 0
      elements = symbol.elements
        .map((e, i) => createElement(symbol, 'element', i, feature, e, feature.geometry.coordinates, angle))
      break
    case 2:
      if (symbol.primSymElements.length > 0) {
        const coords = feature.geometry.coordinates
        const endLength = symbol.endLength
        let d = endLength
        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          const u = v.unit()
          const segmentLength = v.vLength()
          const mainLength = symbol.mainLength

          let c = c0.add(u.mul(d))
          const mainV = u.mul(mainLength)
          while (d < segmentLength) {
            elements = elements.concat(symbol.primSymElements
              .map((e, i) => createElement(symbol, 'prim', i, feature, e, c, angle)))

            c = c.add(mainV)
            d += mainLength
          }

          d -= segmentLength
        }
      }
  }

  return elements
}

const createElement = (symbol, name, index, parentFeature, element, c, angle) => {
  var geometry
  const rotatedCoords = angle ? element.coords.map(lc => lc.rotate(angle)) : element.coords
  const translatedCoords = rotatedCoords.map(lc => lc.add(c))

  switch (element.type) {
    case 1:
      geometry = {
        type: 'LineString',
        coordinates: translatedCoords
      }
      break
    case 2:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(translatedCoords)
      }
      break
    case 3:
    case 4:
      geometry = {
        type: 'Point',
        coordinates: translatedCoords[0]
      }
      break
  }

  return {
    type: 'Feature',
    properties: {
      element: `${symbol.symNum}-${name}-${index}`,
      parentId: parentFeature.id
    },
    geometry
  }
}

const applyCrs = (featureCollection, crs) => {
  // OCAD uses 1/100 mm of "paper coordinates" as units, we
  // want to convert to meters in real world
  const hundredsMmToMeter = 1 / (100 * 1000)

  coordEach(featureCollection, coord => {
    coord[0] = (coord[0] * hundredsMmToMeter) * crs.scale + crs.easting
    coord[1] = (coord[1] * hundredsMmToMeter) * crs.scale + crs.northing
  })
}

const coordinatesToRings = coordinates => {
  const rings = []
  let currentRing = []
  rings.push(currentRing)
  for (let i = 0; i < coordinates.length; i++) {
    const c = coordinates[i]
    if (c.isFirstHolePoint()) {
      // Copy first coordinate
      currentRing.push(currentRing[0].slice())
      currentRing = []
      rings.push(currentRing)
    }

    currentRing.push(c)
  }

  // Copy first coordinate
  currentRing.push(currentRing[0].slice())

  return rings
}

},{"@turf/meta":13}],32:[function(require,module,exports){
module.exports = function ocadToMapboxGlStyle (ocadFile, options) {
  const usedSymbols = usedSymbolNumbers(ocadFile)
    .map(symNum => ocadFile.symbols.find(s => symNum === s.symNum))
    .filter(s => s)

  const symbolLayers = usedSymbols
    .map(symbol => symbolToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l)

  const elementLayers = Array.prototype.concat.apply([], usedSymbols
    .map(symbol => symbolElementsToMapboxLayer(symbol, ocadFile.colors, options))
    .filter(l => l))

  return symbolLayers.concat(elementLayers)
    .sort((a, b) => b.metadata.sort - a.metadata.sort)
}

const usedSymbolNumbers = ocadFile => ocadFile.objects.reduce((a, f) => {
  const symbolNum = f.sym
  if (!a.idSet.has(symbolNum)) {
    a.symbolNums.push(symbolNum)
    a.idSet.add(symbolNum)
  }

  return a
}, { symbolNums: [], idSet: new Set() }).symbolNums

const symbolToMapboxLayer = (symbol, colors, options) => {
  const id = `symbol-${symbol.symNum}`
  const filter = ['==', ['get', 'sym'], symbol.symNum]

  switch (symbol.type) {
    // case 1:
    //   const element = symbol.elements[0]

    //   switch (element.type) {
    //     case 3:
    //     case 4:
    //       return circleLayer(`symbol-${symbol.symNum}`, options.source, options.sourceLayer, filter, element, colors)
    //   }

    //   break
    case 2:
      if (!symbol.lineWidth) return
      return lineLayer(id, options.source, options.sourceLayer, filter, symbol, colors)
    case 3:
      return areaLayer(id, options.source, options.sourceLayer, filter, symbol, colors)
  }
}

const symbolElementsToMapboxLayer = (symbol, colors, options) => {
  var elements = []
  var name
  switch (symbol.type) {
    case 1:
      elements = symbol.elements
      name = 'element'
      break
    case 2:
      elements = symbol.primSymElements
      name = 'prim'
      break
  }

  return elements
    .map((e, i) => createElementLayer(e, name, i, symbol, colors, options))
    .filter(l => l)
}

const createElementLayer = (element, name, index, symbol, colors, options) => {
  const id = `symbol-${symbol.symNum}-${name}-${index}`
  const filter = ['==', ['get', 'element'], `${symbol.symNum}-${name}-${index}`]

  switch (element.type) {
    case 1:
      return lineLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
    case 2:
      return areaLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
    case 3:
    case 4:
      return circleLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
  }
}

const lineLayer = (id, source, sourceLayer, filter, lineDef, colors) => {
  const baseWidth = (lineDef.lineWidth / 10)
  const baseMainLength = lineDef.mainLength / (10 * baseWidth)
  const baseMainGap = lineDef.mainGap / (10 * baseWidth)
  const colorIndex = lineDef.lineColor !== undefined ? lineDef.lineColor : lineDef.color

  const layer = {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'line',
    filter,
    paint: {
      'line-color': colors[colorIndex].rgb,
      'line-width': expFunc(baseWidth)
    },
    metadata: {
      sort: colors[colorIndex].renderOrder
    }
  }

  if (baseMainLength && baseMainGap) {
    layer.paint['line-dasharray'] = [baseMainLength, baseMainGap]
  }

  return layer
}

const areaLayer = (id, source, sourceLayer, filter, areaDef, colors) => {
  const fillColorIndex = areaDef.fillOn !== undefined
    ? areaDef.fillOn ? areaDef.fillColor : areaDef.colors[0]
    : areaDef.color
  return {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'fill',
    filter,
    paint: {
      'fill-color': colors[fillColorIndex].rgb,
      'fill-opacity': areaDef.fillOn === undefined || areaDef.fillOn
        ? 1
        : (areaDef.hatchLineWidth / areaDef.hatchDist) || 0.5 // TODO: not even close, but emulates hatch/patterns
    },
    metadata: {
      sort: colors[fillColorIndex].renderOrder
    }
  }
}

const circleLayer = (id, source, sourceLayer, filter, element, colors) => {
  const baseRadius = (element.diameter / 2 / 10) || 1
  const layer = {
    id,
    source,
    'source-layer': sourceLayer,
    type: 'circle',
    filter,
    paint: {
      'circle-radius': expFunc(baseRadius)
    },
    metadata: {
      sort: colors[element.color].renderOrder
    }
  }

  const color = colors[element.color].rgb
  if (element.type === 3) {
    const baseWidth = element.lineWidth / 10
    layer.paint['circle-opacity'] = 0
    layer.paint['circle-stroke-color'] = color
    layer.paint['circle-stroke-width'] = expFunc(baseWidth)
  } else {
    layer.paint['circle-color'] = color
  }

  return layer
}

const expFunc = base => ({
  'type': 'exponential',
  'base': 2,
  'stops': [
    [0, base * Math.pow(2, (0 - 15))],
    [24, base * Math.pow(2, (24 - 15))]
  ]
})

},{}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHR1cmYvYmJveC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9AdHVyZi9oZWxwZXJzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0B0dXJmL21ldGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jsb2ItdG8tYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9qNC9kaXN0L3Byb2o0LXNyYy5qcyIsIm5vZGVfbW9kdWxlcy9yZXByb2plY3QvaW5kZXguanMiLCJ2aWV3ZXIvaW5kZXguanMiLCIuLi9zcmMvY215ay10by1yZ2IuanMiLCIuLi9zcmMvaW5kZXguanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvYXJlYS1zeW1ib2wuanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvYmxvY2suanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvZmlsZS1oZWFkZXIuanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvaW5kZXguanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvbGluZS1zeW1ib2wuanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvbHJlY3QuanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvb2JqZWN0LWluZGV4LmpzIiwiLi4vc3JjL29jYWQtcmVhZGVyL3BhcmFtZXRlci1zdHJpbmcuanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvcG9pbnQtc3ltYm9sLmpzIiwiLi4vc3JjL29jYWQtcmVhZGVyL3N0cmluZy1pbmRleC5qcyIsIi4uL3NyYy9vY2FkLXJlYWRlci9zeW1ib2wtZWxlbWVudC5qcyIsIi4uL3NyYy9vY2FkLXJlYWRlci9zeW1ib2wtaW5kZXguanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvc3ltYm9sLmpzIiwiLi4vc3JjL29jYWQtcmVhZGVyL3RkLXBvbHkuanMiLCIuLi9zcmMvb2NhZC1yZWFkZXIvdG9iamVjdC5qcyIsIi4uL3NyYy9vY2FkLXRvLWdlb2pzb24uanMiLCIuLi9zcmMvb2NhZC10by1tYXBib3gtZ2wtc3R5bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3dEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNW1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2o0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIG1ldGFfMSA9IHJlcXVpcmUoXCJAdHVyZi9tZXRhXCIpO1xuLyoqXG4gKiBUYWtlcyBhIHNldCBvZiBmZWF0dXJlcywgY2FsY3VsYXRlcyB0aGUgYmJveCBvZiBhbGwgaW5wdXQgZmVhdHVyZXMsIGFuZCByZXR1cm5zIGEgYm91bmRpbmcgYm94LlxuICpcbiAqIEBuYW1lIGJib3hcbiAqIEBwYXJhbSB7R2VvSlNPTn0gZ2VvanNvbiBhbnkgR2VvSlNPTiBvYmplY3RcbiAqIEByZXR1cm5zIHtCQm94fSBiYm94IGV4dGVudCBpbiBbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0gb3JkZXJcbiAqIEBleGFtcGxlXG4gKiB2YXIgbGluZSA9IHR1cmYubGluZVN0cmluZyhbWy03NCwgNDBdLCBbLTc4LCA0Ml0sIFstODIsIDM1XV0pO1xuICogdmFyIGJib3ggPSB0dXJmLmJib3gobGluZSk7XG4gKiB2YXIgYmJveFBvbHlnb24gPSB0dXJmLmJib3hQb2x5Z29uKGJib3gpO1xuICpcbiAqIC8vYWRkVG9NYXBcbiAqIHZhciBhZGRUb01hcCA9IFtsaW5lLCBiYm94UG9seWdvbl1cbiAqL1xuZnVuY3Rpb24gYmJveChnZW9qc29uKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtJbmZpbml0eSwgSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcbiAgICBtZXRhXzEuY29vcmRFYWNoKGdlb2pzb24sIGZ1bmN0aW9uIChjb29yZCkge1xuICAgICAgICBpZiAocmVzdWx0WzBdID4gY29vcmRbMF0pIHtcbiAgICAgICAgICAgIHJlc3VsdFswXSA9IGNvb3JkWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHRbMV0gPiBjb29yZFsxXSkge1xuICAgICAgICAgICAgcmVzdWx0WzFdID0gY29vcmRbMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdFsyXSA8IGNvb3JkWzBdKSB7XG4gICAgICAgICAgICByZXN1bHRbMl0gPSBjb29yZFswXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0WzNdIDwgY29vcmRbMV0pIHtcbiAgICAgICAgICAgIHJlc3VsdFszXSA9IGNvb3JkWzFdO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGJib3g7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogQG1vZHVsZSBoZWxwZXJzXG4gKi9cbi8qKlxuICogRWFydGggUmFkaXVzIHVzZWQgd2l0aCB0aGUgSGFydmVzaW5lIGZvcm11bGEgYW5kIGFwcHJveGltYXRlcyB1c2luZyBhIHNwaGVyaWNhbCAobm9uLWVsbGlwc29pZCkgRWFydGguXG4gKlxuICogQG1lbWJlcm9mIGhlbHBlcnNcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmV4cG9ydHMuZWFydGhSYWRpdXMgPSA2MzcxMDA4Ljg7XG4vKipcbiAqIFVuaXQgb2YgbWVhc3VyZW1lbnQgZmFjdG9ycyB1c2luZyBhIHNwaGVyaWNhbCAobm9uLWVsbGlwc29pZCkgZWFydGggcmFkaXVzLlxuICpcbiAqIEBtZW1iZXJvZiBoZWxwZXJzXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnRzLmZhY3RvcnMgPSB7XG4gICAgY2VudGltZXRlcnM6IGV4cG9ydHMuZWFydGhSYWRpdXMgKiAxMDAsXG4gICAgY2VudGltZXRyZXM6IGV4cG9ydHMuZWFydGhSYWRpdXMgKiAxMDAsXG4gICAgZGVncmVlczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAvIDExMTMyNSxcbiAgICBmZWV0OiBleHBvcnRzLmVhcnRoUmFkaXVzICogMy4yODA4NCxcbiAgICBpbmNoZXM6IGV4cG9ydHMuZWFydGhSYWRpdXMgKiAzOS4zNzAsXG4gICAga2lsb21ldGVyczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAvIDEwMDAsXG4gICAga2lsb21ldHJlczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAvIDEwMDAsXG4gICAgbWV0ZXJzOiBleHBvcnRzLmVhcnRoUmFkaXVzLFxuICAgIG1ldHJlczogZXhwb3J0cy5lYXJ0aFJhZGl1cyxcbiAgICBtaWxlczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAvIDE2MDkuMzQ0LFxuICAgIG1pbGxpbWV0ZXJzOiBleHBvcnRzLmVhcnRoUmFkaXVzICogMTAwMCxcbiAgICBtaWxsaW1ldHJlczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAqIDEwMDAsXG4gICAgbmF1dGljYWxtaWxlczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAvIDE4NTIsXG4gICAgcmFkaWFuczogMSxcbiAgICB5YXJkczogZXhwb3J0cy5lYXJ0aFJhZGl1cyAvIDEuMDkzNixcbn07XG4vKipcbiAqIFVuaXRzIG9mIG1lYXN1cmVtZW50IGZhY3RvcnMgYmFzZWQgb24gMSBtZXRlci5cbiAqXG4gKiBAbWVtYmVyb2YgaGVscGVyc1xuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0cy51bml0c0ZhY3RvcnMgPSB7XG4gICAgY2VudGltZXRlcnM6IDEwMCxcbiAgICBjZW50aW1ldHJlczogMTAwLFxuICAgIGRlZ3JlZXM6IDEgLyAxMTEzMjUsXG4gICAgZmVldDogMy4yODA4NCxcbiAgICBpbmNoZXM6IDM5LjM3MCxcbiAgICBraWxvbWV0ZXJzOiAxIC8gMTAwMCxcbiAgICBraWxvbWV0cmVzOiAxIC8gMTAwMCxcbiAgICBtZXRlcnM6IDEsXG4gICAgbWV0cmVzOiAxLFxuICAgIG1pbGVzOiAxIC8gMTYwOS4zNDQsXG4gICAgbWlsbGltZXRlcnM6IDEwMDAsXG4gICAgbWlsbGltZXRyZXM6IDEwMDAsXG4gICAgbmF1dGljYWxtaWxlczogMSAvIDE4NTIsXG4gICAgcmFkaWFuczogMSAvIGV4cG9ydHMuZWFydGhSYWRpdXMsXG4gICAgeWFyZHM6IDEgLyAxLjA5MzYsXG59O1xuLyoqXG4gKiBBcmVhIG9mIG1lYXN1cmVtZW50IGZhY3RvcnMgYmFzZWQgb24gMSBzcXVhcmUgbWV0ZXIuXG4gKlxuICogQG1lbWJlcm9mIGhlbHBlcnNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMuYXJlYUZhY3RvcnMgPSB7XG4gICAgYWNyZXM6IDAuMDAwMjQ3MTA1LFxuICAgIGNlbnRpbWV0ZXJzOiAxMDAwMCxcbiAgICBjZW50aW1ldHJlczogMTAwMDAsXG4gICAgZmVldDogMTAuNzYzOTEwNDE3LFxuICAgIGluY2hlczogMTU1MC4wMDMxMDAwMDYsXG4gICAga2lsb21ldGVyczogMC4wMDAwMDEsXG4gICAga2lsb21ldHJlczogMC4wMDAwMDEsXG4gICAgbWV0ZXJzOiAxLFxuICAgIG1ldHJlczogMSxcbiAgICBtaWxlczogMy44NmUtNyxcbiAgICBtaWxsaW1ldGVyczogMTAwMDAwMCxcbiAgICBtaWxsaW1ldHJlczogMTAwMDAwMCxcbiAgICB5YXJkczogMS4xOTU5OTAwNDYsXG59O1xuLyoqXG4gKiBXcmFwcyBhIEdlb0pTT04ge0BsaW5rIEdlb21ldHJ5fSBpbiBhIEdlb0pTT04ge0BsaW5rIEZlYXR1cmV9LlxuICpcbiAqIEBuYW1lIGZlYXR1cmVcbiAqIEBwYXJhbSB7R2VvbWV0cnl9IGdlb21ldHJ5IGlucHV0IGdlb21ldHJ5XG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXM9e31dIGFuIE9iamVjdCBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYWRkIGFzIHByb3BlcnRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9uYWwgUGFyYW1ldGVyc1xuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBbb3B0aW9ucy5iYm94XSBCb3VuZGluZyBCb3ggQXJyYXkgW3dlc3QsIHNvdXRoLCBlYXN0LCBub3J0aF0gYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IFtvcHRpb25zLmlkXSBJZGVudGlmaWVyIGFzc29jaWF0ZWQgd2l0aCB0aGUgRmVhdHVyZVxuICogQHJldHVybnMge0ZlYXR1cmV9IGEgR2VvSlNPTiBGZWF0dXJlXG4gKiBAZXhhbXBsZVxuICogdmFyIGdlb21ldHJ5ID0ge1xuICogICBcInR5cGVcIjogXCJQb2ludFwiLFxuICogICBcImNvb3JkaW5hdGVzXCI6IFsxMTAsIDUwXVxuICogfTtcbiAqXG4gKiB2YXIgZmVhdHVyZSA9IHR1cmYuZmVhdHVyZShnZW9tZXRyeSk7XG4gKlxuICogLy89ZmVhdHVyZVxuICovXG5mdW5jdGlvbiBmZWF0dXJlKGdlb20sIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHZhciBmZWF0ID0geyB0eXBlOiBcIkZlYXR1cmVcIiB9O1xuICAgIGlmIChvcHRpb25zLmlkID09PSAwIHx8IG9wdGlvbnMuaWQpIHtcbiAgICAgICAgZmVhdC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmJib3gpIHtcbiAgICAgICAgZmVhdC5iYm94ID0gb3B0aW9ucy5iYm94O1xuICAgIH1cbiAgICBmZWF0LnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IHt9O1xuICAgIGZlYXQuZ2VvbWV0cnkgPSBnZW9tO1xuICAgIHJldHVybiBmZWF0O1xufVxuZXhwb3J0cy5mZWF0dXJlID0gZmVhdHVyZTtcbi8qKlxuICogQ3JlYXRlcyBhIEdlb0pTT04ge0BsaW5rIEdlb21ldHJ5fSBmcm9tIGEgR2VvbWV0cnkgc3RyaW5nIHR5cGUgJiBjb29yZGluYXRlcy5cbiAqIEZvciBHZW9tZXRyeUNvbGxlY3Rpb24gdHlwZSB1c2UgYGhlbHBlcnMuZ2VvbWV0cnlDb2xsZWN0aW9uYFxuICpcbiAqIEBuYW1lIGdlb21ldHJ5XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBHZW9tZXRyeSBUeXBlXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGNvb3JkaW5hdGVzIENvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbmFsIFBhcmFtZXRlcnNcbiAqIEByZXR1cm5zIHtHZW9tZXRyeX0gYSBHZW9KU09OIEdlb21ldHJ5XG4gKiBAZXhhbXBsZVxuICogdmFyIHR5cGUgPSBcIlBvaW50XCI7XG4gKiB2YXIgY29vcmRpbmF0ZXMgPSBbMTEwLCA1MF07XG4gKiB2YXIgZ2VvbWV0cnkgPSB0dXJmLmdlb21ldHJ5KHR5cGUsIGNvb3JkaW5hdGVzKTtcbiAqIC8vID0+IGdlb21ldHJ5XG4gKi9cbmZ1bmN0aW9uIGdlb21ldHJ5KHR5cGUsIGNvb3JkaW5hdGVzLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlBvaW50XCI6IHJldHVybiBwb2ludChjb29yZGluYXRlcykuZ2VvbWV0cnk7XG4gICAgICAgIGNhc2UgXCJMaW5lU3RyaW5nXCI6IHJldHVybiBsaW5lU3RyaW5nKGNvb3JkaW5hdGVzKS5nZW9tZXRyeTtcbiAgICAgICAgY2FzZSBcIlBvbHlnb25cIjogcmV0dXJuIHBvbHlnb24oY29vcmRpbmF0ZXMpLmdlb21ldHJ5O1xuICAgICAgICBjYXNlIFwiTXVsdGlQb2ludFwiOiByZXR1cm4gbXVsdGlQb2ludChjb29yZGluYXRlcykuZ2VvbWV0cnk7XG4gICAgICAgIGNhc2UgXCJNdWx0aUxpbmVTdHJpbmdcIjogcmV0dXJuIG11bHRpTGluZVN0cmluZyhjb29yZGluYXRlcykuZ2VvbWV0cnk7XG4gICAgICAgIGNhc2UgXCJNdWx0aVBvbHlnb25cIjogcmV0dXJuIG11bHRpUG9seWdvbihjb29yZGluYXRlcykuZ2VvbWV0cnk7XG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcih0eXBlICsgXCIgaXMgaW52YWxpZFwiKTtcbiAgICB9XG59XG5leHBvcnRzLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4vKipcbiAqIENyZWF0ZXMgYSB7QGxpbmsgUG9pbnR9IHtAbGluayBGZWF0dXJlfSBmcm9tIGEgUG9zaXRpb24uXG4gKlxuICogQG5hbWUgcG9pbnRcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gY29vcmRpbmF0ZXMgbG9uZ2l0dWRlLCBsYXRpdHVkZSBwb3NpdGlvbiAoZWFjaCBpbiBkZWNpbWFsIGRlZ3JlZXMpXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXM9e31dIGFuIE9iamVjdCBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYWRkIGFzIHByb3BlcnRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9uYWwgUGFyYW1ldGVyc1xuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBbb3B0aW9ucy5iYm94XSBCb3VuZGluZyBCb3ggQXJyYXkgW3dlc3QsIHNvdXRoLCBlYXN0LCBub3J0aF0gYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IFtvcHRpb25zLmlkXSBJZGVudGlmaWVyIGFzc29jaWF0ZWQgd2l0aCB0aGUgRmVhdHVyZVxuICogQHJldHVybnMge0ZlYXR1cmU8UG9pbnQ+fSBhIFBvaW50IGZlYXR1cmVcbiAqIEBleGFtcGxlXG4gKiB2YXIgcG9pbnQgPSB0dXJmLnBvaW50KFstNzUuMzQzLCAzOS45ODRdKTtcbiAqXG4gKiAvLz1wb2ludFxuICovXG5mdW5jdGlvbiBwb2ludChjb29yZGluYXRlcywgcHJvcGVydGllcywgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgdmFyIGdlb20gPSB7XG4gICAgICAgIHR5cGU6IFwiUG9pbnRcIixcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzLFxuICAgIH07XG4gICAgcmV0dXJuIGZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG59XG5leHBvcnRzLnBvaW50ID0gcG9pbnQ7XG4vKipcbiAqIENyZWF0ZXMgYSB7QGxpbmsgUG9pbnR9IHtAbGluayBGZWF0dXJlQ29sbGVjdGlvbn0gZnJvbSBhbiBBcnJheSBvZiBQb2ludCBjb29yZGluYXRlcy5cbiAqXG4gKiBAbmFtZSBwb2ludHNcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8bnVtYmVyPj59IGNvb3JkaW5hdGVzIGFuIGFycmF5IG9mIFBvaW50c1xuICogQHBhcmFtIHtPYmplY3R9IFtwcm9wZXJ0aWVzPXt9XSBUcmFuc2xhdGUgdGhlc2UgcHJvcGVydGllcyB0byBlYWNoIEZlYXR1cmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9uYWwgUGFyYW1ldGVyc1xuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBbb3B0aW9ucy5iYm94XSBCb3VuZGluZyBCb3ggQXJyYXkgW3dlc3QsIHNvdXRoLCBlYXN0LCBub3J0aF1cbiAqIGFzc29jaWF0ZWQgd2l0aCB0aGUgRmVhdHVyZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlQ29sbGVjdGlvblxuICogQHJldHVybnMge0ZlYXR1cmVDb2xsZWN0aW9uPFBvaW50Pn0gUG9pbnQgRmVhdHVyZVxuICogQGV4YW1wbGVcbiAqIHZhciBwb2ludHMgPSB0dXJmLnBvaW50cyhbXG4gKiAgIFstNzUsIDM5XSxcbiAqICAgWy04MCwgNDVdLFxuICogICBbLTc4LCA1MF1cbiAqIF0pO1xuICpcbiAqIC8vPXBvaW50c1xuICovXG5mdW5jdGlvbiBwb2ludHMoY29vcmRpbmF0ZXMsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBmZWF0dXJlQ29sbGVjdGlvbihjb29yZGluYXRlcy5tYXAoZnVuY3Rpb24gKGNvb3Jkcykge1xuICAgICAgICByZXR1cm4gcG9pbnQoY29vcmRzLCBwcm9wZXJ0aWVzKTtcbiAgICB9KSwgb3B0aW9ucyk7XG59XG5leHBvcnRzLnBvaW50cyA9IHBvaW50cztcbi8qKlxuICogQ3JlYXRlcyBhIHtAbGluayBQb2x5Z29ufSB7QGxpbmsgRmVhdHVyZX0gZnJvbSBhbiBBcnJheSBvZiBMaW5lYXJSaW5ncy5cbiAqXG4gKiBAbmFtZSBwb2x5Z29uXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PEFycmF5PG51bWJlcj4+Pn0gY29vcmRpbmF0ZXMgYW4gYXJyYXkgb2YgTGluZWFyUmluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXSBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcmV0dXJucyB7RmVhdHVyZTxQb2x5Z29uPn0gUG9seWdvbiBGZWF0dXJlXG4gKiBAZXhhbXBsZVxuICogdmFyIHBvbHlnb24gPSB0dXJmLnBvbHlnb24oW1tbLTUsIDUyXSwgWy00LCA1Nl0sIFstMiwgNTFdLCBbLTcsIDU0XSwgWy01LCA1Ml1dXSwgeyBuYW1lOiAncG9seTEnIH0pO1xuICpcbiAqIC8vPXBvbHlnb25cbiAqL1xuZnVuY3Rpb24gcG9seWdvbihjb29yZGluYXRlcywgcHJvcGVydGllcywgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgZm9yICh2YXIgX2kgPSAwLCBjb29yZGluYXRlc18xID0gY29vcmRpbmF0ZXM7IF9pIDwgY29vcmRpbmF0ZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHJpbmcgPSBjb29yZGluYXRlc18xW19pXTtcbiAgICAgICAgaWYgKHJpbmcubGVuZ3RoIDwgNCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWFjaCBMaW5lYXJSaW5nIG9mIGEgUG9seWdvbiBtdXN0IGhhdmUgNCBvciBtb3JlIFBvc2l0aW9ucy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByaW5nW3JpbmcubGVuZ3RoIC0gMV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGZpcnN0IHBvaW50IG9mIFBvbHlnb24gY29udGFpbnMgdHdvIG51bWJlcnNcbiAgICAgICAgICAgIGlmIChyaW5nW3JpbmcubGVuZ3RoIC0gMV1bal0gIT09IHJpbmdbMF1bal0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBhbmQgbGFzdCBQb3NpdGlvbiBhcmUgbm90IGVxdWl2YWxlbnQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBnZW9tID0ge1xuICAgICAgICB0eXBlOiBcIlBvbHlnb25cIixcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzLFxuICAgIH07XG4gICAgcmV0dXJuIGZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG59XG5leHBvcnRzLnBvbHlnb24gPSBwb2x5Z29uO1xuLyoqXG4gKiBDcmVhdGVzIGEge0BsaW5rIFBvbHlnb259IHtAbGluayBGZWF0dXJlQ29sbGVjdGlvbn0gZnJvbSBhbiBBcnJheSBvZiBQb2x5Z29uIGNvb3JkaW5hdGVzLlxuICpcbiAqIEBuYW1lIHBvbHlnb25zXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PEFycmF5PEFycmF5PG51bWJlcj4+Pj59IGNvb3JkaW5hdGVzIGFuIGFycmF5IG9mIFBvbHlnb24gY29vcmRpbmF0ZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXSBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlQ29sbGVjdGlvblxuICogQHJldHVybnMge0ZlYXR1cmVDb2xsZWN0aW9uPFBvbHlnb24+fSBQb2x5Z29uIEZlYXR1cmVDb2xsZWN0aW9uXG4gKiBAZXhhbXBsZVxuICogdmFyIHBvbHlnb25zID0gdHVyZi5wb2x5Z29ucyhbXG4gKiAgIFtbWy01LCA1Ml0sIFstNCwgNTZdLCBbLTIsIDUxXSwgWy03LCA1NF0sIFstNSwgNTJdXV0sXG4gKiAgIFtbWy0xNSwgNDJdLCBbLTE0LCA0Nl0sIFstMTIsIDQxXSwgWy0xNywgNDRdLCBbLTE1LCA0Ml1dXSxcbiAqIF0pO1xuICpcbiAqIC8vPXBvbHlnb25zXG4gKi9cbmZ1bmN0aW9uIHBvbHlnb25zKGNvb3JkaW5hdGVzLCBwcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICByZXR1cm4gZmVhdHVyZUNvbGxlY3Rpb24oY29vcmRpbmF0ZXMubWFwKGZ1bmN0aW9uIChjb29yZHMpIHtcbiAgICAgICAgcmV0dXJuIHBvbHlnb24oY29vcmRzLCBwcm9wZXJ0aWVzKTtcbiAgICB9KSwgb3B0aW9ucyk7XG59XG5leHBvcnRzLnBvbHlnb25zID0gcG9seWdvbnM7XG4vKipcbiAqIENyZWF0ZXMgYSB7QGxpbmsgTGluZVN0cmluZ30ge0BsaW5rIEZlYXR1cmV9IGZyb20gYW4gQXJyYXkgb2YgUG9zaXRpb25zLlxuICpcbiAqIEBuYW1lIGxpbmVTdHJpbmdcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8bnVtYmVyPj59IGNvb3JkaW5hdGVzIGFuIGFycmF5IG9mIFBvc2l0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IFtwcm9wZXJ0aWVzPXt9XSBhbiBPYmplY3Qgb2Yga2V5LXZhbHVlIHBhaXJzIHRvIGFkZCBhcyBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbmFsIFBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gW29wdGlvbnMuYmJveF0gQm91bmRpbmcgQm94IEFycmF5IFt3ZXN0LCBzb3V0aCwgZWFzdCwgbm9ydGhdIGFzc29jaWF0ZWQgd2l0aCB0aGUgRmVhdHVyZVxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBbb3B0aW9ucy5pZF0gSWRlbnRpZmllciBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEByZXR1cm5zIHtGZWF0dXJlPExpbmVTdHJpbmc+fSBMaW5lU3RyaW5nIEZlYXR1cmVcbiAqIEBleGFtcGxlXG4gKiB2YXIgbGluZXN0cmluZzEgPSB0dXJmLmxpbmVTdHJpbmcoW1stMjQsIDYzXSwgWy0yMywgNjBdLCBbLTI1LCA2NV0sIFstMjAsIDY5XV0sIHtuYW1lOiAnbGluZSAxJ30pO1xuICogdmFyIGxpbmVzdHJpbmcyID0gdHVyZi5saW5lU3RyaW5nKFtbLTE0LCA0M10sIFstMTMsIDQwXSwgWy0xNSwgNDVdLCBbLTEwLCA0OV1dLCB7bmFtZTogJ2xpbmUgMid9KTtcbiAqXG4gKiAvLz1saW5lc3RyaW5nMVxuICogLy89bGluZXN0cmluZzJcbiAqL1xuZnVuY3Rpb24gbGluZVN0cmluZyhjb29yZGluYXRlcywgcHJvcGVydGllcywgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29vcmRpbmF0ZXMgbXVzdCBiZSBhbiBhcnJheSBvZiB0d28gb3IgbW9yZSBwb3NpdGlvbnNcIik7XG4gICAgfVxuICAgIHZhciBnZW9tID0ge1xuICAgICAgICB0eXBlOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzLFxuICAgIH07XG4gICAgcmV0dXJuIGZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG59XG5leHBvcnRzLmxpbmVTdHJpbmcgPSBsaW5lU3RyaW5nO1xuLyoqXG4gKiBDcmVhdGVzIGEge0BsaW5rIExpbmVTdHJpbmd9IHtAbGluayBGZWF0dXJlQ29sbGVjdGlvbn0gZnJvbSBhbiBBcnJheSBvZiBMaW5lU3RyaW5nIGNvb3JkaW5hdGVzLlxuICpcbiAqIEBuYW1lIGxpbmVTdHJpbmdzXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PEFycmF5PG51bWJlcj4+Pn0gY29vcmRpbmF0ZXMgYW4gYXJyYXkgb2YgTGluZWFyUmluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXVxuICogYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlQ29sbGVjdGlvblxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBbb3B0aW9ucy5pZF0gSWRlbnRpZmllciBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVDb2xsZWN0aW9uXG4gKiBAcmV0dXJucyB7RmVhdHVyZUNvbGxlY3Rpb248TGluZVN0cmluZz59IExpbmVTdHJpbmcgRmVhdHVyZUNvbGxlY3Rpb25cbiAqIEBleGFtcGxlXG4gKiB2YXIgbGluZXN0cmluZ3MgPSB0dXJmLmxpbmVTdHJpbmdzKFtcbiAqICAgW1stMjQsIDYzXSwgWy0yMywgNjBdLCBbLTI1LCA2NV0sIFstMjAsIDY5XV0sXG4gKiAgIFtbLTE0LCA0M10sIFstMTMsIDQwXSwgWy0xNSwgNDVdLCBbLTEwLCA0OV1dXG4gKiBdKTtcbiAqXG4gKiAvLz1saW5lc3RyaW5nc1xuICovXG5mdW5jdGlvbiBsaW5lU3RyaW5ncyhjb29yZGluYXRlcywgcHJvcGVydGllcywgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgcmV0dXJuIGZlYXR1cmVDb2xsZWN0aW9uKGNvb3JkaW5hdGVzLm1hcChmdW5jdGlvbiAoY29vcmRzKSB7XG4gICAgICAgIHJldHVybiBsaW5lU3RyaW5nKGNvb3JkcywgcHJvcGVydGllcyk7XG4gICAgfSksIG9wdGlvbnMpO1xufVxuZXhwb3J0cy5saW5lU3RyaW5ncyA9IGxpbmVTdHJpbmdzO1xuLyoqXG4gKiBUYWtlcyBvbmUgb3IgbW9yZSB7QGxpbmsgRmVhdHVyZXxGZWF0dXJlc30gYW5kIGNyZWF0ZXMgYSB7QGxpbmsgRmVhdHVyZUNvbGxlY3Rpb259LlxuICpcbiAqIEBuYW1lIGZlYXR1cmVDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0ZlYXR1cmVbXX0gZmVhdHVyZXMgaW5wdXQgZmVhdHVyZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9uYWwgUGFyYW1ldGVyc1xuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBbb3B0aW9ucy5iYm94XSBCb3VuZGluZyBCb3ggQXJyYXkgW3dlc3QsIHNvdXRoLCBlYXN0LCBub3J0aF0gYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IFtvcHRpb25zLmlkXSBJZGVudGlmaWVyIGFzc29jaWF0ZWQgd2l0aCB0aGUgRmVhdHVyZVxuICogQHJldHVybnMge0ZlYXR1cmVDb2xsZWN0aW9ufSBGZWF0dXJlQ29sbGVjdGlvbiBvZiBGZWF0dXJlc1xuICogQGV4YW1wbGVcbiAqIHZhciBsb2NhdGlvbkEgPSB0dXJmLnBvaW50KFstNzUuMzQzLCAzOS45ODRdLCB7bmFtZTogJ0xvY2F0aW9uIEEnfSk7XG4gKiB2YXIgbG9jYXRpb25CID0gdHVyZi5wb2ludChbLTc1LjgzMywgMzkuMjg0XSwge25hbWU6ICdMb2NhdGlvbiBCJ30pO1xuICogdmFyIGxvY2F0aW9uQyA9IHR1cmYucG9pbnQoWy03NS41MzQsIDM5LjEyM10sIHtuYW1lOiAnTG9jYXRpb24gQyd9KTtcbiAqXG4gKiB2YXIgY29sbGVjdGlvbiA9IHR1cmYuZmVhdHVyZUNvbGxlY3Rpb24oW1xuICogICBsb2NhdGlvbkEsXG4gKiAgIGxvY2F0aW9uQixcbiAqICAgbG9jYXRpb25DXG4gKiBdKTtcbiAqXG4gKiAvLz1jb2xsZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVzLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgZmMgPSB7IHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIiB9O1xuICAgIGlmIChvcHRpb25zLmlkKSB7XG4gICAgICAgIGZjLmlkID0gb3B0aW9ucy5pZDtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYmJveCkge1xuICAgICAgICBmYy5iYm94ID0gb3B0aW9ucy5iYm94O1xuICAgIH1cbiAgICBmYy5mZWF0dXJlcyA9IGZlYXR1cmVzO1xuICAgIHJldHVybiBmYztcbn1cbmV4cG9ydHMuZmVhdHVyZUNvbGxlY3Rpb24gPSBmZWF0dXJlQ29sbGVjdGlvbjtcbi8qKlxuICogQ3JlYXRlcyBhIHtAbGluayBGZWF0dXJlPE11bHRpTGluZVN0cmluZz59IGJhc2VkIG9uIGFcbiAqIGNvb3JkaW5hdGUgYXJyYXkuIFByb3BlcnRpZXMgY2FuIGJlIGFkZGVkIG9wdGlvbmFsbHkuXG4gKlxuICogQG5hbWUgbXVsdGlMaW5lU3RyaW5nXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PEFycmF5PG51bWJlcj4+Pn0gY29vcmRpbmF0ZXMgYW4gYXJyYXkgb2YgTGluZVN0cmluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXSBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcmV0dXJucyB7RmVhdHVyZTxNdWx0aUxpbmVTdHJpbmc+fSBhIE11bHRpTGluZVN0cmluZyBmZWF0dXJlXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgbm8gY29vcmRpbmF0ZXMgYXJlIHBhc3NlZFxuICogQGV4YW1wbGVcbiAqIHZhciBtdWx0aUxpbmUgPSB0dXJmLm11bHRpTGluZVN0cmluZyhbW1swLDBdLFsxMCwxMF1dXSk7XG4gKlxuICogLy89bXVsdGlMaW5lXG4gKi9cbmZ1bmN0aW9uIG11bHRpTGluZVN0cmluZyhjb29yZGluYXRlcywgcHJvcGVydGllcywgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgdmFyIGdlb20gPSB7XG4gICAgICAgIHR5cGU6IFwiTXVsdGlMaW5lU3RyaW5nXCIsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlcyxcbiAgICB9O1xuICAgIHJldHVybiBmZWF0dXJlKGdlb20sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xufVxuZXhwb3J0cy5tdWx0aUxpbmVTdHJpbmcgPSBtdWx0aUxpbmVTdHJpbmc7XG4vKipcbiAqIENyZWF0ZXMgYSB7QGxpbmsgRmVhdHVyZTxNdWx0aVBvaW50Pn0gYmFzZWQgb24gYVxuICogY29vcmRpbmF0ZSBhcnJheS4gUHJvcGVydGllcyBjYW4gYmUgYWRkZWQgb3B0aW9uYWxseS5cbiAqXG4gKiBAbmFtZSBtdWx0aVBvaW50XG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PG51bWJlcj4+fSBjb29yZGluYXRlcyBhbiBhcnJheSBvZiBQb3NpdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXSBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcmV0dXJucyB7RmVhdHVyZTxNdWx0aVBvaW50Pn0gYSBNdWx0aVBvaW50IGZlYXR1cmVcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBubyBjb29yZGluYXRlcyBhcmUgcGFzc2VkXG4gKiBAZXhhbXBsZVxuICogdmFyIG11bHRpUHQgPSB0dXJmLm11bHRpUG9pbnQoW1swLDBdLFsxMCwxMF1dKTtcbiAqXG4gKiAvLz1tdWx0aVB0XG4gKi9cbmZ1bmN0aW9uIG11bHRpUG9pbnQoY29vcmRpbmF0ZXMsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHZhciBnZW9tID0ge1xuICAgICAgICB0eXBlOiBcIk11bHRpUG9pbnRcIixcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzLFxuICAgIH07XG4gICAgcmV0dXJuIGZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG59XG5leHBvcnRzLm11bHRpUG9pbnQgPSBtdWx0aVBvaW50O1xuLyoqXG4gKiBDcmVhdGVzIGEge0BsaW5rIEZlYXR1cmU8TXVsdGlQb2x5Z29uPn0gYmFzZWQgb24gYVxuICogY29vcmRpbmF0ZSBhcnJheS4gUHJvcGVydGllcyBjYW4gYmUgYWRkZWQgb3B0aW9uYWxseS5cbiAqXG4gKiBAbmFtZSBtdWx0aVBvbHlnb25cbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8QXJyYXk8QXJyYXk8bnVtYmVyPj4+Pn0gY29vcmRpbmF0ZXMgYW4gYXJyYXkgb2YgUG9seWdvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXSBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcmV0dXJucyB7RmVhdHVyZTxNdWx0aVBvbHlnb24+fSBhIG11bHRpcG9seWdvbiBmZWF0dXJlXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgbm8gY29vcmRpbmF0ZXMgYXJlIHBhc3NlZFxuICogQGV4YW1wbGVcbiAqIHZhciBtdWx0aVBvbHkgPSB0dXJmLm11bHRpUG9seWdvbihbW1tbMCwwXSxbMCwxMF0sWzEwLDEwXSxbMTAsMF0sWzAsMF1dXV0pO1xuICpcbiAqIC8vPW11bHRpUG9seVxuICpcbiAqL1xuZnVuY3Rpb24gbXVsdGlQb2x5Z29uKGNvb3JkaW5hdGVzLCBwcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgZ2VvbSA9IHtcbiAgICAgICAgdHlwZTogXCJNdWx0aVBvbHlnb25cIixcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzLFxuICAgIH07XG4gICAgcmV0dXJuIGZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG59XG5leHBvcnRzLm11bHRpUG9seWdvbiA9IG11bHRpUG9seWdvbjtcbi8qKlxuICogQ3JlYXRlcyBhIHtAbGluayBGZWF0dXJlPEdlb21ldHJ5Q29sbGVjdGlvbj59IGJhc2VkIG9uIGFcbiAqIGNvb3JkaW5hdGUgYXJyYXkuIFByb3BlcnRpZXMgY2FuIGJlIGFkZGVkIG9wdGlvbmFsbHkuXG4gKlxuICogQG5hbWUgZ2VvbWV0cnlDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5PEdlb21ldHJ5Pn0gZ2VvbWV0cmllcyBhbiBhcnJheSBvZiBHZW9KU09OIEdlb21ldHJpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllcz17fV0gYW4gT2JqZWN0IG9mIGtleS12YWx1ZSBwYWlycyB0byBhZGQgYXMgcHJvcGVydGllc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IFtvcHRpb25zLmJib3hdIEJvdW5kaW5nIEJveCBBcnJheSBbd2VzdCwgc291dGgsIGVhc3QsIG5vcnRoXSBhc3NvY2lhdGVkIHdpdGggdGhlIEZlYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW29wdGlvbnMuaWRdIElkZW50aWZpZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBGZWF0dXJlXG4gKiBAcmV0dXJucyB7RmVhdHVyZTxHZW9tZXRyeUNvbGxlY3Rpb24+fSBhIEdlb0pTT04gR2VvbWV0cnlDb2xsZWN0aW9uIEZlYXR1cmVcbiAqIEBleGFtcGxlXG4gKiB2YXIgcHQgPSB0dXJmLmdlb21ldHJ5KFwiUG9pbnRcIiwgWzEwMCwgMF0pO1xuICogdmFyIGxpbmUgPSB0dXJmLmdlb21ldHJ5KFwiTGluZVN0cmluZ1wiLCBbWzEwMSwgMF0sIFsxMDIsIDFdXSk7XG4gKiB2YXIgY29sbGVjdGlvbiA9IHR1cmYuZ2VvbWV0cnlDb2xsZWN0aW9uKFtwdCwgbGluZV0pO1xuICpcbiAqIC8vID0+IGNvbGxlY3Rpb25cbiAqL1xuZnVuY3Rpb24gZ2VvbWV0cnlDb2xsZWN0aW9uKGdlb21ldHJpZXMsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHZhciBnZW9tID0ge1xuICAgICAgICB0eXBlOiBcIkdlb21ldHJ5Q29sbGVjdGlvblwiLFxuICAgICAgICBnZW9tZXRyaWVzOiBnZW9tZXRyaWVzLFxuICAgIH07XG4gICAgcmV0dXJuIGZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG59XG5leHBvcnRzLmdlb21ldHJ5Q29sbGVjdGlvbiA9IGdlb21ldHJ5Q29sbGVjdGlvbjtcbi8qKlxuICogUm91bmQgbnVtYmVyIHRvIHByZWNpc2lvblxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gTnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gW3ByZWNpc2lvbj0wXSBQcmVjaXNpb25cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJvdW5kZWQgbnVtYmVyXG4gKiBAZXhhbXBsZVxuICogdHVyZi5yb3VuZCgxMjAuNDMyMSlcbiAqIC8vPTEyMFxuICpcbiAqIHR1cmYucm91bmQoMTIwLjQzMjEsIDIpXG4gKiAvLz0xMjAuNDNcbiAqL1xuZnVuY3Rpb24gcm91bmQobnVtLCBwcmVjaXNpb24pIHtcbiAgICBpZiAocHJlY2lzaW9uID09PSB2b2lkIDApIHsgcHJlY2lzaW9uID0gMDsgfVxuICAgIGlmIChwcmVjaXNpb24gJiYgIShwcmVjaXNpb24gPj0gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicHJlY2lzaW9uIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXJcIik7XG4gICAgfVxuICAgIHZhciBtdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCAwKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChudW0gKiBtdWx0aXBsaWVyKSAvIG11bHRpcGxpZXI7XG59XG5leHBvcnRzLnJvdW5kID0gcm91bmQ7XG4vKipcbiAqIENvbnZlcnQgYSBkaXN0YW5jZSBtZWFzdXJlbWVudCAoYXNzdW1pbmcgYSBzcGhlcmljYWwgRWFydGgpIGZyb20gcmFkaWFucyB0byBhIG1vcmUgZnJpZW5kbHkgdW5pdC5cbiAqIFZhbGlkIHVuaXRzOiBtaWxlcywgbmF1dGljYWxtaWxlcywgaW5jaGVzLCB5YXJkcywgbWV0ZXJzLCBtZXRyZXMsIGtpbG9tZXRlcnMsIGNlbnRpbWV0ZXJzLCBmZWV0XG4gKlxuICogQG5hbWUgcmFkaWFuc1RvTGVuZ3RoXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyBpbiByYWRpYW5zIGFjcm9zcyB0aGUgc3BoZXJlXG4gKiBAcGFyYW0ge3N0cmluZ30gW3VuaXRzPVwia2lsb21ldGVyc1wiXSBjYW4gYmUgZGVncmVlcywgcmFkaWFucywgbWlsZXMsIG9yIGtpbG9tZXRlcnMgaW5jaGVzLCB5YXJkcywgbWV0cmVzLFxuICogbWV0ZXJzLCBraWxvbWV0cmVzLCBraWxvbWV0ZXJzLlxuICogQHJldHVybnMge251bWJlcn0gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gcmFkaWFuc1RvTGVuZ3RoKHJhZGlhbnMsIHVuaXRzKSB7XG4gICAgaWYgKHVuaXRzID09PSB2b2lkIDApIHsgdW5pdHMgPSBcImtpbG9tZXRlcnNcIjsgfVxuICAgIHZhciBmYWN0b3IgPSBleHBvcnRzLmZhY3RvcnNbdW5pdHNdO1xuICAgIGlmICghZmFjdG9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih1bml0cyArIFwiIHVuaXRzIGlzIGludmFsaWRcIik7XG4gICAgfVxuICAgIHJldHVybiByYWRpYW5zICogZmFjdG9yO1xufVxuZXhwb3J0cy5yYWRpYW5zVG9MZW5ndGggPSByYWRpYW5zVG9MZW5ndGg7XG4vKipcbiAqIENvbnZlcnQgYSBkaXN0YW5jZSBtZWFzdXJlbWVudCAoYXNzdW1pbmcgYSBzcGhlcmljYWwgRWFydGgpIGZyb20gYSByZWFsLXdvcmxkIHVuaXQgaW50byByYWRpYW5zXG4gKiBWYWxpZCB1bml0czogbWlsZXMsIG5hdXRpY2FsbWlsZXMsIGluY2hlcywgeWFyZHMsIG1ldGVycywgbWV0cmVzLCBraWxvbWV0ZXJzLCBjZW50aW1ldGVycywgZmVldFxuICpcbiAqIEBuYW1lIGxlbmd0aFRvUmFkaWFuc1xuICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIGluIHJlYWwgdW5pdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdW5pdHM9XCJraWxvbWV0ZXJzXCJdIGNhbiBiZSBkZWdyZWVzLCByYWRpYW5zLCBtaWxlcywgb3Iga2lsb21ldGVycyBpbmNoZXMsIHlhcmRzLCBtZXRyZXMsXG4gKiBtZXRlcnMsIGtpbG9tZXRyZXMsIGtpbG9tZXRlcnMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5zXG4gKi9cbmZ1bmN0aW9uIGxlbmd0aFRvUmFkaWFucyhkaXN0YW5jZSwgdW5pdHMpIHtcbiAgICBpZiAodW5pdHMgPT09IHZvaWQgMCkgeyB1bml0cyA9IFwia2lsb21ldGVyc1wiOyB9XG4gICAgdmFyIGZhY3RvciA9IGV4cG9ydHMuZmFjdG9yc1t1bml0c107XG4gICAgaWYgKCFmYWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHVuaXRzICsgXCIgdW5pdHMgaXMgaW52YWxpZFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpc3RhbmNlIC8gZmFjdG9yO1xufVxuZXhwb3J0cy5sZW5ndGhUb1JhZGlhbnMgPSBsZW5ndGhUb1JhZGlhbnM7XG4vKipcbiAqIENvbnZlcnQgYSBkaXN0YW5jZSBtZWFzdXJlbWVudCAoYXNzdW1pbmcgYSBzcGhlcmljYWwgRWFydGgpIGZyb20gYSByZWFsLXdvcmxkIHVuaXQgaW50byBkZWdyZWVzXG4gKiBWYWxpZCB1bml0czogbWlsZXMsIG5hdXRpY2FsbWlsZXMsIGluY2hlcywgeWFyZHMsIG1ldGVycywgbWV0cmVzLCBjZW50aW1ldGVycywga2lsb21ldHJlcywgZmVldFxuICpcbiAqIEBuYW1lIGxlbmd0aFRvRGVncmVlc1xuICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIGluIHJlYWwgdW5pdHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdW5pdHM9XCJraWxvbWV0ZXJzXCJdIGNhbiBiZSBkZWdyZWVzLCByYWRpYW5zLCBtaWxlcywgb3Iga2lsb21ldGVycyBpbmNoZXMsIHlhcmRzLCBtZXRyZXMsXG4gKiBtZXRlcnMsIGtpbG9tZXRyZXMsIGtpbG9tZXRlcnMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkZWdyZWVzXG4gKi9cbmZ1bmN0aW9uIGxlbmd0aFRvRGVncmVlcyhkaXN0YW5jZSwgdW5pdHMpIHtcbiAgICByZXR1cm4gcmFkaWFuc1RvRGVncmVlcyhsZW5ndGhUb1JhZGlhbnMoZGlzdGFuY2UsIHVuaXRzKSk7XG59XG5leHBvcnRzLmxlbmd0aFRvRGVncmVlcyA9IGxlbmd0aFRvRGVncmVlcztcbi8qKlxuICogQ29udmVydHMgYW55IGJlYXJpbmcgYW5nbGUgZnJvbSB0aGUgbm9ydGggbGluZSBkaXJlY3Rpb24gKHBvc2l0aXZlIGNsb2Nrd2lzZSlcbiAqIGFuZCByZXR1cm5zIGFuIGFuZ2xlIGJldHdlZW4gMC0zNjAgZGVncmVlcyAocG9zaXRpdmUgY2xvY2t3aXNlKSwgMCBiZWluZyB0aGUgbm9ydGggbGluZVxuICpcbiAqIEBuYW1lIGJlYXJpbmdUb0F6aW11dGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBiZWFyaW5nIGFuZ2xlLCBiZXR3ZWVuIC0xODAgYW5kICsxODAgZGVncmVlc1xuICogQHJldHVybnMge251bWJlcn0gYW5nbGUgYmV0d2VlbiAwIGFuZCAzNjAgZGVncmVlc1xuICovXG5mdW5jdGlvbiBiZWFyaW5nVG9BemltdXRoKGJlYXJpbmcpIHtcbiAgICB2YXIgYW5nbGUgPSBiZWFyaW5nICUgMzYwO1xuICAgIGlmIChhbmdsZSA8IDApIHtcbiAgICAgICAgYW5nbGUgKz0gMzYwO1xuICAgIH1cbiAgICByZXR1cm4gYW5nbGU7XG59XG5leHBvcnRzLmJlYXJpbmdUb0F6aW11dGggPSBiZWFyaW5nVG9BemltdXRoO1xuLyoqXG4gKiBDb252ZXJ0cyBhbiBhbmdsZSBpbiByYWRpYW5zIHRvIGRlZ3JlZXNcbiAqXG4gKiBAbmFtZSByYWRpYW5zVG9EZWdyZWVzXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyBhbmdsZSBpbiByYWRpYW5zXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkZWdyZWVzIGJldHdlZW4gMCBhbmQgMzYwIGRlZ3JlZXNcbiAqL1xuZnVuY3Rpb24gcmFkaWFuc1RvRGVncmVlcyhyYWRpYW5zKSB7XG4gICAgdmFyIGRlZ3JlZXMgPSByYWRpYW5zICUgKDIgKiBNYXRoLlBJKTtcbiAgICByZXR1cm4gZGVncmVlcyAqIDE4MCAvIE1hdGguUEk7XG59XG5leHBvcnRzLnJhZGlhbnNUb0RlZ3JlZXMgPSByYWRpYW5zVG9EZWdyZWVzO1xuLyoqXG4gKiBDb252ZXJ0cyBhbiBhbmdsZSBpbiBkZWdyZWVzIHRvIHJhZGlhbnNcbiAqXG4gKiBAbmFtZSBkZWdyZWVzVG9SYWRpYW5zXG4gKiBAcGFyYW0ge251bWJlcn0gZGVncmVlcyBhbmdsZSBiZXR3ZWVuIDAgYW5kIDM2MCBkZWdyZWVzXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBhbmdsZSBpbiByYWRpYW5zXG4gKi9cbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xuICAgIHZhciByYWRpYW5zID0gZGVncmVlcyAlIDM2MDtcbiAgICByZXR1cm4gcmFkaWFucyAqIE1hdGguUEkgLyAxODA7XG59XG5leHBvcnRzLmRlZ3JlZXNUb1JhZGlhbnMgPSBkZWdyZWVzVG9SYWRpYW5zO1xuLyoqXG4gKiBDb252ZXJ0cyBhIGxlbmd0aCB0byB0aGUgcmVxdWVzdGVkIHVuaXQuXG4gKiBWYWxpZCB1bml0czogbWlsZXMsIG5hdXRpY2FsbWlsZXMsIGluY2hlcywgeWFyZHMsIG1ldGVycywgbWV0cmVzLCBraWxvbWV0ZXJzLCBjZW50aW1ldGVycywgZmVldFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggdG8gYmUgY29udmVydGVkXG4gKiBAcGFyYW0ge1VuaXRzfSBbb3JpZ2luYWxVbml0PVwia2lsb21ldGVyc1wiXSBvZiB0aGUgbGVuZ3RoXG4gKiBAcGFyYW0ge1VuaXRzfSBbZmluYWxVbml0PVwia2lsb21ldGVyc1wiXSByZXR1cm5lZCB1bml0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgY29udmVydGVkIGxlbmd0aFxuICovXG5mdW5jdGlvbiBjb252ZXJ0TGVuZ3RoKGxlbmd0aCwgb3JpZ2luYWxVbml0LCBmaW5hbFVuaXQpIHtcbiAgICBpZiAob3JpZ2luYWxVbml0ID09PSB2b2lkIDApIHsgb3JpZ2luYWxVbml0ID0gXCJraWxvbWV0ZXJzXCI7IH1cbiAgICBpZiAoZmluYWxVbml0ID09PSB2b2lkIDApIHsgZmluYWxVbml0ID0gXCJraWxvbWV0ZXJzXCI7IH1cbiAgICBpZiAoIShsZW5ndGggPj0gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibGVuZ3RoIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXJcIik7XG4gICAgfVxuICAgIHJldHVybiByYWRpYW5zVG9MZW5ndGgobGVuZ3RoVG9SYWRpYW5zKGxlbmd0aCwgb3JpZ2luYWxVbml0KSwgZmluYWxVbml0KTtcbn1cbmV4cG9ydHMuY29udmVydExlbmd0aCA9IGNvbnZlcnRMZW5ndGg7XG4vKipcbiAqIENvbnZlcnRzIGEgYXJlYSB0byB0aGUgcmVxdWVzdGVkIHVuaXQuXG4gKiBWYWxpZCB1bml0czoga2lsb21ldGVycywga2lsb21ldHJlcywgbWV0ZXJzLCBtZXRyZXMsIGNlbnRpbWV0cmVzLCBtaWxsaW1ldGVycywgYWNyZXMsIG1pbGVzLCB5YXJkcywgZmVldCwgaW5jaGVzXG4gKiBAcGFyYW0ge251bWJlcn0gYXJlYSB0byBiZSBjb252ZXJ0ZWRcbiAqIEBwYXJhbSB7VW5pdHN9IFtvcmlnaW5hbFVuaXQ9XCJtZXRlcnNcIl0gb2YgdGhlIGRpc3RhbmNlXG4gKiBAcGFyYW0ge1VuaXRzfSBbZmluYWxVbml0PVwia2lsb21ldGVyc1wiXSByZXR1cm5lZCB1bml0XG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgY29udmVydGVkIGRpc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRBcmVhKGFyZWEsIG9yaWdpbmFsVW5pdCwgZmluYWxVbml0KSB7XG4gICAgaWYgKG9yaWdpbmFsVW5pdCA9PT0gdm9pZCAwKSB7IG9yaWdpbmFsVW5pdCA9IFwibWV0ZXJzXCI7IH1cbiAgICBpZiAoZmluYWxVbml0ID09PSB2b2lkIDApIHsgZmluYWxVbml0ID0gXCJraWxvbWV0ZXJzXCI7IH1cbiAgICBpZiAoIShhcmVhID49IDApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZWEgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlclwiKTtcbiAgICB9XG4gICAgdmFyIHN0YXJ0RmFjdG9yID0gZXhwb3J0cy5hcmVhRmFjdG9yc1tvcmlnaW5hbFVuaXRdO1xuICAgIGlmICghc3RhcnRGYWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBvcmlnaW5hbCB1bml0c1wiKTtcbiAgICB9XG4gICAgdmFyIGZpbmFsRmFjdG9yID0gZXhwb3J0cy5hcmVhRmFjdG9yc1tmaW5hbFVuaXRdO1xuICAgIGlmICghZmluYWxGYWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBmaW5hbCB1bml0c1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIChhcmVhIC8gc3RhcnRGYWN0b3IpICogZmluYWxGYWN0b3I7XG59XG5leHBvcnRzLmNvbnZlcnRBcmVhID0gY29udmVydEFyZWE7XG4vKipcbiAqIGlzTnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBudW0gTnVtYmVyIHRvIHZhbGlkYXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZS9mYWxzZVxuICogQGV4YW1wbGVcbiAqIHR1cmYuaXNOdW1iZXIoMTIzKVxuICogLy89dHJ1ZVxuICogdHVyZi5pc051bWJlcignZm9vJylcbiAqIC8vPWZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKG51bSkge1xuICAgIHJldHVybiAhaXNOYU4obnVtKSAmJiBudW0gIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkobnVtKSAmJiAhL15cXHMqJC8udGVzdChudW0pO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuLyoqXG4gKiBpc09iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gaW5wdXQgdmFyaWFibGUgdG8gdmFsaWRhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlL2ZhbHNlXG4gKiBAZXhhbXBsZVxuICogdHVyZi5pc09iamVjdCh7ZWxldmF0aW9uOiAxMH0pXG4gKiAvLz10cnVlXG4gKiB0dXJmLmlzT2JqZWN0KCdmb28nKVxuICogLy89ZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QoaW5wdXQpIHtcbiAgICByZXR1cm4gKCEhaW5wdXQpICYmIChpbnB1dC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KTtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcbi8qKlxuICogVmFsaWRhdGUgQkJveFxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IGJib3ggQkJveCB0byB2YWxpZGF0ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAdGhyb3dzIEVycm9yIGlmIEJCb3ggaXMgbm90IHZhbGlkXG4gKiBAZXhhbXBsZVxuICogdmFsaWRhdGVCQm94KFstMTgwLCAtNDAsIDExMCwgNTBdKVxuICogLy89T0tcbiAqIHZhbGlkYXRlQkJveChbLTE4MCwgLTQwXSlcbiAqIC8vPUVycm9yXG4gKiB2YWxpZGF0ZUJCb3goJ0ZvbycpXG4gKiAvLz1FcnJvclxuICogdmFsaWRhdGVCQm94KDUpXG4gKiAvLz1FcnJvclxuICogdmFsaWRhdGVCQm94KG51bGwpXG4gKiAvLz1FcnJvclxuICogdmFsaWRhdGVCQm94KHVuZGVmaW5lZClcbiAqIC8vPUVycm9yXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlQkJveChiYm94KSB7XG4gICAgaWYgKCFiYm94KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImJib3ggaXMgcmVxdWlyZWRcIik7XG4gICAgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheShiYm94KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJiYm94IG11c3QgYmUgYW4gQXJyYXlcIik7XG4gICAgfVxuICAgIGlmIChiYm94Lmxlbmd0aCAhPT0gNCAmJiBiYm94Lmxlbmd0aCAhPT0gNikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJiYm94IG11c3QgYmUgYW4gQXJyYXkgb2YgNCBvciA2IG51bWJlcnNcIik7XG4gICAgfVxuICAgIGJib3guZm9yRWFjaChmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIGlmICghaXNOdW1iZXIobnVtKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmJveCBtdXN0IG9ubHkgY29udGFpbiBudW1iZXJzXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLnZhbGlkYXRlQkJveCA9IHZhbGlkYXRlQkJveDtcbi8qKlxuICogVmFsaWRhdGUgSWRcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBpZCBJZCB0byB2YWxpZGF0ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAdGhyb3dzIEVycm9yIGlmIElkIGlzIG5vdCB2YWxpZFxuICogQGV4YW1wbGVcbiAqIHZhbGlkYXRlSWQoWy0xODAsIC00MCwgMTEwLCA1MF0pXG4gKiAvLz1FcnJvclxuICogdmFsaWRhdGVJZChbLTE4MCwgLTQwXSlcbiAqIC8vPUVycm9yXG4gKiB2YWxpZGF0ZUlkKCdGb28nKVxuICogLy89T0tcbiAqIHZhbGlkYXRlSWQoNSlcbiAqIC8vPU9LXG4gKiB2YWxpZGF0ZUlkKG51bGwpXG4gKiAvLz1FcnJvclxuICogdmFsaWRhdGVJZCh1bmRlZmluZWQpXG4gKiAvLz1FcnJvclxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUlkKGlkKSB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpZCBpcyByZXF1aXJlZFwiKTtcbiAgICB9XG4gICAgaWYgKFtcInN0cmluZ1wiLCBcIm51bWJlclwiXS5pbmRleE9mKHR5cGVvZiBpZCkgPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImlkIG11c3QgYmUgYSBudW1iZXIgb3IgYSBzdHJpbmdcIik7XG4gICAgfVxufVxuZXhwb3J0cy52YWxpZGF0ZUlkID0gdmFsaWRhdGVJZDtcbi8vIERlcHJlY2F0ZWQgbWV0aG9kc1xuZnVuY3Rpb24gcmFkaWFuczJkZWdyZWVzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm1ldGhvZCBoYXMgYmVlbiByZW5hbWVkIHRvIGByYWRpYW5zVG9EZWdyZWVzYFwiKTtcbn1cbmV4cG9ydHMucmFkaWFuczJkZWdyZWVzID0gcmFkaWFuczJkZWdyZWVzO1xuZnVuY3Rpb24gZGVncmVlczJyYWRpYW5zKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm1ldGhvZCBoYXMgYmVlbiByZW5hbWVkIHRvIGBkZWdyZWVzVG9SYWRpYW5zYFwiKTtcbn1cbmV4cG9ydHMuZGVncmVlczJyYWRpYW5zID0gZGVncmVlczJyYWRpYW5zO1xuZnVuY3Rpb24gZGlzdGFuY2VUb0RlZ3JlZXMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwibWV0aG9kIGhhcyBiZWVuIHJlbmFtZWQgdG8gYGxlbmd0aFRvRGVncmVlc2BcIik7XG59XG5leHBvcnRzLmRpc3RhbmNlVG9EZWdyZWVzID0gZGlzdGFuY2VUb0RlZ3JlZXM7XG5mdW5jdGlvbiBkaXN0YW5jZVRvUmFkaWFucygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJtZXRob2QgaGFzIGJlZW4gcmVuYW1lZCB0byBgbGVuZ3RoVG9SYWRpYW5zYFwiKTtcbn1cbmV4cG9ydHMuZGlzdGFuY2VUb1JhZGlhbnMgPSBkaXN0YW5jZVRvUmFkaWFucztcbmZ1bmN0aW9uIHJhZGlhbnNUb0Rpc3RhbmNlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm1ldGhvZCBoYXMgYmVlbiByZW5hbWVkIHRvIGByYWRpYW5zVG9MZW5ndGhgXCIpO1xufVxuZXhwb3J0cy5yYWRpYW5zVG9EaXN0YW5jZSA9IHJhZGlhbnNUb0Rpc3RhbmNlO1xuZnVuY3Rpb24gYmVhcmluZ1RvQW5nbGUoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwibWV0aG9kIGhhcyBiZWVuIHJlbmFtZWQgdG8gYGJlYXJpbmdUb0F6aW11dGhgXCIpO1xufVxuZXhwb3J0cy5iZWFyaW5nVG9BbmdsZSA9IGJlYXJpbmdUb0FuZ2xlO1xuZnVuY3Rpb24gY29udmVydERpc3RhbmNlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm1ldGhvZCBoYXMgYmVlbiByZW5hbWVkIHRvIGBjb252ZXJ0TGVuZ3RoYFwiKTtcbn1cbmV4cG9ydHMuY29udmVydERpc3RhbmNlID0gY29udmVydERpc3RhbmNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJ0B0dXJmL2hlbHBlcnMnKTtcblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgY29vcmRFYWNoXG4gKlxuICogQGNhbGxiYWNrIGNvb3JkRWFjaENhbGxiYWNrXG4gKiBAcGFyYW0ge0FycmF5PG51bWJlcj59IGN1cnJlbnRDb29yZCBUaGUgY3VycmVudCBjb29yZGluYXRlIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb29yZEluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBjb29yZGluYXRlIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IG11bHRpRmVhdHVyZUluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBNdWx0aS1GZWF0dXJlIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBnZW9tZXRyeUluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBHZW9tZXRyeSBiZWluZyBwcm9jZXNzZWQuXG4gKi9cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgY29vcmRpbmF0ZXMgaW4gYW55IEdlb0pTT04gb2JqZWN0LCBzaW1pbGFyIHRvIEFycmF5LmZvckVhY2goKVxuICpcbiAqIEBuYW1lIGNvb3JkRWFjaFxuICogQHBhcmFtIHtGZWF0dXJlQ29sbGVjdGlvbnxGZWF0dXJlfEdlb21ldHJ5fSBnZW9qc29uIGFueSBHZW9KU09OIG9iamVjdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBtZXRob2QgdGhhdCB0YWtlcyAoY3VycmVudENvb3JkLCBjb29yZEluZGV4LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4KVxuICogQHBhcmFtIHtib29sZWFufSBbZXhjbHVkZVdyYXBDb29yZD1mYWxzZV0gd2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgZmluYWwgY29vcmRpbmF0ZSBvZiBMaW5lYXJSaW5ncyB0aGF0IHdyYXBzIHRoZSByaW5nIGluIGl0cyBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiB2YXIgZmVhdHVyZXMgPSB0dXJmLmZlYXR1cmVDb2xsZWN0aW9uKFtcbiAqICAgdHVyZi5wb2ludChbMjYsIDM3XSwge1wiZm9vXCI6IFwiYmFyXCJ9KSxcbiAqICAgdHVyZi5wb2ludChbMzYsIDUzXSwge1wiaGVsbG9cIjogXCJ3b3JsZFwifSlcbiAqIF0pO1xuICpcbiAqIHR1cmYuY29vcmRFYWNoKGZlYXR1cmVzLCBmdW5jdGlvbiAoY3VycmVudENvb3JkLCBjb29yZEluZGV4LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4KSB7XG4gKiAgIC8vPWN1cnJlbnRDb29yZFxuICogICAvLz1jb29yZEluZGV4XG4gKiAgIC8vPWZlYXR1cmVJbmRleFxuICogICAvLz1tdWx0aUZlYXR1cmVJbmRleFxuICogICAvLz1nZW9tZXRyeUluZGV4XG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gY29vcmRFYWNoKGdlb2pzb24sIGNhbGxiYWNrLCBleGNsdWRlV3JhcENvb3JkKSB7XG4gICAgLy8gSGFuZGxlcyBudWxsIEdlb21ldHJ5IC0tIFNraXBzIHRoaXMgR2VvSlNPTlxuICAgIGlmIChnZW9qc29uID09PSBudWxsKSByZXR1cm47XG4gICAgdmFyIGosIGssIGwsIGdlb21ldHJ5LCBzdG9wRywgY29vcmRzLFxuICAgICAgICBnZW9tZXRyeU1heWJlQ29sbGVjdGlvbixcbiAgICAgICAgd3JhcFNocmluayA9IDAsXG4gICAgICAgIGNvb3JkSW5kZXggPSAwLFxuICAgICAgICBpc0dlb21ldHJ5Q29sbGVjdGlvbixcbiAgICAgICAgdHlwZSA9IGdlb2pzb24udHlwZSxcbiAgICAgICAgaXNGZWF0dXJlQ29sbGVjdGlvbiA9IHR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgIGlzRmVhdHVyZSA9IHR5cGUgPT09ICdGZWF0dXJlJyxcbiAgICAgICAgc3RvcCA9IGlzRmVhdHVyZUNvbGxlY3Rpb24gPyBnZW9qc29uLmZlYXR1cmVzLmxlbmd0aCA6IDE7XG5cbiAgICAvLyBUaGlzIGxvZ2ljIG1heSBsb29rIGEgbGl0dGxlIHdlaXJkLiBUaGUgcmVhc29uIHdoeSBpdCBpcyB0aGF0IHdheVxuICAgIC8vIGlzIGJlY2F1c2UgaXQncyB0cnlpbmcgdG8gYmUgZmFzdC4gR2VvSlNPTiBzdXBwb3J0cyBtdWx0aXBsZSBraW5kc1xuICAgIC8vIG9mIG9iamVjdHMgYXQgaXRzIHJvb3Q6IEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlcywgR2VvbWV0cmllcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGhhcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgaGFuZGxpbmcgYWxsIG9mIHRoZW0sIGFuZCB0aGF0XG4gICAgLy8gbWVhbnMgdGhhdCBzb21lIG9mIHRoZSBgZm9yYCBsb29wcyB5b3Ugc2VlIGJlbG93IGFjdHVhbGx5IGp1c3QgZG9uJ3QgYXBwbHlcbiAgICAvLyB0byBjZXJ0YWluIGlucHV0cy4gRm9yIGluc3RhbmNlLCBpZiB5b3UgZ2l2ZSB0aGlzIGp1c3QgYVxuICAgIC8vIFBvaW50IGdlb21ldHJ5LCB0aGVuIGJvdGggbG9vcHMgYXJlIHNob3J0LWNpcmN1aXRlZCBhbmQgYWxsIHdlIGRvXG4gICAgLy8gaXMgZ3JhZHVhbGx5IHJlbmFtZSB0aGUgaW5wdXQgdW50aWwgaXQncyBjYWxsZWQgJ2dlb21ldHJ5Jy5cbiAgICAvL1xuICAgIC8vIFRoaXMgYWxzbyBhaW1zIHRvIGFsbG9jYXRlIGFzIGZldyByZXNvdXJjZXMgYXMgcG9zc2libGU6IGp1c3QgYVxuICAgIC8vIGZldyBudW1iZXJzIGFuZCBib29sZWFucywgcmF0aGVyIHRoYW4gYW55IHRlbXBvcmFyeSBhcnJheXMgYXMgd291bGRcbiAgICAvLyBiZSByZXF1aXJlZCB3aXRoIHRoZSBub3JtYWxpemF0aW9uIGFwcHJvYWNoLlxuICAgIGZvciAodmFyIGZlYXR1cmVJbmRleCA9IDA7IGZlYXR1cmVJbmRleCA8IHN0b3A7IGZlYXR1cmVJbmRleCsrKSB7XG4gICAgICAgIGdlb21ldHJ5TWF5YmVDb2xsZWN0aW9uID0gKGlzRmVhdHVyZUNvbGxlY3Rpb24gPyBnZW9qc29uLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF0uZ2VvbWV0cnkgOlxuICAgICAgICAgICAgKGlzRmVhdHVyZSA/IGdlb2pzb24uZ2VvbWV0cnkgOiBnZW9qc29uKSk7XG4gICAgICAgIGlzR2VvbWV0cnlDb2xsZWN0aW9uID0gKGdlb21ldHJ5TWF5YmVDb2xsZWN0aW9uKSA/IGdlb21ldHJ5TWF5YmVDb2xsZWN0aW9uLnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nIDogZmFsc2U7XG4gICAgICAgIHN0b3BHID0gaXNHZW9tZXRyeUNvbGxlY3Rpb24gPyBnZW9tZXRyeU1heWJlQ29sbGVjdGlvbi5nZW9tZXRyaWVzLmxlbmd0aCA6IDE7XG5cbiAgICAgICAgZm9yICh2YXIgZ2VvbUluZGV4ID0gMDsgZ2VvbUluZGV4IDwgc3RvcEc7IGdlb21JbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgbXVsdGlGZWF0dXJlSW5kZXggPSAwO1xuICAgICAgICAgICAgdmFyIGdlb21ldHJ5SW5kZXggPSAwO1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBpc0dlb21ldHJ5Q29sbGVjdGlvbiA/XG4gICAgICAgICAgICAgICAgZ2VvbWV0cnlNYXliZUNvbGxlY3Rpb24uZ2VvbWV0cmllc1tnZW9tSW5kZXhdIDogZ2VvbWV0cnlNYXliZUNvbGxlY3Rpb247XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZXMgbnVsbCBHZW9tZXRyeSAtLSBTa2lwcyB0aGlzIGdlb21ldHJ5XG4gICAgICAgICAgICBpZiAoZ2VvbWV0cnkgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29vcmRzID0gZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgICAgICB2YXIgZ2VvbVR5cGUgPSBnZW9tZXRyeS50eXBlO1xuXG4gICAgICAgICAgICB3cmFwU2hyaW5rID0gKGV4Y2x1ZGVXcmFwQ29vcmQgJiYgKGdlb21UeXBlID09PSAnUG9seWdvbicgfHwgZ2VvbVR5cGUgPT09ICdNdWx0aVBvbHlnb24nKSkgPyAxIDogMDtcblxuICAgICAgICAgICAgc3dpdGNoIChnZW9tVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBudWxsOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnUG9pbnQnOlxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayhjb29yZHMsIGNvb3JkSW5kZXgsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvb3JkSW5kZXgrKztcbiAgICAgICAgICAgICAgICBtdWx0aUZlYXR1cmVJbmRleCsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAgICAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29vcmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayhjb29yZHNbal0sIGNvb3JkSW5kZXgsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb29yZEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnZW9tVHlwZSA9PT0gJ011bHRpUG9pbnQnKSBtdWx0aUZlYXR1cmVJbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2VvbVR5cGUgPT09ICdMaW5lU3RyaW5nJykgbXVsdGlGZWF0dXJlSW5kZXgrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgICAgICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29vcmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBjb29yZHNbal0ubGVuZ3RoIC0gd3JhcFNocmluazsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2soY29vcmRzW2pdW2tdLCBjb29yZEluZGV4LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4KSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkSW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2VvbVR5cGUgPT09ICdNdWx0aUxpbmVTdHJpbmcnKSBtdWx0aUZlYXR1cmVJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2VvbVR5cGUgPT09ICdQb2x5Z29uJykgZ2VvbWV0cnlJbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2VvbVR5cGUgPT09ICdQb2x5Z29uJykgbXVsdGlGZWF0dXJlSW5kZXgrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGNvb3Jkcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGNvb3Jkc1tqXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsID0gMDsgbCA8IGNvb3Jkc1tqXVtrXS5sZW5ndGggLSB3cmFwU2hyaW5rOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2soY29vcmRzW2pdW2tdW2xdLCBjb29yZEluZGV4LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4KSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeUluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbXVsdGlGZWF0dXJlSW5kZXgrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdHZW9tZXRyeUNvbGxlY3Rpb24nOlxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBnZW9tZXRyeS5nZW9tZXRyaWVzLmxlbmd0aDsgaisrKVxuICAgICAgICAgICAgICAgICAgICBpZiAoY29vcmRFYWNoKGdlb21ldHJ5Lmdlb21ldHJpZXNbal0sIGNhbGxiYWNrLCBleGNsdWRlV3JhcENvb3JkKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIEdlb21ldHJ5IFR5cGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgY29vcmRSZWR1Y2VcbiAqXG4gKiBUaGUgZmlyc3QgdGltZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgdmFsdWVzIHByb3ZpZGVkIGFzIGFyZ3VtZW50cyBkZXBlbmRcbiAqIG9uIHdoZXRoZXIgdGhlIHJlZHVjZSBtZXRob2QgaGFzIGFuIGluaXRpYWxWYWx1ZSBhcmd1bWVudC5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgcHJvdmlkZWQgdG8gdGhlIHJlZHVjZSBtZXRob2Q6XG4gKiAgLSBUaGUgcHJldmlvdXNWYWx1ZSBhcmd1bWVudCBpcyBpbml0aWFsVmFsdWUuXG4gKiAgLSBUaGUgY3VycmVudFZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgbm90IHByb3ZpZGVkOlxuICogIC0gVGhlIHByZXZpb3VzVmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICogIC0gVGhlIGN1cnJlbnRWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIHNlY29uZCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICpcbiAqIEBjYWxsYmFjayBjb29yZFJlZHVjZUNhbGxiYWNrXG4gKiBAcGFyYW0geyp9IHByZXZpb3VzVmFsdWUgVGhlIGFjY3VtdWxhdGVkIHZhbHVlIHByZXZpb3VzbHkgcmV0dXJuZWQgaW4gdGhlIGxhc3QgaW52b2NhdGlvblxuICogb2YgdGhlIGNhbGxiYWNrLCBvciBpbml0aWFsVmFsdWUsIGlmIHN1cHBsaWVkLlxuICogQHBhcmFtIHtBcnJheTxudW1iZXI+fSBjdXJyZW50Q29vcmQgVGhlIGN1cnJlbnQgY29vcmRpbmF0ZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gY29vcmRJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgY29vcmRpbmF0ZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBTdGFydHMgYXQgaW5kZXggMCwgaWYgYW4gaW5pdGlhbFZhbHVlIGlzIHByb3ZpZGVkLCBhbmQgYXQgaW5kZXggMSBvdGhlcndpc2UuXG4gKiBAcGFyYW0ge251bWJlcn0gZmVhdHVyZUluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBGZWF0dXJlIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0aUZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgTXVsdGktRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gZ2VvbWV0cnlJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgR2VvbWV0cnkgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogUmVkdWNlIGNvb3JkaW5hdGVzIGluIGFueSBHZW9KU09OIG9iamVjdCwgc2ltaWxhciB0byBBcnJheS5yZWR1Y2UoKVxuICpcbiAqIEBuYW1lIGNvb3JkUmVkdWNlXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEdlb21ldHJ5fEZlYXR1cmV9IGdlb2pzb24gYW55IEdlb0pTT04gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIG1ldGhvZCB0aGF0IHRha2VzIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50Q29vcmQsIGNvb3JkSW5kZXgpXG4gKiBAcGFyYW0geyp9IFtpbml0aWFsVmFsdWVdIFZhbHVlIHRvIHVzZSBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGZpcnN0IGNhbGwgb2YgdGhlIGNhbGxiYWNrLlxuICogQHBhcmFtIHtib29sZWFufSBbZXhjbHVkZVdyYXBDb29yZD1mYWxzZV0gd2hldGhlciBvciBub3QgdG8gaW5jbHVkZSB0aGUgZmluYWwgY29vcmRpbmF0ZSBvZiBMaW5lYXJSaW5ncyB0aGF0IHdyYXBzIHRoZSByaW5nIGluIGl0cyBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlIHRoYXQgcmVzdWx0cyBmcm9tIHRoZSByZWR1Y3Rpb24uXG4gKiBAZXhhbXBsZVxuICogdmFyIGZlYXR1cmVzID0gdHVyZi5mZWF0dXJlQ29sbGVjdGlvbihbXG4gKiAgIHR1cmYucG9pbnQoWzI2LCAzN10sIHtcImZvb1wiOiBcImJhclwifSksXG4gKiAgIHR1cmYucG9pbnQoWzM2LCA1M10sIHtcImhlbGxvXCI6IFwid29ybGRcIn0pXG4gKiBdKTtcbiAqXG4gKiB0dXJmLmNvb3JkUmVkdWNlKGZlYXR1cmVzLCBmdW5jdGlvbiAocHJldmlvdXNWYWx1ZSwgY3VycmVudENvb3JkLCBjb29yZEluZGV4LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4KSB7XG4gKiAgIC8vPXByZXZpb3VzVmFsdWVcbiAqICAgLy89Y3VycmVudENvb3JkXG4gKiAgIC8vPWNvb3JkSW5kZXhcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiAgIC8vPW11bHRpRmVhdHVyZUluZGV4XG4gKiAgIC8vPWdlb21ldHJ5SW5kZXhcbiAqICAgcmV0dXJuIGN1cnJlbnRDb29yZDtcbiAqIH0pO1xuICovXG5mdW5jdGlvbiBjb29yZFJlZHVjZShnZW9qc29uLCBjYWxsYmFjaywgaW5pdGlhbFZhbHVlLCBleGNsdWRlV3JhcENvb3JkKSB7XG4gICAgdmFyIHByZXZpb3VzVmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgY29vcmRFYWNoKGdlb2pzb24sIGZ1bmN0aW9uIChjdXJyZW50Q29vcmQsIGNvb3JkSW5kZXgsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgpIHtcbiAgICAgICAgaWYgKGNvb3JkSW5kZXggPT09IDAgJiYgaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHByZXZpb3VzVmFsdWUgPSBjdXJyZW50Q29vcmQ7XG4gICAgICAgIGVsc2UgcHJldmlvdXNWYWx1ZSA9IGNhbGxiYWNrKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRDb29yZCwgY29vcmRJbmRleCwgZmVhdHVyZUluZGV4LCBtdWx0aUZlYXR1cmVJbmRleCwgZ2VvbWV0cnlJbmRleCk7XG4gICAgfSwgZXhjbHVkZVdyYXBDb29yZCk7XG4gICAgcmV0dXJuIHByZXZpb3VzVmFsdWU7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIHByb3BFYWNoXG4gKlxuICogQGNhbGxiYWNrIHByb3BFYWNoQ2FsbGJhY2tcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50UHJvcGVydGllcyBUaGUgY3VycmVudCBQcm9wZXJ0aWVzIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIHByb3BlcnRpZXMgaW4gYW55IEdlb0pTT04gb2JqZWN0LCBzaW1pbGFyIHRvIEFycmF5LmZvckVhY2goKVxuICpcbiAqIEBuYW1lIHByb3BFYWNoXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEZlYXR1cmV9IGdlb2pzb24gYW55IEdlb0pTT04gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIG1ldGhvZCB0aGF0IHRha2VzIChjdXJyZW50UHJvcGVydGllcywgZmVhdHVyZUluZGV4KVxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogdmFyIGZlYXR1cmVzID0gdHVyZi5mZWF0dXJlQ29sbGVjdGlvbihbXG4gKiAgICAgdHVyZi5wb2ludChbMjYsIDM3XSwge2ZvbzogJ2Jhcid9KSxcbiAqICAgICB0dXJmLnBvaW50KFszNiwgNTNdLCB7aGVsbG86ICd3b3JsZCd9KVxuICogXSk7XG4gKlxuICogdHVyZi5wcm9wRWFjaChmZWF0dXJlcywgZnVuY3Rpb24gKGN1cnJlbnRQcm9wZXJ0aWVzLCBmZWF0dXJlSW5kZXgpIHtcbiAqICAgLy89Y3VycmVudFByb3BlcnRpZXNcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gcHJvcEVhY2goZ2VvanNvbiwgY2FsbGJhY2spIHtcbiAgICB2YXIgaTtcbiAgICBzd2l0Y2ggKGdlb2pzb24udHlwZSkge1xuICAgIGNhc2UgJ0ZlYXR1cmVDb2xsZWN0aW9uJzpcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGdlb2pzb24uZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhnZW9qc29uLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMsIGkpID09PSBmYWxzZSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnRmVhdHVyZSc6XG4gICAgICAgIGNhbGxiYWNrKGdlb2pzb24ucHJvcGVydGllcywgMCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBwcm9wUmVkdWNlXG4gKlxuICogVGhlIGZpcnN0IHRpbWUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHZhbHVlcyBwcm92aWRlZCBhcyBhcmd1bWVudHMgZGVwZW5kXG4gKiBvbiB3aGV0aGVyIHRoZSByZWR1Y2UgbWV0aG9kIGhhcyBhbiBpbml0aWFsVmFsdWUgYXJndW1lbnQuXG4gKlxuICogSWYgYW4gaW5pdGlhbFZhbHVlIGlzIHByb3ZpZGVkIHRvIHRoZSByZWR1Y2UgbWV0aG9kOlxuICogIC0gVGhlIHByZXZpb3VzVmFsdWUgYXJndW1lbnQgaXMgaW5pdGlhbFZhbHVlLlxuICogIC0gVGhlIGN1cnJlbnRWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGVsZW1lbnQgcHJlc2VudCBpbiB0aGUgYXJyYXkuXG4gKlxuICogSWYgYW4gaW5pdGlhbFZhbHVlIGlzIG5vdCBwcm92aWRlZDpcbiAqICAtIFRoZSBwcmV2aW91c1ZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAqICAtIFRoZSBjdXJyZW50VmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBzZWNvbmQgZWxlbWVudCBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAqXG4gKiBAY2FsbGJhY2sgcHJvcFJlZHVjZUNhbGxiYWNrXG4gKiBAcGFyYW0geyp9IHByZXZpb3VzVmFsdWUgVGhlIGFjY3VtdWxhdGVkIHZhbHVlIHByZXZpb3VzbHkgcmV0dXJuZWQgaW4gdGhlIGxhc3QgaW52b2NhdGlvblxuICogb2YgdGhlIGNhbGxiYWNrLCBvciBpbml0aWFsVmFsdWUsIGlmIHN1cHBsaWVkLlxuICogQHBhcmFtIHsqfSBjdXJyZW50UHJvcGVydGllcyBUaGUgY3VycmVudCBQcm9wZXJ0aWVzIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogUmVkdWNlIHByb3BlcnRpZXMgaW4gYW55IEdlb0pTT04gb2JqZWN0IGludG8gYSBzaW5nbGUgdmFsdWUsXG4gKiBzaW1pbGFyIHRvIGhvdyBBcnJheS5yZWR1Y2Ugd29ya3MuIEhvd2V2ZXIsIGluIHRoaXMgY2FzZSB3ZSBsYXppbHkgcnVuXG4gKiB0aGUgcmVkdWN0aW9uLCBzbyBhbiBhcnJheSBvZiBhbGwgcHJvcGVydGllcyBpcyB1bm5lY2Vzc2FyeS5cbiAqXG4gKiBAbmFtZSBwcm9wUmVkdWNlXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEZlYXR1cmV9IGdlb2pzb24gYW55IEdlb0pTT04gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIG1ldGhvZCB0aGF0IHRha2VzIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50UHJvcGVydGllcywgZmVhdHVyZUluZGV4KVxuICogQHBhcmFtIHsqfSBbaW5pdGlhbFZhbHVlXSBWYWx1ZSB0byB1c2UgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBmaXJzdCBjYWxsIG9mIHRoZSBjYWxsYmFjay5cbiAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUgdGhhdCByZXN1bHRzIGZyb20gdGhlIHJlZHVjdGlvbi5cbiAqIEBleGFtcGxlXG4gKiB2YXIgZmVhdHVyZXMgPSB0dXJmLmZlYXR1cmVDb2xsZWN0aW9uKFtcbiAqICAgICB0dXJmLnBvaW50KFsyNiwgMzddLCB7Zm9vOiAnYmFyJ30pLFxuICogICAgIHR1cmYucG9pbnQoWzM2LCA1M10sIHtoZWxsbzogJ3dvcmxkJ30pXG4gKiBdKTtcbiAqXG4gKiB0dXJmLnByb3BSZWR1Y2UoZmVhdHVyZXMsIGZ1bmN0aW9uIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50UHJvcGVydGllcywgZmVhdHVyZUluZGV4KSB7XG4gKiAgIC8vPXByZXZpb3VzVmFsdWVcbiAqICAgLy89Y3VycmVudFByb3BlcnRpZXNcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiAgIHJldHVybiBjdXJyZW50UHJvcGVydGllc1xuICogfSk7XG4gKi9cbmZ1bmN0aW9uIHByb3BSZWR1Y2UoZ2VvanNvbiwgY2FsbGJhY2ssIGluaXRpYWxWYWx1ZSkge1xuICAgIHZhciBwcmV2aW91c1ZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgIHByb3BFYWNoKGdlb2pzb24sIGZ1bmN0aW9uIChjdXJyZW50UHJvcGVydGllcywgZmVhdHVyZUluZGV4KSB7XG4gICAgICAgIGlmIChmZWF0dXJlSW5kZXggPT09IDAgJiYgaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHByZXZpb3VzVmFsdWUgPSBjdXJyZW50UHJvcGVydGllcztcbiAgICAgICAgZWxzZSBwcmV2aW91c1ZhbHVlID0gY2FsbGJhY2socHJldmlvdXNWYWx1ZSwgY3VycmVudFByb3BlcnRpZXMsIGZlYXR1cmVJbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByZXZpb3VzVmFsdWU7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGZlYXR1cmVFYWNoXG4gKlxuICogQGNhbGxiYWNrIGZlYXR1cmVFYWNoQ2FsbGJhY2tcbiAqIEBwYXJhbSB7RmVhdHVyZTxhbnk+fSBjdXJyZW50RmVhdHVyZSBUaGUgY3VycmVudCBGZWF0dXJlIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGZlYXR1cmVzIGluIGFueSBHZW9KU09OIG9iamVjdCwgc2ltaWxhciB0b1xuICogQXJyYXkuZm9yRWFjaC5cbiAqXG4gKiBAbmFtZSBmZWF0dXJlRWFjaFxuICogQHBhcmFtIHtGZWF0dXJlQ29sbGVjdGlvbnxGZWF0dXJlfEdlb21ldHJ5fSBnZW9qc29uIGFueSBHZW9KU09OIG9iamVjdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBtZXRob2QgdGhhdCB0YWtlcyAoY3VycmVudEZlYXR1cmUsIGZlYXR1cmVJbmRleClcbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIHZhciBmZWF0dXJlcyA9IHR1cmYuZmVhdHVyZUNvbGxlY3Rpb24oW1xuICogICB0dXJmLnBvaW50KFsyNiwgMzddLCB7Zm9vOiAnYmFyJ30pLFxuICogICB0dXJmLnBvaW50KFszNiwgNTNdLCB7aGVsbG86ICd3b3JsZCd9KVxuICogXSk7XG4gKlxuICogdHVyZi5mZWF0dXJlRWFjaChmZWF0dXJlcywgZnVuY3Rpb24gKGN1cnJlbnRGZWF0dXJlLCBmZWF0dXJlSW5kZXgpIHtcbiAqICAgLy89Y3VycmVudEZlYXR1cmVcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gZmVhdHVyZUVhY2goZ2VvanNvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAoZ2VvanNvbi50eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICAgICAgY2FsbGJhY2soZ2VvanNvbiwgMCk7XG4gICAgfSBlbHNlIGlmIChnZW9qc29uLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnZW9qc29uLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2soZ2VvanNvbi5mZWF0dXJlc1tpXSwgaSkgPT09IGZhbHNlKSBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgZmVhdHVyZVJlZHVjZVxuICpcbiAqIFRoZSBmaXJzdCB0aW1lIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBpcyBjYWxsZWQsIHRoZSB2YWx1ZXMgcHJvdmlkZWQgYXMgYXJndW1lbnRzIGRlcGVuZFxuICogb24gd2hldGhlciB0aGUgcmVkdWNlIG1ldGhvZCBoYXMgYW4gaW5pdGlhbFZhbHVlIGFyZ3VtZW50LlxuICpcbiAqIElmIGFuIGluaXRpYWxWYWx1ZSBpcyBwcm92aWRlZCB0byB0aGUgcmVkdWNlIG1ldGhvZDpcbiAqICAtIFRoZSBwcmV2aW91c1ZhbHVlIGFyZ3VtZW50IGlzIGluaXRpYWxWYWx1ZS5cbiAqICAtIFRoZSBjdXJyZW50VmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICpcbiAqIElmIGFuIGluaXRpYWxWYWx1ZSBpcyBub3QgcHJvdmlkZWQ6XG4gKiAgLSBUaGUgcHJldmlvdXNWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGVsZW1lbnQgcHJlc2VudCBpbiB0aGUgYXJyYXkuXG4gKiAgLSBUaGUgY3VycmVudFZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgc2Vjb25kIGVsZW1lbnQgcHJlc2VudCBpbiB0aGUgYXJyYXkuXG4gKlxuICogQGNhbGxiYWNrIGZlYXR1cmVSZWR1Y2VDYWxsYmFja1xuICogQHBhcmFtIHsqfSBwcmV2aW91c1ZhbHVlIFRoZSBhY2N1bXVsYXRlZCB2YWx1ZSBwcmV2aW91c2x5IHJldHVybmVkIGluIHRoZSBsYXN0IGludm9jYXRpb25cbiAqIG9mIHRoZSBjYWxsYmFjaywgb3IgaW5pdGlhbFZhbHVlLCBpZiBzdXBwbGllZC5cbiAqIEBwYXJhbSB7RmVhdHVyZX0gY3VycmVudEZlYXR1cmUgVGhlIGN1cnJlbnQgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gZmVhdHVyZUluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBGZWF0dXJlIGJlaW5nIHByb2Nlc3NlZC5cbiAqL1xuXG4vKipcbiAqIFJlZHVjZSBmZWF0dXJlcyBpbiBhbnkgR2VvSlNPTiBvYmplY3QsIHNpbWlsYXIgdG8gQXJyYXkucmVkdWNlKCkuXG4gKlxuICogQG5hbWUgZmVhdHVyZVJlZHVjZVxuICogQHBhcmFtIHtGZWF0dXJlQ29sbGVjdGlvbnxGZWF0dXJlfEdlb21ldHJ5fSBnZW9qc29uIGFueSBHZW9KU09OIG9iamVjdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBtZXRob2QgdGhhdCB0YWtlcyAocHJldmlvdXNWYWx1ZSwgY3VycmVudEZlYXR1cmUsIGZlYXR1cmVJbmRleClcbiAqIEBwYXJhbSB7Kn0gW2luaXRpYWxWYWx1ZV0gVmFsdWUgdG8gdXNlIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgZmlyc3QgY2FsbCBvZiB0aGUgY2FsbGJhY2suXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlIHRoYXQgcmVzdWx0cyBmcm9tIHRoZSByZWR1Y3Rpb24uXG4gKiBAZXhhbXBsZVxuICogdmFyIGZlYXR1cmVzID0gdHVyZi5mZWF0dXJlQ29sbGVjdGlvbihbXG4gKiAgIHR1cmYucG9pbnQoWzI2LCAzN10sIHtcImZvb1wiOiBcImJhclwifSksXG4gKiAgIHR1cmYucG9pbnQoWzM2LCA1M10sIHtcImhlbGxvXCI6IFwid29ybGRcIn0pXG4gKiBdKTtcbiAqXG4gKiB0dXJmLmZlYXR1cmVSZWR1Y2UoZmVhdHVyZXMsIGZ1bmN0aW9uIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50RmVhdHVyZSwgZmVhdHVyZUluZGV4KSB7XG4gKiAgIC8vPXByZXZpb3VzVmFsdWVcbiAqICAgLy89Y3VycmVudEZlYXR1cmVcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiAgIHJldHVybiBjdXJyZW50RmVhdHVyZVxuICogfSk7XG4gKi9cbmZ1bmN0aW9uIGZlYXR1cmVSZWR1Y2UoZ2VvanNvbiwgY2FsbGJhY2ssIGluaXRpYWxWYWx1ZSkge1xuICAgIHZhciBwcmV2aW91c1ZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgIGZlYXR1cmVFYWNoKGdlb2pzb24sIGZ1bmN0aW9uIChjdXJyZW50RmVhdHVyZSwgZmVhdHVyZUluZGV4KSB7XG4gICAgICAgIGlmIChmZWF0dXJlSW5kZXggPT09IDAgJiYgaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHByZXZpb3VzVmFsdWUgPSBjdXJyZW50RmVhdHVyZTtcbiAgICAgICAgZWxzZSBwcmV2aW91c1ZhbHVlID0gY2FsbGJhY2socHJldmlvdXNWYWx1ZSwgY3VycmVudEZlYXR1cmUsIGZlYXR1cmVJbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByZXZpb3VzVmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGFsbCBjb29yZGluYXRlcyBmcm9tIGFueSBHZW9KU09OIG9iamVjdC5cbiAqXG4gKiBAbmFtZSBjb29yZEFsbFxuICogQHBhcmFtIHtGZWF0dXJlQ29sbGVjdGlvbnxGZWF0dXJlfEdlb21ldHJ5fSBnZW9qc29uIGFueSBHZW9KU09OIG9iamVjdFxuICogQHJldHVybnMge0FycmF5PEFycmF5PG51bWJlcj4+fSBjb29yZGluYXRlIHBvc2l0aW9uIGFycmF5XG4gKiBAZXhhbXBsZVxuICogdmFyIGZlYXR1cmVzID0gdHVyZi5mZWF0dXJlQ29sbGVjdGlvbihbXG4gKiAgIHR1cmYucG9pbnQoWzI2LCAzN10sIHtmb286ICdiYXInfSksXG4gKiAgIHR1cmYucG9pbnQoWzM2LCA1M10sIHtoZWxsbzogJ3dvcmxkJ30pXG4gKiBdKTtcbiAqXG4gKiB2YXIgY29vcmRzID0gdHVyZi5jb29yZEFsbChmZWF0dXJlcyk7XG4gKiAvLz0gW1syNiwgMzddLCBbMzYsIDUzXV1cbiAqL1xuZnVuY3Rpb24gY29vcmRBbGwoZ2VvanNvbikge1xuICAgIHZhciBjb29yZHMgPSBbXTtcbiAgICBjb29yZEVhY2goZ2VvanNvbiwgZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIGNvb3Jkcy5wdXNoKGNvb3JkKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29vcmRzO1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBnZW9tRWFjaFxuICpcbiAqIEBjYWxsYmFjayBnZW9tRWFjaENhbGxiYWNrXG4gKiBAcGFyYW0ge0dlb21ldHJ5fSBjdXJyZW50R2VvbWV0cnkgVGhlIGN1cnJlbnQgR2VvbWV0cnkgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gZmVhdHVyZVByb3BlcnRpZXMgVGhlIGN1cnJlbnQgRmVhdHVyZSBQcm9wZXJ0aWVzIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gZmVhdHVyZUJCb3ggVGhlIGN1cnJlbnQgRmVhdHVyZSBCQm94IGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gZmVhdHVyZUlkIFRoZSBjdXJyZW50IEZlYXR1cmUgSWQgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGVhY2ggZ2VvbWV0cnkgaW4gYW55IEdlb0pTT04gb2JqZWN0LCBzaW1pbGFyIHRvIEFycmF5LmZvckVhY2goKVxuICpcbiAqIEBuYW1lIGdlb21FYWNoXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEZlYXR1cmV8R2VvbWV0cnl9IGdlb2pzb24gYW55IEdlb0pTT04gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIG1ldGhvZCB0aGF0IHRha2VzIChjdXJyZW50R2VvbWV0cnksIGZlYXR1cmVJbmRleCwgZmVhdHVyZVByb3BlcnRpZXMsIGZlYXR1cmVCQm94LCBmZWF0dXJlSWQpXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiB2YXIgZmVhdHVyZXMgPSB0dXJmLmZlYXR1cmVDb2xsZWN0aW9uKFtcbiAqICAgICB0dXJmLnBvaW50KFsyNiwgMzddLCB7Zm9vOiAnYmFyJ30pLFxuICogICAgIHR1cmYucG9pbnQoWzM2LCA1M10sIHtoZWxsbzogJ3dvcmxkJ30pXG4gKiBdKTtcbiAqXG4gKiB0dXJmLmdlb21FYWNoKGZlYXR1cmVzLCBmdW5jdGlvbiAoY3VycmVudEdlb21ldHJ5LCBmZWF0dXJlSW5kZXgsIGZlYXR1cmVQcm9wZXJ0aWVzLCBmZWF0dXJlQkJveCwgZmVhdHVyZUlkKSB7XG4gKiAgIC8vPWN1cnJlbnRHZW9tZXRyeVxuICogICAvLz1mZWF0dXJlSW5kZXhcbiAqICAgLy89ZmVhdHVyZVByb3BlcnRpZXNcbiAqICAgLy89ZmVhdHVyZUJCb3hcbiAqICAgLy89ZmVhdHVyZUlkXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gZ2VvbUVhY2goZ2VvanNvbiwgY2FsbGJhY2spIHtcbiAgICB2YXIgaSwgaiwgZywgZ2VvbWV0cnksIHN0b3BHLFxuICAgICAgICBnZW9tZXRyeU1heWJlQ29sbGVjdGlvbixcbiAgICAgICAgaXNHZW9tZXRyeUNvbGxlY3Rpb24sXG4gICAgICAgIGZlYXR1cmVQcm9wZXJ0aWVzLFxuICAgICAgICBmZWF0dXJlQkJveCxcbiAgICAgICAgZmVhdHVyZUlkLFxuICAgICAgICBmZWF0dXJlSW5kZXggPSAwLFxuICAgICAgICBpc0ZlYXR1cmVDb2xsZWN0aW9uID0gZ2VvanNvbi50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgICBpc0ZlYXR1cmUgPSBnZW9qc29uLnR5cGUgPT09ICdGZWF0dXJlJyxcbiAgICAgICAgc3RvcCA9IGlzRmVhdHVyZUNvbGxlY3Rpb24gPyBnZW9qc29uLmZlYXR1cmVzLmxlbmd0aCA6IDE7XG5cbiAgICAvLyBUaGlzIGxvZ2ljIG1heSBsb29rIGEgbGl0dGxlIHdlaXJkLiBUaGUgcmVhc29uIHdoeSBpdCBpcyB0aGF0IHdheVxuICAgIC8vIGlzIGJlY2F1c2UgaXQncyB0cnlpbmcgdG8gYmUgZmFzdC4gR2VvSlNPTiBzdXBwb3J0cyBtdWx0aXBsZSBraW5kc1xuICAgIC8vIG9mIG9iamVjdHMgYXQgaXRzIHJvb3Q6IEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlcywgR2VvbWV0cmllcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGhhcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgaGFuZGxpbmcgYWxsIG9mIHRoZW0sIGFuZCB0aGF0XG4gICAgLy8gbWVhbnMgdGhhdCBzb21lIG9mIHRoZSBgZm9yYCBsb29wcyB5b3Ugc2VlIGJlbG93IGFjdHVhbGx5IGp1c3QgZG9uJ3QgYXBwbHlcbiAgICAvLyB0byBjZXJ0YWluIGlucHV0cy4gRm9yIGluc3RhbmNlLCBpZiB5b3UgZ2l2ZSB0aGlzIGp1c3QgYVxuICAgIC8vIFBvaW50IGdlb21ldHJ5LCB0aGVuIGJvdGggbG9vcHMgYXJlIHNob3J0LWNpcmN1aXRlZCBhbmQgYWxsIHdlIGRvXG4gICAgLy8gaXMgZ3JhZHVhbGx5IHJlbmFtZSB0aGUgaW5wdXQgdW50aWwgaXQncyBjYWxsZWQgJ2dlb21ldHJ5Jy5cbiAgICAvL1xuICAgIC8vIFRoaXMgYWxzbyBhaW1zIHRvIGFsbG9jYXRlIGFzIGZldyByZXNvdXJjZXMgYXMgcG9zc2libGU6IGp1c3QgYVxuICAgIC8vIGZldyBudW1iZXJzIGFuZCBib29sZWFucywgcmF0aGVyIHRoYW4gYW55IHRlbXBvcmFyeSBhcnJheXMgYXMgd291bGRcbiAgICAvLyBiZSByZXF1aXJlZCB3aXRoIHRoZSBub3JtYWxpemF0aW9uIGFwcHJvYWNoLlxuICAgIGZvciAoaSA9IDA7IGkgPCBzdG9wOyBpKyspIHtcblxuICAgICAgICBnZW9tZXRyeU1heWJlQ29sbGVjdGlvbiA9IChpc0ZlYXR1cmVDb2xsZWN0aW9uID8gZ2VvanNvbi5mZWF0dXJlc1tpXS5nZW9tZXRyeSA6XG4gICAgICAgICAgICAoaXNGZWF0dXJlID8gZ2VvanNvbi5nZW9tZXRyeSA6IGdlb2pzb24pKTtcbiAgICAgICAgZmVhdHVyZVByb3BlcnRpZXMgPSAoaXNGZWF0dXJlQ29sbGVjdGlvbiA/IGdlb2pzb24uZmVhdHVyZXNbaV0ucHJvcGVydGllcyA6XG4gICAgICAgICAgICAoaXNGZWF0dXJlID8gZ2VvanNvbi5wcm9wZXJ0aWVzIDoge30pKTtcbiAgICAgICAgZmVhdHVyZUJCb3ggPSAoaXNGZWF0dXJlQ29sbGVjdGlvbiA/IGdlb2pzb24uZmVhdHVyZXNbaV0uYmJveCA6XG4gICAgICAgICAgICAoaXNGZWF0dXJlID8gZ2VvanNvbi5iYm94IDogdW5kZWZpbmVkKSk7XG4gICAgICAgIGZlYXR1cmVJZCA9IChpc0ZlYXR1cmVDb2xsZWN0aW9uID8gZ2VvanNvbi5mZWF0dXJlc1tpXS5pZCA6XG4gICAgICAgICAgICAoaXNGZWF0dXJlID8gZ2VvanNvbi5pZCA6IHVuZGVmaW5lZCkpO1xuICAgICAgICBpc0dlb21ldHJ5Q29sbGVjdGlvbiA9IChnZW9tZXRyeU1heWJlQ29sbGVjdGlvbikgPyBnZW9tZXRyeU1heWJlQ29sbGVjdGlvbi50eXBlID09PSAnR2VvbWV0cnlDb2xsZWN0aW9uJyA6IGZhbHNlO1xuICAgICAgICBzdG9wRyA9IGlzR2VvbWV0cnlDb2xsZWN0aW9uID8gZ2VvbWV0cnlNYXliZUNvbGxlY3Rpb24uZ2VvbWV0cmllcy5sZW5ndGggOiAxO1xuXG4gICAgICAgIGZvciAoZyA9IDA7IGcgPCBzdG9wRzsgZysrKSB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IGlzR2VvbWV0cnlDb2xsZWN0aW9uID9cbiAgICAgICAgICAgICAgICBnZW9tZXRyeU1heWJlQ29sbGVjdGlvbi5nZW9tZXRyaWVzW2ddIDogZ2VvbWV0cnlNYXliZUNvbGxlY3Rpb247XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBudWxsIEdlb21ldHJ5XG4gICAgICAgICAgICBpZiAoZ2VvbWV0cnkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sobnVsbCwgZmVhdHVyZUluZGV4LCBmZWF0dXJlUHJvcGVydGllcywgZmVhdHVyZUJCb3gsIGZlYXR1cmVJZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgICAgICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgICAgICAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgICAgICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICAgICAgICBjYXNlICdNdWx0aVBvbHlnb24nOiB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGdlb21ldHJ5LCBmZWF0dXJlSW5kZXgsIGZlYXR1cmVQcm9wZXJ0aWVzLCBmZWF0dXJlQkJveCwgZmVhdHVyZUlkKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ0dlb21ldHJ5Q29sbGVjdGlvbic6IHtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZ2VvbWV0cnkuZ2VvbWV0cmllcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2soZ2VvbWV0cnkuZ2VvbWV0cmllc1tqXSwgZmVhdHVyZUluZGV4LCBmZWF0dXJlUHJvcGVydGllcywgZmVhdHVyZUJCb3gsIGZlYXR1cmVJZCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gR2VvbWV0cnkgVHlwZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE9ubHkgaW5jcmVhc2UgYGZlYXR1cmVJbmRleGAgcGVyIGVhY2ggZmVhdHVyZVxuICAgICAgICBmZWF0dXJlSW5kZXgrKztcbiAgICB9XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGdlb21SZWR1Y2VcbiAqXG4gKiBUaGUgZmlyc3QgdGltZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgdmFsdWVzIHByb3ZpZGVkIGFzIGFyZ3VtZW50cyBkZXBlbmRcbiAqIG9uIHdoZXRoZXIgdGhlIHJlZHVjZSBtZXRob2QgaGFzIGFuIGluaXRpYWxWYWx1ZSBhcmd1bWVudC5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgcHJvdmlkZWQgdG8gdGhlIHJlZHVjZSBtZXRob2Q6XG4gKiAgLSBUaGUgcHJldmlvdXNWYWx1ZSBhcmd1bWVudCBpcyBpbml0aWFsVmFsdWUuXG4gKiAgLSBUaGUgY3VycmVudFZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgbm90IHByb3ZpZGVkOlxuICogIC0gVGhlIHByZXZpb3VzVmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICogIC0gVGhlIGN1cnJlbnRWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIHNlY29uZCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICpcbiAqIEBjYWxsYmFjayBnZW9tUmVkdWNlQ2FsbGJhY2tcbiAqIEBwYXJhbSB7Kn0gcHJldmlvdXNWYWx1ZSBUaGUgYWNjdW11bGF0ZWQgdmFsdWUgcHJldmlvdXNseSByZXR1cm5lZCBpbiB0aGUgbGFzdCBpbnZvY2F0aW9uXG4gKiBvZiB0aGUgY2FsbGJhY2ssIG9yIGluaXRpYWxWYWx1ZSwgaWYgc3VwcGxpZWQuXG4gKiBAcGFyYW0ge0dlb21ldHJ5fSBjdXJyZW50R2VvbWV0cnkgVGhlIGN1cnJlbnQgR2VvbWV0cnkgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gZmVhdHVyZVByb3BlcnRpZXMgVGhlIGN1cnJlbnQgRmVhdHVyZSBQcm9wZXJ0aWVzIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gZmVhdHVyZUJCb3ggVGhlIGN1cnJlbnQgRmVhdHVyZSBCQm94IGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gZmVhdHVyZUlkIFRoZSBjdXJyZW50IEZlYXR1cmUgSWQgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogUmVkdWNlIGdlb21ldHJ5IGluIGFueSBHZW9KU09OIG9iamVjdCwgc2ltaWxhciB0byBBcnJheS5yZWR1Y2UoKS5cbiAqXG4gKiBAbmFtZSBnZW9tUmVkdWNlXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEZlYXR1cmV8R2VvbWV0cnl9IGdlb2pzb24gYW55IEdlb0pTT04gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIG1ldGhvZCB0aGF0IHRha2VzIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50R2VvbWV0cnksIGZlYXR1cmVJbmRleCwgZmVhdHVyZVByb3BlcnRpZXMsIGZlYXR1cmVCQm94LCBmZWF0dXJlSWQpXG4gKiBAcGFyYW0geyp9IFtpbml0aWFsVmFsdWVdIFZhbHVlIHRvIHVzZSBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGZpcnN0IGNhbGwgb2YgdGhlIGNhbGxiYWNrLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSB0aGF0IHJlc3VsdHMgZnJvbSB0aGUgcmVkdWN0aW9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBmZWF0dXJlcyA9IHR1cmYuZmVhdHVyZUNvbGxlY3Rpb24oW1xuICogICAgIHR1cmYucG9pbnQoWzI2LCAzN10sIHtmb286ICdiYXInfSksXG4gKiAgICAgdHVyZi5wb2ludChbMzYsIDUzXSwge2hlbGxvOiAnd29ybGQnfSlcbiAqIF0pO1xuICpcbiAqIHR1cmYuZ2VvbVJlZHVjZShmZWF0dXJlcywgZnVuY3Rpb24gKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRHZW9tZXRyeSwgZmVhdHVyZUluZGV4LCBmZWF0dXJlUHJvcGVydGllcywgZmVhdHVyZUJCb3gsIGZlYXR1cmVJZCkge1xuICogICAvLz1wcmV2aW91c1ZhbHVlXG4gKiAgIC8vPWN1cnJlbnRHZW9tZXRyeVxuICogICAvLz1mZWF0dXJlSW5kZXhcbiAqICAgLy89ZmVhdHVyZVByb3BlcnRpZXNcbiAqICAgLy89ZmVhdHVyZUJCb3hcbiAqICAgLy89ZmVhdHVyZUlkXG4gKiAgIHJldHVybiBjdXJyZW50R2VvbWV0cnlcbiAqIH0pO1xuICovXG5mdW5jdGlvbiBnZW9tUmVkdWNlKGdlb2pzb24sIGNhbGxiYWNrLCBpbml0aWFsVmFsdWUpIHtcbiAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICBnZW9tRWFjaChnZW9qc29uLCBmdW5jdGlvbiAoY3VycmVudEdlb21ldHJ5LCBmZWF0dXJlSW5kZXgsIGZlYXR1cmVQcm9wZXJ0aWVzLCBmZWF0dXJlQkJveCwgZmVhdHVyZUlkKSB7XG4gICAgICAgIGlmIChmZWF0dXJlSW5kZXggPT09IDAgJiYgaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHByZXZpb3VzVmFsdWUgPSBjdXJyZW50R2VvbWV0cnk7XG4gICAgICAgIGVsc2UgcHJldmlvdXNWYWx1ZSA9IGNhbGxiYWNrKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRHZW9tZXRyeSwgZmVhdHVyZUluZGV4LCBmZWF0dXJlUHJvcGVydGllcywgZmVhdHVyZUJCb3gsIGZlYXR1cmVJZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByZXZpb3VzVmFsdWU7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGZsYXR0ZW5FYWNoXG4gKlxuICogQGNhbGxiYWNrIGZsYXR0ZW5FYWNoQ2FsbGJhY2tcbiAqIEBwYXJhbSB7RmVhdHVyZX0gY3VycmVudEZlYXR1cmUgVGhlIGN1cnJlbnQgZmxhdHRlbmVkIGZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlGZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIE11bHRpLUZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGZsYXR0ZW5lZCBmZWF0dXJlcyBpbiBhbnkgR2VvSlNPTiBvYmplY3QsIHNpbWlsYXIgdG9cbiAqIEFycmF5LmZvckVhY2guXG4gKlxuICogQG5hbWUgZmxhdHRlbkVhY2hcbiAqIEBwYXJhbSB7RmVhdHVyZUNvbGxlY3Rpb258RmVhdHVyZXxHZW9tZXRyeX0gZ2VvanNvbiBhbnkgR2VvSlNPTiBvYmplY3RcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGEgbWV0aG9kIHRoYXQgdGFrZXMgKGN1cnJlbnRGZWF0dXJlLCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4KVxuICogQGV4YW1wbGVcbiAqIHZhciBmZWF0dXJlcyA9IHR1cmYuZmVhdHVyZUNvbGxlY3Rpb24oW1xuICogICAgIHR1cmYucG9pbnQoWzI2LCAzN10sIHtmb286ICdiYXInfSksXG4gKiAgICAgdHVyZi5tdWx0aVBvaW50KFtbNDAsIDMwXSwgWzM2LCA1M11dLCB7aGVsbG86ICd3b3JsZCd9KVxuICogXSk7XG4gKlxuICogdHVyZi5mbGF0dGVuRWFjaChmZWF0dXJlcywgZnVuY3Rpb24gKGN1cnJlbnRGZWF0dXJlLCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4KSB7XG4gKiAgIC8vPWN1cnJlbnRGZWF0dXJlXG4gKiAgIC8vPWZlYXR1cmVJbmRleFxuICogICAvLz1tdWx0aUZlYXR1cmVJbmRleFxuICogfSk7XG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW5FYWNoKGdlb2pzb24sIGNhbGxiYWNrKSB7XG4gICAgZ2VvbUVhY2goZ2VvanNvbiwgZnVuY3Rpb24gKGdlb21ldHJ5LCBmZWF0dXJlSW5kZXgsIHByb3BlcnRpZXMsIGJib3gsIGlkKSB7XG4gICAgICAgIC8vIENhbGxiYWNrIGZvciBzaW5nbGUgZ2VvbWV0cnlcbiAgICAgICAgdmFyIHR5cGUgPSAoZ2VvbWV0cnkgPT09IG51bGwpID8gbnVsbCA6IGdlb21ldHJ5LnR5cGU7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGhlbHBlcnMuZmVhdHVyZShnZW9tZXRyeSwgcHJvcGVydGllcywge2Jib3g6IGJib3gsIGlkOiBpZH0pLCBmZWF0dXJlSW5kZXgsIDApID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdlb21UeXBlO1xuXG4gICAgICAgIC8vIENhbGxiYWNrIGZvciBtdWx0aS1nZW9tZXRyeVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgICAgICAgICBnZW9tVHlwZSA9ICdQb2ludCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgICAgICAgIGdlb21UeXBlID0gJ0xpbmVTdHJpbmcnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAgICAgICBnZW9tVHlwZSA9ICdQb2x5Z29uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgbXVsdGlGZWF0dXJlSW5kZXggPSAwOyBtdWx0aUZlYXR1cmVJbmRleCA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgbXVsdGlGZWF0dXJlSW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGUgPSBnZW9tZXRyeS5jb29yZGluYXRlc1ttdWx0aUZlYXR1cmVJbmRleF07XG4gICAgICAgICAgICB2YXIgZ2VvbSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBnZW9tVHlwZSxcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogY29vcmRpbmF0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhoZWxwZXJzLmZlYXR1cmUoZ2VvbSwgcHJvcGVydGllcyksIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGZsYXR0ZW5SZWR1Y2VcbiAqXG4gKiBUaGUgZmlyc3QgdGltZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgdmFsdWVzIHByb3ZpZGVkIGFzIGFyZ3VtZW50cyBkZXBlbmRcbiAqIG9uIHdoZXRoZXIgdGhlIHJlZHVjZSBtZXRob2QgaGFzIGFuIGluaXRpYWxWYWx1ZSBhcmd1bWVudC5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgcHJvdmlkZWQgdG8gdGhlIHJlZHVjZSBtZXRob2Q6XG4gKiAgLSBUaGUgcHJldmlvdXNWYWx1ZSBhcmd1bWVudCBpcyBpbml0aWFsVmFsdWUuXG4gKiAgLSBUaGUgY3VycmVudFZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgbm90IHByb3ZpZGVkOlxuICogIC0gVGhlIHByZXZpb3VzVmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICogIC0gVGhlIGN1cnJlbnRWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIHNlY29uZCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICpcbiAqIEBjYWxsYmFjayBmbGF0dGVuUmVkdWNlQ2FsbGJhY2tcbiAqIEBwYXJhbSB7Kn0gcHJldmlvdXNWYWx1ZSBUaGUgYWNjdW11bGF0ZWQgdmFsdWUgcHJldmlvdXNseSByZXR1cm5lZCBpbiB0aGUgbGFzdCBpbnZvY2F0aW9uXG4gKiBvZiB0aGUgY2FsbGJhY2ssIG9yIGluaXRpYWxWYWx1ZSwgaWYgc3VwcGxpZWQuXG4gKiBAcGFyYW0ge0ZlYXR1cmV9IGN1cnJlbnRGZWF0dXJlIFRoZSBjdXJyZW50IEZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlGZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIE11bHRpLUZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogUmVkdWNlIGZsYXR0ZW5lZCBmZWF0dXJlcyBpbiBhbnkgR2VvSlNPTiBvYmplY3QsIHNpbWlsYXIgdG8gQXJyYXkucmVkdWNlKCkuXG4gKlxuICogQG5hbWUgZmxhdHRlblJlZHVjZVxuICogQHBhcmFtIHtGZWF0dXJlQ29sbGVjdGlvbnxGZWF0dXJlfEdlb21ldHJ5fSBnZW9qc29uIGFueSBHZW9KU09OIG9iamVjdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBtZXRob2QgdGhhdCB0YWtlcyAocHJldmlvdXNWYWx1ZSwgY3VycmVudEZlYXR1cmUsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgpXG4gKiBAcGFyYW0geyp9IFtpbml0aWFsVmFsdWVdIFZhbHVlIHRvIHVzZSBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGZpcnN0IGNhbGwgb2YgdGhlIGNhbGxiYWNrLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSB0aGF0IHJlc3VsdHMgZnJvbSB0aGUgcmVkdWN0aW9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBmZWF0dXJlcyA9IHR1cmYuZmVhdHVyZUNvbGxlY3Rpb24oW1xuICogICAgIHR1cmYucG9pbnQoWzI2LCAzN10sIHtmb286ICdiYXInfSksXG4gKiAgICAgdHVyZi5tdWx0aVBvaW50KFtbNDAsIDMwXSwgWzM2LCA1M11dLCB7aGVsbG86ICd3b3JsZCd9KVxuICogXSk7XG4gKlxuICogdHVyZi5mbGF0dGVuUmVkdWNlKGZlYXR1cmVzLCBmdW5jdGlvbiAocHJldmlvdXNWYWx1ZSwgY3VycmVudEZlYXR1cmUsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgpIHtcbiAqICAgLy89cHJldmlvdXNWYWx1ZVxuICogICAvLz1jdXJyZW50RmVhdHVyZVxuICogICAvLz1mZWF0dXJlSW5kZXhcbiAqICAgLy89bXVsdGlGZWF0dXJlSW5kZXhcbiAqICAgcmV0dXJuIGN1cnJlbnRGZWF0dXJlXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gZmxhdHRlblJlZHVjZShnZW9qc29uLCBjYWxsYmFjaywgaW5pdGlhbFZhbHVlKSB7XG4gICAgdmFyIHByZXZpb3VzVmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgZmxhdHRlbkVhY2goZ2VvanNvbiwgZnVuY3Rpb24gKGN1cnJlbnRGZWF0dXJlLCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4KSB7XG4gICAgICAgIGlmIChmZWF0dXJlSW5kZXggPT09IDAgJiYgbXVsdGlGZWF0dXJlSW5kZXggPT09IDAgJiYgaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHByZXZpb3VzVmFsdWUgPSBjdXJyZW50RmVhdHVyZTtcbiAgICAgICAgZWxzZSBwcmV2aW91c1ZhbHVlID0gY2FsbGJhY2socHJldmlvdXNWYWx1ZSwgY3VycmVudEZlYXR1cmUsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcmV2aW91c1ZhbHVlO1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBzZWdtZW50RWFjaFxuICpcbiAqIEBjYWxsYmFjayBzZWdtZW50RWFjaENhbGxiYWNrXG4gKiBAcGFyYW0ge0ZlYXR1cmU8TGluZVN0cmluZz59IGN1cnJlbnRTZWdtZW50IFRoZSBjdXJyZW50IFNlZ21lbnQgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlGZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIE11bHRpLUZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGdlb21ldHJ5SW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEdlb21ldHJ5IGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzZWdtZW50SW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIFNlZ21lbnQgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgMi12ZXJ0ZXggbGluZSBzZWdtZW50IGluIGFueSBHZW9KU09OIG9iamVjdCwgc2ltaWxhciB0byBBcnJheS5mb3JFYWNoKClcbiAqIChNdWx0aSlQb2ludCBnZW9tZXRyaWVzIGRvIG5vdCBjb250YWluIHNlZ21lbnRzIHRoZXJlZm9yZSB0aGV5IGFyZSBpZ25vcmVkIGR1cmluZyB0aGlzIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEZlYXR1cmV8R2VvbWV0cnl9IGdlb2pzb24gYW55IEdlb0pTT05cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGEgbWV0aG9kIHRoYXQgdGFrZXMgKGN1cnJlbnRTZWdtZW50LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4LCBzZWdtZW50SW5kZXgpXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiB2YXIgcG9seWdvbiA9IHR1cmYucG9seWdvbihbW1stNTAsIDVdLCBbLTQwLCAtMTBdLCBbLTUwLCAtMTBdLCBbLTQwLCA1XSwgWy01MCwgNV1dXSk7XG4gKlxuICogLy8gSXRlcmF0ZSBvdmVyIEdlb0pTT04gYnkgMi12ZXJ0ZXggc2VnbWVudHNcbiAqIHR1cmYuc2VnbWVudEVhY2gocG9seWdvbiwgZnVuY3Rpb24gKGN1cnJlbnRTZWdtZW50LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4LCBzZWdtZW50SW5kZXgpIHtcbiAqICAgLy89Y3VycmVudFNlZ21lbnRcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiAgIC8vPW11bHRpRmVhdHVyZUluZGV4XG4gKiAgIC8vPWdlb21ldHJ5SW5kZXhcbiAqICAgLy89c2VnbWVudEluZGV4XG4gKiB9KTtcbiAqXG4gKiAvLyBDYWxjdWxhdGUgdGhlIHRvdGFsIG51bWJlciBvZiBzZWdtZW50c1xuICogdmFyIHRvdGFsID0gMDtcbiAqIHR1cmYuc2VnbWVudEVhY2gocG9seWdvbiwgZnVuY3Rpb24gKCkge1xuICogICAgIHRvdGFsKys7XG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gc2VnbWVudEVhY2goZ2VvanNvbiwgY2FsbGJhY2spIHtcbiAgICBmbGF0dGVuRWFjaChnZW9qc29uLCBmdW5jdGlvbiAoZmVhdHVyZSwgZmVhdHVyZUluZGV4LCBtdWx0aUZlYXR1cmVJbmRleCkge1xuICAgICAgICB2YXIgc2VnbWVudEluZGV4ID0gMDtcblxuICAgICAgICAvLyBFeGNsdWRlIG51bGwgR2VvbWV0cmllc1xuICAgICAgICBpZiAoIWZlYXR1cmUuZ2VvbWV0cnkpIHJldHVybjtcbiAgICAgICAgLy8gKE11bHRpKVBvaW50IGdlb21ldHJpZXMgZG8gbm90IGNvbnRhaW4gc2VnbWVudHMgdGhlcmVmb3JlIHRoZXkgYXJlIGlnbm9yZWQgZHVyaW5nIHRoaXMgb3BlcmF0aW9uLlxuICAgICAgICB2YXIgdHlwZSA9IGZlYXR1cmUuZ2VvbWV0cnkudHlwZTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdQb2ludCcgfHwgdHlwZSA9PT0gJ011bHRpUG9pbnQnKSByZXR1cm47XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgMi12ZXJ0ZXggbGluZSBzZWdtZW50c1xuICAgICAgICB2YXIgcHJldmlvdXNDb29yZHM7XG4gICAgICAgIHZhciBwcmV2aW91c0ZlYXR1cmVJbmRleCA9IDA7XG4gICAgICAgIHZhciBwcmV2aW91c011bHRpSW5kZXggPSAwO1xuICAgICAgICB2YXIgcHJldkdlb21JbmRleCA9IDA7XG4gICAgICAgIGlmIChjb29yZEVhY2goZmVhdHVyZSwgZnVuY3Rpb24gKGN1cnJlbnRDb29yZCwgY29vcmRJbmRleCwgZmVhdHVyZUluZGV4Q29vcmQsIG11bHRpUGFydEluZGV4Q29vcmQsIGdlb21ldHJ5SW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFNpbXVsYXRpbmcgYSBtZXRhLmNvb3JkUmVkdWNlKCkgc2luY2UgYHJlZHVjZWAgb3BlcmF0aW9ucyBjYW5ub3QgYmUgc3RvcHBlZCBieSByZXR1cm5pbmcgYGZhbHNlYFxuICAgICAgICAgICAgaWYgKHByZXZpb3VzQ29vcmRzID09PSB1bmRlZmluZWQgfHwgZmVhdHVyZUluZGV4ID4gcHJldmlvdXNGZWF0dXJlSW5kZXggfHwgbXVsdGlQYXJ0SW5kZXhDb29yZCA+IHByZXZpb3VzTXVsdGlJbmRleCB8fCBnZW9tZXRyeUluZGV4ID4gcHJldkdlb21JbmRleCkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzQ29vcmRzID0gY3VycmVudENvb3JkO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzRmVhdHVyZUluZGV4ID0gZmVhdHVyZUluZGV4O1xuICAgICAgICAgICAgICAgIHByZXZpb3VzTXVsdGlJbmRleCA9IG11bHRpUGFydEluZGV4Q29vcmQ7XG4gICAgICAgICAgICAgICAgcHJldkdlb21JbmRleCA9IGdlb21ldHJ5SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VnbWVudEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY3VycmVudFNlZ21lbnQgPSBoZWxwZXJzLmxpbmVTdHJpbmcoW3ByZXZpb3VzQ29vcmRzLCBjdXJyZW50Q29vcmRdLCBmZWF0dXJlLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGN1cnJlbnRTZWdtZW50LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4LCBzZWdtZW50SW5kZXgpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgc2VnbWVudEluZGV4Kys7XG4gICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyA9IGN1cnJlbnRDb29yZDtcbiAgICAgICAgfSkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIHNlZ21lbnRSZWR1Y2VcbiAqXG4gKiBUaGUgZmlyc3QgdGltZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgdmFsdWVzIHByb3ZpZGVkIGFzIGFyZ3VtZW50cyBkZXBlbmRcbiAqIG9uIHdoZXRoZXIgdGhlIHJlZHVjZSBtZXRob2QgaGFzIGFuIGluaXRpYWxWYWx1ZSBhcmd1bWVudC5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgcHJvdmlkZWQgdG8gdGhlIHJlZHVjZSBtZXRob2Q6XG4gKiAgLSBUaGUgcHJldmlvdXNWYWx1ZSBhcmd1bWVudCBpcyBpbml0aWFsVmFsdWUuXG4gKiAgLSBUaGUgY3VycmVudFZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBwcmVzZW50IGluIHRoZSBhcnJheS5cbiAqXG4gKiBJZiBhbiBpbml0aWFsVmFsdWUgaXMgbm90IHByb3ZpZGVkOlxuICogIC0gVGhlIHByZXZpb3VzVmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICogIC0gVGhlIGN1cnJlbnRWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIHNlY29uZCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICpcbiAqIEBjYWxsYmFjayBzZWdtZW50UmVkdWNlQ2FsbGJhY2tcbiAqIEBwYXJhbSB7Kn0gcHJldmlvdXNWYWx1ZSBUaGUgYWNjdW11bGF0ZWQgdmFsdWUgcHJldmlvdXNseSByZXR1cm5lZCBpbiB0aGUgbGFzdCBpbnZvY2F0aW9uXG4gKiBvZiB0aGUgY2FsbGJhY2ssIG9yIGluaXRpYWxWYWx1ZSwgaWYgc3VwcGxpZWQuXG4gKiBAcGFyYW0ge0ZlYXR1cmU8TGluZVN0cmluZz59IGN1cnJlbnRTZWdtZW50IFRoZSBjdXJyZW50IFNlZ21lbnQgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGZlYXR1cmVJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgRmVhdHVyZSBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlGZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIE11bHRpLUZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkLlxuICogQHBhcmFtIHtudW1iZXJ9IGdlb21ldHJ5SW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEdlb21ldHJ5IGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzZWdtZW50SW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIFNlZ21lbnQgYmVpbmcgcHJvY2Vzc2VkLlxuICovXG5cbi8qKlxuICogUmVkdWNlIDItdmVydGV4IGxpbmUgc2VnbWVudCBpbiBhbnkgR2VvSlNPTiBvYmplY3QsIHNpbWlsYXIgdG8gQXJyYXkucmVkdWNlKClcbiAqIChNdWx0aSlQb2ludCBnZW9tZXRyaWVzIGRvIG5vdCBjb250YWluIHNlZ21lbnRzIHRoZXJlZm9yZSB0aGV5IGFyZSBpZ25vcmVkIGR1cmluZyB0aGlzIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0ZlYXR1cmVDb2xsZWN0aW9ufEZlYXR1cmV8R2VvbWV0cnl9IGdlb2pzb24gYW55IEdlb0pTT05cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGEgbWV0aG9kIHRoYXQgdGFrZXMgKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRTZWdtZW50LCBjdXJyZW50SW5kZXgpXG4gKiBAcGFyYW0geyp9IFtpbml0aWFsVmFsdWVdIFZhbHVlIHRvIHVzZSBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGZpcnN0IGNhbGwgb2YgdGhlIGNhbGxiYWNrLlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogdmFyIHBvbHlnb24gPSB0dXJmLnBvbHlnb24oW1tbLTUwLCA1XSwgWy00MCwgLTEwXSwgWy01MCwgLTEwXSwgWy00MCwgNV0sIFstNTAsIDVdXV0pO1xuICpcbiAqIC8vIEl0ZXJhdGUgb3ZlciBHZW9KU09OIGJ5IDItdmVydGV4IHNlZ21lbnRzXG4gKiB0dXJmLnNlZ21lbnRSZWR1Y2UocG9seWdvbiwgZnVuY3Rpb24gKHByZXZpb3VzU2VnbWVudCwgY3VycmVudFNlZ21lbnQsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgsIHNlZ21lbnRJbmRleCkge1xuICogICAvLz0gcHJldmlvdXNTZWdtZW50XG4gKiAgIC8vPSBjdXJyZW50U2VnbWVudFxuICogICAvLz0gZmVhdHVyZUluZGV4XG4gKiAgIC8vPSBtdWx0aUZlYXR1cmVJbmRleFxuICogICAvLz0gZ2VvbWV0cnlJbmRleFxuICogICAvLz0gc2VnbWVudEluZXhcbiAqICAgcmV0dXJuIGN1cnJlbnRTZWdtZW50XG4gKiB9KTtcbiAqXG4gKiAvLyBDYWxjdWxhdGUgdGhlIHRvdGFsIG51bWJlciBvZiBzZWdtZW50c1xuICogdmFyIGluaXRpYWxWYWx1ZSA9IDBcbiAqIHZhciB0b3RhbCA9IHR1cmYuc2VnbWVudFJlZHVjZShwb2x5Z29uLCBmdW5jdGlvbiAocHJldmlvdXNWYWx1ZSkge1xuICogICAgIHByZXZpb3VzVmFsdWUrKztcbiAqICAgICByZXR1cm4gcHJldmlvdXNWYWx1ZTtcbiAqIH0sIGluaXRpYWxWYWx1ZSk7XG4gKi9cbmZ1bmN0aW9uIHNlZ21lbnRSZWR1Y2UoZ2VvanNvbiwgY2FsbGJhY2ssIGluaXRpYWxWYWx1ZSkge1xuICAgIHZhciBwcmV2aW91c1ZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgIHZhciBzdGFydGVkID0gZmFsc2U7XG4gICAgc2VnbWVudEVhY2goZ2VvanNvbiwgZnVuY3Rpb24gKGN1cnJlbnRTZWdtZW50LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4LCBzZWdtZW50SW5kZXgpIHtcbiAgICAgICAgaWYgKHN0YXJ0ZWQgPT09IGZhbHNlICYmIGluaXRpYWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSBwcmV2aW91c1ZhbHVlID0gY3VycmVudFNlZ21lbnQ7XG4gICAgICAgIGVsc2UgcHJldmlvdXNWYWx1ZSA9IGNhbGxiYWNrKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRTZWdtZW50LCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4LCBzZWdtZW50SW5kZXgpO1xuICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJldmlvdXNWYWx1ZTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgbGluZUVhY2hcbiAqXG4gKiBAY2FsbGJhY2sgbGluZUVhY2hDYWxsYmFja1xuICogQHBhcmFtIHtGZWF0dXJlPExpbmVTdHJpbmc+fSBjdXJyZW50TGluZSBUaGUgY3VycmVudCBMaW5lU3RyaW5nfExpbmVhclJpbmcgYmVpbmcgcHJvY2Vzc2VkXG4gKiBAcGFyYW0ge251bWJlcn0gZmVhdHVyZUluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBGZWF0dXJlIGJlaW5nIHByb2Nlc3NlZFxuICogQHBhcmFtIHtudW1iZXJ9IG11bHRpRmVhdHVyZUluZGV4IFRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBNdWx0aS1GZWF0dXJlIGJlaW5nIHByb2Nlc3NlZFxuICogQHBhcmFtIHtudW1iZXJ9IGdlb21ldHJ5SW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEdlb21ldHJ5IGJlaW5nIHByb2Nlc3NlZFxuICovXG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGxpbmUgb3IgcmluZyBjb29yZGluYXRlcyBpbiBMaW5lU3RyaW5nLCBQb2x5Z29uLCBNdWx0aUxpbmVTdHJpbmcsIE11bHRpUG9seWdvbiBGZWF0dXJlcyBvciBHZW9tZXRyaWVzLFxuICogc2ltaWxhciB0byBBcnJheS5mb3JFYWNoLlxuICpcbiAqIEBuYW1lIGxpbmVFYWNoXG4gKiBAcGFyYW0ge0dlb21ldHJ5fEZlYXR1cmU8TGluZVN0cmluZ3xQb2x5Z29ufE11bHRpTGluZVN0cmluZ3xNdWx0aVBvbHlnb24+fSBnZW9qc29uIG9iamVjdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBtZXRob2QgdGhhdCB0YWtlcyAoY3VycmVudExpbmUsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgpXG4gKiBAZXhhbXBsZVxuICogdmFyIG11bHRpTGluZSA9IHR1cmYubXVsdGlMaW5lU3RyaW5nKFtcbiAqICAgW1syNiwgMzddLCBbMzUsIDQ1XV0sXG4gKiAgIFtbMzYsIDUzXSwgWzM4LCA1MF0sIFs0MSwgNTVdXVxuICogXSk7XG4gKlxuICogdHVyZi5saW5lRWFjaChtdWx0aUxpbmUsIGZ1bmN0aW9uIChjdXJyZW50TGluZSwgZmVhdHVyZUluZGV4LCBtdWx0aUZlYXR1cmVJbmRleCwgZ2VvbWV0cnlJbmRleCkge1xuICogICAvLz1jdXJyZW50TGluZVxuICogICAvLz1mZWF0dXJlSW5kZXhcbiAqICAgLy89bXVsdGlGZWF0dXJlSW5kZXhcbiAqICAgLy89Z2VvbWV0cnlJbmRleFxuICogfSk7XG4gKi9cbmZ1bmN0aW9uIGxpbmVFYWNoKGdlb2pzb24sIGNhbGxiYWNrKSB7XG4gICAgLy8gdmFsaWRhdGlvblxuICAgIGlmICghZ2VvanNvbikgdGhyb3cgbmV3IEVycm9yKCdnZW9qc29uIGlzIHJlcXVpcmVkJyk7XG5cbiAgICBmbGF0dGVuRWFjaChnZW9qc29uLCBmdW5jdGlvbiAoZmVhdHVyZSwgZmVhdHVyZUluZGV4LCBtdWx0aUZlYXR1cmVJbmRleCkge1xuICAgICAgICBpZiAoZmVhdHVyZS5nZW9tZXRyeSA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICB2YXIgdHlwZSA9IGZlYXR1cmUuZ2VvbWV0cnkudHlwZTtcbiAgICAgICAgdmFyIGNvb3JkcyA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhmZWF0dXJlLCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCAwLCAwKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgICAgICAgIGZvciAodmFyIGdlb21ldHJ5SW5kZXggPSAwOyBnZW9tZXRyeUluZGV4IDwgY29vcmRzLmxlbmd0aDsgZ2VvbWV0cnlJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGhlbHBlcnMubGluZVN0cmluZyhjb29yZHNbZ2VvbWV0cnlJbmRleF0sIGZlYXR1cmUucHJvcGVydGllcyksIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgbGluZVJlZHVjZVxuICpcbiAqIFRoZSBmaXJzdCB0aW1lIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBpcyBjYWxsZWQsIHRoZSB2YWx1ZXMgcHJvdmlkZWQgYXMgYXJndW1lbnRzIGRlcGVuZFxuICogb24gd2hldGhlciB0aGUgcmVkdWNlIG1ldGhvZCBoYXMgYW4gaW5pdGlhbFZhbHVlIGFyZ3VtZW50LlxuICpcbiAqIElmIGFuIGluaXRpYWxWYWx1ZSBpcyBwcm92aWRlZCB0byB0aGUgcmVkdWNlIG1ldGhvZDpcbiAqICAtIFRoZSBwcmV2aW91c1ZhbHVlIGFyZ3VtZW50IGlzIGluaXRpYWxWYWx1ZS5cbiAqICAtIFRoZSBjdXJyZW50VmFsdWUgYXJndW1lbnQgaXMgdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5LlxuICpcbiAqIElmIGFuIGluaXRpYWxWYWx1ZSBpcyBub3QgcHJvdmlkZWQ6XG4gKiAgLSBUaGUgcHJldmlvdXNWYWx1ZSBhcmd1bWVudCBpcyB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGVsZW1lbnQgcHJlc2VudCBpbiB0aGUgYXJyYXkuXG4gKiAgLSBUaGUgY3VycmVudFZhbHVlIGFyZ3VtZW50IGlzIHRoZSB2YWx1ZSBvZiB0aGUgc2Vjb25kIGVsZW1lbnQgcHJlc2VudCBpbiB0aGUgYXJyYXkuXG4gKlxuICogQGNhbGxiYWNrIGxpbmVSZWR1Y2VDYWxsYmFja1xuICogQHBhcmFtIHsqfSBwcmV2aW91c1ZhbHVlIFRoZSBhY2N1bXVsYXRlZCB2YWx1ZSBwcmV2aW91c2x5IHJldHVybmVkIGluIHRoZSBsYXN0IGludm9jYXRpb25cbiAqIG9mIHRoZSBjYWxsYmFjaywgb3IgaW5pdGlhbFZhbHVlLCBpZiBzdXBwbGllZC5cbiAqIEBwYXJhbSB7RmVhdHVyZTxMaW5lU3RyaW5nPn0gY3VycmVudExpbmUgVGhlIGN1cnJlbnQgTGluZVN0cmluZ3xMaW5lYXJSaW5nIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIEZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlGZWF0dXJlSW5kZXggVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIE11bHRpLUZlYXR1cmUgYmVpbmcgcHJvY2Vzc2VkXG4gKiBAcGFyYW0ge251bWJlcn0gZ2VvbWV0cnlJbmRleCBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgR2VvbWV0cnkgYmVpbmcgcHJvY2Vzc2VkXG4gKi9cblxuLyoqXG4gKiBSZWR1Y2UgZmVhdHVyZXMgaW4gYW55IEdlb0pTT04gb2JqZWN0LCBzaW1pbGFyIHRvIEFycmF5LnJlZHVjZSgpLlxuICpcbiAqIEBuYW1lIGxpbmVSZWR1Y2VcbiAqIEBwYXJhbSB7R2VvbWV0cnl8RmVhdHVyZTxMaW5lU3RyaW5nfFBvbHlnb258TXVsdGlMaW5lU3RyaW5nfE11bHRpUG9seWdvbj59IGdlb2pzb24gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIG1ldGhvZCB0aGF0IHRha2VzIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50TGluZSwgZmVhdHVyZUluZGV4LCBtdWx0aUZlYXR1cmVJbmRleCwgZ2VvbWV0cnlJbmRleClcbiAqIEBwYXJhbSB7Kn0gW2luaXRpYWxWYWx1ZV0gVmFsdWUgdG8gdXNlIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgZmlyc3QgY2FsbCBvZiB0aGUgY2FsbGJhY2suXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlIHRoYXQgcmVzdWx0cyBmcm9tIHRoZSByZWR1Y3Rpb24uXG4gKiBAZXhhbXBsZVxuICogdmFyIG11bHRpUG9seSA9IHR1cmYubXVsdGlQb2x5Z29uKFtcbiAqICAgdHVyZi5wb2x5Z29uKFtbWzEyLDQ4XSxbMiw0MV0sWzI0LDM4XSxbMTIsNDhdXSwgW1s5LDQ0XSxbMTMsNDFdLFsxMyw0NV0sWzksNDRdXV0pLFxuICogICB0dXJmLnBvbHlnb24oW1tbNSwgNV0sIFswLCAwXSwgWzIsIDJdLCBbNCwgNF0sIFs1LCA1XV1dKVxuICogXSk7XG4gKlxuICogdHVyZi5saW5lUmVkdWNlKG11bHRpUG9seSwgZnVuY3Rpb24gKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRMaW5lLCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4KSB7XG4gKiAgIC8vPXByZXZpb3VzVmFsdWVcbiAqICAgLy89Y3VycmVudExpbmVcbiAqICAgLy89ZmVhdHVyZUluZGV4XG4gKiAgIC8vPW11bHRpRmVhdHVyZUluZGV4XG4gKiAgIC8vPWdlb21ldHJ5SW5kZXhcbiAqICAgcmV0dXJuIGN1cnJlbnRMaW5lXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gbGluZVJlZHVjZShnZW9qc29uLCBjYWxsYmFjaywgaW5pdGlhbFZhbHVlKSB7XG4gICAgdmFyIHByZXZpb3VzVmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgbGluZUVhY2goZ2VvanNvbiwgZnVuY3Rpb24gKGN1cnJlbnRMaW5lLCBmZWF0dXJlSW5kZXgsIG11bHRpRmVhdHVyZUluZGV4LCBnZW9tZXRyeUluZGV4KSB7XG4gICAgICAgIGlmIChmZWF0dXJlSW5kZXggPT09IDAgJiYgaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIHByZXZpb3VzVmFsdWUgPSBjdXJyZW50TGluZTtcbiAgICAgICAgZWxzZSBwcmV2aW91c1ZhbHVlID0gY2FsbGJhY2socHJldmlvdXNWYWx1ZSwgY3VycmVudExpbmUsIGZlYXR1cmVJbmRleCwgbXVsdGlGZWF0dXJlSW5kZXgsIGdlb21ldHJ5SW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcmV2aW91c1ZhbHVlO1xufVxuXG4vKipcbiAqIEZpbmRzIGEgcGFydGljdWxhciAyLXZlcnRleCBMaW5lU3RyaW5nIFNlZ21lbnQgZnJvbSBhIEdlb0pTT04gdXNpbmcgYEB0dXJmL21ldGFgIGluZGV4ZXMuXG4gKlxuICogTmVnYXRpdmUgaW5kZXhlcyBhcmUgcGVybWl0dGVkLlxuICogUG9pbnQgJiBNdWx0aVBvaW50IHdpbGwgYWx3YXlzIHJldHVybiBudWxsLlxuICpcbiAqIEBwYXJhbSB7RmVhdHVyZUNvbGxlY3Rpb258RmVhdHVyZXxHZW9tZXRyeX0gZ2VvanNvbiBBbnkgR2VvSlNPTiBGZWF0dXJlIG9yIEdlb21ldHJ5XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbmFsIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5mZWF0dXJlSW5kZXg9MF0gRmVhdHVyZSBJbmRleFxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm11bHRpRmVhdHVyZUluZGV4PTBdIE11bHRpLUZlYXR1cmUgSW5kZXhcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5nZW9tZXRyeUluZGV4PTBdIEdlb21ldHJ5IEluZGV4XG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2VnbWVudEluZGV4PTBdIFNlZ21lbnQgSW5kZXhcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5wcm9wZXJ0aWVzPXt9XSBUcmFuc2xhdGUgUHJvcGVydGllcyB0byBvdXRwdXQgTGluZVN0cmluZ1xuICogQHBhcmFtIHtCQm94fSBbb3B0aW9ucy5iYm94PXt9XSBUcmFuc2xhdGUgQkJveCB0byBvdXRwdXQgTGluZVN0cmluZ1xuICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBbb3B0aW9ucy5pZD17fV0gVHJhbnNsYXRlIElkIHRvIG91dHB1dCBMaW5lU3RyaW5nXG4gKiBAcmV0dXJucyB7RmVhdHVyZTxMaW5lU3RyaW5nPn0gMi12ZXJ0ZXggR2VvSlNPTiBGZWF0dXJlIExpbmVTdHJpbmdcbiAqIEBleGFtcGxlXG4gKiB2YXIgbXVsdGlMaW5lID0gdHVyZi5tdWx0aUxpbmVTdHJpbmcoW1xuICogICAgIFtbMTAsIDEwXSwgWzUwLCAzMF0sIFszMCwgNDBdXSxcbiAqICAgICBbWy0xMCwgLTEwXSwgWy01MCwgLTMwXSwgWy0zMCwgLTQwXV1cbiAqIF0pO1xuICpcbiAqIC8vIEZpcnN0IFNlZ21lbnQgKGRlZmF1bHRzIGFyZSAwKVxuICogdHVyZi5maW5kU2VnbWVudChtdWx0aUxpbmUpO1xuICogLy8gPT4gRmVhdHVyZTxMaW5lU3RyaW5nPFtbMTAsIDEwXSwgWzUwLCAzMF1dPj5cbiAqXG4gKiAvLyBGaXJzdCBTZWdtZW50IG9mIDJuZCBNdWx0aSBGZWF0dXJlXG4gKiB0dXJmLmZpbmRTZWdtZW50KG11bHRpTGluZSwge211bHRpRmVhdHVyZUluZGV4OiAxfSk7XG4gKiAvLyA9PiBGZWF0dXJlPExpbmVTdHJpbmc8W1stMTAsIC0xMF0sIFstNTAsIC0zMF1dPj5cbiAqXG4gKiAvLyBMYXN0IFNlZ21lbnQgb2YgTGFzdCBNdWx0aSBGZWF0dXJlXG4gKiB0dXJmLmZpbmRTZWdtZW50KG11bHRpTGluZSwge211bHRpRmVhdHVyZUluZGV4OiAtMSwgc2VnbWVudEluZGV4OiAtMX0pO1xuICogLy8gPT4gRmVhdHVyZTxMaW5lU3RyaW5nPFtbLTUwLCAtMzBdLCBbLTMwLCAtNDBdXT4+XG4gKi9cbmZ1bmN0aW9uIGZpbmRTZWdtZW50KGdlb2pzb24sIG9wdGlvbnMpIHtcbiAgICAvLyBPcHRpb25hbCBQYXJhbWV0ZXJzXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKCFoZWxwZXJzLmlzT2JqZWN0KG9wdGlvbnMpKSB0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMgaXMgaW52YWxpZCcpO1xuICAgIHZhciBmZWF0dXJlSW5kZXggPSBvcHRpb25zLmZlYXR1cmVJbmRleCB8fCAwO1xuICAgIHZhciBtdWx0aUZlYXR1cmVJbmRleCA9IG9wdGlvbnMubXVsdGlGZWF0dXJlSW5kZXggfHwgMDtcbiAgICB2YXIgZ2VvbWV0cnlJbmRleCA9IG9wdGlvbnMuZ2VvbWV0cnlJbmRleCB8fCAwO1xuICAgIHZhciBzZWdtZW50SW5kZXggPSBvcHRpb25zLnNlZ21lbnRJbmRleCB8fCAwO1xuXG4gICAgLy8gRmluZCBGZWF0dXJlSW5kZXhcbiAgICB2YXIgcHJvcGVydGllcyA9IG9wdGlvbnMucHJvcGVydGllcztcbiAgICB2YXIgZ2VvbWV0cnk7XG5cbiAgICBzd2l0Y2ggKGdlb2pzb24udHlwZSkge1xuICAgIGNhc2UgJ0ZlYXR1cmVDb2xsZWN0aW9uJzpcbiAgICAgICAgaWYgKGZlYXR1cmVJbmRleCA8IDApIGZlYXR1cmVJbmRleCA9IGdlb2pzb24uZmVhdHVyZXMubGVuZ3RoICsgZmVhdHVyZUluZGV4O1xuICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCBnZW9qc29uLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF0ucHJvcGVydGllcztcbiAgICAgICAgZ2VvbWV0cnkgPSBnZW9qc29uLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF0uZ2VvbWV0cnk7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ZlYXR1cmUnOlxuICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCBnZW9qc29uLnByb3BlcnRpZXM7XG4gICAgICAgIGdlb21ldHJ5ID0gZ2VvanNvbi5nZW9tZXRyeTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnUG9pbnQnOlxuICAgIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAgIGdlb21ldHJ5ID0gZ2VvanNvbjtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZW9qc29uIGlzIGludmFsaWQnKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIFNlZ21lbnRJbmRleFxuICAgIGlmIChnZW9tZXRyeSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIGNvb3JkcyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAgIGlmIChzZWdtZW50SW5kZXggPCAwKSBzZWdtZW50SW5kZXggPSBjb29yZHMubGVuZ3RoICsgc2VnbWVudEluZGV4IC0gMTtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMubGluZVN0cmluZyhbY29vcmRzW3NlZ21lbnRJbmRleF0sIGNvb3Jkc1tzZWdtZW50SW5kZXggKyAxXV0sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgICBpZiAoZ2VvbWV0cnlJbmRleCA8IDApIGdlb21ldHJ5SW5kZXggPSBjb29yZHMubGVuZ3RoICsgZ2VvbWV0cnlJbmRleDtcbiAgICAgICAgaWYgKHNlZ21lbnRJbmRleCA8IDApIHNlZ21lbnRJbmRleCA9IGNvb3Jkc1tnZW9tZXRyeUluZGV4XS5sZW5ndGggKyBzZWdtZW50SW5kZXggLSAxO1xuICAgICAgICByZXR1cm4gaGVscGVycy5saW5lU3RyaW5nKFtjb29yZHNbZ2VvbWV0cnlJbmRleF1bc2VnbWVudEluZGV4XSwgY29vcmRzW2dlb21ldHJ5SW5kZXhdW3NlZ21lbnRJbmRleCArIDFdXSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgICAgaWYgKG11bHRpRmVhdHVyZUluZGV4IDwgMCkgbXVsdGlGZWF0dXJlSW5kZXggPSBjb29yZHMubGVuZ3RoICsgbXVsdGlGZWF0dXJlSW5kZXg7XG4gICAgICAgIGlmIChzZWdtZW50SW5kZXggPCAwKSBzZWdtZW50SW5kZXggPSBjb29yZHNbbXVsdGlGZWF0dXJlSW5kZXhdLmxlbmd0aCArIHNlZ21lbnRJbmRleCAtIDE7XG4gICAgICAgIHJldHVybiBoZWxwZXJzLmxpbmVTdHJpbmcoW2Nvb3Jkc1ttdWx0aUZlYXR1cmVJbmRleF1bc2VnbWVudEluZGV4XSwgY29vcmRzW211bHRpRmVhdHVyZUluZGV4XVtzZWdtZW50SW5kZXggKyAxXV0sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAgIGlmIChtdWx0aUZlYXR1cmVJbmRleCA8IDApIG11bHRpRmVhdHVyZUluZGV4ID0gY29vcmRzLmxlbmd0aCArIG11bHRpRmVhdHVyZUluZGV4O1xuICAgICAgICBpZiAoZ2VvbWV0cnlJbmRleCA8IDApIGdlb21ldHJ5SW5kZXggPSBjb29yZHNbbXVsdGlGZWF0dXJlSW5kZXhdLmxlbmd0aCArIGdlb21ldHJ5SW5kZXg7XG4gICAgICAgIGlmIChzZWdtZW50SW5kZXggPCAwKSBzZWdtZW50SW5kZXggPSBjb29yZHNbbXVsdGlGZWF0dXJlSW5kZXhdW2dlb21ldHJ5SW5kZXhdLmxlbmd0aCAtIHNlZ21lbnRJbmRleCAtIDE7XG4gICAgICAgIHJldHVybiBoZWxwZXJzLmxpbmVTdHJpbmcoW2Nvb3Jkc1ttdWx0aUZlYXR1cmVJbmRleF1bZ2VvbWV0cnlJbmRleF1bc2VnbWVudEluZGV4XSwgY29vcmRzW211bHRpRmVhdHVyZUluZGV4XVtnZW9tZXRyeUluZGV4XVtzZWdtZW50SW5kZXggKyAxXV0sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dlb2pzb24gaXMgaW52YWxpZCcpO1xufVxuXG4vKipcbiAqIEZpbmRzIGEgcGFydGljdWxhciBQb2ludCBmcm9tIGEgR2VvSlNPTiB1c2luZyBgQHR1cmYvbWV0YWAgaW5kZXhlcy5cbiAqXG4gKiBOZWdhdGl2ZSBpbmRleGVzIGFyZSBwZXJtaXR0ZWQuXG4gKlxuICogQHBhcmFtIHtGZWF0dXJlQ29sbGVjdGlvbnxGZWF0dXJlfEdlb21ldHJ5fSBnZW9qc29uIEFueSBHZW9KU09OIEZlYXR1cmUgb3IgR2VvbWV0cnlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9uYWwgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmZlYXR1cmVJbmRleD0wXSBGZWF0dXJlIEluZGV4XG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubXVsdGlGZWF0dXJlSW5kZXg9MF0gTXVsdGktRmVhdHVyZSBJbmRleFxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmdlb21ldHJ5SW5kZXg9MF0gR2VvbWV0cnkgSW5kZXhcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5jb29yZEluZGV4PTBdIENvb3JkIEluZGV4XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucHJvcGVydGllcz17fV0gVHJhbnNsYXRlIFByb3BlcnRpZXMgdG8gb3V0cHV0IFBvaW50XG4gKiBAcGFyYW0ge0JCb3h9IFtvcHRpb25zLmJib3g9e31dIFRyYW5zbGF0ZSBCQm94IHRvIG91dHB1dCBQb2ludFxuICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBbb3B0aW9ucy5pZD17fV0gVHJhbnNsYXRlIElkIHRvIG91dHB1dCBQb2ludFxuICogQHJldHVybnMge0ZlYXR1cmU8UG9pbnQ+fSAyLXZlcnRleCBHZW9KU09OIEZlYXR1cmUgUG9pbnRcbiAqIEBleGFtcGxlXG4gKiB2YXIgbXVsdGlMaW5lID0gdHVyZi5tdWx0aUxpbmVTdHJpbmcoW1xuICogICAgIFtbMTAsIDEwXSwgWzUwLCAzMF0sIFszMCwgNDBdXSxcbiAqICAgICBbWy0xMCwgLTEwXSwgWy01MCwgLTMwXSwgWy0zMCwgLTQwXV1cbiAqIF0pO1xuICpcbiAqIC8vIEZpcnN0IFNlZ21lbnQgKGRlZmF1bHRzIGFyZSAwKVxuICogdHVyZi5maW5kUG9pbnQobXVsdGlMaW5lKTtcbiAqIC8vID0+IEZlYXR1cmU8UG9pbnQ8WzEwLCAxMF0+PlxuICpcbiAqIC8vIEZpcnN0IFNlZ21lbnQgb2YgdGhlIDJuZCBNdWx0aS1GZWF0dXJlXG4gKiB0dXJmLmZpbmRQb2ludChtdWx0aUxpbmUsIHttdWx0aUZlYXR1cmVJbmRleDogMX0pO1xuICogLy8gPT4gRmVhdHVyZTxQb2ludDxbLTEwLCAtMTBdPj5cbiAqXG4gKiAvLyBMYXN0IFNlZ21lbnQgb2YgbGFzdCBNdWx0aS1GZWF0dXJlXG4gKiB0dXJmLmZpbmRQb2ludChtdWx0aUxpbmUsIHttdWx0aUZlYXR1cmVJbmRleDogLTEsIGNvb3JkSW5kZXg6IC0xfSk7XG4gKiAvLyA9PiBGZWF0dXJlPFBvaW50PFstMzAsIC00MF0+PlxuICovXG5mdW5jdGlvbiBmaW5kUG9pbnQoZ2VvanNvbiwgb3B0aW9ucykge1xuICAgIC8vIE9wdGlvbmFsIFBhcmFtZXRlcnNcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoIWhlbHBlcnMuaXNPYmplY3Qob3B0aW9ucykpIHRocm93IG5ldyBFcnJvcignb3B0aW9ucyBpcyBpbnZhbGlkJyk7XG4gICAgdmFyIGZlYXR1cmVJbmRleCA9IG9wdGlvbnMuZmVhdHVyZUluZGV4IHx8IDA7XG4gICAgdmFyIG11bHRpRmVhdHVyZUluZGV4ID0gb3B0aW9ucy5tdWx0aUZlYXR1cmVJbmRleCB8fCAwO1xuICAgIHZhciBnZW9tZXRyeUluZGV4ID0gb3B0aW9ucy5nZW9tZXRyeUluZGV4IHx8IDA7XG4gICAgdmFyIGNvb3JkSW5kZXggPSBvcHRpb25zLmNvb3JkSW5kZXggfHwgMDtcblxuICAgIC8vIEZpbmQgRmVhdHVyZUluZGV4XG4gICAgdmFyIHByb3BlcnRpZXMgPSBvcHRpb25zLnByb3BlcnRpZXM7XG4gICAgdmFyIGdlb21ldHJ5O1xuXG4gICAgc3dpdGNoIChnZW9qc29uLnR5cGUpIHtcbiAgICBjYXNlICdGZWF0dXJlQ29sbGVjdGlvbic6XG4gICAgICAgIGlmIChmZWF0dXJlSW5kZXggPCAwKSBmZWF0dXJlSW5kZXggPSBnZW9qc29uLmZlYXR1cmVzLmxlbmd0aCArIGZlYXR1cmVJbmRleDtcbiAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwgZ2VvanNvbi5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdLnByb3BlcnRpZXM7XG4gICAgICAgIGdlb21ldHJ5ID0gZ2VvanNvbi5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdLmdlb21ldHJ5O1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdGZWF0dXJlJzpcbiAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwgZ2VvanNvbi5wcm9wZXJ0aWVzO1xuICAgICAgICBnZW9tZXRyeSA9IGdlb2pzb24uZ2VvbWV0cnk7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgICBnZW9tZXRyeSA9IGdlb2pzb247XG4gICAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZ2VvanNvbiBpcyBpbnZhbGlkJyk7XG4gICAgfVxuXG4gICAgLy8gRmluZCBDb29yZCBJbmRleFxuICAgIGlmIChnZW9tZXRyeSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIGNvb3JkcyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMucG9pbnQoY29vcmRzLCBwcm9wZXJ0aWVzLCBvcHRpb25zKTtcbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICAgICAgaWYgKG11bHRpRmVhdHVyZUluZGV4IDwgMCkgbXVsdGlGZWF0dXJlSW5kZXggPSBjb29yZHMubGVuZ3RoICsgbXVsdGlGZWF0dXJlSW5kZXg7XG4gICAgICAgIHJldHVybiBoZWxwZXJzLnBvaW50KGNvb3Jkc1ttdWx0aUZlYXR1cmVJbmRleF0sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgICBpZiAoY29vcmRJbmRleCA8IDApIGNvb3JkSW5kZXggPSBjb29yZHMubGVuZ3RoICsgY29vcmRJbmRleDtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMucG9pbnQoY29vcmRzW2Nvb3JkSW5kZXhdLCBwcm9wZXJ0aWVzLCBvcHRpb25zKTtcbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgICAgaWYgKGdlb21ldHJ5SW5kZXggPCAwKSBnZW9tZXRyeUluZGV4ID0gY29vcmRzLmxlbmd0aCArIGdlb21ldHJ5SW5kZXg7XG4gICAgICAgIGlmIChjb29yZEluZGV4IDwgMCkgY29vcmRJbmRleCA9IGNvb3Jkc1tnZW9tZXRyeUluZGV4XS5sZW5ndGggKyBjb29yZEluZGV4O1xuICAgICAgICByZXR1cm4gaGVscGVycy5wb2ludChjb29yZHNbZ2VvbWV0cnlJbmRleF1bY29vcmRJbmRleF0sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICAgIGlmIChtdWx0aUZlYXR1cmVJbmRleCA8IDApIG11bHRpRmVhdHVyZUluZGV4ID0gY29vcmRzLmxlbmd0aCArIG11bHRpRmVhdHVyZUluZGV4O1xuICAgICAgICBpZiAoY29vcmRJbmRleCA8IDApIGNvb3JkSW5kZXggPSBjb29yZHNbbXVsdGlGZWF0dXJlSW5kZXhdLmxlbmd0aCArIGNvb3JkSW5kZXg7XG4gICAgICAgIHJldHVybiBoZWxwZXJzLnBvaW50KGNvb3Jkc1ttdWx0aUZlYXR1cmVJbmRleF1bY29vcmRJbmRleF0sIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAgIGlmIChtdWx0aUZlYXR1cmVJbmRleCA8IDApIG11bHRpRmVhdHVyZUluZGV4ID0gY29vcmRzLmxlbmd0aCArIG11bHRpRmVhdHVyZUluZGV4O1xuICAgICAgICBpZiAoZ2VvbWV0cnlJbmRleCA8IDApIGdlb21ldHJ5SW5kZXggPSBjb29yZHNbbXVsdGlGZWF0dXJlSW5kZXhdLmxlbmd0aCArIGdlb21ldHJ5SW5kZXg7XG4gICAgICAgIGlmIChjb29yZEluZGV4IDwgMCkgY29vcmRJbmRleCA9IGNvb3Jkc1ttdWx0aUZlYXR1cmVJbmRleF1bZ2VvbWV0cnlJbmRleF0ubGVuZ3RoIC0gY29vcmRJbmRleDtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMucG9pbnQoY29vcmRzW211bHRpRmVhdHVyZUluZGV4XVtnZW9tZXRyeUluZGV4XVtjb29yZEluZGV4XSwgcHJvcGVydGllcywgb3B0aW9ucyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignZ2VvanNvbiBpcyBpbnZhbGlkJyk7XG59XG5cbmV4cG9ydHMuY29vcmRFYWNoID0gY29vcmRFYWNoO1xuZXhwb3J0cy5jb29yZFJlZHVjZSA9IGNvb3JkUmVkdWNlO1xuZXhwb3J0cy5wcm9wRWFjaCA9IHByb3BFYWNoO1xuZXhwb3J0cy5wcm9wUmVkdWNlID0gcHJvcFJlZHVjZTtcbmV4cG9ydHMuZmVhdHVyZUVhY2ggPSBmZWF0dXJlRWFjaDtcbmV4cG9ydHMuZmVhdHVyZVJlZHVjZSA9IGZlYXR1cmVSZWR1Y2U7XG5leHBvcnRzLmNvb3JkQWxsID0gY29vcmRBbGw7XG5leHBvcnRzLmdlb21FYWNoID0gZ2VvbUVhY2g7XG5leHBvcnRzLmdlb21SZWR1Y2UgPSBnZW9tUmVkdWNlO1xuZXhwb3J0cy5mbGF0dGVuRWFjaCA9IGZsYXR0ZW5FYWNoO1xuZXhwb3J0cy5mbGF0dGVuUmVkdWNlID0gZmxhdHRlblJlZHVjZTtcbmV4cG9ydHMuc2VnbWVudEVhY2ggPSBzZWdtZW50RWFjaDtcbmV4cG9ydHMuc2VnbWVudFJlZHVjZSA9IHNlZ21lbnRSZWR1Y2U7XG5leHBvcnRzLmxpbmVFYWNoID0gbGluZUVhY2g7XG5leHBvcnRzLmxpbmVSZWR1Y2UgPSBsaW5lUmVkdWNlO1xuZXhwb3J0cy5maW5kU2VnbWVudCA9IGZpbmRTZWdtZW50O1xuZXhwb3J0cy5maW5kUG9pbnQgPSBmaW5kUG9pbnQ7XG4iLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qIGdsb2JhbCBCbG9iLCBGaWxlUmVhZGVyICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmxvYlRvQnVmZmVyIChibG9iLCBjYikge1xuICBpZiAodHlwZW9mIEJsb2IgPT09ICd1bmRlZmluZWQnIHx8ICEoYmxvYiBpbnN0YW5jZW9mIEJsb2IpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgQmxvYicpXG4gIH1cbiAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpXG4gIH1cblxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuXG4gIGZ1bmN0aW9uIG9uTG9hZEVuZCAoZSkge1xuICAgIHJlYWRlci5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgb25Mb2FkRW5kLCBmYWxzZSlcbiAgICBpZiAoZS5lcnJvcikgY2IoZS5lcnJvcilcbiAgICBlbHNlIGNiKG51bGwsIEJ1ZmZlci5mcm9tKHJlYWRlci5yZXN1bHQpKVxuICB9XG5cbiAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCBvbkxvYWRFbmQsIGZhbHNlKVxuICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbn1cbiIsIiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG52YXIgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHsgX19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9IH1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgbGVuZ3RoICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgYnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGJ1ZlxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAhPSBudWxsICYmXG4gICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgdmFsdWU6IG51bGwsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuZnVuY3Rpb24gZnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICAgIClcbiAgfVxuXG4gIGlmIChpc0luc3RhbmNlKHZhbHVlLCBBcnJheUJ1ZmZlcikgfHxcbiAgICAgICh2YWx1ZSAmJiBpc0luc3RhbmNlKHZhbHVlLmJ1ZmZlciwgQXJyYXlCdWZmZXIpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICApXG4gIH1cblxuICB2YXIgdmFsdWVPZiA9IHZhbHVlLnZhbHVlT2YgJiYgdmFsdWUudmFsdWVPZigpXG4gIGlmICh2YWx1ZU9mICE9IG51bGwgJiYgdmFsdWVPZiAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odmFsdWVPZiwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgdmFyIGIgPSBmcm9tT2JqZWN0KHZhbHVlKVxuICBpZiAoYikgcmV0dXJuIGJcblxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvUHJpbWl0aXZlICE9IG51bGwgJiZcbiAgICAgIHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFxuICAgICAgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSgnc3RyaW5nJyksIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aFxuICAgIClcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIE5vdGU6IENoYW5nZSBwcm90b3R5cGUgKmFmdGVyKiBCdWZmZXIuZnJvbSBpcyBkZWZpbmVkIHRvIHdvcmthcm91bmQgQ2hyb21lIGJ1Zzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvMTQ4XG5CdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG5CdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgc2l6ZSArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSBidWYud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcIm9mZnNldFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wibGVuZ3RoXCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIHZhciBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAob2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgIH1cbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlICYmXG4gICAgYiAhPT0gQnVmZmVyLnByb3RvdHlwZSAvLyBzbyBCdWZmZXIuaXNCdWZmZXIoQnVmZmVyLnByb3RvdHlwZSkgd2lsbCBiZSBmYWxzZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYSwgVWludDhBcnJheSkpIGEgPSBCdWZmZXIuZnJvbShhLCBhLm9mZnNldCwgYS5ieXRlTGVuZ3RoKVxuICBpZiAoaXNJbnN0YW5jZShiLCBVaW50OEFycmF5KSkgYiA9IEJ1ZmZlci5mcm9tKGIsIGIub2Zmc2V0LCBiLmJ5dGVMZW5ndGgpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcImJ1ZjFcIiwgXCJidWYyXCIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknXG4gICAgKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKGlzSW5zdGFuY2UoYnVmLCBVaW50OEFycmF5KSkge1xuICAgICAgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBpc0luc3RhbmNlKHN0cmluZywgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBvciBBcnJheUJ1ZmZlci4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHN0cmluZ1xuICAgIClcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBtdXN0TWF0Y2ggPSAoYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdID09PSB0cnVlKVxuICBpZiAoIW11c3RNYXRjaCAmJiBsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHtcbiAgICAgICAgICByZXR1cm4gbXVzdE1hdGNoID8gLTEgOiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICB9XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZ1xuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLnJlcGxhY2UoLyguezJ9KS9nLCAnJDEgJykudHJpbSgpXG4gIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKGlzSW5zdGFuY2UodGFyZ2V0LCBVaW50OEFycmF5KSkge1xuICAgIHRhcmdldCA9IEJ1ZmZlci5mcm9tKHRhcmdldCwgdGFyZ2V0Lm9mZnNldCwgdGFyZ2V0LmJ5dGVMZW5ndGgpXG4gIH1cbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidGFyZ2V0XCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB0YXJnZXQpXG4gICAgKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBVc2UgYnVpbHQtaW4gd2hlbiBhdmFpbGFibGUsIG1pc3NpbmcgZnJvbSBJRTExXG4gICAgdGhpcy5jb3B5V2l0aGluKHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKVxuICB9IGVsc2UgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yICh2YXIgaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSB0YWtlcyBlcXVhbCBzaWducyBhcyBlbmQgb2YgdGhlIEJhc2U2NCBlbmNvZGluZ1xuICBzdHIgPSBzdHIuc3BsaXQoJz0nKVswXVxuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbi8vIEFycmF5QnVmZmVyIG9yIFVpbnQ4QXJyYXkgb2JqZWN0cyBmcm9tIG90aGVyIGNvbnRleHRzIChpLmUuIGlmcmFtZXMpIGRvIG5vdCBwYXNzXG4vLyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrIGJ1dCB0aGV5IHNob3VsZCBiZSB0cmVhdGVkIGFzIG9mIHRoYXQgdHlwZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNJbnN0YW5jZSAob2JqLCB0eXBlKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiB0eXBlIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lICE9IG51bGwgJiZcbiAgICAgIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLm5hbWUpXG59XG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIC8vIEZvciBJRTExIHN1cHBvcnRcbiAgcmV0dXJuIG9iaiAhPT0gb2JqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwucHJvajQgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cblx0dmFyIGdsb2JhbHMgPSBmdW5jdGlvbihkZWZzKSB7XG5cdCAgZGVmcygnRVBTRzo0MzI2JywgXCIrdGl0bGU9V0dTIDg0IChsb25nL2xhdCkgK3Byb2o9bG9uZ2xhdCArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICt1bml0cz1kZWdyZWVzXCIpO1xuXHQgIGRlZnMoJ0VQU0c6NDI2OScsIFwiK3RpdGxlPU5BRDgzIChsb25nL2xhdCkgK3Byb2o9bG9uZ2xhdCArYT02Mzc4MTM3LjAgK2I9NjM1Njc1Mi4zMTQxNDAzNiArZWxscHM9R1JTODAgK2RhdHVtPU5BRDgzICt1bml0cz1kZWdyZWVzXCIpO1xuXHQgIGRlZnMoJ0VQU0c6Mzg1NycsIFwiK3RpdGxlPVdHUyA4NCAvIFBzZXVkby1NZXJjYXRvciArcHJvaj1tZXJjICthPTYzNzgxMzcgK2I9NjM3ODEzNyArbGF0X3RzPTAuMCArbG9uXzA9MC4wICt4XzA9MC4wICt5XzA9MCAraz0xLjAgK3VuaXRzPW0gK25hZGdyaWRzPUBudWxsICtub19kZWZzXCIpO1xuXG5cdCAgZGVmcy5XR1M4NCA9IGRlZnNbJ0VQU0c6NDMyNiddO1xuXHQgIGRlZnNbJ0VQU0c6Mzc4NSddID0gZGVmc1snRVBTRzozODU3J107IC8vIG1haW50YWluIGJhY2t3YXJkIGNvbXBhdCwgb2ZmaWNpYWwgY29kZSBpcyAzODU3XG5cdCAgZGVmcy5HT09HTEUgPSBkZWZzWydFUFNHOjM4NTcnXTtcblx0ICBkZWZzWydFUFNHOjkwMDkxMyddID0gZGVmc1snRVBTRzozODU3J107XG5cdCAgZGVmc1snRVBTRzoxMDIxMTMnXSA9IGRlZnNbJ0VQU0c6Mzg1NyddO1xuXHR9O1xuXG5cdHZhciBQSkRfM1BBUkFNID0gMTtcblx0dmFyIFBKRF83UEFSQU0gPSAyO1xuXHR2YXIgUEpEX1dHUzg0ID0gNDsgLy8gV0dTODQgb3IgZXF1aXZhbGVudFxuXHR2YXIgUEpEX05PREFUVU0gPSA1OyAvLyBXR1M4NCBvciBlcXVpdmFsZW50XG5cdHZhciBTRUNfVE9fUkFEID0gNC44NDgxMzY4MTEwOTUzNTk5MzU4OTkxNDEwMjM1N2UtNjtcblx0dmFyIEhBTEZfUEkgPSBNYXRoLlBJLzI7XG5cdC8vIGVsbGlwb2lkIHBqX3NldF9lbGwuY1xuXHR2YXIgU0lYVEggPSAwLjE2NjY2NjY2NjY2NjY2NjY2Njc7XG5cdC8qIDEvNiAqL1xuXHR2YXIgUkE0ID0gMC4wNDcyMjIyMjIyMjIyMjIyMjIyMjtcblx0LyogMTcvMzYwICovXG5cdHZhciBSQTYgPSAwLjAyMjE1NjA4NDY1NjA4NDY1NjA4O1xuXHR2YXIgRVBTTE4gPSAxLjBlLTEwO1xuXHQvLyB5b3UnZCB0aGluayB5b3UgY291bGQgdXNlIE51bWJlci5FUFNJTE9OIGFib3ZlIGJ1dCB0aGF0IG1ha2VzXG5cdC8vIE1vbGx3ZWlkZSBnZXQgaW50byBhbiBpbmZpbmF0ZSBsb29wLlxuXG5cdHZhciBEMlIgPSAwLjAxNzQ1MzI5MjUxOTk0MzI5NTc3O1xuXHR2YXIgUjJEID0gNTcuMjk1Nzc5NTEzMDgyMzIwODg7XG5cdHZhciBGT1JUUEkgPSBNYXRoLlBJLzQ7XG5cdHZhciBUV09fUEkgPSBNYXRoLlBJICogMjtcblx0Ly8gU1BJIGlzIHNsaWdodGx5IGdyZWF0ZXIgdGhhbiBNYXRoLlBJLCBzbyB2YWx1ZXMgdGhhdCBleGNlZWQgdGhlIC0xODAuLjE4MFxuXHQvLyBkZWdyZWUgcmFuZ2UgYnkgYSB0aW55IGFtb3VudCBkb24ndCBnZXQgd3JhcHBlZC4gVGhpcyBwcmV2ZW50cyBwb2ludHMgdGhhdFxuXHQvLyBoYXZlIGRyaWZ0ZWQgZnJvbSB0aGVpciBvcmlnaW5hbCBsb2NhdGlvbiBhbG9uZyB0aGUgMTgwdGggbWVyaWRpYW4gKGR1ZSB0b1xuXHQvLyBmbG9hdGluZyBwb2ludCBlcnJvcikgZnJvbSBjaGFuZ2luZyB0aGVpciBzaWduLlxuXHR2YXIgU1BJID0gMy4xNDE1OTI2NTM1OTtcblxuXHR2YXIgZXhwb3J0cyQxID0ge307XG5cdGV4cG9ydHMkMS5ncmVlbndpY2ggPSAwLjA7IC8vXCIwZEVcIixcblx0ZXhwb3J0cyQxLmxpc2JvbiA9IC05LjEzMTkwNjExMTExMTsgLy9cIjlkMDcnNTQuODYyXFxcIldcIixcblx0ZXhwb3J0cyQxLnBhcmlzID0gMi4zMzcyMjkxNjY2Njc7IC8vXCIyZDIwJzE0LjAyNVxcXCJFXCIsXG5cdGV4cG9ydHMkMS5ib2dvdGEgPSAtNzQuMDgwOTE2NjY2NjY3OyAvL1wiNzRkMDQnNTEuM1xcXCJXXCIsXG5cdGV4cG9ydHMkMS5tYWRyaWQgPSAtMy42ODc5Mzg4ODg4ODk7IC8vXCIzZDQxJzE2LjU4XFxcIldcIixcblx0ZXhwb3J0cyQxLnJvbWUgPSAxMi40NTIzMzMzMzMzMzM7IC8vXCIxMmQyNyc4LjRcXFwiRVwiLFxuXHRleHBvcnRzJDEuYmVybiA9IDcuNDM5NTgzMzMzMzMzOyAvL1wiN2QyNicyMi41XFxcIkVcIixcblx0ZXhwb3J0cyQxLmpha2FydGEgPSAxMDYuODA3NzE5NDQ0NDQ0OyAvL1wiMTA2ZDQ4JzI3Ljc5XFxcIkVcIixcblx0ZXhwb3J0cyQxLmZlcnJvID0gLTE3LjY2NjY2NjY2NjY2NzsgLy9cIjE3ZDQwJ1dcIixcblx0ZXhwb3J0cyQxLmJydXNzZWxzID0gNC4zNjc5NzU7IC8vXCI0ZDIyJzQuNzFcXFwiRVwiLFxuXHRleHBvcnRzJDEuc3RvY2tob2xtID0gMTguMDU4Mjc3Nzc3Nzc4OyAvL1wiMThkMycyOS44XFxcIkVcIixcblx0ZXhwb3J0cyQxLmF0aGVucyA9IDIzLjcxNjMzNzU7IC8vXCIyM2Q0Mic1OC44MTVcXFwiRVwiLFxuXHRleHBvcnRzJDEub3NsbyA9IDEwLjcyMjkxNjY2NjY2NzsgLy9cIjEwZDQzJzIyLjVcXFwiRVwiXG5cblx0dmFyIHVuaXRzID0ge1xuXHQgIGZ0OiB7dG9fbWV0ZXI6IDAuMzA0OH0sXG5cdCAgJ3VzLWZ0Jzoge3RvX21ldGVyOiAxMjAwIC8gMzkzN31cblx0fTtcblxuXHR2YXIgaWdub3JlZENoYXIgPSAvW1xcc19cXC1cXC9cXChcXCldL2c7XG5cdGZ1bmN0aW9uIG1hdGNoKG9iaiwga2V5KSB7XG5cdCAgaWYgKG9ialtrZXldKSB7XG5cdCAgICByZXR1cm4gb2JqW2tleV07XG5cdCAgfVxuXHQgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblx0ICB2YXIgbGtleSA9IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoaWdub3JlZENoYXIsICcnKTtcblx0ICB2YXIgaSA9IC0xO1xuXHQgIHZhciB0ZXN0a2V5LCBwcm9jZXNzZWRLZXk7XG5cdCAgd2hpbGUgKCsraSA8IGtleXMubGVuZ3RoKSB7XG5cdCAgICB0ZXN0a2V5ID0ga2V5c1tpXTtcblx0ICAgIHByb2Nlc3NlZEtleSA9IHRlc3RrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGlnbm9yZWRDaGFyLCAnJyk7XG5cdCAgICBpZiAocHJvY2Vzc2VkS2V5ID09PSBsa2V5KSB7XG5cdCAgICAgIHJldHVybiBvYmpbdGVzdGtleV07XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cblx0dmFyIHBhcnNlUHJvaiA9IGZ1bmN0aW9uKGRlZkRhdGEpIHtcblx0ICB2YXIgc2VsZiA9IHt9O1xuXHQgIHZhciBwYXJhbU9iaiA9IGRlZkRhdGEuc3BsaXQoJysnKS5tYXAoZnVuY3Rpb24odikge1xuXHQgICAgcmV0dXJuIHYudHJpbSgpO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbihhKSB7XG5cdCAgICByZXR1cm4gYTtcblx0ICB9KS5yZWR1Y2UoZnVuY3Rpb24ocCwgYSkge1xuXHQgICAgdmFyIHNwbGl0ID0gYS5zcGxpdCgnPScpO1xuXHQgICAgc3BsaXQucHVzaCh0cnVlKTtcblx0ICAgIHBbc3BsaXRbMF0udG9Mb3dlckNhc2UoKV0gPSBzcGxpdFsxXTtcblx0ICAgIHJldHVybiBwO1xuXHQgIH0sIHt9KTtcblx0ICB2YXIgcGFyYW1OYW1lLCBwYXJhbVZhbCwgcGFyYW1PdXRuYW1lO1xuXHQgIHZhciBwYXJhbXMgPSB7XG5cdCAgICBwcm9qOiAncHJvak5hbWUnLFxuXHQgICAgZGF0dW06ICdkYXR1bUNvZGUnLFxuXHQgICAgcmY6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi5yZiA9IHBhcnNlRmxvYXQodik7XG5cdCAgICB9LFxuXHQgICAgbGF0XzA6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi5sYXQwID0gdiAqIEQyUjtcblx0ICAgIH0sXG5cdCAgICBsYXRfMTogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLmxhdDEgPSB2ICogRDJSO1xuXHQgICAgfSxcblx0ICAgIGxhdF8yOiBmdW5jdGlvbih2KSB7XG5cdCAgICAgIHNlbGYubGF0MiA9IHYgKiBEMlI7XG5cdCAgICB9LFxuXHQgICAgbGF0X3RzOiBmdW5jdGlvbih2KSB7XG5cdCAgICAgIHNlbGYubGF0X3RzID0gdiAqIEQyUjtcblx0ICAgIH0sXG5cdCAgICBsb25fMDogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLmxvbmcwID0gdiAqIEQyUjtcblx0ICAgIH0sXG5cdCAgICBsb25fMTogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLmxvbmcxID0gdiAqIEQyUjtcblx0ICAgIH0sXG5cdCAgICBsb25fMjogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLmxvbmcyID0gdiAqIEQyUjtcblx0ICAgIH0sXG5cdCAgICBhbHBoYTogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLmFscGhhID0gcGFyc2VGbG9hdCh2KSAqIEQyUjtcblx0ICAgIH0sXG5cdCAgICBsb25jOiBmdW5jdGlvbih2KSB7XG5cdCAgICAgIHNlbGYubG9uZ2MgPSB2ICogRDJSO1xuXHQgICAgfSxcblx0ICAgIHhfMDogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLngwID0gcGFyc2VGbG9hdCh2KTtcblx0ICAgIH0sXG5cdCAgICB5XzA6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi55MCA9IHBhcnNlRmxvYXQodik7XG5cdCAgICB9LFxuXHQgICAga18wOiBmdW5jdGlvbih2KSB7XG5cdCAgICAgIHNlbGYuazAgPSBwYXJzZUZsb2F0KHYpO1xuXHQgICAgfSxcblx0ICAgIGs6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi5rMCA9IHBhcnNlRmxvYXQodik7XG5cdCAgICB9LFxuXHQgICAgYTogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLmEgPSBwYXJzZUZsb2F0KHYpO1xuXHQgICAgfSxcblx0ICAgIGI6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi5iID0gcGFyc2VGbG9hdCh2KTtcblx0ICAgIH0sXG5cdCAgICByX2E6IGZ1bmN0aW9uKCkge1xuXHQgICAgICBzZWxmLlJfQSA9IHRydWU7XG5cdCAgICB9LFxuXHQgICAgem9uZTogZnVuY3Rpb24odikge1xuXHQgICAgICBzZWxmLnpvbmUgPSBwYXJzZUludCh2LCAxMCk7XG5cdCAgICB9LFxuXHQgICAgc291dGg6IGZ1bmN0aW9uKCkge1xuXHQgICAgICBzZWxmLnV0bVNvdXRoID0gdHJ1ZTtcblx0ICAgIH0sXG5cdCAgICB0b3dnczg0OiBmdW5jdGlvbih2KSB7XG5cdCAgICAgIHNlbGYuZGF0dW1fcGFyYW1zID0gdi5zcGxpdChcIixcIikubWFwKGZ1bmN0aW9uKGEpIHtcblx0ICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChhKTtcblx0ICAgICAgfSk7XG5cdCAgICB9LFxuXHQgICAgdG9fbWV0ZXI6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi50b19tZXRlciA9IHBhcnNlRmxvYXQodik7XG5cdCAgICB9LFxuXHQgICAgdW5pdHM6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi51bml0cyA9IHY7XG5cdCAgICAgIHZhciB1bml0ID0gbWF0Y2godW5pdHMsIHYpO1xuXHQgICAgICBpZiAodW5pdCkge1xuXHQgICAgICAgIHNlbGYudG9fbWV0ZXIgPSB1bml0LnRvX21ldGVyO1xuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgICAgZnJvbV9ncmVlbndpY2g6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgc2VsZi5mcm9tX2dyZWVud2ljaCA9IHYgKiBEMlI7XG5cdCAgICB9LFxuXHQgICAgcG06IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgdmFyIHBtID0gbWF0Y2goZXhwb3J0cyQxLCB2KTtcblx0ICAgICAgc2VsZi5mcm9tX2dyZWVud2ljaCA9IChwbSA/IHBtIDogcGFyc2VGbG9hdCh2KSkgKiBEMlI7XG5cdCAgICB9LFxuXHQgICAgbmFkZ3JpZHM6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgaWYgKHYgPT09ICdAbnVsbCcpIHtcblx0ICAgICAgICBzZWxmLmRhdHVtQ29kZSA9ICdub25lJztcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIHtcblx0ICAgICAgICBzZWxmLm5hZGdyaWRzID0gdjtcblx0ICAgICAgfVxuXHQgICAgfSxcblx0ICAgIGF4aXM6IGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgdmFyIGxlZ2FsQXhpcyA9IFwiZXduc3VkXCI7XG5cdCAgICAgIGlmICh2Lmxlbmd0aCA9PT0gMyAmJiBsZWdhbEF4aXMuaW5kZXhPZih2LnN1YnN0cigwLCAxKSkgIT09IC0xICYmIGxlZ2FsQXhpcy5pbmRleE9mKHYuc3Vic3RyKDEsIDEpKSAhPT0gLTEgJiYgbGVnYWxBeGlzLmluZGV4T2Yodi5zdWJzdHIoMiwgMSkpICE9PSAtMSkge1xuXHQgICAgICAgIHNlbGYuYXhpcyA9IHY7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9O1xuXHQgIGZvciAocGFyYW1OYW1lIGluIHBhcmFtT2JqKSB7XG5cdCAgICBwYXJhbVZhbCA9IHBhcmFtT2JqW3BhcmFtTmFtZV07XG5cdCAgICBpZiAocGFyYW1OYW1lIGluIHBhcmFtcykge1xuXHQgICAgICBwYXJhbU91dG5hbWUgPSBwYXJhbXNbcGFyYW1OYW1lXTtcblx0ICAgICAgaWYgKHR5cGVvZiBwYXJhbU91dG5hbWUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICBwYXJhbU91dG5hbWUocGFyYW1WYWwpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2Uge1xuXHQgICAgICAgIHNlbGZbcGFyYW1PdXRuYW1lXSA9IHBhcmFtVmFsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgc2VsZltwYXJhbU5hbWVdID0gcGFyYW1WYWw7XG5cdCAgICB9XG5cdCAgfVxuXHQgIGlmKHR5cGVvZiBzZWxmLmRhdHVtQ29kZSA9PT0gJ3N0cmluZycgJiYgc2VsZi5kYXR1bUNvZGUgIT09IFwiV0dTODRcIil7XG5cdCAgICBzZWxmLmRhdHVtQ29kZSA9IHNlbGYuZGF0dW1Db2RlLnRvTG93ZXJDYXNlKCk7XG5cdCAgfVxuXHQgIHJldHVybiBzZWxmO1xuXHR9O1xuXG5cdHZhciBORVVUUkFMID0gMTtcblx0dmFyIEtFWVdPUkQgPSAyO1xuXHR2YXIgTlVNQkVSID0gMztcblx0dmFyIFFVT1RFRCA9IDQ7XG5cdHZhciBBRlRFUlFVT1RFID0gNTtcblx0dmFyIEVOREVEID0gLTE7XG5cdHZhciB3aGl0ZXNwYWNlID0gL1xccy87XG5cdHZhciBsYXRpbiA9IC9bQS1aYS16XS87XG5cdHZhciBrZXl3b3JkID0gL1tBLVphLXo4NF0vO1xuXHR2YXIgZW5kVGhpbmdzID0gL1ssXFxdXS87XG5cdHZhciBkaWdldHMgPSAvW1xcZFxcLkVcXC1cXCtdLztcblx0Ly8gY29uc3QgaWdub3JlZENoYXIgPSAvW1xcc19cXC1cXC9cXChcXCldL2c7XG5cdGZ1bmN0aW9uIFBhcnNlcih0ZXh0KSB7XG5cdCAgaWYgKHR5cGVvZiB0ZXh0ICE9PSAnc3RyaW5nJykge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgYSBzdHJpbmcnKTtcblx0ICB9XG5cdCAgdGhpcy50ZXh0ID0gdGV4dC50cmltKCk7XG5cdCAgdGhpcy5sZXZlbCA9IDA7XG5cdCAgdGhpcy5wbGFjZSA9IDA7XG5cdCAgdGhpcy5yb290ID0gbnVsbDtcblx0ICB0aGlzLnN0YWNrID0gW107XG5cdCAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbnVsbDtcblx0ICB0aGlzLnN0YXRlID0gTkVVVFJBTDtcblx0fVxuXHRQYXJzZXIucHJvdG90eXBlLnJlYWRDaGFyaWN0ZXIgPSBmdW5jdGlvbigpIHtcblx0ICB2YXIgY2hhciA9IHRoaXMudGV4dFt0aGlzLnBsYWNlKytdO1xuXHQgIGlmICh0aGlzLnN0YXRlICE9PSBRVU9URUQpIHtcblx0ICAgIHdoaWxlICh3aGl0ZXNwYWNlLnRlc3QoY2hhcikpIHtcblx0ICAgICAgaWYgKHRoaXMucGxhY2UgPj0gdGhpcy50ZXh0Lmxlbmd0aCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBjaGFyID0gdGhpcy50ZXh0W3RoaXMucGxhY2UrK107XG5cdCAgICB9XG5cdCAgfVxuXHQgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuXHQgICAgY2FzZSBORVVUUkFMOlxuXHQgICAgICByZXR1cm4gdGhpcy5uZXV0cmFsKGNoYXIpO1xuXHQgICAgY2FzZSBLRVlXT1JEOlxuXHQgICAgICByZXR1cm4gdGhpcy5rZXl3b3JkKGNoYXIpXG5cdCAgICBjYXNlIFFVT1RFRDpcblx0ICAgICAgcmV0dXJuIHRoaXMucXVvdGVkKGNoYXIpO1xuXHQgICAgY2FzZSBBRlRFUlFVT1RFOlxuXHQgICAgICByZXR1cm4gdGhpcy5hZnRlcnF1b3RlKGNoYXIpO1xuXHQgICAgY2FzZSBOVU1CRVI6XG5cdCAgICAgIHJldHVybiB0aGlzLm51bWJlcihjaGFyKTtcblx0ICAgIGNhc2UgRU5ERUQ6XG5cdCAgICAgIHJldHVybjtcblx0ICB9XG5cdH07XG5cdFBhcnNlci5wcm90b3R5cGUuYWZ0ZXJxdW90ZSA9IGZ1bmN0aW9uKGNoYXIpIHtcblx0ICBpZiAoY2hhciA9PT0gJ1wiJykge1xuXHQgICAgdGhpcy53b3JkICs9ICdcIic7XG5cdCAgICB0aGlzLnN0YXRlID0gUVVPVEVEO1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICBpZiAoZW5kVGhpbmdzLnRlc3QoY2hhcikpIHtcblx0ICAgIHRoaXMud29yZCA9IHRoaXMud29yZC50cmltKCk7XG5cdCAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdCAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBhZnRlcnF1b3RlIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xuXHR9O1xuXHRQYXJzZXIucHJvdG90eXBlLmFmdGVySXRlbSA9IGZ1bmN0aW9uKGNoYXIpIHtcblx0ICBpZiAoY2hhciA9PT0gJywnKSB7XG5cdCAgICBpZiAodGhpcy53b3JkICE9PSBudWxsKSB7XG5cdCAgICAgIHRoaXMuY3VycmVudE9iamVjdC5wdXNoKHRoaXMud29yZCk7XG5cdCAgICB9XG5cdCAgICB0aGlzLndvcmQgPSBudWxsO1xuXHQgICAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChjaGFyID09PSAnXScpIHtcblx0ICAgIHRoaXMubGV2ZWwtLTtcblx0ICAgIGlmICh0aGlzLndvcmQgIT09IG51bGwpIHtcblx0ICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LnB1c2godGhpcy53b3JkKTtcblx0ICAgICAgdGhpcy53b3JkID0gbnVsbDtcblx0ICAgIH1cblx0ICAgIHRoaXMuc3RhdGUgPSBORVVUUkFMO1xuXHQgICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gdGhpcy5zdGFjay5wb3AoKTtcblx0ICAgIGlmICghdGhpcy5jdXJyZW50T2JqZWN0KSB7XG5cdCAgICAgIHRoaXMuc3RhdGUgPSBFTkRFRDtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0fTtcblx0UGFyc2VyLnByb3RvdHlwZS5udW1iZXIgPSBmdW5jdGlvbihjaGFyKSB7XG5cdCAgaWYgKGRpZ2V0cy50ZXN0KGNoYXIpKSB7XG5cdCAgICB0aGlzLndvcmQgKz0gY2hhcjtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdCAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG5cdCAgICB0aGlzLndvcmQgPSBwYXJzZUZsb2F0KHRoaXMud29yZCk7XG5cdCAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdCAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBudW1iZXIgeWV0LCBpbmRleCAnICsgdGhpcy5wbGFjZSk7XG5cdH07XG5cdFBhcnNlci5wcm90b3R5cGUucXVvdGVkID0gZnVuY3Rpb24oY2hhcikge1xuXHQgIGlmIChjaGFyID09PSAnXCInKSB7XG5cdCAgICB0aGlzLnN0YXRlID0gQUZURVJRVU9URTtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdCAgdGhpcy53b3JkICs9IGNoYXI7XG5cdCAgcmV0dXJuO1xuXHR9O1xuXHRQYXJzZXIucHJvdG90eXBlLmtleXdvcmQgPSBmdW5jdGlvbihjaGFyKSB7XG5cdCAgaWYgKGtleXdvcmQudGVzdChjaGFyKSkge1xuXHQgICAgdGhpcy53b3JkICs9IGNoYXI7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChjaGFyID09PSAnWycpIHtcblx0ICAgIHZhciBuZXdPYmplY3RzID0gW107XG5cdCAgICBuZXdPYmplY3RzLnB1c2godGhpcy53b3JkKTtcblx0ICAgIHRoaXMubGV2ZWwrKztcblx0ICAgIGlmICh0aGlzLnJvb3QgPT09IG51bGwpIHtcblx0ICAgICAgdGhpcy5yb290ID0gbmV3T2JqZWN0cztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuY3VycmVudE9iamVjdC5wdXNoKG5ld09iamVjdHMpO1xuXHQgICAgfVxuXHQgICAgdGhpcy5zdGFjay5wdXNoKHRoaXMuY3VycmVudE9iamVjdCk7XG5cdCAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXdPYmplY3RzO1xuXHQgICAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChlbmRUaGluZ3MudGVzdChjaGFyKSkge1xuXHQgICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4ga2V5d29yZCB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcblx0fTtcblx0UGFyc2VyLnByb3RvdHlwZS5uZXV0cmFsID0gZnVuY3Rpb24oY2hhcikge1xuXHQgIGlmIChsYXRpbi50ZXN0KGNoYXIpKSB7XG5cdCAgICB0aGlzLndvcmQgPSBjaGFyO1xuXHQgICAgdGhpcy5zdGF0ZSA9IEtFWVdPUkQ7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChjaGFyID09PSAnXCInKSB7XG5cdCAgICB0aGlzLndvcmQgPSAnJztcblx0ICAgIHRoaXMuc3RhdGUgPSBRVU9URUQ7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChkaWdldHMudGVzdChjaGFyKSkge1xuXHQgICAgdGhpcy53b3JkID0gY2hhcjtcblx0ICAgIHRoaXMuc3RhdGUgPSBOVU1CRVI7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChlbmRUaGluZ3MudGVzdChjaGFyKSkge1xuXHQgICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4gbmV1dHJhbCB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcblx0fTtcblx0UGFyc2VyLnByb3RvdHlwZS5vdXRwdXQgPSBmdW5jdGlvbigpIHtcblx0ICB3aGlsZSAodGhpcy5wbGFjZSA8IHRoaXMudGV4dC5sZW5ndGgpIHtcblx0ICAgIHRoaXMucmVhZENoYXJpY3RlcigpO1xuXHQgIH1cblx0ICBpZiAodGhpcy5zdGF0ZSA9PT0gRU5ERUQpIHtcblx0ICAgIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgfVxuXHQgIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIHBhcnNlIHN0cmluZyBcIicgK3RoaXMudGV4dCArICdcIi4gU3RhdGUgaXMgJyArIHRoaXMuc3RhdGUpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIHBhcnNlU3RyaW5nKHR4dCkge1xuXHQgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKHR4dCk7XG5cdCAgcmV0dXJuIHBhcnNlci5vdXRwdXQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1hcGl0KG9iaiwga2V5LCB2YWx1ZSkge1xuXHQgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcblx0ICAgIHZhbHVlLnVuc2hpZnQoa2V5KTtcblx0ICAgIGtleSA9IG51bGw7XG5cdCAgfVxuXHQgIHZhciB0aGluZyA9IGtleSA/IHt9IDogb2JqO1xuXG5cdCAgdmFyIG91dCA9IHZhbHVlLnJlZHVjZShmdW5jdGlvbihuZXdPYmosIGl0ZW0pIHtcblx0ICAgIHNFeHByKGl0ZW0sIG5ld09iaik7XG5cdCAgICByZXR1cm4gbmV3T2JqXG5cdCAgfSwgdGhpbmcpO1xuXHQgIGlmIChrZXkpIHtcblx0ICAgIG9ialtrZXldID0gb3V0O1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNFeHByKHYsIG9iaikge1xuXHQgIGlmICghQXJyYXkuaXNBcnJheSh2KSkge1xuXHQgICAgb2JqW3ZdID0gdHJ1ZTtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdCAgdmFyIGtleSA9IHYuc2hpZnQoKTtcblx0ICBpZiAoa2V5ID09PSAnUEFSQU1FVEVSJykge1xuXHQgICAga2V5ID0gdi5zaGlmdCgpO1xuXHQgIH1cblx0ICBpZiAodi5sZW5ndGggPT09IDEpIHtcblx0ICAgIGlmIChBcnJheS5pc0FycmF5KHZbMF0pKSB7XG5cdCAgICAgIG9ialtrZXldID0ge307XG5cdCAgICAgIHNFeHByKHZbMF0sIG9ialtrZXldKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgb2JqW2tleV0gPSB2WzBdO1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICBpZiAoIXYubGVuZ3RoKSB7XG5cdCAgICBvYmpba2V5XSA9IHRydWU7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIGlmIChrZXkgPT09ICdUT1dHUzg0Jykge1xuXHQgICAgb2JqW2tleV0gPSB2O1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICBpZiAoIUFycmF5LmlzQXJyYXkoa2V5KSkge1xuXHQgICAgb2JqW2tleV0gPSB7fTtcblx0ICB9XG5cblx0ICB2YXIgaTtcblx0ICBzd2l0Y2ggKGtleSkge1xuXHQgICAgY2FzZSAnVU5JVCc6XG5cdCAgICBjYXNlICdQUklNRU0nOlxuXHQgICAgY2FzZSAnVkVSVF9EQVRVTSc6XG5cdCAgICAgIG9ialtrZXldID0ge1xuXHQgICAgICAgIG5hbWU6IHZbMF0udG9Mb3dlckNhc2UoKSxcblx0ICAgICAgICBjb252ZXJ0OiB2WzFdXG5cdCAgICAgIH07XG5cdCAgICAgIGlmICh2Lmxlbmd0aCA9PT0gMykge1xuXHQgICAgICAgIHNFeHByKHZbMl0sIG9ialtrZXldKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm47XG5cdCAgICBjYXNlICdTUEhFUk9JRCc6XG5cdCAgICBjYXNlICdFTExJUFNPSUQnOlxuXHQgICAgICBvYmpba2V5XSA9IHtcblx0ICAgICAgICBuYW1lOiB2WzBdLFxuXHQgICAgICAgIGE6IHZbMV0sXG5cdCAgICAgICAgcmY6IHZbMl1cblx0ICAgICAgfTtcblx0ICAgICAgaWYgKHYubGVuZ3RoID09PSA0KSB7XG5cdCAgICAgICAgc0V4cHIodlszXSwgb2JqW2tleV0pO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybjtcblx0ICAgIGNhc2UgJ1BST0pFQ1RFRENSUyc6XG5cdCAgICBjYXNlICdQUk9KQ1JTJzpcblx0ICAgIGNhc2UgJ0dFT0dDUyc6XG5cdCAgICBjYXNlICdHRU9DQ1MnOlxuXHQgICAgY2FzZSAnUFJPSkNTJzpcblx0ICAgIGNhc2UgJ0xPQ0FMX0NTJzpcblx0ICAgIGNhc2UgJ0dFT0RDUlMnOlxuXHQgICAgY2FzZSAnR0VPREVUSUNDUlMnOlxuXHQgICAgY2FzZSAnR0VPREVUSUNEQVRVTSc6XG5cdCAgICBjYXNlICdFREFUVU0nOlxuXHQgICAgY2FzZSAnRU5HSU5FRVJJTkdEQVRVTSc6XG5cdCAgICBjYXNlICdWRVJUX0NTJzpcblx0ICAgIGNhc2UgJ1ZFUlRDUlMnOlxuXHQgICAgY2FzZSAnVkVSVElDQUxDUlMnOlxuXHQgICAgY2FzZSAnQ09NUERfQ1MnOlxuXHQgICAgY2FzZSAnQ09NUE9VTkRDUlMnOlxuXHQgICAgY2FzZSAnRU5HSU5FRVJJTkdDUlMnOlxuXHQgICAgY2FzZSAnRU5HQ1JTJzpcblx0ICAgIGNhc2UgJ0ZJVFRFRF9DUyc6XG5cdCAgICBjYXNlICdMT0NBTF9EQVRVTSc6XG5cdCAgICBjYXNlICdEQVRVTSc6XG5cdCAgICAgIHZbMF0gPSBbJ25hbWUnLCB2WzBdXTtcblx0ICAgICAgbWFwaXQob2JqLCBrZXksIHYpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICBkZWZhdWx0OlxuXHQgICAgICBpID0gLTE7XG5cdCAgICAgIHdoaWxlICgrK2kgPCB2Lmxlbmd0aCkge1xuXHQgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2W2ldKSkge1xuXHQgICAgICAgICAgcmV0dXJuIHNFeHByKHYsIG9ialtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG1hcGl0KG9iaiwga2V5LCB2KTtcblx0ICB9XG5cdH1cblxuXHR2YXIgRDJSJDEgPSAwLjAxNzQ1MzI5MjUxOTk0MzI5NTc3O1xuXHRmdW5jdGlvbiByZW5hbWUob2JqLCBwYXJhbXMpIHtcblx0ICB2YXIgb3V0TmFtZSA9IHBhcmFtc1swXTtcblx0ICB2YXIgaW5OYW1lID0gcGFyYW1zWzFdO1xuXHQgIGlmICghKG91dE5hbWUgaW4gb2JqKSAmJiAoaW5OYW1lIGluIG9iaikpIHtcblx0ICAgIG9ialtvdXROYW1lXSA9IG9ialtpbk5hbWVdO1xuXHQgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDMpIHtcblx0ICAgICAgb2JqW291dE5hbWVdID0gcGFyYW1zWzJdKG9ialtvdXROYW1lXSk7XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gZDJyKGlucHV0KSB7XG5cdCAgcmV0dXJuIGlucHV0ICogRDJSJDE7XG5cdH1cblxuXHRmdW5jdGlvbiBjbGVhbldLVCh3a3QpIHtcblx0ICBpZiAod2t0LnR5cGUgPT09ICdHRU9HQ1MnKSB7XG5cdCAgICB3a3QucHJvak5hbWUgPSAnbG9uZ2xhdCc7XG5cdCAgfSBlbHNlIGlmICh3a3QudHlwZSA9PT0gJ0xPQ0FMX0NTJykge1xuXHQgICAgd2t0LnByb2pOYW1lID0gJ2lkZW50aXR5Jztcblx0ICAgIHdrdC5sb2NhbCA9IHRydWU7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGlmICh0eXBlb2Ygd2t0LlBST0pFQ1RJT04gPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHdrdC5wcm9qTmFtZSA9IE9iamVjdC5rZXlzKHdrdC5QUk9KRUNUSU9OKVswXTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHdrdC5wcm9qTmFtZSA9IHdrdC5QUk9KRUNUSU9OO1xuXHQgICAgfVxuXHQgIH1cblx0ICBpZiAod2t0LlVOSVQpIHtcblx0ICAgIHdrdC51bml0cyA9IHdrdC5VTklULm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGlmICh3a3QudW5pdHMgPT09ICdtZXRyZScpIHtcblx0ICAgICAgd2t0LnVuaXRzID0gJ21ldGVyJztcblx0ICAgIH1cblx0ICAgIGlmICh3a3QuVU5JVC5jb252ZXJ0KSB7XG5cdCAgICAgIGlmICh3a3QudHlwZSA9PT0gJ0dFT0dDUycpIHtcblx0ICAgICAgICBpZiAod2t0LkRBVFVNICYmIHdrdC5EQVRVTS5TUEhFUk9JRCkge1xuXHQgICAgICAgICAgd2t0LnRvX21ldGVyID0gd2t0LlVOSVQuY29udmVydCp3a3QuREFUVU0uU1BIRVJPSUQuYTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgd2t0LnRvX21ldGVyID0gd2t0LlVOSVQuY29udmVydCwgMTA7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdCAgdmFyIGdlb2djcyA9IHdrdC5HRU9HQ1M7XG5cdCAgaWYgKHdrdC50eXBlID09PSAnR0VPR0NTJykge1xuXHQgICAgZ2VvZ2NzID0gd2t0O1xuXHQgIH1cblx0ICBpZiAoZ2VvZ2NzKSB7XG5cdCAgICAvL2lmKHdrdC5HRU9HQ1MuUFJJTUVNJiZ3a3QuR0VPR0NTLlBSSU1FTS5jb252ZXJ0KXtcblx0ICAgIC8vICB3a3QuZnJvbV9ncmVlbndpY2g9d2t0LkdFT0dDUy5QUklNRU0uY29udmVydCpEMlI7XG5cdCAgICAvL31cblx0ICAgIGlmIChnZW9nY3MuREFUVU0pIHtcblx0ICAgICAgd2t0LmRhdHVtQ29kZSA9IGdlb2djcy5EQVRVTS5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB3a3QuZGF0dW1Db2RlID0gZ2VvZ2NzLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIH1cblx0ICAgIGlmICh3a3QuZGF0dW1Db2RlLnNsaWNlKDAsIDIpID09PSAnZF8nKSB7XG5cdCAgICAgIHdrdC5kYXR1bUNvZGUgPSB3a3QuZGF0dW1Db2RlLnNsaWNlKDIpO1xuXHQgICAgfVxuXHQgICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICduZXdfemVhbGFuZF9nZW9kZXRpY19kYXR1bV8xOTQ5JyB8fCB3a3QuZGF0dW1Db2RlID09PSAnbmV3X3plYWxhbmRfMTk0OScpIHtcblx0ICAgICAgd2t0LmRhdHVtQ29kZSA9ICduemdkNDknO1xuXHQgICAgfVxuXHQgICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICd3Z3NfMTk4NCcpIHtcblx0ICAgICAgaWYgKHdrdC5QUk9KRUNUSU9OID09PSAnTWVyY2F0b3JfQXV4aWxpYXJ5X1NwaGVyZScpIHtcblx0ICAgICAgICB3a3Quc3BoZXJlID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgICB3a3QuZGF0dW1Db2RlID0gJ3dnczg0Jztcblx0ICAgIH1cblx0ICAgIGlmICh3a3QuZGF0dW1Db2RlLnNsaWNlKC02KSA9PT0gJ19mZXJybycpIHtcblx0ICAgICAgd2t0LmRhdHVtQ29kZSA9IHdrdC5kYXR1bUNvZGUuc2xpY2UoMCwgLSA2KTtcblx0ICAgIH1cblx0ICAgIGlmICh3a3QuZGF0dW1Db2RlLnNsaWNlKC04KSA9PT0gJ19qYWthcnRhJykge1xuXHQgICAgICB3a3QuZGF0dW1Db2RlID0gd2t0LmRhdHVtQ29kZS5zbGljZSgwLCAtIDgpO1xuXHQgICAgfVxuXHQgICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ2JlbGdlJykpIHtcblx0ICAgICAgd2t0LmRhdHVtQ29kZSA9ICdybmI3Mic7XG5cdCAgICB9XG5cdCAgICBpZiAoZ2VvZ2NzLkRBVFVNICYmIGdlb2djcy5EQVRVTS5TUEhFUk9JRCkge1xuXHQgICAgICB3a3QuZWxscHMgPSBnZW9nY3MuREFUVU0uU1BIRVJPSUQubmFtZS5yZXBsYWNlKCdfMTknLCAnJykucmVwbGFjZSgvW0NjXWxhcmtlXFxfMTgvLCAnY2xyaycpO1xuXHQgICAgICBpZiAod2t0LmVsbHBzLnRvTG93ZXJDYXNlKCkuc2xpY2UoMCwgMTMpID09PSAnaW50ZXJuYXRpb25hbCcpIHtcblx0ICAgICAgICB3a3QuZWxscHMgPSAnaW50bCc7XG5cdCAgICAgIH1cblxuXHQgICAgICB3a3QuYSA9IGdlb2djcy5EQVRVTS5TUEhFUk9JRC5hO1xuXHQgICAgICB3a3QucmYgPSBwYXJzZUZsb2F0KGdlb2djcy5EQVRVTS5TUEhFUk9JRC5yZiwgMTApO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZ2VvZ2NzLkRBVFVNICYmIGdlb2djcy5EQVRVTS5UT1dHUzg0KSB7XG5cdCAgICAgIHdrdC5kYXR1bV9wYXJhbXMgPSBnZW9nY3MuREFUVU0uVE9XR1M4NDtcblx0ICAgIH1cblx0ICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdvc2diXzE5MzYnKSkge1xuXHQgICAgICB3a3QuZGF0dW1Db2RlID0gJ29zZ2IzNic7XG5cdCAgICB9XG5cdCAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZignb3NuaV8xOTUyJykpIHtcblx0ICAgICAgd2t0LmRhdHVtQ29kZSA9ICdvc25pNTInO1xuXHQgICAgfVxuXHQgICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ3RtNjUnKVxuXHQgICAgICB8fCB+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdnZW9kZXRpY19kYXR1bV9vZl8xOTY1JykpIHtcblx0ICAgICAgd2t0LmRhdHVtQ29kZSA9ICdpcmU2NSc7XG5cdCAgICB9XG5cdCAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ2NoMTkwMysnKSB7XG5cdCAgICAgIHdrdC5kYXR1bUNvZGUgPSAnY2gxOTAzJztcblx0ICAgIH1cblx0ICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdpc3JhZWwnKSkge1xuXHQgICAgICB3a3QuZGF0dW1Db2RlID0gJ2lzcjkzJztcblx0ICAgIH1cblx0ICB9XG5cdCAgaWYgKHdrdC5iICYmICFpc0Zpbml0ZSh3a3QuYikpIHtcblx0ICAgIHdrdC5iID0gd2t0LmE7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gdG9NZXRlcihpbnB1dCkge1xuXHQgICAgdmFyIHJhdGlvID0gd2t0LnRvX21ldGVyIHx8IDE7XG5cdCAgICByZXR1cm4gaW5wdXQgKiByYXRpbztcblx0ICB9XG5cdCAgdmFyIHJlbmFtZXIgPSBmdW5jdGlvbihhKSB7XG5cdCAgICByZXR1cm4gcmVuYW1lKHdrdCwgYSk7XG5cdCAgfTtcblx0ICB2YXIgbGlzdCA9IFtcblx0ICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMScsICdTdGFuZGFyZF9QYXJhbGxlbF8xJ10sXG5cdCAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzInLCAnU3RhbmRhcmRfUGFyYWxsZWxfMiddLFxuXHQgICAgWydmYWxzZV9lYXN0aW5nJywgJ0ZhbHNlX0Vhc3RpbmcnXSxcblx0ICAgIFsnZmFsc2Vfbm9ydGhpbmcnLCAnRmFsc2VfTm9ydGhpbmcnXSxcblx0ICAgIFsnY2VudHJhbF9tZXJpZGlhbicsICdDZW50cmFsX01lcmlkaWFuJ10sXG5cdCAgICBbJ2xhdGl0dWRlX29mX29yaWdpbicsICdMYXRpdHVkZV9PZl9PcmlnaW4nXSxcblx0ICAgIFsnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgJ0NlbnRyYWxfUGFyYWxsZWwnXSxcblx0ICAgIFsnc2NhbGVfZmFjdG9yJywgJ1NjYWxlX0ZhY3RvciddLFxuXHQgICAgWydrMCcsICdzY2FsZV9mYWN0b3InXSxcblx0ICAgIFsnbGF0aXR1ZGVfb2ZfY2VudGVyJywgJ0xhdGl0dWRlX09mX0NlbnRlciddLFxuXHQgICAgWydsYXRpdHVkZV9vZl9jZW50ZXInLCAnTGF0aXR1ZGVfb2ZfY2VudGVyJ10sXG5cdCAgICBbJ2xhdDAnLCAnbGF0aXR1ZGVfb2ZfY2VudGVyJywgZDJyXSxcblx0ICAgIFsnbG9uZ2l0dWRlX29mX2NlbnRlcicsICdMb25naXR1ZGVfT2ZfQ2VudGVyJ10sXG5cdCAgICBbJ2xvbmdpdHVkZV9vZl9jZW50ZXInLCAnTG9uZ2l0dWRlX29mX2NlbnRlciddLFxuXHQgICAgWydsb25nYycsICdsb25naXR1ZGVfb2ZfY2VudGVyJywgZDJyXSxcblx0ICAgIFsneDAnLCAnZmFsc2VfZWFzdGluZycsIHRvTWV0ZXJdLFxuXHQgICAgWyd5MCcsICdmYWxzZV9ub3J0aGluZycsIHRvTWV0ZXJdLFxuXHQgICAgWydsb25nMCcsICdjZW50cmFsX21lcmlkaWFuJywgZDJyXSxcblx0ICAgIFsnbGF0MCcsICdsYXRpdHVkZV9vZl9vcmlnaW4nLCBkMnJdLFxuXHQgICAgWydsYXQwJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCBkMnJdLFxuXHQgICAgWydsYXQxJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCBkMnJdLFxuXHQgICAgWydsYXQyJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzInLCBkMnJdLFxuXHQgICAgWydhemltdXRoJywgJ0F6aW11dGgnXSxcblx0ICAgIFsnYWxwaGEnLCAnYXppbXV0aCcsIGQycl0sXG5cdCAgICBbJ3Nyc0NvZGUnLCAnbmFtZSddXG5cdCAgXTtcblx0ICBsaXN0LmZvckVhY2gocmVuYW1lcik7XG5cdCAgaWYgKCF3a3QubG9uZzAgJiYgd2t0LmxvbmdjICYmICh3a3QucHJvak5hbWUgPT09ICdBbGJlcnNfQ29uaWNfRXF1YWxfQXJlYScgfHwgd2t0LnByb2pOYW1lID09PSAnTGFtYmVydF9BemltdXRoYWxfRXF1YWxfQXJlYScpKSB7XG5cdCAgICB3a3QubG9uZzAgPSB3a3QubG9uZ2M7XG5cdCAgfVxuXHQgIGlmICghd2t0LmxhdF90cyAmJiB3a3QubGF0MSAmJiAod2t0LnByb2pOYW1lID09PSAnU3RlcmVvZ3JhcGhpY19Tb3V0aF9Qb2xlJyB8fCB3a3QucHJvak5hbWUgPT09ICdQb2xhciBTdGVyZW9ncmFwaGljICh2YXJpYW50IEIpJykpIHtcblx0ICAgIHdrdC5sYXQwID0gZDJyKHdrdC5sYXQxID4gMCA/IDkwIDogLTkwKTtcblx0ICAgIHdrdC5sYXRfdHMgPSB3a3QubGF0MTtcblx0ICB9XG5cdH1cblx0dmFyIHdrdCA9IGZ1bmN0aW9uKHdrdCkge1xuXHQgIHZhciBsaXNwID0gcGFyc2VTdHJpbmcod2t0KTtcblx0ICB2YXIgdHlwZSA9IGxpc3Auc2hpZnQoKTtcblx0ICB2YXIgbmFtZSA9IGxpc3Auc2hpZnQoKTtcblx0ICBsaXNwLnVuc2hpZnQoWyduYW1lJywgbmFtZV0pO1xuXHQgIGxpc3AudW5zaGlmdChbJ3R5cGUnLCB0eXBlXSk7XG5cdCAgdmFyIG9iaiA9IHt9O1xuXHQgIHNFeHByKGxpc3AsIG9iaik7XG5cdCAgY2xlYW5XS1Qob2JqKTtcblx0ICByZXR1cm4gb2JqO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGRlZnMobmFtZSkge1xuXHQgIC8qZ2xvYmFsIGNvbnNvbGUqL1xuXHQgIHZhciB0aGF0ID0gdGhpcztcblx0ICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuXHQgICAgdmFyIGRlZiA9IGFyZ3VtZW50c1sxXTtcblx0ICAgIGlmICh0eXBlb2YgZGVmID09PSAnc3RyaW5nJykge1xuXHQgICAgICBpZiAoZGVmLmNoYXJBdCgwKSA9PT0gJysnKSB7XG5cdCAgICAgICAgZGVmc1tuYW1lXSA9IHBhcnNlUHJvaihhcmd1bWVudHNbMV0pO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2Uge1xuXHQgICAgICAgIGRlZnNbbmFtZV0gPSB3a3QoYXJndW1lbnRzWzFdKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZGVmc1tuYW1lXSA9IGRlZjtcblx0ICAgIH1cblx0ICB9XG5cdCAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgaWYgKEFycmF5LmlzQXJyYXkobmFtZSkpIHtcblx0ICAgICAgcmV0dXJuIG5hbWUubWFwKGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuXHQgICAgICAgICAgZGVmcy5hcHBseSh0aGF0LCB2KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICBkZWZzKHYpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgaWYgKG5hbWUgaW4gZGVmcykge1xuXHQgICAgICAgIHJldHVybiBkZWZzW25hbWVdO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmICgnRVBTRycgaW4gbmFtZSkge1xuXHQgICAgICBkZWZzWydFUFNHOicgKyBuYW1lLkVQU0ddID0gbmFtZTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKCdFU1JJJyBpbiBuYW1lKSB7XG5cdCAgICAgIGRlZnNbJ0VTUkk6JyArIG5hbWUuRVNSSV0gPSBuYW1lO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoJ0lBVTIwMDAnIGluIG5hbWUpIHtcblx0ICAgICAgZGVmc1snSUFVMjAwMDonICsgbmFtZS5JQVUyMDAwXSA9IG5hbWU7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgY29uc29sZS5sb2cobmFtZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXG5cblx0fVxuXHRnbG9iYWxzKGRlZnMpO1xuXG5cdGZ1bmN0aW9uIHRlc3RPYmooY29kZSl7XG5cdCAgcmV0dXJuIHR5cGVvZiBjb2RlID09PSAnc3RyaW5nJztcblx0fVxuXHRmdW5jdGlvbiB0ZXN0RGVmKGNvZGUpe1xuXHQgIHJldHVybiBjb2RlIGluIGRlZnM7XG5cdH1cblx0IHZhciBjb2RlV29yZHMgPSBbJ1BST0pFQ1RFRENSUycsICdQUk9KQ1JTJywgJ0dFT0dDUycsJ0dFT0NDUycsJ1BST0pDUycsJ0xPQ0FMX0NTJywgJ0dFT0RDUlMnLCAnR0VPREVUSUNDUlMnLCAnR0VPREVUSUNEQVRVTScsICdFTkdDUlMnLCAnRU5HSU5FRVJJTkdDUlMnXTtcblx0ZnVuY3Rpb24gdGVzdFdLVChjb2RlKXtcblx0ICByZXR1cm4gY29kZVdvcmRzLnNvbWUoZnVuY3Rpb24gKHdvcmQpIHtcblx0ICAgIHJldHVybiBjb2RlLmluZGV4T2Yod29yZCkgPiAtMTtcblx0ICB9KTtcblx0fVxuXHR2YXIgY29kZXMgPSBbJzM4NTcnLCAnOTAwOTEzJywgJzM3ODUnLCAnMTAyMTEzJ107XG5cdGZ1bmN0aW9uIGNoZWNrTWVyY2F0b3IoaXRlbSkge1xuXHQgIHZhciBhdXRoID0gbWF0Y2goaXRlbSwgJ2F1dGhvcml0eScpO1xuXHQgIGlmICghYXV0aCkge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICB2YXIgY29kZSA9IG1hdGNoKGF1dGgsICdlcHNnJyk7XG5cdCAgcmV0dXJuIGNvZGUgJiYgY29kZXMuaW5kZXhPZihjb2RlKSA+IC0xO1xuXHR9XG5cdGZ1bmN0aW9uIGNoZWNrUHJvalN0cihpdGVtKSB7XG5cdCAgdmFyIGV4dCA9IG1hdGNoKGl0ZW0sICdleHRlbnNpb24nKTtcblx0ICBpZiAoIWV4dCkge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICByZXR1cm4gbWF0Y2goZXh0LCAncHJvajQnKTtcblx0fVxuXHRmdW5jdGlvbiB0ZXN0UHJvaihjb2RlKXtcblx0ICByZXR1cm4gY29kZVswXSA9PT0gJysnO1xuXHR9XG5cdGZ1bmN0aW9uIHBhcnNlKGNvZGUpe1xuXHQgIGlmICh0ZXN0T2JqKGNvZGUpKSB7XG5cdCAgICAvL2NoZWNrIHRvIHNlZSBpZiB0aGlzIGlzIGEgV0tUIHN0cmluZ1xuXHQgICAgaWYgKHRlc3REZWYoY29kZSkpIHtcblx0ICAgICAgcmV0dXJuIGRlZnNbY29kZV07XG5cdCAgICB9XG5cdCAgICBpZiAodGVzdFdLVChjb2RlKSkge1xuXHQgICAgICB2YXIgb3V0ID0gd2t0KGNvZGUpO1xuXHQgICAgICAvLyB0ZXN0IG9mIHNwZXRpYWwgY2FzZSwgZHVlIHRvIHRoaXMgYmVpbmcgYSB2ZXJ5IGNvbW1vbiBhbmQgb2Z0ZW4gbWFsZm9ybWVkXG5cdCAgICAgIGlmIChjaGVja01lcmNhdG9yKG91dCkpIHtcblx0ICAgICAgICByZXR1cm4gZGVmc1snRVBTRzozODU3J107XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIG1heWJlUHJvalN0ciA9IGNoZWNrUHJvalN0cihvdXQpO1xuXHQgICAgICBpZiAobWF5YmVQcm9qU3RyKSB7XG5cdCAgICAgICAgcmV0dXJuIHBhcnNlUHJvaihtYXliZVByb2pTdHIpO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBvdXQ7XG5cdCAgICB9XG5cdCAgICBpZiAodGVzdFByb2ooY29kZSkpIHtcblx0ICAgICAgcmV0dXJuIHBhcnNlUHJvaihjb2RlKTtcblx0ICAgIH1cblx0ICB9ZWxzZXtcblx0ICAgIHJldHVybiBjb2RlO1xuXHQgIH1cblx0fVxuXG5cdHZhciBleHRlbmQgPSBmdW5jdGlvbihkZXN0aW5hdGlvbiwgc291cmNlKSB7XG5cdCAgZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbiB8fCB7fTtcblx0ICB2YXIgdmFsdWUsIHByb3BlcnR5O1xuXHQgIGlmICghc291cmNlKSB7XG5cdCAgICByZXR1cm4gZGVzdGluYXRpb247XG5cdCAgfVxuXHQgIGZvciAocHJvcGVydHkgaW4gc291cmNlKSB7XG5cdCAgICB2YWx1ZSA9IHNvdXJjZVtwcm9wZXJ0eV07XG5cdCAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSB2YWx1ZTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuXHR9O1xuXG5cdHZhciBtc2ZueiA9IGZ1bmN0aW9uKGVjY2VudCwgc2lucGhpLCBjb3NwaGkpIHtcblx0ICB2YXIgY29uID0gZWNjZW50ICogc2lucGhpO1xuXHQgIHJldHVybiBjb3NwaGkgLyAoTWF0aC5zcXJ0KDEgLSBjb24gKiBjb24pKTtcblx0fTtcblxuXHR2YXIgc2lnbiA9IGZ1bmN0aW9uKHgpIHtcblx0ICByZXR1cm4geDwwID8gLTEgOiAxO1xuXHR9O1xuXG5cdHZhciBhZGp1c3RfbG9uID0gZnVuY3Rpb24oeCkge1xuXHQgIHJldHVybiAoTWF0aC5hYnMoeCkgPD0gU1BJKSA/IHggOiAoeCAtIChzaWduKHgpICogVFdPX1BJKSk7XG5cdH07XG5cblx0dmFyIHRzZm56ID0gZnVuY3Rpb24oZWNjZW50LCBwaGksIHNpbnBoaSkge1xuXHQgIHZhciBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG5cdCAgdmFyIGNvbSA9IDAuNSAqIGVjY2VudDtcblx0ICBjb24gPSBNYXRoLnBvdygoKDEgLSBjb24pIC8gKDEgKyBjb24pKSwgY29tKTtcblx0ICByZXR1cm4gKE1hdGgudGFuKDAuNSAqIChIQUxGX1BJIC0gcGhpKSkgLyBjb24pO1xuXHR9O1xuXG5cdHZhciBwaGkyeiA9IGZ1bmN0aW9uKGVjY2VudCwgdHMpIHtcblx0ICB2YXIgZWNjbnRoID0gMC41ICogZWNjZW50O1xuXHQgIHZhciBjb24sIGRwaGk7XG5cdCAgdmFyIHBoaSA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKHRzKTtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8PSAxNTsgaSsrKSB7XG5cdCAgICBjb24gPSBlY2NlbnQgKiBNYXRoLnNpbihwaGkpO1xuXHQgICAgZHBoaSA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKHRzICogKE1hdGgucG93KCgoMSAtIGNvbikgLyAoMSArIGNvbikpLCBlY2NudGgpKSkgLSBwaGk7XG5cdCAgICBwaGkgKz0gZHBoaTtcblx0ICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAwLjAwMDAwMDAwMDEpIHtcblx0ICAgICAgcmV0dXJuIHBoaTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLy9jb25zb2xlLmxvZyhcInBoaTJ6IGhhcyBOb0NvbnZlcmdlbmNlXCIpO1xuXHQgIHJldHVybiAtOTk5OTtcblx0fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHQgIHZhciBjb24gPSB0aGlzLmIgLyB0aGlzLmE7XG5cdCAgdGhpcy5lcyA9IDEgLSBjb24gKiBjb247XG5cdCAgaWYoISgneDAnIGluIHRoaXMpKXtcblx0ICAgIHRoaXMueDAgPSAwO1xuXHQgIH1cblx0ICBpZighKCd5MCcgaW4gdGhpcykpe1xuXHQgICAgdGhpcy55MCA9IDA7XG5cdCAgfVxuXHQgIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmVzKTtcblx0ICBpZiAodGhpcy5sYXRfdHMpIHtcblx0ICAgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgICB0aGlzLmswID0gTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHRoaXMuazAgPSBtc2Zueih0aGlzLmUsIE1hdGguc2luKHRoaXMubGF0X3RzKSwgTWF0aC5jb3ModGhpcy5sYXRfdHMpKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBpZiAoIXRoaXMuazApIHtcblx0ICAgICAgaWYgKHRoaXMuaykge1xuXHQgICAgICAgIHRoaXMuazAgPSB0aGlzLms7XG5cdCAgICAgIH1cblx0ICAgICAgZWxzZSB7XG5cdCAgICAgICAgdGhpcy5rMCA9IDE7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH1cblxuXHQvKiBNZXJjYXRvciBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0ZnVuY3Rpb24gZm9yd2FyZChwKSB7XG5cdCAgdmFyIGxvbiA9IHAueDtcblx0ICB2YXIgbGF0ID0gcC55O1xuXHQgIC8vIGNvbnZlcnQgdG8gcmFkaWFuc1xuXHQgIGlmIChsYXQgKiBSMkQgPiA5MCAmJiBsYXQgKiBSMkQgPCAtOTAgJiYgbG9uICogUjJEID4gMTgwICYmIGxvbiAqIFIyRCA8IC0xODApIHtcblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblxuXHQgIHZhciB4LCB5O1xuXHQgIGlmIChNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSkgPD0gRVBTTE4pIHtcblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgICB4ID0gdGhpcy54MCArIHRoaXMuYSAqIHRoaXMuazAgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgICAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIHRoaXMuazAgKiBNYXRoLmxvZyhNYXRoLnRhbihGT1JUUEkgKyAwLjUgKiBsYXQpKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICB2YXIgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcblx0ICAgICAgdmFyIHRzID0gdHNmbnoodGhpcy5lLCBsYXQsIHNpbnBoaSk7XG5cdCAgICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogdGhpcy5rMCAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG5cdCAgICAgIHkgPSB0aGlzLnkwIC0gdGhpcy5hICogdGhpcy5rMCAqIE1hdGgubG9nKHRzKTtcblx0ICAgIH1cblx0ICAgIHAueCA9IHg7XG5cdCAgICBwLnkgPSB5O1xuXHQgICAgcmV0dXJuIHA7XG5cdCAgfVxuXHR9XG5cblx0LyogTWVyY2F0b3IgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG5cdCAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBpbnZlcnNlKHApIHtcblxuXHQgIHZhciB4ID0gcC54IC0gdGhpcy54MDtcblx0ICB2YXIgeSA9IHAueSAtIHRoaXMueTA7XG5cdCAgdmFyIGxvbiwgbGF0O1xuXG5cdCAgaWYgKHRoaXMuc3BoZXJlKSB7XG5cdCAgICBsYXQgPSBIQUxGX1BJIC0gMiAqIE1hdGguYXRhbihNYXRoLmV4cCgteSAvICh0aGlzLmEgKiB0aGlzLmswKSkpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHZhciB0cyA9IE1hdGguZXhwKC15IC8gKHRoaXMuYSAqIHRoaXMuazApKTtcblx0ICAgIGxhdCA9IHBoaTJ6KHRoaXMuZSwgdHMpO1xuXHQgICAgaWYgKGxhdCA9PT0gLTk5OTkpIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgfVxuXHQgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHggLyAodGhpcy5hICogdGhpcy5rMCkpO1xuXG5cdCAgcC54ID0gbG9uO1xuXHQgIHAueSA9IGxhdDtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdHZhciBuYW1lcyQxID0gW1wiTWVyY2F0b3JcIiwgXCJQb3B1bGFyIFZpc3VhbGlzYXRpb24gUHNldWRvIE1lcmNhdG9yXCIsIFwiTWVyY2F0b3JfMVNQXCIsIFwiTWVyY2F0b3JfQXV4aWxpYXJ5X1NwaGVyZVwiLCBcIm1lcmNcIl07XG5cdHZhciBtZXJjID0ge1xuXHQgIGluaXQ6IGluaXQsXG5cdCAgZm9yd2FyZDogZm9yd2FyZCxcblx0ICBpbnZlcnNlOiBpbnZlcnNlLFxuXHQgIG5hbWVzOiBuYW1lcyQxXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQxKCkge1xuXHQgIC8vbm8tb3AgZm9yIGxvbmdsYXRcblx0fVxuXG5cdGZ1bmN0aW9uIGlkZW50aXR5KHB0KSB7XG5cdCAgcmV0dXJuIHB0O1xuXHR9XG5cdHZhciBuYW1lcyQyID0gW1wibG9uZ2xhdFwiLCBcImlkZW50aXR5XCJdO1xuXHR2YXIgbG9uZ2xhdCA9IHtcblx0ICBpbml0OiBpbml0JDEsXG5cdCAgZm9yd2FyZDogaWRlbnRpdHksXG5cdCAgaW52ZXJzZTogaWRlbnRpdHksXG5cdCAgbmFtZXM6IG5hbWVzJDJcblx0fTtcblxuXHR2YXIgcHJvanMgPSBbbWVyYywgbG9uZ2xhdF07XG5cdHZhciBuYW1lcyA9IHt9O1xuXHR2YXIgcHJvalN0b3JlID0gW107XG5cblx0ZnVuY3Rpb24gYWRkKHByb2osIGkpIHtcblx0ICB2YXIgbGVuID0gcHJvalN0b3JlLmxlbmd0aDtcblx0ICBpZiAoIXByb2oubmFtZXMpIHtcblx0ICAgIGNvbnNvbGUubG9nKGkpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIHByb2pTdG9yZVtsZW5dID0gcHJvajtcblx0ICBwcm9qLm5hbWVzLmZvckVhY2goZnVuY3Rpb24obikge1xuXHQgICAgbmFtZXNbbi50b0xvd2VyQ2FzZSgpXSA9IGxlbjtcblx0ICB9KTtcblx0ICByZXR1cm4gdGhpcztcblx0fVxuXG5cdGZ1bmN0aW9uIGdldChuYW1lKSB7XG5cdCAgaWYgKCFuYW1lKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIHZhciBuID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgIGlmICh0eXBlb2YgbmFtZXNbbl0gIT09ICd1bmRlZmluZWQnICYmIHByb2pTdG9yZVtuYW1lc1tuXV0pIHtcblx0ICAgIHJldHVybiBwcm9qU3RvcmVbbmFtZXNbbl1dO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIHN0YXJ0KCkge1xuXHQgIHByb2pzLmZvckVhY2goYWRkKTtcblx0fVxuXHR2YXIgcHJvamVjdGlvbnMgPSB7XG5cdCAgc3RhcnQ6IHN0YXJ0LFxuXHQgIGFkZDogYWRkLFxuXHQgIGdldDogZ2V0XG5cdH07XG5cblx0dmFyIGV4cG9ydHMkMiA9IHt9O1xuXHRleHBvcnRzJDIuTUVSSVQgPSB7XG5cdCAgYTogNjM3ODEzNy4wLFxuXHQgIHJmOiAyOTguMjU3LFxuXHQgIGVsbGlwc2VOYW1lOiBcIk1FUklUIDE5ODNcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5TR1M4NSA9IHtcblx0ICBhOiA2Mzc4MTM2LjAsXG5cdCAgcmY6IDI5OC4yNTcsXG5cdCAgZWxsaXBzZU5hbWU6IFwiU292aWV0IEdlb2RldGljIFN5c3RlbSA4NVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLkdSUzgwID0ge1xuXHQgIGE6IDYzNzgxMzcuMCxcblx0ICByZjogMjk4LjI1NzIyMjEwMSxcblx0ICBlbGxpcHNlTmFtZTogXCJHUlMgMTk4MChJVUdHLCAxOTgwKVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLklBVTc2ID0ge1xuXHQgIGE6IDYzNzgxNDAuMCxcblx0ICByZjogMjk4LjI1Nyxcblx0ICBlbGxpcHNlTmFtZTogXCJJQVUgMTk3NlwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmFpcnkgPSB7XG5cdCAgYTogNjM3NzU2My4zOTYsXG5cdCAgYjogNjM1NjI1Ni45MTAsXG5cdCAgZWxsaXBzZU5hbWU6IFwiQWlyeSAxODMwXCJcblx0fTtcblxuXHRleHBvcnRzJDIuQVBMNCA9IHtcblx0ICBhOiA2Mzc4MTM3LFxuXHQgIHJmOiAyOTguMjUsXG5cdCAgZWxsaXBzZU5hbWU6IFwiQXBwbC4gUGh5c2ljcy4gMTk2NVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLk5XTDlEID0ge1xuXHQgIGE6IDYzNzgxNDUuMCxcblx0ICByZjogMjk4LjI1LFxuXHQgIGVsbGlwc2VOYW1lOiBcIk5hdmFsIFdlYXBvbnMgTGFiLiwgMTk2NVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLm1vZF9haXJ5ID0ge1xuXHQgIGE6IDYzNzczNDAuMTg5LFxuXHQgIGI6IDYzNTYwMzQuNDQ2LFxuXHQgIGVsbGlwc2VOYW1lOiBcIk1vZGlmaWVkIEFpcnlcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5hbmRyYWUgPSB7XG5cdCAgYTogNjM3NzEwNC40Myxcblx0ICByZjogMzAwLjAsXG5cdCAgZWxsaXBzZU5hbWU6IFwiQW5kcmFlIDE4NzYgKERlbi4sIEljbG5kLilcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5hdXN0X1NBID0ge1xuXHQgIGE6IDYzNzgxNjAuMCxcblx0ICByZjogMjk4LjI1LFxuXHQgIGVsbGlwc2VOYW1lOiBcIkF1c3RyYWxpYW4gTmF0bCAmIFMuIEFtZXIuIDE5NjlcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5HUlM2NyA9IHtcblx0ICBhOiA2Mzc4MTYwLjAsXG5cdCAgcmY6IDI5OC4yNDcxNjc0MjcwLFxuXHQgIGVsbGlwc2VOYW1lOiBcIkdSUyA2NyhJVUdHIDE5NjcpXCJcblx0fTtcblxuXHRleHBvcnRzJDIuYmVzc2VsID0ge1xuXHQgIGE6IDYzNzczOTcuMTU1LFxuXHQgIHJmOiAyOTkuMTUyODEyOCxcblx0ICBlbGxpcHNlTmFtZTogXCJCZXNzZWwgMTg0MVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmJlc3NfbmFtID0ge1xuXHQgIGE6IDYzNzc0ODMuODY1LFxuXHQgIHJmOiAyOTkuMTUyODEyOCxcblx0ICBlbGxpcHNlTmFtZTogXCJCZXNzZWwgMTg0MSAoTmFtaWJpYSlcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5jbHJrNjYgPSB7XG5cdCAgYTogNjM3ODIwNi40LFxuXHQgIGI6IDYzNTY1ODMuOCxcblx0ICBlbGxpcHNlTmFtZTogXCJDbGFya2UgMTg2NlwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmNscms4MCA9IHtcblx0ICBhOiA2Mzc4MjQ5LjE0NSxcblx0ICByZjogMjkzLjQ2NjMsXG5cdCAgZWxsaXBzZU5hbWU6IFwiQ2xhcmtlIDE4ODAgbW9kLlwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmNscms1OCA9IHtcblx0ICBhOiA2Mzc4MjkzLjY0NTIwODc1OSxcblx0ICByZjogMjk0LjI2MDY3NjM2OTI2NTQsXG5cdCAgZWxsaXBzZU5hbWU6IFwiQ2xhcmtlIDE4NThcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5DUE0gPSB7XG5cdCAgYTogNjM3NTczOC43LFxuXHQgIHJmOiAzMzQuMjksXG5cdCAgZWxsaXBzZU5hbWU6IFwiQ29tbS4gZGVzIFBvaWRzIGV0IE1lc3VyZXMgMTc5OVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmRlbG1iciA9IHtcblx0ICBhOiA2Mzc2NDI4LjAsXG5cdCAgcmY6IDMxMS41LFxuXHQgIGVsbGlwc2VOYW1lOiBcIkRlbGFtYnJlIDE4MTAgKEJlbGdpdW0pXCJcblx0fTtcblxuXHRleHBvcnRzJDIuZW5nZWxpcyA9IHtcblx0ICBhOiA2Mzc4MTM2LjA1LFxuXHQgIHJmOiAyOTguMjU2Nixcblx0ICBlbGxpcHNlTmFtZTogXCJFbmdlbGlzIDE5ODVcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5ldnJzdDMwID0ge1xuXHQgIGE6IDYzNzcyNzYuMzQ1LFxuXHQgIHJmOiAzMDAuODAxNyxcblx0ICBlbGxpcHNlTmFtZTogXCJFdmVyZXN0IDE4MzBcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5ldnJzdDQ4ID0ge1xuXHQgIGE6IDYzNzczMDQuMDYzLFxuXHQgIHJmOiAzMDAuODAxNyxcblx0ICBlbGxpcHNlTmFtZTogXCJFdmVyZXN0IDE5NDhcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5ldnJzdDU2ID0ge1xuXHQgIGE6IDYzNzczMDEuMjQzLFxuXHQgIHJmOiAzMDAuODAxNyxcblx0ICBlbGxpcHNlTmFtZTogXCJFdmVyZXN0IDE5NTZcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5ldnJzdDY5ID0ge1xuXHQgIGE6IDYzNzcyOTUuNjY0LFxuXHQgIHJmOiAzMDAuODAxNyxcblx0ICBlbGxpcHNlTmFtZTogXCJFdmVyZXN0IDE5NjlcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5ldnJzdFNTID0ge1xuXHQgIGE6IDYzNzcyOTguNTU2LFxuXHQgIHJmOiAzMDAuODAxNyxcblx0ICBlbGxpcHNlTmFtZTogXCJFdmVyZXN0IChTYWJhaCAmIFNhcmF3YWspXCJcblx0fTtcblxuXHRleHBvcnRzJDIuZnNjaHI2MCA9IHtcblx0ICBhOiA2Mzc4MTY2LjAsXG5cdCAgcmY6IDI5OC4zLFxuXHQgIGVsbGlwc2VOYW1lOiBcIkZpc2NoZXIgKE1lcmN1cnkgRGF0dW0pIDE5NjBcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5mc2NocjYwbSA9IHtcblx0ICBhOiA2Mzc4MTU1LjAsXG5cdCAgcmY6IDI5OC4zLFxuXHQgIGVsbGlwc2VOYW1lOiBcIkZpc2NoZXIgMTk2MFwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmZzY2hyNjggPSB7XG5cdCAgYTogNjM3ODE1MC4wLFxuXHQgIHJmOiAyOTguMyxcblx0ICBlbGxpcHNlTmFtZTogXCJGaXNjaGVyIDE5NjhcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5oZWxtZXJ0ID0ge1xuXHQgIGE6IDYzNzgyMDAuMCxcblx0ICByZjogMjk4LjMsXG5cdCAgZWxsaXBzZU5hbWU6IFwiSGVsbWVydCAxOTA2XCJcblx0fTtcblxuXHRleHBvcnRzJDIuaG91Z2ggPSB7XG5cdCAgYTogNjM3ODI3MC4wLFxuXHQgIHJmOiAyOTcuMCxcblx0ICBlbGxpcHNlTmFtZTogXCJIb3VnaFwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmludGwgPSB7XG5cdCAgYTogNjM3ODM4OC4wLFxuXHQgIHJmOiAyOTcuMCxcblx0ICBlbGxpcHNlTmFtZTogXCJJbnRlcm5hdGlvbmFsIDE5MDkgKEhheWZvcmQpXCJcblx0fTtcblxuXHRleHBvcnRzJDIua2F1bGEgPSB7XG5cdCAgYTogNjM3ODE2My4wLFxuXHQgIHJmOiAyOTguMjQsXG5cdCAgZWxsaXBzZU5hbWU6IFwiS2F1bGEgMTk2MVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmxlcmNoID0ge1xuXHQgIGE6IDYzNzgxMzkuMCxcblx0ICByZjogMjk4LjI1Nyxcblx0ICBlbGxpcHNlTmFtZTogXCJMZXJjaCAxOTc5XCJcblx0fTtcblxuXHRleHBvcnRzJDIubXBydHMgPSB7XG5cdCAgYTogNjM5NzMwMC4wLFxuXHQgIHJmOiAxOTEuMCxcblx0ICBlbGxpcHNlTmFtZTogXCJNYXVwZXJ0aXVzIDE3MzhcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5uZXdfaW50bCA9IHtcblx0ICBhOiA2Mzc4MTU3LjUsXG5cdCAgYjogNjM1Njc3Mi4yLFxuXHQgIGVsbGlwc2VOYW1lOiBcIk5ldyBJbnRlcm5hdGlvbmFsIDE5NjdcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5wbGVzc2lzID0ge1xuXHQgIGE6IDYzNzY1MjMuMCxcblx0ICByZjogNjM1NTg2My4wLFxuXHQgIGVsbGlwc2VOYW1lOiBcIlBsZXNzaXMgMTgxNyAoRnJhbmNlKVwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLmtyYXNzID0ge1xuXHQgIGE6IDYzNzgyNDUuMCxcblx0ICByZjogMjk4LjMsXG5cdCAgZWxsaXBzZU5hbWU6IFwiS3Jhc3NvdnNreSwgMTk0MlwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLlNFYXNpYSA9IHtcblx0ICBhOiA2Mzc4MTU1LjAsXG5cdCAgYjogNjM1Njc3My4zMjA1LFxuXHQgIGVsbGlwc2VOYW1lOiBcIlNvdXRoZWFzdCBBc2lhXCJcblx0fTtcblxuXHRleHBvcnRzJDIud2FsYmVjayA9IHtcblx0ICBhOiA2Mzc2ODk2LjAsXG5cdCAgYjogNjM1NTgzNC44NDY3LFxuXHQgIGVsbGlwc2VOYW1lOiBcIldhbGJlY2tcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMi5XR1M2MCA9IHtcblx0ICBhOiA2Mzc4MTY1LjAsXG5cdCAgcmY6IDI5OC4zLFxuXHQgIGVsbGlwc2VOYW1lOiBcIldHUyA2MFwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLldHUzY2ID0ge1xuXHQgIGE6IDYzNzgxNDUuMCxcblx0ICByZjogMjk4LjI1LFxuXHQgIGVsbGlwc2VOYW1lOiBcIldHUyA2NlwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLldHUzcgPSB7XG5cdCAgYTogNjM3ODEzNS4wLFxuXHQgIHJmOiAyOTguMjYsXG5cdCAgZWxsaXBzZU5hbWU6IFwiV0dTIDcyXCJcblx0fTtcblxuXHR2YXIgV0dTODQgPSBleHBvcnRzJDIuV0dTODQgPSB7XG5cdCAgYTogNjM3ODEzNy4wLFxuXHQgIHJmOiAyOTguMjU3MjIzNTYzLFxuXHQgIGVsbGlwc2VOYW1lOiBcIldHUyA4NFwiXG5cdH07XG5cblx0ZXhwb3J0cyQyLnNwaGVyZSA9IHtcblx0ICBhOiA2MzcwOTk3LjAsXG5cdCAgYjogNjM3MDk5Ny4wLFxuXHQgIGVsbGlwc2VOYW1lOiBcIk5vcm1hbCBTcGhlcmUgKHI9NjM3MDk5NylcIlxuXHR9O1xuXG5cdGZ1bmN0aW9uIGVjY2VudHJpY2l0eShhLCBiLCByZiwgUl9BKSB7XG5cdCAgdmFyIGEyID0gYSAqIGE7IC8vIHVzZWQgaW4gZ2VvY2VudHJpY1xuXHQgIHZhciBiMiA9IGIgKiBiOyAvLyB1c2VkIGluIGdlb2NlbnRyaWNcblx0ICB2YXIgZXMgPSAoYTIgLSBiMikgLyBhMjsgLy8gZSBeIDJcblx0ICB2YXIgZSA9IDA7XG5cdCAgaWYgKFJfQSkge1xuXHQgICAgYSAqPSAxIC0gZXMgKiAoU0lYVEggKyBlcyAqIChSQTQgKyBlcyAqIFJBNikpO1xuXHQgICAgYTIgPSBhICogYTtcblx0ICAgIGVzID0gMDtcblx0ICB9IGVsc2Uge1xuXHQgICAgZSA9IE1hdGguc3FydChlcyk7IC8vIGVjY2VudHJpY2l0eVxuXHQgIH1cblx0ICB2YXIgZXAyID0gKGEyIC0gYjIpIC8gYjI7IC8vIHVzZWQgaW4gZ2VvY2VudHJpY1xuXHQgIHJldHVybiB7XG5cdCAgICBlczogZXMsXG5cdCAgICBlOiBlLFxuXHQgICAgZXAyOiBlcDJcblx0ICB9O1xuXHR9XG5cdGZ1bmN0aW9uIHNwaGVyZShhLCBiLCByZiwgZWxscHMsIHNwaGVyZSkge1xuXHQgIGlmICghYSkgeyAvLyBkbyB3ZSBoYXZlIGFuIGVsbGlwc29pZD9cblx0ICAgIHZhciBlbGxpcHNlID0gbWF0Y2goZXhwb3J0cyQyLCBlbGxwcyk7XG5cdCAgICBpZiAoIWVsbGlwc2UpIHtcblx0ICAgICAgZWxsaXBzZSA9IFdHUzg0O1xuXHQgICAgfVxuXHQgICAgYSA9IGVsbGlwc2UuYTtcblx0ICAgIGIgPSBlbGxpcHNlLmI7XG5cdCAgICByZiA9IGVsbGlwc2UucmY7XG5cdCAgfVxuXG5cdCAgaWYgKHJmICYmICFiKSB7XG5cdCAgICBiID0gKDEuMCAtIDEuMCAvIHJmKSAqIGE7XG5cdCAgfVxuXHQgIGlmIChyZiA9PT0gMCB8fCBNYXRoLmFicyhhIC0gYikgPCBFUFNMTikge1xuXHQgICAgc3BoZXJlID0gdHJ1ZTtcblx0ICAgIGIgPSBhO1xuXHQgIH1cblx0ICByZXR1cm4ge1xuXHQgICAgYTogYSxcblx0ICAgIGI6IGIsXG5cdCAgICByZjogcmYsXG5cdCAgICBzcGhlcmU6IHNwaGVyZVxuXHQgIH07XG5cdH1cblxuXHR2YXIgZXhwb3J0cyQzID0ge307XG5cdGV4cG9ydHMkMy53Z3M4NCA9IHtcblx0ICB0b3dnczg0OiBcIjAsMCwwXCIsXG5cdCAgZWxsaXBzZTogXCJXR1M4NFwiLFxuXHQgIGRhdHVtTmFtZTogXCJXR1M4NFwiXG5cdH07XG5cblx0ZXhwb3J0cyQzLmNoMTkwMyA9IHtcblx0ICB0b3dnczg0OiBcIjY3NC4zNzQsMTUuMDU2LDQwNS4zNDZcIixcblx0ICBlbGxpcHNlOiBcImJlc3NlbFwiLFxuXHQgIGRhdHVtTmFtZTogXCJzd2lzc1wiXG5cdH07XG5cblx0ZXhwb3J0cyQzLmdncnM4NyA9IHtcblx0ICB0b3dnczg0OiBcIi0xOTkuODcsNzQuNzksMjQ2LjYyXCIsXG5cdCAgZWxsaXBzZTogXCJHUlM4MFwiLFxuXHQgIGRhdHVtTmFtZTogXCJHcmVla19HZW9kZXRpY19SZWZlcmVuY2VfU3lzdGVtXzE5ODdcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMy5uYWQ4MyA9IHtcblx0ICB0b3dnczg0OiBcIjAsMCwwXCIsXG5cdCAgZWxsaXBzZTogXCJHUlM4MFwiLFxuXHQgIGRhdHVtTmFtZTogXCJOb3J0aF9BbWVyaWNhbl9EYXR1bV8xOTgzXCJcblx0fTtcblxuXHRleHBvcnRzJDMubmFkMjcgPSB7XG5cdCAgbmFkZ3JpZHM6IFwiQGNvbnVzLEBhbGFza2EsQG50djJfMC5nc2IsQG50djFfY2FuLmRhdFwiLFxuXHQgIGVsbGlwc2U6IFwiY2xyazY2XCIsXG5cdCAgZGF0dW1OYW1lOiBcIk5vcnRoX0FtZXJpY2FuX0RhdHVtXzE5MjdcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMy5wb3RzZGFtID0ge1xuXHQgIHRvd2dzODQ6IFwiNjA2LjAsMjMuMCw0MTMuMFwiLFxuXHQgIGVsbGlwc2U6IFwiYmVzc2VsXCIsXG5cdCAgZGF0dW1OYW1lOiBcIlBvdHNkYW0gUmF1ZW5iZXJnIDE5NTAgREhETlwiXG5cdH07XG5cblx0ZXhwb3J0cyQzLmNhcnRoYWdlID0ge1xuXHQgIHRvd2dzODQ6IFwiLTI2My4wLDYuMCw0MzEuMFwiLFxuXHQgIGVsbGlwc2U6IFwiY2xhcms4MFwiLFxuXHQgIGRhdHVtTmFtZTogXCJDYXJ0aGFnZSAxOTM0IFR1bmlzaWFcIlxuXHR9O1xuXG5cdGV4cG9ydHMkMy5oZXJtYW5uc2tvZ2VsID0ge1xuXHQgIHRvd2dzODQ6IFwiNjUzLjAsLTIxMi4wLDQ0OS4wXCIsXG5cdCAgZWxsaXBzZTogXCJiZXNzZWxcIixcblx0ICBkYXR1bU5hbWU6IFwiSGVybWFubnNrb2dlbFwiXG5cdH07XG5cblx0ZXhwb3J0cyQzLm9zbmk1MiA9IHtcblx0ICB0b3dnczg0OiBcIjQ4Mi41MzAsLTEzMC41OTYsNTY0LjU1NywtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1XCIsXG5cdCAgZWxsaXBzZTogXCJhaXJ5XCIsXG5cdCAgZGF0dW1OYW1lOiBcIklyaXNoIE5hdGlvbmFsXCJcblx0fTtcblxuXHRleHBvcnRzJDMuaXJlNjUgPSB7XG5cdCAgdG93Z3M4NDogXCI0ODIuNTMwLC0xMzAuNTk2LDU2NC41NTcsLTEuMDQyLC0wLjIxNCwtMC42MzEsOC4xNVwiLFxuXHQgIGVsbGlwc2U6IFwibW9kX2FpcnlcIixcblx0ICBkYXR1bU5hbWU6IFwiSXJlbGFuZCAxOTY1XCJcblx0fTtcblxuXHRleHBvcnRzJDMucmFzc2FkaXJhbiA9IHtcblx0ICB0b3dnczg0OiBcIi0xMzMuNjMsLTE1Ny41LC0xNTguNjJcIixcblx0ICBlbGxpcHNlOiBcImludGxcIixcblx0ICBkYXR1bU5hbWU6IFwiUmFzc2FkaXJhblwiXG5cdH07XG5cblx0ZXhwb3J0cyQzLm56Z2Q0OSA9IHtcblx0ICB0b3dnczg0OiBcIjU5LjQ3LC01LjA0LDE4Ny40NCwwLjQ3LC0wLjEsMS4wMjQsLTQuNTk5M1wiLFxuXHQgIGVsbGlwc2U6IFwiaW50bFwiLFxuXHQgIGRhdHVtTmFtZTogXCJOZXcgWmVhbGFuZCBHZW9kZXRpYyBEYXR1bSAxOTQ5XCJcblx0fTtcblxuXHRleHBvcnRzJDMub3NnYjM2ID0ge1xuXHQgIHRvd2dzODQ6IFwiNDQ2LjQ0OCwtMTI1LjE1Nyw1NDIuMDYwLDAuMTUwMiwwLjI0NzAsMC44NDIxLC0yMC40ODk0XCIsXG5cdCAgZWxsaXBzZTogXCJhaXJ5XCIsXG5cdCAgZGF0dW1OYW1lOiBcIkFpcnkgMTgzMFwiXG5cdH07XG5cblx0ZXhwb3J0cyQzLnNfanRzayA9IHtcblx0ICB0b3dnczg0OiBcIjU4OSw3Niw0ODBcIixcblx0ICBlbGxpcHNlOiAnYmVzc2VsJyxcblx0ICBkYXR1bU5hbWU6ICdTLUpUU0sgKEZlcnJvKSdcblx0fTtcblxuXHRleHBvcnRzJDMuYmVkdWFyYW0gPSB7XG5cdCAgdG93Z3M4NDogJy0xMDYsLTg3LDE4OCcsXG5cdCAgZWxsaXBzZTogJ2Nscms4MCcsXG5cdCAgZGF0dW1OYW1lOiAnQmVkdWFyYW0nXG5cdH07XG5cblx0ZXhwb3J0cyQzLmd1bnVuZ19zZWdhcmEgPSB7XG5cdCAgdG93Z3M4NDogJy00MDMsNjg0LDQxJyxcblx0ICBlbGxpcHNlOiAnYmVzc2VsJyxcblx0ICBkYXR1bU5hbWU6ICdHdW51bmcgU2VnYXJhIEpha2FydGEnXG5cdH07XG5cblx0ZXhwb3J0cyQzLnJuYjcyID0ge1xuXHQgIHRvd2dzODQ6IFwiMTA2Ljg2OSwtNTIuMjk3OCwxMDMuNzI0LC0wLjMzNjU3LDAuNDU2OTU1LC0xLjg0MjE4LDFcIixcblx0ICBlbGxpcHNlOiBcImludGxcIixcblx0ICBkYXR1bU5hbWU6IFwiUmVzZWF1IE5hdGlvbmFsIEJlbGdlIDE5NzJcIlxuXHR9O1xuXG5cdGZ1bmN0aW9uIGRhdHVtKGRhdHVtQ29kZSwgZGF0dW1fcGFyYW1zLCBhLCBiLCBlcywgZXAyKSB7XG5cdCAgdmFyIG91dCA9IHt9O1xuXG5cdCAgaWYgKGRhdHVtQ29kZSA9PT0gdW5kZWZpbmVkIHx8IGRhdHVtQ29kZSA9PT0gJ25vbmUnKSB7XG5cdCAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF9OT0RBVFVNO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF9XR1M4NDtcblx0ICB9XG5cblx0ICBpZiAoZGF0dW1fcGFyYW1zKSB7XG5cdCAgICBvdXQuZGF0dW1fcGFyYW1zID0gZGF0dW1fcGFyYW1zLm1hcChwYXJzZUZsb2F0KTtcblx0ICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zWzBdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbMV0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1syXSAhPT0gMCkge1xuXHQgICAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF8zUEFSQU07XG5cdCAgICB9XG5cdCAgICBpZiAob3V0LmRhdHVtX3BhcmFtcy5sZW5ndGggPiAzKSB7XG5cdCAgICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zWzNdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbNF0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1s1XSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzZdICE9PSAwKSB7XG5cdCAgICAgICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfN1BBUkFNO1xuXHQgICAgICAgIG91dC5kYXR1bV9wYXJhbXNbM10gKj0gU0VDX1RPX1JBRDtcblx0ICAgICAgICBvdXQuZGF0dW1fcGFyYW1zWzRdICo9IFNFQ19UT19SQUQ7XG5cdCAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1s1XSAqPSBTRUNfVE9fUkFEO1xuXHQgICAgICAgIG91dC5kYXR1bV9wYXJhbXNbNl0gPSAob3V0LmRhdHVtX3BhcmFtc1s2XSAvIDEwMDAwMDAuMCkgKyAxLjA7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cblx0ICBvdXQuYSA9IGE7IC8vZGF0dW0gb2JqZWN0IGFsc28gdXNlcyB0aGVzZSB2YWx1ZXNcblx0ICBvdXQuYiA9IGI7XG5cdCAgb3V0LmVzID0gZXM7XG5cdCAgb3V0LmVwMiA9IGVwMjtcblx0ICByZXR1cm4gb3V0O1xuXHR9XG5cblx0ZnVuY3Rpb24gUHJvamVjdGlvbihzcnNDb2RlLGNhbGxiYWNrKSB7XG5cdCAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb2plY3Rpb24pKSB7XG5cdCAgICByZXR1cm4gbmV3IFByb2plY3Rpb24oc3JzQ29kZSk7XG5cdCAgfVxuXHQgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJyb3Ipe1xuXHQgICAgaWYoZXJyb3Ipe1xuXHQgICAgICB0aHJvdyBlcnJvcjtcblx0ICAgIH1cblx0ICB9O1xuXHQgIHZhciBqc29uID0gcGFyc2Uoc3JzQ29kZSk7XG5cdCAgaWYodHlwZW9mIGpzb24gIT09ICdvYmplY3QnKXtcblx0ICAgIGNhbGxiYWNrKHNyc0NvZGUpO1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICB2YXIgb3VyUHJvaiA9IFByb2plY3Rpb24ucHJvamVjdGlvbnMuZ2V0KGpzb24ucHJvak5hbWUpO1xuXHQgIGlmKCFvdXJQcm9qKXtcblx0ICAgIGNhbGxiYWNrKHNyc0NvZGUpO1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICBpZiAoanNvbi5kYXR1bUNvZGUgJiYganNvbi5kYXR1bUNvZGUgIT09ICdub25lJykge1xuXHQgICAgdmFyIGRhdHVtRGVmID0gbWF0Y2goZXhwb3J0cyQzLCBqc29uLmRhdHVtQ29kZSk7XG5cdCAgICBpZiAoZGF0dW1EZWYpIHtcblx0ICAgICAganNvbi5kYXR1bV9wYXJhbXMgPSBkYXR1bURlZi50b3dnczg0ID8gZGF0dW1EZWYudG93Z3M4NC5zcGxpdCgnLCcpIDogbnVsbDtcblx0ICAgICAganNvbi5lbGxwcyA9IGRhdHVtRGVmLmVsbGlwc2U7XG5cdCAgICAgIGpzb24uZGF0dW1OYW1lID0gZGF0dW1EZWYuZGF0dW1OYW1lID8gZGF0dW1EZWYuZGF0dW1OYW1lIDoganNvbi5kYXR1bUNvZGU7XG5cdCAgICB9XG5cdCAgfVxuXHQgIGpzb24uazAgPSBqc29uLmswIHx8IDEuMDtcblx0ICBqc29uLmF4aXMgPSBqc29uLmF4aXMgfHwgJ2VudSc7XG5cdCAganNvbi5lbGxwcyA9IGpzb24uZWxscHMgfHwgJ3dnczg0Jztcblx0ICB2YXIgc3BoZXJlXyA9IHNwaGVyZShqc29uLmEsIGpzb24uYiwganNvbi5yZiwganNvbi5lbGxwcywganNvbi5zcGhlcmUpO1xuXHQgIHZhciBlY2MgPSBlY2NlbnRyaWNpdHkoc3BoZXJlXy5hLCBzcGhlcmVfLmIsIHNwaGVyZV8ucmYsIGpzb24uUl9BKTtcblx0ICB2YXIgZGF0dW1PYmogPSBqc29uLmRhdHVtIHx8IGRhdHVtKGpzb24uZGF0dW1Db2RlLCBqc29uLmRhdHVtX3BhcmFtcywgc3BoZXJlXy5hLCBzcGhlcmVfLmIsIGVjYy5lcywgZWNjLmVwMik7XG5cblx0ICBleHRlbmQodGhpcywganNvbik7IC8vIHRyYW5zZmVyIGV2ZXJ5dGhpbmcgb3ZlciBmcm9tIHRoZSBwcm9qZWN0aW9uIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IHdlJ2xsIG5lZWRcblx0ICBleHRlbmQodGhpcywgb3VyUHJvaik7IC8vIHRyYW5zZmVyIGFsbCB0aGUgbWV0aG9kcyBmcm9tIHRoZSBwcm9qZWN0aW9uXG5cblx0ICAvLyBjb3B5IHRoZSA0IHRoaW5ncyBvdmVyIHdlIGNhbHVsYXRlZCBpbiBkZXJpdmVDb25zdGFudHMuc3BoZXJlXG5cdCAgdGhpcy5hID0gc3BoZXJlXy5hO1xuXHQgIHRoaXMuYiA9IHNwaGVyZV8uYjtcblx0ICB0aGlzLnJmID0gc3BoZXJlXy5yZjtcblx0ICB0aGlzLnNwaGVyZSA9IHNwaGVyZV8uc3BoZXJlO1xuXG5cdCAgLy8gY29weSB0aGUgMyB0aGluZ3Mgd2UgY2FsY3VsYXRlZCBpbiBkZXJpdmVDb25zdGFudHMuZWNjZW50cmljaXR5XG5cdCAgdGhpcy5lcyA9IGVjYy5lcztcblx0ICB0aGlzLmUgPSBlY2MuZTtcblx0ICB0aGlzLmVwMiA9IGVjYy5lcDI7XG5cblx0ICAvLyBhZGQgaW4gdGhlIGRhdHVtIG9iamVjdFxuXHQgIHRoaXMuZGF0dW0gPSBkYXR1bU9iajtcblxuXHQgIC8vIGluaXQgdGhlIHByb2plY3Rpb25cblx0ICB0aGlzLmluaXQoKTtcblxuXHQgIC8vIGxlZ2VjeSBjYWxsYmFjayBmcm9tIGJhY2sgaW4gdGhlIGRheSB3aGVuIGl0IHdlbnQgdG8gc3BhdGlhbHJlZmVyZW5jZS5vcmdcblx0ICBjYWxsYmFjayhudWxsLCB0aGlzKTtcblxuXHR9XG5cdFByb2plY3Rpb24ucHJvamVjdGlvbnMgPSBwcm9qZWN0aW9ucztcblx0UHJvamVjdGlvbi5wcm9qZWN0aW9ucy5zdGFydCgpO1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0ZnVuY3Rpb24gY29tcGFyZURhdHVtcyhzb3VyY2UsIGRlc3QpIHtcblx0ICBpZiAoc291cmNlLmRhdHVtX3R5cGUgIT09IGRlc3QuZGF0dW1fdHlwZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlOyAvLyBmYWxzZSwgZGF0dW1zIGFyZSBub3QgZXF1YWxcblx0ICB9IGVsc2UgaWYgKHNvdXJjZS5hICE9PSBkZXN0LmEgfHwgTWF0aC5hYnMoc291cmNlLmVzIC0gZGVzdC5lcykgPiAwLjAwMDAwMDAwMDA1MCkge1xuXHQgICAgLy8gdGhlIHRvbGVyYW5jZSBmb3IgZXMgaXMgdG8gZW5zdXJlIHRoYXQgR1JTODAgYW5kIFdHUzg0XG5cdCAgICAvLyBhcmUgY29uc2lkZXJlZCBpZGVudGljYWxcblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9IGVsc2UgaWYgKHNvdXJjZS5kYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG5cdCAgICByZXR1cm4gKHNvdXJjZS5kYXR1bV9wYXJhbXNbMF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzBdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzFdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzJdKTtcblx0ICB9IGVsc2UgaWYgKHNvdXJjZS5kYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG5cdCAgICByZXR1cm4gKHNvdXJjZS5kYXR1bV9wYXJhbXNbMF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzBdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzFdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzJdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbM10gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzNdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbNF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzRdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbNV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzVdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbNl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzZdKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmV0dXJuIHRydWU7IC8vIGRhdHVtcyBhcmUgZXF1YWxcblx0ICB9XG5cdH0gLy8gY3NfY29tcGFyZV9kYXR1bXMoKVxuXG5cdC8qXG5cdCAqIFRoZSBmdW5jdGlvbiBDb252ZXJ0X0dlb2RldGljX1RvX0dlb2NlbnRyaWMgY29udmVydHMgZ2VvZGV0aWMgY29vcmRpbmF0ZXNcblx0ICogKGxhdGl0dWRlLCBsb25naXR1ZGUsIGFuZCBoZWlnaHQpIHRvIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKFgsIFksIFopLFxuXHQgKiBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZWxsaXBzb2lkIHBhcmFtZXRlcnMuXG5cdCAqXG5cdCAqICAgIExhdGl0dWRlICA6IEdlb2RldGljIGxhdGl0dWRlIGluIHJhZGlhbnMgICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG5cdCAqICAgIExvbmdpdHVkZSA6IEdlb2RldGljIGxvbmdpdHVkZSBpbiByYWRpYW5zICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG5cdCAqICAgIEhlaWdodCAgICA6IEdlb2RldGljIGhlaWdodCwgaW4gbWV0ZXJzICAgICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG5cdCAqICAgIFggICAgICAgICA6IENhbGN1bGF0ZWQgR2VvY2VudHJpYyBYIGNvb3JkaW5hdGUsIGluIG1ldGVycyAgICAob3V0cHV0KVxuXHQgKiAgICBZICAgICAgICAgOiBDYWxjdWxhdGVkIEdlb2NlbnRyaWMgWSBjb29yZGluYXRlLCBpbiBtZXRlcnMgICAgKG91dHB1dClcblx0ICogICAgWiAgICAgICAgIDogQ2FsY3VsYXRlZCBHZW9jZW50cmljIFogY29vcmRpbmF0ZSwgaW4gbWV0ZXJzICAgIChvdXRwdXQpXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBnZW9kZXRpY1RvR2VvY2VudHJpYyhwLCBlcywgYSkge1xuXHQgIHZhciBMb25naXR1ZGUgPSBwLng7XG5cdCAgdmFyIExhdGl0dWRlID0gcC55O1xuXHQgIHZhciBIZWlnaHQgPSBwLnogPyBwLnogOiAwOyAvL1ogdmFsdWUgbm90IGFsd2F5cyBzdXBwbGllZFxuXG5cdCAgdmFyIFJuOyAvKiAgRWFydGggcmFkaXVzIGF0IGxvY2F0aW9uICAqL1xuXHQgIHZhciBTaW5fTGF0OyAvKiAgTWF0aC5zaW4oTGF0aXR1ZGUpICAqL1xuXHQgIHZhciBTaW4yX0xhdDsgLyogIFNxdWFyZSBvZiBNYXRoLnNpbihMYXRpdHVkZSkgICovXG5cdCAgdmFyIENvc19MYXQ7IC8qICBNYXRoLmNvcyhMYXRpdHVkZSkgICovXG5cblx0ICAvKlxuXHQgICAqKiBEb24ndCBibG93IHVwIGlmIExhdGl0dWRlIGlzIGp1c3QgYSBsaXR0bGUgb3V0IG9mIHRoZSB2YWx1ZVxuXHQgICAqKiByYW5nZSBhcyBpdCBtYXkganVzdCBiZSBhIHJvdW5kaW5nIGlzc3VlLiAgQWxzbyByZW1vdmVkIGxvbmdpdHVkZVxuXHQgICAqKiB0ZXN0LCBpdCBzaG91bGQgYmUgd3JhcHBlZCBieSBNYXRoLmNvcygpIGFuZCBNYXRoLnNpbigpLiAgTkZXIGZvciBQUk9KLjQsIFNlcC8yMDAxLlxuXHQgICAqL1xuXHQgIGlmIChMYXRpdHVkZSA8IC1IQUxGX1BJICYmIExhdGl0dWRlID4gLTEuMDAxICogSEFMRl9QSSkge1xuXHQgICAgTGF0aXR1ZGUgPSAtSEFMRl9QSTtcblx0ICB9IGVsc2UgaWYgKExhdGl0dWRlID4gSEFMRl9QSSAmJiBMYXRpdHVkZSA8IDEuMDAxICogSEFMRl9QSSkge1xuXHQgICAgTGF0aXR1ZGUgPSBIQUxGX1BJO1xuXHQgIH0gZWxzZSBpZiAoTGF0aXR1ZGUgPCAtSEFMRl9QSSkge1xuXHQgICAgLyogTGF0aXR1ZGUgb3V0IG9mIHJhbmdlICovXG5cdCAgICAvLy4ucmVwb3J0RXJyb3IoJ2dlb2NlbnQ6bGF0IG91dCBvZiByYW5nZTonICsgTGF0aXR1ZGUpO1xuXHQgICAgcmV0dXJuIHsgeDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIHo6IHAueiB9O1xuXHQgIH0gZWxzZSBpZiAoTGF0aXR1ZGUgPiBIQUxGX1BJKSB7XG5cdCAgICAvKiBMYXRpdHVkZSBvdXQgb2YgcmFuZ2UgKi9cblx0ICAgIHJldHVybiB7IHg6IEluZmluaXR5LCB5OiBJbmZpbml0eSwgejogcC56IH07XG5cdCAgfVxuXG5cdCAgaWYgKExvbmdpdHVkZSA+IE1hdGguUEkpIHtcblx0ICAgIExvbmdpdHVkZSAtPSAoMiAqIE1hdGguUEkpO1xuXHQgIH1cblx0ICBTaW5fTGF0ID0gTWF0aC5zaW4oTGF0aXR1ZGUpO1xuXHQgIENvc19MYXQgPSBNYXRoLmNvcyhMYXRpdHVkZSk7XG5cdCAgU2luMl9MYXQgPSBTaW5fTGF0ICogU2luX0xhdDtcblx0ICBSbiA9IGEgLyAoTWF0aC5zcXJ0KDEuMGUwIC0gZXMgKiBTaW4yX0xhdCkpO1xuXHQgIHJldHVybiB7XG5cdCAgICB4OiAoUm4gKyBIZWlnaHQpICogQ29zX0xhdCAqIE1hdGguY29zKExvbmdpdHVkZSksXG5cdCAgICB5OiAoUm4gKyBIZWlnaHQpICogQ29zX0xhdCAqIE1hdGguc2luKExvbmdpdHVkZSksXG5cdCAgICB6OiAoKFJuICogKDEgLSBlcykpICsgSGVpZ2h0KSAqIFNpbl9MYXRcblx0ICB9O1xuXHR9IC8vIGNzX2dlb2RldGljX3RvX2dlb2NlbnRyaWMoKVxuXG5cdGZ1bmN0aW9uIGdlb2NlbnRyaWNUb0dlb2RldGljKHAsIGVzLCBhLCBiKSB7XG5cdCAgLyogbG9jYWwgZGVmaW50aW9ucyBhbmQgdmFyaWFibGVzICovXG5cdCAgLyogZW5kLWNyaXRlcml1bSBvZiBsb29wLCBhY2N1cmFjeSBvZiBzaW4oTGF0aXR1ZGUpICovXG5cdCAgdmFyIGdlbmF1ID0gMWUtMTI7XG5cdCAgdmFyIGdlbmF1MiA9IChnZW5hdSAqIGdlbmF1KTtcblx0ICB2YXIgbWF4aXRlciA9IDMwO1xuXG5cdCAgdmFyIFA7IC8qIGRpc3RhbmNlIGJldHdlZW4gc2VtaS1taW5vciBheGlzIGFuZCBsb2NhdGlvbiAqL1xuXHQgIHZhciBSUjsgLyogZGlzdGFuY2UgYmV0d2VlbiBjZW50ZXIgYW5kIGxvY2F0aW9uICovXG5cdCAgdmFyIENUOyAvKiBzaW4gb2YgZ2VvY2VudHJpYyBsYXRpdHVkZSAqL1xuXHQgIHZhciBTVDsgLyogY29zIG9mIGdlb2NlbnRyaWMgbGF0aXR1ZGUgKi9cblx0ICB2YXIgUlg7XG5cdCAgdmFyIFJLO1xuXHQgIHZhciBSTjsgLyogRWFydGggcmFkaXVzIGF0IGxvY2F0aW9uICovXG5cdCAgdmFyIENQSEkwOyAvKiBjb3Mgb2Ygc3RhcnQgb3Igb2xkIGdlb2RldGljIGxhdGl0dWRlIGluIGl0ZXJhdGlvbnMgKi9cblx0ICB2YXIgU1BISTA7IC8qIHNpbiBvZiBzdGFydCBvciBvbGQgZ2VvZGV0aWMgbGF0aXR1ZGUgaW4gaXRlcmF0aW9ucyAqL1xuXHQgIHZhciBDUEhJOyAvKiBjb3Mgb2Ygc2VhcmNoZWQgZ2VvZGV0aWMgbGF0aXR1ZGUgKi9cblx0ICB2YXIgU1BISTsgLyogc2luIG9mIHNlYXJjaGVkIGdlb2RldGljIGxhdGl0dWRlICovXG5cdCAgdmFyIFNEUEhJOyAvKiBlbmQtY3JpdGVyaXVtOiBhZGRpdGlvbi10aGVvcmVtIG9mIHNpbihMYXRpdHVkZShpdGVyKS1MYXRpdHVkZShpdGVyLTEpKSAqL1xuXHQgIHZhciBpdGVyOyAvKiAjIG9mIGNvbnRpbm91cyBpdGVyYXRpb24sIG1heC4gMzAgaXMgYWx3YXlzIGVub3VnaCAocy5hLikgKi9cblxuXHQgIHZhciBYID0gcC54O1xuXHQgIHZhciBZID0gcC55O1xuXHQgIHZhciBaID0gcC56ID8gcC56IDogMC4wOyAvL1ogdmFsdWUgbm90IGFsd2F5cyBzdXBwbGllZFxuXHQgIHZhciBMb25naXR1ZGU7XG5cdCAgdmFyIExhdGl0dWRlO1xuXHQgIHZhciBIZWlnaHQ7XG5cblx0ICBQID0gTWF0aC5zcXJ0KFggKiBYICsgWSAqIFkpO1xuXHQgIFJSID0gTWF0aC5zcXJ0KFggKiBYICsgWSAqIFkgKyBaICogWik7XG5cblx0ICAvKiAgICAgIHNwZWNpYWwgY2FzZXMgZm9yIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgKi9cblx0ICBpZiAoUCAvIGEgPCBnZW5hdSkge1xuXG5cdCAgICAvKiAgc3BlY2lhbCBjYXNlLCBpZiBQPTAuIChYPTAuLCBZPTAuKSAqL1xuXHQgICAgTG9uZ2l0dWRlID0gMC4wO1xuXG5cdCAgICAvKiAgaWYgKFgsWSxaKT0oMC4sMC4sMC4pIHRoZW4gSGVpZ2h0IGJlY29tZXMgc2VtaS1taW5vciBheGlzXG5cdCAgICAgKiAgb2YgZWxsaXBzb2lkICg9Y2VudGVyIG9mIG1hc3MpLCBMYXRpdHVkZSBiZWNvbWVzIFBJLzIgKi9cblx0ICAgIGlmIChSUiAvIGEgPCBnZW5hdSkge1xuXHQgICAgICBMYXRpdHVkZSA9IEhBTEZfUEk7XG5cdCAgICAgIEhlaWdodCA9IC1iO1xuXHQgICAgICByZXR1cm4ge1xuXHQgICAgICAgIHg6IHAueCxcblx0ICAgICAgICB5OiBwLnksXG5cdCAgICAgICAgejogcC56XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfSBlbHNlIHtcblx0ICAgIC8qICBlbGxpcHNvaWRhbCAoZ2VvZGV0aWMpIGxvbmdpdHVkZVxuXHQgICAgICogIGludGVydmFsOiAtUEkgPCBMb25naXR1ZGUgPD0gK1BJICovXG5cdCAgICBMb25naXR1ZGUgPSBNYXRoLmF0YW4yKFksIFgpO1xuXHQgIH1cblxuXHQgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgICogRm9sbG93aW5nIGl0ZXJhdGl2ZSBhbGdvcml0aG0gd2FzIGRldmVsb3BwZWQgYnlcblx0ICAgKiBcIkluc3RpdHV0IGZvciBFcmRtZXNzdW5nXCIsIFVuaXZlcnNpdHkgb2YgSGFubm92ZXIsIEp1bHkgMTk4OC5cblx0ICAgKiBJbnRlcm5ldDogd3d3LmlmZS51bmktaGFubm92ZXIuZGVcblx0ICAgKiBJdGVyYXRpdmUgY29tcHV0YXRpb24gb2YgQ1BISSxTUEhJIGFuZCBIZWlnaHQuXG5cdCAgICogSXRlcmF0aW9uIG9mIENQSEkgYW5kIFNQSEkgdG8gMTAqKi0xMiByYWRpYW4gcmVzcC5cblx0ICAgKiAyKjEwKiotNyBhcmNzZWMuXG5cdCAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAgKi9cblx0ICBDVCA9IFogLyBSUjtcblx0ICBTVCA9IFAgLyBSUjtcblx0ICBSWCA9IDEuMCAvIE1hdGguc3FydCgxLjAgLSBlcyAqICgyLjAgLSBlcykgKiBTVCAqIFNUKTtcblx0ICBDUEhJMCA9IFNUICogKDEuMCAtIGVzKSAqIFJYO1xuXHQgIFNQSEkwID0gQ1QgKiBSWDtcblx0ICBpdGVyID0gMDtcblxuXHQgIC8qIGxvb3AgdG8gZmluZCBzaW4oTGF0aXR1ZGUpIHJlc3AuIExhdGl0dWRlXG5cdCAgICogdW50aWwgfHNpbihMYXRpdHVkZShpdGVyKS1MYXRpdHVkZShpdGVyLTEpKXwgPCBnZW5hdSAqL1xuXHQgIGRvIHtcblx0ICAgIGl0ZXIrKztcblx0ICAgIFJOID0gYSAvIE1hdGguc3FydCgxLjAgLSBlcyAqIFNQSEkwICogU1BISTApO1xuXG5cdCAgICAvKiAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBoZWlnaHQgKi9cblx0ICAgIEhlaWdodCA9IFAgKiBDUEhJMCArIFogKiBTUEhJMCAtIFJOICogKDEuMCAtIGVzICogU1BISTAgKiBTUEhJMCk7XG5cblx0ICAgIFJLID0gZXMgKiBSTiAvIChSTiArIEhlaWdodCk7XG5cdCAgICBSWCA9IDEuMCAvIE1hdGguc3FydCgxLjAgLSBSSyAqICgyLjAgLSBSSykgKiBTVCAqIFNUKTtcblx0ICAgIENQSEkgPSBTVCAqICgxLjAgLSBSSykgKiBSWDtcblx0ICAgIFNQSEkgPSBDVCAqIFJYO1xuXHQgICAgU0RQSEkgPSBTUEhJICogQ1BISTAgLSBDUEhJICogU1BISTA7XG5cdCAgICBDUEhJMCA9IENQSEk7XG5cdCAgICBTUEhJMCA9IFNQSEk7XG5cdCAgfVxuXHQgIHdoaWxlIChTRFBISSAqIFNEUEhJID4gZ2VuYXUyICYmIGl0ZXIgPCBtYXhpdGVyKTtcblxuXHQgIC8qICAgICAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBsYXRpdHVkZSAqL1xuXHQgIExhdGl0dWRlID0gTWF0aC5hdGFuKFNQSEkgLyBNYXRoLmFicyhDUEhJKSk7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHg6IExvbmdpdHVkZSxcblx0ICAgIHk6IExhdGl0dWRlLFxuXHQgICAgejogSGVpZ2h0XG5cdCAgfTtcblx0fSAvLyBjc19nZW9jZW50cmljX3RvX2dlb2RldGljKClcblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblx0Ly8gcGpfZ2VvY2VudGljX3RvX3dnczg0KCBwIClcblx0Ly8gIHAgPSBwb2ludCB0byB0cmFuc2Zvcm0gaW4gZ2VvY2VudHJpYyBjb29yZGluYXRlcyAoeCx5LHopXG5cblxuXHQvKiogcG9pbnQgb2JqZWN0LCBub3RoaW5nIGZhbmN5LCBqdXN0IGFsbG93cyB2YWx1ZXMgdG8gYmVcblx0ICAgIHBhc3NlZCBiYWNrIGFuZCBmb3J0aCBieSByZWZlcmVuY2UgcmF0aGVyIHRoYW4gYnkgdmFsdWUuXG5cdCAgICBPdGhlciBwb2ludCBjbGFzc2VzIG1heSBiZSB1c2VkIGFzIGxvbmcgYXMgdGhleSBoYXZlXG5cdCAgICB4IGFuZCB5IHByb3BlcnRpZXMsIHdoaWNoIHdpbGwgZ2V0IG1vZGlmaWVkIGluIHRoZSB0cmFuc2Zvcm0gbWV0aG9kLlxuXHQqL1xuXHRmdW5jdGlvbiBnZW9jZW50cmljVG9XZ3M4NChwLCBkYXR1bV90eXBlLCBkYXR1bV9wYXJhbXMpIHtcblxuXHQgIGlmIChkYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG5cdCAgICAvLyBpZiggeFtpb10gPT09IEhVR0VfVkFMIClcblx0ICAgIC8vICAgIGNvbnRpbnVlO1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgeDogcC54ICsgZGF0dW1fcGFyYW1zWzBdLFxuXHQgICAgICB5OiBwLnkgKyBkYXR1bV9wYXJhbXNbMV0sXG5cdCAgICAgIHo6IHAueiArIGRhdHVtX3BhcmFtc1syXSxcblx0ICAgIH07XG5cdCAgfSBlbHNlIGlmIChkYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG5cdCAgICB2YXIgRHhfQkYgPSBkYXR1bV9wYXJhbXNbMF07XG5cdCAgICB2YXIgRHlfQkYgPSBkYXR1bV9wYXJhbXNbMV07XG5cdCAgICB2YXIgRHpfQkYgPSBkYXR1bV9wYXJhbXNbMl07XG5cdCAgICB2YXIgUnhfQkYgPSBkYXR1bV9wYXJhbXNbM107XG5cdCAgICB2YXIgUnlfQkYgPSBkYXR1bV9wYXJhbXNbNF07XG5cdCAgICB2YXIgUnpfQkYgPSBkYXR1bV9wYXJhbXNbNV07XG5cdCAgICB2YXIgTV9CRiA9IGRhdHVtX3BhcmFtc1s2XTtcblx0ICAgIC8vIGlmKCB4W2lvXSA9PT0gSFVHRV9WQUwgKVxuXHQgICAgLy8gICAgY29udGludWU7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB4OiBNX0JGICogKHAueCAtIFJ6X0JGICogcC55ICsgUnlfQkYgKiBwLnopICsgRHhfQkYsXG5cdCAgICAgIHk6IE1fQkYgKiAoUnpfQkYgKiBwLnggKyBwLnkgLSBSeF9CRiAqIHAueikgKyBEeV9CRixcblx0ICAgICAgejogTV9CRiAqICgtUnlfQkYgKiBwLnggKyBSeF9CRiAqIHAueSArIHAueikgKyBEel9CRlxuXHQgICAgfTtcblx0ICB9XG5cdH0gLy8gY3NfZ2VvY2VudHJpY190b193Z3M4NFxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXHQvLyBwal9nZW9jZW50aWNfZnJvbV93Z3M4NCgpXG5cdC8vICBjb29yZGluYXRlIHN5c3RlbSBkZWZpbml0aW9uLFxuXHQvLyAgcG9pbnQgdG8gdHJhbnNmb3JtIGluIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKHgseSx6KVxuXHRmdW5jdGlvbiBnZW9jZW50cmljRnJvbVdnczg0KHAsIGRhdHVtX3R5cGUsIGRhdHVtX3BhcmFtcykge1xuXG5cdCAgaWYgKGRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0pIHtcblx0ICAgIC8vaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG5cdCAgICAvLyAgICBjb250aW51ZTtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHg6IHAueCAtIGRhdHVtX3BhcmFtc1swXSxcblx0ICAgICAgeTogcC55IC0gZGF0dW1fcGFyYW1zWzFdLFxuXHQgICAgICB6OiBwLnogLSBkYXR1bV9wYXJhbXNbMl0sXG5cdCAgICB9O1xuXG5cdCAgfSBlbHNlIGlmIChkYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG5cdCAgICB2YXIgRHhfQkYgPSBkYXR1bV9wYXJhbXNbMF07XG5cdCAgICB2YXIgRHlfQkYgPSBkYXR1bV9wYXJhbXNbMV07XG5cdCAgICB2YXIgRHpfQkYgPSBkYXR1bV9wYXJhbXNbMl07XG5cdCAgICB2YXIgUnhfQkYgPSBkYXR1bV9wYXJhbXNbM107XG5cdCAgICB2YXIgUnlfQkYgPSBkYXR1bV9wYXJhbXNbNF07XG5cdCAgICB2YXIgUnpfQkYgPSBkYXR1bV9wYXJhbXNbNV07XG5cdCAgICB2YXIgTV9CRiA9IGRhdHVtX3BhcmFtc1s2XTtcblx0ICAgIHZhciB4X3RtcCA9IChwLnggLSBEeF9CRikgLyBNX0JGO1xuXHQgICAgdmFyIHlfdG1wID0gKHAueSAtIER5X0JGKSAvIE1fQkY7XG5cdCAgICB2YXIgel90bXAgPSAocC56IC0gRHpfQkYpIC8gTV9CRjtcblx0ICAgIC8vaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG5cdCAgICAvLyAgICBjb250aW51ZTtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgeDogeF90bXAgKyBSel9CRiAqIHlfdG1wIC0gUnlfQkYgKiB6X3RtcCxcblx0ICAgICAgeTogLVJ6X0JGICogeF90bXAgKyB5X3RtcCArIFJ4X0JGICogel90bXAsXG5cdCAgICAgIHo6IFJ5X0JGICogeF90bXAgLSBSeF9CRiAqIHlfdG1wICsgel90bXBcblx0ICAgIH07XG5cdCAgfSAvL2NzX2dlb2NlbnRyaWNfZnJvbV93Z3M4NCgpXG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja1BhcmFtcyh0eXBlKSB7XG5cdCAgcmV0dXJuICh0eXBlID09PSBQSkRfM1BBUkFNIHx8IHR5cGUgPT09IFBKRF83UEFSQU0pO1xuXHR9XG5cblx0dmFyIGRhdHVtX3RyYW5zZm9ybSA9IGZ1bmN0aW9uKHNvdXJjZSwgZGVzdCwgcG9pbnQpIHtcblx0ICAvLyBTaG9ydCBjdXQgaWYgdGhlIGRhdHVtcyBhcmUgaWRlbnRpY2FsLlxuXHQgIGlmIChjb21wYXJlRGF0dW1zKHNvdXJjZSwgZGVzdCkpIHtcblx0ICAgIHJldHVybiBwb2ludDsgLy8gaW4gdGhpcyBjYXNlLCB6ZXJvIGlzIHN1Y2Vzcyxcblx0ICAgIC8vIHdoZXJlYXMgY3NfY29tcGFyZV9kYXR1bXMgcmV0dXJucyAxIHRvIGluZGljYXRlIFRSVUVcblx0ICAgIC8vIGNvbmZ1c2luZywgc2hvdWxkIGZpeCB0aGlzXG5cdCAgfVxuXG5cdCAgLy8gRXhwbGljaXRseSBza2lwIGRhdHVtIHRyYW5zZm9ybSBieSBzZXR0aW5nICdkYXR1bT1ub25lJyBhcyBwYXJhbWV0ZXIgZm9yIGVpdGhlciBzb3VyY2Ugb3IgZGVzdFxuXHQgIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEX05PREFUVU0gfHwgZGVzdC5kYXR1bV90eXBlID09PSBQSkRfTk9EQVRVTSkge1xuXHQgICAgcmV0dXJuIHBvaW50O1xuXHQgIH1cblxuXHQgIC8vIElmIHRoaXMgZGF0dW0gcmVxdWlyZXMgZ3JpZCBzaGlmdHMsIHRoZW4gYXBwbHkgaXQgdG8gZ2VvZGV0aWMgY29vcmRpbmF0ZXMuXG5cblx0ICAvLyBEbyB3ZSBuZWVkIHRvIGdvIHRocm91Z2ggZ2VvY2VudHJpYyBjb29yZGluYXRlcz9cblx0ICBpZiAoc291cmNlLmVzID09PSBkZXN0LmVzICYmIHNvdXJjZS5hID09PSBkZXN0LmEgJiYgIWNoZWNrUGFyYW1zKHNvdXJjZS5kYXR1bV90eXBlKSAmJiAgIWNoZWNrUGFyYW1zKGRlc3QuZGF0dW1fdHlwZSkpIHtcblx0ICAgIHJldHVybiBwb2ludDtcblx0ICB9XG5cblx0ICAvLyBDb252ZXJ0IHRvIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMuXG5cdCAgcG9pbnQgPSBnZW9kZXRpY1RvR2VvY2VudHJpYyhwb2ludCwgc291cmNlLmVzLCBzb3VyY2UuYSk7XG5cdCAgLy8gQ29udmVydCBiZXR3ZWVuIGRhdHVtc1xuXHQgIGlmIChjaGVja1BhcmFtcyhzb3VyY2UuZGF0dW1fdHlwZSkpIHtcblx0ICAgIHBvaW50ID0gZ2VvY2VudHJpY1RvV2dzODQocG9pbnQsIHNvdXJjZS5kYXR1bV90eXBlLCBzb3VyY2UuZGF0dW1fcGFyYW1zKTtcblx0ICB9XG5cdCAgaWYgKGNoZWNrUGFyYW1zKGRlc3QuZGF0dW1fdHlwZSkpIHtcblx0ICAgIHBvaW50ID0gZ2VvY2VudHJpY0Zyb21XZ3M4NChwb2ludCwgZGVzdC5kYXR1bV90eXBlLCBkZXN0LmRhdHVtX3BhcmFtcyk7XG5cdCAgfVxuXHQgIHJldHVybiBnZW9jZW50cmljVG9HZW9kZXRpYyhwb2ludCwgZGVzdC5lcywgZGVzdC5hLCBkZXN0LmIpO1xuXG5cdH07XG5cblx0dmFyIGFkanVzdF9heGlzID0gZnVuY3Rpb24oY3JzLCBkZW5vcm0sIHBvaW50KSB7XG5cdCAgdmFyIHhpbiA9IHBvaW50LngsXG5cdCAgICB5aW4gPSBwb2ludC55LFxuXHQgICAgemluID0gcG9pbnQueiB8fCAwLjA7XG5cdCAgdmFyIHYsIHQsIGk7XG5cdCAgdmFyIG91dCA9IHt9O1xuXHQgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcblx0ICAgIGlmIChkZW5vcm0gJiYgaSA9PT0gMiAmJiBwb2ludC56ID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgY29udGludWU7XG5cdCAgICB9XG5cdCAgICBpZiAoaSA9PT0gMCkge1xuXHQgICAgICB2ID0geGluO1xuXHQgICAgICB0ID0gJ3gnO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoaSA9PT0gMSkge1xuXHQgICAgICB2ID0geWluO1xuXHQgICAgICB0ID0gJ3knO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHYgPSB6aW47XG5cdCAgICAgIHQgPSAneic7XG5cdCAgICB9XG5cdCAgICBzd2l0Y2ggKGNycy5heGlzW2ldKSB7XG5cdCAgICBjYXNlICdlJzpcblx0ICAgICAgb3V0W3RdID0gdjtcblx0ICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICd3Jzpcblx0ICAgICAgb3V0W3RdID0gLXY7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnbic6XG5cdCAgICAgIG91dFt0XSA9IHY7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAncyc6XG5cdCAgICAgIG91dFt0XSA9IC12O1xuXHQgICAgICBicmVhaztcblx0ICAgIGNhc2UgJ3UnOlxuXHQgICAgICBpZiAocG9pbnRbdF0gIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIG91dC56ID0gdjtcblx0ICAgICAgfVxuXHQgICAgICBicmVhaztcblx0ICAgIGNhc2UgJ2QnOlxuXHQgICAgICBpZiAocG9pbnRbdF0gIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIG91dC56ID0gLXY7XG5cdCAgICAgIH1cblx0ICAgICAgYnJlYWs7XG5cdCAgICBkZWZhdWx0OlxuXHQgICAgICAvL2NvbnNvbGUubG9nKFwiRVJST1I6IHVua25vdyBheGlzIChcIitjcnMuYXhpc1tpXStcIikgLSBjaGVjayBkZWZpbml0aW9uIG9mIFwiK2Nycy5wcm9qTmFtZSk7XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gb3V0O1xuXHR9O1xuXG5cdHZhciB0b1BvaW50ID0gZnVuY3Rpb24gKGFycmF5KXtcblx0ICB2YXIgb3V0ID0ge1xuXHQgICAgeDogYXJyYXlbMF0sXG5cdCAgICB5OiBhcnJheVsxXVxuXHQgIH07XG5cdCAgaWYgKGFycmF5Lmxlbmd0aD4yKSB7XG5cdCAgICBvdXQueiA9IGFycmF5WzJdO1xuXHQgIH1cblx0ICBpZiAoYXJyYXkubGVuZ3RoPjMpIHtcblx0ICAgIG91dC5tID0gYXJyYXlbM107XG5cdCAgfVxuXHQgIHJldHVybiBvdXQ7XG5cdH07XG5cblx0dmFyIGNoZWNrU2FuaXR5ID0gZnVuY3Rpb24gKHBvaW50KSB7XG5cdCAgY2hlY2tDb29yZChwb2ludC54KTtcblx0ICBjaGVja0Nvb3JkKHBvaW50LnkpO1xuXHR9O1xuXHRmdW5jdGlvbiBjaGVja0Nvb3JkKG51bSkge1xuXHQgIGlmICh0eXBlb2YgTnVtYmVyLmlzRmluaXRlID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bSkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29vcmRpbmF0ZXMgbXVzdCBiZSBmaW5pdGUgbnVtYmVycycpO1xuXHQgIH1cblx0ICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgbnVtICE9PSBudW0gfHwgIWlzRmluaXRlKG51bSkpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nvb3JkaW5hdGVzIG11c3QgYmUgZmluaXRlIG51bWJlcnMnKTtcblx0ICB9XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja05vdFdHUyhzb3VyY2UsIGRlc3QpIHtcblx0ICByZXR1cm4gKChzb3VyY2UuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzNQQVJBTSB8fCBzb3VyY2UuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSkgJiYgZGVzdC5kYXR1bUNvZGUgIT09ICdXR1M4NCcpIHx8ICgoZGVzdC5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfM1BBUkFNIHx8IGRlc3QuZGF0dW0uZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSkgJiYgc291cmNlLmRhdHVtQ29kZSAhPT0gJ1dHUzg0Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmFuc2Zvcm0oc291cmNlLCBkZXN0LCBwb2ludCkge1xuXHQgIHZhciB3Z3M4NDtcblx0ICBpZiAoQXJyYXkuaXNBcnJheShwb2ludCkpIHtcblx0ICAgIHBvaW50ID0gdG9Qb2ludChwb2ludCk7XG5cdCAgfVxuXHQgIGNoZWNrU2FuaXR5KHBvaW50KTtcblx0ICAvLyBXb3JrYXJvdW5kIGZvciBkYXR1bSBzaGlmdHMgdG93Z3M4NCwgaWYgZWl0aGVyIHNvdXJjZSBvciBkZXN0aW5hdGlvbiBwcm9qZWN0aW9uIGlzIG5vdCB3Z3M4NFxuXHQgIGlmIChzb3VyY2UuZGF0dW0gJiYgZGVzdC5kYXR1bSAmJiBjaGVja05vdFdHUyhzb3VyY2UsIGRlc3QpKSB7XG5cdCAgICB3Z3M4NCA9IG5ldyBQcm9qZWN0aW9uKCdXR1M4NCcpO1xuXHQgICAgcG9pbnQgPSB0cmFuc2Zvcm0oc291cmNlLCB3Z3M4NCwgcG9pbnQpO1xuXHQgICAgc291cmNlID0gd2dzODQ7XG5cdCAgfVxuXHQgIC8vIERHUiwgMjAxMC8xMS8xMlxuXHQgIGlmIChzb3VyY2UuYXhpcyAhPT0gJ2VudScpIHtcblx0ICAgIHBvaW50ID0gYWRqdXN0X2F4aXMoc291cmNlLCBmYWxzZSwgcG9pbnQpO1xuXHQgIH1cblx0ICAvLyBUcmFuc2Zvcm0gc291cmNlIHBvaW50cyB0byBsb25nL2xhdCwgaWYgdGhleSBhcmVuJ3QgYWxyZWFkeS5cblx0ICBpZiAoc291cmNlLnByb2pOYW1lID09PSAnbG9uZ2xhdCcpIHtcblx0ICAgIHBvaW50ID0ge1xuXHQgICAgICB4OiBwb2ludC54ICogRDJSLFxuXHQgICAgICB5OiBwb2ludC55ICogRDJSXG5cdCAgICB9O1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGlmIChzb3VyY2UudG9fbWV0ZXIpIHtcblx0ICAgICAgcG9pbnQgPSB7XG5cdCAgICAgICAgeDogcG9pbnQueCAqIHNvdXJjZS50b19tZXRlcixcblx0ICAgICAgICB5OiBwb2ludC55ICogc291cmNlLnRvX21ldGVyXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgICBwb2ludCA9IHNvdXJjZS5pbnZlcnNlKHBvaW50KTsgLy8gQ29udmVydCBDYXJ0ZXNpYW4gdG8gbG9uZ2xhdFxuXHQgIH1cblx0ICAvLyBBZGp1c3QgZm9yIHRoZSBwcmltZSBtZXJpZGlhbiBpZiBuZWNlc3Nhcnlcblx0ICBpZiAoc291cmNlLmZyb21fZ3JlZW53aWNoKSB7XG5cdCAgICBwb2ludC54ICs9IHNvdXJjZS5mcm9tX2dyZWVud2ljaDtcblx0ICB9XG5cblx0ICAvLyBDb252ZXJ0IGRhdHVtcyBpZiBuZWVkZWQsIGFuZCBpZiBwb3NzaWJsZS5cblx0ICBwb2ludCA9IGRhdHVtX3RyYW5zZm9ybShzb3VyY2UuZGF0dW0sIGRlc3QuZGF0dW0sIHBvaW50KTtcblxuXHQgIC8vIEFkanVzdCBmb3IgdGhlIHByaW1lIG1lcmlkaWFuIGlmIG5lY2Vzc2FyeVxuXHQgIGlmIChkZXN0LmZyb21fZ3JlZW53aWNoKSB7XG5cdCAgICBwb2ludCA9IHtcblx0ICAgICAgeDogcG9pbnQueCAtIGRlc3QuZnJvbV9ncmVlbndpY2gsXG5cdCAgICAgIHk6IHBvaW50Lnlcblx0ICAgIH07XG5cdCAgfVxuXG5cdCAgaWYgKGRlc3QucHJvak5hbWUgPT09ICdsb25nbGF0Jykge1xuXHQgICAgLy8gY29udmVydCByYWRpYW5zIHRvIGRlY2ltYWwgZGVncmVlc1xuXHQgICAgcG9pbnQgPSB7XG5cdCAgICAgIHg6IHBvaW50LnggKiBSMkQsXG5cdCAgICAgIHk6IHBvaW50LnkgKiBSMkRcblx0ICAgIH07XG5cdCAgfSBlbHNlIHsgLy8gZWxzZSBwcm9qZWN0XG5cdCAgICBwb2ludCA9IGRlc3QuZm9yd2FyZChwb2ludCk7XG5cdCAgICBpZiAoZGVzdC50b19tZXRlcikge1xuXHQgICAgICBwb2ludCA9IHtcblx0ICAgICAgICB4OiBwb2ludC54IC8gZGVzdC50b19tZXRlcixcblx0ICAgICAgICB5OiBwb2ludC55IC8gZGVzdC50b19tZXRlclxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8vIERHUiwgMjAxMC8xMS8xMlxuXHQgIGlmIChkZXN0LmF4aXMgIT09ICdlbnUnKSB7XG5cdCAgICByZXR1cm4gYWRqdXN0X2F4aXMoZGVzdCwgdHJ1ZSwgcG9pbnQpO1xuXHQgIH1cblxuXHQgIHJldHVybiBwb2ludDtcblx0fVxuXG5cdHZhciB3Z3M4NCA9IFByb2plY3Rpb24oJ1dHUzg0Jyk7XG5cblx0ZnVuY3Rpb24gdHJhbnNmb3JtZXIoZnJvbSwgdG8sIGNvb3Jkcykge1xuXHQgIHZhciB0cmFuc2Zvcm1lZEFycmF5LCBvdXQsIGtleXM7XG5cdCAgaWYgKEFycmF5LmlzQXJyYXkoY29vcmRzKSkge1xuXHQgICAgdHJhbnNmb3JtZWRBcnJheSA9IHRyYW5zZm9ybShmcm9tLCB0bywgY29vcmRzKTtcblx0ICAgIGlmIChjb29yZHMubGVuZ3RoID09PSAzKSB7XG5cdCAgICAgIHJldHVybiBbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnksIHRyYW5zZm9ybWVkQXJyYXkuel07XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgcmV0dXJuIFt0cmFuc2Zvcm1lZEFycmF5LngsIHRyYW5zZm9ybWVkQXJyYXkueV07XG5cdCAgICB9XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgb3V0ID0gdHJhbnNmb3JtKGZyb20sIHRvLCBjb29yZHMpO1xuXHQgICAga2V5cyA9IE9iamVjdC5rZXlzKGNvb3Jkcyk7XG5cdCAgICBpZiAoa2V5cy5sZW5ndGggPT09IDIpIHtcblx0ICAgICAgcmV0dXJuIG91dDtcblx0ICAgIH1cblx0ICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdCAgICAgIGlmIChrZXkgPT09ICd4JyB8fCBrZXkgPT09ICd5Jykge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBvdXRba2V5XSA9IGNvb3Jkc1trZXldO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gb3V0O1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNoZWNrUHJvaihpdGVtKSB7XG5cdCAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9qZWN0aW9uKSB7XG5cdCAgICByZXR1cm4gaXRlbTtcblx0ICB9XG5cdCAgaWYgKGl0ZW0ub1Byb2opIHtcblx0ICAgIHJldHVybiBpdGVtLm9Qcm9qO1xuXHQgIH1cblx0ICByZXR1cm4gUHJvamVjdGlvbihpdGVtKTtcblx0fVxuXHRmdW5jdGlvbiBwcm9qNCQxKGZyb21Qcm9qLCB0b1Byb2osIGNvb3JkKSB7XG5cdCAgZnJvbVByb2ogPSBjaGVja1Byb2ooZnJvbVByb2opO1xuXHQgIHZhciBzaW5nbGUgPSBmYWxzZTtcblx0ICB2YXIgb2JqO1xuXHQgIGlmICh0eXBlb2YgdG9Qcm9qID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgdG9Qcm9qID0gZnJvbVByb2o7XG5cdCAgICBmcm9tUHJvaiA9IHdnczg0O1xuXHQgICAgc2luZ2xlID0gdHJ1ZTtcblx0ICB9XG5cdCAgZWxzZSBpZiAodHlwZW9mIHRvUHJvai54ICE9PSAndW5kZWZpbmVkJyB8fCBBcnJheS5pc0FycmF5KHRvUHJvaikpIHtcblx0ICAgIGNvb3JkID0gdG9Qcm9qO1xuXHQgICAgdG9Qcm9qID0gZnJvbVByb2o7XG5cdCAgICBmcm9tUHJvaiA9IHdnczg0O1xuXHQgICAgc2luZ2xlID0gdHJ1ZTtcblx0ICB9XG5cdCAgdG9Qcm9qID0gY2hlY2tQcm9qKHRvUHJvaik7XG5cdCAgaWYgKGNvb3JkKSB7XG5cdCAgICByZXR1cm4gdHJhbnNmb3JtZXIoZnJvbVByb2osIHRvUHJvaiwgY29vcmQpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIG9iaiA9IHtcblx0ICAgICAgZm9yd2FyZDogZnVuY3Rpb24oY29vcmRzKSB7XG5cdCAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKGZyb21Qcm9qLCB0b1Byb2osIGNvb3Jkcyk7XG5cdCAgICAgIH0sXG5cdCAgICAgIGludmVyc2U6IGZ1bmN0aW9uKGNvb3Jkcykge1xuXHQgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcih0b1Byb2osIGZyb21Qcm9qLCBjb29yZHMpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXHQgICAgaWYgKHNpbmdsZSkge1xuXHQgICAgICBvYmoub1Byb2ogPSB0b1Byb2o7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gb2JqO1xuXHQgIH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVVE0gem9uZXMgYXJlIGdyb3VwZWQsIGFuZCBhc3NpZ25lZCB0byBvbmUgb2YgYSBncm91cCBvZiA2XG5cdCAqIHNldHMuXG5cdCAqXG5cdCAqIHtpbnR9IEBwcml2YXRlXG5cdCAqL1xuXHR2YXIgTlVNXzEwMEtfU0VUUyA9IDY7XG5cblx0LyoqXG5cdCAqIFRoZSBjb2x1bW4gbGV0dGVycyAoZm9yIGVhc3RpbmcpIG9mIHRoZSBsb3dlciBsZWZ0IHZhbHVlLCBwZXJcblx0ICogc2V0LlxuXHQgKlxuXHQgKiB7c3RyaW5nfSBAcHJpdmF0ZVxuXHQgKi9cblx0dmFyIFNFVF9PUklHSU5fQ09MVU1OX0xFVFRFUlMgPSAnQUpTQUpTJztcblxuXHQvKipcblx0ICogVGhlIHJvdyBsZXR0ZXJzIChmb3Igbm9ydGhpbmcpIG9mIHRoZSBsb3dlciBsZWZ0IHZhbHVlLCBwZXJcblx0ICogc2V0LlxuXHQgKlxuXHQgKiB7c3RyaW5nfSBAcHJpdmF0ZVxuXHQgKi9cblx0dmFyIFNFVF9PUklHSU5fUk9XX0xFVFRFUlMgPSAnQUZBRkFGJztcblxuXHR2YXIgQSA9IDY1OyAvLyBBXG5cdHZhciBJID0gNzM7IC8vIElcblx0dmFyIE8gPSA3OTsgLy8gT1xuXHR2YXIgViA9IDg2OyAvLyBWXG5cdHZhciBaID0gOTA7IC8vIFpcblx0dmFyIG1ncnMgPSB7XG5cdCAgZm9yd2FyZDogZm9yd2FyZCQxLFxuXHQgIGludmVyc2U6IGludmVyc2UkMSxcblx0ICB0b1BvaW50OiB0b1BvaW50JDFcblx0fTtcblx0LyoqXG5cdCAqIENvbnZlcnNpb24gb2YgbGF0L2xvbiB0byBNR1JTLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gbGwgT2JqZWN0IGxpdGVyYWwgd2l0aCBsYXQgYW5kIGxvbiBwcm9wZXJ0aWVzIG9uIGFcblx0ICogICAgIFdHUzg0IGVsbGlwc29pZC5cblx0ICogQHBhcmFtIHtpbnR9IGFjY3VyYWN5IEFjY3VyYWN5IGluIGRpZ2l0cyAoNSBmb3IgMSBtLCA0IGZvciAxMCBtLCAzIGZvclxuXHQgKiAgICAgIDEwMCBtLCAyIGZvciAxMDAwIG0gb3IgMSBmb3IgMTAwMDAgbSkuIE9wdGlvbmFsLCBkZWZhdWx0IGlzIDUuXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gdGhlIE1HUlMgc3RyaW5nIGZvciB0aGUgZ2l2ZW4gbG9jYXRpb24gYW5kIGFjY3VyYWN5LlxuXHQgKi9cblx0ZnVuY3Rpb24gZm9yd2FyZCQxKGxsLCBhY2N1cmFjeSkge1xuXHQgIGFjY3VyYWN5ID0gYWNjdXJhY3kgfHwgNTsgLy8gZGVmYXVsdCBhY2N1cmFjeSAxbVxuXHQgIHJldHVybiBlbmNvZGUoTEx0b1VUTSh7XG5cdCAgICBsYXQ6IGxsWzFdLFxuXHQgICAgbG9uOiBsbFswXVxuXHQgIH0pLCBhY2N1cmFjeSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVyc2lvbiBvZiBNR1JTIHRvIGxhdC9sb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZ3JzIE1HUlMgc3RyaW5nLlxuXHQgKiBAcmV0dXJuIHthcnJheX0gQW4gYXJyYXkgd2l0aCBsZWZ0IChsb25naXR1ZGUpLCBib3R0b20gKGxhdGl0dWRlKSwgcmlnaHRcblx0ICogICAgIChsb25naXR1ZGUpIGFuZCB0b3AgKGxhdGl0dWRlKSB2YWx1ZXMgaW4gV0dTODQsIHJlcHJlc2VudGluZyB0aGVcblx0ICogICAgIGJvdW5kaW5nIGJveCBmb3IgdGhlIHByb3ZpZGVkIE1HUlMgcmVmZXJlbmNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQxKG1ncnMpIHtcblx0ICB2YXIgYmJveCA9IFVUTXRvTEwoZGVjb2RlKG1ncnMudG9VcHBlckNhc2UoKSkpO1xuXHQgIGlmIChiYm94LmxhdCAmJiBiYm94Lmxvbikge1xuXHQgICAgcmV0dXJuIFtiYm94LmxvbiwgYmJveC5sYXQsIGJib3gubG9uLCBiYm94LmxhdF07XG5cdCAgfVxuXHQgIHJldHVybiBbYmJveC5sZWZ0LCBiYm94LmJvdHRvbSwgYmJveC5yaWdodCwgYmJveC50b3BdO1xuXHR9XG5cblx0ZnVuY3Rpb24gdG9Qb2ludCQxKG1ncnMpIHtcblx0ICB2YXIgYmJveCA9IFVUTXRvTEwoZGVjb2RlKG1ncnMudG9VcHBlckNhc2UoKSkpO1xuXHQgIGlmIChiYm94LmxhdCAmJiBiYm94Lmxvbikge1xuXHQgICAgcmV0dXJuIFtiYm94LmxvbiwgYmJveC5sYXRdO1xuXHQgIH1cblx0ICByZXR1cm4gWyhiYm94LmxlZnQgKyBiYm94LnJpZ2h0KSAvIDIsIChiYm94LnRvcCArIGJib3guYm90dG9tKSAvIDJdO1xuXHR9XG5cdC8qKlxuXHQgKiBDb252ZXJzaW9uIGZyb20gZGVncmVlcyB0byByYWRpYW5zLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gZGVnIHRoZSBhbmdsZSBpbiBkZWdyZWVzLlxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBhbmdsZSBpbiByYWRpYW5zLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVnVG9SYWQoZGVnKSB7XG5cdCAgcmV0dXJuIChkZWcgKiAoTWF0aC5QSSAvIDE4MC4wKSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVyc2lvbiBmcm9tIHJhZGlhbnMgdG8gZGVncmVlcy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHJhZCB0aGUgYW5nbGUgaW4gcmFkaWFucy5cblx0ICogQHJldHVybiB7bnVtYmVyfSB0aGUgYW5nbGUgaW4gZGVncmVlcy5cblx0ICovXG5cdGZ1bmN0aW9uIHJhZFRvRGVnKHJhZCkge1xuXHQgIHJldHVybiAoMTgwLjAgKiAocmFkIC8gTWF0aC5QSSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc2V0IG9mIExvbmdpdHVkZSBhbmQgTGF0aXR1ZGUgY28tb3JkaW5hdGVzIHRvIFVUTVxuXHQgKiB1c2luZyB0aGUgV0dTODQgZWxsaXBzb2lkLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gbGwgT2JqZWN0IGxpdGVyYWwgd2l0aCBsYXQgYW5kIGxvbiBwcm9wZXJ0aWVzXG5cdCAqICAgICByZXByZXNlbnRpbmcgdGhlIFdHUzg0IGNvb3JkaW5hdGUgdG8gYmUgY29udmVydGVkLlxuXHQgKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBsaXRlcmFsIGNvbnRhaW5pbmcgdGhlIFVUTSB2YWx1ZSB3aXRoIGVhc3RpbmcsXG5cdCAqICAgICBub3J0aGluZywgem9uZU51bWJlciBhbmQgem9uZUxldHRlciBwcm9wZXJ0aWVzLCBhbmQgYW4gb3B0aW9uYWxcblx0ICogICAgIGFjY3VyYWN5IHByb3BlcnR5IGluIGRpZ2l0cy4gUmV0dXJucyBudWxsIGlmIHRoZSBjb252ZXJzaW9uIGZhaWxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIExMdG9VVE0obGwpIHtcblx0ICB2YXIgTGF0ID0gbGwubGF0O1xuXHQgIHZhciBMb25nID0gbGwubG9uO1xuXHQgIHZhciBhID0gNjM3ODEzNy4wOyAvL2VsbGlwLnJhZGl1cztcblx0ICB2YXIgZWNjU3F1YXJlZCA9IDAuMDA2Njk0Mzg7IC8vZWxsaXAuZWNjc3E7XG5cdCAgdmFyIGswID0gMC45OTk2O1xuXHQgIHZhciBMb25nT3JpZ2luO1xuXHQgIHZhciBlY2NQcmltZVNxdWFyZWQ7XG5cdCAgdmFyIE4sIFQsIEMsIEEsIE07XG5cdCAgdmFyIExhdFJhZCA9IGRlZ1RvUmFkKExhdCk7XG5cdCAgdmFyIExvbmdSYWQgPSBkZWdUb1JhZChMb25nKTtcblx0ICB2YXIgTG9uZ09yaWdpblJhZDtcblx0ICB2YXIgWm9uZU51bWJlcjtcblx0ICAvLyAoaW50KVxuXHQgIFpvbmVOdW1iZXIgPSBNYXRoLmZsb29yKChMb25nICsgMTgwKSAvIDYpICsgMTtcblxuXHQgIC8vTWFrZSBzdXJlIHRoZSBsb25naXR1ZGUgMTgwLjAwIGlzIGluIFpvbmUgNjBcblx0ICBpZiAoTG9uZyA9PT0gMTgwKSB7XG5cdCAgICBab25lTnVtYmVyID0gNjA7XG5cdCAgfVxuXG5cdCAgLy8gU3BlY2lhbCB6b25lIGZvciBOb3J3YXlcblx0ICBpZiAoTGF0ID49IDU2LjAgJiYgTGF0IDwgNjQuMCAmJiBMb25nID49IDMuMCAmJiBMb25nIDwgMTIuMCkge1xuXHQgICAgWm9uZU51bWJlciA9IDMyO1xuXHQgIH1cblxuXHQgIC8vIFNwZWNpYWwgem9uZXMgZm9yIFN2YWxiYXJkXG5cdCAgaWYgKExhdCA+PSA3Mi4wICYmIExhdCA8IDg0LjApIHtcblx0ICAgIGlmIChMb25nID49IDAuMCAmJiBMb25nIDwgOS4wKSB7XG5cdCAgICAgIFpvbmVOdW1iZXIgPSAzMTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKExvbmcgPj0gOS4wICYmIExvbmcgPCAyMS4wKSB7XG5cdCAgICAgIFpvbmVOdW1iZXIgPSAzMztcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKExvbmcgPj0gMjEuMCAmJiBMb25nIDwgMzMuMCkge1xuXHQgICAgICBab25lTnVtYmVyID0gMzU7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmIChMb25nID49IDMzLjAgJiYgTG9uZyA8IDQyLjApIHtcblx0ICAgICAgWm9uZU51bWJlciA9IDM3O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIExvbmdPcmlnaW4gPSAoWm9uZU51bWJlciAtIDEpICogNiAtIDE4MCArIDM7IC8vKzMgcHV0cyBvcmlnaW5cblx0ICAvLyBpbiBtaWRkbGUgb2Zcblx0ICAvLyB6b25lXG5cdCAgTG9uZ09yaWdpblJhZCA9IGRlZ1RvUmFkKExvbmdPcmlnaW4pO1xuXG5cdCAgZWNjUHJpbWVTcXVhcmVkID0gKGVjY1NxdWFyZWQpIC8gKDEgLSBlY2NTcXVhcmVkKTtcblxuXHQgIE4gPSBhIC8gTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkICogTWF0aC5zaW4oTGF0UmFkKSAqIE1hdGguc2luKExhdFJhZCkpO1xuXHQgIFQgPSBNYXRoLnRhbihMYXRSYWQpICogTWF0aC50YW4oTGF0UmFkKTtcblx0ICBDID0gZWNjUHJpbWVTcXVhcmVkICogTWF0aC5jb3MoTGF0UmFkKSAqIE1hdGguY29zKExhdFJhZCk7XG5cdCAgQSA9IE1hdGguY29zKExhdFJhZCkgKiAoTG9uZ1JhZCAtIExvbmdPcmlnaW5SYWQpO1xuXG5cdCAgTSA9IGEgKiAoKDEgLSBlY2NTcXVhcmVkIC8gNCAtIDMgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDY0IC0gNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDI1NikgKiBMYXRSYWQgLSAoMyAqIGVjY1NxdWFyZWQgLyA4ICsgMyAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMzIgKyA0NSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDEwMjQpICogTWF0aC5zaW4oMiAqIExhdFJhZCkgKyAoMTUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDI1NiArIDQ1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkIC8gMTAyNCkgKiBNYXRoLnNpbig0ICogTGF0UmFkKSAtICgzNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDMwNzIpICogTWF0aC5zaW4oNiAqIExhdFJhZCkpO1xuXG5cdCAgdmFyIFVUTUVhc3RpbmcgPSAoazAgKiBOICogKEEgKyAoMSAtIFQgKyBDKSAqIEEgKiBBICogQSAvIDYuMCArICg1IC0gMTggKiBUICsgVCAqIFQgKyA3MiAqIEMgLSA1OCAqIGVjY1ByaW1lU3F1YXJlZCkgKiBBICogQSAqIEEgKiBBICogQSAvIDEyMC4wKSArIDUwMDAwMC4wKTtcblxuXHQgIHZhciBVVE1Ob3J0aGluZyA9IChrMCAqIChNICsgTiAqIE1hdGgudGFuKExhdFJhZCkgKiAoQSAqIEEgLyAyICsgKDUgLSBUICsgOSAqIEMgKyA0ICogQyAqIEMpICogQSAqIEEgKiBBICogQSAvIDI0LjAgKyAoNjEgLSA1OCAqIFQgKyBUICogVCArIDYwMCAqIEMgLSAzMzAgKiBlY2NQcmltZVNxdWFyZWQpICogQSAqIEEgKiBBICogQSAqIEEgKiBBIC8gNzIwLjApKSk7XG5cdCAgaWYgKExhdCA8IDAuMCkge1xuXHQgICAgVVRNTm9ydGhpbmcgKz0gMTAwMDAwMDAuMDsgLy8xMDAwMDAwMCBtZXRlciBvZmZzZXQgZm9yXG5cdCAgICAvLyBzb3V0aGVybiBoZW1pc3BoZXJlXG5cdCAgfVxuXG5cdCAgcmV0dXJuIHtcblx0ICAgIG5vcnRoaW5nOiBNYXRoLnJvdW5kKFVUTU5vcnRoaW5nKSxcblx0ICAgIGVhc3Rpbmc6IE1hdGgucm91bmQoVVRNRWFzdGluZyksXG5cdCAgICB6b25lTnVtYmVyOiBab25lTnVtYmVyLFxuXHQgICAgem9uZUxldHRlcjogZ2V0TGV0dGVyRGVzaWduYXRvcihMYXQpXG5cdCAgfTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBVVE0gY29vcmRzIHRvIGxhdC9sb25nLCB1c2luZyB0aGUgV0dTODQgZWxsaXBzb2lkLiBUaGlzIGlzIGEgY29udmVuaWVuY2Vcblx0ICogY2xhc3Mgd2hlcmUgdGhlIFpvbmUgY2FuIGJlIHNwZWNpZmllZCBhcyBhIHNpbmdsZSBzdHJpbmcgZWcuXCI2ME5cIiB3aGljaFxuXHQgKiBpcyB0aGVuIGJyb2tlbiBkb3duIGludG8gdGhlIFpvbmVOdW1iZXIgYW5kIFpvbmVMZXR0ZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB1dG0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBub3J0aGluZywgZWFzdGluZywgem9uZU51bWJlclxuXHQgKiAgICAgYW5kIHpvbmVMZXR0ZXIgcHJvcGVydGllcy4gSWYgYW4gb3B0aW9uYWwgYWNjdXJhY3kgcHJvcGVydHkgaXNcblx0ICogICAgIHByb3ZpZGVkIChpbiBtZXRlcnMpLCBhIGJvdW5kaW5nIGJveCB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2Zcblx0ICogICAgIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUuXG5cdCAqIEByZXR1cm4ge29iamVjdH0gQW4gb2JqZWN0IGxpdGVyYWwgY29udGFpbmluZyBlaXRoZXIgbGF0IGFuZCBsb24gdmFsdWVzXG5cdCAqICAgICAoaWYgbm8gYWNjdXJhY3kgd2FzIHByb3ZpZGVkKSwgb3IgdG9wLCByaWdodCwgYm90dG9tIGFuZCBsZWZ0IHZhbHVlc1xuXHQgKiAgICAgZm9yIHRoZSBib3VuZGluZyBib3ggY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFjY3VyYWN5LlxuXHQgKiAgICAgUmV0dXJucyBudWxsIGlmIHRoZSBjb252ZXJzaW9uIGZhaWxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIFVUTXRvTEwodXRtKSB7XG5cblx0ICB2YXIgVVRNTm9ydGhpbmcgPSB1dG0ubm9ydGhpbmc7XG5cdCAgdmFyIFVUTUVhc3RpbmcgPSB1dG0uZWFzdGluZztcblx0ICB2YXIgem9uZUxldHRlciA9IHV0bS56b25lTGV0dGVyO1xuXHQgIHZhciB6b25lTnVtYmVyID0gdXRtLnpvbmVOdW1iZXI7XG5cdCAgLy8gY2hlY2sgdGhlIFpvbmVOdW1tYmVyIGlzIHZhbGlkXG5cdCAgaWYgKHpvbmVOdW1iZXIgPCAwIHx8IHpvbmVOdW1iZXIgPiA2MCkge1xuXHQgICAgcmV0dXJuIG51bGw7XG5cdCAgfVxuXG5cdCAgdmFyIGswID0gMC45OTk2O1xuXHQgIHZhciBhID0gNjM3ODEzNy4wOyAvL2VsbGlwLnJhZGl1cztcblx0ICB2YXIgZWNjU3F1YXJlZCA9IDAuMDA2Njk0Mzg7IC8vZWxsaXAuZWNjc3E7XG5cdCAgdmFyIGVjY1ByaW1lU3F1YXJlZDtcblx0ICB2YXIgZTEgPSAoMSAtIE1hdGguc3FydCgxIC0gZWNjU3F1YXJlZCkpIC8gKDEgKyBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQpKTtcblx0ICB2YXIgTjEsIFQxLCBDMSwgUjEsIEQsIE07XG5cdCAgdmFyIExvbmdPcmlnaW47XG5cdCAgdmFyIG11LCBwaGkxUmFkO1xuXG5cdCAgLy8gcmVtb3ZlIDUwMCwwMDAgbWV0ZXIgb2Zmc2V0IGZvciBsb25naXR1ZGVcblx0ICB2YXIgeCA9IFVUTUVhc3RpbmcgLSA1MDAwMDAuMDtcblx0ICB2YXIgeSA9IFVUTU5vcnRoaW5nO1xuXG5cdCAgLy8gV2UgbXVzdCBrbm93IHNvbWVob3cgaWYgd2UgYXJlIGluIHRoZSBOb3J0aGVybiBvciBTb3V0aGVyblxuXHQgIC8vIGhlbWlzcGhlcmUsIHRoaXMgaXMgdGhlIG9ubHkgdGltZSB3ZSB1c2UgdGhlIGxldHRlciBTbyBldmVuXG5cdCAgLy8gaWYgdGhlIFpvbmUgbGV0dGVyIGlzbid0IGV4YWN0bHkgY29ycmVjdCBpdCBzaG91bGQgaW5kaWNhdGVcblx0ICAvLyB0aGUgaGVtaXNwaGVyZSBjb3JyZWN0bHlcblx0ICBpZiAoem9uZUxldHRlciA8ICdOJykge1xuXHQgICAgeSAtPSAxMDAwMDAwMC4wOyAvLyByZW1vdmUgMTAsMDAwLDAwMCBtZXRlciBvZmZzZXQgdXNlZFxuXHQgICAgLy8gZm9yIHNvdXRoZXJuIGhlbWlzcGhlcmVcblx0ICB9XG5cblx0ICAvLyBUaGVyZSBhcmUgNjAgem9uZXMgd2l0aCB6b25lIDEgYmVpbmcgYXQgV2VzdCAtMTgwIHRvIC0xNzRcblx0ICBMb25nT3JpZ2luID0gKHpvbmVOdW1iZXIgLSAxKSAqIDYgLSAxODAgKyAzOyAvLyArMyBwdXRzIG9yaWdpblxuXHQgIC8vIGluIG1pZGRsZSBvZlxuXHQgIC8vIHpvbmVcblxuXHQgIGVjY1ByaW1lU3F1YXJlZCA9IChlY2NTcXVhcmVkKSAvICgxIC0gZWNjU3F1YXJlZCk7XG5cblx0ICBNID0geSAvIGswO1xuXHQgIG11ID0gTSAvIChhICogKDEgLSBlY2NTcXVhcmVkIC8gNCAtIDMgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDY0IC0gNSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDI1NikpO1xuXG5cdCAgcGhpMVJhZCA9IG11ICsgKDMgKiBlMSAvIDIgLSAyNyAqIGUxICogZTEgKiBlMSAvIDMyKSAqIE1hdGguc2luKDIgKiBtdSkgKyAoMjEgKiBlMSAqIGUxIC8gMTYgLSA1NSAqIGUxICogZTEgKiBlMSAqIGUxIC8gMzIpICogTWF0aC5zaW4oNCAqIG11KSArICgxNTEgKiBlMSAqIGUxICogZTEgLyA5NikgKiBNYXRoLnNpbig2ICogbXUpO1xuXHQgIC8vIGRvdWJsZSBwaGkxID0gUHJvak1hdGgucmFkVG9EZWcocGhpMVJhZCk7XG5cblx0ICBOMSA9IGEgLyBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQgKiBNYXRoLnNpbihwaGkxUmFkKSAqIE1hdGguc2luKHBoaTFSYWQpKTtcblx0ICBUMSA9IE1hdGgudGFuKHBoaTFSYWQpICogTWF0aC50YW4ocGhpMVJhZCk7XG5cdCAgQzEgPSBlY2NQcmltZVNxdWFyZWQgKiBNYXRoLmNvcyhwaGkxUmFkKSAqIE1hdGguY29zKHBoaTFSYWQpO1xuXHQgIFIxID0gYSAqICgxIC0gZWNjU3F1YXJlZCkgLyBNYXRoLnBvdygxIC0gZWNjU3F1YXJlZCAqIE1hdGguc2luKHBoaTFSYWQpICogTWF0aC5zaW4ocGhpMVJhZCksIDEuNSk7XG5cdCAgRCA9IHggLyAoTjEgKiBrMCk7XG5cblx0ICB2YXIgbGF0ID0gcGhpMVJhZCAtIChOMSAqIE1hdGgudGFuKHBoaTFSYWQpIC8gUjEpICogKEQgKiBEIC8gMiAtICg1ICsgMyAqIFQxICsgMTAgKiBDMSAtIDQgKiBDMSAqIEMxIC0gOSAqIGVjY1ByaW1lU3F1YXJlZCkgKiBEICogRCAqIEQgKiBEIC8gMjQgKyAoNjEgKyA5MCAqIFQxICsgMjk4ICogQzEgKyA0NSAqIFQxICogVDEgLSAyNTIgKiBlY2NQcmltZVNxdWFyZWQgLSAzICogQzEgKiBDMSkgKiBEICogRCAqIEQgKiBEICogRCAqIEQgLyA3MjApO1xuXHQgIGxhdCA9IHJhZFRvRGVnKGxhdCk7XG5cblx0ICB2YXIgbG9uID0gKEQgLSAoMSArIDIgKiBUMSArIEMxKSAqIEQgKiBEICogRCAvIDYgKyAoNSAtIDIgKiBDMSArIDI4ICogVDEgLSAzICogQzEgKiBDMSArIDggKiBlY2NQcmltZVNxdWFyZWQgKyAyNCAqIFQxICogVDEpICogRCAqIEQgKiBEICogRCAqIEQgLyAxMjApIC8gTWF0aC5jb3MocGhpMVJhZCk7XG5cdCAgbG9uID0gTG9uZ09yaWdpbiArIHJhZFRvRGVnKGxvbik7XG5cblx0ICB2YXIgcmVzdWx0O1xuXHQgIGlmICh1dG0uYWNjdXJhY3kpIHtcblx0ICAgIHZhciB0b3BSaWdodCA9IFVUTXRvTEwoe1xuXHQgICAgICBub3J0aGluZzogdXRtLm5vcnRoaW5nICsgdXRtLmFjY3VyYWN5LFxuXHQgICAgICBlYXN0aW5nOiB1dG0uZWFzdGluZyArIHV0bS5hY2N1cmFjeSxcblx0ICAgICAgem9uZUxldHRlcjogdXRtLnpvbmVMZXR0ZXIsXG5cdCAgICAgIHpvbmVOdW1iZXI6IHV0bS56b25lTnVtYmVyXG5cdCAgICB9KTtcblx0ICAgIHJlc3VsdCA9IHtcblx0ICAgICAgdG9wOiB0b3BSaWdodC5sYXQsXG5cdCAgICAgIHJpZ2h0OiB0b3BSaWdodC5sb24sXG5cdCAgICAgIGJvdHRvbTogbGF0LFxuXHQgICAgICBsZWZ0OiBsb25cblx0ICAgIH07XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgcmVzdWx0ID0ge1xuXHQgICAgICBsYXQ6IGxhdCxcblx0ICAgICAgbG9uOiBsb25cblx0ICAgIH07XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgTUdSUyBsZXR0ZXIgZGVzaWduYXRvciBmb3IgdGhlIGdpdmVuIGxhdGl0dWRlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gbGF0IFRoZSBsYXRpdHVkZSBpbiBXR1M4NCB0byBnZXQgdGhlIGxldHRlciBkZXNpZ25hdG9yXG5cdCAqICAgICBmb3IuXG5cdCAqIEByZXR1cm4ge2NoYXJ9IFRoZSBsZXR0ZXIgZGVzaWduYXRvci5cblx0ICovXG5cdGZ1bmN0aW9uIGdldExldHRlckRlc2lnbmF0b3IobGF0KSB7XG5cdCAgLy9UaGlzIGlzIGhlcmUgYXMgYW4gZXJyb3IgZmxhZyB0byBzaG93IHRoYXQgdGhlIExhdGl0dWRlIGlzXG5cdCAgLy9vdXRzaWRlIE1HUlMgbGltaXRzXG5cdCAgdmFyIExldHRlckRlc2lnbmF0b3IgPSAnWic7XG5cblx0ICBpZiAoKDg0ID49IGxhdCkgJiYgKGxhdCA+PSA3MikpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnWCc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCg3MiA+IGxhdCkgJiYgKGxhdCA+PSA2NCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnVyc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCg2NCA+IGxhdCkgJiYgKGxhdCA+PSA1NikpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnVic7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCg1NiA+IGxhdCkgJiYgKGxhdCA+PSA0OCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnVSc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCg0OCA+IGxhdCkgJiYgKGxhdCA+PSA0MCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnVCc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCg0MCA+IGxhdCkgJiYgKGxhdCA+PSAzMikpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnUyc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgzMiA+IGxhdCkgJiYgKGxhdCA+PSAyNCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnUic7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgyNCA+IGxhdCkgJiYgKGxhdCA+PSAxNikpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnUSc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgxNiA+IGxhdCkgJiYgKGxhdCA+PSA4KSkge1xuXHQgICAgTGV0dGVyRGVzaWduYXRvciA9ICdQJztcblx0ICB9XG5cdCAgZWxzZSBpZiAoKDggPiBsYXQpICYmIChsYXQgPj0gMCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnTic7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgwID4gbGF0KSAmJiAobGF0ID49IC04KSkge1xuXHQgICAgTGV0dGVyRGVzaWduYXRvciA9ICdNJztcblx0ICB9XG5cdCAgZWxzZSBpZiAoKC04ID4gbGF0KSAmJiAobGF0ID49IC0xNikpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnTCc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgtMTYgPiBsYXQpICYmIChsYXQgPj0gLTI0KSkge1xuXHQgICAgTGV0dGVyRGVzaWduYXRvciA9ICdLJztcblx0ICB9XG5cdCAgZWxzZSBpZiAoKC0yNCA+IGxhdCkgJiYgKGxhdCA+PSAtMzIpKSB7XG5cdCAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0onO1xuXHQgIH1cblx0ICBlbHNlIGlmICgoLTMyID4gbGF0KSAmJiAobGF0ID49IC00MCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnSCc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgtNDAgPiBsYXQpICYmIChsYXQgPj0gLTQ4KSkge1xuXHQgICAgTGV0dGVyRGVzaWduYXRvciA9ICdHJztcblx0ICB9XG5cdCAgZWxzZSBpZiAoKC00OCA+IGxhdCkgJiYgKGxhdCA+PSAtNTYpKSB7XG5cdCAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0YnO1xuXHQgIH1cblx0ICBlbHNlIGlmICgoLTU2ID4gbGF0KSAmJiAobGF0ID49IC02NCkpIHtcblx0ICAgIExldHRlckRlc2lnbmF0b3IgPSAnRSc7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKCgtNjQgPiBsYXQpICYmIChsYXQgPj0gLTcyKSkge1xuXHQgICAgTGV0dGVyRGVzaWduYXRvciA9ICdEJztcblx0ICB9XG5cdCAgZWxzZSBpZiAoKC03MiA+IGxhdCkgJiYgKGxhdCA+PSAtODApKSB7XG5cdCAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0MnO1xuXHQgIH1cblx0ICByZXR1cm4gTGV0dGVyRGVzaWduYXRvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBFbmNvZGVzIGEgVVRNIGxvY2F0aW9uIGFzIE1HUlMgc3RyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge29iamVjdH0gdXRtIEFuIG9iamVjdCBsaXRlcmFsIHdpdGggZWFzdGluZywgbm9ydGhpbmcsXG5cdCAqICAgICB6b25lTGV0dGVyLCB6b25lTnVtYmVyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBhY2N1cmFjeSBBY2N1cmFjeSBpbiBkaWdpdHMgKDEtNSkuXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gTUdSUyBzdHJpbmcgZm9yIHRoZSBnaXZlbiBVVE0gbG9jYXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUodXRtLCBhY2N1cmFjeSkge1xuXHQgIC8vIHByZXBlbmQgd2l0aCBsZWFkaW5nIHplcm9lc1xuXHQgIHZhciBzZWFzdGluZyA9IFwiMDAwMDBcIiArIHV0bS5lYXN0aW5nLFxuXHQgICAgc25vcnRoaW5nID0gXCIwMDAwMFwiICsgdXRtLm5vcnRoaW5nO1xuXG5cdCAgcmV0dXJuIHV0bS56b25lTnVtYmVyICsgdXRtLnpvbmVMZXR0ZXIgKyBnZXQxMDBrSUQodXRtLmVhc3RpbmcsIHV0bS5ub3J0aGluZywgdXRtLnpvbmVOdW1iZXIpICsgc2Vhc3Rpbmcuc3Vic3RyKHNlYXN0aW5nLmxlbmd0aCAtIDUsIGFjY3VyYWN5KSArIHNub3J0aGluZy5zdWJzdHIoc25vcnRoaW5nLmxlbmd0aCAtIDUsIGFjY3VyYWN5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHR3byBsZXR0ZXIgMTAwayBkZXNpZ25hdG9yIGZvciBhIGdpdmVuIFVUTSBlYXN0aW5nLFxuXHQgKiBub3J0aGluZyBhbmQgem9uZSBudW1iZXIgdmFsdWUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBlYXN0aW5nXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBub3J0aGluZ1xuXHQgKiBAcGFyYW0ge251bWJlcn0gem9uZU51bWJlclxuXHQgKiBAcmV0dXJuIHRoZSB0d28gbGV0dGVyIDEwMGsgZGVzaWduYXRvciBmb3IgdGhlIGdpdmVuIFVUTSBsb2NhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGdldDEwMGtJRChlYXN0aW5nLCBub3J0aGluZywgem9uZU51bWJlcikge1xuXHQgIHZhciBzZXRQYXJtID0gZ2V0MTAwa1NldEZvclpvbmUoem9uZU51bWJlcik7XG5cdCAgdmFyIHNldENvbHVtbiA9IE1hdGguZmxvb3IoZWFzdGluZyAvIDEwMDAwMCk7XG5cdCAgdmFyIHNldFJvdyA9IE1hdGguZmxvb3Iobm9ydGhpbmcgLyAxMDAwMDApICUgMjA7XG5cdCAgcmV0dXJuIGdldExldHRlcjEwMGtJRChzZXRDb2x1bW4sIHNldFJvdywgc2V0UGFybSk7XG5cdH1cblxuXHQvKipcblx0ICogR2l2ZW4gYSBVVE0gem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIE1HUlMgMTAwSyBzZXQgaXQgaXMgaW4uXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpIEFuIFVUTSB6b25lIG51bWJlci5cblx0ICogQHJldHVybiB7bnVtYmVyfSB0aGUgMTAwayBzZXQgdGhlIFVUTSB6b25lIGlzIGluLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0MTAwa1NldEZvclpvbmUoaSkge1xuXHQgIHZhciBzZXRQYXJtID0gaSAlIE5VTV8xMDBLX1NFVFM7XG5cdCAgaWYgKHNldFBhcm0gPT09IDApIHtcblx0ICAgIHNldFBhcm0gPSBOVU1fMTAwS19TRVRTO1xuXHQgIH1cblxuXHQgIHJldHVybiBzZXRQYXJtO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgdHdvLWxldHRlciBNR1JTIDEwMGsgZGVzaWduYXRvciBnaXZlbiBpbmZvcm1hdGlvblxuXHQgKiB0cmFuc2xhdGVkIGZyb20gdGhlIFVUTSBub3J0aGluZywgZWFzdGluZyBhbmQgem9uZSBudW1iZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW4gdGhlIGNvbHVtbiBpbmRleCBhcyBpdCByZWxhdGVzIHRvIHRoZSBNR1JTXG5cdCAqICAgICAgICAxMDBrIHNldCBzcHJlYWRzaGVldCwgY3JlYXRlZCBmcm9tIHRoZSBVVE0gZWFzdGluZy5cblx0ICogICAgICAgIFZhbHVlcyBhcmUgMS04LlxuXHQgKiBAcGFyYW0ge251bWJlcn0gcm93IHRoZSByb3cgaW5kZXggYXMgaXQgcmVsYXRlcyB0byB0aGUgTUdSUyAxMDBrIHNldFxuXHQgKiAgICAgICAgc3ByZWFkc2hlZXQsIGNyZWF0ZWQgZnJvbSB0aGUgVVRNIG5vcnRoaW5nIHZhbHVlLiBWYWx1ZXNcblx0ICogICAgICAgIGFyZSBmcm9tIDAtMTkuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBwYXJtIHRoZSBzZXQgYmxvY2ssIGFzIGl0IHJlbGF0ZXMgdG8gdGhlIE1HUlMgMTAwayBzZXRcblx0ICogICAgICAgIHNwcmVhZHNoZWV0LCBjcmVhdGVkIGZyb20gdGhlIFVUTSB6b25lLiBWYWx1ZXMgYXJlIGZyb21cblx0ICogICAgICAgIDEtNjAuXG5cdCAqIEByZXR1cm4gdHdvIGxldHRlciBNR1JTIDEwMGsgY29kZS5cblx0ICovXG5cdGZ1bmN0aW9uIGdldExldHRlcjEwMGtJRChjb2x1bW4sIHJvdywgcGFybSkge1xuXHQgIC8vIGNvbE9yaWdpbiBhbmQgcm93T3JpZ2luIGFyZSB0aGUgbGV0dGVycyBhdCB0aGUgb3JpZ2luIG9mIHRoZSBzZXRcblx0ICB2YXIgaW5kZXggPSBwYXJtIC0gMTtcblx0ICB2YXIgY29sT3JpZ2luID0gU0VUX09SSUdJTl9DT0xVTU5fTEVUVEVSUy5jaGFyQ29kZUF0KGluZGV4KTtcblx0ICB2YXIgcm93T3JpZ2luID0gU0VUX09SSUdJTl9ST1dfTEVUVEVSUy5jaGFyQ29kZUF0KGluZGV4KTtcblxuXHQgIC8vIGNvbEludCBhbmQgcm93SW50IGFyZSB0aGUgbGV0dGVycyB0byBidWlsZCB0byByZXR1cm5cblx0ICB2YXIgY29sSW50ID0gY29sT3JpZ2luICsgY29sdW1uIC0gMTtcblx0ICB2YXIgcm93SW50ID0gcm93T3JpZ2luICsgcm93O1xuXHQgIHZhciByb2xsb3ZlciA9IGZhbHNlO1xuXG5cdCAgaWYgKGNvbEludCA+IFopIHtcblx0ICAgIGNvbEludCA9IGNvbEludCAtIFogKyBBIC0gMTtcblx0ICAgIHJvbGxvdmVyID0gdHJ1ZTtcblx0ICB9XG5cblx0ICBpZiAoY29sSW50ID09PSBJIHx8IChjb2xPcmlnaW4gPCBJICYmIGNvbEludCA+IEkpIHx8ICgoY29sSW50ID4gSSB8fCBjb2xPcmlnaW4gPCBJKSAmJiByb2xsb3ZlcikpIHtcblx0ICAgIGNvbEludCsrO1xuXHQgIH1cblxuXHQgIGlmIChjb2xJbnQgPT09IE8gfHwgKGNvbE9yaWdpbiA8IE8gJiYgY29sSW50ID4gTykgfHwgKChjb2xJbnQgPiBPIHx8IGNvbE9yaWdpbiA8IE8pICYmIHJvbGxvdmVyKSkge1xuXHQgICAgY29sSW50Kys7XG5cblx0ICAgIGlmIChjb2xJbnQgPT09IEkpIHtcblx0ICAgICAgY29sSW50Kys7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgaWYgKGNvbEludCA+IFopIHtcblx0ICAgIGNvbEludCA9IGNvbEludCAtIFogKyBBIC0gMTtcblx0ICB9XG5cblx0ICBpZiAocm93SW50ID4gVikge1xuXHQgICAgcm93SW50ID0gcm93SW50IC0gViArIEEgLSAxO1xuXHQgICAgcm9sbG92ZXIgPSB0cnVlO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHJvbGxvdmVyID0gZmFsc2U7XG5cdCAgfVxuXG5cdCAgaWYgKCgocm93SW50ID09PSBJKSB8fCAoKHJvd09yaWdpbiA8IEkpICYmIChyb3dJbnQgPiBJKSkpIHx8ICgoKHJvd0ludCA+IEkpIHx8IChyb3dPcmlnaW4gPCBJKSkgJiYgcm9sbG92ZXIpKSB7XG5cdCAgICByb3dJbnQrKztcblx0ICB9XG5cblx0ICBpZiAoKChyb3dJbnQgPT09IE8pIHx8ICgocm93T3JpZ2luIDwgTykgJiYgKHJvd0ludCA+IE8pKSkgfHwgKCgocm93SW50ID4gTykgfHwgKHJvd09yaWdpbiA8IE8pKSAmJiByb2xsb3ZlcikpIHtcblx0ICAgIHJvd0ludCsrO1xuXG5cdCAgICBpZiAocm93SW50ID09PSBJKSB7XG5cdCAgICAgIHJvd0ludCsrO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGlmIChyb3dJbnQgPiBWKSB7XG5cdCAgICByb3dJbnQgPSByb3dJbnQgLSBWICsgQSAtIDE7XG5cdCAgfVxuXG5cdCAgdmFyIHR3b0xldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29sSW50KSArIFN0cmluZy5mcm9tQ2hhckNvZGUocm93SW50KTtcblx0ICByZXR1cm4gdHdvTGV0dGVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY29kZSB0aGUgVVRNIHBhcmFtZXRlcnMgZnJvbSBhIE1HUlMgc3RyaW5nLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWdyc1N0cmluZyBhbiBVUFBFUkNBU0UgY29vcmRpbmF0ZSBzdHJpbmcgaXMgZXhwZWN0ZWQuXG5cdCAqIEByZXR1cm4ge29iamVjdH0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBlYXN0aW5nLCBub3J0aGluZywgem9uZUxldHRlcixcblx0ICogICAgIHpvbmVOdW1iZXIgYW5kIGFjY3VyYWN5IChpbiBtZXRlcnMpIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWNvZGUobWdyc1N0cmluZykge1xuXG5cdCAgaWYgKG1ncnNTdHJpbmcgJiYgbWdyc1N0cmluZy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRocm93IChcIk1HUlNQb2ludCBjb3ZlcnRpbmcgZnJvbSBub3RoaW5nXCIpO1xuXHQgIH1cblxuXHQgIHZhciBsZW5ndGggPSBtZ3JzU3RyaW5nLmxlbmd0aDtcblxuXHQgIHZhciBodW5LID0gbnVsbDtcblx0ICB2YXIgc2IgPSBcIlwiO1xuXHQgIHZhciB0ZXN0Q2hhcjtcblx0ICB2YXIgaSA9IDA7XG5cblx0ICAvLyBnZXQgWm9uZSBudW1iZXJcblx0ICB3aGlsZSAoISgvW0EtWl0vKS50ZXN0KHRlc3RDaGFyID0gbWdyc1N0cmluZy5jaGFyQXQoaSkpKSB7XG5cdCAgICBpZiAoaSA+PSAyKSB7XG5cdCAgICAgIHRocm93IChcIk1HUlNQb2ludCBiYWQgY29udmVyc2lvbiBmcm9tOiBcIiArIG1ncnNTdHJpbmcpO1xuXHQgICAgfVxuXHQgICAgc2IgKz0gdGVzdENoYXI7XG5cdCAgICBpKys7XG5cdCAgfVxuXG5cdCAgdmFyIHpvbmVOdW1iZXIgPSBwYXJzZUludChzYiwgMTApO1xuXG5cdCAgaWYgKGkgPT09IDAgfHwgaSArIDMgPiBsZW5ndGgpIHtcblx0ICAgIC8vIEEgZ29vZCBNR1JTIHN0cmluZyBoYXMgdG8gYmUgNC01IGRpZ2l0cyBsb25nLFxuXHQgICAgLy8gIyNBQUEvI0FBQSBhdCBsZWFzdC5cblx0ICAgIHRocm93IChcIk1HUlNQb2ludCBiYWQgY29udmVyc2lvbiBmcm9tOiBcIiArIG1ncnNTdHJpbmcpO1xuXHQgIH1cblxuXHQgIHZhciB6b25lTGV0dGVyID0gbWdyc1N0cmluZy5jaGFyQXQoaSsrKTtcblxuXHQgIC8vIFNob3VsZCB3ZSBjaGVjayB0aGUgem9uZSBsZXR0ZXIgaGVyZT8gV2h5IG5vdC5cblx0ICBpZiAoem9uZUxldHRlciA8PSAnQScgfHwgem9uZUxldHRlciA9PT0gJ0InIHx8IHpvbmVMZXR0ZXIgPT09ICdZJyB8fCB6b25lTGV0dGVyID49ICdaJyB8fCB6b25lTGV0dGVyID09PSAnSScgfHwgem9uZUxldHRlciA9PT0gJ08nKSB7XG5cdCAgICB0aHJvdyAoXCJNR1JTUG9pbnQgem9uZSBsZXR0ZXIgXCIgKyB6b25lTGV0dGVyICsgXCIgbm90IGhhbmRsZWQ6IFwiICsgbWdyc1N0cmluZyk7XG5cdCAgfVxuXG5cdCAgaHVuSyA9IG1ncnNTdHJpbmcuc3Vic3RyaW5nKGksIGkgKz0gMik7XG5cblx0ICB2YXIgc2V0ID0gZ2V0MTAwa1NldEZvclpvbmUoem9uZU51bWJlcik7XG5cblx0ICB2YXIgZWFzdDEwMGsgPSBnZXRFYXN0aW5nRnJvbUNoYXIoaHVuSy5jaGFyQXQoMCksIHNldCk7XG5cdCAgdmFyIG5vcnRoMTAwayA9IGdldE5vcnRoaW5nRnJvbUNoYXIoaHVuSy5jaGFyQXQoMSksIHNldCk7XG5cblx0ICAvLyBXZSBoYXZlIGEgYnVnIHdoZXJlIHRoZSBub3J0aGluZyBtYXkgYmUgMjAwMDAwMCB0b28gbG93LlxuXHQgIC8vIEhvd1xuXHQgIC8vIGRvIHdlIGtub3cgd2hlbiB0byByb2xsIG92ZXI/XG5cblx0ICB3aGlsZSAobm9ydGgxMDBrIDwgZ2V0TWluTm9ydGhpbmcoem9uZUxldHRlcikpIHtcblx0ICAgIG5vcnRoMTAwayArPSAyMDAwMDAwO1xuXHQgIH1cblxuXHQgIC8vIGNhbGN1bGF0ZSB0aGUgY2hhciBpbmRleCBmb3IgZWFzdGluZy9ub3J0aGluZyBzZXBhcmF0b3Jcblx0ICB2YXIgcmVtYWluZGVyID0gbGVuZ3RoIC0gaTtcblxuXHQgIGlmIChyZW1haW5kZXIgJSAyICE9PSAwKSB7XG5cdCAgICB0aHJvdyAoXCJNR1JTUG9pbnQgaGFzIHRvIGhhdmUgYW4gZXZlbiBudW1iZXIgXFxub2YgZGlnaXRzIGFmdGVyIHRoZSB6b25lIGxldHRlciBhbmQgdHdvIDEwMGttIGxldHRlcnMgLSBmcm9udCBcXG5oYWxmIGZvciBlYXN0aW5nIG1ldGVycywgc2Vjb25kIGhhbGYgZm9yIFxcbm5vcnRoaW5nIG1ldGVyc1wiICsgbWdyc1N0cmluZyk7XG5cdCAgfVxuXG5cdCAgdmFyIHNlcCA9IHJlbWFpbmRlciAvIDI7XG5cblx0ICB2YXIgc2VwRWFzdGluZyA9IDAuMDtcblx0ICB2YXIgc2VwTm9ydGhpbmcgPSAwLjA7XG5cdCAgdmFyIGFjY3VyYWN5Qm9udXMsIHNlcEVhc3RpbmdTdHJpbmcsIHNlcE5vcnRoaW5nU3RyaW5nLCBlYXN0aW5nLCBub3J0aGluZztcblx0ICBpZiAoc2VwID4gMCkge1xuXHQgICAgYWNjdXJhY3lCb251cyA9IDEwMDAwMC4wIC8gTWF0aC5wb3coMTAsIHNlcCk7XG5cdCAgICBzZXBFYXN0aW5nU3RyaW5nID0gbWdyc1N0cmluZy5zdWJzdHJpbmcoaSwgaSArIHNlcCk7XG5cdCAgICBzZXBFYXN0aW5nID0gcGFyc2VGbG9hdChzZXBFYXN0aW5nU3RyaW5nKSAqIGFjY3VyYWN5Qm9udXM7XG5cdCAgICBzZXBOb3J0aGluZ1N0cmluZyA9IG1ncnNTdHJpbmcuc3Vic3RyaW5nKGkgKyBzZXApO1xuXHQgICAgc2VwTm9ydGhpbmcgPSBwYXJzZUZsb2F0KHNlcE5vcnRoaW5nU3RyaW5nKSAqIGFjY3VyYWN5Qm9udXM7XG5cdCAgfVxuXG5cdCAgZWFzdGluZyA9IHNlcEVhc3RpbmcgKyBlYXN0MTAwaztcblx0ICBub3J0aGluZyA9IHNlcE5vcnRoaW5nICsgbm9ydGgxMDBrO1xuXG5cdCAgcmV0dXJuIHtcblx0ICAgIGVhc3Rpbmc6IGVhc3RpbmcsXG5cdCAgICBub3J0aGluZzogbm9ydGhpbmcsXG5cdCAgICB6b25lTGV0dGVyOiB6b25lTGV0dGVyLFxuXHQgICAgem9uZU51bWJlcjogem9uZU51bWJlcixcblx0ICAgIGFjY3VyYWN5OiBhY2N1cmFjeUJvbnVzXG5cdCAgfTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHaXZlbiB0aGUgZmlyc3QgbGV0dGVyIGZyb20gYSB0d28tbGV0dGVyIE1HUlMgMTAwayB6b25lLCBhbmQgZ2l2ZW4gdGhlXG5cdCAqIE1HUlMgdGFibGUgc2V0IGZvciB0aGUgem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIGVhc3RpbmcgdmFsdWUgdGhhdFxuXHQgKiBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIG90aGVyLCBzZWNvbmRhcnkgZWFzdGluZyB2YWx1ZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtjaGFyfSBlIFRoZSBmaXJzdCBsZXR0ZXIgZnJvbSBhIHR3by1sZXR0ZXIgTUdSUyAxMDDCtGsgem9uZS5cblx0ICogQHBhcmFtIHtudW1iZXJ9IHNldCBUaGUgTUdSUyB0YWJsZSBzZXQgZm9yIHRoZSB6b25lIG51bWJlci5cblx0ICogQHJldHVybiB7bnVtYmVyfSBUaGUgZWFzdGluZyB2YWx1ZSBmb3IgdGhlIGdpdmVuIGxldHRlciBhbmQgc2V0LlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RWFzdGluZ0Zyb21DaGFyKGUsIHNldCkge1xuXHQgIC8vIGNvbE9yaWdpbiBpcyB0aGUgbGV0dGVyIGF0IHRoZSBvcmlnaW4gb2YgdGhlIHNldCBmb3IgdGhlXG5cdCAgLy8gY29sdW1uXG5cdCAgdmFyIGN1ckNvbCA9IFNFVF9PUklHSU5fQ09MVU1OX0xFVFRFUlMuY2hhckNvZGVBdChzZXQgLSAxKTtcblx0ICB2YXIgZWFzdGluZ1ZhbHVlID0gMTAwMDAwLjA7XG5cdCAgdmFyIHJld2luZE1hcmtlciA9IGZhbHNlO1xuXG5cdCAgd2hpbGUgKGN1ckNvbCAhPT0gZS5jaGFyQ29kZUF0KDApKSB7XG5cdCAgICBjdXJDb2wrKztcblx0ICAgIGlmIChjdXJDb2wgPT09IEkpIHtcblx0ICAgICAgY3VyQ29sKys7XG5cdCAgICB9XG5cdCAgICBpZiAoY3VyQ29sID09PSBPKSB7XG5cdCAgICAgIGN1ckNvbCsrO1xuXHQgICAgfVxuXHQgICAgaWYgKGN1ckNvbCA+IFopIHtcblx0ICAgICAgaWYgKHJld2luZE1hcmtlcikge1xuXHQgICAgICAgIHRocm93IChcIkJhZCBjaGFyYWN0ZXI6IFwiICsgZSk7XG5cdCAgICAgIH1cblx0ICAgICAgY3VyQ29sID0gQTtcblx0ICAgICAgcmV3aW5kTWFya2VyID0gdHJ1ZTtcblx0ICAgIH1cblx0ICAgIGVhc3RpbmdWYWx1ZSArPSAxMDAwMDAuMDtcblx0ICB9XG5cblx0ICByZXR1cm4gZWFzdGluZ1ZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdpdmVuIHRoZSBzZWNvbmQgbGV0dGVyIGZyb20gYSB0d28tbGV0dGVyIE1HUlMgMTAwayB6b25lLCBhbmQgZ2l2ZW4gdGhlXG5cdCAqIE1HUlMgdGFibGUgc2V0IGZvciB0aGUgem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIG5vcnRoaW5nIHZhbHVlIHRoYXRcblx0ICogc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBvdGhlciwgc2Vjb25kYXJ5IG5vcnRoaW5nIHZhbHVlLiBZb3UgaGF2ZSB0b1xuXHQgKiByZW1lbWJlciB0aGF0IE5vcnRoaW5ncyBhcmUgZGV0ZXJtaW5lZCBmcm9tIHRoZSBlcXVhdG9yLCBhbmQgdGhlIHZlcnRpY2FsXG5cdCAqIGN5Y2xlIG9mIGxldHRlcnMgbWVhbiBhIDIwMDAwMDAgYWRkaXRpb25hbCBub3J0aGluZyBtZXRlcnMuIFRoaXMgaGFwcGVuc1xuXHQgKiBhcHByb3guIGV2ZXJ5IDE4IGRlZ3JlZXMgb2YgbGF0aXR1ZGUuIFRoaXMgbWV0aG9kIGRvZXMgKk5PVCogY291bnQgYW55XG5cdCAqIGFkZGl0aW9uYWwgbm9ydGhpbmdzLiBZb3UgaGF2ZSB0byBmaWd1cmUgb3V0IGhvdyBtYW55IDIwMDAwMDAgbWV0ZXJzIG5lZWRcblx0ICogdG8gYmUgYWRkZWQgZm9yIHRoZSB6b25lIGxldHRlciBvZiB0aGUgTUdSUyBjb29yZGluYXRlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge2NoYXJ9IG4gU2Vjb25kIGxldHRlciBvZiB0aGUgTUdSUyAxMDBrIHpvbmVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNldCBUaGUgTUdSUyB0YWJsZSBzZXQgbnVtYmVyLCB3aGljaCBpcyBkZXBlbmRlbnQgb24gdGhlXG5cdCAqICAgICBVVE0gem9uZSBudW1iZXIuXG5cdCAqIEByZXR1cm4ge251bWJlcn0gVGhlIG5vcnRoaW5nIHZhbHVlIGZvciB0aGUgZ2l2ZW4gbGV0dGVyIGFuZCBzZXQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXROb3J0aGluZ0Zyb21DaGFyKG4sIHNldCkge1xuXG5cdCAgaWYgKG4gPiAnVicpIHtcblx0ICAgIHRocm93IChcIk1HUlNQb2ludCBnaXZlbiBpbnZhbGlkIE5vcnRoaW5nIFwiICsgbik7XG5cdCAgfVxuXG5cdCAgLy8gcm93T3JpZ2luIGlzIHRoZSBsZXR0ZXIgYXQgdGhlIG9yaWdpbiBvZiB0aGUgc2V0IGZvciB0aGVcblx0ICAvLyBjb2x1bW5cblx0ICB2YXIgY3VyUm93ID0gU0VUX09SSUdJTl9ST1dfTEVUVEVSUy5jaGFyQ29kZUF0KHNldCAtIDEpO1xuXHQgIHZhciBub3J0aGluZ1ZhbHVlID0gMC4wO1xuXHQgIHZhciByZXdpbmRNYXJrZXIgPSBmYWxzZTtcblxuXHQgIHdoaWxlIChjdXJSb3cgIT09IG4uY2hhckNvZGVBdCgwKSkge1xuXHQgICAgY3VyUm93Kys7XG5cdCAgICBpZiAoY3VyUm93ID09PSBJKSB7XG5cdCAgICAgIGN1clJvdysrO1xuXHQgICAgfVxuXHQgICAgaWYgKGN1clJvdyA9PT0gTykge1xuXHQgICAgICBjdXJSb3crKztcblx0ICAgIH1cblx0ICAgIC8vIGZpeGluZyBhIGJ1ZyBtYWtpbmcgd2hvbGUgYXBwbGljYXRpb24gaGFuZyBpbiB0aGlzIGxvb3Bcblx0ICAgIC8vIHdoZW4gJ24nIGlzIGEgd3JvbmcgY2hhcmFjdGVyXG5cdCAgICBpZiAoY3VyUm93ID4gVikge1xuXHQgICAgICBpZiAocmV3aW5kTWFya2VyKSB7IC8vIG1ha2luZyBzdXJlIHRoYXQgdGhpcyBsb29wIGVuZHNcblx0ICAgICAgICB0aHJvdyAoXCJCYWQgY2hhcmFjdGVyOiBcIiArIG4pO1xuXHQgICAgICB9XG5cdCAgICAgIGN1clJvdyA9IEE7XG5cdCAgICAgIHJld2luZE1hcmtlciA9IHRydWU7XG5cdCAgICB9XG5cdCAgICBub3J0aGluZ1ZhbHVlICs9IDEwMDAwMC4wO1xuXHQgIH1cblxuXHQgIHJldHVybiBub3J0aGluZ1ZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiBnZXRNaW5Ob3J0aGluZyByZXR1cm5zIHRoZSBtaW5pbXVtIG5vcnRoaW5nIHZhbHVlIG9mIGEgTUdSU1xuXHQgKiB6b25lLlxuXHQgKlxuXHQgKiBQb3J0ZWQgZnJvbSBHZW90cmFucycgYyBMYXR0aXR1ZGVfQmFuZF9WYWx1ZSBzdHJ1Y3R1cmUgdGFibGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Y2hhcn0gem9uZUxldHRlciBUaGUgTUdSUyB6b25lIHRvIGdldCB0aGUgbWluIG5vcnRoaW5nIGZvci5cblx0ICogQHJldHVybiB7bnVtYmVyfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0TWluTm9ydGhpbmcoem9uZUxldHRlcikge1xuXHQgIHZhciBub3J0aGluZztcblx0ICBzd2l0Y2ggKHpvbmVMZXR0ZXIpIHtcblx0ICBjYXNlICdDJzpcblx0ICAgIG5vcnRoaW5nID0gMTEwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgY2FzZSAnRCc6XG5cdCAgICBub3J0aGluZyA9IDIwMDAwMDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ0UnOlxuXHQgICAgbm9ydGhpbmcgPSAyODAwMDAwLjA7XG5cdCAgICBicmVhaztcblx0ICBjYXNlICdGJzpcblx0ICAgIG5vcnRoaW5nID0gMzcwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgY2FzZSAnRyc6XG5cdCAgICBub3J0aGluZyA9IDQ2MDAwMDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ0gnOlxuXHQgICAgbm9ydGhpbmcgPSA1NTAwMDAwLjA7XG5cdCAgICBicmVhaztcblx0ICBjYXNlICdKJzpcblx0ICAgIG5vcnRoaW5nID0gNjQwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgY2FzZSAnSyc6XG5cdCAgICBub3J0aGluZyA9IDczMDAwMDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ0wnOlxuXHQgICAgbm9ydGhpbmcgPSA4MjAwMDAwLjA7XG5cdCAgICBicmVhaztcblx0ICBjYXNlICdNJzpcblx0ICAgIG5vcnRoaW5nID0gOTEwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgY2FzZSAnTic6XG5cdCAgICBub3J0aGluZyA9IDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ1AnOlxuXHQgICAgbm9ydGhpbmcgPSA4MDAwMDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ1EnOlxuXHQgICAgbm9ydGhpbmcgPSAxNzAwMDAwLjA7XG5cdCAgICBicmVhaztcblx0ICBjYXNlICdSJzpcblx0ICAgIG5vcnRoaW5nID0gMjYwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgY2FzZSAnUyc6XG5cdCAgICBub3J0aGluZyA9IDM1MDAwMDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ1QnOlxuXHQgICAgbm9ydGhpbmcgPSA0NDAwMDAwLjA7XG5cdCAgICBicmVhaztcblx0ICBjYXNlICdVJzpcblx0ICAgIG5vcnRoaW5nID0gNTMwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgY2FzZSAnVic6XG5cdCAgICBub3J0aGluZyA9IDYyMDAwMDAuMDtcblx0ICAgIGJyZWFrO1xuXHQgIGNhc2UgJ1cnOlxuXHQgICAgbm9ydGhpbmcgPSA3MDAwMDAwLjA7XG5cdCAgICBicmVhaztcblx0ICBjYXNlICdYJzpcblx0ICAgIG5vcnRoaW5nID0gNzkwMDAwMC4wO1xuXHQgICAgYnJlYWs7XG5cdCAgZGVmYXVsdDpcblx0ICAgIG5vcnRoaW5nID0gLTEuMDtcblx0ICB9XG5cdCAgaWYgKG5vcnRoaW5nID49IDAuMCkge1xuXHQgICAgcmV0dXJuIG5vcnRoaW5nO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHRocm93IChcIkludmFsaWQgem9uZSBsZXR0ZXI6IFwiICsgem9uZUxldHRlcik7XG5cdCAgfVxuXG5cdH1cblxuXHRmdW5jdGlvbiBQb2ludCh4LCB5LCB6KSB7XG5cdCAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBvaW50KSkge1xuXHQgICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5LCB6KTtcblx0ICB9XG5cdCAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcblx0ICAgIHRoaXMueCA9IHhbMF07XG5cdCAgICB0aGlzLnkgPSB4WzFdO1xuXHQgICAgdGhpcy56ID0geFsyXSB8fCAwLjA7XG5cdCAgfSBlbHNlIGlmKHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuXHQgICAgdGhpcy54ID0geC54O1xuXHQgICAgdGhpcy55ID0geC55O1xuXHQgICAgdGhpcy56ID0geC56IHx8IDAuMDtcblx0ICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgeSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHZhciBjb29yZHMgPSB4LnNwbGl0KCcsJyk7XG5cdCAgICB0aGlzLnggPSBwYXJzZUZsb2F0KGNvb3Jkc1swXSwgMTApO1xuXHQgICAgdGhpcy55ID0gcGFyc2VGbG9hdChjb29yZHNbMV0sIDEwKTtcblx0ICAgIHRoaXMueiA9IHBhcnNlRmxvYXQoY29vcmRzWzJdLCAxMCkgfHwgMC4wO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB0aGlzLnggPSB4O1xuXHQgICAgdGhpcy55ID0geTtcblx0ICAgIHRoaXMueiA9IHogfHwgMC4wO1xuXHQgIH1cblx0ICBjb25zb2xlLndhcm4oJ3Byb2o0LlBvaW50IHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDMsIHVzZSBwcm9qNC50b1BvaW50Jyk7XG5cdH1cblxuXHRQb2ludC5mcm9tTUdSUyA9IGZ1bmN0aW9uKG1ncnNTdHIpIHtcblx0ICByZXR1cm4gbmV3IFBvaW50KHRvUG9pbnQkMShtZ3JzU3RyKSk7XG5cdH07XG5cdFBvaW50LnByb3RvdHlwZS50b01HUlMgPSBmdW5jdGlvbihhY2N1cmFjeSkge1xuXHQgIHJldHVybiBmb3J3YXJkJDEoW3RoaXMueCwgdGhpcy55XSwgYWNjdXJhY3kpO1xuXHR9O1xuXG5cdHZhciB2ZXJzaW9uID0gXCIyLjUuMFwiO1xuXG5cdHZhciBDMDAgPSAxO1xuXHR2YXIgQzAyID0gMC4yNTtcblx0dmFyIEMwNCA9IDAuMDQ2ODc1O1xuXHR2YXIgQzA2ID0gMC4wMTk1MzEyNTtcblx0dmFyIEMwOCA9IDAuMDEwNjgxMTUyMzQzNzU7XG5cdHZhciBDMjIgPSAwLjc1O1xuXHR2YXIgQzQ0ID0gMC40Njg3NTtcblx0dmFyIEM0NiA9IDAuMDEzMDIwODMzMzMzMzMzMzMzMzM7XG5cdHZhciBDNDggPSAwLjAwNzEyMDc2ODIyOTE2NjY2NjY2O1xuXHR2YXIgQzY2ID0gMC4zNjQ1ODMzMzMzMzMzMzMzMzMzMztcblx0dmFyIEM2OCA9IDAuMDA1Njk2NjE0NTgzMzMzMzMzMzM7XG5cdHZhciBDODggPSAwLjMwNzYxNzE4NzU7XG5cblx0dmFyIHBqX2VuZm4gPSBmdW5jdGlvbihlcykge1xuXHQgIHZhciBlbiA9IFtdO1xuXHQgIGVuWzBdID0gQzAwIC0gZXMgKiAoQzAyICsgZXMgKiAoQzA0ICsgZXMgKiAoQzA2ICsgZXMgKiBDMDgpKSk7XG5cdCAgZW5bMV0gPSBlcyAqIChDMjIgLSBlcyAqIChDMDQgKyBlcyAqIChDMDYgKyBlcyAqIEMwOCkpKTtcblx0ICB2YXIgdCA9IGVzICogZXM7XG5cdCAgZW5bMl0gPSB0ICogKEM0NCAtIGVzICogKEM0NiArIGVzICogQzQ4KSk7XG5cdCAgdCAqPSBlcztcblx0ICBlblszXSA9IHQgKiAoQzY2IC0gZXMgKiBDNjgpO1xuXHQgIGVuWzRdID0gdCAqIGVzICogQzg4O1xuXHQgIHJldHVybiBlbjtcblx0fTtcblxuXHR2YXIgcGpfbWxmbiA9IGZ1bmN0aW9uKHBoaSwgc3BoaSwgY3BoaSwgZW4pIHtcblx0ICBjcGhpICo9IHNwaGk7XG5cdCAgc3BoaSAqPSBzcGhpO1xuXHQgIHJldHVybiAoZW5bMF0gKiBwaGkgLSBjcGhpICogKGVuWzFdICsgc3BoaSAqIChlblsyXSArIHNwaGkgKiAoZW5bM10gKyBzcGhpICogZW5bNF0pKSkpO1xuXHR9O1xuXG5cdHZhciBNQVhfSVRFUiA9IDIwO1xuXG5cdHZhciBwal9pbnZfbWxmbiA9IGZ1bmN0aW9uKGFyZywgZXMsIGVuKSB7XG5cdCAgdmFyIGsgPSAxIC8gKDEgLSBlcyk7XG5cdCAgdmFyIHBoaSA9IGFyZztcblx0ICBmb3IgKHZhciBpID0gTUFYX0lURVI7IGk7IC0taSkgeyAvKiByYXJlbHkgZ29lcyBvdmVyIDIgaXRlcmF0aW9ucyAqL1xuXHQgICAgdmFyIHMgPSBNYXRoLnNpbihwaGkpO1xuXHQgICAgdmFyIHQgPSAxIC0gZXMgKiBzICogcztcblx0ICAgIC8vdCA9IHRoaXMucGpfbWxmbihwaGksIHMsIE1hdGguY29zKHBoaSksIGVuKSAtIGFyZztcblx0ICAgIC8vcGhpIC09IHQgKiAodCAqIE1hdGguc3FydCh0KSkgKiBrO1xuXHQgICAgdCA9IChwal9tbGZuKHBoaSwgcywgTWF0aC5jb3MocGhpKSwgZW4pIC0gYXJnKSAqICh0ICogTWF0aC5zcXJ0KHQpKSAqIGs7XG5cdCAgICBwaGkgLT0gdDtcblx0ICAgIGlmIChNYXRoLmFicyh0KSA8IEVQU0xOKSB7XG5cdCAgICAgIHJldHVybiBwaGk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8vLi5yZXBvcnRFcnJvcihcImNhc3M6cGpfaW52X21sZm46IENvbnZlcmdlbmNlIGVycm9yXCIpO1xuXHQgIHJldHVybiBwaGk7XG5cdH07XG5cblx0Ly8gSGVhdmlseSBiYXNlZCBvbiB0aGlzIHRtZXJjIHByb2plY3Rpb24gaW1wbGVtZW50YXRpb25cblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL21ibG9jaC9tYXBzaGFwZXItcHJvai9ibG9iL21hc3Rlci9zcmMvcHJvamVjdGlvbnMvdG1lcmMuanNcblxuXHRmdW5jdGlvbiBpbml0JDIoKSB7XG5cdCAgdGhpcy54MCA9IHRoaXMueDAgIT09IHVuZGVmaW5lZCA/IHRoaXMueDAgOiAwO1xuXHQgIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcblx0ICB0aGlzLmxvbmcwID0gdGhpcy5sb25nMCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sb25nMCA6IDA7XG5cdCAgdGhpcy5sYXQwID0gdGhpcy5sYXQwICE9PSB1bmRlZmluZWQgPyB0aGlzLmxhdDAgOiAwO1xuXG5cdCAgaWYgKHRoaXMuZXMpIHtcblx0ICAgIHRoaXMuZW4gPSBwal9lbmZuKHRoaXMuZXMpO1xuXHQgICAgdGhpcy5tbDAgPSBwal9tbGZuKHRoaXMubGF0MCwgTWF0aC5zaW4odGhpcy5sYXQwKSwgTWF0aC5jb3ModGhpcy5sYXQwKSwgdGhpcy5lbik7XG5cdCAgfVxuXHR9XG5cblx0LyoqXG5cdCAgICBUcmFuc3ZlcnNlIE1lcmNhdG9yIEZvcndhcmQgIC0gbG9uZy9sYXQgdG8geC95XG5cdCAgICBsb25nL2xhdCBpbiByYWRpYW5zXG5cdCAgKi9cblx0ZnVuY3Rpb24gZm9yd2FyZCQyKHApIHtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cblx0ICB2YXIgZGVsdGFfbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblx0ICB2YXIgY29uO1xuXHQgIHZhciB4LCB5O1xuXHQgIHZhciBzaW5fcGhpID0gTWF0aC5zaW4obGF0KTtcblx0ICB2YXIgY29zX3BoaSA9IE1hdGguY29zKGxhdCk7XG5cblx0ICBpZiAoIXRoaXMuZXMpIHtcblx0ICAgIHZhciBiID0gY29zX3BoaSAqIE1hdGguc2luKGRlbHRhX2xvbik7XG5cblx0ICAgIGlmICgoTWF0aC5hYnMoTWF0aC5hYnMoYikgLSAxKSkgPCBFUFNMTikge1xuXHQgICAgICByZXR1cm4gKDkzKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICB4ID0gMC41ICogdGhpcy5hICogdGhpcy5rMCAqIE1hdGgubG9nKCgxICsgYikgLyAoMSAtIGIpKSArIHRoaXMueDA7XG5cdCAgICAgIHkgPSBjb3NfcGhpICogTWF0aC5jb3MoZGVsdGFfbG9uKSAvIE1hdGguc3FydCgxIC0gTWF0aC5wb3coYiwgMikpO1xuXHQgICAgICBiID0gTWF0aC5hYnMoeSk7XG5cblx0ICAgICAgaWYgKGIgPj0gMSkge1xuXHQgICAgICAgIGlmICgoYiAtIDEpID4gRVBTTE4pIHtcblx0ICAgICAgICAgIHJldHVybiAoOTMpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgIHkgPSAwO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICBlbHNlIHtcblx0ICAgICAgICB5ID0gTWF0aC5hY29zKHkpO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGxhdCA8IDApIHtcblx0ICAgICAgICB5ID0gLXk7XG5cdCAgICAgIH1cblxuXHQgICAgICB5ID0gdGhpcy5hICogdGhpcy5rMCAqICh5IC0gdGhpcy5sYXQwKSArIHRoaXMueTA7XG5cdCAgICB9XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgdmFyIGFsID0gY29zX3BoaSAqIGRlbHRhX2xvbjtcblx0ICAgIHZhciBhbHMgPSBNYXRoLnBvdyhhbCwgMik7XG5cdCAgICB2YXIgYyA9IHRoaXMuZXAyICogTWF0aC5wb3coY29zX3BoaSwgMik7XG5cdCAgICB2YXIgY3MgPSBNYXRoLnBvdyhjLCAyKTtcblx0ICAgIHZhciB0cSA9IE1hdGguYWJzKGNvc19waGkpID4gRVBTTE4gPyBNYXRoLnRhbihsYXQpIDogMDtcblx0ICAgIHZhciB0ID0gTWF0aC5wb3codHEsIDIpO1xuXHQgICAgdmFyIHRzID0gTWF0aC5wb3codCwgMik7XG5cdCAgICBjb24gPSAxIC0gdGhpcy5lcyAqIE1hdGgucG93KHNpbl9waGksIDIpO1xuXHQgICAgYWwgPSBhbCAvIE1hdGguc3FydChjb24pO1xuXHQgICAgdmFyIG1sID0gcGpfbWxmbihsYXQsIHNpbl9waGksIGNvc19waGksIHRoaXMuZW4pO1xuXG5cdCAgICB4ID0gdGhpcy5hICogKHRoaXMuazAgKiBhbCAqICgxICtcblx0ICAgICAgYWxzIC8gNiAqICgxIC0gdCArIGMgK1xuXHQgICAgICBhbHMgLyAyMCAqICg1IC0gMTggKiB0ICsgdHMgKyAxNCAqIGMgLSA1OCAqIHQgKiBjICtcblx0ICAgICAgYWxzIC8gNDIgKiAoNjEgKyAxNzkgKiB0cyAtIHRzICogdCAtIDQ3OSAqIHQpKSkpKSArXG5cdCAgICAgIHRoaXMueDA7XG5cblx0ICAgIHkgPSB0aGlzLmEgKiAodGhpcy5rMCAqIChtbCAtIHRoaXMubWwwICtcblx0ICAgICAgc2luX3BoaSAqIGRlbHRhX2xvbiAqIGFsIC8gMiAqICgxICtcblx0ICAgICAgYWxzIC8gMTIgKiAoNSAtIHQgKyA5ICogYyArIDQgKiBjcyArXG5cdCAgICAgIGFscyAvIDMwICogKDYxICsgdHMgLSA1OCAqIHQgKyAyNzAgKiBjIC0gMzMwICogdCAqIGMgK1xuXHQgICAgICBhbHMgLyA1NiAqICgxMzg1ICsgNTQzICogdHMgLSB0cyAqIHQgLSAzMTExICogdCkpKSkpKSArXG5cdCAgICAgIHRoaXMueTA7XG5cdCAgfVxuXG5cdCAgcC54ID0geDtcblx0ICBwLnkgPSB5O1xuXG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvKipcblx0ICAgIFRyYW5zdmVyc2UgTWVyY2F0b3IgSW52ZXJzZSAgLSAgeC95IHRvIGxvbmcvbGF0XG5cdCAgKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQyKHApIHtcblx0ICB2YXIgY29uLCBwaGk7XG5cdCAgdmFyIGxhdCwgbG9uO1xuXHQgIHZhciB4ID0gKHAueCAtIHRoaXMueDApICogKDEgLyB0aGlzLmEpO1xuXHQgIHZhciB5ID0gKHAueSAtIHRoaXMueTApICogKDEgLyB0aGlzLmEpO1xuXG5cdCAgaWYgKCF0aGlzLmVzKSB7XG5cdCAgICB2YXIgZiA9IE1hdGguZXhwKHggLyB0aGlzLmswKTtcblx0ICAgIHZhciBnID0gMC41ICogKGYgLSAxIC8gZik7XG5cdCAgICB2YXIgdGVtcCA9IHRoaXMubGF0MCArIHkgLyB0aGlzLmswO1xuXHQgICAgdmFyIGggPSBNYXRoLmNvcyh0ZW1wKTtcblx0ICAgIGNvbiA9IE1hdGguc3FydCgoMSAtIE1hdGgucG93KGgsIDIpKSAvICgxICsgTWF0aC5wb3coZywgMikpKTtcblx0ICAgIGxhdCA9IE1hdGguYXNpbihjb24pO1xuXG5cdCAgICBpZiAoeSA8IDApIHtcblx0ICAgICAgbGF0ID0gLWxhdDtcblx0ICAgIH1cblxuXHQgICAgaWYgKChnID09PSAwKSAmJiAoaCA9PT0gMCkpIHtcblx0ICAgICAgbG9uID0gMDtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICBsb24gPSBhZGp1c3RfbG9uKE1hdGguYXRhbjIoZywgaCkgKyB0aGlzLmxvbmcwKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgZWxzZSB7IC8vIGVsbGlwc29pZGFsIGZvcm1cblx0ICAgIGNvbiA9IHRoaXMubWwwICsgeSAvIHRoaXMuazA7XG5cdCAgICBwaGkgPSBwal9pbnZfbWxmbihjb24sIHRoaXMuZXMsIHRoaXMuZW4pO1xuXG5cdCAgICBpZiAoTWF0aC5hYnMocGhpKSA8IEhBTEZfUEkpIHtcblx0ICAgICAgdmFyIHNpbl9waGkgPSBNYXRoLnNpbihwaGkpO1xuXHQgICAgICB2YXIgY29zX3BoaSA9IE1hdGguY29zKHBoaSk7XG5cdCAgICAgIHZhciB0YW5fcGhpID0gTWF0aC5hYnMoY29zX3BoaSkgPiBFUFNMTiA/IE1hdGgudGFuKHBoaSkgOiAwO1xuXHQgICAgICB2YXIgYyA9IHRoaXMuZXAyICogTWF0aC5wb3coY29zX3BoaSwgMik7XG5cdCAgICAgIHZhciBjcyA9IE1hdGgucG93KGMsIDIpO1xuXHQgICAgICB2YXIgdCA9IE1hdGgucG93KHRhbl9waGksIDIpO1xuXHQgICAgICB2YXIgdHMgPSBNYXRoLnBvdyh0LCAyKTtcblx0ICAgICAgY29uID0gMSAtIHRoaXMuZXMgKiBNYXRoLnBvdyhzaW5fcGhpLCAyKTtcblx0ICAgICAgdmFyIGQgPSB4ICogTWF0aC5zcXJ0KGNvbikgLyB0aGlzLmswO1xuXHQgICAgICB2YXIgZHMgPSBNYXRoLnBvdyhkLCAyKTtcblx0ICAgICAgY29uID0gY29uICogdGFuX3BoaTtcblxuXHQgICAgICBsYXQgPSBwaGkgLSAoY29uICogZHMgLyAoMSAtIHRoaXMuZXMpKSAqIDAuNSAqICgxIC1cblx0ICAgICAgICBkcyAvIDEyICogKDUgKyAzICogdCAtIDkgKiBjICogdCArIGMgLSA0ICogY3MgLVxuXHQgICAgICAgIGRzIC8gMzAgKiAoNjEgKyA5MCAqIHQgLSAyNTIgKiBjICogdCArIDQ1ICogdHMgKyA0NiAqIGMgLVxuXHQgICAgICAgIGRzIC8gNTYgKiAoMTM4NSArIDM2MzMgKiB0ICsgNDA5NSAqIHRzICsgMTU3NCAqIHRzICogdCkpKSk7XG5cblx0ICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKGQgKiAoMSAtXG5cdCAgICAgICAgZHMgLyA2ICogKDEgKyAyICogdCArIGMgLVxuXHQgICAgICAgIGRzIC8gMjAgKiAoNSArIDI4ICogdCArIDI0ICogdHMgKyA4ICogYyAqIHQgKyA2ICogYyAtXG5cdCAgICAgICAgZHMgLyA0MiAqICg2MSArIDY2MiAqIHQgKyAxMzIwICogdHMgKyA3MjAgKiB0cyAqIHQpKSkpIC8gY29zX3BoaSkpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIGxhdCA9IEhBTEZfUEkgKiBzaWduKHkpO1xuXHQgICAgICBsb24gPSAwO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdHZhciBuYW1lcyQzID0gW1wiVHJhbnN2ZXJzZV9NZXJjYXRvclwiLCBcIlRyYW5zdmVyc2UgTWVyY2F0b3JcIiwgXCJ0bWVyY1wiXTtcblx0dmFyIHRtZXJjID0ge1xuXHQgIGluaXQ6IGluaXQkMixcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDIsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQyLFxuXHQgIG5hbWVzOiBuYW1lcyQzXG5cdH07XG5cblx0dmFyIHNpbmggPSBmdW5jdGlvbih4KSB7XG5cdCAgdmFyIHIgPSBNYXRoLmV4cCh4KTtcblx0ICByID0gKHIgLSAxIC8gcikgLyAyO1xuXHQgIHJldHVybiByO1xuXHR9O1xuXG5cdHZhciBoeXBvdCA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0ICB4ID0gTWF0aC5hYnMoeCk7XG5cdCAgeSA9IE1hdGguYWJzKHkpO1xuXHQgIHZhciBhID0gTWF0aC5tYXgoeCwgeSk7XG5cdCAgdmFyIGIgPSBNYXRoLm1pbih4LCB5KSAvIChhID8gYSA6IDEpO1xuXG5cdCAgcmV0dXJuIGEgKiBNYXRoLnNxcnQoMSArIE1hdGgucG93KGIsIDIpKTtcblx0fTtcblxuXHR2YXIgbG9nMXB5ID0gZnVuY3Rpb24oeCkge1xuXHQgIHZhciB5ID0gMSArIHg7XG5cdCAgdmFyIHogPSB5IC0gMTtcblxuXHQgIHJldHVybiB6ID09PSAwID8geCA6IHggKiBNYXRoLmxvZyh5KSAvIHo7XG5cdH07XG5cblx0dmFyIGFzaW5oeSA9IGZ1bmN0aW9uKHgpIHtcblx0ICB2YXIgeSA9IE1hdGguYWJzKHgpO1xuXHQgIHkgPSBsb2cxcHkoeSAqICgxICsgeSAvIChoeXBvdCgxLCB5KSArIDEpKSk7XG5cblx0ICByZXR1cm4geCA8IDAgPyAteSA6IHk7XG5cdH07XG5cblx0dmFyIGdhdGcgPSBmdW5jdGlvbihwcCwgQikge1xuXHQgIHZhciBjb3NfMkIgPSAyICogTWF0aC5jb3MoMiAqIEIpO1xuXHQgIHZhciBpID0gcHAubGVuZ3RoIC0gMTtcblx0ICB2YXIgaDEgPSBwcFtpXTtcblx0ICB2YXIgaDIgPSAwO1xuXHQgIHZhciBoO1xuXG5cdCAgd2hpbGUgKC0taSA+PSAwKSB7XG5cdCAgICBoID0gLWgyICsgY29zXzJCICogaDEgKyBwcFtpXTtcblx0ICAgIGgyID0gaDE7XG5cdCAgICBoMSA9IGg7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIChCICsgaCAqIE1hdGguc2luKDIgKiBCKSk7XG5cdH07XG5cblx0dmFyIGNsZW5zID0gZnVuY3Rpb24ocHAsIGFyZ19yKSB7XG5cdCAgdmFyIHIgPSAyICogTWF0aC5jb3MoYXJnX3IpO1xuXHQgIHZhciBpID0gcHAubGVuZ3RoIC0gMTtcblx0ICB2YXIgaHIxID0gcHBbaV07XG5cdCAgdmFyIGhyMiA9IDA7XG5cdCAgdmFyIGhyO1xuXG5cdCAgd2hpbGUgKC0taSA+PSAwKSB7XG5cdCAgICBociA9IC1ocjIgKyByICogaHIxICsgcHBbaV07XG5cdCAgICBocjIgPSBocjE7XG5cdCAgICBocjEgPSBocjtcblx0ICB9XG5cblx0ICByZXR1cm4gTWF0aC5zaW4oYXJnX3IpICogaHI7XG5cdH07XG5cblx0dmFyIGNvc2ggPSBmdW5jdGlvbih4KSB7XG5cdCAgdmFyIHIgPSBNYXRoLmV4cCh4KTtcblx0ICByID0gKHIgKyAxIC8gcikgLyAyO1xuXHQgIHJldHVybiByO1xuXHR9O1xuXG5cdHZhciBjbGVuc19jbXBseCA9IGZ1bmN0aW9uKHBwLCBhcmdfciwgYXJnX2kpIHtcblx0ICB2YXIgc2luX2FyZ19yID0gTWF0aC5zaW4oYXJnX3IpO1xuXHQgIHZhciBjb3NfYXJnX3IgPSBNYXRoLmNvcyhhcmdfcik7XG5cdCAgdmFyIHNpbmhfYXJnX2kgPSBzaW5oKGFyZ19pKTtcblx0ICB2YXIgY29zaF9hcmdfaSA9IGNvc2goYXJnX2kpO1xuXHQgIHZhciByID0gMiAqIGNvc19hcmdfciAqIGNvc2hfYXJnX2k7XG5cdCAgdmFyIGkgPSAtMiAqIHNpbl9hcmdfciAqIHNpbmhfYXJnX2k7XG5cdCAgdmFyIGogPSBwcC5sZW5ndGggLSAxO1xuXHQgIHZhciBociA9IHBwW2pdO1xuXHQgIHZhciBoaTEgPSAwO1xuXHQgIHZhciBocjEgPSAwO1xuXHQgIHZhciBoaSA9IDA7XG5cdCAgdmFyIGhyMjtcblx0ICB2YXIgaGkyO1xuXG5cdCAgd2hpbGUgKC0taiA+PSAwKSB7XG5cdCAgICBocjIgPSBocjE7XG5cdCAgICBoaTIgPSBoaTE7XG5cdCAgICBocjEgPSBocjtcblx0ICAgIGhpMSA9IGhpO1xuXHQgICAgaHIgPSAtaHIyICsgciAqIGhyMSAtIGkgKiBoaTEgKyBwcFtqXTtcblx0ICAgIGhpID0gLWhpMiArIGkgKiBocjEgKyByICogaGkxO1xuXHQgIH1cblxuXHQgIHIgPSBzaW5fYXJnX3IgKiBjb3NoX2FyZ19pO1xuXHQgIGkgPSBjb3NfYXJnX3IgKiBzaW5oX2FyZ19pO1xuXG5cdCAgcmV0dXJuIFtyICogaHIgLSBpICogaGksIHIgKiBoaSArIGkgKiBocl07XG5cdH07XG5cblx0Ly8gSGVhdmlseSBiYXNlZCBvbiB0aGlzIGV0bWVyYyBwcm9qZWN0aW9uIGltcGxlbWVudGF0aW9uXG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYmxvY2gvbWFwc2hhcGVyLXByb2ovYmxvYi9tYXN0ZXIvc3JjL3Byb2plY3Rpb25zL2V0bWVyYy5qc1xuXG5cdGZ1bmN0aW9uIGluaXQkMygpIHtcblx0ICBpZiAodGhpcy5lcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZXMgPD0gMCkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdpbmNvcnJlY3QgZWxsaXB0aWNhbCB1c2FnZScpO1xuXHQgIH1cblxuXHQgIHRoaXMueDAgPSB0aGlzLngwICE9PSB1bmRlZmluZWQgPyB0aGlzLngwIDogMDtcblx0ICB0aGlzLnkwID0gdGhpcy55MCAhPT0gdW5kZWZpbmVkID8gdGhpcy55MCA6IDA7XG5cdCAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xuXHQgIHRoaXMubGF0MCA9IHRoaXMubGF0MCAhPT0gdW5kZWZpbmVkID8gdGhpcy5sYXQwIDogMDtcblxuXHQgIHRoaXMuY2diID0gW107XG5cdCAgdGhpcy5jYmcgPSBbXTtcblx0ICB0aGlzLnV0ZyA9IFtdO1xuXHQgIHRoaXMuZ3R1ID0gW107XG5cblx0ICB2YXIgZiA9IHRoaXMuZXMgLyAoMSArIE1hdGguc3FydCgxIC0gdGhpcy5lcykpO1xuXHQgIHZhciBuID0gZiAvICgyIC0gZik7XG5cdCAgdmFyIG5wID0gbjtcblxuXHQgIHRoaXMuY2diWzBdID0gbiAqICgyICsgbiAqICgtMiAvIDMgKyBuICogKC0yICsgbiAqICgxMTYgLyA0NSArIG4gKiAoMjYgLyA0NSArIG4gKiAoLTI4NTQgLyA2NzUgKSkpKSkpO1xuXHQgIHRoaXMuY2JnWzBdID0gbiAqICgtMiArIG4gKiAoIDIgLyAzICsgbiAqICggNCAvIDMgKyBuICogKC04MiAvIDQ1ICsgbiAqICgzMiAvIDQ1ICsgbiAqICg0NjQyIC8gNDcyNSkpKSkpKTtcblxuXHQgIG5wID0gbnAgKiBuO1xuXHQgIHRoaXMuY2diWzFdID0gbnAgKiAoNyAvIDMgKyBuICogKC04IC8gNSArIG4gKiAoLTIyNyAvIDQ1ICsgbiAqICgyNzA0IC8gMzE1ICsgbiAqICgyMzIzIC8gOTQ1KSkpKSk7XG5cdCAgdGhpcy5jYmdbMV0gPSBucCAqICg1IC8gMyArIG4gKiAoLTE2IC8gMTUgKyBuICogKCAtMTMgLyA5ICsgbiAqICg5MDQgLyAzMTUgKyBuICogKC0xNTIyIC8gOTQ1KSkpKSk7XG5cblx0ICBucCA9IG5wICogbjtcblx0ICB0aGlzLmNnYlsyXSA9IG5wICogKDU2IC8gMTUgKyBuICogKC0xMzYgLyAzNSArIG4gKiAoLTEyNjIgLyAxMDUgKyBuICogKDczODE0IC8gMjgzNSkpKSk7XG5cdCAgdGhpcy5jYmdbMl0gPSBucCAqICgtMjYgLyAxNSArIG4gKiAoMzQgLyAyMSArIG4gKiAoOCAvIDUgKyBuICogKC0xMjY4NiAvIDI4MzUpKSkpO1xuXG5cdCAgbnAgPSBucCAqIG47XG5cdCAgdGhpcy5jZ2JbM10gPSBucCAqICg0Mjc5IC8gNjMwICsgbiAqICgtMzMyIC8gMzUgKyBuICogKC0zOTk1NzIgLyAxNDE3NSkpKTtcblx0ICB0aGlzLmNiZ1szXSA9IG5wICogKDEyMzcgLyA2MzAgKyBuICogKC0xMiAvIDUgKyBuICogKCAtMjQ4MzIgLyAxNDE3NSkpKTtcblxuXHQgIG5wID0gbnAgKiBuO1xuXHQgIHRoaXMuY2diWzRdID0gbnAgKiAoNDE3NCAvIDMxNSArIG4gKiAoLTE0NDgzOCAvIDYyMzcpKTtcblx0ICB0aGlzLmNiZ1s0XSA9IG5wICogKC03MzQgLyAzMTUgKyBuICogKDEwOTU5OCAvIDMxMTg1KSk7XG5cblx0ICBucCA9IG5wICogbjtcblx0ICB0aGlzLmNnYls1XSA9IG5wICogKDYwMTY3NiAvIDIyMjc1KTtcblx0ICB0aGlzLmNiZ1s1XSA9IG5wICogKDQ0NDMzNyAvIDE1NTkyNSk7XG5cblx0ICBucCA9IE1hdGgucG93KG4sIDIpO1xuXHQgIHRoaXMuUW4gPSB0aGlzLmswIC8gKDEgKyBuKSAqICgxICsgbnAgKiAoMSAvIDQgKyBucCAqICgxIC8gNjQgKyBucCAvIDI1NikpKTtcblxuXHQgIHRoaXMudXRnWzBdID0gbiAqICgtMC41ICsgbiAqICggMiAvIDMgKyBuICogKC0zNyAvIDk2ICsgbiAqICggMSAvIDM2MCArIG4gKiAoODEgLyA1MTIgKyBuICogKC05NjE5OSAvIDYwNDgwMCkpKSkpKTtcblx0ICB0aGlzLmd0dVswXSA9IG4gKiAoMC41ICsgbiAqICgtMiAvIDMgKyBuICogKDUgLyAxNiArIG4gKiAoNDEgLyAxODAgKyBuICogKC0xMjcgLyAyODggKyBuICogKDc4OTEgLyAzNzgwMCkpKSkpKTtcblxuXHQgIHRoaXMudXRnWzFdID0gbnAgKiAoLTEgLyA0OCArIG4gKiAoLTEgLyAxNSArIG4gKiAoNDM3IC8gMTQ0MCArIG4gKiAoLTQ2IC8gMTA1ICsgbiAqICgxMTE4NzExIC8gMzg3MDcyMCkpKSkpO1xuXHQgIHRoaXMuZ3R1WzFdID0gbnAgKiAoMTMgLyA0OCArIG4gKiAoLTMgLyA1ICsgbiAqICg1NTcgLyAxNDQwICsgbiAqICgyODEgLyA2MzAgKyBuICogKC0xOTgzNDMzIC8gMTkzNTM2MCkpKSkpO1xuXG5cdCAgbnAgPSBucCAqIG47XG5cdCAgdGhpcy51dGdbMl0gPSBucCAqICgtMTcgLyA0ODAgKyBuICogKDM3IC8gODQwICsgbiAqICgyMDkgLyA0NDgwICsgbiAqICgtNTU2OSAvIDkwNzIwICkpKSk7XG5cdCAgdGhpcy5ndHVbMl0gPSBucCAqICg2MSAvIDI0MCArIG4gKiAoLTEwMyAvIDE0MCArIG4gKiAoMTUwNjEgLyAyNjg4MCArIG4gKiAoMTY3NjAzIC8gMTgxNDQwKSkpKTtcblxuXHQgIG5wID0gbnAgKiBuO1xuXHQgIHRoaXMudXRnWzNdID0gbnAgKiAoLTQzOTcgLyAxNjEyODAgKyBuICogKDExIC8gNTA0ICsgbiAqICg4MzAyNTEgLyA3MjU3NjAwKSkpO1xuXHQgIHRoaXMuZ3R1WzNdID0gbnAgKiAoNDk1NjEgLyAxNjEyODAgKyBuICogKC0xNzkgLyAxNjggKyBuICogKDY2MDE2NjEgLyA3MjU3NjAwKSkpO1xuXG5cdCAgbnAgPSBucCAqIG47XG5cdCAgdGhpcy51dGdbNF0gPSBucCAqICgtNDU4MyAvIDE2MTI4MCArIG4gKiAoMTA4ODQ3IC8gMzk5MTY4MCkpO1xuXHQgIHRoaXMuZ3R1WzRdID0gbnAgKiAoMzQ3MjkgLyA4MDY0MCArIG4gKiAoLTM0MTg4ODkgLyAxOTk1ODQwKSk7XG5cblx0ICBucCA9IG5wICogbjtcblx0ICB0aGlzLnV0Z1s1XSA9IG5wICogKC0yMDY0ODY5MyAvIDYzODY2ODgwMCk7XG5cdCAgdGhpcy5ndHVbNV0gPSBucCAqICgyMTIzNzg5NDEgLyAzMTkzMzQ0MDApO1xuXG5cdCAgdmFyIFogPSBnYXRnKHRoaXMuY2JnLCB0aGlzLmxhdDApO1xuXHQgIHRoaXMuWmIgPSAtdGhpcy5RbiAqIChaICsgY2xlbnModGhpcy5ndHUsIDIgKiBaKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3J3YXJkJDMocCkge1xuXHQgIHZhciBDZSA9IGFkanVzdF9sb24ocC54IC0gdGhpcy5sb25nMCk7XG5cdCAgdmFyIENuID0gcC55O1xuXG5cdCAgQ24gPSBnYXRnKHRoaXMuY2JnLCBDbik7XG5cdCAgdmFyIHNpbl9DbiA9IE1hdGguc2luKENuKTtcblx0ICB2YXIgY29zX0NuID0gTWF0aC5jb3MoQ24pO1xuXHQgIHZhciBzaW5fQ2UgPSBNYXRoLnNpbihDZSk7XG5cdCAgdmFyIGNvc19DZSA9IE1hdGguY29zKENlKTtcblxuXHQgIENuID0gTWF0aC5hdGFuMihzaW5fQ24sIGNvc19DZSAqIGNvc19Dbik7XG5cdCAgQ2UgPSBNYXRoLmF0YW4yKHNpbl9DZSAqIGNvc19DbiwgaHlwb3Qoc2luX0NuLCBjb3NfQ24gKiBjb3NfQ2UpKTtcblx0ICBDZSA9IGFzaW5oeShNYXRoLnRhbihDZSkpO1xuXG5cdCAgdmFyIHRtcCA9IGNsZW5zX2NtcGx4KHRoaXMuZ3R1LCAyICogQ24sIDIgKiBDZSk7XG5cblx0ICBDbiA9IENuICsgdG1wWzBdO1xuXHQgIENlID0gQ2UgKyB0bXBbMV07XG5cblx0ICB2YXIgeDtcblx0ICB2YXIgeTtcblxuXHQgIGlmIChNYXRoLmFicyhDZSkgPD0gMi42MjMzOTUxNjI3NzgpIHtcblx0ICAgIHggPSB0aGlzLmEgKiAodGhpcy5RbiAqIENlKSArIHRoaXMueDA7XG5cdCAgICB5ID0gdGhpcy5hICogKHRoaXMuUW4gKiBDbiArIHRoaXMuWmIpICsgdGhpcy55MDtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICB4ID0gSW5maW5pdHk7XG5cdCAgICB5ID0gSW5maW5pdHk7XG5cdCAgfVxuXG5cdCAgcC54ID0geDtcblx0ICBwLnkgPSB5O1xuXG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHRmdW5jdGlvbiBpbnZlcnNlJDMocCkge1xuXHQgIHZhciBDZSA9IChwLnggLSB0aGlzLngwKSAqICgxIC8gdGhpcy5hKTtcblx0ICB2YXIgQ24gPSAocC55IC0gdGhpcy55MCkgKiAoMSAvIHRoaXMuYSk7XG5cblx0ICBDbiA9IChDbiAtIHRoaXMuWmIpIC8gdGhpcy5Rbjtcblx0ICBDZSA9IENlIC8gdGhpcy5RbjtcblxuXHQgIHZhciBsb247XG5cdCAgdmFyIGxhdDtcblxuXHQgIGlmIChNYXRoLmFicyhDZSkgPD0gMi42MjMzOTUxNjI3NzgpIHtcblx0ICAgIHZhciB0bXAgPSBjbGVuc19jbXBseCh0aGlzLnV0ZywgMiAqIENuLCAyICogQ2UpO1xuXG5cdCAgICBDbiA9IENuICsgdG1wWzBdO1xuXHQgICAgQ2UgPSBDZSArIHRtcFsxXTtcblx0ICAgIENlID0gTWF0aC5hdGFuKHNpbmgoQ2UpKTtcblxuXHQgICAgdmFyIHNpbl9DbiA9IE1hdGguc2luKENuKTtcblx0ICAgIHZhciBjb3NfQ24gPSBNYXRoLmNvcyhDbik7XG5cdCAgICB2YXIgc2luX0NlID0gTWF0aC5zaW4oQ2UpO1xuXHQgICAgdmFyIGNvc19DZSA9IE1hdGguY29zKENlKTtcblxuXHQgICAgQ24gPSBNYXRoLmF0YW4yKHNpbl9DbiAqIGNvc19DZSwgaHlwb3Qoc2luX0NlLCBjb3NfQ2UgKiBjb3NfQ24pKTtcblx0ICAgIENlID0gTWF0aC5hdGFuMihzaW5fQ2UsIGNvc19DZSAqIGNvc19Dbik7XG5cblx0ICAgIGxvbiA9IGFkanVzdF9sb24oQ2UgKyB0aGlzLmxvbmcwKTtcblx0ICAgIGxhdCA9IGdhdGcodGhpcy5jZ2IsIENuKTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBsb24gPSBJbmZpbml0eTtcblx0ICAgIGxhdCA9IEluZmluaXR5O1xuXHQgIH1cblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdHZhciBuYW1lcyQ0ID0gW1wiRXh0ZW5kZWRfVHJhbnN2ZXJzZV9NZXJjYXRvclwiLCBcIkV4dGVuZGVkIFRyYW5zdmVyc2UgTWVyY2F0b3JcIiwgXCJldG1lcmNcIl07XG5cdHZhciBldG1lcmMgPSB7XG5cdCAgaW5pdDogaW5pdCQzLFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMyxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDMsXG5cdCAgbmFtZXM6IG5hbWVzJDRcblx0fTtcblxuXHR2YXIgYWRqdXN0X3pvbmUgPSBmdW5jdGlvbih6b25lLCBsb24pIHtcblx0ICBpZiAoem9uZSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICB6b25lID0gTWF0aC5mbG9vcigoYWRqdXN0X2xvbihsb24pICsgTWF0aC5QSSkgKiAzMCAvIE1hdGguUEkpICsgMTtcblxuXHQgICAgaWYgKHpvbmUgPCAwKSB7XG5cdCAgICAgIHJldHVybiAwO1xuXHQgICAgfSBlbHNlIGlmICh6b25lID4gNjApIHtcblx0ICAgICAgcmV0dXJuIDYwO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gem9uZTtcblx0fTtcblxuXHR2YXIgZGVwZW5kc09uID0gJ2V0bWVyYyc7XG5cdGZ1bmN0aW9uIGluaXQkNCgpIHtcblx0ICB2YXIgem9uZSA9IGFkanVzdF96b25lKHRoaXMuem9uZSwgdGhpcy5sb25nMCk7XG5cdCAgaWYgKHpvbmUgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIHV0bSB6b25lJyk7XG5cdCAgfVxuXHQgIHRoaXMubGF0MCA9IDA7XG5cdCAgdGhpcy5sb25nMCA9ICAoKDYgKiBNYXRoLmFicyh6b25lKSkgLSAxODMpICogRDJSO1xuXHQgIHRoaXMueDAgPSA1MDAwMDA7XG5cdCAgdGhpcy55MCA9IHRoaXMudXRtU291dGggPyAxMDAwMDAwMCA6IDA7XG5cdCAgdGhpcy5rMCA9IDAuOTk5NjtcblxuXHQgIGV0bWVyYy5pbml0LmFwcGx5KHRoaXMpO1xuXHQgIHRoaXMuZm9yd2FyZCA9IGV0bWVyYy5mb3J3YXJkO1xuXHQgIHRoaXMuaW52ZXJzZSA9IGV0bWVyYy5pbnZlcnNlO1xuXHR9XG5cblx0dmFyIG5hbWVzJDUgPSBbXCJVbml2ZXJzYWwgVHJhbnN2ZXJzZSBNZXJjYXRvciBTeXN0ZW1cIiwgXCJ1dG1cIl07XG5cdHZhciB1dG0gPSB7XG5cdCAgaW5pdDogaW5pdCQ0LFxuXHQgIG5hbWVzOiBuYW1lcyQ1LFxuXHQgIGRlcGVuZHNPbjogZGVwZW5kc09uXG5cdH07XG5cblx0dmFyIHNyYXQgPSBmdW5jdGlvbihlc2lucCwgZXhwKSB7XG5cdCAgcmV0dXJuIChNYXRoLnBvdygoMSAtIGVzaW5wKSAvICgxICsgZXNpbnApLCBleHApKTtcblx0fTtcblxuXHR2YXIgTUFYX0lURVIkMSA9IDIwO1xuXHRmdW5jdGlvbiBpbml0JDYoKSB7XG5cdCAgdmFyIHNwaGkgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuXHQgIHZhciBjcGhpID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcblx0ICBjcGhpICo9IGNwaGk7XG5cdCAgdGhpcy5yYyA9IE1hdGguc3FydCgxIC0gdGhpcy5lcykgLyAoMSAtIHRoaXMuZXMgKiBzcGhpICogc3BoaSk7XG5cdCAgdGhpcy5DID0gTWF0aC5zcXJ0KDEgKyB0aGlzLmVzICogY3BoaSAqIGNwaGkgLyAoMSAtIHRoaXMuZXMpKTtcblx0ICB0aGlzLnBoaWMwID0gTWF0aC5hc2luKHNwaGkgLyB0aGlzLkMpO1xuXHQgIHRoaXMucmF0ZXhwID0gMC41ICogdGhpcy5DICogdGhpcy5lO1xuXHQgIHRoaXMuSyA9IE1hdGgudGFuKDAuNSAqIHRoaXMucGhpYzAgKyBGT1JUUEkpIC8gKE1hdGgucG93KE1hdGgudGFuKDAuNSAqIHRoaXMubGF0MCArIEZPUlRQSSksIHRoaXMuQykgKiBzcmF0KHRoaXMuZSAqIHNwaGksIHRoaXMucmF0ZXhwKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3J3YXJkJDUocCkge1xuXHQgIHZhciBsb24gPSBwLng7XG5cdCAgdmFyIGxhdCA9IHAueTtcblxuXHQgIHAueSA9IDIgKiBNYXRoLmF0YW4odGhpcy5LICogTWF0aC5wb3coTWF0aC50YW4oMC41ICogbGF0ICsgRk9SVFBJKSwgdGhpcy5DKSAqIHNyYXQodGhpcy5lICogTWF0aC5zaW4obGF0KSwgdGhpcy5yYXRleHApKSAtIEhBTEZfUEk7XG5cdCAgcC54ID0gdGhpcy5DICogbG9uO1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW52ZXJzZSQ1KHApIHtcblx0ICB2YXIgREVMX1RPTCA9IDFlLTE0O1xuXHQgIHZhciBsb24gPSBwLnggLyB0aGlzLkM7XG5cdCAgdmFyIGxhdCA9IHAueTtcblx0ICB2YXIgbnVtID0gTWF0aC5wb3coTWF0aC50YW4oMC41ICogbGF0ICsgRk9SVFBJKSAvIHRoaXMuSywgMSAvIHRoaXMuQyk7XG5cdCAgZm9yICh2YXIgaSA9IE1BWF9JVEVSJDE7IGkgPiAwOyAtLWkpIHtcblx0ICAgIGxhdCA9IDIgKiBNYXRoLmF0YW4obnVtICogc3JhdCh0aGlzLmUgKiBNYXRoLnNpbihwLnkpLCAtIDAuNSAqIHRoaXMuZSkpIC0gSEFMRl9QSTtcblx0ICAgIGlmIChNYXRoLmFicyhsYXQgLSBwLnkpIDwgREVMX1RPTCkge1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICAgIHAueSA9IGxhdDtcblx0ICB9XG5cdCAgLyogY29udmVyZ2VuY2UgZmFpbGVkICovXG5cdCAgaWYgKCFpKSB7XG5cdCAgICByZXR1cm4gbnVsbDtcblx0ICB9XG5cdCAgcC54ID0gbG9uO1xuXHQgIHAueSA9IGxhdDtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdHZhciBuYW1lcyQ3ID0gW1wiZ2F1c3NcIl07XG5cdHZhciBnYXVzcyA9IHtcblx0ICBpbml0OiBpbml0JDYsXG5cdCAgZm9yd2FyZDogZm9yd2FyZCQ1LFxuXHQgIGludmVyc2U6IGludmVyc2UkNSxcblx0ICBuYW1lczogbmFtZXMkN1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQkNSgpIHtcblx0ICBnYXVzcy5pbml0LmFwcGx5KHRoaXMpO1xuXHQgIGlmICghdGhpcy5yYykge1xuXHQgICAgcmV0dXJuO1xuXHQgIH1cblx0ICB0aGlzLnNpbmMwID0gTWF0aC5zaW4odGhpcy5waGljMCk7XG5cdCAgdGhpcy5jb3NjMCA9IE1hdGguY29zKHRoaXMucGhpYzApO1xuXHQgIHRoaXMuUjIgPSAyICogdGhpcy5yYztcblx0ICBpZiAoIXRoaXMudGl0bGUpIHtcblx0ICAgIHRoaXMudGl0bGUgPSBcIk9ibGlxdWUgU3RlcmVvZ3JhcGhpYyBBbHRlcm5hdGl2ZVwiO1xuXHQgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGZvcndhcmQkNChwKSB7XG5cdCAgdmFyIHNpbmMsIGNvc2MsIGNvc2wsIGs7XG5cdCAgcC54ID0gYWRqdXN0X2xvbihwLnggLSB0aGlzLmxvbmcwKTtcblx0ICBnYXVzcy5mb3J3YXJkLmFwcGx5KHRoaXMsIFtwXSk7XG5cdCAgc2luYyA9IE1hdGguc2luKHAueSk7XG5cdCAgY29zYyA9IE1hdGguY29zKHAueSk7XG5cdCAgY29zbCA9IE1hdGguY29zKHAueCk7XG5cdCAgayA9IHRoaXMuazAgKiB0aGlzLlIyIC8gKDEgKyB0aGlzLnNpbmMwICogc2luYyArIHRoaXMuY29zYzAgKiBjb3NjICogY29zbCk7XG5cdCAgcC54ID0gayAqIGNvc2MgKiBNYXRoLnNpbihwLngpO1xuXHQgIHAueSA9IGsgKiAodGhpcy5jb3NjMCAqIHNpbmMgLSB0aGlzLnNpbmMwICogY29zYyAqIGNvc2wpO1xuXHQgIHAueCA9IHRoaXMuYSAqIHAueCArIHRoaXMueDA7XG5cdCAgcC55ID0gdGhpcy5hICogcC55ICsgdGhpcy55MDtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdGZ1bmN0aW9uIGludmVyc2UkNChwKSB7XG5cdCAgdmFyIHNpbmMsIGNvc2MsIGxvbiwgbGF0LCByaG87XG5cdCAgcC54ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5hO1xuXHQgIHAueSA9IChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuYTtcblxuXHQgIHAueCAvPSB0aGlzLmswO1xuXHQgIHAueSAvPSB0aGlzLmswO1xuXHQgIGlmICgocmhvID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSkpKSB7XG5cdCAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKHJobywgdGhpcy5SMik7XG5cdCAgICBzaW5jID0gTWF0aC5zaW4oYyk7XG5cdCAgICBjb3NjID0gTWF0aC5jb3MoYyk7XG5cdCAgICBsYXQgPSBNYXRoLmFzaW4oY29zYyAqIHRoaXMuc2luYzAgKyBwLnkgKiBzaW5jICogdGhpcy5jb3NjMCAvIHJobyk7XG5cdCAgICBsb24gPSBNYXRoLmF0YW4yKHAueCAqIHNpbmMsIHJobyAqIHRoaXMuY29zYzAgKiBjb3NjIC0gcC55ICogdGhpcy5zaW5jMCAqIHNpbmMpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGxhdCA9IHRoaXMucGhpYzA7XG5cdCAgICBsb24gPSAwO1xuXHQgIH1cblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgZ2F1c3MuaW52ZXJzZS5hcHBseSh0aGlzLCBbcF0pO1xuXHQgIHAueCA9IGFkanVzdF9sb24ocC54ICsgdGhpcy5sb25nMCk7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkNiA9IFtcIlN0ZXJlb2dyYXBoaWNfTm9ydGhfUG9sZVwiLCBcIk9ibGlxdWVfU3RlcmVvZ3JhcGhpY1wiLCBcIlBvbGFyX1N0ZXJlb2dyYXBoaWNcIiwgXCJzdGVyZWFcIixcIk9ibGlxdWUgU3RlcmVvZ3JhcGhpYyBBbHRlcm5hdGl2ZVwiLFwiRG91YmxlX1N0ZXJlb2dyYXBoaWNcIl07XG5cdHZhciBzdGVyZWEgPSB7XG5cdCAgaW5pdDogaW5pdCQ1LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkNCxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDQsXG5cdCAgbmFtZXM6IG5hbWVzJDZcblx0fTtcblxuXHRmdW5jdGlvbiBzc2ZuXyhwaGl0LCBzaW5waGksIGVjY2VuKSB7XG5cdCAgc2lucGhpICo9IGVjY2VuO1xuXHQgIHJldHVybiAoTWF0aC50YW4oMC41ICogKEhBTEZfUEkgKyBwaGl0KSkgKiBNYXRoLnBvdygoMSAtIHNpbnBoaSkgLyAoMSArIHNpbnBoaSksIDAuNSAqIGVjY2VuKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0JDcoKSB7XG5cdCAgdGhpcy5jb3NsYXQwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcblx0ICB0aGlzLnNpbmxhdDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuXHQgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgaWYgKHRoaXMuazAgPT09IDEgJiYgIWlzTmFOKHRoaXMubGF0X3RzKSAmJiBNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOKSB7XG5cdCAgICAgIHRoaXMuazAgPSAwLjUgKiAoMSArIHNpZ24odGhpcy5sYXQwKSAqIE1hdGguc2luKHRoaXMubGF0X3RzKSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcblx0ICAgICAgaWYgKHRoaXMubGF0MCA+IDApIHtcblx0ICAgICAgICAvL05vcnRoIHBvbGVcblx0ICAgICAgICAvL3RyYWNlKCdzdGVyZTpub3J0aCBwb2xlJyk7XG5cdCAgICAgICAgdGhpcy5jb24gPSAxO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2Uge1xuXHQgICAgICAgIC8vU291dGggcG9sZVxuXHQgICAgICAgIC8vdHJhY2UoJ3N0ZXJlOnNvdXRoIHBvbGUnKTtcblx0ICAgICAgICB0aGlzLmNvbiA9IC0xO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICB0aGlzLmNvbnMgPSBNYXRoLnNxcnQoTWF0aC5wb3coMSArIHRoaXMuZSwgMSArIHRoaXMuZSkgKiBNYXRoLnBvdygxIC0gdGhpcy5lLCAxIC0gdGhpcy5lKSk7XG5cdCAgICBpZiAodGhpcy5rMCA9PT0gMSAmJiAhaXNOYU4odGhpcy5sYXRfdHMpICYmIE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcblx0ICAgICAgdGhpcy5rMCA9IDAuNSAqIHRoaXMuY29ucyAqIG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpIC8gdHNmbnoodGhpcy5lLCB0aGlzLmNvbiAqIHRoaXMubGF0X3RzLCB0aGlzLmNvbiAqIE1hdGguc2luKHRoaXMubGF0X3RzKSk7XG5cdCAgICB9XG5cdCAgICB0aGlzLm1zMSA9IG1zZm56KHRoaXMuZSwgdGhpcy5zaW5sYXQwLCB0aGlzLmNvc2xhdDApO1xuXHQgICAgdGhpcy5YMCA9IDIgKiBNYXRoLmF0YW4odGhpcy5zc2ZuXyh0aGlzLmxhdDAsIHRoaXMuc2lubGF0MCwgdGhpcy5lKSkgLSBIQUxGX1BJO1xuXHQgICAgdGhpcy5jb3NYMCA9IE1hdGguY29zKHRoaXMuWDApO1xuXHQgICAgdGhpcy5zaW5YMCA9IE1hdGguc2luKHRoaXMuWDApO1xuXHQgIH1cblx0fVxuXG5cdC8vIFN0ZXJlb2dyYXBoaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5cdGZ1bmN0aW9uIGZvcndhcmQkNihwKSB7XG5cdCAgdmFyIGxvbiA9IHAueDtcblx0ICB2YXIgbGF0ID0gcC55O1xuXHQgIHZhciBzaW5sYXQgPSBNYXRoLnNpbihsYXQpO1xuXHQgIHZhciBjb3NsYXQgPSBNYXRoLmNvcyhsYXQpO1xuXHQgIHZhciBBLCBYLCBzaW5YLCBjb3NYLCB0cywgcmg7XG5cdCAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXG5cdCAgaWYgKE1hdGguYWJzKE1hdGguYWJzKGxvbiAtIHRoaXMubG9uZzApIC0gTWF0aC5QSSkgPD0gRVBTTE4gJiYgTWF0aC5hYnMobGF0ICsgdGhpcy5sYXQwKSA8PSBFUFNMTikge1xuXHQgICAgLy9jYXNlIG9mIHRoZSBvcmlnaW5lIHBvaW50XG5cdCAgICAvL3RyYWNlKCdzdGVyZTp0aGlzIGlzIHRoZSBvcmlnaW4gcG9pbnQnKTtcblx0ICAgIHAueCA9IE5hTjtcblx0ICAgIHAueSA9IE5hTjtcblx0ICAgIHJldHVybiBwO1xuXHQgIH1cblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIC8vdHJhY2UoJ3N0ZXJlOnNwaGVyZSBjYXNlJyk7XG5cdCAgICBBID0gMiAqIHRoaXMuazAgLyAoMSArIHRoaXMuc2lubGF0MCAqIHNpbmxhdCArIHRoaXMuY29zbGF0MCAqIGNvc2xhdCAqIE1hdGguY29zKGRsb24pKTtcblx0ICAgIHAueCA9IHRoaXMuYSAqIEEgKiBjb3NsYXQgKiBNYXRoLnNpbihkbG9uKSArIHRoaXMueDA7XG5cdCAgICBwLnkgPSB0aGlzLmEgKiBBICogKHRoaXMuY29zbGF0MCAqIHNpbmxhdCAtIHRoaXMuc2lubGF0MCAqIGNvc2xhdCAqIE1hdGguY29zKGRsb24pKSArIHRoaXMueTA7XG5cdCAgICByZXR1cm4gcDtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBYID0gMiAqIE1hdGguYXRhbih0aGlzLnNzZm5fKGxhdCwgc2lubGF0LCB0aGlzLmUpKSAtIEhBTEZfUEk7XG5cdCAgICBjb3NYID0gTWF0aC5jb3MoWCk7XG5cdCAgICBzaW5YID0gTWF0aC5zaW4oWCk7XG5cdCAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTikge1xuXHQgICAgICB0cyA9IHRzZm56KHRoaXMuZSwgbGF0ICogdGhpcy5jb24sIHRoaXMuY29uICogc2lubGF0KTtcblx0ICAgICAgcmggPSAyICogdGhpcy5hICogdGhpcy5rMCAqIHRzIC8gdGhpcy5jb25zO1xuXHQgICAgICBwLnggPSB0aGlzLngwICsgcmggKiBNYXRoLnNpbihsb24gLSB0aGlzLmxvbmcwKTtcblx0ICAgICAgcC55ID0gdGhpcy55MCAtIHRoaXMuY29uICogcmggKiBNYXRoLmNvcyhsb24gLSB0aGlzLmxvbmcwKTtcblx0ICAgICAgLy90cmFjZShwLnRvU3RyaW5nKCkpO1xuXHQgICAgICByZXR1cm4gcDtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2lubGF0MCkgPCBFUFNMTikge1xuXHQgICAgICAvL0VxXG5cdCAgICAgIC8vdHJhY2UoJ3N0ZXJlOmVxdWF0ZXVyJyk7XG5cdCAgICAgIEEgPSAyICogdGhpcy5hICogdGhpcy5rMCAvICgxICsgY29zWCAqIE1hdGguY29zKGRsb24pKTtcblx0ICAgICAgcC55ID0gQSAqIHNpblg7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgLy9vdGhlciBjYXNlXG5cdCAgICAgIC8vdHJhY2UoJ3N0ZXJlOm5vcm1hbCBjYXNlJyk7XG5cdCAgICAgIEEgPSAyICogdGhpcy5hICogdGhpcy5rMCAqIHRoaXMubXMxIC8gKHRoaXMuY29zWDAgKiAoMSArIHRoaXMuc2luWDAgKiBzaW5YICsgdGhpcy5jb3NYMCAqIGNvc1ggKiBNYXRoLmNvcyhkbG9uKSkpO1xuXHQgICAgICBwLnkgPSBBICogKHRoaXMuY29zWDAgKiBzaW5YIC0gdGhpcy5zaW5YMCAqIGNvc1ggKiBNYXRoLmNvcyhkbG9uKSkgKyB0aGlzLnkwO1xuXHQgICAgfVxuXHQgICAgcC54ID0gQSAqIGNvc1ggKiBNYXRoLnNpbihkbG9uKSArIHRoaXMueDA7XG5cdCAgfVxuXHQgIC8vdHJhY2UocC50b1N0cmluZygpKTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdC8vKiBTdGVyZW9ncmFwaGljIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuXHRmdW5jdGlvbiBpbnZlcnNlJDYocCkge1xuXHQgIHAueCAtPSB0aGlzLngwO1xuXHQgIHAueSAtPSB0aGlzLnkwO1xuXHQgIHZhciBsb24sIGxhdCwgdHMsIGNlLCBDaGk7XG5cdCAgdmFyIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgaWYgKHRoaXMuc3BoZXJlKSB7XG5cdCAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4ocmggLyAoMiAqIHRoaXMuYSAqIHRoaXMuazApKTtcblx0ICAgIGxvbiA9IHRoaXMubG9uZzA7XG5cdCAgICBsYXQgPSB0aGlzLmxhdDA7XG5cdCAgICBpZiAocmggPD0gRVBTTE4pIHtcblx0ICAgICAgcC54ID0gbG9uO1xuXHQgICAgICBwLnkgPSBsYXQ7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgICAgbGF0ID0gTWF0aC5hc2luKE1hdGguY29zKGMpICogdGhpcy5zaW5sYXQwICsgcC55ICogTWF0aC5zaW4oYykgKiB0aGlzLmNvc2xhdDAgLyByaCk7XG5cdCAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8IEVQU0xOKSB7XG5cdCAgICAgIGlmICh0aGlzLmxhdDAgPiAwKSB7XG5cdCAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0gMSAqIHAueSkpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2Uge1xuXHQgICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCBwLnkpKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogTWF0aC5zaW4oYyksIHJoICogdGhpcy5jb3NsYXQwICogTWF0aC5jb3MoYykgLSBwLnkgKiB0aGlzLnNpbmxhdDAgKiBNYXRoLnNpbihjKSkpO1xuXHQgICAgfVxuXHQgICAgcC54ID0gbG9uO1xuXHQgICAgcC55ID0gbGF0O1xuXHQgICAgcmV0dXJuIHA7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcblx0ICAgICAgaWYgKHJoIDw9IEVQU0xOKSB7XG5cdCAgICAgICAgbGF0ID0gdGhpcy5sYXQwO1xuXHQgICAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG5cdCAgICAgICAgcC54ID0gbG9uO1xuXHQgICAgICAgIHAueSA9IGxhdDtcblx0ICAgICAgICAvL3RyYWNlKHAudG9TdHJpbmcoKSk7XG5cdCAgICAgICAgcmV0dXJuIHA7XG5cdCAgICAgIH1cblx0ICAgICAgcC54ICo9IHRoaXMuY29uO1xuXHQgICAgICBwLnkgKj0gdGhpcy5jb247XG5cdCAgICAgIHRzID0gcmggKiB0aGlzLmNvbnMgLyAoMiAqIHRoaXMuYSAqIHRoaXMuazApO1xuXHQgICAgICBsYXQgPSB0aGlzLmNvbiAqIHBoaTJ6KHRoaXMuZSwgdHMpO1xuXHQgICAgICBsb24gPSB0aGlzLmNvbiAqIGFkanVzdF9sb24odGhpcy5jb24gKiB0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0gMSAqIHAueSkpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIGNlID0gMiAqIE1hdGguYXRhbihyaCAqIHRoaXMuY29zWDAgLyAoMiAqIHRoaXMuYSAqIHRoaXMuazAgKiB0aGlzLm1zMSkpO1xuXHQgICAgICBsb24gPSB0aGlzLmxvbmcwO1xuXHQgICAgICBpZiAocmggPD0gRVBTTE4pIHtcblx0ICAgICAgICBDaGkgPSB0aGlzLlgwO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2Uge1xuXHQgICAgICAgIENoaSA9IE1hdGguYXNpbihNYXRoLmNvcyhjZSkgKiB0aGlzLnNpblgwICsgcC55ICogTWF0aC5zaW4oY2UpICogdGhpcy5jb3NYMCAvIHJoKTtcblx0ICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCAqIE1hdGguc2luKGNlKSwgcmggKiB0aGlzLmNvc1gwICogTWF0aC5jb3MoY2UpIC0gcC55ICogdGhpcy5zaW5YMCAqIE1hdGguc2luKGNlKSkpO1xuXHQgICAgICB9XG5cdCAgICAgIGxhdCA9IC0xICogcGhpMnoodGhpcy5lLCBNYXRoLnRhbigwLjUgKiAoSEFMRl9QSSArIENoaSkpKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcC54ID0gbG9uO1xuXHQgIHAueSA9IGxhdDtcblxuXHQgIC8vdHJhY2UocC50b1N0cmluZygpKTtcblx0ICByZXR1cm4gcDtcblxuXHR9XG5cblx0dmFyIG5hbWVzJDggPSBbXCJzdGVyZVwiLCBcIlN0ZXJlb2dyYXBoaWNfU291dGhfUG9sZVwiLCBcIlBvbGFyIFN0ZXJlb2dyYXBoaWMgKHZhcmlhbnQgQilcIl07XG5cdHZhciBzdGVyZSA9IHtcblx0ICBpbml0OiBpbml0JDcsXG5cdCAgZm9yd2FyZDogZm9yd2FyZCQ2LFxuXHQgIGludmVyc2U6IGludmVyc2UkNixcblx0ICBuYW1lczogbmFtZXMkOCxcblx0ICBzc2ZuXzogc3Nmbl9cblx0fTtcblxuXHQvKlxuXHQgIHJlZmVyZW5jZXM6XG5cdCAgICBGb3JtdWxlcyBldCBjb25zdGFudGVzIHBvdXIgbGUgQ2FsY3VsIHBvdXIgbGFcblx0ICAgIHByb2plY3Rpb24gY3lsaW5kcmlxdWUgY29uZm9ybWUgw6AgYXhlIG9ibGlxdWUgZXQgcG91ciBsYSB0cmFuc2Zvcm1hdGlvbiBlbnRyZVxuXHQgICAgZGVzIHN5c3TDqG1lcyBkZSByw6lmw6lyZW5jZS5cblx0ICAgIGh0dHA6Ly93d3cuc3dpc3N0b3BvLmFkbWluLmNoL2ludGVybmV0L3N3aXNzdG9wby9mci9ob21lL3RvcGljcy9zdXJ2ZXkvc3lzL3JlZnN5cy9zd2l0emVybGFuZC5wYXJzeXNyZWxhdGVkMS4zMTIxNi5kb3dubG9hZExpc3QuNzcwMDQuRG93bmxvYWRGaWxlLnRtcC9zd2lzc3Byb2plY3Rpb25mci5wZGZcblx0ICAqL1xuXG5cdGZ1bmN0aW9uIGluaXQkOCgpIHtcblx0ICB2YXIgcGh5MCA9IHRoaXMubGF0MDtcblx0ICB0aGlzLmxhbWJkYTAgPSB0aGlzLmxvbmcwO1xuXHQgIHZhciBzaW5QaHkwID0gTWF0aC5zaW4ocGh5MCk7XG5cdCAgdmFyIHNlbWlNYWpvckF4aXMgPSB0aGlzLmE7XG5cdCAgdmFyIGludkYgPSB0aGlzLnJmO1xuXHQgIHZhciBmbGF0dGVuaW5nID0gMSAvIGludkY7XG5cdCAgdmFyIGUyID0gMiAqIGZsYXR0ZW5pbmcgLSBNYXRoLnBvdyhmbGF0dGVuaW5nLCAyKTtcblx0ICB2YXIgZSA9IHRoaXMuZSA9IE1hdGguc3FydChlMik7XG5cdCAgdGhpcy5SID0gdGhpcy5rMCAqIHNlbWlNYWpvckF4aXMgKiBNYXRoLnNxcnQoMSAtIGUyKSAvICgxIC0gZTIgKiBNYXRoLnBvdyhzaW5QaHkwLCAyKSk7XG5cdCAgdGhpcy5hbHBoYSA9IE1hdGguc3FydCgxICsgZTIgLyAoMSAtIGUyKSAqIE1hdGgucG93KE1hdGguY29zKHBoeTApLCA0KSk7XG5cdCAgdGhpcy5iMCA9IE1hdGguYXNpbihzaW5QaHkwIC8gdGhpcy5hbHBoYSk7XG5cdCAgdmFyIGsxID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyB0aGlzLmIwIC8gMikpO1xuXHQgIHZhciBrMiA9IE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgcGh5MCAvIDIpKTtcblx0ICB2YXIgazMgPSBNYXRoLmxvZygoMSArIGUgKiBzaW5QaHkwKSAvICgxIC0gZSAqIHNpblBoeTApKTtcblx0ICB0aGlzLksgPSBrMSAtIHRoaXMuYWxwaGEgKiBrMiArIHRoaXMuYWxwaGEgKiBlIC8gMiAqIGszO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9yd2FyZCQ3KHApIHtcblx0ICB2YXIgU2ExID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgLSBwLnkgLyAyKSk7XG5cdCAgdmFyIFNhMiA9IHRoaXMuZSAvIDIgKiBNYXRoLmxvZygoMSArIHRoaXMuZSAqIE1hdGguc2luKHAueSkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihwLnkpKSk7XG5cdCAgdmFyIFMgPSAtdGhpcy5hbHBoYSAqIChTYTEgKyBTYTIpICsgdGhpcy5LO1xuXG5cdCAgLy8gc3BoZXJpYyBsYXRpdHVkZVxuXHQgIHZhciBiID0gMiAqIChNYXRoLmF0YW4oTWF0aC5leHAoUykpIC0gTWF0aC5QSSAvIDQpO1xuXG5cdCAgLy8gc3BoZXJpYyBsb25naXR1ZGVcblx0ICB2YXIgSSA9IHRoaXMuYWxwaGEgKiAocC54IC0gdGhpcy5sYW1iZGEwKTtcblxuXHQgIC8vIHBzb2V1ZG8gZXF1YXRvcmlhbCByb3RhdGlvblxuXHQgIHZhciByb3RJID0gTWF0aC5hdGFuKE1hdGguc2luKEkpIC8gKE1hdGguc2luKHRoaXMuYjApICogTWF0aC50YW4oYikgKyBNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguY29zKEkpKSk7XG5cblx0ICB2YXIgcm90QiA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguc2luKGIpIC0gTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLmNvcyhiKSAqIE1hdGguY29zKEkpKTtcblxuXHQgIHAueSA9IHRoaXMuUiAvIDIgKiBNYXRoLmxvZygoMSArIE1hdGguc2luKHJvdEIpKSAvICgxIC0gTWF0aC5zaW4ocm90QikpKSArIHRoaXMueTA7XG5cdCAgcC54ID0gdGhpcy5SICogcm90SSArIHRoaXMueDA7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHRmdW5jdGlvbiBpbnZlcnNlJDcocCkge1xuXHQgIHZhciBZID0gcC54IC0gdGhpcy54MDtcblx0ICB2YXIgWCA9IHAueSAtIHRoaXMueTA7XG5cblx0ICB2YXIgcm90SSA9IFkgLyB0aGlzLlI7XG5cdCAgdmFyIHJvdEIgPSAyICogKE1hdGguYXRhbihNYXRoLmV4cChYIC8gdGhpcy5SKSkgLSBNYXRoLlBJIC8gNCk7XG5cblx0ICB2YXIgYiA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguc2luKHJvdEIpICsgTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLmNvcyhyb3RCKSAqIE1hdGguY29zKHJvdEkpKTtcblx0ICB2YXIgSSA9IE1hdGguYXRhbihNYXRoLnNpbihyb3RJKSAvIChNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguY29zKHJvdEkpIC0gTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLnRhbihyb3RCKSkpO1xuXG5cdCAgdmFyIGxhbWJkYSA9IHRoaXMubGFtYmRhMCArIEkgLyB0aGlzLmFscGhhO1xuXG5cdCAgdmFyIFMgPSAwO1xuXHQgIHZhciBwaHkgPSBiO1xuXHQgIHZhciBwcmV2UGh5ID0gLTEwMDA7XG5cdCAgdmFyIGl0ZXJhdGlvbiA9IDA7XG5cdCAgd2hpbGUgKE1hdGguYWJzKHBoeSAtIHByZXZQaHkpID4gMC4wMDAwMDAxKSB7XG5cdCAgICBpZiAoKytpdGVyYXRpb24gPiAyMCkge1xuXHQgICAgICAvLy4uLnJlcG9ydEVycm9yKFwib21lcmNGd2RJbmZpbml0eVwiKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXHQgICAgLy9TID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBwaHkgLyAyKSk7XG5cdCAgICBTID0gMSAvIHRoaXMuYWxwaGEgKiAoTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBiIC8gMikpIC0gdGhpcy5LKSArIHRoaXMuZSAqIE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgTWF0aC5hc2luKHRoaXMuZSAqIE1hdGguc2luKHBoeSkpIC8gMikpO1xuXHQgICAgcHJldlBoeSA9IHBoeTtcblx0ICAgIHBoeSA9IDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoUykpIC0gTWF0aC5QSSAvIDI7XG5cdCAgfVxuXG5cdCAgcC54ID0gbGFtYmRhO1xuXHQgIHAueSA9IHBoeTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdHZhciBuYW1lcyQ5ID0gW1wic29tZXJjXCJdO1xuXHR2YXIgc29tZXJjID0ge1xuXHQgIGluaXQ6IGluaXQkOCxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDcsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQ3LFxuXHQgIG5hbWVzOiBuYW1lcyQ5XG5cdH07XG5cblx0LyogSW5pdGlhbGl6ZSB0aGUgT2JsaXF1ZSBNZXJjYXRvciAgcHJvamVjdGlvblxuXHQgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gaW5pdCQ5KCkge1xuXHQgIHRoaXMubm9fb2ZmID0gdGhpcy5ub19vZmYgfHwgZmFsc2U7XG5cdCAgdGhpcy5ub19yb3QgPSB0aGlzLm5vX3JvdCB8fCBmYWxzZTtcblxuXHQgIGlmIChpc05hTih0aGlzLmswKSkge1xuXHQgICAgdGhpcy5rMCA9IDE7XG5cdCAgfVxuXHQgIHZhciBzaW5sYXQgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuXHQgIHZhciBjb3NsYXQgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xuXHQgIHZhciBjb24gPSB0aGlzLmUgKiBzaW5sYXQ7XG5cblx0ICB0aGlzLmJsID0gTWF0aC5zcXJ0KDEgKyB0aGlzLmVzIC8gKDEgLSB0aGlzLmVzKSAqIE1hdGgucG93KGNvc2xhdCwgNCkpO1xuXHQgIHRoaXMuYWwgPSB0aGlzLmEgKiB0aGlzLmJsICogdGhpcy5rMCAqIE1hdGguc3FydCgxIC0gdGhpcy5lcykgLyAoMSAtIGNvbiAqIGNvbik7XG5cdCAgdmFyIHQwID0gdHNmbnoodGhpcy5lLCB0aGlzLmxhdDAsIHNpbmxhdCk7XG5cdCAgdmFyIGRsID0gdGhpcy5ibCAvIGNvc2xhdCAqIE1hdGguc3FydCgoMSAtIHRoaXMuZXMpIC8gKDEgLSBjb24gKiBjb24pKTtcblx0ICBpZiAoZGwgKiBkbCA8IDEpIHtcblx0ICAgIGRsID0gMTtcblx0ICB9XG5cdCAgdmFyIGZsO1xuXHQgIHZhciBnbDtcblx0ICBpZiAoIWlzTmFOKHRoaXMubG9uZ2MpKSB7XG5cdCAgICAvL0NlbnRyYWwgcG9pbnQgYW5kIGF6aW11dGggbWV0aG9kXG5cblx0ICAgIGlmICh0aGlzLmxhdDAgPj0gMCkge1xuXHQgICAgICBmbCA9IGRsICsgTWF0aC5zcXJ0KGRsICogZGwgLSAxKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICBmbCA9IGRsIC0gTWF0aC5zcXJ0KGRsICogZGwgLSAxKTtcblx0ICAgIH1cblx0ICAgIHRoaXMuZWwgPSBmbCAqIE1hdGgucG93KHQwLCB0aGlzLmJsKTtcblx0ICAgIGdsID0gMC41ICogKGZsIC0gMSAvIGZsKTtcblx0ICAgIHRoaXMuZ2FtbWEwID0gTWF0aC5hc2luKE1hdGguc2luKHRoaXMuYWxwaGEpIC8gZGwpO1xuXHQgICAgdGhpcy5sb25nMCA9IHRoaXMubG9uZ2MgLSBNYXRoLmFzaW4oZ2wgKiBNYXRoLnRhbih0aGlzLmdhbW1hMCkpIC8gdGhpcy5ibDtcblxuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIC8vMiBwb2ludHMgbWV0aG9kXG5cdCAgICB2YXIgdDEgPSB0c2Zueih0aGlzLmUsIHRoaXMubGF0MSwgTWF0aC5zaW4odGhpcy5sYXQxKSk7XG5cdCAgICB2YXIgdDIgPSB0c2Zueih0aGlzLmUsIHRoaXMubGF0MiwgTWF0aC5zaW4odGhpcy5sYXQyKSk7XG5cdCAgICBpZiAodGhpcy5sYXQwID49IDApIHtcblx0ICAgICAgdGhpcy5lbCA9IChkbCArIE1hdGguc3FydChkbCAqIGRsIC0gMSkpICogTWF0aC5wb3codDAsIHRoaXMuYmwpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHRoaXMuZWwgPSAoZGwgLSBNYXRoLnNxcnQoZGwgKiBkbCAtIDEpKSAqIE1hdGgucG93KHQwLCB0aGlzLmJsKTtcblx0ICAgIH1cblx0ICAgIHZhciBobCA9IE1hdGgucG93KHQxLCB0aGlzLmJsKTtcblx0ICAgIHZhciBsbCA9IE1hdGgucG93KHQyLCB0aGlzLmJsKTtcblx0ICAgIGZsID0gdGhpcy5lbCAvIGhsO1xuXHQgICAgZ2wgPSAwLjUgKiAoZmwgLSAxIC8gZmwpO1xuXHQgICAgdmFyIGpsID0gKHRoaXMuZWwgKiB0aGlzLmVsIC0gbGwgKiBobCkgLyAodGhpcy5lbCAqIHRoaXMuZWwgKyBsbCAqIGhsKTtcblx0ICAgIHZhciBwbCA9IChsbCAtIGhsKSAvIChsbCArIGhsKTtcblx0ICAgIHZhciBkbG9uMTIgPSBhZGp1c3RfbG9uKHRoaXMubG9uZzEgLSB0aGlzLmxvbmcyKTtcblx0ICAgIHRoaXMubG9uZzAgPSAwLjUgKiAodGhpcy5sb25nMSArIHRoaXMubG9uZzIpIC0gTWF0aC5hdGFuKGpsICogTWF0aC50YW4oMC41ICogdGhpcy5ibCAqIChkbG9uMTIpKSAvIHBsKSAvIHRoaXMuYmw7XG5cdCAgICB0aGlzLmxvbmcwID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwKTtcblx0ICAgIHZhciBkbG9uMTAgPSBhZGp1c3RfbG9uKHRoaXMubG9uZzEgLSB0aGlzLmxvbmcwKTtcblx0ICAgIHRoaXMuZ2FtbWEwID0gTWF0aC5hdGFuKE1hdGguc2luKHRoaXMuYmwgKiAoZGxvbjEwKSkgLyBnbCk7XG5cdCAgICB0aGlzLmFscGhhID0gTWF0aC5hc2luKGRsICogTWF0aC5zaW4odGhpcy5nYW1tYTApKTtcblx0ICB9XG5cblx0ICBpZiAodGhpcy5ub19vZmYpIHtcblx0ICAgIHRoaXMudWMgPSAwO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGlmICh0aGlzLmxhdDAgPj0gMCkge1xuXHQgICAgICB0aGlzLnVjID0gdGhpcy5hbCAvIHRoaXMuYmwgKiBNYXRoLmF0YW4yKE1hdGguc3FydChkbCAqIGRsIC0gMSksIE1hdGguY29zKHRoaXMuYWxwaGEpKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICB0aGlzLnVjID0gLTEgKiB0aGlzLmFsIC8gdGhpcy5ibCAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGRsICogZGwgLSAxKSwgTWF0aC5jb3ModGhpcy5hbHBoYSkpO1xuXHQgICAgfVxuXHQgIH1cblxuXHR9XG5cblx0LyogT2JsaXF1ZSBNZXJjYXRvciBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDgocCkge1xuXHQgIHZhciBsb24gPSBwLng7XG5cdCAgdmFyIGxhdCA9IHAueTtcblx0ICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG5cdCAgdmFyIHVzLCB2cztcblx0ICB2YXIgY29uO1xuXHQgIGlmIChNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSkgPD0gRVBTTE4pIHtcblx0ICAgIGlmIChsYXQgPiAwKSB7XG5cdCAgICAgIGNvbiA9IC0xO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIGNvbiA9IDE7XG5cdCAgICB9XG5cdCAgICB2cyA9IHRoaXMuYWwgLyB0aGlzLmJsICogTWF0aC5sb2coTWF0aC50YW4oRk9SVFBJICsgY29uICogdGhpcy5nYW1tYTAgKiAwLjUpKTtcblx0ICAgIHVzID0gLTEgKiBjb24gKiBIQUxGX1BJICogdGhpcy5hbCAvIHRoaXMuYmw7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgdmFyIHQgPSB0c2Zueih0aGlzLmUsIGxhdCwgTWF0aC5zaW4obGF0KSk7XG5cdCAgICB2YXIgcWwgPSB0aGlzLmVsIC8gTWF0aC5wb3codCwgdGhpcy5ibCk7XG5cdCAgICB2YXIgc2wgPSAwLjUgKiAocWwgLSAxIC8gcWwpO1xuXHQgICAgdmFyIHRsID0gMC41ICogKHFsICsgMSAvIHFsKTtcblx0ICAgIHZhciB2bCA9IE1hdGguc2luKHRoaXMuYmwgKiAoZGxvbikpO1xuXHQgICAgdmFyIHVsID0gKHNsICogTWF0aC5zaW4odGhpcy5nYW1tYTApIC0gdmwgKiBNYXRoLmNvcyh0aGlzLmdhbW1hMCkpIC8gdGw7XG5cdCAgICBpZiAoTWF0aC5hYnMoTWF0aC5hYnModWwpIC0gMSkgPD0gRVBTTE4pIHtcblx0ICAgICAgdnMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgdnMgPSAwLjUgKiB0aGlzLmFsICogTWF0aC5sb2coKDEgLSB1bCkgLyAoMSArIHVsKSkgLyB0aGlzLmJsO1xuXHQgICAgfVxuXHQgICAgaWYgKE1hdGguYWJzKE1hdGguY29zKHRoaXMuYmwgKiAoZGxvbikpKSA8PSBFUFNMTikge1xuXHQgICAgICB1cyA9IHRoaXMuYWwgKiB0aGlzLmJsICogKGRsb24pO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHVzID0gdGhpcy5hbCAqIE1hdGguYXRhbjIoc2wgKiBNYXRoLmNvcyh0aGlzLmdhbW1hMCkgKyB2bCAqIE1hdGguc2luKHRoaXMuZ2FtbWEwKSwgTWF0aC5jb3ModGhpcy5ibCAqIGRsb24pKSAvIHRoaXMuYmw7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgaWYgKHRoaXMubm9fcm90KSB7XG5cdCAgICBwLnggPSB0aGlzLngwICsgdXM7XG5cdCAgICBwLnkgPSB0aGlzLnkwICsgdnM7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXG5cdCAgICB1cyAtPSB0aGlzLnVjO1xuXHQgICAgcC54ID0gdGhpcy54MCArIHZzICogTWF0aC5jb3ModGhpcy5hbHBoYSkgKyB1cyAqIE1hdGguc2luKHRoaXMuYWxwaGEpO1xuXHQgICAgcC55ID0gdGhpcy55MCArIHVzICogTWF0aC5jb3ModGhpcy5hbHBoYSkgLSB2cyAqIE1hdGguc2luKHRoaXMuYWxwaGEpO1xuXHQgIH1cblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdGZ1bmN0aW9uIGludmVyc2UkOChwKSB7XG5cdCAgdmFyIHVzLCB2cztcblx0ICBpZiAodGhpcy5ub19yb3QpIHtcblx0ICAgIHZzID0gcC55IC0gdGhpcy55MDtcblx0ICAgIHVzID0gcC54IC0gdGhpcy54MDtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICB2cyA9IChwLnggLSB0aGlzLngwKSAqIE1hdGguY29zKHRoaXMuYWxwaGEpIC0gKHAueSAtIHRoaXMueTApICogTWF0aC5zaW4odGhpcy5hbHBoYSk7XG5cdCAgICB1cyA9IChwLnkgLSB0aGlzLnkwKSAqIE1hdGguY29zKHRoaXMuYWxwaGEpICsgKHAueCAtIHRoaXMueDApICogTWF0aC5zaW4odGhpcy5hbHBoYSk7XG5cdCAgICB1cyArPSB0aGlzLnVjO1xuXHQgIH1cblx0ICB2YXIgcXAgPSBNYXRoLmV4cCgtMSAqIHRoaXMuYmwgKiB2cyAvIHRoaXMuYWwpO1xuXHQgIHZhciBzcCA9IDAuNSAqIChxcCAtIDEgLyBxcCk7XG5cdCAgdmFyIHRwID0gMC41ICogKHFwICsgMSAvIHFwKTtcblx0ICB2YXIgdnAgPSBNYXRoLnNpbih0aGlzLmJsICogdXMgLyB0aGlzLmFsKTtcblx0ICB2YXIgdXAgPSAodnAgKiBNYXRoLmNvcyh0aGlzLmdhbW1hMCkgKyBzcCAqIE1hdGguc2luKHRoaXMuZ2FtbWEwKSkgLyB0cDtcblx0ICB2YXIgdHMgPSBNYXRoLnBvdyh0aGlzLmVsIC8gTWF0aC5zcXJ0KCgxICsgdXApIC8gKDEgLSB1cCkpLCAxIC8gdGhpcy5ibCk7XG5cdCAgaWYgKE1hdGguYWJzKHVwIC0gMSkgPCBFUFNMTikge1xuXHQgICAgcC54ID0gdGhpcy5sb25nMDtcblx0ICAgIHAueSA9IEhBTEZfUEk7XG5cdCAgfVxuXHQgIGVsc2UgaWYgKE1hdGguYWJzKHVwICsgMSkgPCBFUFNMTikge1xuXHQgICAgcC54ID0gdGhpcy5sb25nMDtcblx0ICAgIHAueSA9IC0xICogSEFMRl9QSTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBwLnkgPSBwaGkyeih0aGlzLmUsIHRzKTtcblx0ICAgIHAueCA9IGFkanVzdF9sb24odGhpcy5sb25nMCAtIE1hdGguYXRhbjIoc3AgKiBNYXRoLmNvcyh0aGlzLmdhbW1hMCkgLSB2cCAqIE1hdGguc2luKHRoaXMuZ2FtbWEwKSwgTWF0aC5jb3ModGhpcy5ibCAqIHVzIC8gdGhpcy5hbCkpIC8gdGhpcy5ibCk7XG5cdCAgfVxuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0dmFyIG5hbWVzJDEwID0gW1wiSG90aW5lX09ibGlxdWVfTWVyY2F0b3JcIiwgXCJIb3RpbmUgT2JsaXF1ZSBNZXJjYXRvclwiLCBcIkhvdGluZV9PYmxpcXVlX01lcmNhdG9yX0F6aW11dGhfTmF0dXJhbF9PcmlnaW5cIiwgXCJIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9BemltdXRoX0NlbnRlclwiLCBcIm9tZXJjXCJdO1xuXHR2YXIgb21lcmMgPSB7XG5cdCAgaW5pdDogaW5pdCQ5LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkOCxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDgsXG5cdCAgbmFtZXM6IG5hbWVzJDEwXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQxMCgpIHtcblxuXHQgIC8vIGFycmF5IG9mOiAgcl9tYWoscl9taW4sbGF0MSxsYXQyLGNfbG9uLGNfbGF0LGZhbHNlX2Vhc3QsZmFsc2Vfbm9ydGhcblx0ICAvL2RvdWJsZSBjX2xhdDsgICAgICAgICAgICAgICAgICAgLyogY2VudGVyIGxhdGl0dWRlICAgICAgICAgICAgICAgICAgICAgICovXG5cdCAgLy9kb3VibGUgY19sb247ICAgICAgICAgICAgICAgICAgIC8qIGNlbnRlciBsb25naXR1ZGUgICAgICAgICAgICAgICAgICAgICAqL1xuXHQgIC8vZG91YmxlIGxhdDE7ICAgICAgICAgICAgICAgICAgICAvKiBmaXJzdCBzdGFuZGFyZCBwYXJhbGxlbCAgICAgICAgICAgICAgKi9cblx0ICAvL2RvdWJsZSBsYXQyOyAgICAgICAgICAgICAgICAgICAgLyogc2Vjb25kIHN0YW5kYXJkIHBhcmFsbGVsICAgICAgICAgICAgICovXG5cdCAgLy9kb3VibGUgcl9tYWo7ICAgICAgICAgICAgICAgICAgIC8qIG1ham9yIGF4aXMgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHQgIC8vZG91YmxlIHJfbWluOyAgICAgICAgICAgICAgICAgICAvKiBtaW5vciBheGlzICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0ICAvL2RvdWJsZSBmYWxzZV9lYXN0OyAgICAgICAgICAgICAgLyogeCBvZmZzZXQgaW4gbWV0ZXJzICAgICAgICAgICAgICAgICAgICovXG5cdCAgLy9kb3VibGUgZmFsc2Vfbm9ydGg7ICAgICAgICAgICAgIC8qIHkgb2Zmc2V0IGluIG1ldGVycyAgICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgaWYgKCF0aGlzLmxhdDIpIHtcblx0ICAgIHRoaXMubGF0MiA9IHRoaXMubGF0MTtcblx0ICB9IC8vaWYgbGF0MiBpcyBub3QgZGVmaW5lZFxuXHQgIGlmICghdGhpcy5rMCkge1xuXHQgICAgdGhpcy5rMCA9IDE7XG5cdCAgfVxuXHQgIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG5cdCAgdGhpcy55MCA9IHRoaXMueTAgfHwgMDtcblx0ICAvLyBTdGFuZGFyZCBQYXJhbGxlbHMgY2Fubm90IGJlIGVxdWFsIGFuZCBvbiBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgZXF1YXRvclxuXHQgIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICB2YXIgdGVtcCA9IHRoaXMuYiAvIHRoaXMuYTtcblx0ICB0aGlzLmUgPSBNYXRoLnNxcnQoMSAtIHRlbXAgKiB0ZW1wKTtcblxuXHQgIHZhciBzaW4xID0gTWF0aC5zaW4odGhpcy5sYXQxKTtcblx0ICB2YXIgY29zMSA9IE1hdGguY29zKHRoaXMubGF0MSk7XG5cdCAgdmFyIG1zMSA9IG1zZm56KHRoaXMuZSwgc2luMSwgY29zMSk7XG5cdCAgdmFyIHRzMSA9IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQxLCBzaW4xKTtcblxuXHQgIHZhciBzaW4yID0gTWF0aC5zaW4odGhpcy5sYXQyKTtcblx0ICB2YXIgY29zMiA9IE1hdGguY29zKHRoaXMubGF0Mik7XG5cdCAgdmFyIG1zMiA9IG1zZm56KHRoaXMuZSwgc2luMiwgY29zMik7XG5cdCAgdmFyIHRzMiA9IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQyLCBzaW4yKTtcblxuXHQgIHZhciB0czAgPSB0c2Zueih0aGlzLmUsIHRoaXMubGF0MCwgTWF0aC5zaW4odGhpcy5sYXQwKSk7XG5cblx0ICBpZiAoTWF0aC5hYnModGhpcy5sYXQxIC0gdGhpcy5sYXQyKSA+IEVQU0xOKSB7XG5cdCAgICB0aGlzLm5zID0gTWF0aC5sb2cobXMxIC8gbXMyKSAvIE1hdGgubG9nKHRzMSAvIHRzMik7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgdGhpcy5ucyA9IHNpbjE7XG5cdCAgfVxuXHQgIGlmIChpc05hTih0aGlzLm5zKSkge1xuXHQgICAgdGhpcy5ucyA9IHNpbjE7XG5cdCAgfVxuXHQgIHRoaXMuZjAgPSBtczEgLyAodGhpcy5ucyAqIE1hdGgucG93KHRzMSwgdGhpcy5ucykpO1xuXHQgIHRoaXMucmggPSB0aGlzLmEgKiB0aGlzLmYwICogTWF0aC5wb3codHMwLCB0aGlzLm5zKTtcblx0ICBpZiAoIXRoaXMudGl0bGUpIHtcblx0ICAgIHRoaXMudGl0bGUgPSBcIkxhbWJlcnQgQ29uZm9ybWFsIENvbmljXCI7XG5cdCAgfVxuXHR9XG5cblx0Ly8gTGFtYmVydCBDb25mb3JtYWwgY29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGZ1bmN0aW9uIGZvcndhcmQkOShwKSB7XG5cblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cblx0ICAvLyBzaW5ndWxhciBjYXNlcyA6XG5cdCAgaWYgKE1hdGguYWJzKDIgKiBNYXRoLmFicyhsYXQpIC0gTWF0aC5QSSkgPD0gRVBTTE4pIHtcblx0ICAgIGxhdCA9IHNpZ24obGF0KSAqIChIQUxGX1BJIC0gMiAqIEVQU0xOKTtcblx0ICB9XG5cblx0ICB2YXIgY29uID0gTWF0aC5hYnMoTWF0aC5hYnMobGF0KSAtIEhBTEZfUEkpO1xuXHQgIHZhciB0cywgcmgxO1xuXHQgIGlmIChjb24gPiBFUFNMTikge1xuXHQgICAgdHMgPSB0c2Zueih0aGlzLmUsIGxhdCwgTWF0aC5zaW4obGF0KSk7XG5cdCAgICByaDEgPSB0aGlzLmEgKiB0aGlzLmYwICogTWF0aC5wb3codHMsIHRoaXMubnMpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGNvbiA9IGxhdCAqIHRoaXMubnM7XG5cdCAgICBpZiAoY29uIDw9IDApIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICByaDEgPSAwO1xuXHQgIH1cblx0ICB2YXIgdGhldGEgPSB0aGlzLm5zICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblx0ICBwLnggPSB0aGlzLmswICogKHJoMSAqIE1hdGguc2luKHRoZXRhKSkgKyB0aGlzLngwO1xuXHQgIHAueSA9IHRoaXMuazAgKiAodGhpcy5yaCAtIHJoMSAqIE1hdGguY29zKHRoZXRhKSkgKyB0aGlzLnkwO1xuXG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvLyBMYW1iZXJ0IENvbmZvcm1hbCBDb25pYyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ZnVuY3Rpb24gaW52ZXJzZSQ5KHApIHtcblxuXHQgIHZhciByaDEsIGNvbiwgdHM7XG5cdCAgdmFyIGxhdCwgbG9uO1xuXHQgIHZhciB4ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5rMDtcblx0ICB2YXIgeSA9ICh0aGlzLnJoIC0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5rMCk7XG5cdCAgaWYgKHRoaXMubnMgPiAwKSB7XG5cdCAgICByaDEgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG5cdCAgICBjb24gPSAxO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHJoMSA9IC1NYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG5cdCAgICBjb24gPSAtMTtcblx0ICB9XG5cdCAgdmFyIHRoZXRhID0gMDtcblx0ICBpZiAocmgxICE9PSAwKSB7XG5cdCAgICB0aGV0YSA9IE1hdGguYXRhbjIoKGNvbiAqIHgpLCAoY29uICogeSkpO1xuXHQgIH1cblx0ICBpZiAoKHJoMSAhPT0gMCkgfHwgKHRoaXMubnMgPiAwKSkge1xuXHQgICAgY29uID0gMSAvIHRoaXMubnM7XG5cdCAgICB0cyA9IE1hdGgucG93KChyaDEgLyAodGhpcy5hICogdGhpcy5mMCkpLCBjb24pO1xuXHQgICAgbGF0ID0gcGhpMnoodGhpcy5lLCB0cyk7XG5cdCAgICBpZiAobGF0ID09PSAtOTk5OSkge1xuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBsYXQgPSAtSEFMRl9QSTtcblx0ICB9XG5cdCAgbG9uID0gYWRqdXN0X2xvbih0aGV0YSAvIHRoaXMubnMgKyB0aGlzLmxvbmcwKTtcblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMTEgPSBbXCJMYW1iZXJ0IFRhbmdlbnRpYWwgQ29uZm9ybWFsIENvbmljIFByb2plY3Rpb25cIiwgXCJMYW1iZXJ0X0NvbmZvcm1hbF9Db25pY1wiLCBcIkxhbWJlcnRfQ29uZm9ybWFsX0NvbmljXzJTUFwiLCBcImxjY1wiXTtcblx0dmFyIGxjYyA9IHtcblx0ICBpbml0OiBpbml0JDEwLFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkOSxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDksXG5cdCAgbmFtZXM6IG5hbWVzJDExXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQxMSgpIHtcblx0ICB0aGlzLmEgPSA2Mzc3Mzk3LjE1NTtcblx0ICB0aGlzLmVzID0gMC4wMDY2NzQzNzIyMzA2MTQ7XG5cdCAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuXHQgIGlmICghdGhpcy5sYXQwKSB7XG5cdCAgICB0aGlzLmxhdDAgPSAwLjg2MzkzNzk3OTczNzE5Mztcblx0ICB9XG5cdCAgaWYgKCF0aGlzLmxvbmcwKSB7XG5cdCAgICB0aGlzLmxvbmcwID0gMC43NDE3NjQ5MzIwOTc1OTAxIC0gMC4zMDgzNDE1MDExODU2NjU7XG5cdCAgfVxuXHQgIC8qIGlmIHNjYWxlIG5vdCBzZXQgZGVmYXVsdCB0byAwLjk5OTkgKi9cblx0ICBpZiAoIXRoaXMuazApIHtcblx0ICAgIHRoaXMuazAgPSAwLjk5OTk7XG5cdCAgfVxuXHQgIHRoaXMuczQ1ID0gMC43ODUzOTgxNjMzOTc0NDg7IC8qIDQ1ICovXG5cdCAgdGhpcy5zOTAgPSAyICogdGhpcy5zNDU7XG5cdCAgdGhpcy5maTAgPSB0aGlzLmxhdDA7XG5cdCAgdGhpcy5lMiA9IHRoaXMuZXM7XG5cdCAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZTIpO1xuXHQgIHRoaXMuYWxmYSA9IE1hdGguc3FydCgxICsgKHRoaXMuZTIgKiBNYXRoLnBvdyhNYXRoLmNvcyh0aGlzLmZpMCksIDQpKSAvICgxIC0gdGhpcy5lMikpO1xuXHQgIHRoaXMudXEgPSAxLjA0MjE2ODU2MzgwNDc0O1xuXHQgIHRoaXMudTAgPSBNYXRoLmFzaW4oTWF0aC5zaW4odGhpcy5maTApIC8gdGhpcy5hbGZhKTtcblx0ICB0aGlzLmcgPSBNYXRoLnBvdygoMSArIHRoaXMuZSAqIE1hdGguc2luKHRoaXMuZmkwKSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKHRoaXMuZmkwKSksIHRoaXMuYWxmYSAqIHRoaXMuZSAvIDIpO1xuXHQgIHRoaXMuayA9IE1hdGgudGFuKHRoaXMudTAgLyAyICsgdGhpcy5zNDUpIC8gTWF0aC5wb3coTWF0aC50YW4odGhpcy5maTAgLyAyICsgdGhpcy5zNDUpLCB0aGlzLmFsZmEpICogdGhpcy5nO1xuXHQgIHRoaXMuazEgPSB0aGlzLmswO1xuXHQgIHRoaXMubjAgPSB0aGlzLmEgKiBNYXRoLnNxcnQoMSAtIHRoaXMuZTIpIC8gKDEgLSB0aGlzLmUyICogTWF0aC5wb3coTWF0aC5zaW4odGhpcy5maTApLCAyKSk7XG5cdCAgdGhpcy5zMCA9IDEuMzcwMDgzNDYyODE1NTU7XG5cdCAgdGhpcy5uID0gTWF0aC5zaW4odGhpcy5zMCk7XG5cdCAgdGhpcy5ybzAgPSB0aGlzLmsxICogdGhpcy5uMCAvIE1hdGgudGFuKHRoaXMuczApO1xuXHQgIHRoaXMuYWQgPSB0aGlzLnM5MCAtIHRoaXMudXE7XG5cdH1cblxuXHQvKiBlbGxpcHNvaWQgKi9cblx0LyogY2FsY3VsYXRlIHh5IGZyb20gbGF0L2xvbiAqL1xuXHQvKiBDb25zdGFudHMsIGlkZW50aWNhbCB0byBpbnZlcnNlIHRyYW5zZm9ybSBmdW5jdGlvbiAqL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDEwKHApIHtcblx0ICB2YXIgZ2ZpLCB1LCBkZWx0YXYsIHMsIGQsIGVwcywgcm87XG5cdCAgdmFyIGxvbiA9IHAueDtcblx0ICB2YXIgbGF0ID0gcC55O1xuXHQgIHZhciBkZWx0YV9sb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIC8qIFRyYW5zZm9ybWF0aW9uICovXG5cdCAgZ2ZpID0gTWF0aC5wb3coKCgxICsgdGhpcy5lICogTWF0aC5zaW4obGF0KSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKGxhdCkpKSwgKHRoaXMuYWxmYSAqIHRoaXMuZSAvIDIpKTtcblx0ICB1ID0gMiAqIChNYXRoLmF0YW4odGhpcy5rICogTWF0aC5wb3coTWF0aC50YW4obGF0IC8gMiArIHRoaXMuczQ1KSwgdGhpcy5hbGZhKSAvIGdmaSkgLSB0aGlzLnM0NSk7XG5cdCAgZGVsdGF2ID0gLWRlbHRhX2xvbiAqIHRoaXMuYWxmYTtcblx0ICBzID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYWQpICogTWF0aC5zaW4odSkgKyBNYXRoLnNpbih0aGlzLmFkKSAqIE1hdGguY29zKHUpICogTWF0aC5jb3MoZGVsdGF2KSk7XG5cdCAgZCA9IE1hdGguYXNpbihNYXRoLmNvcyh1KSAqIE1hdGguc2luKGRlbHRhdikgLyBNYXRoLmNvcyhzKSk7XG5cdCAgZXBzID0gdGhpcy5uICogZDtcblx0ICBybyA9IHRoaXMucm8wICogTWF0aC5wb3coTWF0aC50YW4odGhpcy5zMCAvIDIgKyB0aGlzLnM0NSksIHRoaXMubikgLyBNYXRoLnBvdyhNYXRoLnRhbihzIC8gMiArIHRoaXMuczQ1KSwgdGhpcy5uKTtcblx0ICBwLnkgPSBybyAqIE1hdGguY29zKGVwcykgLyAxO1xuXHQgIHAueCA9IHJvICogTWF0aC5zaW4oZXBzKSAvIDE7XG5cblx0ICBpZiAoIXRoaXMuY3plY2gpIHtcblx0ICAgIHAueSAqPSAtMTtcblx0ICAgIHAueCAqPSAtMTtcblx0ICB9XG5cdCAgcmV0dXJuIChwKTtcblx0fVxuXG5cdC8qIGNhbGN1bGF0ZSBsYXQvbG9uIGZyb20geHkgKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQxMChwKSB7XG5cdCAgdmFyIHUsIGRlbHRhdiwgcywgZCwgZXBzLCBybywgZmkxO1xuXHQgIHZhciBvaztcblxuXHQgIC8qIFRyYW5zZm9ybWF0aW9uICovXG5cdCAgLyogcmV2ZXJ0IHksIHgqL1xuXHQgIHZhciB0bXAgPSBwLng7XG5cdCAgcC54ID0gcC55O1xuXHQgIHAueSA9IHRtcDtcblx0ICBpZiAoIXRoaXMuY3plY2gpIHtcblx0ICAgIHAueSAqPSAtMTtcblx0ICAgIHAueCAqPSAtMTtcblx0ICB9XG5cdCAgcm8gPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcblx0ICBlcHMgPSBNYXRoLmF0YW4yKHAueSwgcC54KTtcblx0ICBkID0gZXBzIC8gTWF0aC5zaW4odGhpcy5zMCk7XG5cdCAgcyA9IDIgKiAoTWF0aC5hdGFuKE1hdGgucG93KHRoaXMucm8wIC8gcm8sIDEgLyB0aGlzLm4pICogTWF0aC50YW4odGhpcy5zMCAvIDIgKyB0aGlzLnM0NSkpIC0gdGhpcy5zNDUpO1xuXHQgIHUgPSBNYXRoLmFzaW4oTWF0aC5jb3ModGhpcy5hZCkgKiBNYXRoLnNpbihzKSAtIE1hdGguc2luKHRoaXMuYWQpICogTWF0aC5jb3MocykgKiBNYXRoLmNvcyhkKSk7XG5cdCAgZGVsdGF2ID0gTWF0aC5hc2luKE1hdGguY29zKHMpICogTWF0aC5zaW4oZCkgLyBNYXRoLmNvcyh1KSk7XG5cdCAgcC54ID0gdGhpcy5sb25nMCAtIGRlbHRhdiAvIHRoaXMuYWxmYTtcblx0ICBmaTEgPSB1O1xuXHQgIG9rID0gMDtcblx0ICB2YXIgaXRlciA9IDA7XG5cdCAgZG8ge1xuXHQgICAgcC55ID0gMiAqIChNYXRoLmF0YW4oTWF0aC5wb3codGhpcy5rLCAtIDEgLyB0aGlzLmFsZmEpICogTWF0aC5wb3coTWF0aC50YW4odSAvIDIgKyB0aGlzLnM0NSksIDEgLyB0aGlzLmFsZmEpICogTWF0aC5wb3coKDEgKyB0aGlzLmUgKiBNYXRoLnNpbihmaTEpKSAvICgxIC0gdGhpcy5lICogTWF0aC5zaW4oZmkxKSksIHRoaXMuZSAvIDIpKSAtIHRoaXMuczQ1KTtcblx0ICAgIGlmIChNYXRoLmFicyhmaTEgLSBwLnkpIDwgMC4wMDAwMDAwMDAxKSB7XG5cdCAgICAgIG9rID0gMTtcblx0ICAgIH1cblx0ICAgIGZpMSA9IHAueTtcblx0ICAgIGl0ZXIgKz0gMTtcblx0ICB9IHdoaWxlIChvayA9PT0gMCAmJiBpdGVyIDwgMTUpO1xuXHQgIGlmIChpdGVyID49IDE1KSB7XG5cdCAgICByZXR1cm4gbnVsbDtcblx0ICB9XG5cblx0ICByZXR1cm4gKHApO1xuXHR9XG5cblx0dmFyIG5hbWVzJDEyID0gW1wiS3JvdmFrXCIsIFwia3JvdmFrXCJdO1xuXHR2YXIga3JvdmFrID0ge1xuXHQgIGluaXQ6IGluaXQkMTEsXG5cdCAgZm9yd2FyZDogZm9yd2FyZCQxMCxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDEwLFxuXHQgIG5hbWVzOiBuYW1lcyQxMlxuXHR9O1xuXG5cdHZhciBtbGZuID0gZnVuY3Rpb24oZTAsIGUxLCBlMiwgZTMsIHBoaSkge1xuXHQgIHJldHVybiAoZTAgKiBwaGkgLSBlMSAqIE1hdGguc2luKDIgKiBwaGkpICsgZTIgKiBNYXRoLnNpbig0ICogcGhpKSAtIGUzICogTWF0aC5zaW4oNiAqIHBoaSkpO1xuXHR9O1xuXG5cdHZhciBlMGZuID0gZnVuY3Rpb24oeCkge1xuXHQgIHJldHVybiAoMSAtIDAuMjUgKiB4ICogKDEgKyB4IC8gMTYgKiAoMyArIDEuMjUgKiB4KSkpO1xuXHR9O1xuXG5cdHZhciBlMWZuID0gZnVuY3Rpb24oeCkge1xuXHQgIHJldHVybiAoMC4zNzUgKiB4ICogKDEgKyAwLjI1ICogeCAqICgxICsgMC40Njg3NSAqIHgpKSk7XG5cdH07XG5cblx0dmFyIGUyZm4gPSBmdW5jdGlvbih4KSB7XG5cdCAgcmV0dXJuICgwLjA1ODU5Mzc1ICogeCAqIHggKiAoMSArIDAuNzUgKiB4KSk7XG5cdH07XG5cblx0dmFyIGUzZm4gPSBmdW5jdGlvbih4KSB7XG5cdCAgcmV0dXJuICh4ICogeCAqIHggKiAoMzUgLyAzMDcyKSk7XG5cdH07XG5cblx0dmFyIGdOID0gZnVuY3Rpb24oYSwgZSwgc2lucGhpKSB7XG5cdCAgdmFyIHRlbXAgPSBlICogc2lucGhpO1xuXHQgIHJldHVybiBhIC8gTWF0aC5zcXJ0KDEgLSB0ZW1wICogdGVtcCk7XG5cdH07XG5cblx0dmFyIGFkanVzdF9sYXQgPSBmdW5jdGlvbih4KSB7XG5cdCAgcmV0dXJuIChNYXRoLmFicyh4KSA8IEhBTEZfUEkpID8geCA6ICh4IC0gKHNpZ24oeCkgKiBNYXRoLlBJKSk7XG5cdH07XG5cblx0dmFyIGltbGZuID0gZnVuY3Rpb24obWwsIGUwLCBlMSwgZTIsIGUzKSB7XG5cdCAgdmFyIHBoaTtcblx0ICB2YXIgZHBoaTtcblxuXHQgIHBoaSA9IG1sIC8gZTA7XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNTsgaSsrKSB7XG5cdCAgICBkcGhpID0gKG1sIC0gKGUwICogcGhpIC0gZTEgKiBNYXRoLnNpbigyICogcGhpKSArIGUyICogTWF0aC5zaW4oNCAqIHBoaSkgLSBlMyAqIE1hdGguc2luKDYgKiBwaGkpKSkgLyAoZTAgLSAyICogZTEgKiBNYXRoLmNvcygyICogcGhpKSArIDQgKiBlMiAqIE1hdGguY29zKDQgKiBwaGkpIC0gNiAqIGUzICogTWF0aC5jb3MoNiAqIHBoaSkpO1xuXHQgICAgcGhpICs9IGRwaGk7XG5cdCAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMC4wMDAwMDAwMDAxKSB7XG5cdCAgICAgIHJldHVybiBwaGk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLy8uLnJlcG9ydEVycm9yKFwiSU1MRk4tQ09OVjpMYXRpdHVkZSBmYWlsZWQgdG8gY29udmVyZ2UgYWZ0ZXIgMTUgaXRlcmF0aW9uc1wiKTtcblx0ICByZXR1cm4gTmFOO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQkMTIoKSB7XG5cdCAgaWYgKCF0aGlzLnNwaGVyZSkge1xuXHQgICAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG5cdCAgICB0aGlzLmUxID0gZTFmbih0aGlzLmVzKTtcblx0ICAgIHRoaXMuZTIgPSBlMmZuKHRoaXMuZXMpO1xuXHQgICAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG5cdCAgICB0aGlzLm1sMCA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQwKTtcblx0ICB9XG5cdH1cblxuXHQvKiBDYXNzaW5pIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuXHQgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gZm9yd2FyZCQxMShwKSB7XG5cblx0ICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuXHQgICAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG5cdCAgdmFyIHgsIHk7XG5cdCAgdmFyIGxhbSA9IHAueDtcblx0ICB2YXIgcGhpID0gcC55O1xuXHQgIGxhbSA9IGFkanVzdF9sb24obGFtIC0gdGhpcy5sb25nMCk7XG5cblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIHggPSB0aGlzLmEgKiBNYXRoLmFzaW4oTWF0aC5jb3MocGhpKSAqIE1hdGguc2luKGxhbSkpO1xuXHQgICAgeSA9IHRoaXMuYSAqIChNYXRoLmF0YW4yKE1hdGgudGFuKHBoaSksIE1hdGguY29zKGxhbSkpIC0gdGhpcy5sYXQwKTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICAvL2VsbGlwc29pZFxuXHQgICAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG5cdCAgICB2YXIgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcblx0ICAgIHZhciBubCA9IGdOKHRoaXMuYSwgdGhpcy5lLCBzaW5waGkpO1xuXHQgICAgdmFyIHRsID0gTWF0aC50YW4ocGhpKSAqIE1hdGgudGFuKHBoaSk7XG5cdCAgICB2YXIgYWwgPSBsYW0gKiBNYXRoLmNvcyhwaGkpO1xuXHQgICAgdmFyIGFzcSA9IGFsICogYWw7XG5cdCAgICB2YXIgY2wgPSB0aGlzLmVzICogY29zcGhpICogY29zcGhpIC8gKDEgLSB0aGlzLmVzKTtcblx0ICAgIHZhciBtbCA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgcGhpKTtcblxuXHQgICAgeCA9IG5sICogYWwgKiAoMSAtIGFzcSAqIHRsICogKDEgLyA2IC0gKDggLSB0bCArIDggKiBjbCkgKiBhc3EgLyAxMjApKTtcblx0ICAgIHkgPSBtbCAtIHRoaXMubWwwICsgbmwgKiBzaW5waGkgLyBjb3NwaGkgKiBhc3EgKiAoMC41ICsgKDUgLSB0bCArIDYgKiBjbCkgKiBhc3EgLyAyNCk7XG5cblxuXHQgIH1cblxuXHQgIHAueCA9IHggKyB0aGlzLngwO1xuXHQgIHAueSA9IHkgKyB0aGlzLnkwO1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0LyogSW52ZXJzZSBlcXVhdGlvbnNcblx0ICAtLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGludmVyc2UkMTEocCkge1xuXHQgIHAueCAtPSB0aGlzLngwO1xuXHQgIHAueSAtPSB0aGlzLnkwO1xuXHQgIHZhciB4ID0gcC54IC8gdGhpcy5hO1xuXHQgIHZhciB5ID0gcC55IC8gdGhpcy5hO1xuXHQgIHZhciBwaGksIGxhbTtcblxuXHQgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgdmFyIGRkID0geSArIHRoaXMubGF0MDtcblx0ICAgIHBoaSA9IE1hdGguYXNpbihNYXRoLnNpbihkZCkgKiBNYXRoLmNvcyh4KSk7XG5cdCAgICBsYW0gPSBNYXRoLmF0YW4yKE1hdGgudGFuKHgpLCBNYXRoLmNvcyhkZCkpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIC8qIGVsbGlwc29pZCAqL1xuXHQgICAgdmFyIG1sMSA9IHRoaXMubWwwIC8gdGhpcy5hICsgeTtcblx0ICAgIHZhciBwaGkxID0gaW1sZm4obWwxLCB0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzKTtcblx0ICAgIGlmIChNYXRoLmFicyhNYXRoLmFicyhwaGkxKSAtIEhBTEZfUEkpIDw9IEVQU0xOKSB7XG5cdCAgICAgIHAueCA9IHRoaXMubG9uZzA7XG5cdCAgICAgIHAueSA9IEhBTEZfUEk7XG5cdCAgICAgIGlmICh5IDwgMCkge1xuXHQgICAgICAgIHAueSAqPSAtMTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcDtcblx0ICAgIH1cblx0ICAgIHZhciBubDEgPSBnTih0aGlzLmEsIHRoaXMuZSwgTWF0aC5zaW4ocGhpMSkpO1xuXG5cdCAgICB2YXIgcmwxID0gbmwxICogbmwxICogbmwxIC8gdGhpcy5hIC8gdGhpcy5hICogKDEgLSB0aGlzLmVzKTtcblx0ICAgIHZhciB0bDEgPSBNYXRoLnBvdyhNYXRoLnRhbihwaGkxKSwgMik7XG5cdCAgICB2YXIgZGwgPSB4ICogdGhpcy5hIC8gbmwxO1xuXHQgICAgdmFyIGRzcSA9IGRsICogZGw7XG5cdCAgICBwaGkgPSBwaGkxIC0gbmwxICogTWF0aC50YW4ocGhpMSkgLyBybDEgKiBkbCAqIGRsICogKDAuNSAtICgxICsgMyAqIHRsMSkgKiBkbCAqIGRsIC8gMjQpO1xuXHQgICAgbGFtID0gZGwgKiAoMSAtIGRzcSAqICh0bDEgLyAzICsgKDEgKyAzICogdGwxKSAqIHRsMSAqIGRzcSAvIDE1KSkgLyBNYXRoLmNvcyhwaGkxKTtcblxuXHQgIH1cblxuXHQgIHAueCA9IGFkanVzdF9sb24obGFtICsgdGhpcy5sb25nMCk7XG5cdCAgcC55ID0gYWRqdXN0X2xhdChwaGkpO1xuXHQgIHJldHVybiBwO1xuXG5cdH1cblxuXHR2YXIgbmFtZXMkMTMgPSBbXCJDYXNzaW5pXCIsIFwiQ2Fzc2luaV9Tb2xkbmVyXCIsIFwiY2Fzc1wiXTtcblx0dmFyIGNhc3MgPSB7XG5cdCAgaW5pdDogaW5pdCQxMixcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDExLFxuXHQgIGludmVyc2U6IGludmVyc2UkMTEsXG5cdCAgbmFtZXM6IG5hbWVzJDEzXG5cdH07XG5cblx0dmFyIHFzZm56ID0gZnVuY3Rpb24oZWNjZW50LCBzaW5waGkpIHtcblx0ICB2YXIgY29uO1xuXHQgIGlmIChlY2NlbnQgPiAxLjBlLTcpIHtcblx0ICAgIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcblx0ICAgIHJldHVybiAoKDEgLSBlY2NlbnQgKiBlY2NlbnQpICogKHNpbnBoaSAvICgxIC0gY29uICogY29uKSAtICgwLjUgLyBlY2NlbnQpICogTWF0aC5sb2coKDEgLSBjb24pIC8gKDEgKyBjb24pKSkpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHJldHVybiAoMiAqIHNpbnBoaSk7XG5cdCAgfVxuXHR9O1xuXG5cdC8qXG5cdCAgcmVmZXJlbmNlXG5cdCAgICBcIk5ldyBFcXVhbC1BcmVhIE1hcCBQcm9qZWN0aW9ucyBmb3IgTm9uY2lyY3VsYXIgUmVnaW9uc1wiLCBKb2huIFAuIFNueWRlcixcblx0ICAgIFRoZSBBbWVyaWNhbiBDYXJ0b2dyYXBoZXIsIFZvbCAxNSwgTm8uIDQsIE9jdG9iZXIgMTk4OCwgcHAuIDM0MS0zNTUuXG5cdCAgKi9cblxuXHR2YXIgU19QT0xFID0gMTtcblxuXHR2YXIgTl9QT0xFID0gMjtcblx0dmFyIEVRVUlUID0gMztcblx0dmFyIE9CTElRID0gNDtcblxuXHQvKiBJbml0aWFsaXplIHRoZSBMYW1iZXJ0IEF6aW11dGhhbCBFcXVhbCBBcmVhIHByb2plY3Rpb25cblx0ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBpbml0JDEzKCkge1xuXHQgIHZhciB0ID0gTWF0aC5hYnModGhpcy5sYXQwKTtcblx0ICBpZiAoTWF0aC5hYnModCAtIEhBTEZfUEkpIDwgRVBTTE4pIHtcblx0ICAgIHRoaXMubW9kZSA9IHRoaXMubGF0MCA8IDAgPyB0aGlzLlNfUE9MRSA6IHRoaXMuTl9QT0xFO1xuXHQgIH1cblx0ICBlbHNlIGlmIChNYXRoLmFicyh0KSA8IEVQU0xOKSB7XG5cdCAgICB0aGlzLm1vZGUgPSB0aGlzLkVRVUlUO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHRoaXMubW9kZSA9IHRoaXMuT0JMSVE7XG5cdCAgfVxuXHQgIGlmICh0aGlzLmVzID4gMCkge1xuXHQgICAgdmFyIHNpbnBoaTtcblxuXHQgICAgdGhpcy5xcCA9IHFzZm56KHRoaXMuZSwgMSk7XG5cdCAgICB0aGlzLm1tZiA9IDAuNSAvICgxIC0gdGhpcy5lcyk7XG5cdCAgICB0aGlzLmFwYSA9IGF1dGhzZXQodGhpcy5lcyk7XG5cdCAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuXHQgICAgY2FzZSB0aGlzLk5fUE9MRTpcblx0ICAgICAgdGhpcy5kZCA9IDE7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSB0aGlzLlNfUE9MRTpcblx0ICAgICAgdGhpcy5kZCA9IDE7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSB0aGlzLkVRVUlUOlxuXHQgICAgICB0aGlzLnJxID0gTWF0aC5zcXJ0KDAuNSAqIHRoaXMucXApO1xuXHQgICAgICB0aGlzLmRkID0gMSAvIHRoaXMucnE7XG5cdCAgICAgIHRoaXMueG1mID0gMTtcblx0ICAgICAgdGhpcy55bWYgPSAwLjUgKiB0aGlzLnFwO1xuXHQgICAgICBicmVhaztcblx0ICAgIGNhc2UgdGhpcy5PQkxJUTpcblx0ICAgICAgdGhpcy5ycSA9IE1hdGguc3FydCgwLjUgKiB0aGlzLnFwKTtcblx0ICAgICAgc2lucGhpID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcblx0ICAgICAgdGhpcy5zaW5iMSA9IHFzZm56KHRoaXMuZSwgc2lucGhpKSAvIHRoaXMucXA7XG5cdCAgICAgIHRoaXMuY29zYjEgPSBNYXRoLnNxcnQoMSAtIHRoaXMuc2luYjEgKiB0aGlzLnNpbmIxKTtcblx0ICAgICAgdGhpcy5kZCA9IE1hdGguY29zKHRoaXMubGF0MCkgLyAoTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogc2lucGhpICogc2lucGhpKSAqIHRoaXMucnEgKiB0aGlzLmNvc2IxKTtcblx0ICAgICAgdGhpcy55bWYgPSAodGhpcy54bWYgPSB0aGlzLnJxKSAvIHRoaXMuZGQ7XG5cdCAgICAgIHRoaXMueG1mICo9IHRoaXMuZGQ7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEpIHtcblx0ICAgICAgdGhpcy5zaW5waDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuXHQgICAgICB0aGlzLmNvc3BoMCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cblx0LyogTGFtYmVydCBBemltdXRoYWwgRXF1YWwgQXJlYSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGZvcndhcmQkMTIocCkge1xuXG5cdCAgLyogRm9yd2FyZCBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHZhciB4LCB5LCBjb3NsYW0sIHNpbmxhbSwgc2lucGhpLCBxLCBzaW5iLCBjb3NiLCBiLCBjb3NwaGk7XG5cdCAgdmFyIGxhbSA9IHAueDtcblx0ICB2YXIgcGhpID0gcC55O1xuXG5cdCAgbGFtID0gYWRqdXN0X2xvbihsYW0gLSB0aGlzLmxvbmcwKTtcblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG5cdCAgICBjb3NwaGkgPSBNYXRoLmNvcyhwaGkpO1xuXHQgICAgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcblx0ICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEgfHwgdGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSB7XG5cdCAgICAgIHkgPSAodGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSA/IDEgKyBjb3NwaGkgKiBjb3NsYW0gOiAxICsgdGhpcy5zaW5waDAgKiBzaW5waGkgKyB0aGlzLmNvc3BoMCAqIGNvc3BoaSAqIGNvc2xhbTtcblx0ICAgICAgaWYgKHkgPD0gRVBTTE4pIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgfVxuXHQgICAgICB5ID0gTWF0aC5zcXJ0KDIgLyB5KTtcblx0ICAgICAgeCA9IHkgKiBjb3NwaGkgKiBNYXRoLnNpbihsYW0pO1xuXHQgICAgICB5ICo9ICh0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQpID8gc2lucGhpIDogdGhpcy5jb3NwaDAgKiBzaW5waGkgLSB0aGlzLnNpbnBoMCAqIGNvc3BoaSAqIGNvc2xhbTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUgfHwgdGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuXHQgICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk5fUE9MRSkge1xuXHQgICAgICAgIGNvc2xhbSA9IC1jb3NsYW07XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKE1hdGguYWJzKHBoaSArIHRoaXMucGhpMCkgPCBFUFNMTikge1xuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICB9XG5cdCAgICAgIHkgPSBGT1JUUEkgLSBwaGkgKiAwLjU7XG5cdCAgICAgIHkgPSAyICogKCh0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSA/IE1hdGguY29zKHkpIDogTWF0aC5zaW4oeSkpO1xuXHQgICAgICB4ID0geSAqIE1hdGguc2luKGxhbSk7XG5cdCAgICAgIHkgKj0gY29zbGFtO1xuXHQgICAgfVxuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHNpbmIgPSAwO1xuXHQgICAgY29zYiA9IDA7XG5cdCAgICBiID0gMDtcblx0ICAgIGNvc2xhbSA9IE1hdGguY29zKGxhbSk7XG5cdCAgICBzaW5sYW0gPSBNYXRoLnNpbihsYW0pO1xuXHQgICAgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcblx0ICAgIHEgPSBxc2Zueih0aGlzLmUsIHNpbnBoaSk7XG5cdCAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuXHQgICAgICBzaW5iID0gcSAvIHRoaXMucXA7XG5cdCAgICAgIGNvc2IgPSBNYXRoLnNxcnQoMSAtIHNpbmIgKiBzaW5iKTtcblx0ICAgIH1cblx0ICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG5cdCAgICBjYXNlIHRoaXMuT0JMSVE6XG5cdCAgICAgIGIgPSAxICsgdGhpcy5zaW5iMSAqIHNpbmIgKyB0aGlzLmNvc2IxICogY29zYiAqIGNvc2xhbTtcblx0ICAgICAgYnJlYWs7XG5cdCAgICBjYXNlIHRoaXMuRVFVSVQ6XG5cdCAgICAgIGIgPSAxICsgY29zYiAqIGNvc2xhbTtcblx0ICAgICAgYnJlYWs7XG5cdCAgICBjYXNlIHRoaXMuTl9QT0xFOlxuXHQgICAgICBiID0gSEFMRl9QSSArIHBoaTtcblx0ICAgICAgcSA9IHRoaXMucXAgLSBxO1xuXHQgICAgICBicmVhaztcblx0ICAgIGNhc2UgdGhpcy5TX1BPTEU6XG5cdCAgICAgIGIgPSBwaGkgLSBIQUxGX1BJO1xuXHQgICAgICBxID0gdGhpcy5xcCArIHE7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHQgICAgaWYgKE1hdGguYWJzKGIpIDwgRVBTTE4pIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuXHQgICAgY2FzZSB0aGlzLk9CTElROlxuXHQgICAgY2FzZSB0aGlzLkVRVUlUOlxuXHQgICAgICBiID0gTWF0aC5zcXJ0KDIgLyBiKTtcblx0ICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkge1xuXHQgICAgICAgIHkgPSB0aGlzLnltZiAqIGIgKiAodGhpcy5jb3NiMSAqIHNpbmIgLSB0aGlzLnNpbmIxICogY29zYiAqIGNvc2xhbSk7XG5cdCAgICAgIH1cblx0ICAgICAgZWxzZSB7XG5cdCAgICAgICAgeSA9IChiID0gTWF0aC5zcXJ0KDIgLyAoMSArIGNvc2IgKiBjb3NsYW0pKSkgKiBzaW5iICogdGhpcy55bWY7XG5cdCAgICAgIH1cblx0ICAgICAgeCA9IHRoaXMueG1mICogYiAqIGNvc2IgKiBzaW5sYW07XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSB0aGlzLk5fUE9MRTpcblx0ICAgIGNhc2UgdGhpcy5TX1BPTEU6XG5cdCAgICAgIGlmIChxID49IDApIHtcblx0ICAgICAgICB4ID0gKGIgPSBNYXRoLnNxcnQocSkpICogc2lubGFtO1xuXHQgICAgICAgIHkgPSBjb3NsYW0gKiAoKHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpID8gYiA6IC1iKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIHtcblx0ICAgICAgICB4ID0geSA9IDA7XG5cdCAgICAgIH1cblx0ICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcC54ID0gdGhpcy5hICogeCArIHRoaXMueDA7XG5cdCAgcC55ID0gdGhpcy5hICogeSArIHRoaXMueTA7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvKiBJbnZlcnNlIGVxdWF0aW9uc1xuXHQgIC0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQxMihwKSB7XG5cdCAgcC54IC09IHRoaXMueDA7XG5cdCAgcC55IC09IHRoaXMueTA7XG5cdCAgdmFyIHggPSBwLnggLyB0aGlzLmE7XG5cdCAgdmFyIHkgPSBwLnkgLyB0aGlzLmE7XG5cdCAgdmFyIGxhbSwgcGhpLCBjQ2UsIHNDZSwgcSwgcmhvLCBhYjtcblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIHZhciBjb3N6ID0gMCxcblx0ICAgICAgcmgsIHNpbnogPSAwO1xuXG5cdCAgICByaCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcblx0ICAgIHBoaSA9IHJoICogMC41O1xuXHQgICAgaWYgKHBoaSA+IDEpIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICBwaGkgPSAyICogTWF0aC5hc2luKHBoaSk7XG5cdCAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuXHQgICAgICBzaW56ID0gTWF0aC5zaW4ocGhpKTtcblx0ICAgICAgY29zeiA9IE1hdGguY29zKHBoaSk7XG5cdCAgICB9XG5cdCAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuXHQgICAgY2FzZSB0aGlzLkVRVUlUOlxuXHQgICAgICBwaGkgPSAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSA/IDAgOiBNYXRoLmFzaW4oeSAqIHNpbnogLyByaCk7XG5cdCAgICAgIHggKj0gc2luejtcblx0ICAgICAgeSA9IGNvc3ogKiByaDtcblx0ICAgICAgYnJlYWs7XG5cdCAgICBjYXNlIHRoaXMuT0JMSVE6XG5cdCAgICAgIHBoaSA9IChNYXRoLmFicyhyaCkgPD0gRVBTTE4pID8gdGhpcy5waGkwIDogTWF0aC5hc2luKGNvc3ogKiB0aGlzLnNpbnBoMCArIHkgKiBzaW56ICogdGhpcy5jb3NwaDAgLyByaCk7XG5cdCAgICAgIHggKj0gc2lueiAqIHRoaXMuY29zcGgwO1xuXHQgICAgICB5ID0gKGNvc3ogLSBNYXRoLnNpbihwaGkpICogdGhpcy5zaW5waDApICogcmg7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSB0aGlzLk5fUE9MRTpcblx0ICAgICAgeSA9IC15O1xuXHQgICAgICBwaGkgPSBIQUxGX1BJIC0gcGhpO1xuXHQgICAgICBicmVhaztcblx0ICAgIGNhc2UgdGhpcy5TX1BPTEU6XG5cdCAgICAgIHBoaSAtPSBIQUxGX1BJO1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICAgIGxhbSA9ICh5ID09PSAwICYmICh0aGlzLm1vZGUgPT09IHRoaXMuRVFVSVQgfHwgdGhpcy5tb2RlID09PSB0aGlzLk9CTElRKSkgPyAwIDogTWF0aC5hdGFuMih4LCB5KTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBhYiA9IDA7XG5cdCAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuXHQgICAgICB4IC89IHRoaXMuZGQ7XG5cdCAgICAgIHkgKj0gdGhpcy5kZDtcblx0ICAgICAgcmhvID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuXHQgICAgICBpZiAocmhvIDwgRVBTTE4pIHtcblx0ICAgICAgICBwLnggPSAwO1xuXHQgICAgICAgIHAueSA9IHRoaXMucGhpMDtcblx0ICAgICAgICByZXR1cm4gcDtcblx0ICAgICAgfVxuXHQgICAgICBzQ2UgPSAyICogTWF0aC5hc2luKDAuNSAqIHJobyAvIHRoaXMucnEpO1xuXHQgICAgICBjQ2UgPSBNYXRoLmNvcyhzQ2UpO1xuXHQgICAgICB4ICo9IChzQ2UgPSBNYXRoLnNpbihzQ2UpKTtcblx0ICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkge1xuXHQgICAgICAgIGFiID0gY0NlICogdGhpcy5zaW5iMSArIHkgKiBzQ2UgKiB0aGlzLmNvc2IxIC8gcmhvO1xuXHQgICAgICAgIHEgPSB0aGlzLnFwICogYWI7XG5cdCAgICAgICAgeSA9IHJobyAqIHRoaXMuY29zYjEgKiBjQ2UgLSB5ICogdGhpcy5zaW5iMSAqIHNDZTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIHtcblx0ICAgICAgICBhYiA9IHkgKiBzQ2UgLyByaG87XG5cdCAgICAgICAgcSA9IHRoaXMucXAgKiBhYjtcblx0ICAgICAgICB5ID0gcmhvICogY0NlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuTl9QT0xFIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpIHtcblx0ICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUpIHtcblx0ICAgICAgICB5ID0gLXk7XG5cdCAgICAgIH1cblx0ICAgICAgcSA9ICh4ICogeCArIHkgKiB5KTtcblx0ICAgICAgaWYgKCFxKSB7XG5cdCAgICAgICAgcC54ID0gMDtcblx0ICAgICAgICBwLnkgPSB0aGlzLnBoaTA7XG5cdCAgICAgICAgcmV0dXJuIHA7XG5cdCAgICAgIH1cblx0ICAgICAgYWIgPSAxIC0gcSAvIHRoaXMucXA7XG5cdCAgICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuU19QT0xFKSB7XG5cdCAgICAgICAgYWIgPSAtYWI7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIGxhbSA9IE1hdGguYXRhbjIoeCwgeSk7XG5cdCAgICBwaGkgPSBhdXRobGF0KE1hdGguYXNpbihhYiksIHRoaXMuYXBhKTtcblx0ICB9XG5cblx0ICBwLnggPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBsYW0pO1xuXHQgIHAueSA9IHBoaTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdC8qIGRldGVybWluZSBsYXRpdHVkZSBmcm9tIGF1dGhhbGljIGxhdGl0dWRlICovXG5cdHZhciBQMDAgPSAwLjMzMzMzMzMzMzMzMzMzMzMzMzMzO1xuXG5cdHZhciBQMDEgPSAwLjE3MjIyMjIyMjIyMjIyMjIyMjIyO1xuXHR2YXIgUDAyID0gMC4xMDI1NzkzNjUwNzkzNjUwNzkzNjtcblx0dmFyIFAxMCA9IDAuMDYzODg4ODg4ODg4ODg4ODg4ODg7XG5cdHZhciBQMTEgPSAwLjA2NjQwMjExNjQwMjExNjQwMjExO1xuXHR2YXIgUDIwID0gMC4wMTY0MTUwMTI5NDIxOTE1NDQ0MztcblxuXHRmdW5jdGlvbiBhdXRoc2V0KGVzKSB7XG5cdCAgdmFyIHQ7XG5cdCAgdmFyIEFQQSA9IFtdO1xuXHQgIEFQQVswXSA9IGVzICogUDAwO1xuXHQgIHQgPSBlcyAqIGVzO1xuXHQgIEFQQVswXSArPSB0ICogUDAxO1xuXHQgIEFQQVsxXSA9IHQgKiBQMTA7XG5cdCAgdCAqPSBlcztcblx0ICBBUEFbMF0gKz0gdCAqIFAwMjtcblx0ICBBUEFbMV0gKz0gdCAqIFAxMTtcblx0ICBBUEFbMl0gPSB0ICogUDIwO1xuXHQgIHJldHVybiBBUEE7XG5cdH1cblxuXHRmdW5jdGlvbiBhdXRobGF0KGJldGEsIEFQQSkge1xuXHQgIHZhciB0ID0gYmV0YSArIGJldGE7XG5cdCAgcmV0dXJuIChiZXRhICsgQVBBWzBdICogTWF0aC5zaW4odCkgKyBBUEFbMV0gKiBNYXRoLnNpbih0ICsgdCkgKyBBUEFbMl0gKiBNYXRoLnNpbih0ICsgdCArIHQpKTtcblx0fVxuXG5cdHZhciBuYW1lcyQxNCA9IFtcIkxhbWJlcnQgQXppbXV0aGFsIEVxdWFsIEFyZWFcIiwgXCJMYW1iZXJ0X0F6aW11dGhhbF9FcXVhbF9BcmVhXCIsIFwibGFlYVwiXTtcblx0dmFyIGxhZWEgPSB7XG5cdCAgaW5pdDogaW5pdCQxMyxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDEyLFxuXHQgIGludmVyc2U6IGludmVyc2UkMTIsXG5cdCAgbmFtZXM6IG5hbWVzJDE0LFxuXHQgIFNfUE9MRTogU19QT0xFLFxuXHQgIE5fUE9MRTogTl9QT0xFLFxuXHQgIEVRVUlUOiBFUVVJVCxcblx0ICBPQkxJUTogT0JMSVFcblx0fTtcblxuXHR2YXIgYXNpbnogPSBmdW5jdGlvbih4KSB7XG5cdCAgaWYgKE1hdGguYWJzKHgpID4gMSkge1xuXHQgICAgeCA9ICh4ID4gMSkgPyAxIDogLTE7XG5cdCAgfVxuXHQgIHJldHVybiBNYXRoLmFzaW4oeCk7XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQxNCgpIHtcblxuXHQgIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cdCAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuXHQgIHRoaXMuZXMgPSAxIC0gTWF0aC5wb3codGhpcy50ZW1wLCAyKTtcblx0ICB0aGlzLmUzID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuXG5cdCAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDEpO1xuXHQgIHRoaXMuY29zX3BvID0gTWF0aC5jb3ModGhpcy5sYXQxKTtcblx0ICB0aGlzLnQxID0gdGhpcy5zaW5fcG87XG5cdCAgdGhpcy5jb24gPSB0aGlzLnNpbl9wbztcblx0ICB0aGlzLm1zMSA9IG1zZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvLCB0aGlzLmNvc19wbyk7XG5cdCAgdGhpcy5xczEgPSBxc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuXG5cdCAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuXHQgIHRoaXMuY29zX3BvID0gTWF0aC5jb3ModGhpcy5sYXQyKTtcblx0ICB0aGlzLnQyID0gdGhpcy5zaW5fcG87XG5cdCAgdGhpcy5tczIgPSBtc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuXHQgIHRoaXMucXMyID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8sIHRoaXMuY29zX3BvKTtcblxuXHQgIHRoaXMuc2luX3BvID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcblx0ICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0MCk7XG5cdCAgdGhpcy50MyA9IHRoaXMuc2luX3BvO1xuXHQgIHRoaXMucXMwID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcG8sIHRoaXMuY29zX3BvKTtcblxuXHQgIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgLSB0aGlzLmxhdDIpID4gRVBTTE4pIHtcblx0ICAgIHRoaXMubnMwID0gKHRoaXMubXMxICogdGhpcy5tczEgLSB0aGlzLm1zMiAqIHRoaXMubXMyKSAvICh0aGlzLnFzMiAtIHRoaXMucXMxKTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICB0aGlzLm5zMCA9IHRoaXMuY29uO1xuXHQgIH1cblx0ICB0aGlzLmMgPSB0aGlzLm1zMSAqIHRoaXMubXMxICsgdGhpcy5uczAgKiB0aGlzLnFzMTtcblx0ICB0aGlzLnJoID0gdGhpcy5hICogTWF0aC5zcXJ0KHRoaXMuYyAtIHRoaXMubnMwICogdGhpcy5xczApIC8gdGhpcy5uczA7XG5cdH1cblxuXHQvKiBBbGJlcnMgQ29uaWNhbCBFcXVhbCBBcmVhIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuXHQgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDEzKHApIHtcblxuXHQgIHZhciBsb24gPSBwLng7XG5cdCAgdmFyIGxhdCA9IHAueTtcblxuXHQgIHRoaXMuc2luX3BoaSA9IE1hdGguc2luKGxhdCk7XG5cdCAgdGhpcy5jb3NfcGhpID0gTWF0aC5jb3MobGF0KTtcblxuXHQgIHZhciBxcyA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BoaSwgdGhpcy5jb3NfcGhpKTtcblx0ICB2YXIgcmgxID0gdGhpcy5hICogTWF0aC5zcXJ0KHRoaXMuYyAtIHRoaXMubnMwICogcXMpIC8gdGhpcy5uczA7XG5cdCAgdmFyIHRoZXRhID0gdGhpcy5uczAgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIHZhciB4ID0gcmgxICogTWF0aC5zaW4odGhldGEpICsgdGhpcy54MDtcblx0ICB2YXIgeSA9IHRoaXMucmggLSByaDEgKiBNYXRoLmNvcyh0aGV0YSkgKyB0aGlzLnkwO1xuXG5cdCAgcC54ID0geDtcblx0ICBwLnkgPSB5O1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW52ZXJzZSQxMyhwKSB7XG5cdCAgdmFyIHJoMSwgcXMsIGNvbiwgdGhldGEsIGxvbiwgbGF0O1xuXG5cdCAgcC54IC09IHRoaXMueDA7XG5cdCAgcC55ID0gdGhpcy5yaCAtIHAueSArIHRoaXMueTA7XG5cdCAgaWYgKHRoaXMubnMwID49IDApIHtcblx0ICAgIHJoMSA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuXHQgICAgY29uID0gMTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICByaDEgPSAtTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgICBjb24gPSAtMTtcblx0ICB9XG5cdCAgdGhldGEgPSAwO1xuXHQgIGlmIChyaDEgIT09IDApIHtcblx0ICAgIHRoZXRhID0gTWF0aC5hdGFuMihjb24gKiBwLngsIGNvbiAqIHAueSk7XG5cdCAgfVxuXHQgIGNvbiA9IHJoMSAqIHRoaXMubnMwIC8gdGhpcy5hO1xuXHQgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgbGF0ID0gTWF0aC5hc2luKCh0aGlzLmMgLSBjb24gKiBjb24pIC8gKDIgKiB0aGlzLm5zMCkpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHFzID0gKHRoaXMuYyAtIGNvbiAqIGNvbikgLyB0aGlzLm5zMDtcblx0ICAgIGxhdCA9IHRoaXMucGhpMXoodGhpcy5lMywgcXMpO1xuXHQgIH1cblxuXHQgIGxvbiA9IGFkanVzdF9sb24odGhldGEgLyB0aGlzLm5zMCArIHRoaXMubG9uZzApO1xuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvKiBGdW5jdGlvbiB0byBjb21wdXRlIHBoaTEsIHRoZSBsYXRpdHVkZSBmb3IgdGhlIGludmVyc2Ugb2YgdGhlXG5cdCAgIEFsYmVycyBDb25pY2FsIEVxdWFsLUFyZWEgcHJvamVjdGlvbi5cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIHBoaTF6KGVjY2VudCwgcXMpIHtcblx0ICB2YXIgc2lucGhpLCBjb3NwaGksIGNvbiwgY29tLCBkcGhpO1xuXHQgIHZhciBwaGkgPSBhc2lueigwLjUgKiBxcyk7XG5cdCAgaWYgKGVjY2VudCA8IEVQU0xOKSB7XG5cdCAgICByZXR1cm4gcGhpO1xuXHQgIH1cblxuXHQgIHZhciBlY2NudHMgPSBlY2NlbnQgKiBlY2NlbnQ7XG5cdCAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMjU7IGkrKykge1xuXHQgICAgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcblx0ICAgIGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG5cdCAgICBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG5cdCAgICBjb20gPSAxIC0gY29uICogY29uO1xuXHQgICAgZHBoaSA9IDAuNSAqIGNvbSAqIGNvbSAvIGNvc3BoaSAqIChxcyAvICgxIC0gZWNjbnRzKSAtIHNpbnBoaSAvIGNvbSArIDAuNSAvIGVjY2VudCAqIE1hdGgubG9nKCgxIC0gY29uKSAvICgxICsgY29uKSkpO1xuXHQgICAgcGhpID0gcGhpICsgZHBoaTtcblx0ICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAxZS03KSB7XG5cdCAgICAgIHJldHVybiBwaGk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiBudWxsO1xuXHR9XG5cblx0dmFyIG5hbWVzJDE1ID0gW1wiQWxiZXJzX0NvbmljX0VxdWFsX0FyZWFcIiwgXCJBbGJlcnNcIiwgXCJhZWFcIl07XG5cdHZhciBhZWEgPSB7XG5cdCAgaW5pdDogaW5pdCQxNCxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDEzLFxuXHQgIGludmVyc2U6IGludmVyc2UkMTMsXG5cdCAgbmFtZXM6IG5hbWVzJDE1LFxuXHQgIHBoaTF6OiBwaGkxelxuXHR9O1xuXG5cdC8qXG5cdCAgcmVmZXJlbmNlOlxuXHQgICAgV29sZnJhbSBNYXRod29ybGQgXCJHbm9tb25pYyBQcm9qZWN0aW9uXCJcblx0ICAgIGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vR25vbW9uaWNQcm9qZWN0aW9uLmh0bWxcblx0ICAgIEFjY2Vzc2VkOiAxMnRoIE5vdmVtYmVyIDIwMDlcblx0ICAqL1xuXHRmdW5jdGlvbiBpbml0JDE1KCkge1xuXG5cdCAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuXHQgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ICB0aGlzLnNpbl9wMTQgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuXHQgIHRoaXMuY29zX3AxNCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG5cdCAgLy8gQXBwcm94aW1hdGlvbiBmb3IgcHJvamVjdGluZyBwb2ludHMgdG8gdGhlIGhvcml6b24gKGluZmluaXR5KVxuXHQgIHRoaXMuaW5maW5pdHlfZGlzdCA9IDEwMDAgKiB0aGlzLmE7XG5cdCAgdGhpcy5yYyA9IDE7XG5cdH1cblxuXHQvKiBHbm9tb25pYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGZvcndhcmQkMTQocCkge1xuXHQgIHZhciBzaW5waGksIGNvc3BoaTsgLyogc2luIGFuZCBjb3MgdmFsdWUgICAgICAgICovXG5cdCAgdmFyIGRsb247IC8qIGRlbHRhIGxvbmdpdHVkZSB2YWx1ZSAgICAgICovXG5cdCAgdmFyIGNvc2xvbjsgLyogY29zIG9mIGxvbmdpdHVkZSAgICAgICAgKi9cblx0ICB2YXIga3NwOyAvKiBzY2FsZSBmYWN0b3IgICAgICAgICAgKi9cblx0ICB2YXIgZztcblx0ICB2YXIgeCwgeTtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cdCAgLyogRm9yd2FyZCBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXG5cdCAgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcblx0ICBjb3NwaGkgPSBNYXRoLmNvcyhsYXQpO1xuXG5cdCAgY29zbG9uID0gTWF0aC5jb3MoZGxvbik7XG5cdCAgZyA9IHRoaXMuc2luX3AxNCAqIHNpbnBoaSArIHRoaXMuY29zX3AxNCAqIGNvc3BoaSAqIGNvc2xvbjtcblx0ICBrc3AgPSAxO1xuXHQgIGlmICgoZyA+IDApIHx8IChNYXRoLmFicyhnKSA8PSBFUFNMTikpIHtcblx0ICAgIHggPSB0aGlzLngwICsgdGhpcy5hICoga3NwICogY29zcGhpICogTWF0aC5zaW4oZGxvbikgLyBnO1xuXHQgICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBrc3AgKiAodGhpcy5jb3NfcDE0ICogc2lucGhpIC0gdGhpcy5zaW5fcDE0ICogY29zcGhpICogY29zbG9uKSAvIGc7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXG5cdCAgICAvLyBQb2ludCBpcyBpbiB0aGUgb3Bwb3NpbmcgaGVtaXNwaGVyZSBhbmQgaXMgdW5wcm9qZWN0YWJsZVxuXHQgICAgLy8gV2Ugc3RpbGwgbmVlZCB0byByZXR1cm4gYSByZWFzb25hYmxlIHBvaW50LCBzbyB3ZSBwcm9qZWN0XG5cdCAgICAvLyB0byBpbmZpbml0eSwgb24gYSBiZWFyaW5nXG5cdCAgICAvLyBlcXVpdmFsZW50IHRvIHRoZSBub3J0aGVybiBoZW1pc3BoZXJlIGVxdWl2YWxlbnRcblx0ICAgIC8vIFRoaXMgaXMgYSByZWFzb25hYmxlIGFwcHJveGltYXRpb24gZm9yIHNob3J0IHNoYXBlcyBhbmQgbGluZXMgdGhhdFxuXHQgICAgLy8gc3RyYWRkbGUgdGhlIGhvcml6b24uXG5cblx0ICAgIHggPSB0aGlzLngwICsgdGhpcy5pbmZpbml0eV9kaXN0ICogY29zcGhpICogTWF0aC5zaW4oZGxvbik7XG5cdCAgICB5ID0gdGhpcy55MCArIHRoaXMuaW5maW5pdHlfZGlzdCAqICh0aGlzLmNvc19wMTQgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTQgKiBjb3NwaGkgKiBjb3Nsb24pO1xuXG5cdCAgfVxuXHQgIHAueCA9IHg7XG5cdCAgcC55ID0geTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdGZ1bmN0aW9uIGludmVyc2UkMTQocCkge1xuXHQgIHZhciByaDsgLyogUmhvICovXG5cdCAgdmFyIHNpbmMsIGNvc2M7XG5cdCAgdmFyIGM7XG5cdCAgdmFyIGxvbiwgbGF0O1xuXG5cdCAgLyogSW52ZXJzZSBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcblx0ICBwLnkgPSAocC55IC0gdGhpcy55MCkgLyB0aGlzLmE7XG5cblx0ICBwLnggLz0gdGhpcy5rMDtcblx0ICBwLnkgLz0gdGhpcy5rMDtcblxuXHQgIGlmICgocmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KSkpIHtcblx0ICAgIGMgPSBNYXRoLmF0YW4yKHJoLCB0aGlzLnJjKTtcblx0ICAgIHNpbmMgPSBNYXRoLnNpbihjKTtcblx0ICAgIGNvc2MgPSBNYXRoLmNvcyhjKTtcblxuXHQgICAgbGF0ID0gYXNpbnooY29zYyAqIHRoaXMuc2luX3AxNCArIChwLnkgKiBzaW5jICogdGhpcy5jb3NfcDE0KSAvIHJoKTtcblx0ICAgIGxvbiA9IE1hdGguYXRhbjIocC54ICogc2luYywgcmggKiB0aGlzLmNvc19wMTQgKiBjb3NjIC0gcC55ICogdGhpcy5zaW5fcDE0ICogc2luYyk7XG5cdCAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBsb24pO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGxhdCA9IHRoaXMucGhpYzA7XG5cdCAgICBsb24gPSAwO1xuXHQgIH1cblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMTYgPSBbXCJnbm9tXCJdO1xuXHR2YXIgZ25vbSA9IHtcblx0ICBpbml0OiBpbml0JDE1LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMTQsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQxNCxcblx0ICBuYW1lczogbmFtZXMkMTZcblx0fTtcblxuXHR2YXIgaXFzZm56ID0gZnVuY3Rpb24oZWNjZW50LCBxKSB7XG5cdCAgdmFyIHRlbXAgPSAxIC0gKDEgLSBlY2NlbnQgKiBlY2NlbnQpIC8gKDIgKiBlY2NlbnQpICogTWF0aC5sb2coKDEgLSBlY2NlbnQpIC8gKDEgKyBlY2NlbnQpKTtcblx0ICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocSkgLSB0ZW1wKSA8IDEuMEUtNikge1xuXHQgICAgaWYgKHEgPCAwKSB7XG5cdCAgICAgIHJldHVybiAoLTEgKiBIQUxGX1BJKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICByZXR1cm4gSEFMRl9QSTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLy92YXIgcGhpID0gMC41KiBxLygxLWVjY2VudCplY2NlbnQpO1xuXHQgIHZhciBwaGkgPSBNYXRoLmFzaW4oMC41ICogcSk7XG5cdCAgdmFyIGRwaGk7XG5cdCAgdmFyIHNpbl9waGk7XG5cdCAgdmFyIGNvc19waGk7XG5cdCAgdmFyIGNvbjtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IDMwOyBpKyspIHtcblx0ICAgIHNpbl9waGkgPSBNYXRoLnNpbihwaGkpO1xuXHQgICAgY29zX3BoaSA9IE1hdGguY29zKHBoaSk7XG5cdCAgICBjb24gPSBlY2NlbnQgKiBzaW5fcGhpO1xuXHQgICAgZHBoaSA9IE1hdGgucG93KDEgLSBjb24gKiBjb24sIDIpIC8gKDIgKiBjb3NfcGhpKSAqIChxIC8gKDEgLSBlY2NlbnQgKiBlY2NlbnQpIC0gc2luX3BoaSAvICgxIC0gY29uICogY29uKSArIDAuNSAvIGVjY2VudCAqIE1hdGgubG9nKCgxIC0gY29uKSAvICgxICsgY29uKSkpO1xuXHQgICAgcGhpICs9IGRwaGk7XG5cdCAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMC4wMDAwMDAwMDAxKSB7XG5cdCAgICAgIHJldHVybiBwaGk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLy9jb25zb2xlLmxvZyhcIklRU0ZOLUNPTlY6TGF0aXR1ZGUgZmFpbGVkIHRvIGNvbnZlcmdlIGFmdGVyIDMwIGl0ZXJhdGlvbnNcIik7XG5cdCAgcmV0dXJuIE5hTjtcblx0fTtcblxuXHQvKlxuXHQgIHJlZmVyZW5jZTpcblx0ICAgIFwiQ2FydG9ncmFwaGljIFByb2plY3Rpb24gUHJvY2VkdXJlcyBmb3IgdGhlIFVOSVggRW52aXJvbm1lbnQtXG5cdCAgICBBIFVzZXIncyBNYW51YWxcIiBieSBHZXJhbGQgSS4gRXZlbmRlbixcblx0ICAgIFVTR1MgT3BlbiBGaWxlIFJlcG9ydCA5MC0yODRhbmQgUmVsZWFzZSA0IEludGVyaW0gUmVwb3J0cyAoMjAwMylcblx0Ki9cblx0ZnVuY3Rpb24gaW5pdCQxNigpIHtcblx0ICAvL25vLW9wXG5cdCAgaWYgKCF0aGlzLnNwaGVyZSkge1xuXHQgICAgdGhpcy5rMCA9IG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpO1xuXHQgIH1cblx0fVxuXG5cdC8qIEN5bGluZHJpY2FsIEVxdWFsIEFyZWEgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5cdCAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDE1KHApIHtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cdCAgdmFyIHgsIHk7XG5cdCAgLyogRm9yd2FyZCBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogZGxvbiAqIE1hdGguY29zKHRoaXMubGF0X3RzKTtcblx0ICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICogTWF0aC5zaW4obGF0KSAvIE1hdGguY29zKHRoaXMubGF0X3RzKTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICB2YXIgcXMgPSBxc2Zueih0aGlzLmUsIE1hdGguc2luKGxhdCkpO1xuXHQgICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiB0aGlzLmswICogZGxvbjtcblx0ICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICogcXMgKiAwLjUgLyB0aGlzLmswO1xuXHQgIH1cblxuXHQgIHAueCA9IHg7XG5cdCAgcC55ID0geTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdC8qIEN5bGluZHJpY2FsIEVxdWFsIEFyZWEgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG5cdCAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBpbnZlcnNlJDE1KHApIHtcblx0ICBwLnggLT0gdGhpcy54MDtcblx0ICBwLnkgLT0gdGhpcy55MDtcblx0ICB2YXIgbG9uLCBsYXQ7XG5cblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChwLnggLyB0aGlzLmEpIC8gTWF0aC5jb3ModGhpcy5sYXRfdHMpKTtcblx0ICAgIGxhdCA9IE1hdGguYXNpbigocC55IC8gdGhpcy5hKSAqIE1hdGguY29zKHRoaXMubGF0X3RzKSk7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgbGF0ID0gaXFzZm56KHRoaXMuZSwgMiAqIHAueSAqIHRoaXMuazAgLyB0aGlzLmEpO1xuXHQgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgcC54IC8gKHRoaXMuYSAqIHRoaXMuazApKTtcblx0ICB9XG5cblx0ICBwLnggPSBsb247XG5cdCAgcC55ID0gbGF0O1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0dmFyIG5hbWVzJDE3ID0gW1wiY2VhXCJdO1xuXHR2YXIgY2VhID0ge1xuXHQgIGluaXQ6IGluaXQkMTYsXG5cdCAgZm9yd2FyZDogZm9yd2FyZCQxNSxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDE1LFxuXHQgIG5hbWVzOiBuYW1lcyQxN1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQkMTcoKSB7XG5cblx0ICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuXHQgIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG5cdCAgdGhpcy5sYXQwID0gdGhpcy5sYXQwIHx8IDA7XG5cdCAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcblx0ICB0aGlzLmxhdF90cyA9IHRoaXMubGF0X3RzIHx8IDA7XG5cdCAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgXCJFcXVpZGlzdGFudCBDeWxpbmRyaWNhbCAoUGxhdGUgQ2FycmUpXCI7XG5cblx0ICB0aGlzLnJjID0gTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xuXHR9XG5cblx0Ly8gZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGZ1bmN0aW9uIGZvcndhcmQkMTYocCkge1xuXG5cdCAgdmFyIGxvbiA9IHAueDtcblx0ICB2YXIgbGF0ID0gcC55O1xuXG5cdCAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIHZhciBkbGF0ID0gYWRqdXN0X2xhdChsYXQgLSB0aGlzLmxhdDApO1xuXHQgIHAueCA9IHRoaXMueDAgKyAodGhpcy5hICogZGxvbiAqIHRoaXMucmMpO1xuXHQgIHAueSA9IHRoaXMueTAgKyAodGhpcy5hICogZGxhdCk7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvLyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ZnVuY3Rpb24gaW52ZXJzZSQxNihwKSB7XG5cblx0ICB2YXIgeCA9IHAueDtcblx0ICB2YXIgeSA9IHAueTtcblxuXHQgIHAueCA9IGFkanVzdF9sb24odGhpcy5sb25nMCArICgoeCAtIHRoaXMueDApIC8gKHRoaXMuYSAqIHRoaXMucmMpKSk7XG5cdCAgcC55ID0gYWRqdXN0X2xhdCh0aGlzLmxhdDAgKyAoKHkgLSB0aGlzLnkwKSAvICh0aGlzLmEpKSk7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMTggPSBbXCJFcXVpcmVjdGFuZ3VsYXJcIiwgXCJFcXVpZGlzdGFudF9DeWxpbmRyaWNhbFwiLCBcImVxY1wiXTtcblx0dmFyIGVxYyA9IHtcblx0ICBpbml0OiBpbml0JDE3LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMTYsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQxNixcblx0ICBuYW1lczogbmFtZXMkMThcblx0fTtcblxuXHR2YXIgTUFYX0lURVIkMiA9IDIwO1xuXG5cdGZ1bmN0aW9uIGluaXQkMTgoKSB7XG5cdCAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuXHQgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ICB0aGlzLnRlbXAgPSB0aGlzLmIgLyB0aGlzLmE7XG5cdCAgdGhpcy5lcyA9IDEgLSBNYXRoLnBvdyh0aGlzLnRlbXAsIDIpOyAvLyBkZXZhaXQgZXRyZSBkYW5zIHRtZXJjLmpzIG1haXMgbiB5IGVzdCBwYXMgZG9uYyBqZSBjb21tZW50ZSBzaW5vbiByZXRvdXIgZGUgdmFsZXVycyBudWxsZXNcblx0ICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG5cdCAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5lMSA9IGUxZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5lMiA9IGUyZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5tbDAgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0MCk7IC8vc2kgcXVlIGRlcyB6ZXJvcyBsZSBjYWxjdWwgbmUgc2UgZmFpdCBwYXNcblx0fVxuXG5cdC8qIFBvbHljb25pYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGZvcndhcmQkMTcocCkge1xuXHQgIHZhciBsb24gPSBwLng7XG5cdCAgdmFyIGxhdCA9IHAueTtcblx0ICB2YXIgeCwgeSwgZWw7XG5cdCAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIGVsID0gZGxvbiAqIE1hdGguc2luKGxhdCk7XG5cdCAgaWYgKHRoaXMuc3BoZXJlKSB7XG5cdCAgICBpZiAoTWF0aC5hYnMobGF0KSA8PSBFUFNMTikge1xuXHQgICAgICB4ID0gdGhpcy5hICogZGxvbjtcblx0ICAgICAgeSA9IC0xICogdGhpcy5hICogdGhpcy5sYXQwO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHggPSB0aGlzLmEgKiBNYXRoLnNpbihlbCkgLyBNYXRoLnRhbihsYXQpO1xuXHQgICAgICB5ID0gdGhpcy5hICogKGFkanVzdF9sYXQobGF0IC0gdGhpcy5sYXQwKSArICgxIC0gTWF0aC5jb3MoZWwpKSAvIE1hdGgudGFuKGxhdCkpO1xuXHQgICAgfVxuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG5cdCAgICAgIHggPSB0aGlzLmEgKiBkbG9uO1xuXHQgICAgICB5ID0gLTEgKiB0aGlzLm1sMDtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICB2YXIgbmwgPSBnTih0aGlzLmEsIHRoaXMuZSwgTWF0aC5zaW4obGF0KSkgLyBNYXRoLnRhbihsYXQpO1xuXHQgICAgICB4ID0gbmwgKiBNYXRoLnNpbihlbCk7XG5cdCAgICAgIHkgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIGxhdCkgLSB0aGlzLm1sMCArIG5sICogKDEgLSBNYXRoLmNvcyhlbCkpO1xuXHQgICAgfVxuXG5cdCAgfVxuXHQgIHAueCA9IHggKyB0aGlzLngwO1xuXHQgIHAueSA9IHkgKyB0aGlzLnkwO1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0LyogSW52ZXJzZSBlcXVhdGlvbnNcblx0ICAtLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGludmVyc2UkMTcocCkge1xuXHQgIHZhciBsb24sIGxhdCwgeCwgeSwgaTtcblx0ICB2YXIgYWwsIGJsO1xuXHQgIHZhciBwaGksIGRwaGk7XG5cdCAgeCA9IHAueCAtIHRoaXMueDA7XG5cdCAgeSA9IHAueSAtIHRoaXMueTA7XG5cblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIGlmIChNYXRoLmFicyh5ICsgdGhpcy5hICogdGhpcy5sYXQwKSA8PSBFUFNMTikge1xuXHQgICAgICBsb24gPSBhZGp1c3RfbG9uKHggLyB0aGlzLmEgKyB0aGlzLmxvbmcwKTtcblx0ICAgICAgbGF0ID0gMDtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICBhbCA9IHRoaXMubGF0MCArIHkgLyB0aGlzLmE7XG5cdCAgICAgIGJsID0geCAqIHggLyB0aGlzLmEgLyB0aGlzLmEgKyBhbCAqIGFsO1xuXHQgICAgICBwaGkgPSBhbDtcblx0ICAgICAgdmFyIHRhbnBoaTtcblx0ICAgICAgZm9yIChpID0gTUFYX0lURVIkMjsgaTsgLS1pKSB7XG5cdCAgICAgICAgdGFucGhpID0gTWF0aC50YW4ocGhpKTtcblx0ICAgICAgICBkcGhpID0gLTEgKiAoYWwgKiAocGhpICogdGFucGhpICsgMSkgLSBwaGkgLSAwLjUgKiAocGhpICogcGhpICsgYmwpICogdGFucGhpKSAvICgocGhpIC0gYWwpIC8gdGFucGhpIC0gMSk7XG5cdCAgICAgICAgcGhpICs9IGRwaGk7XG5cdCAgICAgICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IEVQU0xOKSB7XG5cdCAgICAgICAgICBsYXQgPSBwaGk7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKE1hdGguYXNpbih4ICogTWF0aC50YW4ocGhpKSAvIHRoaXMuYSkpIC8gTWF0aC5zaW4obGF0KSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgaWYgKE1hdGguYWJzKHkgKyB0aGlzLm1sMCkgPD0gRVBTTE4pIHtcblx0ICAgICAgbGF0ID0gMDtcblx0ICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgeCAvIHRoaXMuYSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblxuXHQgICAgICBhbCA9ICh0aGlzLm1sMCArIHkpIC8gdGhpcy5hO1xuXHQgICAgICBibCA9IHggKiB4IC8gdGhpcy5hIC8gdGhpcy5hICsgYWwgKiBhbDtcblx0ICAgICAgcGhpID0gYWw7XG5cdCAgICAgIHZhciBjbCwgbWxuLCBtbG5wLCBtYTtcblx0ICAgICAgdmFyIGNvbjtcblx0ICAgICAgZm9yIChpID0gTUFYX0lURVIkMjsgaTsgLS1pKSB7XG5cdCAgICAgICAgY29uID0gdGhpcy5lICogTWF0aC5zaW4ocGhpKTtcblx0ICAgICAgICBjbCA9IE1hdGguc3FydCgxIC0gY29uICogY29uKSAqIE1hdGgudGFuKHBoaSk7XG5cdCAgICAgICAgbWxuID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBwaGkpO1xuXHQgICAgICAgIG1sbnAgPSB0aGlzLmUwIC0gMiAqIHRoaXMuZTEgKiBNYXRoLmNvcygyICogcGhpKSArIDQgKiB0aGlzLmUyICogTWF0aC5jb3MoNCAqIHBoaSkgLSA2ICogdGhpcy5lMyAqIE1hdGguY29zKDYgKiBwaGkpO1xuXHQgICAgICAgIG1hID0gbWxuIC8gdGhpcy5hO1xuXHQgICAgICAgIGRwaGkgPSAoYWwgKiAoY2wgKiBtYSArIDEpIC0gbWEgLSAwLjUgKiBjbCAqIChtYSAqIG1hICsgYmwpKSAvICh0aGlzLmVzICogTWF0aC5zaW4oMiAqIHBoaSkgKiAobWEgKiBtYSArIGJsIC0gMiAqIGFsICogbWEpIC8gKDQgKiBjbCkgKyAoYWwgLSBtYSkgKiAoY2wgKiBtbG5wIC0gMiAvIE1hdGguc2luKDIgKiBwaGkpKSAtIG1sbnApO1xuXHQgICAgICAgIHBoaSAtPSBkcGhpO1xuXHQgICAgICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSBFUFNMTikge1xuXHQgICAgICAgICAgbGF0ID0gcGhpO1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgLy9sYXQ9cGhpNHoodGhpcy5lLHRoaXMuZTAsdGhpcy5lMSx0aGlzLmUyLHRoaXMuZTMsYWwsYmwsMCwwKTtcblx0ICAgICAgY2wgPSBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBNYXRoLnBvdyhNYXRoLnNpbihsYXQpLCAyKSkgKiBNYXRoLnRhbihsYXQpO1xuXHQgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmFzaW4oeCAqIGNsIC8gdGhpcy5hKSAvIE1hdGguc2luKGxhdCkpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMTkgPSBbXCJQb2x5Y29uaWNcIiwgXCJwb2x5XCJdO1xuXHR2YXIgcG9seSA9IHtcblx0ICBpbml0OiBpbml0JDE4LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMTcsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQxNyxcblx0ICBuYW1lczogbmFtZXMkMTlcblx0fTtcblxuXHQvKlxuXHQgIHJlZmVyZW5jZVxuXHQgICAgRGVwYXJ0bWVudCBvZiBMYW5kIGFuZCBTdXJ2ZXkgVGVjaG5pY2FsIENpcmN1bGFyIDE5NzMvMzJcblx0ICAgICAgaHR0cDovL3d3dy5saW56LmdvdnQubnovZG9jcy9taXNjZWxsYW5lb3VzL256LW1hcC1kZWZpbml0aW9uLnBkZlxuXHQgICAgT1NHIFRlY2huaWNhbCBSZXBvcnQgNC4xXG5cdCAgICAgIGh0dHA6Ly93d3cubGluei5nb3Z0Lm56L2RvY3MvbWlzY2VsbGFuZW91cy9uem1nLnBkZlxuXHQgICovXG5cblx0LyoqXG5cdCAqIGl0ZXJhdGlvbnM6IE51bWJlciBvZiBpdGVyYXRpb25zIHRvIHJlZmluZSBpbnZlcnNlIHRyYW5zZm9ybS5cblx0ICogICAgIDAgLT4ga20gYWNjdXJhY3lcblx0ICogICAgIDEgLT4gbSBhY2N1cmFjeSAtLSBzdWl0YWJsZSBmb3IgbW9zdCBtYXBwaW5nIGFwcGxpY2F0aW9uc1xuXHQgKiAgICAgMiAtPiBtbSBhY2N1cmFjeVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGluaXQkMTkoKSB7XG5cdCAgdGhpcy5BID0gW107XG5cdCAgdGhpcy5BWzFdID0gMC42Mzk5MTc1MDczO1xuXHQgIHRoaXMuQVsyXSA9IC0wLjEzNTg3OTc2MTM7XG5cdCAgdGhpcy5BWzNdID0gMC4wNjMyOTQ0MDk7XG5cdCAgdGhpcy5BWzRdID0gLTAuMDI1MjY4NTM7XG5cdCAgdGhpcy5BWzVdID0gMC4wMTE3ODc5O1xuXHQgIHRoaXMuQVs2XSA9IC0wLjAwNTUxNjE7XG5cdCAgdGhpcy5BWzddID0gMC4wMDI2OTA2O1xuXHQgIHRoaXMuQVs4XSA9IC0wLjAwMTMzMztcblx0ICB0aGlzLkFbOV0gPSAwLjAwMDY3O1xuXHQgIHRoaXMuQVsxMF0gPSAtMC4wMDAzNDtcblxuXHQgIHRoaXMuQl9yZSA9IFtdO1xuXHQgIHRoaXMuQl9pbSA9IFtdO1xuXHQgIHRoaXMuQl9yZVsxXSA9IDAuNzU1Nzg1MzIyODtcblx0ICB0aGlzLkJfaW1bMV0gPSAwO1xuXHQgIHRoaXMuQl9yZVsyXSA9IDAuMjQ5MjA0NjQ2O1xuXHQgIHRoaXMuQl9pbVsyXSA9IDAuMDAzMzcxNTA3O1xuXHQgIHRoaXMuQl9yZVszXSA9IC0wLjAwMTU0MTczOTtcblx0ICB0aGlzLkJfaW1bM10gPSAwLjA0MTA1ODU2MDtcblx0ICB0aGlzLkJfcmVbNF0gPSAtMC4xMDE2MjkwNztcblx0ICB0aGlzLkJfaW1bNF0gPSAwLjAxNzI3NjA5O1xuXHQgIHRoaXMuQl9yZVs1XSA9IC0wLjI2NjIzNDg5O1xuXHQgIHRoaXMuQl9pbVs1XSA9IC0wLjM2MjQ5MjE4O1xuXHQgIHRoaXMuQl9yZVs2XSA9IC0wLjY4NzA5ODM7XG5cdCAgdGhpcy5CX2ltWzZdID0gLTEuMTY1MTk2NztcblxuXHQgIHRoaXMuQ19yZSA9IFtdO1xuXHQgIHRoaXMuQ19pbSA9IFtdO1xuXHQgIHRoaXMuQ19yZVsxXSA9IDEuMzIzMTI3MDQzOTtcblx0ICB0aGlzLkNfaW1bMV0gPSAwO1xuXHQgIHRoaXMuQ19yZVsyXSA9IC0wLjU3NzI0NTc4OTtcblx0ICB0aGlzLkNfaW1bMl0gPSAtMC4wMDc4MDk1OTg7XG5cdCAgdGhpcy5DX3JlWzNdID0gMC41MDgzMDc1MTM7XG5cdCAgdGhpcy5DX2ltWzNdID0gLTAuMTEyMjA4OTUyO1xuXHQgIHRoaXMuQ19yZVs0XSA9IC0wLjE1MDk0NzYyO1xuXHQgIHRoaXMuQ19pbVs0XSA9IDAuMTgyMDA2MDI7XG5cdCAgdGhpcy5DX3JlWzVdID0gMS4wMTQxODE3OTtcblx0ICB0aGlzLkNfaW1bNV0gPSAxLjY0NDk3Njk2O1xuXHQgIHRoaXMuQ19yZVs2XSA9IDEuOTY2MDU0OTtcblx0ICB0aGlzLkNfaW1bNl0gPSAyLjUxMjc2NDU7XG5cblx0ICB0aGlzLkQgPSBbXTtcblx0ICB0aGlzLkRbMV0gPSAxLjU2MjcwMTQyNDM7XG5cdCAgdGhpcy5EWzJdID0gMC41MTg1NDA2Mzk4O1xuXHQgIHRoaXMuRFszXSA9IC0wLjAzMzMzMDk4O1xuXHQgIHRoaXMuRFs0XSA9IC0wLjEwNTI5MDY7XG5cdCAgdGhpcy5EWzVdID0gLTAuMDM2ODU5NDtcblx0ICB0aGlzLkRbNl0gPSAwLjAwNzMxNztcblx0ICB0aGlzLkRbN10gPSAwLjAxMjIwO1xuXHQgIHRoaXMuRFs4XSA9IDAuMDAzOTQ7XG5cdCAgdGhpcy5EWzldID0gLTAuMDAxMztcblx0fVxuXG5cdC8qKlxuXHQgICAgTmV3IFplYWxhbmQgTWFwIEdyaWQgRm9yd2FyZCAgLSBsb25nL2xhdCB0byB4L3lcblx0ICAgIGxvbmcvbGF0IGluIHJhZGlhbnNcblx0ICAqL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDE4KHApIHtcblx0ICB2YXIgbjtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cblx0ICB2YXIgZGVsdGFfbGF0ID0gbGF0IC0gdGhpcy5sYXQwO1xuXHQgIHZhciBkZWx0YV9sb24gPSBsb24gLSB0aGlzLmxvbmcwO1xuXG5cdCAgLy8gMS4gQ2FsY3VsYXRlIGRfcGhpIGFuZCBkX3BzaSAgICAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBkX2xhbWJkYVxuXHQgIC8vIEZvciB0aGlzIGFsZ29yaXRobSwgZGVsdGFfbGF0aXR1ZGUgaXMgaW4gc2Vjb25kcyBvZiBhcmMgeCAxMC01LCBzbyB3ZSBuZWVkIHRvIHNjYWxlIHRvIHRob3NlIHVuaXRzLiBMb25naXR1ZGUgaXMgcmFkaWFucy5cblx0ICB2YXIgZF9waGkgPSBkZWx0YV9sYXQgLyBTRUNfVE9fUkFEICogMUUtNTtcblx0ICB2YXIgZF9sYW1iZGEgPSBkZWx0YV9sb247XG5cdCAgdmFyIGRfcGhpX24gPSAxOyAvLyBkX3BoaV4wXG5cblx0ICB2YXIgZF9wc2kgPSAwO1xuXHQgIGZvciAobiA9IDE7IG4gPD0gMTA7IG4rKykge1xuXHQgICAgZF9waGlfbiA9IGRfcGhpX24gKiBkX3BoaTtcblx0ICAgIGRfcHNpID0gZF9wc2kgKyB0aGlzLkFbbl0gKiBkX3BoaV9uO1xuXHQgIH1cblxuXHQgIC8vIDIuIENhbGN1bGF0ZSB0aGV0YVxuXHQgIHZhciB0aF9yZSA9IGRfcHNpO1xuXHQgIHZhciB0aF9pbSA9IGRfbGFtYmRhO1xuXG5cdCAgLy8gMy4gQ2FsY3VsYXRlIHpcblx0ICB2YXIgdGhfbl9yZSA9IDE7XG5cdCAgdmFyIHRoX25faW0gPSAwOyAvLyB0aGV0YV4wXG5cdCAgdmFyIHRoX25fcmUxO1xuXHQgIHZhciB0aF9uX2ltMTtcblxuXHQgIHZhciB6X3JlID0gMDtcblx0ICB2YXIgel9pbSA9IDA7XG5cdCAgZm9yIChuID0gMTsgbiA8PSA2OyBuKyspIHtcblx0ICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuXHQgICAgdGhfbl9pbTEgPSB0aF9uX2ltICogdGhfcmUgKyB0aF9uX3JlICogdGhfaW07XG5cdCAgICB0aF9uX3JlID0gdGhfbl9yZTE7XG5cdCAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG5cdCAgICB6X3JlID0gel9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25fcmUgLSB0aGlzLkJfaW1bbl0gKiB0aF9uX2ltO1xuXHQgICAgel9pbSA9IHpfaW0gKyB0aGlzLkJfaW1bbl0gKiB0aF9uX3JlICsgdGhpcy5CX3JlW25dICogdGhfbl9pbTtcblx0ICB9XG5cblx0ICAvLyA0LiBDYWxjdWxhdGUgZWFzdGluZyBhbmQgbm9ydGhpbmdcblx0ICBwLnggPSAoel9pbSAqIHRoaXMuYSkgKyB0aGlzLngwO1xuXHQgIHAueSA9ICh6X3JlICogdGhpcy5hKSArIHRoaXMueTA7XG5cblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdC8qKlxuXHQgICAgTmV3IFplYWxhbmQgTWFwIEdyaWQgSW52ZXJzZSAgLSAgeC95IHRvIGxvbmcvbGF0XG5cdCAgKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQxOChwKSB7XG5cdCAgdmFyIG47XG5cdCAgdmFyIHggPSBwLng7XG5cdCAgdmFyIHkgPSBwLnk7XG5cblx0ICB2YXIgZGVsdGFfeCA9IHggLSB0aGlzLngwO1xuXHQgIHZhciBkZWx0YV95ID0geSAtIHRoaXMueTA7XG5cblx0ICAvLyAxLiBDYWxjdWxhdGUgelxuXHQgIHZhciB6X3JlID0gZGVsdGFfeSAvIHRoaXMuYTtcblx0ICB2YXIgel9pbSA9IGRlbHRhX3ggLyB0aGlzLmE7XG5cblx0ICAvLyAyYS4gQ2FsY3VsYXRlIHRoZXRhIC0gZmlyc3QgYXBwcm94aW1hdGlvbiBnaXZlcyBrbSBhY2N1cmFjeVxuXHQgIHZhciB6X25fcmUgPSAxO1xuXHQgIHZhciB6X25faW0gPSAwOyAvLyB6XjBcblx0ICB2YXIgel9uX3JlMTtcblx0ICB2YXIgel9uX2ltMTtcblxuXHQgIHZhciB0aF9yZSA9IDA7XG5cdCAgdmFyIHRoX2ltID0gMDtcblx0ICBmb3IgKG4gPSAxOyBuIDw9IDY7IG4rKykge1xuXHQgICAgel9uX3JlMSA9IHpfbl9yZSAqIHpfcmUgLSB6X25faW0gKiB6X2ltO1xuXHQgICAgel9uX2ltMSA9IHpfbl9pbSAqIHpfcmUgKyB6X25fcmUgKiB6X2ltO1xuXHQgICAgel9uX3JlID0gel9uX3JlMTtcblx0ICAgIHpfbl9pbSA9IHpfbl9pbTE7XG5cdCAgICB0aF9yZSA9IHRoX3JlICsgdGhpcy5DX3JlW25dICogel9uX3JlIC0gdGhpcy5DX2ltW25dICogel9uX2ltO1xuXHQgICAgdGhfaW0gPSB0aF9pbSArIHRoaXMuQ19pbVtuXSAqIHpfbl9yZSArIHRoaXMuQ19yZVtuXSAqIHpfbl9pbTtcblx0ICB9XG5cblx0ICAvLyAyYi4gSXRlcmF0ZSB0byByZWZpbmUgdGhlIGFjY3VyYWN5IG9mIHRoZSBjYWxjdWxhdGlvblxuXHQgIC8vICAgICAgICAwIGl0ZXJhdGlvbnMgZ2l2ZXMga20gYWNjdXJhY3lcblx0ICAvLyAgICAgICAgMSBpdGVyYXRpb24gZ2l2ZXMgbSBhY2N1cmFjeSAtLSBnb29kIGVub3VnaCBmb3IgbW9zdCBtYXBwaW5nIGFwcGxpY2F0aW9uc1xuXHQgIC8vICAgICAgICAyIGl0ZXJhdGlvbnMgYml2ZXMgbW0gYWNjdXJhY3lcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlcmF0aW9uczsgaSsrKSB7XG5cdCAgICB2YXIgdGhfbl9yZSA9IHRoX3JlO1xuXHQgICAgdmFyIHRoX25faW0gPSB0aF9pbTtcblx0ICAgIHZhciB0aF9uX3JlMTtcblx0ICAgIHZhciB0aF9uX2ltMTtcblxuXHQgICAgdmFyIG51bV9yZSA9IHpfcmU7XG5cdCAgICB2YXIgbnVtX2ltID0gel9pbTtcblx0ICAgIGZvciAobiA9IDI7IG4gPD0gNjsgbisrKSB7XG5cdCAgICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuXHQgICAgICB0aF9uX2ltMSA9IHRoX25faW0gKiB0aF9yZSArIHRoX25fcmUgKiB0aF9pbTtcblx0ICAgICAgdGhfbl9yZSA9IHRoX25fcmUxO1xuXHQgICAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG5cdCAgICAgIG51bV9yZSA9IG51bV9yZSArIChuIC0gMSkgKiAodGhpcy5CX3JlW25dICogdGhfbl9yZSAtIHRoaXMuQl9pbVtuXSAqIHRoX25faW0pO1xuXHQgICAgICBudW1faW0gPSBudW1faW0gKyAobiAtIDEpICogKHRoaXMuQl9pbVtuXSAqIHRoX25fcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX2ltKTtcblx0ICAgIH1cblxuXHQgICAgdGhfbl9yZSA9IDE7XG5cdCAgICB0aF9uX2ltID0gMDtcblx0ICAgIHZhciBkZW5fcmUgPSB0aGlzLkJfcmVbMV07XG5cdCAgICB2YXIgZGVuX2ltID0gdGhpcy5CX2ltWzFdO1xuXHQgICAgZm9yIChuID0gMjsgbiA8PSA2OyBuKyspIHtcblx0ICAgICAgdGhfbl9yZTEgPSB0aF9uX3JlICogdGhfcmUgLSB0aF9uX2ltICogdGhfaW07XG5cdCAgICAgIHRoX25faW0xID0gdGhfbl9pbSAqIHRoX3JlICsgdGhfbl9yZSAqIHRoX2ltO1xuXHQgICAgICB0aF9uX3JlID0gdGhfbl9yZTE7XG5cdCAgICAgIHRoX25faW0gPSB0aF9uX2ltMTtcblx0ICAgICAgZGVuX3JlID0gZGVuX3JlICsgbiAqICh0aGlzLkJfcmVbbl0gKiB0aF9uX3JlIC0gdGhpcy5CX2ltW25dICogdGhfbl9pbSk7XG5cdCAgICAgIGRlbl9pbSA9IGRlbl9pbSArIG4gKiAodGhpcy5CX2ltW25dICogdGhfbl9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25faW0pO1xuXHQgICAgfVxuXG5cdCAgICAvLyBDb21wbGV4IGRpdmlzaW9uXG5cdCAgICB2YXIgZGVuMiA9IGRlbl9yZSAqIGRlbl9yZSArIGRlbl9pbSAqIGRlbl9pbTtcblx0ICAgIHRoX3JlID0gKG51bV9yZSAqIGRlbl9yZSArIG51bV9pbSAqIGRlbl9pbSkgLyBkZW4yO1xuXHQgICAgdGhfaW0gPSAobnVtX2ltICogZGVuX3JlIC0gbnVtX3JlICogZGVuX2ltKSAvIGRlbjI7XG5cdCAgfVxuXG5cdCAgLy8gMy4gQ2FsY3VsYXRlIGRfcGhpICAgICAgICAgICAgICAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgZF9sYW1iZGFcblx0ICB2YXIgZF9wc2kgPSB0aF9yZTtcblx0ICB2YXIgZF9sYW1iZGEgPSB0aF9pbTtcblx0ICB2YXIgZF9wc2lfbiA9IDE7IC8vIGRfcHNpXjBcblxuXHQgIHZhciBkX3BoaSA9IDA7XG5cdCAgZm9yIChuID0gMTsgbiA8PSA5OyBuKyspIHtcblx0ICAgIGRfcHNpX24gPSBkX3BzaV9uICogZF9wc2k7XG5cdCAgICBkX3BoaSA9IGRfcGhpICsgdGhpcy5EW25dICogZF9wc2lfbjtcblx0ICB9XG5cblx0ICAvLyA0LiBDYWxjdWxhdGUgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZVxuXHQgIC8vIGRfcGhpIGlzIGNhbGN1YXRlZCBpbiBzZWNvbmQgb2YgYXJjICogMTBeLTUsIHNvIHdlIG5lZWQgdG8gc2NhbGUgYmFjayB0byByYWRpYW5zLiBkX2xhbWJkYSBpcyBpbiByYWRpYW5zLlxuXHQgIHZhciBsYXQgPSB0aGlzLmxhdDAgKyAoZF9waGkgKiBTRUNfVE9fUkFEICogMUU1KTtcblx0ICB2YXIgbG9uID0gdGhpcy5sb25nMCArIGRfbGFtYmRhO1xuXG5cdCAgcC54ID0gbG9uO1xuXHQgIHAueSA9IGxhdDtcblxuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0dmFyIG5hbWVzJDIwID0gW1wiTmV3X1plYWxhbmRfTWFwX0dyaWRcIiwgXCJuem1nXCJdO1xuXHR2YXIgbnptZyA9IHtcblx0ICBpbml0OiBpbml0JDE5LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMTgsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQxOCxcblx0ICBuYW1lczogbmFtZXMkMjBcblx0fTtcblxuXHQvKlxuXHQgIHJlZmVyZW5jZVxuXHQgICAgXCJOZXcgRXF1YWwtQXJlYSBNYXAgUHJvamVjdGlvbnMgZm9yIE5vbmNpcmN1bGFyIFJlZ2lvbnNcIiwgSm9obiBQLiBTbnlkZXIsXG5cdCAgICBUaGUgQW1lcmljYW4gQ2FydG9ncmFwaGVyLCBWb2wgMTUsIE5vLiA0LCBPY3RvYmVyIDE5ODgsIHBwLiAzNDEtMzU1LlxuXHQgICovXG5cblxuXHQvKiBJbml0aWFsaXplIHRoZSBNaWxsZXIgQ3lsaW5kcmljYWwgcHJvamVjdGlvblxuXHQgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBpbml0JDIwKCkge1xuXHQgIC8vbm8tb3Bcblx0fVxuXG5cdC8qIE1pbGxlciBDeWxpbmRyaWNhbCBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGZvcndhcmQkMTkocCkge1xuXHQgIHZhciBsb24gPSBwLng7XG5cdCAgdmFyIGxhdCA9IHAueTtcblx0ICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuXHQgICAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG5cdCAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIHZhciB4ID0gdGhpcy54MCArIHRoaXMuYSAqIGRsb247XG5cdCAgdmFyIHkgPSB0aGlzLnkwICsgdGhpcy5hICogTWF0aC5sb2coTWF0aC50YW4oKE1hdGguUEkgLyA0KSArIChsYXQgLyAyLjUpKSkgKiAxLjI1O1xuXG5cdCAgcC54ID0geDtcblx0ICBwLnkgPSB5O1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0LyogTWlsbGVyIEN5bGluZHJpY2FsIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuXHQgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQxOShwKSB7XG5cdCAgcC54IC09IHRoaXMueDA7XG5cdCAgcC55IC09IHRoaXMueTA7XG5cblx0ICB2YXIgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgcC54IC8gdGhpcy5hKTtcblx0ICB2YXIgbGF0ID0gMi41ICogKE1hdGguYXRhbihNYXRoLmV4cCgwLjggKiBwLnkgLyB0aGlzLmEpKSAtIE1hdGguUEkgLyA0KTtcblxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMjEgPSBbXCJNaWxsZXJfQ3lsaW5kcmljYWxcIiwgXCJtaWxsXCJdO1xuXHR2YXIgbWlsbCA9IHtcblx0ICBpbml0OiBpbml0JDIwLFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMTksXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQxOSxcblx0ICBuYW1lczogbmFtZXMkMjFcblx0fTtcblxuXHR2YXIgTUFYX0lURVIkMyA9IDIwO1xuXHRmdW5jdGlvbiBpbml0JDIxKCkge1xuXHQgIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2Vcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cblx0ICBpZiAoIXRoaXMuc3BoZXJlKSB7XG5cdCAgICB0aGlzLmVuID0gcGpfZW5mbih0aGlzLmVzKTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICB0aGlzLm4gPSAxO1xuXHQgICAgdGhpcy5tID0gMDtcblx0ICAgIHRoaXMuZXMgPSAwO1xuXHQgICAgdGhpcy5DX3kgPSBNYXRoLnNxcnQoKHRoaXMubSArIDEpIC8gdGhpcy5uKTtcblx0ICAgIHRoaXMuQ194ID0gdGhpcy5DX3kgLyAodGhpcy5tICsgMSk7XG5cdCAgfVxuXG5cdH1cblxuXHQvKiBTaW51c29pZGFsIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuXHQgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gZm9yd2FyZCQyMChwKSB7XG5cdCAgdmFyIHgsIHk7XG5cdCAgdmFyIGxvbiA9IHAueDtcblx0ICB2YXIgbGF0ID0gcC55O1xuXHQgIC8qIEZvcndhcmQgZXF1YXRpb25zXG5cdCAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG5cdCAgbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblxuXHQgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgaWYgKCF0aGlzLm0pIHtcblx0ICAgICAgbGF0ID0gdGhpcy5uICE9PSAxID8gTWF0aC5hc2luKHRoaXMubiAqIE1hdGguc2luKGxhdCkpIDogbGF0O1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHZhciBrID0gdGhpcy5uICogTWF0aC5zaW4obGF0KTtcblx0ICAgICAgZm9yICh2YXIgaSA9IE1BWF9JVEVSJDM7IGk7IC0taSkge1xuXHQgICAgICAgIHZhciBWID0gKHRoaXMubSAqIGxhdCArIE1hdGguc2luKGxhdCkgLSBrKSAvICh0aGlzLm0gKyBNYXRoLmNvcyhsYXQpKTtcblx0ICAgICAgICBsYXQgLT0gVjtcblx0ICAgICAgICBpZiAoTWF0aC5hYnMoVikgPCBFUFNMTikge1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICB4ID0gdGhpcy5hICogdGhpcy5DX3ggKiBsb24gKiAodGhpcy5tICsgTWF0aC5jb3MobGF0KSk7XG5cdCAgICB5ID0gdGhpcy5hICogdGhpcy5DX3kgKiBsYXQ7XG5cblx0ICB9XG5cdCAgZWxzZSB7XG5cblx0ICAgIHZhciBzID0gTWF0aC5zaW4obGF0KTtcblx0ICAgIHZhciBjID0gTWF0aC5jb3MobGF0KTtcblx0ICAgIHkgPSB0aGlzLmEgKiBwal9tbGZuKGxhdCwgcywgYywgdGhpcy5lbik7XG5cdCAgICB4ID0gdGhpcy5hICogbG9uICogYyAvIE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHMgKiBzKTtcblx0ICB9XG5cblx0ICBwLnggPSB4O1xuXHQgIHAueSA9IHk7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHRmdW5jdGlvbiBpbnZlcnNlJDIwKHApIHtcblx0ICB2YXIgbGF0LCB0ZW1wLCBsb24sIHM7XG5cblx0ICBwLnggLT0gdGhpcy54MDtcblx0ICBsb24gPSBwLnggLyB0aGlzLmE7XG5cdCAgcC55IC09IHRoaXMueTA7XG5cdCAgbGF0ID0gcC55IC8gdGhpcy5hO1xuXG5cdCAgaWYgKHRoaXMuc3BoZXJlKSB7XG5cdCAgICBsYXQgLz0gdGhpcy5DX3k7XG5cdCAgICBsb24gPSBsb24gLyAodGhpcy5DX3ggKiAodGhpcy5tICsgTWF0aC5jb3MobGF0KSkpO1xuXHQgICAgaWYgKHRoaXMubSkge1xuXHQgICAgICBsYXQgPSBhc2lueigodGhpcy5tICogbGF0ICsgTWF0aC5zaW4obGF0KSkgLyB0aGlzLm4pO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAodGhpcy5uICE9PSAxKSB7XG5cdCAgICAgIGxhdCA9IGFzaW56KE1hdGguc2luKGxhdCkgLyB0aGlzLm4pO1xuXHQgICAgfVxuXHQgICAgbG9uID0gYWRqdXN0X2xvbihsb24gKyB0aGlzLmxvbmcwKTtcblx0ICAgIGxhdCA9IGFkanVzdF9sYXQobGF0KTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBsYXQgPSBwal9pbnZfbWxmbihwLnkgLyB0aGlzLmEsIHRoaXMuZXMsIHRoaXMuZW4pO1xuXHQgICAgcyA9IE1hdGguYWJzKGxhdCk7XG5cdCAgICBpZiAocyA8IEhBTEZfUEkpIHtcblx0ICAgICAgcyA9IE1hdGguc2luKGxhdCk7XG5cdCAgICAgIHRlbXAgPSB0aGlzLmxvbmcwICsgcC54ICogTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogcyAqIHMpIC8gKHRoaXMuYSAqIE1hdGguY29zKGxhdCkpO1xuXHQgICAgICAvL3RlbXAgPSB0aGlzLmxvbmcwICsgcC54IC8gKHRoaXMuYSAqIE1hdGguY29zKGxhdCkpO1xuXHQgICAgICBsb24gPSBhZGp1c3RfbG9uKHRlbXApO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoKHMgLSBFUFNMTikgPCBIQUxGX1BJKSB7XG5cdCAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMjIgPSBbXCJTaW51c29pZGFsXCIsIFwic2ludVwiXTtcblx0dmFyIHNpbnUgPSB7XG5cdCAgaW5pdDogaW5pdCQyMSxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDIwLFxuXHQgIGludmVyc2U6IGludmVyc2UkMjAsXG5cdCAgbmFtZXM6IG5hbWVzJDIyXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQyMigpIHt9XG5cdC8qIE1vbGx3ZWlkZSBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDIxKHApIHtcblxuXHQgIC8qIEZvcndhcmQgZXF1YXRpb25zXG5cdCAgICAgIC0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cblx0ICB2YXIgZGVsdGFfbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblx0ICB2YXIgdGhldGEgPSBsYXQ7XG5cdCAgdmFyIGNvbiA9IE1hdGguUEkgKiBNYXRoLnNpbihsYXQpO1xuXG5cdCAgLyogSXRlcmF0ZSB1c2luZyB0aGUgTmV3dG9uLVJhcGhzb24gbWV0aG9kIHRvIGZpbmQgdGhldGFcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHdoaWxlICh0cnVlKSB7XG5cdCAgICB2YXIgZGVsdGFfdGhldGEgPSAtKHRoZXRhICsgTWF0aC5zaW4odGhldGEpIC0gY29uKSAvICgxICsgTWF0aC5jb3ModGhldGEpKTtcblx0ICAgIHRoZXRhICs9IGRlbHRhX3RoZXRhO1xuXHQgICAgaWYgKE1hdGguYWJzKGRlbHRhX3RoZXRhKSA8IEVQU0xOKSB7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHQgIH1cblx0ICB0aGV0YSAvPSAyO1xuXG5cdCAgLyogSWYgdGhlIGxhdGl0dWRlIGlzIDkwIGRlZywgZm9yY2UgdGhlIHggY29vcmRpbmF0ZSB0byBiZSBcIjAgKyBmYWxzZSBlYXN0aW5nXCJcblx0ICAgICAgIHRoaXMgaXMgZG9uZSBoZXJlIGJlY2F1c2Ugb2YgcHJlY2lzaW9uIHByb2JsZW1zIHdpdGggXCJjb3ModGhldGEpXCJcblx0ICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ICBpZiAoTWF0aC5QSSAvIDIgLSBNYXRoLmFicyhsYXQpIDwgRVBTTE4pIHtcblx0ICAgIGRlbHRhX2xvbiA9IDA7XG5cdCAgfVxuXHQgIHZhciB4ID0gMC45MDAzMTYzMTYxNTggKiB0aGlzLmEgKiBkZWx0YV9sb24gKiBNYXRoLmNvcyh0aGV0YSkgKyB0aGlzLngwO1xuXHQgIHZhciB5ID0gMS40MTQyMTM1NjIzNzMxICogdGhpcy5hICogTWF0aC5zaW4odGhldGEpICsgdGhpcy55MDtcblxuXHQgIHAueCA9IHg7XG5cdCAgcC55ID0geTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdGZ1bmN0aW9uIGludmVyc2UkMjEocCkge1xuXHQgIHZhciB0aGV0YTtcblx0ICB2YXIgYXJnO1xuXG5cdCAgLyogSW52ZXJzZSBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHAueCAtPSB0aGlzLngwO1xuXHQgIHAueSAtPSB0aGlzLnkwO1xuXHQgIGFyZyA9IHAueSAvICgxLjQxNDIxMzU2MjM3MzEgKiB0aGlzLmEpO1xuXG5cdCAgLyogQmVjYXVzZSBvZiBkaXZpc2lvbiBieSB6ZXJvIHByb2JsZW1zLCAnYXJnJyBjYW4gbm90IGJlIDEuICBUaGVyZWZvcmVcblx0ICAgICAgIGEgbnVtYmVyIHZlcnkgY2xvc2UgdG8gb25lIGlzIHVzZWQgaW5zdGVhZC5cblx0ICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIGlmIChNYXRoLmFicyhhcmcpID4gMC45OTk5OTk5OTk5OTkpIHtcblx0ICAgIGFyZyA9IDAuOTk5OTk5OTk5OTk5O1xuXHQgIH1cblx0ICB0aGV0YSA9IE1hdGguYXNpbihhcmcpO1xuXHQgIHZhciBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAocC54IC8gKDAuOTAwMzE2MzE2MTU4ICogdGhpcy5hICogTWF0aC5jb3ModGhldGEpKSkpO1xuXHQgIGlmIChsb24gPCAoLU1hdGguUEkpKSB7XG5cdCAgICBsb24gPSAtTWF0aC5QSTtcblx0ICB9XG5cdCAgaWYgKGxvbiA+IE1hdGguUEkpIHtcblx0ICAgIGxvbiA9IE1hdGguUEk7XG5cdCAgfVxuXHQgIGFyZyA9ICgyICogdGhldGEgKyBNYXRoLnNpbigyICogdGhldGEpKSAvIE1hdGguUEk7XG5cdCAgaWYgKE1hdGguYWJzKGFyZykgPiAxKSB7XG5cdCAgICBhcmcgPSAxO1xuXHQgIH1cblx0ICB2YXIgbGF0ID0gTWF0aC5hc2luKGFyZyk7XG5cblx0ICBwLnggPSBsb247XG5cdCAgcC55ID0gbGF0O1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0dmFyIG5hbWVzJDIzID0gW1wiTW9sbHdlaWRlXCIsIFwibW9sbFwiXTtcblx0dmFyIG1vbGwgPSB7XG5cdCAgaW5pdDogaW5pdCQyMixcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDIxLFxuXHQgIGludmVyc2U6IGludmVyc2UkMjEsXG5cdCAgbmFtZXM6IG5hbWVzJDIzXG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQyMygpIHtcblxuXHQgIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2Vcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdCAgLy8gU3RhbmRhcmQgUGFyYWxsZWxzIGNhbm5vdCBiZSBlcXVhbCBhbmQgb24gb3Bwb3NpdGUgc2lkZXMgb2YgdGhlIGVxdWF0b3Jcblx0ICBpZiAoTWF0aC5hYnModGhpcy5sYXQxICsgdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXHQgIHRoaXMubGF0MiA9IHRoaXMubGF0MiB8fCB0aGlzLmxhdDE7XG5cdCAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuXHQgIHRoaXMuZXMgPSAxIC0gTWF0aC5wb3codGhpcy50ZW1wLCAyKTtcblx0ICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG5cdCAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5lMSA9IGUxZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5lMiA9IGUyZm4odGhpcy5lcyk7XG5cdCAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG5cblx0ICB0aGlzLnNpbnBoaSA9IE1hdGguc2luKHRoaXMubGF0MSk7XG5cdCAgdGhpcy5jb3NwaGkgPSBNYXRoLmNvcyh0aGlzLmxhdDEpO1xuXG5cdCAgdGhpcy5tczEgPSBtc2Zueih0aGlzLmUsIHRoaXMuc2lucGhpLCB0aGlzLmNvc3BoaSk7XG5cdCAgdGhpcy5tbDEgPSBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHRoaXMubGF0MSk7XG5cblx0ICBpZiAoTWF0aC5hYnModGhpcy5sYXQxIC0gdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG5cdCAgICB0aGlzLm5zID0gdGhpcy5zaW5waGk7XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgdGhpcy5zaW5waGkgPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuXHQgICAgdGhpcy5jb3NwaGkgPSBNYXRoLmNvcyh0aGlzLmxhdDIpO1xuXHQgICAgdGhpcy5tczIgPSBtc2Zueih0aGlzLmUsIHRoaXMuc2lucGhpLCB0aGlzLmNvc3BoaSk7XG5cdCAgICB0aGlzLm1sMiA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQyKTtcblx0ICAgIHRoaXMubnMgPSAodGhpcy5tczEgLSB0aGlzLm1zMikgLyAodGhpcy5tbDIgLSB0aGlzLm1sMSk7XG5cdCAgfVxuXHQgIHRoaXMuZyA9IHRoaXMubWwxICsgdGhpcy5tczEgLyB0aGlzLm5zO1xuXHQgIHRoaXMubWwwID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDApO1xuXHQgIHRoaXMucmggPSB0aGlzLmEgKiAodGhpcy5nIC0gdGhpcy5tbDApO1xuXHR9XG5cblx0LyogRXF1aWRpc3RhbnQgQ29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5cdCAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBmb3J3YXJkJDIyKHApIHtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cdCAgdmFyIHJoMTtcblxuXHQgIC8qIEZvcndhcmQgZXF1YXRpb25zXG5cdCAgICAgIC0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIHJoMSA9IHRoaXMuYSAqICh0aGlzLmcgLSBsYXQpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHZhciBtbCA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgbGF0KTtcblx0ICAgIHJoMSA9IHRoaXMuYSAqICh0aGlzLmcgLSBtbCk7XG5cdCAgfVxuXHQgIHZhciB0aGV0YSA9IHRoaXMubnMgKiBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIHZhciB4ID0gdGhpcy54MCArIHJoMSAqIE1hdGguc2luKHRoZXRhKTtcblx0ICB2YXIgeSA9IHRoaXMueTAgKyB0aGlzLnJoIC0gcmgxICogTWF0aC5jb3ModGhldGEpO1xuXHQgIHAueCA9IHg7XG5cdCAgcC55ID0geTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdC8qIEludmVyc2UgZXF1YXRpb25zXG5cdCAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHRmdW5jdGlvbiBpbnZlcnNlJDIyKHApIHtcblx0ICBwLnggLT0gdGhpcy54MDtcblx0ICBwLnkgPSB0aGlzLnJoIC0gcC55ICsgdGhpcy55MDtcblx0ICB2YXIgY29uLCByaDEsIGxhdCwgbG9uO1xuXHQgIGlmICh0aGlzLm5zID49IDApIHtcblx0ICAgIHJoMSA9IE1hdGguc3FydChwLnggKiBwLnggKyBwLnkgKiBwLnkpO1xuXHQgICAgY29uID0gMTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICByaDEgPSAtTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgICBjb24gPSAtMTtcblx0ICB9XG5cdCAgdmFyIHRoZXRhID0gMDtcblx0ICBpZiAocmgxICE9PSAwKSB7XG5cdCAgICB0aGV0YSA9IE1hdGguYXRhbjIoY29uICogcC54LCBjb24gKiBwLnkpO1xuXHQgIH1cblxuXHQgIGlmICh0aGlzLnNwaGVyZSkge1xuXHQgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgdGhldGEgLyB0aGlzLm5zKTtcblx0ICAgIGxhdCA9IGFkanVzdF9sYXQodGhpcy5nIC0gcmgxIC8gdGhpcy5hKTtcblx0ICAgIHAueCA9IGxvbjtcblx0ICAgIHAueSA9IGxhdDtcblx0ICAgIHJldHVybiBwO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHZhciBtbCA9IHRoaXMuZyAtIHJoMSAvIHRoaXMuYTtcblx0ICAgIGxhdCA9IGltbGZuKG1sLCB0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzKTtcblx0ICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHRoZXRhIC8gdGhpcy5ucyk7XG5cdCAgICBwLnggPSBsb247XG5cdCAgICBwLnkgPSBsYXQ7XG5cdCAgICByZXR1cm4gcDtcblx0ICB9XG5cblx0fVxuXG5cdHZhciBuYW1lcyQyNCA9IFtcIkVxdWlkaXN0YW50X0NvbmljXCIsIFwiZXFkY1wiXTtcblx0dmFyIGVxZGMgPSB7XG5cdCAgaW5pdDogaW5pdCQyMyxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDIyLFxuXHQgIGludmVyc2U6IGludmVyc2UkMjIsXG5cdCAgbmFtZXM6IG5hbWVzJDI0XG5cdH07XG5cblx0LyogSW5pdGlhbGl6ZSB0aGUgVmFuIERlciBHcmludGVuIHByb2plY3Rpb25cblx0ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gaW5pdCQyNCgpIHtcblx0ICAvL3RoaXMuUiA9IDYzNzA5OTc7IC8vUmFkaXVzIG9mIGVhcnRoXG5cdCAgdGhpcy5SID0gdGhpcy5hO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9yd2FyZCQyMyhwKSB7XG5cblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cblx0ICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuXHQgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblx0ICB2YXIgeCwgeTtcblxuXHQgIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG5cdCAgICB4ID0gdGhpcy54MCArIHRoaXMuUiAqIGRsb247XG5cdCAgICB5ID0gdGhpcy55MDtcblx0ICB9XG5cdCAgdmFyIHRoZXRhID0gYXNpbnooMiAqIE1hdGguYWJzKGxhdCAvIE1hdGguUEkpKTtcblx0ICBpZiAoKE1hdGguYWJzKGRsb24pIDw9IEVQU0xOKSB8fCAoTWF0aC5hYnMoTWF0aC5hYnMobGF0KSAtIEhBTEZfUEkpIDw9IEVQU0xOKSkge1xuXHQgICAgeCA9IHRoaXMueDA7XG5cdCAgICBpZiAobGF0ID49IDApIHtcblx0ICAgICAgeSA9IHRoaXMueTAgKyBNYXRoLlBJICogdGhpcy5SICogTWF0aC50YW4oMC41ICogdGhldGEpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHkgPSB0aGlzLnkwICsgTWF0aC5QSSAqIHRoaXMuUiAqIC1NYXRoLnRhbigwLjUgKiB0aGV0YSk7XG5cdCAgICB9XG5cdCAgICAvLyAgcmV0dXJuKE9LKTtcblx0ICB9XG5cdCAgdmFyIGFsID0gMC41ICogTWF0aC5hYnMoKE1hdGguUEkgLyBkbG9uKSAtIChkbG9uIC8gTWF0aC5QSSkpO1xuXHQgIHZhciBhc3EgPSBhbCAqIGFsO1xuXHQgIHZhciBzaW50aCA9IE1hdGguc2luKHRoZXRhKTtcblx0ICB2YXIgY29zdGggPSBNYXRoLmNvcyh0aGV0YSk7XG5cblx0ICB2YXIgZyA9IGNvc3RoIC8gKHNpbnRoICsgY29zdGggLSAxKTtcblx0ICB2YXIgZ3NxID0gZyAqIGc7XG5cdCAgdmFyIG0gPSBnICogKDIgLyBzaW50aCAtIDEpO1xuXHQgIHZhciBtc3EgPSBtICogbTtcblx0ICB2YXIgY29uID0gTWF0aC5QSSAqIHRoaXMuUiAqIChhbCAqIChnIC0gbXNxKSArIE1hdGguc3FydChhc3EgKiAoZyAtIG1zcSkgKiAoZyAtIG1zcSkgLSAobXNxICsgYXNxKSAqIChnc3EgLSBtc3EpKSkgLyAobXNxICsgYXNxKTtcblx0ICBpZiAoZGxvbiA8IDApIHtcblx0ICAgIGNvbiA9IC1jb247XG5cdCAgfVxuXHQgIHggPSB0aGlzLngwICsgY29uO1xuXHQgIC8vY29uID0gTWF0aC5hYnMoY29uIC8gKE1hdGguUEkgKiB0aGlzLlIpKTtcblx0ICB2YXIgcSA9IGFzcSArIGc7XG5cdCAgY29uID0gTWF0aC5QSSAqIHRoaXMuUiAqIChtICogcSAtIGFsICogTWF0aC5zcXJ0KChtc3EgKyBhc3EpICogKGFzcSArIDEpIC0gcSAqIHEpKSAvIChtc3EgKyBhc3EpO1xuXHQgIGlmIChsYXQgPj0gMCkge1xuXHQgICAgLy95ID0gdGhpcy55MCArIE1hdGguUEkgKiB0aGlzLlIgKiBNYXRoLnNxcnQoMSAtIGNvbiAqIGNvbiAtIDIgKiBhbCAqIGNvbik7XG5cdCAgICB5ID0gdGhpcy55MCArIGNvbjtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICAvL3kgPSB0aGlzLnkwIC0gTWF0aC5QSSAqIHRoaXMuUiAqIE1hdGguc3FydCgxIC0gY29uICogY29uIC0gMiAqIGFsICogY29uKTtcblx0ICAgIHkgPSB0aGlzLnkwIC0gY29uO1xuXHQgIH1cblx0ICBwLnggPSB4O1xuXHQgIHAueSA9IHk7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvKiBWYW4gRGVyIEdyaW50ZW4gaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG5cdCAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblx0ZnVuY3Rpb24gaW52ZXJzZSQyMyhwKSB7XG5cdCAgdmFyIGxvbiwgbGF0O1xuXHQgIHZhciB4eCwgeXksIHh5cywgYzEsIGMyLCBjMztcblx0ICB2YXIgYTE7XG5cdCAgdmFyIG0xO1xuXHQgIHZhciBjb247XG5cdCAgdmFyIHRoMTtcblx0ICB2YXIgZDtcblxuXHQgIC8qIGludmVyc2UgZXF1YXRpb25zXG5cdCAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG5cdCAgcC54IC09IHRoaXMueDA7XG5cdCAgcC55IC09IHRoaXMueTA7XG5cdCAgY29uID0gTWF0aC5QSSAqIHRoaXMuUjtcblx0ICB4eCA9IHAueCAvIGNvbjtcblx0ICB5eSA9IHAueSAvIGNvbjtcblx0ICB4eXMgPSB4eCAqIHh4ICsgeXkgKiB5eTtcblx0ICBjMSA9IC1NYXRoLmFicyh5eSkgKiAoMSArIHh5cyk7XG5cdCAgYzIgPSBjMSAtIDIgKiB5eSAqIHl5ICsgeHggKiB4eDtcblx0ICBjMyA9IC0yICogYzEgKyAxICsgMiAqIHl5ICogeXkgKyB4eXMgKiB4eXM7XG5cdCAgZCA9IHl5ICogeXkgLyBjMyArICgyICogYzIgKiBjMiAqIGMyIC8gYzMgLyBjMyAvIGMzIC0gOSAqIGMxICogYzIgLyBjMyAvIGMzKSAvIDI3O1xuXHQgIGExID0gKGMxIC0gYzIgKiBjMiAvIDMgLyBjMykgLyBjMztcblx0ICBtMSA9IDIgKiBNYXRoLnNxcnQoLWExIC8gMyk7XG5cdCAgY29uID0gKCgzICogZCkgLyBhMSkgLyBtMTtcblx0ICBpZiAoTWF0aC5hYnMoY29uKSA+IDEpIHtcblx0ICAgIGlmIChjb24gPj0gMCkge1xuXHQgICAgICBjb24gPSAxO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIGNvbiA9IC0xO1xuXHQgICAgfVxuXHQgIH1cblx0ICB0aDEgPSBNYXRoLmFjb3MoY29uKSAvIDM7XG5cdCAgaWYgKHAueSA+PSAwKSB7XG5cdCAgICBsYXQgPSAoLW0xICogTWF0aC5jb3ModGgxICsgTWF0aC5QSSAvIDMpIC0gYzIgLyAzIC8gYzMpICogTWF0aC5QSTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICBsYXQgPSAtKC1tMSAqIE1hdGguY29zKHRoMSArIE1hdGguUEkgLyAzKSAtIGMyIC8gMyAvIGMzKSAqIE1hdGguUEk7XG5cdCAgfVxuXG5cdCAgaWYgKE1hdGguYWJzKHh4KSA8IEVQU0xOKSB7XG5cdCAgICBsb24gPSB0aGlzLmxvbmcwO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguUEkgKiAoeHlzIC0gMSArIE1hdGguc3FydCgxICsgMiAqICh4eCAqIHh4IC0geXkgKiB5eSkgKyB4eXMgKiB4eXMpKSAvIDIgLyB4eCk7XG5cdCAgfVxuXG5cdCAgcC54ID0gbG9uO1xuXHQgIHAueSA9IGxhdDtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdHZhciBuYW1lcyQyNSA9IFtcIlZhbl9kZXJfR3JpbnRlbl9JXCIsIFwiVmFuRGVyR3JpbnRlblwiLCBcInZhbmRnXCJdO1xuXHR2YXIgdmFuZGcgPSB7XG5cdCAgaW5pdDogaW5pdCQyNCxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDIzLFxuXHQgIGludmVyc2U6IGludmVyc2UkMjMsXG5cdCAgbmFtZXM6IG5hbWVzJDI1XG5cdH07XG5cblx0ZnVuY3Rpb24gaW5pdCQyNSgpIHtcblx0ICB0aGlzLnNpbl9wMTIgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuXHQgIHRoaXMuY29zX3AxMiA9IE1hdGguY29zKHRoaXMubGF0MCk7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3J3YXJkJDI0KHApIHtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cdCAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHAueSk7XG5cdCAgdmFyIGNvc3BoaSA9IE1hdGguY29zKHAueSk7XG5cdCAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXHQgIHZhciBlMCwgZTEsIGUyLCBlMywgTWxwLCBNbCwgdGFucGhpLCBObDEsIE5sLCBwc2ksIEF6LCBHLCBILCBHSCwgSHMsIGMsIGtwLCBjb3NfYywgcywgczIsIHMzLCBzNCwgczU7XG5cdCAgaWYgKHRoaXMuc3BoZXJlKSB7XG5cdCAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyIC0gMSkgPD0gRVBTTE4pIHtcblx0ICAgICAgLy9Ob3J0aCBQb2xlIGNhc2Vcblx0ICAgICAgcC54ID0gdGhpcy54MCArIHRoaXMuYSAqIChIQUxGX1BJIC0gbGF0KSAqIE1hdGguc2luKGRsb24pO1xuXHQgICAgICBwLnkgPSB0aGlzLnkwIC0gdGhpcy5hICogKEhBTEZfUEkgLSBsYXQpICogTWF0aC5jb3MoZGxvbik7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyICsgMSkgPD0gRVBTTE4pIHtcblx0ICAgICAgLy9Tb3V0aCBQb2xlIGNhc2Vcblx0ICAgICAgcC54ID0gdGhpcy54MCArIHRoaXMuYSAqIChIQUxGX1BJICsgbGF0KSAqIE1hdGguc2luKGRsb24pO1xuXHQgICAgICBwLnkgPSB0aGlzLnkwICsgdGhpcy5hICogKEhBTEZfUEkgKyBsYXQpICogTWF0aC5jb3MoZGxvbik7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIC8vZGVmYXVsdCBjYXNlXG5cdCAgICAgIGNvc19jID0gdGhpcy5zaW5fcDEyICogc2lucGhpICsgdGhpcy5jb3NfcDEyICogY29zcGhpICogTWF0aC5jb3MoZGxvbik7XG5cdCAgICAgIGMgPSBNYXRoLmFjb3MoY29zX2MpO1xuXHQgICAgICBrcCA9IGMgLyBNYXRoLnNpbihjKTtcblx0ICAgICAgcC54ID0gdGhpcy54MCArIHRoaXMuYSAqIGtwICogY29zcGhpICogTWF0aC5zaW4oZGxvbik7XG5cdCAgICAgIHAueSA9IHRoaXMueTAgKyB0aGlzLmEgKiBrcCAqICh0aGlzLmNvc19wMTIgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTIgKiBjb3NwaGkgKiBNYXRoLmNvcyhkbG9uKSk7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGUwID0gZTBmbih0aGlzLmVzKTtcblx0ICAgIGUxID0gZTFmbih0aGlzLmVzKTtcblx0ICAgIGUyID0gZTJmbih0aGlzLmVzKTtcblx0ICAgIGUzID0gZTNmbih0aGlzLmVzKTtcblx0ICAgIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgLSAxKSA8PSBFUFNMTikge1xuXHQgICAgICAvL05vcnRoIFBvbGUgY2FzZVxuXHQgICAgICBNbHAgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBIQUxGX1BJKTtcblx0ICAgICAgTWwgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBsYXQpO1xuXHQgICAgICBwLnggPSB0aGlzLngwICsgKE1scCAtIE1sKSAqIE1hdGguc2luKGRsb24pO1xuXHQgICAgICBwLnkgPSB0aGlzLnkwIC0gKE1scCAtIE1sKSAqIE1hdGguY29zKGRsb24pO1xuXHQgICAgICByZXR1cm4gcDtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiArIDEpIDw9IEVQU0xOKSB7XG5cdCAgICAgIC8vU291dGggUG9sZSBjYXNlXG5cdCAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuXHQgICAgICBNbCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIGxhdCk7XG5cdCAgICAgIHAueCA9IHRoaXMueDAgKyAoTWxwICsgTWwpICogTWF0aC5zaW4oZGxvbik7XG5cdCAgICAgIHAueSA9IHRoaXMueTAgKyAoTWxwICsgTWwpICogTWF0aC5jb3MoZGxvbik7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIC8vRGVmYXVsdCBjYXNlXG5cdCAgICAgIHRhbnBoaSA9IHNpbnBoaSAvIGNvc3BoaTtcblx0ICAgICAgTmwxID0gZ04odGhpcy5hLCB0aGlzLmUsIHRoaXMuc2luX3AxMik7XG5cdCAgICAgIE5sID0gZ04odGhpcy5hLCB0aGlzLmUsIHNpbnBoaSk7XG5cdCAgICAgIHBzaSA9IE1hdGguYXRhbigoMSAtIHRoaXMuZXMpICogdGFucGhpICsgdGhpcy5lcyAqIE5sMSAqIHRoaXMuc2luX3AxMiAvIChObCAqIGNvc3BoaSkpO1xuXHQgICAgICBBeiA9IE1hdGguYXRhbjIoTWF0aC5zaW4oZGxvbiksIHRoaXMuY29zX3AxMiAqIE1hdGgudGFuKHBzaSkgLSB0aGlzLnNpbl9wMTIgKiBNYXRoLmNvcyhkbG9uKSk7XG5cdCAgICAgIGlmIChBeiA9PT0gMCkge1xuXHQgICAgICAgIHMgPSBNYXRoLmFzaW4odGhpcy5jb3NfcDEyICogTWF0aC5zaW4ocHNpKSAtIHRoaXMuc2luX3AxMiAqIE1hdGguY29zKHBzaSkpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKE1hdGguYWJzKE1hdGguYWJzKEF6KSAtIE1hdGguUEkpIDw9IEVQU0xOKSB7XG5cdCAgICAgICAgcyA9IC1NYXRoLmFzaW4odGhpcy5jb3NfcDEyICogTWF0aC5zaW4ocHNpKSAtIHRoaXMuc2luX3AxMiAqIE1hdGguY29zKHBzaSkpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2Uge1xuXHQgICAgICAgIHMgPSBNYXRoLmFzaW4oTWF0aC5zaW4oZGxvbikgKiBNYXRoLmNvcyhwc2kpIC8gTWF0aC5zaW4oQXopKTtcblx0ICAgICAgfVxuXHQgICAgICBHID0gdGhpcy5lICogdGhpcy5zaW5fcDEyIC8gTWF0aC5zcXJ0KDEgLSB0aGlzLmVzKTtcblx0ICAgICAgSCA9IHRoaXMuZSAqIHRoaXMuY29zX3AxMiAqIE1hdGguY29zKEF6KSAvIE1hdGguc3FydCgxIC0gdGhpcy5lcyk7XG5cdCAgICAgIEdIID0gRyAqIEg7XG5cdCAgICAgIEhzID0gSCAqIEg7XG5cdCAgICAgIHMyID0gcyAqIHM7XG5cdCAgICAgIHMzID0gczIgKiBzO1xuXHQgICAgICBzNCA9IHMzICogcztcblx0ICAgICAgczUgPSBzNCAqIHM7XG5cdCAgICAgIGMgPSBObDEgKiBzICogKDEgLSBzMiAqIEhzICogKDEgLSBIcykgLyA2ICsgczMgLyA4ICogR0ggKiAoMSAtIDIgKiBIcykgKyBzNCAvIDEyMCAqIChIcyAqICg0IC0gNyAqIEhzKSAtIDMgKiBHICogRyAqICgxIC0gNyAqIEhzKSkgLSBzNSAvIDQ4ICogR0gpO1xuXHQgICAgICBwLnggPSB0aGlzLngwICsgYyAqIE1hdGguc2luKEF6KTtcblx0ICAgICAgcC55ID0gdGhpcy55MCArIGMgKiBNYXRoLmNvcyhBeik7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgIH1cblxuXG5cdH1cblxuXHRmdW5jdGlvbiBpbnZlcnNlJDI0KHApIHtcblx0ICBwLnggLT0gdGhpcy54MDtcblx0ICBwLnkgLT0gdGhpcy55MDtcblx0ICB2YXIgcmgsIHosIHNpbnosIGNvc3osIGxvbiwgbGF0LCBjb24sIGUwLCBlMSwgZTIsIGUzLCBNbHAsIE0sIE4xLCBwc2ksIEF6LCBjb3NBeiwgdG1wLCBBLCBCLCBELCBFZSwgRjtcblx0ICBpZiAodGhpcy5zcGhlcmUpIHtcblx0ICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgICBpZiAocmggPiAoMiAqIEhBTEZfUEkgKiB0aGlzLmEpKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICAgIHogPSByaCAvIHRoaXMuYTtcblxuXHQgICAgc2lueiA9IE1hdGguc2luKHopO1xuXHQgICAgY29zeiA9IE1hdGguY29zKHopO1xuXG5cdCAgICBsb24gPSB0aGlzLmxvbmcwO1xuXHQgICAgaWYgKE1hdGguYWJzKHJoKSA8PSBFUFNMTikge1xuXHQgICAgICBsYXQgPSB0aGlzLmxhdDA7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgbGF0ID0gYXNpbnooY29zeiAqIHRoaXMuc2luX3AxMiArIChwLnkgKiBzaW56ICogdGhpcy5jb3NfcDEyKSAvIHJoKTtcblx0ICAgICAgY29uID0gTWF0aC5hYnModGhpcy5sYXQwKSAtIEhBTEZfUEk7XG5cdCAgICAgIGlmIChNYXRoLmFicyhjb24pIDw9IEVQU0xOKSB7XG5cdCAgICAgICAgaWYgKHRoaXMubGF0MCA+PSAwKSB7XG5cdCAgICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgLSBwLnkpKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgLSBNYXRoLmF0YW4yKC1wLngsIHAueSkpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICBlbHNlIHtcblx0ICAgICAgICAvKmNvbiA9IGNvc3ogLSB0aGlzLnNpbl9wMTIgKiBNYXRoLnNpbihsYXQpO1xuXHQgICAgICAgIGlmICgoTWF0aC5hYnMoY29uKSA8IEVQU0xOKSAmJiAoTWF0aC5hYnMocC54KSA8IEVQU0xOKSkge1xuXHQgICAgICAgICAgLy9uby1vcCwganVzdCBrZWVwIHRoZSBsb24gdmFsdWUgYXMgaXNcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgdmFyIHRlbXAgPSBNYXRoLmF0YW4yKChwLnggKiBzaW56ICogdGhpcy5jb3NfcDEyKSwgKGNvbiAqIHJoKSk7XG5cdCAgICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKChwLnggKiBzaW56ICogdGhpcy5jb3NfcDEyKSwgKGNvbiAqIHJoKSkpO1xuXHQgICAgICAgIH0qL1xuXHQgICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogc2lueiwgcmggKiB0aGlzLmNvc19wMTIgKiBjb3N6IC0gcC55ICogdGhpcy5zaW5fcDEyICogc2lueikpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHAueCA9IGxvbjtcblx0ICAgIHAueSA9IGxhdDtcblx0ICAgIHJldHVybiBwO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIGUwID0gZTBmbih0aGlzLmVzKTtcblx0ICAgIGUxID0gZTFmbih0aGlzLmVzKTtcblx0ICAgIGUyID0gZTJmbih0aGlzLmVzKTtcblx0ICAgIGUzID0gZTNmbih0aGlzLmVzKTtcblx0ICAgIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgLSAxKSA8PSBFUFNMTikge1xuXHQgICAgICAvL05vcnRoIHBvbGUgY2FzZVxuXHQgICAgICBNbHAgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBIQUxGX1BJKTtcblx0ICAgICAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcblx0ICAgICAgTSA9IE1scCAtIHJoO1xuXHQgICAgICBsYXQgPSBpbWxmbihNIC8gdGhpcy5hLCBlMCwgZTEsIGUyLCBlMyk7XG5cdCAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtIDEgKiBwLnkpKTtcblx0ICAgICAgcC54ID0gbG9uO1xuXHQgICAgICBwLnkgPSBsYXQ7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyICsgMSkgPD0gRVBTTE4pIHtcblx0ICAgICAgLy9Tb3V0aCBwb2xlIGNhc2Vcblx0ICAgICAgTWxwID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgSEFMRl9QSSk7XG5cdCAgICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgICAgIE0gPSByaCAtIE1scDtcblxuXHQgICAgICBsYXQgPSBpbWxmbihNIC8gdGhpcy5hLCBlMCwgZTEsIGUyLCBlMyk7XG5cdCAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCBwLnkpKTtcblx0ICAgICAgcC54ID0gbG9uO1xuXHQgICAgICBwLnkgPSBsYXQ7XG5cdCAgICAgIHJldHVybiBwO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIC8vZGVmYXVsdCBjYXNlXG5cdCAgICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgICAgIEF6ID0gTWF0aC5hdGFuMihwLngsIHAueSk7XG5cdCAgICAgIE4xID0gZ04odGhpcy5hLCB0aGlzLmUsIHRoaXMuc2luX3AxMik7XG5cdCAgICAgIGNvc0F6ID0gTWF0aC5jb3MoQXopO1xuXHQgICAgICB0bXAgPSB0aGlzLmUgKiB0aGlzLmNvc19wMTIgKiBjb3NBejtcblx0ICAgICAgQSA9IC10bXAgKiB0bXAgLyAoMSAtIHRoaXMuZXMpO1xuXHQgICAgICBCID0gMyAqIHRoaXMuZXMgKiAoMSAtIEEpICogdGhpcy5zaW5fcDEyICogdGhpcy5jb3NfcDEyICogY29zQXogLyAoMSAtIHRoaXMuZXMpO1xuXHQgICAgICBEID0gcmggLyBOMTtcblx0ICAgICAgRWUgPSBEIC0gQSAqICgxICsgQSkgKiBNYXRoLnBvdyhELCAzKSAvIDYgLSBCICogKDEgKyAzICogQSkgKiBNYXRoLnBvdyhELCA0KSAvIDI0O1xuXHQgICAgICBGID0gMSAtIEEgKiBFZSAqIEVlIC8gMiAtIEQgKiBFZSAqIEVlICogRWUgLyA2O1xuXHQgICAgICBwc2kgPSBNYXRoLmFzaW4odGhpcy5zaW5fcDEyICogTWF0aC5jb3MoRWUpICsgdGhpcy5jb3NfcDEyICogTWF0aC5zaW4oRWUpICogY29zQXopO1xuXHQgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmFzaW4oTWF0aC5zaW4oQXopICogTWF0aC5zaW4oRWUpIC8gTWF0aC5jb3MocHNpKSkpO1xuXHQgICAgICBsYXQgPSBNYXRoLmF0YW4oKDEgLSB0aGlzLmVzICogRiAqIHRoaXMuc2luX3AxMiAvIE1hdGguc2luKHBzaSkpICogTWF0aC50YW4ocHNpKSAvICgxIC0gdGhpcy5lcykpO1xuXHQgICAgICBwLnggPSBsb247XG5cdCAgICAgIHAueSA9IGxhdDtcblx0ICAgICAgcmV0dXJuIHA7XG5cdCAgICB9XG5cdCAgfVxuXG5cdH1cblxuXHR2YXIgbmFtZXMkMjYgPSBbXCJBemltdXRoYWxfRXF1aWRpc3RhbnRcIiwgXCJhZXFkXCJdO1xuXHR2YXIgYWVxZCA9IHtcblx0ICBpbml0OiBpbml0JDI1LFxuXHQgIGZvcndhcmQ6IGZvcndhcmQkMjQsXG5cdCAgaW52ZXJzZTogaW52ZXJzZSQyNCxcblx0ICBuYW1lczogbmFtZXMkMjZcblx0fTtcblxuXHRmdW5jdGlvbiBpbml0JDI2KCkge1xuXHQgIC8vZG91YmxlIHRlbXA7ICAgICAgLyogdGVtcG9yYXJ5IHZhcmlhYmxlICAgICovXG5cblx0ICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG5cdCAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHRoaXMuc2luX3AxNCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG5cdCAgdGhpcy5jb3NfcDE0ID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcblx0fVxuXG5cdC8qIE9ydGhvZ3JhcGhpYyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcblx0ICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdGZ1bmN0aW9uIGZvcndhcmQkMjUocCkge1xuXHQgIHZhciBzaW5waGksIGNvc3BoaTsgLyogc2luIGFuZCBjb3MgdmFsdWUgICAgICAgICovXG5cdCAgdmFyIGRsb247IC8qIGRlbHRhIGxvbmdpdHVkZSB2YWx1ZSAgICAgICovXG5cdCAgdmFyIGNvc2xvbjsgLyogY29zIG9mIGxvbmdpdHVkZSAgICAgICAgKi9cblx0ICB2YXIga3NwOyAvKiBzY2FsZSBmYWN0b3IgICAgICAgICAgKi9cblx0ICB2YXIgZywgeCwgeTtcblx0ICB2YXIgbG9uID0gcC54O1xuXHQgIHZhciBsYXQgPSBwLnk7XG5cdCAgLyogRm9yd2FyZCBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXG5cdCAgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcblx0ICBjb3NwaGkgPSBNYXRoLmNvcyhsYXQpO1xuXG5cdCAgY29zbG9uID0gTWF0aC5jb3MoZGxvbik7XG5cdCAgZyA9IHRoaXMuc2luX3AxNCAqIHNpbnBoaSArIHRoaXMuY29zX3AxNCAqIGNvc3BoaSAqIGNvc2xvbjtcblx0ICBrc3AgPSAxO1xuXHQgIGlmICgoZyA+IDApIHx8IChNYXRoLmFicyhnKSA8PSBFUFNMTikpIHtcblx0ICAgIHggPSB0aGlzLmEgKiBrc3AgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKTtcblx0ICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICoga3NwICogKHRoaXMuY29zX3AxNCAqIHNpbnBoaSAtIHRoaXMuc2luX3AxNCAqIGNvc3BoaSAqIGNvc2xvbik7XG5cdCAgfVxuXHQgIHAueCA9IHg7XG5cdCAgcC55ID0geTtcblx0ICByZXR1cm4gcDtcblx0fVxuXG5cdGZ1bmN0aW9uIGludmVyc2UkMjUocCkge1xuXHQgIHZhciByaDsgLyogaGVpZ2h0IGFib3ZlIGVsbGlwc29pZCAgICAgICovXG5cdCAgdmFyIHo7IC8qIGFuZ2xlICAgICAgICAgICovXG5cdCAgdmFyIHNpbnosIGNvc3o7IC8qIHNpbiBvZiB6IGFuZCBjb3Mgb2YgeiAgICAgICovXG5cdCAgdmFyIGNvbjtcblx0ICB2YXIgbG9uLCBsYXQ7XG5cdCAgLyogSW52ZXJzZSBlcXVhdGlvbnNcblx0ICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuXHQgIHAueCAtPSB0aGlzLngwO1xuXHQgIHAueSAtPSB0aGlzLnkwO1xuXHQgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG5cdCAgeiA9IGFzaW56KHJoIC8gdGhpcy5hKTtcblxuXHQgIHNpbnogPSBNYXRoLnNpbih6KTtcblx0ICBjb3N6ID0gTWF0aC5jb3Moeik7XG5cblx0ICBsb24gPSB0aGlzLmxvbmcwO1xuXHQgIGlmIChNYXRoLmFicyhyaCkgPD0gRVBTTE4pIHtcblx0ICAgIGxhdCA9IHRoaXMubGF0MDtcblx0ICAgIHAueCA9IGxvbjtcblx0ICAgIHAueSA9IGxhdDtcblx0ICAgIHJldHVybiBwO1xuXHQgIH1cblx0ICBsYXQgPSBhc2lueihjb3N6ICogdGhpcy5zaW5fcDE0ICsgKHAueSAqIHNpbnogKiB0aGlzLmNvc19wMTQpIC8gcmgpO1xuXHQgIGNvbiA9IE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJO1xuXHQgIGlmIChNYXRoLmFicyhjb24pIDw9IEVQU0xOKSB7XG5cdCAgICBpZiAodGhpcy5sYXQwID49IDApIHtcblx0ICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0gcC55KSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwIC0gTWF0aC5hdGFuMigtcC54LCBwLnkpKTtcblx0ICAgIH1cblx0ICAgIHAueCA9IGxvbjtcblx0ICAgIHAueSA9IGxhdDtcblx0ICAgIHJldHVybiBwO1xuXHQgIH1cblx0ICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKChwLnggKiBzaW56KSwgcmggKiB0aGlzLmNvc19wMTQgKiBjb3N6IC0gcC55ICogdGhpcy5zaW5fcDE0ICogc2lueikpO1xuXHQgIHAueCA9IGxvbjtcblx0ICBwLnkgPSBsYXQ7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHR2YXIgbmFtZXMkMjcgPSBbXCJvcnRob1wiXTtcblx0dmFyIG9ydGhvID0ge1xuXHQgIGluaXQ6IGluaXQkMjYsXG5cdCAgZm9yd2FyZDogZm9yd2FyZCQyNSxcblx0ICBpbnZlcnNlOiBpbnZlcnNlJDI1LFxuXHQgIG5hbWVzOiBuYW1lcyQyN1xuXHR9O1xuXG5cdC8vIFFTQyBwcm9qZWN0aW9uIHJld3JpdHRlbiBmcm9tIHRoZSBvcmlnaW5hbCBQUk9KNFxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2Jsb2IvbWFzdGVyL3NyYy9QSl9xc2MuY1xuXG5cdC8qIGNvbnN0YW50cyAqL1xuXHR2YXIgRkFDRV9FTlVNID0ge1xuXHQgICAgRlJPTlQ6IDEsXG5cdCAgICBSSUdIVDogMixcblx0ICAgIEJBQ0s6IDMsXG5cdCAgICBMRUZUOiA0LFxuXHQgICAgVE9QOiA1LFxuXHQgICAgQk9UVE9NOiA2XG5cdH07XG5cblx0dmFyIEFSRUFfRU5VTSA9IHtcblx0ICAgIEFSRUFfMDogMSxcblx0ICAgIEFSRUFfMTogMixcblx0ICAgIEFSRUFfMjogMyxcblx0ICAgIEFSRUFfMzogNFxuXHR9O1xuXG5cdGZ1bmN0aW9uIGluaXQkMjcoKSB7XG5cblx0ICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuXHQgIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG5cdCAgdGhpcy5sYXQwID0gdGhpcy5sYXQwIHx8IDA7XG5cdCAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcblx0ICB0aGlzLmxhdF90cyA9IHRoaXMubGF0X3RzIHx8IDA7XG5cdCAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgXCJRdWFkcmlsYXRlcmFsaXplZCBTcGhlcmljYWwgQ3ViZVwiO1xuXG5cdCAgLyogRGV0ZXJtaW5lIHRoZSBjdWJlIGZhY2UgZnJvbSB0aGUgY2VudGVyIG9mIHByb2plY3Rpb24uICovXG5cdCAgaWYgKHRoaXMubGF0MCA+PSBIQUxGX1BJIC0gRk9SVFBJIC8gMi4wKSB7XG5cdCAgICB0aGlzLmZhY2UgPSBGQUNFX0VOVU0uVE9QO1xuXHQgIH0gZWxzZSBpZiAodGhpcy5sYXQwIDw9IC0oSEFMRl9QSSAtIEZPUlRQSSAvIDIuMCkpIHtcblx0ICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5CT1RUT007XG5cdCAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLmxvbmcwKSA8PSBGT1JUUEkpIHtcblx0ICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5GUk9OVDtcblx0ICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMubG9uZzApIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcblx0ICAgIHRoaXMuZmFjZSA9IHRoaXMubG9uZzAgPiAwLjAgPyBGQUNFX0VOVU0uUklHSFQgOiBGQUNFX0VOVU0uTEVGVDtcblx0ICB9IGVsc2Uge1xuXHQgICAgdGhpcy5mYWNlID0gRkFDRV9FTlVNLkJBQ0s7XG5cdCAgfVxuXG5cdCAgLyogRmlsbCBpbiB1c2VmdWwgdmFsdWVzIGZvciB0aGUgZWxsaXBzb2lkIDwtPiBzcGhlcmUgc2hpZnRcblx0ICAgKiBkZXNjcmliZWQgaW4gW0xLMTJdLiAqL1xuXHQgIGlmICh0aGlzLmVzICE9PSAwKSB7XG5cdCAgICB0aGlzLm9uZV9taW51c19mID0gMSAtICh0aGlzLmEgLSB0aGlzLmIpIC8gdGhpcy5hO1xuXHQgICAgdGhpcy5vbmVfbWludXNfZl9zcXVhcmVkID0gdGhpcy5vbmVfbWludXNfZiAqIHRoaXMub25lX21pbnVzX2Y7XG5cdCAgfVxuXHR9XG5cblx0Ly8gUVNDIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRmdW5jdGlvbiBmb3J3YXJkJDI2KHApIHtcblx0ICB2YXIgeHkgPSB7eDogMCwgeTogMH07XG5cdCAgdmFyIGxhdCwgbG9uO1xuXHQgIHZhciB0aGV0YSwgcGhpO1xuXHQgIHZhciB0LCBtdTtcblx0ICAvKiBudTsgKi9cblx0ICB2YXIgYXJlYSA9IHt2YWx1ZTogMH07XG5cblx0ICAvLyBtb3ZlIGxvbiBhY2NvcmRpbmcgdG8gcHJvamVjdGlvbidzIGxvblxuXHQgIHAueCAtPSB0aGlzLmxvbmcwO1xuXG5cdCAgLyogQ29udmVydCB0aGUgZ2VvZGV0aWMgbGF0aXR1ZGUgdG8gYSBnZW9jZW50cmljIGxhdGl0dWRlLlxuXHQgICAqIFRoaXMgY29ycmVzcG9uZHMgdG8gdGhlIHNoaWZ0IGZyb20gdGhlIGVsbGlwc29pZCB0byB0aGUgc3BoZXJlXG5cdCAgICogZGVzY3JpYmVkIGluIFtMSzEyXS4gKi9cblx0ICBpZiAodGhpcy5lcyAhPT0gMCkgey8vaWYgKFAtPmVzICE9IDApIHtcblx0ICAgIGxhdCA9IE1hdGguYXRhbih0aGlzLm9uZV9taW51c19mX3NxdWFyZWQgKiBNYXRoLnRhbihwLnkpKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgbGF0ID0gcC55O1xuXHQgIH1cblxuXHQgIC8qIENvbnZlcnQgdGhlIGlucHV0IGxhdCwgbG9uIGludG8gdGhldGEsIHBoaSBhcyB1c2VkIGJ5IFFTQy5cblx0ICAgKiBUaGlzIGRlcGVuZHMgb24gdGhlIGN1YmUgZmFjZSBhbmQgdGhlIGFyZWEgb24gaXQuXG5cdCAgICogRm9yIHRoZSB0b3AgYW5kIGJvdHRvbSBmYWNlLCB3ZSBjYW4gY29tcHV0ZSB0aGV0YSBhbmQgcGhpXG5cdCAgICogZGlyZWN0bHkgZnJvbSBwaGksIGxhbS4gRm9yIHRoZSBvdGhlciBmYWNlcywgd2UgbXVzdCB1c2Vcblx0ICAgKiB1bml0IHNwaGVyZSBjYXJ0ZXNpYW4gY29vcmRpbmF0ZXMgYXMgYW4gaW50ZXJtZWRpYXRlIHN0ZXAuICovXG5cdCAgbG9uID0gcC54OyAvL2xvbiA9IGxwLmxhbTtcblx0ICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uVE9QKSB7XG5cdCAgICBwaGkgPSBIQUxGX1BJIC0gbGF0O1xuXHQgICAgaWYgKGxvbiA+PSBGT1JUUEkgJiYgbG9uIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcblx0ICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG5cdCAgICAgIHRoZXRhID0gbG9uIC0gSEFMRl9QSTtcblx0ICAgIH0gZWxzZSBpZiAobG9uID4gSEFMRl9QSSArIEZPUlRQSSB8fCBsb24gPD0gLShIQUxGX1BJICsgRk9SVFBJKSkge1xuXHQgICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcblx0ICAgICAgdGhldGEgPSAobG9uID4gMC4wID8gbG9uIC0gU1BJIDogbG9uICsgU1BJKTtcblx0ICAgIH0gZWxzZSBpZiAobG9uID4gLShIQUxGX1BJICsgRk9SVFBJKSAmJiBsb24gPD0gLUZPUlRQSSkge1xuXHQgICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcblx0ICAgICAgdGhldGEgPSBsb24gKyBIQUxGX1BJO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG5cdCAgICAgIHRoZXRhID0gbG9uO1xuXHQgICAgfVxuXHQgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQk9UVE9NKSB7XG5cdCAgICBwaGkgPSBIQUxGX1BJICsgbGF0O1xuXHQgICAgaWYgKGxvbiA+PSBGT1JUUEkgJiYgbG9uIDw9IEhBTEZfUEkgKyBGT1JUUEkpIHtcblx0ICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG5cdCAgICAgIHRoZXRhID0gLWxvbiArIEhBTEZfUEk7XG5cdCAgICB9IGVsc2UgaWYgKGxvbiA8IEZPUlRQSSAmJiBsb24gPj0gLUZPUlRQSSkge1xuXHQgICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcblx0ICAgICAgdGhldGEgPSAtbG9uO1xuXHQgICAgfSBlbHNlIGlmIChsb24gPCAtRk9SVFBJICYmIGxvbiA+PSAtKEhBTEZfUEkgKyBGT1JUUEkpKSB7XG5cdCAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuXHQgICAgICB0aGV0YSA9IC1sb24gLSBIQUxGX1BJO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG5cdCAgICAgIHRoZXRhID0gKGxvbiA+IDAuMCA/IC1sb24gKyBTUEkgOiAtbG9uIC0gU1BJKTtcblx0ICAgIH1cblx0ICB9IGVsc2Uge1xuXHQgICAgdmFyIHEsIHIsIHM7XG5cdCAgICB2YXIgc2lubGF0LCBjb3NsYXQ7XG5cdCAgICB2YXIgc2lubG9uLCBjb3Nsb247XG5cblx0ICAgIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5SSUdIVCkge1xuXHQgICAgICBsb24gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihsb24sICtIQUxGX1BJKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuXHQgICAgICBsb24gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihsb24sICtTUEkpO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5MRUZUKSB7XG5cdCAgICAgIGxvbiA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgLUhBTEZfUEkpO1xuXHQgICAgfVxuXHQgICAgc2lubGF0ID0gTWF0aC5zaW4obGF0KTtcblx0ICAgIGNvc2xhdCA9IE1hdGguY29zKGxhdCk7XG5cdCAgICBzaW5sb24gPSBNYXRoLnNpbihsb24pO1xuXHQgICAgY29zbG9uID0gTWF0aC5jb3MobG9uKTtcblx0ICAgIHEgPSBjb3NsYXQgKiBjb3Nsb247XG5cdCAgICByID0gY29zbGF0ICogc2lubG9uO1xuXHQgICAgcyA9IHNpbmxhdDtcblxuXHQgICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkZST05UKSB7XG5cdCAgICAgIHBoaSA9IE1hdGguYWNvcyhxKTtcblx0ICAgICAgdGhldGEgPSBxc2NfZndkX2VxdWF0X2ZhY2VfdGhldGEocGhpLCBzLCByLCBhcmVhKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcblx0ICAgICAgcGhpID0gTWF0aC5hY29zKHIpO1xuXHQgICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIC1xLCBhcmVhKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuXHQgICAgICBwaGkgPSBNYXRoLmFjb3MoLXEpO1xuXHQgICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIC1yLCBhcmVhKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuXHQgICAgICBwaGkgPSBNYXRoLmFjb3MoLXIpO1xuXHQgICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIHEsIGFyZWEpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLyogSW1wb3NzaWJsZSAqL1xuXHQgICAgICBwaGkgPSB0aGV0YSA9IDA7XG5cdCAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8qIENvbXB1dGUgbXUgYW5kIG51IGZvciB0aGUgYXJlYSBvZiBkZWZpbml0aW9uLlxuXHQgICAqIEZvciBtdSwgc2VlIEVxLiAoMy0yMSkgaW4gW09MNzZdLCBidXQgbm90ZSB0aGUgdHlwb3M6XG5cdCAgICogY29tcGFyZSB3aXRoIEVxLiAoMy0xNCkuIEZvciBudSwgc2VlIEVxLiAoMy0zOCkuICovXG5cdCAgbXUgPSBNYXRoLmF0YW4oKDEyIC8gU1BJKSAqICh0aGV0YSArIE1hdGguYWNvcyhNYXRoLnNpbih0aGV0YSkgKiBNYXRoLmNvcyhGT1JUUEkpKSAtIEhBTEZfUEkpKTtcblx0ICB0ID0gTWF0aC5zcXJ0KCgxIC0gTWF0aC5jb3MocGhpKSkgLyAoTWF0aC5jb3MobXUpICogTWF0aC5jb3MobXUpKSAvICgxIC0gTWF0aC5jb3MoTWF0aC5hdGFuKDEgLyBNYXRoLmNvcyh0aGV0YSkpKSkpO1xuXG5cdCAgLyogQXBwbHkgdGhlIHJlc3VsdCB0byB0aGUgcmVhbCBhcmVhLiAqL1xuXHQgIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG5cdCAgICBtdSArPSBIQUxGX1BJO1xuXHQgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuXHQgICAgbXUgKz0gU1BJO1xuXHQgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMykge1xuXHQgICAgbXUgKz0gMS41ICogU1BJO1xuXHQgIH1cblxuXHQgIC8qIE5vdyBjb21wdXRlIHgsIHkgZnJvbSBtdSBhbmQgbnUgKi9cblx0ICB4eS54ID0gdCAqIE1hdGguY29zKG11KTtcblx0ICB4eS55ID0gdCAqIE1hdGguc2luKG11KTtcblx0ICB4eS54ID0geHkueCAqIHRoaXMuYSArIHRoaXMueDA7XG5cdCAgeHkueSA9IHh5LnkgKiB0aGlzLmEgKyB0aGlzLnkwO1xuXG5cdCAgcC54ID0geHkueDtcblx0ICBwLnkgPSB4eS55O1xuXHQgIHJldHVybiBwO1xuXHR9XG5cblx0Ly8gUVNDIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRmdW5jdGlvbiBpbnZlcnNlJDI2KHApIHtcblx0ICB2YXIgbHAgPSB7bGFtOiAwLCBwaGk6IDB9O1xuXHQgIHZhciBtdSwgbnUsIGNvc211LCB0YW5udTtcblx0ICB2YXIgdGFudGhldGEsIHRoZXRhLCBjb3NwaGksIHBoaTtcblx0ICB2YXIgdDtcblx0ICB2YXIgYXJlYSA9IHt2YWx1ZTogMH07XG5cblx0ICAvKiBkZS1vZmZzZXQgKi9cblx0ICBwLnggPSAocC54IC0gdGhpcy54MCkgLyB0aGlzLmE7XG5cdCAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG5cdCAgLyogQ29udmVydCB0aGUgaW5wdXQgeCwgeSB0byB0aGUgbXUgYW5kIG51IGFuZ2xlcyBhcyB1c2VkIGJ5IFFTQy5cblx0ICAgKiBUaGlzIGRlcGVuZHMgb24gdGhlIGFyZWEgb2YgdGhlIGN1YmUgZmFjZS4gKi9cblx0ICBudSA9IE1hdGguYXRhbihNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KSk7XG5cdCAgbXUgPSBNYXRoLmF0YW4yKHAueSwgcC54KTtcblx0ICBpZiAocC54ID49IDAuMCAmJiBwLnggPj0gTWF0aC5hYnMocC55KSkge1xuXHQgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG5cdCAgfSBlbHNlIGlmIChwLnkgPj0gMC4wICYmIHAueSA+PSBNYXRoLmFicyhwLngpKSB7XG5cdCAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcblx0ICAgIG11IC09IEhBTEZfUEk7XG5cdCAgfSBlbHNlIGlmIChwLnggPCAwLjAgJiYgLXAueCA+PSBNYXRoLmFicyhwLnkpKSB7XG5cdCAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcblx0ICAgIG11ID0gKG11IDwgMC4wID8gbXUgKyBTUEkgOiBtdSAtIFNQSSk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8zO1xuXHQgICAgbXUgKz0gSEFMRl9QSTtcblx0ICB9XG5cblx0ICAvKiBDb21wdXRlIHBoaSBhbmQgdGhldGEgZm9yIHRoZSBhcmVhIG9mIGRlZmluaXRpb24uXG5cdCAgICogVGhlIGludmVyc2UgcHJvamVjdGlvbiBpcyBub3QgZGVzY3JpYmVkIGluIHRoZSBvcmlnaW5hbCBwYXBlciwgYnV0IHNvbWVcblx0ICAgKiBnb29kIGhpbnRzIGNhbiBiZSBmb3VuZCBoZXJlIChhcyBvZiAyMDExLTEyLTE0KTpcblx0ICAgKiBodHRwOi8vZml0cy5nc2ZjLm5hc2EuZ292L2ZpdHNiaXRzL3NhZi45My9zYWYuOTMwMlxuXHQgICAqIChzZWFyY2ggZm9yIFwiTWVzc2FnZS1JZDogPDkzMDIxODE3NTkuQUEyNTQ3NyBhdCBmaXRzLmN2Lm5yYW8uZWR1PlwiKSAqL1xuXHQgIHQgPSAoU1BJIC8gMTIpICogTWF0aC50YW4obXUpO1xuXHQgIHRhbnRoZXRhID0gTWF0aC5zaW4odCkgLyAoTWF0aC5jb3ModCkgLSAoMSAvIE1hdGguc3FydCgyKSkpO1xuXHQgIHRoZXRhID0gTWF0aC5hdGFuKHRhbnRoZXRhKTtcblx0ICBjb3NtdSA9IE1hdGguY29zKG11KTtcblx0ICB0YW5udSA9IE1hdGgudGFuKG51KTtcblx0ICBjb3NwaGkgPSAxIC0gY29zbXUgKiBjb3NtdSAqIHRhbm51ICogdGFubnUgKiAoMSAtIE1hdGguY29zKE1hdGguYXRhbigxIC8gTWF0aC5jb3ModGhldGEpKSkpO1xuXHQgIGlmIChjb3NwaGkgPCAtMSkge1xuXHQgICAgY29zcGhpID0gLTE7XG5cdCAgfSBlbHNlIGlmIChjb3NwaGkgPiArMSkge1xuXHQgICAgY29zcGhpID0gKzE7XG5cdCAgfVxuXG5cdCAgLyogQXBwbHkgdGhlIHJlc3VsdCB0byB0aGUgcmVhbCBhcmVhIG9uIHRoZSBjdWJlIGZhY2UuXG5cdCAgICogRm9yIHRoZSB0b3AgYW5kIGJvdHRvbSBmYWNlLCB3ZSBjYW4gY29tcHV0ZSBwaGkgYW5kIGxhbSBkaXJlY3RseS5cblx0ICAgKiBGb3IgdGhlIG90aGVyIGZhY2VzLCB3ZSBtdXN0IHVzZSB1bml0IHNwaGVyZSBjYXJ0ZXNpYW4gY29vcmRpbmF0ZXNcblx0ICAgKiBhcyBhbiBpbnRlcm1lZGlhdGUgc3RlcC4gKi9cblx0ICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uVE9QKSB7XG5cdCAgICBwaGkgPSBNYXRoLmFjb3MoY29zcGhpKTtcblx0ICAgIGxwLnBoaSA9IEhBTEZfUEkgLSBwaGk7XG5cdCAgICBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMCkge1xuXHQgICAgICBscC5sYW0gPSB0aGV0YSArIEhBTEZfUEk7XG5cdCAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcblx0ICAgICAgbHAubGFtID0gKHRoZXRhIDwgMC4wID8gdGhldGEgKyBTUEkgOiB0aGV0YSAtIFNQSSk7XG5cdCAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzIpIHtcblx0ICAgICAgbHAubGFtID0gdGhldGEgLSBIQUxGX1BJO1xuXHQgICAgfSBlbHNlIC8qIGFyZWEudmFsdWUgPT0gQVJFQV9FTlVNLkFSRUFfMyAqLyB7XG5cdCAgICAgIGxwLmxhbSA9IHRoZXRhO1xuXHQgICAgfVxuXHQgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQk9UVE9NKSB7XG5cdCAgICBwaGkgPSBNYXRoLmFjb3MoY29zcGhpKTtcblx0ICAgIGxwLnBoaSA9IHBoaSAtIEhBTEZfUEk7XG5cdCAgICBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMCkge1xuXHQgICAgICBscC5sYW0gPSAtdGhldGEgKyBIQUxGX1BJO1xuXHQgICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG5cdCAgICAgIGxwLmxhbSA9IC10aGV0YTtcblx0ICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuXHQgICAgICBscC5sYW0gPSAtdGhldGEgLSBIQUxGX1BJO1xuXHQgICAgfSBlbHNlIC8qIGFyZWEudmFsdWUgPT0gQVJFQV9FTlVNLkFSRUFfMyAqLyB7XG5cdCAgICAgIGxwLmxhbSA9ICh0aGV0YSA8IDAuMCA/IC10aGV0YSAtIFNQSSA6IC10aGV0YSArIFNQSSk7XG5cdCAgICB9XG5cdCAgfSBlbHNlIHtcblx0ICAgIC8qIENvbXB1dGUgcGhpIGFuZCBsYW0gdmlhIGNhcnRlc2lhbiB1bml0IHNwaGVyZSBjb29yZGluYXRlcy4gKi9cblx0ICAgIHZhciBxLCByLCBzO1xuXHQgICAgcSA9IGNvc3BoaTtcblx0ICAgIHQgPSBxICogcTtcblx0ICAgIGlmICh0ID49IDEpIHtcblx0ICAgICAgcyA9IDA7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzID0gTWF0aC5zcXJ0KDEgLSB0KSAqIE1hdGguc2luKHRoZXRhKTtcblx0ICAgIH1cblx0ICAgIHQgKz0gcyAqIHM7XG5cdCAgICBpZiAodCA+PSAxKSB7XG5cdCAgICAgIHIgPSAwO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgciA9IE1hdGguc3FydCgxIC0gdCk7XG5cdCAgICB9XG5cdCAgICAvKiBSb3RhdGUgcSxyLHMgaW50byB0aGUgY29ycmVjdCBhcmVhLiAqL1xuXHQgICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcblx0ICAgICAgdCA9IHI7XG5cdCAgICAgIHIgPSAtcztcblx0ICAgICAgcyA9IHQ7XG5cdCAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzIpIHtcblx0ICAgICAgciA9IC1yO1xuXHQgICAgICBzID0gLXM7XG5cdCAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzMpIHtcblx0ICAgICAgdCA9IHI7XG5cdCAgICAgIHIgPSBzO1xuXHQgICAgICBzID0gLXQ7XG5cdCAgICB9XG5cdCAgICAvKiBSb3RhdGUgcSxyLHMgaW50byB0aGUgY29ycmVjdCBjdWJlIGZhY2UuICovXG5cdCAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcblx0ICAgICAgdCA9IHE7XG5cdCAgICAgIHEgPSAtcjtcblx0ICAgICAgciA9IHQ7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJBQ0spIHtcblx0ICAgICAgcSA9IC1xO1xuXHQgICAgICByID0gLXI7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcblx0ICAgICAgdCA9IHE7XG5cdCAgICAgIHEgPSByO1xuXHQgICAgICByID0gLXQ7XG5cdCAgICB9XG5cdCAgICAvKiBOb3cgY29tcHV0ZSBwaGkgYW5kIGxhbSBmcm9tIHRoZSB1bml0IHNwaGVyZSBjb29yZGluYXRlcy4gKi9cblx0ICAgIGxwLnBoaSA9IE1hdGguYWNvcygtcykgLSBIQUxGX1BJO1xuXHQgICAgbHAubGFtID0gTWF0aC5hdGFuMihyLCBxKTtcblx0ICAgIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5SSUdIVCkge1xuXHQgICAgICBscC5sYW0gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihscC5sYW0sIC1IQUxGX1BJKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuXHQgICAgICBscC5sYW0gPSBxc2Nfc2hpZnRfbG9uX29yaWdpbihscC5sYW0sIC1TUEkpO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLmZhY2UgPT09IEZBQ0VfRU5VTS5MRUZUKSB7XG5cdCAgICAgIGxwLmxhbSA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxwLmxhbSwgK0hBTEZfUEkpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8qIEFwcGx5IHRoZSBzaGlmdCBmcm9tIHRoZSBzcGhlcmUgdG8gdGhlIGVsbGlwc29pZCBhcyBkZXNjcmliZWRcblx0ICAgKiBpbiBbTEsxMl0uICovXG5cdCAgaWYgKHRoaXMuZXMgIT09IDApIHtcblx0ICAgIHZhciBpbnZlcnRfc2lnbjtcblx0ICAgIHZhciB0YW5waGksIHhhO1xuXHQgICAgaW52ZXJ0X3NpZ24gPSAobHAucGhpIDwgMCA/IDEgOiAwKTtcblx0ICAgIHRhbnBoaSA9IE1hdGgudGFuKGxwLnBoaSk7XG5cdCAgICB4YSA9IHRoaXMuYiAvIE1hdGguc3FydCh0YW5waGkgKiB0YW5waGkgKyB0aGlzLm9uZV9taW51c19mX3NxdWFyZWQpO1xuXHQgICAgbHAucGhpID0gTWF0aC5hdGFuKE1hdGguc3FydCh0aGlzLmEgKiB0aGlzLmEgLSB4YSAqIHhhKSAvICh0aGlzLm9uZV9taW51c19mICogeGEpKTtcblx0ICAgIGlmIChpbnZlcnRfc2lnbikge1xuXHQgICAgICBscC5waGkgPSAtbHAucGhpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGxwLmxhbSArPSB0aGlzLmxvbmcwO1xuXHQgIHAueCA9IGxwLmxhbTtcblx0ICBwLnkgPSBscC5waGk7XG5cdCAgcmV0dXJuIHA7XG5cdH1cblxuXHQvKiBIZWxwZXIgZnVuY3Rpb24gZm9yIGZvcndhcmQgcHJvamVjdGlvbjogY29tcHV0ZSB0aGUgdGhldGEgYW5nbGVcblx0ICogYW5kIGRldGVybWluZSB0aGUgYXJlYSBudW1iZXIuICovXG5cdGZ1bmN0aW9uIHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHksIHgsIGFyZWEpIHtcblx0ICB2YXIgdGhldGE7XG5cdCAgaWYgKHBoaSA8IEVQU0xOKSB7XG5cdCAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcblx0ICAgIHRoZXRhID0gMC4wO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB0aGV0YSA9IE1hdGguYXRhbjIoeSwgeCk7XG5cdCAgICBpZiAoTWF0aC5hYnModGhldGEpIDw9IEZPUlRQSSkge1xuXHQgICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMDtcblx0ICAgIH0gZWxzZSBpZiAodGhldGEgPiBGT1JUUEkgJiYgdGhldGEgPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuXHQgICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcblx0ICAgICAgdGhldGEgLT0gSEFMRl9QSTtcblx0ICAgIH0gZWxzZSBpZiAodGhldGEgPiBIQUxGX1BJICsgRk9SVFBJIHx8IHRoZXRhIDw9IC0oSEFMRl9QSSArIEZPUlRQSSkpIHtcblx0ICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzI7XG5cdCAgICAgIHRoZXRhID0gKHRoZXRhID49IDAuMCA/IHRoZXRhIC0gU1BJIDogdGhldGEgKyBTUEkpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG5cdCAgICAgIHRoZXRhICs9IEhBTEZfUEk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiB0aGV0YTtcblx0fVxuXG5cdC8qIEhlbHBlciBmdW5jdGlvbjogc2hpZnQgdGhlIGxvbmdpdHVkZS4gKi9cblx0ZnVuY3Rpb24gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obG9uLCBvZmZzZXQpIHtcblx0ICB2YXIgc2xvbiA9IGxvbiArIG9mZnNldDtcblx0ICBpZiAoc2xvbiA8IC1TUEkpIHtcblx0ICAgIHNsb24gKz0gVFdPX1BJO1xuXHQgIH0gZWxzZSBpZiAoc2xvbiA+ICtTUEkpIHtcblx0ICAgIHNsb24gLT0gVFdPX1BJO1xuXHQgIH1cblx0ICByZXR1cm4gc2xvbjtcblx0fVxuXG5cdHZhciBuYW1lcyQyOCA9IFtcIlF1YWRyaWxhdGVyYWxpemVkIFNwaGVyaWNhbCBDdWJlXCIsIFwiUXVhZHJpbGF0ZXJhbGl6ZWRfU3BoZXJpY2FsX0N1YmVcIiwgXCJxc2NcIl07XG5cdHZhciBxc2MgPSB7XG5cdCAgaW5pdDogaW5pdCQyNyxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDI2LFxuXHQgIGludmVyc2U6IGludmVyc2UkMjYsXG5cdCAgbmFtZXM6IG5hbWVzJDI4XG5cdH07XG5cblx0Ly8gUm9iaW5zb24gcHJvamVjdGlvblxuXHQvLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2Jsb2IvbWFzdGVyL3NyYy9QSl9yb2Jpbi5jXG5cdC8vIFBvbHlub21pYWwgY29lZmljaWVudHMgZnJvbSBodHRwOi8vYXJ0aWNsZS5nbWFuZS5vcmcvZ21hbmUuY29tcC5naXMucHJvai00LmRldmVsLzYwMzlcblxuXHR2YXIgQ09FRlNfWCA9IFtcblx0ICAgIFsxLjAwMDAsIDIuMjE5OWUtMTcsIC03LjE1NTE1ZS0wNSwgMy4xMTAzZS0wNl0sXG5cdCAgICBbMC45OTg2LCAtMC4wMDA0ODIyNDMsIC0yLjQ4OTdlLTA1LCAtMS4zMzA5ZS0wNl0sXG5cdCAgICBbMC45OTU0LCAtMC4wMDA4MzEwMywgLTQuNDg2MDVlLTA1LCAtOS44NjcwMWUtMDddLFxuXHQgICAgWzAuOTkwMCwgLTAuMDAxMzUzNjQsIC01Ljk2NjFlLTA1LCAzLjY3NzdlLTA2XSxcblx0ICAgIFswLjk4MjIsIC0wLjAwMTY3NDQyLCAtNC40OTU0N2UtMDYsIC01LjcyNDExZS0wNl0sXG5cdCAgICBbMC45NzMwLCAtMC4wMDIxNDg2OCwgLTkuMDM1NzFlLTA1LCAxLjg3MzZlLTA4XSxcblx0ICAgIFswLjk2MDAsIC0wLjAwMzA1MDg1LCAtOS4wMDc2MWUtMDUsIDEuNjQ5MTdlLTA2XSxcblx0ICAgIFswLjk0MjcsIC0wLjAwMzgyNzkyLCAtNi41MzM4NmUtMDUsIC0yLjYxNTRlLTA2XSxcblx0ICAgIFswLjkyMTYsIC0wLjAwNDY3NzQ2LCAtMC4wMDAxMDQ1NywgNC44MTI0M2UtMDZdLFxuXHQgICAgWzAuODk2MiwgLTAuMDA1MzYyMjMsIC0zLjIzODMxZS0wNSwgLTUuNDM0MzJlLTA2XSxcblx0ICAgIFswLjg2NzksIC0wLjAwNjA5MzYzLCAtMC4wMDAxMTM4OTgsIDMuMzI0ODRlLTA2XSxcblx0ICAgIFswLjgzNTAsIC0wLjAwNjk4MzI1LCAtNi40MDI1M2UtMDUsIDkuMzQ5NTllLTA3XSxcblx0ICAgIFswLjc5ODYsIC0wLjAwNzU1MzM4LCAtNS4wMDAwOWUtMDUsIDkuMzUzMjRlLTA3XSxcblx0ICAgIFswLjc1OTcsIC0wLjAwNzk4MzI0LCAtMy41OTcxZS0wNSwgLTIuMjc2MjZlLTA2XSxcblx0ICAgIFswLjcxODYsIC0wLjAwODUxMzY3LCAtNy4wMTE0OWUtMDUsIC04LjYzMDNlLTA2XSxcblx0ICAgIFswLjY3MzIsIC0wLjAwOTg2MjA5LCAtMC4wMDAxOTk1NjksIDEuOTE5NzRlLTA1XSxcblx0ICAgIFswLjYyMTMsIC0wLjAxMDQxOCwgOC44MzkyM2UtMDUsIDYuMjQwNTFlLTA2XSxcblx0ICAgIFswLjU3MjIsIC0wLjAwOTA2NjAxLCAwLjAwMDE4MiwgNi4yNDA1MWUtMDZdLFxuXHQgICAgWzAuNTMyMiwgLTAuMDA2Nzc3OTcsIDAuMDAwMjc1NjA4LCA2LjI0MDUxZS0wNl1cblx0XTtcblxuXHR2YXIgQ09FRlNfWSA9IFtcblx0ICAgIFstNS4yMDQxN2UtMTgsIDAuMDEyNCwgMS4yMTQzMWUtMTgsIC04LjQ1Mjg0ZS0xMV0sXG5cdCAgICBbMC4wNjIwLCAwLjAxMjQsIC0xLjI2NzkzZS0wOSwgNC4yMjY0MmUtMTBdLFxuXHQgICAgWzAuMTI0MCwgMC4wMTI0LCA1LjA3MTcxZS0wOSwgLTEuNjA2MDRlLTA5XSxcblx0ICAgIFswLjE4NjAsIDAuMDEyMzk5OSwgLTEuOTAxODllLTA4LCA2LjAwMTUyZS0wOV0sXG5cdCAgICBbMC4yNDgwLCAwLjAxMjQwMDIsIDcuMTAwMzllLTA4LCAtMi4yNGUtMDhdLFxuXHQgICAgWzAuMzEwMCwgMC4wMTIzOTkyLCAtMi42NDk5N2UtMDcsIDguMzU5ODZlLTA4XSxcblx0ICAgIFswLjM3MjAsIDAuMDEyNDAyOSwgOS44ODk4M2UtMDcsIC0zLjExOTk0ZS0wN10sXG5cdCAgICBbMC40MzQwLCAwLjAxMjM4OTMsIC0zLjY5MDkzZS0wNiwgLTQuMzU2MjFlLTA3XSxcblx0ICAgIFswLjQ5NTgsIDAuMDEyMzE5OCwgLTEuMDIyNTJlLTA1LCAtMy40NTUyM2UtMDddLFxuXHQgICAgWzAuNTU3MSwgMC4wMTIxOTE2LCAtMS41NDA4MWUtMDUsIC01LjgyMjg4ZS0wN10sXG5cdCAgICBbMC42MTc2LCAwLjAxMTk5MzgsIC0yLjQxNDI0ZS0wNSwgLTUuMjUzMjdlLTA3XSxcblx0ICAgIFswLjY3NjksIDAuMDExNzEzLCAtMy4yMDIyM2UtMDUsIC01LjE2NDA1ZS0wN10sXG5cdCAgICBbMC43MzQ2LCAwLjAxMTM1NDEsIC0zLjk3Njg0ZS0wNSwgLTYuMDkwNTJlLTA3XSxcblx0ICAgIFswLjc5MDMsIDAuMDEwOTEwNywgLTQuODkwNDJlLTA1LCAtMS4wNDczOWUtMDZdLFxuXHQgICAgWzAuODQzNSwgMC4wMTAzNDMxLCAtNi40NjE1ZS0wNSwgLTEuNDAzNzRlLTA5XSxcblx0ICAgIFswLjg5MzYsIDAuMDA5Njk2ODYsIC02LjQ2MzZlLTA1LCAtOC41NDdlLTA2XSxcblx0ICAgIFswLjkzOTQsIDAuMDA4NDA5NDcsIC0wLjAwMDE5Mjg0MSwgLTQuMjEwNmUtMDZdLFxuXHQgICAgWzAuOTc2MSwgMC4wMDYxNjUyNywgLTAuMDAwMjU2LCAtNC4yMTA2ZS0wNl0sXG5cdCAgICBbMS4wMDAwLCAwLjAwMzI4OTQ3LCAtMC4wMDAzMTkxNTksIC00LjIxMDZlLTA2XVxuXHRdO1xuXG5cdHZhciBGWEMgPSAwLjg0ODc7XG5cdHZhciBGWUMgPSAxLjM1MjM7XG5cdHZhciBDMSA9IFIyRC81OyAvLyByYWQgdG8gNS1kZWdyZWUgaW50ZXJ2YWxcblx0dmFyIFJDMSA9IDEvQzE7XG5cdHZhciBOT0RFUyA9IDE4O1xuXG5cdHZhciBwb2x5M192YWwgPSBmdW5jdGlvbihjb2VmcywgeCkge1xuXHQgICAgcmV0dXJuIGNvZWZzWzBdICsgeCAqIChjb2Vmc1sxXSArIHggKiAoY29lZnNbMl0gKyB4ICogY29lZnNbM10pKTtcblx0fTtcblxuXHR2YXIgcG9seTNfZGVyID0gZnVuY3Rpb24oY29lZnMsIHgpIHtcblx0ICAgIHJldHVybiBjb2Vmc1sxXSArIHggKiAoMiAqIGNvZWZzWzJdICsgeCAqIDMgKiBjb2Vmc1szXSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gbmV3dG9uX3JhcHNob24oZl9kZiwgc3RhcnQsIG1heF9lcnIsIGl0ZXJzKSB7XG5cdCAgICB2YXIgeCA9IHN0YXJ0O1xuXHQgICAgZm9yICg7IGl0ZXJzOyAtLWl0ZXJzKSB7XG5cdCAgICAgICAgdmFyIHVwZCA9IGZfZGYoeCk7XG5cdCAgICAgICAgeCAtPSB1cGQ7XG5cdCAgICAgICAgaWYgKE1hdGguYWJzKHVwZCkgPCBtYXhfZXJyKSB7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiB4O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCQyOCgpIHtcblx0ICAgIHRoaXMueDAgPSB0aGlzLngwIHx8IDA7XG5cdCAgICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuXHQgICAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcblx0ICAgIHRoaXMuZXMgPSAwO1xuXHQgICAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGUgfHwgXCJSb2JpbnNvblwiO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9yd2FyZCQyNyhsbCkge1xuXHQgICAgdmFyIGxvbiA9IGFkanVzdF9sb24obGwueCAtIHRoaXMubG9uZzApO1xuXG5cdCAgICB2YXIgZHBoaSA9IE1hdGguYWJzKGxsLnkpO1xuXHQgICAgdmFyIGkgPSBNYXRoLmZsb29yKGRwaGkgKiBDMSk7XG5cdCAgICBpZiAoaSA8IDApIHtcblx0ICAgICAgICBpID0gMDtcblx0ICAgIH0gZWxzZSBpZiAoaSA+PSBOT0RFUykge1xuXHQgICAgICAgIGkgPSBOT0RFUyAtIDE7XG5cdCAgICB9XG5cdCAgICBkcGhpID0gUjJEICogKGRwaGkgLSBSQzEgKiBpKTtcblx0ICAgIHZhciB4eSA9IHtcblx0ICAgICAgICB4OiBwb2x5M192YWwoQ09FRlNfWFtpXSwgZHBoaSkgKiBsb24sXG5cdCAgICAgICAgeTogcG9seTNfdmFsKENPRUZTX1lbaV0sIGRwaGkpXG5cdCAgICB9O1xuXHQgICAgaWYgKGxsLnkgPCAwKSB7XG5cdCAgICAgICAgeHkueSA9IC14eS55O1xuXHQgICAgfVxuXG5cdCAgICB4eS54ID0geHkueCAqIHRoaXMuYSAqIEZYQyArIHRoaXMueDA7XG5cdCAgICB4eS55ID0geHkueSAqIHRoaXMuYSAqIEZZQyArIHRoaXMueTA7XG5cdCAgICByZXR1cm4geHk7XG5cdH1cblxuXHRmdW5jdGlvbiBpbnZlcnNlJDI3KHh5KSB7XG5cdCAgICB2YXIgbGwgPSB7XG5cdCAgICAgICAgeDogKHh5LnggLSB0aGlzLngwKSAvICh0aGlzLmEgKiBGWEMpLFxuXHQgICAgICAgIHk6IE1hdGguYWJzKHh5LnkgLSB0aGlzLnkwKSAvICh0aGlzLmEgKiBGWUMpXG5cdCAgICB9O1xuXG5cdCAgICBpZiAobGwueSA+PSAxKSB7IC8vIHBhdGhvbG9naWMgY2FzZVxuXHQgICAgICAgIGxsLnggLz0gQ09FRlNfWFtOT0RFU11bMF07XG5cdCAgICAgICAgbGwueSA9IHh5LnkgPCAwID8gLUhBTEZfUEkgOiBIQUxGX1BJO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBmaW5kIHRhYmxlIGludGVydmFsXG5cdCAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKGxsLnkgKiBOT0RFUyk7XG5cdCAgICAgICAgaWYgKGkgPCAwKSB7XG5cdCAgICAgICAgICAgIGkgPSAwO1xuXHQgICAgICAgIH0gZWxzZSBpZiAoaSA+PSBOT0RFUykge1xuXHQgICAgICAgICAgICBpID0gTk9ERVMgLSAxO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBmb3IgKDs7KSB7XG5cdCAgICAgICAgICAgIGlmIChDT0VGU19ZW2ldWzBdID4gbGwueSkge1xuXHQgICAgICAgICAgICAgICAgLS1pO1xuXHQgICAgICAgICAgICB9IGVsc2UgaWYgKENPRUZTX1lbaSsxXVswXSA8PSBsbC55KSB7XG5cdCAgICAgICAgICAgICAgICArK2k7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICAvLyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBpbiA1IGRlZ3JlZSBpbnRlcnZhbFxuXHQgICAgICAgIHZhciBjb2VmcyA9IENPRUZTX1lbaV07XG5cdCAgICAgICAgdmFyIHQgPSA1ICogKGxsLnkgLSBjb2Vmc1swXSkgLyAoQ09FRlNfWVtpKzFdWzBdIC0gY29lZnNbMF0pO1xuXHQgICAgICAgIC8vIGZpbmQgdCBzbyB0aGF0IHBvbHkzX3ZhbChjb2VmcywgdCkgPSBsbC55XG5cdCAgICAgICAgdCA9IG5ld3Rvbl9yYXBzaG9uKGZ1bmN0aW9uKHgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIChwb2x5M192YWwoY29lZnMsIHgpIC0gbGwueSkgLyBwb2x5M19kZXIoY29lZnMsIHgpO1xuXHQgICAgICAgIH0sIHQsIEVQU0xOLCAxMDApO1xuXG5cdCAgICAgICAgbGwueCAvPSBwb2x5M192YWwoQ09FRlNfWFtpXSwgdCk7XG5cdCAgICAgICAgbGwueSA9ICg1ICogaSArIHQpICogRDJSO1xuXHQgICAgICAgIGlmICh4eS55IDwgMCkge1xuXHQgICAgICAgICAgICBsbC55ID0gLWxsLnk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBsbC54ID0gYWRqdXN0X2xvbihsbC54ICsgdGhpcy5sb25nMCk7XG5cdCAgICByZXR1cm4gbGw7XG5cdH1cblxuXHR2YXIgbmFtZXMkMjkgPSBbXCJSb2JpbnNvblwiLCBcInJvYmluXCJdO1xuXHR2YXIgcm9iaW4gPSB7XG5cdCAgaW5pdDogaW5pdCQyOCxcblx0ICBmb3J3YXJkOiBmb3J3YXJkJDI3LFxuXHQgIGludmVyc2U6IGludmVyc2UkMjcsXG5cdCAgbmFtZXM6IG5hbWVzJDI5XG5cdH07XG5cblx0dmFyIGluY2x1ZGVkUHJvamVjdGlvbnMgPSBmdW5jdGlvbihwcm9qNCl7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodG1lcmMpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGV0bWVyYyk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodXRtKTtcblx0ICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzdGVyZWEpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHN0ZXJlKTtcblx0ICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzb21lcmMpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG9tZXJjKTtcblx0ICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChsY2MpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGtyb3Zhayk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoY2Fzcyk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobGFlYSk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoYWVhKTtcblx0ICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChnbm9tKTtcblx0ICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChjZWEpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGVxYyk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQocG9seSk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobnptZyk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobWlsbCk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoc2ludSk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobW9sbCk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZXFkYyk7XG5cdCAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQodmFuZGcpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGFlcWQpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG9ydGhvKTtcblx0ICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChxc2MpO1xuXHQgIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHJvYmluKTtcblx0fTtcblxuXHRwcm9qNCQxLmRlZmF1bHREYXR1bSA9ICdXR1M4NCc7IC8vZGVmYXVsdCBkYXR1bVxuXHRwcm9qNCQxLlByb2ogPSBQcm9qZWN0aW9uO1xuXHRwcm9qNCQxLldHUzg0ID0gbmV3IHByb2o0JDEuUHJvaignV0dTODQnKTtcblx0cHJvajQkMS5Qb2ludCA9IFBvaW50O1xuXHRwcm9qNCQxLnRvUG9pbnQgPSB0b1BvaW50O1xuXHRwcm9qNCQxLmRlZnMgPSBkZWZzO1xuXHRwcm9qNCQxLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcblx0cHJvajQkMS5tZ3JzID0gbWdycztcblx0cHJvajQkMS52ZXJzaW9uID0gdmVyc2lvbjtcblx0aW5jbHVkZWRQcm9qZWN0aW9ucyhwcm9qNCQxKTtcblxuXHRyZXR1cm4gcHJvajQkMTtcblxufSkpKTtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBwcm9qNCA9IHJlcXVpcmUoJ3Byb2o0JykuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSA/IHJlcXVpcmUoJ3Byb2o0JykuZGVmYXVsdCA6IHJlcXVpcmUoJ3Byb2o0Jyk7XHJcbi8vIENoZWNrcyBpZiBgbGlzdGAgbG9va3MgbGlrZSBhIGBbeCwgeV1gLlxyXG5mdW5jdGlvbiBpc1hZKGxpc3QpIHtcclxuICByZXR1cm4gbGlzdC5sZW5ndGggPj0gMiAmJlxyXG4gICAgdHlwZW9mIGxpc3RbMF0gPT09ICdudW1iZXInICYmXHJcbiAgICB0eXBlb2YgbGlzdFsxXSA9PT0gJ251bWJlcic7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyYXZlcnNlQ29vcmRzKGNvb3JkaW5hdGVzLCBjYWxsYmFjaykge1xyXG4gIGlmIChpc1hZKGNvb3JkaW5hdGVzKSkgcmV0dXJuIGNhbGxiYWNrKGNvb3JkaW5hdGVzKTtcclxuICByZXR1cm4gY29vcmRpbmF0ZXMubWFwKGZ1bmN0aW9uKGNvb3JkKXtyZXR1cm4gdHJhdmVyc2VDb29yZHMoY29vcmQsIGNhbGxiYWNrKTt9KTtcclxufVxyXG5cclxuLy8gU2ltcGxpc3RpYyBzaGFsbG93IGNsb25lIHRoYXQgd2lsbCB3b3JrIGZvciBhIG5vcm1hbCBHZW9KU09OIG9iamVjdC5cclxuZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcbiAgaWYgKG51bGwgPT0gb2JqIHx8ICdvYmplY3QnICE9PSB0eXBlb2Ygb2JqKSByZXR1cm4gb2JqO1xyXG4gIHZhciBjb3B5ID0gb2JqLmNvbnN0cnVjdG9yKCk7XHJcbiAgZm9yICh2YXIgYXR0ciBpbiBvYmopIHtcclxuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYXR0cikpIGNvcHlbYXR0cl0gPSBvYmpbYXR0cl07XHJcbiAgfVxyXG4gIHJldHVybiBjb3B5O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0cmF2ZXJzZUdlb0pzb24oZ2VvbWV0cnlDYiwgbm9kZUNiLCBnZW9qc29uKSB7XHJcbiAgaWYgKGdlb2pzb24gPT0gbnVsbCkgcmV0dXJuIGdlb2pzb247XHJcblxyXG4gIHZhciByID0gY2xvbmUoZ2VvanNvbik7XHJcbiAgdmFyIHNlbGYgPSB0cmF2ZXJzZUdlb0pzb24uYmluZCh0aGlzLCBnZW9tZXRyeUNiLCBub2RlQ2IpO1xyXG5cclxuICBzd2l0Y2ggKGdlb2pzb24udHlwZSkge1xyXG4gIGNhc2UgJ0ZlYXR1cmUnOlxyXG4gICAgci5nZW9tZXRyeSA9IHNlbGYoZ2VvanNvbi5nZW9tZXRyeSk7XHJcbiAgICBicmVhaztcclxuICBjYXNlICdGZWF0dXJlQ29sbGVjdGlvbic6XHJcbiAgICByLmZlYXR1cmVzID0gci5mZWF0dXJlcy5tYXAoc2VsZik7XHJcbiAgICBicmVhaztcclxuICBjYXNlICdHZW9tZXRyeUNvbGxlY3Rpb24nOlxyXG4gICAgci5nZW9tZXRyaWVzID0gci5nZW9tZXRyaWVzLm1hcChzZWxmKTtcclxuICAgIGJyZWFrO1xyXG4gIGRlZmF1bHQ6XHJcbiAgICBnZW9tZXRyeUNiKHIpO1xyXG4gICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICBpZiAobm9kZUNiKSBub2RlQ2Iocik7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlY3RDcnMoZ2VvanNvbiwgcHJvanMpIHtcclxuICB2YXIgY3JzSW5mbyA9IGdlb2pzb24uY3JzLFxyXG4gICAgICBjcnM7XHJcblxyXG4gIGlmIChjcnNJbmZvID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVjdCBDUlMsIEdlb0pTT04gaGFzIG5vIFwiY3JzXCIgcHJvcGVydHkuJyk7XHJcbiAgfVxyXG5cclxuICBpZiAoY3JzSW5mby50eXBlID09PSAnbmFtZScpIHtcclxuICAgIGNycyA9IHByb2pzW2Nyc0luZm8ucHJvcGVydGllcy5uYW1lXTtcclxuICB9IGVsc2UgaWYgKGNyc0luZm8udHlwZSA9PT0gJ0VQU0cnKSB7XHJcbiAgICBjcnMgPSBwcm9qc1snRVBTRzonICsgY3JzSW5mby5wcm9wZXJ0aWVzLmNvZGVdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjcnMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignQ1JTIGRlZmluZWQgaW4gY3JzIHNlY3Rpb24gY291bGQgbm90IGJlIGlkZW50aWZpZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShjcnNJbmZvKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY3JzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVDcnMoY3JzLCBwcm9qcykge1xyXG4gIGlmICh0eXBlb2YgY3JzID09PSAnc3RyaW5nJyB8fCBjcnMgaW5zdGFuY2VvZiBTdHJpbmcpIHtcclxuICAgIHJldHVybiBwcm9qc1tjcnNdIHx8IHByb2o0LlByb2ooY3JzKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjcnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGNCYm94KGdlb2pzb24pIHtcclxuICB2YXIgbWluID0gW051bWJlci5NQVhfVkFMVUUsIE51bWJlci5NQVhfVkFMVUVdLFxyXG4gICAgICBtYXggPSBbLU51bWJlci5NQVhfVkFMVUUsIC1OdW1iZXIuTUFYX1ZBTFVFXTtcclxuICB0cmF2ZXJzZUdlb0pzb24oZnVuY3Rpb24oX2dqKSB7XHJcbiAgICB0cmF2ZXJzZUNvb3JkcyhfZ2ouY29vcmRpbmF0ZXMsIGZ1bmN0aW9uKHh5KSB7XHJcbiAgICAgIG1pblswXSA9IE1hdGgubWluKG1pblswXSwgeHlbMF0pO1xyXG4gICAgICBtaW5bMV0gPSBNYXRoLm1pbihtaW5bMV0sIHh5WzFdKTtcclxuICAgICAgbWF4WzBdID0gTWF0aC5tYXgobWF4WzBdLCB4eVswXSk7XHJcbiAgICAgIG1heFsxXSA9IE1hdGgubWF4KG1heFsxXSwgeHlbMV0pO1xyXG4gICAgfSk7XHJcbiAgfSwgbnVsbCwgZ2VvanNvbik7XHJcbiAgcmV0dXJuIFttaW5bMF0sIG1pblsxXSwgbWF4WzBdLCBtYXhbMV1dO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXByb2plY3QoZ2VvanNvbiwgZnJvbSwgdG8sIHByb2pzKSB7XHJcbiAgcHJvanMgPSBwcm9qcyB8fCB7fTtcclxuICBpZiAoIWZyb20pIHtcclxuICAgIGZyb20gPSBkZXRlY3RDcnMoZ2VvanNvbiwgcHJvanMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmcm9tID0gZGV0ZXJtaW5lQ3JzKGZyb20sIHByb2pzKTtcclxuICB9XHJcblxyXG4gIHRvID0gZGV0ZXJtaW5lQ3JzKHRvLCBwcm9qcyk7XHJcbiAgdmFyIHRyYW5zZm9ybSA9IHByb2o0KGZyb20sIHRvKS5mb3J3YXJkLmJpbmQodHJhbnNmb3JtKTtcclxuXHJcbiAgdmFyIHRyYW5zZm9ybUdlb21ldHJ5Q29vcmRzID0gZnVuY3Rpb24oZ2opIHtcclxuICAgIC8vIE5vIGVhc3kgd2F5IHRvIHB1dCBjb3JyZWN0IENSUyBpbmZvIGludG8gdGhlIEdlb0pTT04sXHJcbiAgICAvLyBhbmQgZGVmaW5pdGVseSB3cm9uZyB0byBrZWVwIHRoZSBvbGQsIHNvIGRlbGV0ZSBpdC5cclxuICAgIGlmIChnai5jcnMpIHtcclxuICAgICAgZGVsZXRlIGdqLmNycztcclxuICAgIH1cclxuICAgIGdqLmNvb3JkaW5hdGVzID0gdHJhdmVyc2VDb29yZHMoZ2ouY29vcmRpbmF0ZXMsIHRyYW5zZm9ybSk7XHJcbiAgfVxyXG5cclxuICB2YXIgdHJhbnNmb3JtQmJveCA9IGZ1bmN0aW9uKGdqKSB7XHJcbiAgICBpZiAoZ2ouYmJveCkge1xyXG4gICAgICBnai5iYm94ID0gY2FsY0Jib3goZ2opO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRyYXZlcnNlR2VvSnNvbih0cmFuc2Zvcm1HZW9tZXRyeUNvb3JkcywgdHJhbnNmb3JtQmJveCwgZ2VvanNvbik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGRldGVjdENyczogZGV0ZWN0Q3JzLFxyXG5cclxuICByZXByb2plY3Q6IHJlcHJvamVjdCxcclxuXHJcbiAgcmV2ZXJzZTogZnVuY3Rpb24oZ2VvanNvbikge1xyXG4gICAgcmV0dXJuIHRyYXZlcnNlR2VvSnNvbihmdW5jdGlvbihnaikge1xyXG4gICAgICBnai5jb29yZGluYXRlcyA9IHRyYXZlcnNlQ29vcmRzKGdqLmNvb3JkaW5hdGVzLCBmdW5jdGlvbih4eSkge1xyXG4gICAgICAgIHJldHVybiBbIHh5WzFdLCB4eVswXSBdO1xyXG4gICAgICB9KTtcclxuICAgIH0sIG51bGwsIGdlb2pzb24pO1xyXG4gIH0sXHJcblxyXG4gIHRvV2dzODQ6IGZ1bmN0aW9uKGdlb2pzb24sIGZyb20sIHByb2pzKSB7XHJcbiAgICByZXR1cm4gcmVwcm9qZWN0KGdlb2pzb24sIGZyb20sIHByb2o0LldHUzg0LCBwcm9qcyk7XHJcbiAgfVxyXG59O1xyXG4iLCIvKmNvbnN0IG1hcGJveGdsID0gd2luZG93Lm1hcGJveGdsXG5cbmZldGNoKCcuLi90aWxlcy9ocC9sYXllcnMuanNvbicpXG4gIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAudGhlbihsYXllcnMgPT4ge1xuICAgIGNvbnN0IG1hcCA9IHdpbmRvdy5fbWFwID0gbmV3IG1hcGJveGdsLk1hcCh7XG4gICAgICBjb250YWluZXI6ICdtYXAnLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgdmVyc2lvbjogOCxcbiAgICAgICAgbmFtZTogJ09DQUQgZGVtbycsXG4gICAgICAgIHNvdXJjZXM6IHtcbiAgICAgICAgICBtYXA6IHtcbiAgICAgICAgICAgIHR5cGU6ICd2ZWN0b3InLFxuICAgICAgICAgICAgdGlsZXM6IFsnaHR0cDovL2xvY2FsaG9zdDo4MDgxL3RpbGVzL2hwL3t6fS97eH0ve3l9LnBiZiddLFxuICAgICAgICAgICAgbWF4em9vbTogMTRcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGxheWVyc1xuICAgICAgfSxcbiAgICAgIGNlbnRlcjogWzExLjkyLCA1Ny43NDVdLFxuICAgICAgem9vbTogMTMsXG4gICAgICBjdXN0b21BdHRyaWJ1dGlvbjogJyZjb3B5OyAyMDE4IFRvbGVyZWRzIEFJSywgRsOkbHRhcmJldGU6IE1hdGhzIENhcmxzc29uJ1xuICAgIH0pXG5cbiAgICBjb25zdCBuYXYgPSBuZXcgbWFwYm94Z2wuTmF2aWdhdGlvbkNvbnRyb2woKTtcbiAgICBtYXAuYWRkQ29udHJvbChuYXYsICd0b3AtbGVmdCcpO1xuXG4gICAgLy8gbWFwLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zdCBib3VuZHMgPSBiYm94KGdlb0pzb24pXG4gICAgLy8gICBtYXAuZml0Qm91bmRzKGJvdW5kcywge1xuICAgIC8vICAgICBwYWRkaW5nOiAyMCxcbiAgICAvLyAgICAgYW5pbWF0ZTogZmFsc2VcbiAgICAvLyAgIH0pXG4gICAgLy8gfSlcbiAgfSlcbiovXG5cbmNvbnN0IFZ1ZSA9IHdpbmRvdy5WdWVcbmNvbnN0IHRvQnVmZmVyID0gcmVxdWlyZSgnYmxvYi10by1idWZmZXInKVxuY29uc3QgYmJveCA9IHJlcXVpcmUoJ0B0dXJmL2Jib3gnKS5kZWZhdWx0XG5jb25zdCB7IHRvV2dzODQgfSA9IHJlcXVpcmUoJ3JlcHJvamVjdCcpXG5jb25zdCB7IHJlYWRPY2FkLCBvY2FkVG9HZW9Kc29uLCBvY2FkVG9NYXBib3hHbFN0eWxlIH0gPSByZXF1aXJlKCcuLi8uLi8nKVxuXG5WdWUuY29tcG9uZW50KCd1cGxvYWQtZm9ybScsIHtcbiAgdGVtcGxhdGU6ICcjdXBsb2FkLWZvcm0tdGVtcGxhdGUnLFxuICBwcm9wczogW10sXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWxlczogW10sXG4gICAgICBlcHNnOiAzMDA2XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZmlsZVNlbGVjdGVkIChlKSB7XG4gICAgICB0aGlzLmZpbGVzID0gZS50YXJnZXQuZmlsZXNcbiAgICB9LFxuICAgIGxvYWRGaWxlICgpIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbcmVhZGVyLnJlc3VsdF0sIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pXG4gICAgICAgIHRvQnVmZmVyKGJsb2IsIChlcnIsIGJ1ZmZlcikgPT4ge1xuICAgICAgICAgIHRoaXMuJGVtaXQoJ2ZpbGVzZWxlY3RlZCcsIHtcbiAgICAgICAgICAgIG5hbWU6IGZpbGUubmFtZSxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGJ1ZmZlcixcbiAgICAgICAgICAgIGVwc2c6IHRoaXMuZXBzZ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVzWzBdXG4gICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSlcbiAgICB9XG4gIH1cbn0pXG5cblZ1ZS5jb21wb25lbnQoJ2ZpbGUtaW5mbycsIHtcbiAgdGVtcGxhdGU6ICcjZmlsZS1pbmZvLXRlbXBsYXRlJyxcbiAgcHJvcHM6IFsnbmFtZScsICdmaWxlJywgJ2Vycm9yJ10sXG4gIGNvbXB1dGVkOiB7XG4gICAgY3JzICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbGUgJiYgdGhpcy5maWxlLnBhcmFtZXRlclN0cmluZ3NbMTAzOV0gJiYgdGhpcy5maWxlLnBhcmFtZXRlclN0cmluZ3NbMTAzOV1bMF1cbiAgICB9XG4gIH1cbn0pXG5cblZ1ZS5jb21wb25lbnQoJ21hcC12aWV3Jywge1xuICB0ZW1wbGF0ZTogJyNtYXAtdmlldy10ZW1wbGF0ZScsXG4gIHByb3BzOiBbJ2xheWVycycsICdnZW9qc29uJ10sXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMubWFwID0gbmV3IG1hcGJveGdsLk1hcCh7XG4gICAgICBjb250YWluZXI6IHRoaXMuJHJlZnMubWFwQ29udGFpbmVyLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGUoKVxuICAgIH0pXG5cbiAgICBjb25zdCBuYXYgPSBuZXcgbWFwYm94Z2wuTmF2aWdhdGlvbkNvbnRyb2woKTtcbiAgICB0aGlzLm1hcC5hZGRDb250cm9sKG5hdiwgJ3RvcC1yaWdodCcpO1xuICB9LFxuICB3YXRjaDoge1xuICAgIGxheWVycyAoKSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0sXG4gICAgZ2VvanNvbiAoKSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgICAgY29uc3QgYm91bmRzID0gYmJveCh0aGlzLmdlb2pzb24pXG4gICAgICB0aGlzLm1hcC5maXRCb3VuZHMoYm91bmRzLCB7XG4gICAgICAgIHBhZGRpbmc6IDIwLFxuICAgICAgICBhbmltYXRlOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICByZWZyZXNoICgpIHtcbiAgICAgIGlmICghdGhpcy5tYXApIHsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5tYXAuc2V0U3R5bGUodGhpcy5zdHlsZSgpKVxuICAgIH0sXG4gICAgc3R5bGUgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmVyc2lvbjogOCxcbiAgICAgICAgbmFtZTogJ09DQUQgZGVtbycsXG4gICAgICAgIHNvdXJjZXM6IHtcbiAgICAgICAgICBtYXA6IHtcbiAgICAgICAgICAgIHR5cGU6ICdnZW9qc29uJyxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuZ2VvanNvbiB8fCB7dHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJywgZmVhdHVyZXM6IFtdfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbGF5ZXJzOiB0aGlzLmxheWVycyB8fCBbXVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcblxuY29uc3QgYXBwID0gbmV3IFZ1ZSh7XG4gIGVsOiAnI2FwcCcsXG4gIGRhdGE6IHtcbiAgICBuYW1lOiBudWxsLFxuICAgIGZpbGU6IG51bGwsXG4gICAgbWFwQ29uZmlnOiBudWxsLFxuICAgIGVycm9yOiBudWxsLFxuICAgIGxheWVyczogW10sXG4gICAgZ2VvanNvbjoge3R5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsIGZlYXR1cmVzOiBbXX0sXG4gICAgZXBzZ0NhY2hlOiB7fVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgc2VsZWN0RmlsZSAoe3BhdGgsIGNvbnRlbnQsIG5hbWUsIGVwc2d9KSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICB0aGlzLmZpbGUgPSBudWxsXG4gICAgICB0aGlzLmVycm9yID0gbnVsbFxuXG4gICAgICBjb25zdCBjcnNEZWYgPSB0aGlzLmVwc2dDYWNoZVtlcHNnXVxuICAgICAgICA/IFByb21pc2UucmVzb2x2ZSh0aGlzLmVwc2dDYWNoZVtlcHNnXSlcbiAgICAgICAgOiBmZXRjaChgaHR0cDovL2Vwc2cuaW8vJHtlcHNnfS5wcm9qNGApXG4gICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy50ZXh0KCkpXG4gICAgICAgICAgLnRoZW4ocHJvakRlZiA9PiB7XG4gICAgICAgICAgICB0aGlzLmVwc2dDYWNoZVtlcHNnXSA9IHByb2pEZWZcbiAgICAgICAgICAgIHJldHVybiBwcm9qRGVmXG4gICAgICAgICAgfSlcblxuICAgICAgcmVhZE9jYWQoY29udGVudClcbiAgICAgICAgLnRoZW4ob2NhZEZpbGUgPT4ge1xuICAgICAgICAgIHRoaXMuZmlsZSA9IE9iamVjdC5mcmVlemUob2NhZEZpbGUpXG4gICAgICAgICAgdGhpcy5sYXllcnMgPSBvY2FkVG9NYXBib3hHbFN0eWxlKHRoaXMuZmlsZSwge3NvdXJjZTogJ21hcCcsIHNvdXJjZUxheWVyOiAnJ30pXG5cbiAgICAgICAgICBjcnNEZWYudGhlbihwcm9qRGVmID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2VvanNvbiA9IHRvV2dzODQob2NhZFRvR2VvSnNvbih0aGlzLmZpbGUpLCBwcm9qRGVmKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnIubWVzc2FnZVxuICAgICAgICB9KVxuICAgIH1cbiAgfVxufSlcbiIsIi8qICBBZGFwdGVkIGZyb20gcGRmLmpzJ3MgY29sb3JzcGFjZSBtb2R1bGVcbiAgICAoaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvcGRmLmpzL2Jsb2IvYTE4MjkwNzU5MjI3Yzg5NGY4Zjk3ZjU4YzhkYThjZTk0MmY1YTM4Zi9zcmMvY29yZS9jb2xvcnNwYWNlLmpzKVxuXG4gICAgUmVsZWFzZWQgdW5kZXIgdGhlIEFwYWNoZSAyLjAgbGljZW5zZTpcbiAgICBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9wZGYuanMvYmxvYi9tYXN0ZXIvTElDRU5TRVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udmVydFRvUmdiIChzcmMpIHtcbiAgY29uc3QgdG9GcmFjdGlvbiA9IDEgLyAxMDBcbiAgY29uc3QgcmdiID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KDMpXG5cbiAgbGV0IGMgPSBzcmNbMF0gKiB0b0ZyYWN0aW9uXG4gIGxldCBtID0gc3JjWzFdICogdG9GcmFjdGlvblxuICBsZXQgeSA9IHNyY1syXSAqIHRvRnJhY3Rpb25cbiAgbGV0IGsgPSBzcmNbM10gKiB0b0ZyYWN0aW9uXG5cbiAgcmdiWzBdID0gMjU1ICtcbiAgICBjICogKC00LjM4NzMzMjM4NDYwOTk4OCAqIGMgKyA1NC40ODYxNTE5NDE4OTE3NiAqIG0gK1xuICAgICAgICAgMTguODIyOTA1MDIxNjUzMDIgKiB5ICsgMjEyLjI1NjYyNDUxNjM5NTg1ICogayArXG4gICAgICAgICAtMjg1LjIzMzEwMjYxMzcwMDQpICtcbiAgICBtICogKDEuNzE0OTc2MzQ3NzM2MjEzNCAqIG0gLSA1LjYwOTY3MzY5MDQwNDczMTUgKiB5ICtcbiAgICAgICAgIC0xNy44NzM4NzA4NjE0MTU0NDQgKiBrIC0gNS40OTcwMDY0MjcxOTYzNjYpICtcbiAgICB5ICogKC0yLjUyMTczNDAxMzE2ODMwMzMgKiB5IC0gMjEuMjQ4OTIzMzM3MzUzMDczICogayArXG4gICAgICAgICAxNy41MTE5MjcwODQxODEzKSArXG4gICAgayAqICgtMjEuODYxMjIxNDc0NjM2MDUgKiBrIC0gMTg5LjQ4MTgwODM1OTIyNzQ3KVxuXG4gIHJnYlsxXSA9IDI1NSArXG4gICAgYyAqICg4Ljg0MTA0MTQyMjAzNjE0OSAqIGMgKyA2MC4xMTgwMjcwNDU1OTczNjYgKiBtICtcbiAgICAgICAgIDYuODcxNDI1NTkyMDQ5MDA3ICogeSArIDMxLjE1OTEwMDEzMDA1NTkyMiAqIGsgK1xuICAgICAgICAgLTc5LjI5NzA4NDQ4MTY1NDgpICtcbiAgICBtICogKC0xNS4zMTAzNjEzMDY5Njc4MTcgKiBtICsgMTcuNTc1MjUxMjYxMTA5NDgyICogeSArXG4gICAgICAgICAxMzEuMzUyNTA5MTI0OTM5NzYgKiBrIC0gMTkwLjk0NTMzMDI1ODg5NTEpICtcbiAgICB5ICogKDQuNDQ0MzM5MTAyODUyNzM5ICogeSArIDkuODYzMjg2MTQ5MzQwNSAqIGsgLSAyNC44Njc0MTU4MjU1NTg3OCkgK1xuICAgIGsgKiAoLTIwLjczNzMyNTQ3MTE4MTAzNCAqIGsgLSAxODcuODA0NTM3MDk3MTk1NzgpXG5cbiAgcmdiWzJdID0gMjU1ICtcbiAgICBjICogKDAuODg0MjUyMjQzMDAwMzI5NiAqIGMgKyA4LjA3ODY3NzUwMzExMjkyOCAqIG0gK1xuICAgICAgICAgMzAuODk5NzgzMDk3MDM3MjkgKiB5IC0gMC4yMzg4MzIzODY4OTE3ODkzNCAqIGsgK1xuICAgICAgICAgLTE0LjE4MzU3Njc5OTY3MzI4NikgK1xuICAgIG0gKiAoMTAuNDk1OTMyNzM0MzIwNzIgKiBtICsgNjMuMDIzNzg0OTQ3NTQwNTIgKiB5ICtcbiAgICAgICAgIDUwLjYwNjk1NzY1NjM2MDczNCAqIGsgLSAxMTIuMjM4ODQyNTM3MTkyNDgpICtcbiAgICB5ICogKDAuMDMyOTYwNDExMTQ4NzMyMTcgKiB5ICsgMTE1LjYwMzg0NDQ5NjQ2NjQxICogayArXG4gICAgICAgICAtMTkzLjU4MjA5MzU2ODYxNTA1KSArXG4gICAgayAqICgtMjIuMzM4MTY4MDczMDk4ODYgKiBrIC0gMTgwLjEyNjEzOTc0NzA4MzY3KVxuXG4gIHJldHVybiBgcmdiKCR7cmdiWzBdfSwgJHtyZ2JbMV19LCAke3JnYlsyXX0pYFxufVxuIiwiY29uc3QgcmVhZE9jYWQgPSByZXF1aXJlKCcuL29jYWQtcmVhZGVyJylcbmNvbnN0IG9jYWRUb0dlb0pzb24gPSByZXF1aXJlKCcuL29jYWQtdG8tZ2VvanNvbicpXG5jb25zdCBvY2FkVG9NYXBib3hHbFN0eWxlID0gcmVxdWlyZSgnLi9vY2FkLXRvLW1hcGJveC1nbC1zdHlsZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZWFkT2NhZCxcbiAgb2NhZFRvR2VvSnNvbixcbiAgb2NhZFRvTWFwYm94R2xTdHlsZVxufVxuIiwiY29uc3QgeyBTeW1ib2wxMCwgU3ltYm9sMTEgfSA9IHJlcXVpcmUoJy4vc3ltYm9sJylcblxuY2xhc3MgQXJlYVN5bWJvbDEwIGV4dGVuZHMgU3ltYm9sMTAge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQpIHtcbiAgICBzdXBlcihidWZmZXIsIG9mZnNldCwgMylcblxuICAgIHRoaXMuYm9yZGVyU3ltID0gdGhpcy5yZWFkSW50ZWdlcigpXG4gICAgdGhpcy5maWxsQ29sb3IgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5oYXRjaE1vZGUgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5oYXRjaENvbG9yID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuaGF0Y2hMaW5lV2lkdGggPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5oYXRjaERpc3QgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5oYXRjaEFuZ2xlMSA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmhhdGNoQW5nbGUyID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuZmlsbE9uID0gISF0aGlzLnJlYWRCeXRlKClcbiAgICB0aGlzLmJvcmRlck9uID0gISF0aGlzLnJlYWRCeXRlKClcbiAgfVxufVxuXG5jbGFzcyBBcmVhU3ltYm9sMTEgZXh0ZW5kcyBTeW1ib2wxMSB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0LCAzKVxuXG4gICAgLy8gVE9ETzogd2h5P1xuICAgIHRoaXMub2Zmc2V0ICs9IDY0XG5cbiAgICB0aGlzLmJvcmRlclN5bSA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMuZmlsbENvbG9yID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuaGF0Y2hNb2RlID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuaGF0Y2hDb2xvciA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmhhdGNoTGluZVdpZHRoID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuaGF0Y2hEaXN0ID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuaGF0Y2hBbmdsZTEgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5oYXRjaEFuZ2xlMiA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmZpbGxPbiA9ICEhdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5ib3JkZXJPbiA9ICEhdGhpcy5yZWFkQnl0ZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIDEwOiBBcmVhU3ltYm9sMTAsXG4gIDExOiBBcmVhU3ltYm9sMTEsXG4gIDEyOiBBcmVhU3ltYm9sMTFcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmxvY2sge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlclxuICAgIHRoaXMuX3N0YXJ0T2Zmc2V0ID0gdGhpcy5vZmZzZXQgPSBvZmZzZXQgfHwgMFxuICB9XG5cbiAgcmVhZEludGVnZXIgKCkge1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuYnVmZmVyLnJlYWRJbnQzMkxFKHRoaXMub2Zmc2V0KVxuICAgIHRoaXMub2Zmc2V0ICs9IDRcbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICByZWFkQ2FyZGluYWwgKCkge1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLm9mZnNldClcbiAgICB0aGlzLm9mZnNldCArPSA0XG4gICAgcmV0dXJuIHZhbFxuICB9XG5cbiAgcmVhZFNtYWxsSW50ICgpIHtcbiAgICBjb25zdCB2YWwgPSB0aGlzLmJ1ZmZlci5yZWFkSW50MTZMRSh0aGlzLm9mZnNldClcbiAgICB0aGlzLm9mZnNldCArPSAyXG4gICAgcmV0dXJuIHZhbFxuICB9XG5cbiAgcmVhZEJ5dGUgKCkge1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuYnVmZmVyLnJlYWRJbnQ4KHRoaXMub2Zmc2V0KVxuICAgIHRoaXMub2Zmc2V0KytcbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICByZWFkV29yZCAoKSB7XG4gICAgY29uc3QgdmFsID0gdGhpcy5idWZmZXIucmVhZFVJbnQxNkxFKHRoaXMub2Zmc2V0KVxuICAgIHRoaXMub2Zmc2V0ICs9IDJcbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICByZWFkV29yZEJvb2wgKCkge1xuICAgIHJldHVybiAhIXRoaXMucmVhZFdvcmQoKVxuICB9XG5cbiAgcmVhZERvdWJsZSAoKSB7XG4gICAgY29uc3QgdmFsID0gdGhpcy5idWZmZXIucmVhZERvdWJsZUxFKHRoaXMub2Zmc2V0KVxuICAgIHRoaXMub2Zmc2V0ICs9IDhcbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICBnZXRTaXplICgpIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXQgLSB0aGlzLl9zdGFydE9mZnNldFxuICB9XG59XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoJy4vYmxvY2snKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEZpbGVIZWFkZXIgZXh0ZW5kcyBCbG9jayB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0KVxuXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggLSBvZmZzZXQgPCA2MCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIgaXMgbm90IGxhcmdlIGVub3VnaCB0byBob2xkIGhlYWRlcicpXG4gICAgfVxuXG4gICAgdGhpcy5vY2FkTWFyayA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmZpbGVUeXBlID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5yZWFkQnl0ZSgpIC8vIEZpbGVTdGF0dXMsIG5vdCB1c2VkXG4gICAgdGhpcy52ZXJzaW9uID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuc3ViVmVyc2lvbiA9IHRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuc3ViU3ViVmVyc2lvbiA9IHRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuc3ltYm9sSW5kZXhCbG9jayA9IHRoaXMucmVhZENhcmRpbmFsKClcbiAgICB0aGlzLm9iamVjdEluZGV4QmxvY2sgPSB0aGlzLnJlYWRDYXJkaW5hbCgpXG4gICAgdGhpcy5vZmZsaW5lU3luY1NlcmlhbCA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMuY3VycmVudEZpbGVWZXJzaW9uID0gdGhpcy5yZWFkSW50ZWdlcigpXG4gICAgdGhpcy5yZWFkQ2FyZGluYWwoKSAvLyBJbnRlcm5hbCwgbm90IHVzZWRcbiAgICB0aGlzLnJlYWRDYXJkaW5hbCgpIC8vIEludGVybmFsLCBub3QgdXNlZFxuICAgIHRoaXMuc3RyaW5nSW5kZXhCbG9jayA9IHRoaXMucmVhZENhcmRpbmFsKClcbiAgICB0aGlzLmZpbGVOYW1lUG9zID0gdGhpcy5yZWFkQ2FyZGluYWwoKVxuICAgIHRoaXMuZmlsZU5hbWVTaXplID0gdGhpcy5yZWFkQ2FyZGluYWwoKVxuICAgIHRoaXMucmVhZENhcmRpbmFsKCkgLy8gSW50ZXJuYWwsIG5vdCB1c2VkXG4gICAgdGhpcy5yZWFkQ2FyZGluYWwoKSAvLyBSZXMxLCBub3QgdXNlZFxuICAgIHRoaXMucmVhZENhcmRpbmFsKCkgLy8gUmVzMiwgbm90IHVzZWRcbiAgICB0aGlzLm1yU3RhcnRCbG9ja1Bvc2l0aW9uID0gdGhpcy5yZWFkQ2FyZGluYWwoKVxuICB9XG5cbiAgaXNWYWxpZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub2NhZE1hcmsgPT09IDB4MGNhZFxuICB9XG59XG4iLCJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHsgQnVmZmVyIH0gPSByZXF1aXJlKCdidWZmZXInKVxuY29uc3QgZ2V0UmdiID0gcmVxdWlyZSgnLi4vY215ay10by1yZ2InKVxuXG5jb25zdCBGaWxlSGVhZGVyID0gcmVxdWlyZSgnLi9maWxlLWhlYWRlcicpXG5jb25zdCBTeW1ib2xJbmRleCA9IHJlcXVpcmUoJy4vc3ltYm9sLWluZGV4JylcbmNvbnN0IE9iamVjdEluZGV4ID0gcmVxdWlyZSgnLi9vYmplY3QtaW5kZXgnKVxuY29uc3QgU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuL3N0cmluZy1pbmRleCcpXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKHBhdGgsIG9wdGlvbnMpID0+IHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHBhdGgpKSB7XG4gICAgcmV0dXJuIHBhcnNlT2NhZEJ1ZmZlcihwYXRoLCBvcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBmcy5yZWFkRmlsZShwYXRoLCAoZXJyLCBidWZmZXIpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcblxuICAgICAgICByZXNvbHZlKGJ1ZmZlcilcbiAgICAgIH0pKVxuICAgIHJldHVybiBwYXJzZU9jYWRCdWZmZXIoYnVmZmVyLCBvcHRpb25zKVxuICB9XG59XG5cbmNvbnN0IHBhcnNlT2NhZEJ1ZmZlciA9IGFzeW5jIChidWZmZXIsIG9wdGlvbnMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgY29uc3QgaGVhZGVyID0gbmV3IEZpbGVIZWFkZXIoYnVmZmVyKVxuICBpZiAoIWhlYWRlci5pc1ZhbGlkKCkpIHtcbiAgICByZWplY3QobmV3IEVycm9yKGBOb3QgYW4gT0NBRCBmaWxlIChpbnZhbGlkIGhlYWRlciAke2hlYWRlci5vY2FkTWFya30gIT09ICR7MHgwY2FkfSlgKSlcbiAgfVxuXG4gIGlmIChoZWFkZXIudmVyc2lvbiA8IDEwICYmICFvcHRpb25zLmJ5cGFzc1ZlcnNpb25DaGVjaykge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0IE9DQUQgZmlsZSB2ZXJzaW9uICgke2hlYWRlci52ZXJzaW9ufSksIG9ubHkgPj0gMTAgc3VwcG9ydGVkIGZvciBub3cuYClcbiAgfVxuXG4gIGxldCBzeW1ib2xzID0gW11cbiAgbGV0IHN5bWJvbEluZGV4T2Zmc2V0ID0gaGVhZGVyLnN5bWJvbEluZGV4QmxvY2tcbiAgd2hpbGUgKHN5bWJvbEluZGV4T2Zmc2V0KSB7XG4gICAgbGV0IHN5bWJvbEluZGV4ID0gbmV3IFN5bWJvbEluZGV4KGJ1ZmZlciwgc3ltYm9sSW5kZXhPZmZzZXQsIGhlYWRlci52ZXJzaW9uKVxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHN5bWJvbHMsIHN5bWJvbEluZGV4LnBhcnNlU3ltYm9scygpKVxuXG4gICAgc3ltYm9sSW5kZXhPZmZzZXQgPSBzeW1ib2xJbmRleC5uZXh0T2JqZWN0SW5kZXhCbG9ja1xuICB9XG5cbiAgbGV0IG9iamVjdHMgPSBbXVxuICBsZXQgb2JqZWN0SW5kZXhPZmZzZXQgPSBoZWFkZXIub2JqZWN0SW5kZXhCbG9ja1xuICB3aGlsZSAob2JqZWN0SW5kZXhPZmZzZXQpIHtcbiAgICBsZXQgb2JqZWN0SW5kZXggPSBuZXcgT2JqZWN0SW5kZXgoYnVmZmVyLCBvYmplY3RJbmRleE9mZnNldCwgaGVhZGVyLnZlcnNpb24pXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob2JqZWN0cywgb2JqZWN0SW5kZXgucGFyc2VPYmplY3RzKCkpXG5cbiAgICBvYmplY3RJbmRleE9mZnNldCA9IG9iamVjdEluZGV4Lm5leHRPYmplY3RJbmRleEJsb2NrXG4gIH1cblxuICBsZXQgcGFyYW1ldGVyU3RyaW5ncyA9IHt9XG4gIGxldCBzdHJpbmdJbmRleE9mZnNldCA9IGhlYWRlci5zdHJpbmdJbmRleEJsb2NrXG4gIHdoaWxlIChzdHJpbmdJbmRleE9mZnNldCkge1xuICAgIGxldCBzdHJpbmdJbmRleCA9IG5ldyBTdHJpbmdJbmRleChidWZmZXIsIHN0cmluZ0luZGV4T2Zmc2V0KVxuICAgIGNvbnN0IHN0cmluZ3MgPSBzdHJpbmdJbmRleC5nZXRTdHJpbmdzKClcblxuICAgIE9iamVjdC5rZXlzKHN0cmluZ3MpLnJlZHVjZSgoYSwgcmVjVHlwZSkgPT4ge1xuICAgICAgY29uc3QgdHlwZVN0cmluZ3MgPSBzdHJpbmdzW3JlY1R5cGVdXG4gICAgICBsZXQgY29uY2F0U3RyaW5ncyA9IGFbcmVjVHlwZV0gfHwgW11cbiAgICAgIGFbcmVjVHlwZV0gPSBjb25jYXRTdHJpbmdzLmNvbmNhdCh0eXBlU3RyaW5ncy5tYXAocyA9PiBzLnZhbHVlcykpXG4gICAgICByZXR1cm4gYVxuICAgIH0sIHBhcmFtZXRlclN0cmluZ3MpXG5cbiAgICBzdHJpbmdJbmRleE9mZnNldCA9IHN0cmluZ0luZGV4Lm5leHRTdHJpbmdJbmRleEJsb2NrXG4gIH1cblxuICByZXNvbHZlKG5ldyBPY2FkRmlsZShcbiAgICBoZWFkZXIsXG4gICAgcGFyYW1ldGVyU3RyaW5ncyxcbiAgICBvYmplY3RzLFxuICAgIHN5bWJvbHNcbiAgKSlcbn0pXG5cbmNsYXNzIE9jYWRGaWxlIHtcbiAgY29uc3RydWN0b3IgKGhlYWRlciwgcGFyYW1ldGVyU3RyaW5ncywgb2JqZWN0cywgc3ltYm9scykge1xuICAgIHRoaXMuaGVhZGVyID0gaGVhZGVyXG4gICAgdGhpcy5wYXJhbWV0ZXJTdHJpbmdzID0gcGFyYW1ldGVyU3RyaW5nc1xuICAgIHRoaXMub2JqZWN0cyA9IG9iamVjdHNcbiAgICB0aGlzLnN5bWJvbHMgPSBzeW1ib2xzXG5cbiAgICB0aGlzLmNvbG9ycyA9IHBhcmFtZXRlclN0cmluZ3NbOV0ubWFwKChjb2xvckRlZiwgaSkgPT4ge1xuICAgICAgY29uc3QgY215ayA9IFtjb2xvckRlZi5jLCBjb2xvckRlZi5tLCBjb2xvckRlZi55LCBjb2xvckRlZi5rXS5tYXAoTnVtYmVyKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbnVtYmVyOiBjb2xvckRlZi5uLFxuICAgICAgICBjbXlrOiBjbXlrLFxuICAgICAgICBuYW1lOiBjb2xvckRlZi5fZmlyc3QsXG4gICAgICAgIHJnYjogZ2V0UmdiKGNteWspLFxuICAgICAgICByZW5kZXJPcmRlcjogaVxuICAgICAgfVxuICAgIH0pXG4gICAgICAucmVkdWNlKChhLCBjKSA9PiB7XG4gICAgICAgIGFbYy5udW1iZXJdID0gY1xuICAgICAgICByZXR1cm4gYVxuICAgICAgfSwgW10pXG4gIH1cblxuICBnZXRDcnMgKCkge1xuICAgIGNvbnN0IHNjYWxlUGFyID0gdGhpcy5wYXJhbWV0ZXJTdHJpbmdzWycxMDM5J11cbiAgICAgID8gdGhpcy5wYXJhbWV0ZXJTdHJpbmdzWycxMDM5J11bMF1cbiAgICAgIDogeyB4OiAwLCB5OiAwLCBtOiAxIH1cbiAgICBsZXQgeyB4LCB5LCBtIH0gPSBzY2FsZVBhclxuXG4gICAgeCA9IE51bWJlcih4KVxuICAgIHkgPSBOdW1iZXIoeSlcbiAgICBtID0gTnVtYmVyKG0pXG5cbiAgICByZXR1cm4ge1xuICAgICAgZWFzdGluZzogeCxcbiAgICAgIG5vcnRoaW5nOiB5LFxuICAgICAgc2NhbGU6IG1cbiAgICB9XG4gIH1cbn1cbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi9ibG9jaycpXG5jb25zdCB7IFN5bWJvbDEwLCBTeW1ib2wxMSB9ID0gcmVxdWlyZSgnLi9zeW1ib2wnKVxuXG5jbGFzcyBMaW5lU3ltYm9sMTAgZXh0ZW5kcyBTeW1ib2wxMCB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0LCAyKVxuXG4gICAgcmVhZExpbmVTeW1ib2wodGhpcywgRG91YmxlTGluZTEwLCBEZWNyZWFzZTEwKVxuICB9XG59XG5cbmNsYXNzIExpbmVTeW1ib2wxMSBleHRlbmRzIFN5bWJvbDExIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQsIDIpXG5cbiAgICAvLyBUT0RPOiB3aHk/XG4gICAgdGhpcy5vZmZzZXQgKz0gNjRcblxuICAgIHJlYWRMaW5lU3ltYm9sKHRoaXMsIERvdWJsZUxpbmUxMSwgRGVjcmVhc2UxMSlcbiAgfVxufVxuXG5jbGFzcyBCYXNlRG91YmxlTGluZSBleHRlbmRzIEJsb2NrIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG5cbiAgICB0aGlzLl9zdGFydE9mZnNldCA9IG9mZnNldFxuICAgIHRoaXMuZGJsTW9kZSA9IHRoaXMucmVhZFdvcmQoKVxuICAgIHRoaXMuZGJsRmxhZ3MgPSB0aGlzLnJlYWRXb3JkKClcbiAgICB0aGlzLmRibEZpbGxDb2xvciA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmRibExlZnRDb2xvciA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmRibFJpZ2h0Q29sb3IgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5kYmxXaWR0aCA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmRibExlZnRXaWR0aCA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmRibFJpZ2h0V2lkdGggPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5kYmxMZW5ndGggPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5kYmxHYXAgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gIH1cbn1cblxuY2xhc3MgRG91YmxlTGluZTEwIGV4dGVuZHMgQmFzZURvdWJsZUxpbmUge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQpIHtcbiAgICBzdXBlcihidWZmZXIsIG9mZnNldClcbiAgICB0aGlzLmRibFJlcyA9IG5ldyBBcnJheSgzKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYmxSZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZGJsUmVzW2ldID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBEb3VibGVMaW5lMTEgZXh0ZW5kcyBCYXNlRG91YmxlTGluZSB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0KVxuXG4gICAgdGhpcy5kYmxCYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5kYmxSZXMgPSBuZXcgQXJyYXkoMilcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGJsUmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmRibFJlc1tpXSA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgRGVjcmVhc2UxMCBleHRlbmRzIEJsb2NrIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG5cbiAgICB0aGlzLmRlY01vZGUgPSB0aGlzLnJlYWRXb3JkKClcbiAgICB0aGlzLmRlY0xhc3QgPSB0aGlzLnJlYWRXb3JkKClcbiAgICB0aGlzLnJlcyA9IHRoaXMucmVhZFdvcmQoKVxuICB9XG59XG5cbmNsYXNzIERlY3JlYXNlMTEgZXh0ZW5kcyBCbG9jayB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0KVxuXG4gICAgdGhpcy5kZWNNb2RlID0gdGhpcy5yZWFkV29yZCgpXG4gICAgdGhpcy5kZWNTeW1ib2xTaXplID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuZGVjU3ltYm9sRGlzdGFuY2UgPSAhIXRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuZGVjU3ltYm9sV2lkdGggPSAhIXRoaXMucmVhZEJ5dGUoKVxuICB9XG59XG5cbmNvbnN0IHJlYWRMaW5lU3ltYm9sID0gKGJsb2NrLCBEb3VibGVMaW5lLCBEZWNyZWFzZSkgPT4ge1xuICBibG9jay5saW5lQ29sb3IgPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5saW5lV2lkdGggPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5saW5lU3R5bGUgPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5kaXN0RnJvbVN0YXJ0ID0gYmxvY2sucmVhZFNtYWxsSW50KClcbiAgYmxvY2suZGlzdFRvRW5kID0gYmxvY2sucmVhZFNtYWxsSW50KClcbiAgYmxvY2subWFpbkxlbmd0aCA9IGJsb2NrLnJlYWRTbWFsbEludCgpXG4gIGJsb2NrLmVuZExlbmd0aCA9IGJsb2NrLnJlYWRTbWFsbEludCgpXG4gIGJsb2NrLm1haW5HYXAgPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5zZWNHYXAgPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5lbmRHYXAgPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5taW5TeW0gPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5uUHJpbVN5bSA9IGJsb2NrLnJlYWRTbWFsbEludCgpXG4gIGJsb2NrLnByaW1TeW1EaXN0ID0gYmxvY2sucmVhZFNtYWxsSW50KClcblxuICBibG9jay5kb3VibGVMaW5lID0gbmV3IERvdWJsZUxpbmUoYmxvY2suYnVmZmVyLCBibG9jay5vZmZzZXQpXG4gIGJsb2NrLm9mZnNldCArPSBibG9jay5kb3VibGVMaW5lLmdldFNpemUoKVxuXG4gIGJsb2NrLmRlY3JlYXNlID0gbmV3IERlY3JlYXNlKGJsb2NrLmJ1ZmZlciwgYmxvY2sub2Zmc2V0KVxuICBibG9jay5vZmZzZXQgKz0gYmxvY2suZGVjcmVhc2UuZ2V0U2l6ZSgpXG5cbiAgYmxvY2suZnJDb2xvciA9IGJsb2NrLnJlYWRTbWFsbEludCgpXG4gIGJsb2NrLmZyV2lkdGggPSBibG9jay5yZWFkU21hbGxJbnQoKVxuICBibG9jay5mclN0eWxlID0gYmxvY2sucmVhZFNtYWxsSW50KClcbiAgYmxvY2sucHJpbURTaXplID0gYmxvY2sucmVhZFdvcmQoKVxuICBibG9jay5zZWNEU2l6ZSA9IGJsb2NrLnJlYWRXb3JkKClcbiAgYmxvY2suY29ybmVyRFNpemUgPSBibG9jay5yZWFkV29yZCgpXG4gIGJsb2NrLnN0YXJ0RFNpemUgPSBibG9jay5yZWFkV29yZCgpXG4gIGJsb2NrLmVuZERTaXplID0gYmxvY2sucmVhZFdvcmQoKVxuICBibG9jay51c2VTeW1ib2xGbGFncyA9IGJsb2NrLnJlYWRCeXRlKClcbiAgYmxvY2sucmVzZXJ2ZWQgPSBibG9jay5yZWFkQnl0ZSgpXG5cbiAgYmxvY2sucHJpbVN5bUVsZW1lbnRzID0gYmxvY2sucmVhZEVsZW1lbnRzKGJsb2NrLnByaW1EU2l6ZSlcbiAgYmxvY2suc2VjU3ltRWxlbWVudHMgPSBibG9jay5yZWFkRWxlbWVudHMoYmxvY2suc2VjRFNpemUpXG4gIGJsb2NrLmNvcm5lclN5bUVsZW1lbnRzID0gYmxvY2sucmVhZEVsZW1lbnRzKGJsb2NrLmNvcm5lckRTaXplKVxuICBibG9jay5zdGFydFN5bUVsZW1lbnRzID0gYmxvY2sucmVhZEVsZW1lbnRzKGJsb2NrLnN0YXJ0RFNpemUpXG4gIGJsb2NrLmVuZFN5bUVsZW1lbnRzID0gYmxvY2sucmVhZEVsZW1lbnRzKGJsb2NrLmVuZERTaXplKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgMTA6IExpbmVTeW1ib2wxMCxcbiAgMTE6IExpbmVTeW1ib2wxMSxcbiAgMTI6IExpbmVTeW1ib2wxMVxufVxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuL2Jsb2NrJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMUmVjdCBleHRlbmRzIEJsb2NrIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG4gICAgdGhpcy5taW4gPSB7XG4gICAgICB4OiB0aGlzLnJlYWRJbnRlZ2VyKCksXG4gICAgICB5OiB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICB9XG4gICAgdGhpcy5tYXggPSB7XG4gICAgICB4OiB0aGlzLnJlYWRJbnRlZ2VyKCksXG4gICAgICB5OiB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICB9XG4gIH1cblxuICBzaXplICgpIHtcbiAgICByZXR1cm4gMTZcbiAgfVxufVxuIiwiY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuL2Jsb2NrJylcbmNvbnN0IExSZWN0ID0gcmVxdWlyZSgnLi9scmVjdCcpXG5jb25zdCBUT2JqZWN0ID0gcmVxdWlyZSgnLi90b2JqZWN0JylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBPYmplY3RJbmRleCBleHRlbmRzIEJsb2NrIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0LCB2ZXJzaW9uKSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG5cbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uXG4gICAgdGhpcy5uZXh0T2JqZWN0SW5kZXhCbG9jayA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMudGFibGUgPSBuZXcgQXJyYXkoMjU2KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgIGNvbnN0IHJjID0gbmV3IExSZWN0KGJ1ZmZlciwgdGhpcy5vZmZzZXQpXG4gICAgICB0aGlzLm9mZnNldCArPSByYy5zaXplKClcblxuICAgICAgdGhpcy50YWJsZVtpXSA9IHtcbiAgICAgICAgcmMsXG4gICAgICAgIHBvczogdGhpcy5yZWFkSW50ZWdlcigpLFxuICAgICAgICBsZW46IHRoaXMucmVhZEludGVnZXIoKSxcbiAgICAgICAgc3ltOiB0aGlzLnJlYWRJbnRlZ2VyKCksXG4gICAgICAgIG9ialR5cGU6IHRoaXMucmVhZEJ5dGUoKSxcbiAgICAgICAgZW5jcnlwdGVkTW9kZTogdGhpcy5yZWFkQnl0ZSgpLFxuICAgICAgICBzdGF0dXM6IHRoaXMucmVhZEJ5dGUoKSxcbiAgICAgICAgdmlld1R5cGU6IHRoaXMucmVhZEJ5dGUoKSxcbiAgICAgICAgY29sb3I6IHRoaXMucmVhZFNtYWxsSW50KCksXG4gICAgICAgIGdyb3VwOiB0aGlzLnJlYWRTbWFsbEludCgpLFxuICAgICAgICBpbXBMYXllcjogdGhpcy5yZWFkU21hbGxJbnQoKSxcbiAgICAgICAgZGJEYXRhc2V0SGFzaDogdGhpcy5yZWFkQnl0ZSgpLFxuICAgICAgICBkYktleUhhc2g6IHRoaXMucmVhZEJ5dGUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBhcnNlT2JqZWN0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVcbiAgICAgIC5tYXAobyA9PiB0aGlzLnBhcnNlT2JqZWN0KG8sIG8ub2JqVHlwZSkpXG4gICAgICAuZmlsdGVyKG8gPT4gbylcbiAgfVxuXG4gIHBhcnNlT2JqZWN0IChvYmpJbmRleCwgb2JqVHlwZSkge1xuICAgIGlmICghb2JqSW5kZXgucG9zKSByZXR1cm5cblxuICAgIHJldHVybiBuZXcgVE9iamVjdFt0aGlzLnZlcnNpb25dKHRoaXMuYnVmZmVyLCBvYmpJbmRleC5wb3MsIG9ialR5cGUpXG4gIH1cbn1cbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi9ibG9jaycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYW1ldGVyU3RyaW5nIGV4dGVuZHMgQmxvY2sge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQsIGluZGV4UmVjb3JkKSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG5cbiAgICB0aGlzLnJlY1R5cGUgPSBpbmRleFJlY29yZC5yZWNUeXBlXG5cbiAgICBsZXQgdmFsID0gJydcbiAgICBsZXQgbmV4dEJ5dGUgPSAwXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleFJlY29yZC5sZW4gJiYgKG5leHRCeXRlID0gdGhpcy5yZWFkQnl0ZSgpKTsgaSsrKSB7XG4gICAgICB2YWwgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShuZXh0Qnl0ZSlcbiAgICB9XG5cbiAgICBjb25zdCB2YWxzID0gdmFsLnNwbGl0KCdcXHQnKVxuICAgIHRoaXMudmFsdWVzID0geyBfZmlyc3Q6IHZhbHNbMF0gfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmFscy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy52YWx1ZXNbdmFsc1tpXVswXV0gPSB2YWxzW2ldLnN1YnN0cmluZygxKVxuICAgIH1cbiAgfVxufVxuIiwiY29uc3QgeyBTeW1ib2wxMCwgU3ltYm9sMTEgfSA9IHJlcXVpcmUoJy4vc3ltYm9sJylcblxuY2xhc3MgUG9pbnRTeW1ib2wxMCBleHRlbmRzIFN5bWJvbDEwIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQsIDEpXG5cbiAgICAvLyBUT0RPOiB3aHk/XG4gICAgLy8gdGhpcy5vZmZzZXQgKz0gNjRcblxuICAgIHRoaXMuZGF0YVNpemUgPSB0aGlzLnJlYWRXb3JkKClcbiAgICB0aGlzLnJlYWRTbWFsbEludCgpIC8vIFJlc2VydmVkXG5cbiAgICB0aGlzLmVsZW1lbnRzID0gdGhpcy5yZWFkRWxlbWVudHModGhpcy5kYXRhU2l6ZSlcbiAgfVxufVxuXG5jbGFzcyBQb2ludFN5bWJvbDExIGV4dGVuZHMgU3ltYm9sMTEge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQpIHtcbiAgICBzdXBlcihidWZmZXIsIG9mZnNldCwgMSlcblxuICAgIC8vIFRPRE86IHdoeT9cbiAgICB0aGlzLm9mZnNldCArPSA2NFxuXG4gICAgdGhpcy5kYXRhU2l6ZSA9IHRoaXMucmVhZFdvcmQoKVxuICAgIHRoaXMucmVhZFNtYWxsSW50KCkgLy8gUmVzZXJ2ZWRcblxuICAgIHRoaXMuZWxlbWVudHMgPSB0aGlzLnJlYWRFbGVtZW50cyh0aGlzLmRhdGFTaXplKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAxMDogUG9pbnRTeW1ib2wxMCxcbiAgMTE6IFBvaW50U3ltYm9sMTEsXG4gIDEyOiBQb2ludFN5bWJvbDExXG59XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoJy4vYmxvY2snKVxuY29uc3QgUGFyYW1ldGVyU3RyaW5nID0gcmVxdWlyZSgnLi9wYXJhbWV0ZXItc3RyaW5nJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdHJpbmdJbmRleCBleHRlbmRzIEJsb2NrIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG5cbiAgICB0aGlzLm5leHRTdHJpbmdJbmRleEJsb2NrID0gdGhpcy5yZWFkSW50ZWdlcigpXG4gICAgdGhpcy50YWJsZSA9IG5ldyBBcnJheSgyNTYpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgdGhpcy50YWJsZVtpXSA9IHtcbiAgICAgICAgcG9zOiB0aGlzLnJlYWRJbnRlZ2VyKCksXG4gICAgICAgIGxlbjogdGhpcy5yZWFkSW50ZWdlcigpLFxuICAgICAgICByZWNUeXBlOiB0aGlzLnJlYWRJbnRlZ2VyKCksXG4gICAgICAgIG9iakluZGV4OiB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRTdHJpbmdzICgpIHtcbiAgICBjb25zdCBzdHJpbmdzID0gdGhpcy50YWJsZVxuICAgICAgLmZpbHRlcihzaSA9PiBzaS5yZWNUeXBlID4gMClcbiAgICAgIC5tYXAoc2kgPT4gbmV3IFBhcmFtZXRlclN0cmluZyh0aGlzLmJ1ZmZlciwgc2kucG9zLCBzaSkpXG4gICAgcmV0dXJuIHN0cmluZ3MucmVkdWNlKChwc3MsIHBzKSA9PiB7XG4gICAgICBsZXQgdHlwZVN0cmluZ3MgPSBwc3NbcHMucmVjVHlwZV1cbiAgICAgIGlmICghdHlwZVN0cmluZ3MpIHtcbiAgICAgICAgcHNzW3BzLnJlY1R5cGVdID0gdHlwZVN0cmluZ3MgPSBbXVxuICAgICAgfVxuXG4gICAgICB0eXBlU3RyaW5ncy5wdXNoKHBzKVxuXG4gICAgICByZXR1cm4gcHNzXG4gICAgfSwge30pXG4gIH1cbn1cbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi9ibG9jaycpXG5jb25zdCBUZFBvbHkgPSByZXF1aXJlKCcuL3RkLXBvbHknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFN5bWJvbEVsZW1lbnQgZXh0ZW5kcyBCbG9jayB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0KVxuXG4gICAgdGhpcy50eXBlID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuZmxhZ3MgPSB0aGlzLnJlYWRXb3JkKClcbiAgICB0aGlzLmNvbG9yID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMubGluZVdpZHRoID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuZGlhbWV0ZXIgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5udW1iZXJDb29yZHMgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5yZWFkQ2FyZGluYWwoKSAvLyBSZXNlcnZlZFxuXG4gICAgdGhpcy5jb29yZHMgPSBuZXcgQXJyYXkodGhpcy5udW1iZXJDb29yZHMpXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLm51bWJlckNvb3JkczsgaisrKSB7XG4gICAgICB0aGlzLmNvb3Jkc1tqXSA9IG5ldyBUZFBvbHkodGhpcy5yZWFkSW50ZWdlcigpLCB0aGlzLnJlYWRJbnRlZ2VyKCkpXG4gICAgfVxuICB9XG59XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoJy4vYmxvY2snKVxuY29uc3QgUG9pbnRTeW1ib2wgPSByZXF1aXJlKCcuL3BvaW50LXN5bWJvbCcpXG5jb25zdCBMaW5lU3ltYm9sID0gcmVxdWlyZSgnLi9saW5lLXN5bWJvbCcpXG5jb25zdCBBcmVhU3ltYm9sID0gcmVxdWlyZSgnLi9hcmVhLXN5bWJvbCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3ltYm9sSW5kZXggZXh0ZW5kcyBCbG9jayB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCwgdmVyc2lvbikge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0KVxuXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvblxuICAgIHRoaXMubmV4dFN5bWJvbEluZGV4QmxvY2sgPSB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICB0aGlzLnN5bWJvbFBvc2l0aW9uID0gbmV3IEFycmF5KDI1NilcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3ltYm9sUG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuc3ltYm9sUG9zaXRpb25baV0gPSB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICB9XG4gIH1cblxuICBwYXJzZVN5bWJvbHMgKCkge1xuICAgIHJldHVybiB0aGlzLnN5bWJvbFBvc2l0aW9uXG4gICAgICAuZmlsdGVyKHNwID0+IHNwID4gMClcbiAgICAgIC5tYXAoc3AgPT4gdGhpcy5wYXJzZVN5bWJvbChzcCkpXG4gICAgICAuZmlsdGVyKHMgPT4gcylcbiAgfVxuXG4gIHBhcnNlU3ltYm9sIChvZmZzZXQpIHtcbiAgICBpZiAoIW9mZnNldCkgcmV0dXJuXG5cbiAgICBjb25zdCB0eXBlID0gdGhpcy5idWZmZXIucmVhZEludDgob2Zmc2V0ICsgOClcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludFN5bWJvbFt0aGlzLnZlcnNpb25dKHRoaXMuYnVmZmVyLCBvZmZzZXQpXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBuZXcgTGluZVN5bWJvbFt0aGlzLnZlcnNpb25dKHRoaXMuYnVmZmVyLCBvZmZzZXQpXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHJldHVybiBuZXcgQXJlYVN5bWJvbFt0aGlzLnZlcnNpb25dKHRoaXMuYnVmZmVyLCBvZmZzZXQpXG4gICAgfVxuXG4gICAgLy8gSWdub3JlIG90aGVyIHN5bWJvbHMgZm9yIG5vd1xuICB9XG59XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoJy4vYmxvY2snKVxuY29uc3QgU3ltYm9sRWxlbWVudCA9IHJlcXVpcmUoJy4vc3ltYm9sLWVsZW1lbnQnKVxuXG5jbGFzcyBCYXNlU3ltYm9sIGV4dGVuZHMgQmxvY2sge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQsIHN5bWJvbFR5cGUpIHtcbiAgICBzdXBlcihidWZmZXIsIG9mZnNldClcblxuICAgIHRoaXMudHlwZSA9IHN5bWJvbFR5cGVcbiAgICB0aGlzLnNpemUgPSB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICB0aGlzLnN5bU51bSA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMub3RwID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5mbGFncyA9IHRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuc2VsZWN0ZWQgPSAhIXRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuc3RhdHVzID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5wcmVmZXJyZWREcmF3aW5nVG9vbCA9IHRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuY3NNb2RlID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5jc09ialR5cGUgPSB0aGlzLnJlYWRCeXRlKClcbiAgICB0aGlzLmNzQ2RGbGFncyA9IHRoaXMucmVhZEJ5dGUoKVxuICAgIHRoaXMuZXh0ZW50ID0gdGhpcy5yZWFkSW50ZWdlcigpXG4gICAgdGhpcy5maWxlUG9zID0gdGhpcy5yZWFkQ2FyZGluYWwoKVxuICB9XG5cbiAgcmVhZEVsZW1lbnRzIChkYXRhU2l6ZSkge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gW11cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVNpemU7IGkgKz0gMikge1xuICAgICAgY29uc3QgZWxlbWVudCA9IG5ldyBTeW1ib2xFbGVtZW50KHRoaXMuYnVmZmVyLCB0aGlzLm9mZnNldClcbiAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudClcblxuICAgICAgaSArPSBlbGVtZW50Lm51bWJlckNvb3Jkc1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50c1xuICB9XG59XG5cbmNsYXNzIFN5bWJvbDEwIGV4dGVuZHMgQmFzZVN5bWJvbCB7XG4gIGNvbnN0cnVjdG9yIChidWZmZXIsIG9mZnNldCwgc3ltYm9sVHlwZSkge1xuICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0LCBzeW1ib2xUeXBlKVxuXG4gICAgdGhpcy5ncm91cCA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLm5Db2xvcnMgPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQXJyYXkoMTQpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5jb2xvcnNbaV0gPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgfVxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSAnJ1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgICAgY29uc3QgYyA9IHRoaXMucmVhZEJ5dGUoKVxuICAgICAgaWYgKGMpIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaWNvbkJpdHMgPSBuZXcgQXJyYXkoNDg0KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pY29uQml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5pY29uQml0c1tpXSA9IHRoaXMucmVhZEJ5dGUoKVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBTeW1ib2wxMSBleHRlbmRzIEJhc2VTeW1ib2wge1xuICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQsIHN5bWJvbFR5cGUpIHtcbiAgICBzdXBlcihidWZmZXIsIG9mZnNldCwgc3ltYm9sVHlwZSlcblxuICAgIHRoaXMucmVhZEJ5dGUoKSAvLyBub3RVc2VkMVxuICAgIHRoaXMucmVhZEJ5dGUoKSAvLyBub3RVc2VkMlxuICAgIHRoaXMubkNvbG9ycyA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBBcnJheSgxNClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmNvbG9yc1tpXSA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB9XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9ICcnXG4gICAgLy8gVVRGLTE2IHN0cmluZywgNjQgYnl0ZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY0IC8gMjsgaSsrKSB7XG4gICAgICBjb25zdCBjID0gdGhpcy5yZWFkV29yZCgpXG4gICAgICBpZiAoYykge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmljb25CaXRzID0gbmV3IEFycmF5KDQ4NClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWNvbkJpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuaWNvbkJpdHNbaV0gPSB0aGlzLnJlYWRCeXRlKClcbiAgICB9XG5cbiAgICB0aGlzLnN5bWJvbFRyZWVHcm91cCA9IG5ldyBBcnJheSg2NClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3ltYm9sVHJlZUdyb3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnN5bWJvbFRyZWVHcm91cFtpXSA9IHRoaXMucmVhZFdvcmQoKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU3ltYm9sMTAsXG4gIFN5bWJvbDExXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRkUG9seSBleHRlbmRzIEFycmF5IHtcbiAgY29uc3RydWN0b3IgKG9jYWRYLCBvY2FkWSwgeEZsYWdzLCB5RmxhZ3MpIHtcbiAgICBzdXBlcih4RmxhZ3MgPT09IHVuZGVmaW5lZCA/IG9jYWRYID4+IDggOiBvY2FkWCwgeUZsYWdzID09PSB1bmRlZmluZWQgPyBvY2FkWSA+PiA4IDogb2NhZFkpXG4gICAgdGhpcy54RmxhZ3MgPSB4RmxhZ3MgPT09IHVuZGVmaW5lZCA/IG9jYWRYICYgMHhmZiA6IHhGbGFnc1xuICAgIHRoaXMueUZsYWdzID0geUZsYWdzID09PSB1bmRlZmluZWQgPyBvY2FkWSAmIDB4ZmYgOiB5RmxhZ3NcbiAgfVxuXG4gIGlzRmlyc3RCZXppZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnhGbGFncyAmIDB4MDFcbiAgfVxuXG4gIGlzU2Vjb25kQmV6aWVyICgpIHtcbiAgICByZXR1cm4gdGhpcy54RmxhZ3MgJiAweDAyXG4gIH1cblxuICBoYXNOb0xlZnRMaW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy54RmxhZ3MgJiAweDA0XG4gIH1cblxuICBpc0JvcmRlck9yVmlydHVhbExpbmUgKCkge1xuICAgIHJldHVybiB0aGlzLnhGbGFncyAmIDB4MDhcbiAgfVxuXG4gIGlzQ29ybmVyUG9pbnQgKCkge1xuICAgIHJldHVybiB0aGlzLnlGbGFncyAmIDB4MDFcbiAgfVxuXG4gIGlzRmlyc3RIb2xlUG9pbnQgKCkge1xuICAgIHJldHVybiB0aGlzLnlGbGFncyAmIDB4MDJcbiAgfVxuXG4gIGhhc05vUmlnaHRMaW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy55RmxhZ3MgJiAweDA0XG4gIH1cblxuICBpc0Rhc2hQb2ludCAoKSB7XG4gICAgcmV0dXJuIHRoaXMueUZsYWdzICYgMHgwOFxuICB9XG5cbiAgdkxlbmd0aCAoKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzWzBdICogdGhpc1swXSArIHRoaXNbMV0gKiB0aGlzWzFdKVxuICB9XG5cbiAgYWRkIChjMSkge1xuICAgIHJldHVybiBuZXcgVGRQb2x5KHRoaXNbMF0gKyBjMVswXSwgdGhpc1sxXSArIGMxWzFdLCB0aGlzLnhGbGFncywgdGhpcy55RmxhZ3MpXG4gIH1cblxuICBzdWIgKGMxKSB7XG4gICAgcmV0dXJuIG5ldyBUZFBvbHkodGhpc1swXSAtIGMxWzBdLCB0aGlzWzFdIC0gYzFbMV0sIHRoaXMueEZsYWdzLCB0aGlzLnlGbGFncylcbiAgfVxuXG4gIG11bCAoZikge1xuICAgIHJldHVybiBuZXcgVGRQb2x5KHRoaXNbMF0gKiBmLCB0aGlzWzFdICogZiwgdGhpcy54RmxhZ3MsIHRoaXMueUZsYWdzKVxuICB9XG5cbiAgdW5pdCAoKSB7XG4gICAgY29uc3QgbCA9IHRoaXMudkxlbmd0aCgpXG4gICAgcmV0dXJuIHRoaXMubXVsKDEgLyBsKVxuICB9XG5cbiAgcm90YXRlICh0aGV0YSkge1xuICAgIHJldHVybiBuZXcgVGRQb2x5KFxuICAgICAgdGhpc1swXSAqIE1hdGguY29zKHRoZXRhKSAtIHRoaXNbMV0gKiBNYXRoLnNpbih0aGV0YSksXG4gICAgICB0aGlzWzBdICogTWF0aC5zaW4odGhldGEpICsgdGhpc1sxXSAqIE1hdGguY29zKHRoZXRhKSxcbiAgICAgIHRoaXMueEZsYWdzLFxuICAgICAgdGhpcy55RmxhZ3MpXG4gIH1cbn1cbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi9ibG9jaycpXG5jb25zdCBUZFBvbHkgPSByZXF1aXJlKCcuL3RkLXBvbHknKVxuXG5jbGFzcyBCYXNlVE9iamVjdCBleHRlbmRzIEJsb2NrIHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0LCBvYmpUeXBlKSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQpXG4gICAgdGhpcy5vYmpUeXBlID0gb2JqVHlwZVxuICB9XG5cbiAgZ2V0UHJvcGVydGllcyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN5bTogdGhpcy5zeW0sXG4gICAgICBvdHA6IHRoaXMub3RwLFxuICAgICAgX2N1c3RvbWVyOiB0aGlzLl9jdXN0b21lcixcbiAgICAgIGFuZzogdGhpcy5hbmcsXG4gICAgICBjb2w6IHRoaXMuY29sLFxuICAgICAgbGluZVdpZHRoOiB0aGlzLmxpbmVXaWR0aCxcbiAgICAgIGRpYW1GbGFnczogdGhpcy5kaWFtRmxhZ3MsXG4gICAgICBzZXJ2ZXJPYmplY3RJZDogdGhpcy5zZXJ2ZXJPYmplY3RJZCxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBjcmVhdGlvbkRhdGU6IHRoaXMuY3JlYXRpb25EYXRlLFxuICAgICAgbXVsdGlyZXByZXNlbnRhdGlvbklkOiB0aGlzLm11bHRpcmVwcmVzZW50YXRpb25JZCxcbiAgICAgIG1vZGlmaWNhdGlvbkRhdGU6IHRoaXMubW9kaWZpY2F0aW9uRGF0ZSxcbiAgICAgIG5JdGVtOiB0aGlzLm5JdGVtLFxuICAgICAgblRleHQ6IHRoaXMublRleHQsXG4gICAgICBuT2JqZWN0U3RyaW5nOiB0aGlzLm5PYmplY3RTdHJpbmcsXG4gICAgICBuRGF0YWJhc2VTdHJpbmc6IHRoaXMubkRhdGFiYXNlU3RyaW5nLFxuICAgICAgb2JqZWN0U3RyaW5nVHlwZTogdGhpcy5vYmplY3RTdHJpbmdUeXBlLFxuICAgICAgcmVzMTogdGhpcy5yZXMxXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRPYmplY3QxMSBleHRlbmRzIEJhc2VUT2JqZWN0IHtcbiAgY29uc3RydWN0b3IgKGJ1ZmZlciwgb2Zmc2V0LCBvYmpUeXBlKSB7XG4gICAgc3VwZXIoYnVmZmVyLCBvZmZzZXQsIG9ialR5cGUpXG5cbiAgICB0aGlzLnN5bSA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMub3RwID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5fY3VzdG9tZXIgPSB0aGlzLnJlYWRCeXRlKClcbiAgICB0aGlzLmFuZyA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICB0aGlzLmNvbCA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMubGluZVdpZHRoID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuZGlhbUZsYWdzID0gdGhpcy5yZWFkU21hbGxJbnQoKVxuICAgIHRoaXMuc2VydmVyT2JqZWN0SWQgPSB0aGlzLnJlYWRJbnRlZ2VyKClcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgIHRoaXMuY3JlYXRpb25EYXRlID0gdGhpcy5yZWFkRG91YmxlKClcbiAgICB0aGlzLm11bHRpcmVwcmVzZW50YXRpb25JZCA9IHRoaXMucmVhZENhcmRpbmFsKClcbiAgICB0aGlzLm1vZGlmaWNhdGlvbkRhdGUgPSB0aGlzLnJlYWREb3VibGUoKVxuICAgIHRoaXMubkl0ZW0gPSB0aGlzLnJlYWRDYXJkaW5hbCgpXG4gICAgdGhpcy5uVGV4dCA9IHRoaXMucmVhZFdvcmQoKVxuICAgIHRoaXMubk9iamVjdFN0cmluZyA9IHRoaXMucmVhZFdvcmQoKVxuICAgIHRoaXMubkRhdGFiYXNlU3RyaW5nID0gdGhpcy5yZWFkV29yZCgpXG4gICAgdGhpcy5vYmplY3RTdHJpbmdUeXBlID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5yZXMxID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG5ldyBBcnJheSh0aGlzLm5JdGVtKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5JdGVtOyBpKyspIHtcbiAgICAgIHRoaXMuY29vcmRpbmF0ZXNbaV0gPSBuZXcgVGRQb2x5KHRoaXMucmVhZEludGVnZXIoKSwgdGhpcy5yZWFkSW50ZWdlcigpKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgMTA6IGNsYXNzIFRPYmplY3QxMCBleHRlbmRzIEJhc2VUT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvciAoYnVmZmVyLCBvZmZzZXQsIG9ialR5cGUpIHtcbiAgICAgIHN1cGVyKGJ1ZmZlciwgb2Zmc2V0LCBvYmpUeXBlKVxuXG4gICAgICB0aGlzLnN5bSA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgICAgdGhpcy5vdHAgPSB0aGlzLnJlYWRCeXRlKClcbiAgICAgIHRoaXMuX2N1c3RvbWVyID0gdGhpcy5yZWFkQnl0ZSgpXG4gICAgICB0aGlzLmFuZyA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICAgIHRoaXMubkl0ZW0gPSB0aGlzLnJlYWRDYXJkaW5hbCgpXG4gICAgICB0aGlzLm5UZXh0ID0gdGhpcy5yZWFkV29yZCgpXG4gICAgICB0aGlzLnJlYWRTbWFsbEludCgpIC8vIFJlc2VydmVkXG4gICAgICB0aGlzLmNvbCA9IHRoaXMucmVhZEludGVnZXIoKVxuICAgICAgdGhpcy5saW5lV2lkdGggPSB0aGlzLnJlYWRTbWFsbEludCgpXG4gICAgICB0aGlzLmRpYW1GbGFncyA9IHRoaXMucmVhZFNtYWxsSW50KClcbiAgICAgIHRoaXMucmVhZEludGVnZXIoKSAvLyBSZXNlcnZlZFxuICAgICAgdGhpcy5yZWFkQnl0ZSgpIC8vIFJlc2VydmVkXG4gICAgICB0aGlzLnJlYWRCeXRlKCkgLy8gUmVzZXJ2ZWRcbiAgICAgIHRoaXMucmVhZFNtYWxsSW50KCkgLy8gUmVzZXJ2ZWRcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yZWFkSW50ZWdlcigpXG4gICAgICB0aGlzLmNvb3JkaW5hdGVzID0gbmV3IEFycmF5KHRoaXMubkl0ZW0pXG5cbiAgICAgIHRoaXMub2Zmc2V0ICs9IDRcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm5JdGVtOyBpKyspIHtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlc1tpXSA9IG5ldyBUZFBvbHkodGhpcy5yZWFkSW50ZWdlcigpLCB0aGlzLnJlYWRJbnRlZ2VyKCkpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAxMTogVE9iamVjdDExLFxuICAxMjogVE9iamVjdDExXG59XG4iLCJjb25zdCB7IGNvb3JkRWFjaCB9ID0gcmVxdWlyZSgnQHR1cmYvbWV0YScpXG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhc3NpZ25JZHM6IHRydWUsXG4gIGFwcGx5Q3JzOiB0cnVlLFxuICBnZW5lcmF0ZVN5bWJvbEVsZW1lbnRzOiB0cnVlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9jYWRGaWxlLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH1cbiAgbGV0IGZlYXR1cmVzID0gb2NhZEZpbGUub2JqZWN0c1xuICAgIC5tYXAodE9iamVjdFRvR2VvSnNvbilcbiAgICAuZmlsdGVyKGYgPT4gZilcblxuICBpZiAob3B0aW9ucy5nZW5lcmF0ZVN5bWJvbEVsZW1lbnRzKSB7XG4gICAgY29uc3Qgc3ltYm9scyA9IG9jYWRGaWxlLnN5bWJvbHMucmVkdWNlKChzcywgcykgPT4ge1xuICAgICAgc3Nbcy5zeW1OdW1dID0gc1xuICAgICAgcmV0dXJuIHNzXG4gICAgfSwge30pXG4gICAgY29uc3QgZWxlbWVudEZlYXR1cmVzID0gZmVhdHVyZXNcbiAgICAgIC5tYXAoZ2VuZXJhdGVTeW1ib2xFbGVtZW50cy5iaW5kKG51bGwsIHN5bWJvbHMpKVxuICAgICAgLmZpbHRlcihmID0+IGYpXG4gICAgZmVhdHVyZXMgPSBmZWF0dXJlcy5jb25jYXQoQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgZWxlbWVudEZlYXR1cmVzKSlcbiAgfVxuXG4gIGNvbnN0IGZlYXR1cmVDb2xsZWN0aW9uID0ge1xuICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgZmVhdHVyZXNcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFzc2lnbklkcykge1xuICAgIGZlYXR1cmVzLmZvckVhY2goKG8sIGkpID0+IHtcbiAgICAgIG8uaWQgPSBpICsgMVxuICAgIH0pXG4gIH1cblxuICBpZiAob3B0aW9ucy5hcHBseUNycykge1xuICAgIGFwcGx5Q3JzKGZlYXR1cmVDb2xsZWN0aW9uLCBvY2FkRmlsZS5nZXRDcnMoKSlcbiAgfVxuXG4gIHJldHVybiBmZWF0dXJlQ29sbGVjdGlvblxufVxuXG5jb25zdCB0T2JqZWN0VG9HZW9Kc29uID0gb2JqZWN0ID0+IHtcbiAgdmFyIGdlb21ldHJ5XG4gIHN3aXRjaCAob2JqZWN0Lm9ialR5cGUpIHtcbiAgICBjYXNlIDE6XG4gICAgICBnZW9tZXRyeSA9IHtcbiAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IG9iamVjdC5jb29yZGluYXRlc1swXVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBnZW9tZXRyeSA9IHtcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICBjb29yZGluYXRlczogb2JqZWN0LmNvb3JkaW5hdGVzXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMzpcbiAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1RvUmluZ3Mob2JqZWN0LmNvb3JkaW5hdGVzKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgIHByb3BlcnRpZXM6IG9iamVjdC5nZXRQcm9wZXJ0aWVzKCksXG4gICAgZ2VvbWV0cnlcbiAgfVxufVxuXG5jb25zdCBnZW5lcmF0ZVN5bWJvbEVsZW1lbnRzID0gKHN5bWJvbHMsIGZlYXR1cmUpID0+IHtcbiAgY29uc3Qgc3ltYm9sID0gc3ltYm9sc1tmZWF0dXJlLnByb3BlcnRpZXMuc3ltXVxuICBsZXQgZWxlbWVudHMgPSBbXVxuXG4gIGlmICghc3ltYm9sKSByZXR1cm4gZWxlbWVudHNcblxuICBzd2l0Y2ggKHN5bWJvbC50eXBlKSB7XG4gICAgY2FzZSAxOlxuICAgICAgY29uc3QgYW5nbGUgPSBmZWF0dXJlLnByb3BlcnRpZXMuYW5nID8gZmVhdHVyZS5wcm9wZXJ0aWVzLmFuZyAvIDEwIC8gMTgwICogTWF0aC5QSSA6IDBcbiAgICAgIGVsZW1lbnRzID0gc3ltYm9sLmVsZW1lbnRzXG4gICAgICAgIC5tYXAoKGUsIGkpID0+IGNyZWF0ZUVsZW1lbnQoc3ltYm9sLCAnZWxlbWVudCcsIGksIGZlYXR1cmUsIGUsIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIGFuZ2xlKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAyOlxuICAgICAgaWYgKHN5bWJvbC5wcmltU3ltRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb29yZHMgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgIGNvbnN0IGVuZExlbmd0aCA9IHN5bWJvbC5lbmRMZW5ndGhcbiAgICAgICAgbGV0IGQgPSBlbmRMZW5ndGhcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjMCA9IGNvb3Jkc1tpIC0gMV1cbiAgICAgICAgICBjb25zdCBjMSA9IGNvb3Jkc1tpXVxuICAgICAgICAgIGNvbnN0IHYgPSBjMS5zdWIoYzApXG4gICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKHZbMV0sIHZbMF0pXG4gICAgICAgICAgY29uc3QgdSA9IHYudW5pdCgpXG4gICAgICAgICAgY29uc3Qgc2VnbWVudExlbmd0aCA9IHYudkxlbmd0aCgpXG4gICAgICAgICAgY29uc3QgbWFpbkxlbmd0aCA9IHN5bWJvbC5tYWluTGVuZ3RoXG5cbiAgICAgICAgICBsZXQgYyA9IGMwLmFkZCh1Lm11bChkKSlcbiAgICAgICAgICBjb25zdCBtYWluViA9IHUubXVsKG1haW5MZW5ndGgpXG4gICAgICAgICAgd2hpbGUgKGQgPCBzZWdtZW50TGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLmNvbmNhdChzeW1ib2wucHJpbVN5bUVsZW1lbnRzXG4gICAgICAgICAgICAgIC5tYXAoKGUsIGkpID0+IGNyZWF0ZUVsZW1lbnQoc3ltYm9sLCAncHJpbScsIGksIGZlYXR1cmUsIGUsIGMsIGFuZ2xlKSkpXG5cbiAgICAgICAgICAgIGMgPSBjLmFkZChtYWluVilcbiAgICAgICAgICAgIGQgKz0gbWFpbkxlbmd0aFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGQgLT0gc2VnbWVudExlbmd0aFxuICAgICAgICB9XG4gICAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHNcbn1cblxuY29uc3QgY3JlYXRlRWxlbWVudCA9IChzeW1ib2wsIG5hbWUsIGluZGV4LCBwYXJlbnRGZWF0dXJlLCBlbGVtZW50LCBjLCBhbmdsZSkgPT4ge1xuICB2YXIgZ2VvbWV0cnlcbiAgY29uc3Qgcm90YXRlZENvb3JkcyA9IGFuZ2xlID8gZWxlbWVudC5jb29yZHMubWFwKGxjID0+IGxjLnJvdGF0ZShhbmdsZSkpIDogZWxlbWVudC5jb29yZHNcbiAgY29uc3QgdHJhbnNsYXRlZENvb3JkcyA9IHJvdGF0ZWRDb29yZHMubWFwKGxjID0+IGxjLmFkZChjKSlcblxuICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuICAgIGNhc2UgMTpcbiAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiB0cmFuc2xhdGVkQ29vcmRzXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgMjpcbiAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1RvUmluZ3ModHJhbnNsYXRlZENvb3JkcylcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAzOlxuICAgIGNhc2UgNDpcbiAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICBjb29yZGluYXRlczogdHJhbnNsYXRlZENvb3Jkc1swXVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGVsZW1lbnQ6IGAke3N5bWJvbC5zeW1OdW19LSR7bmFtZX0tJHtpbmRleH1gLFxuICAgICAgcGFyZW50SWQ6IHBhcmVudEZlYXR1cmUuaWRcbiAgICB9LFxuICAgIGdlb21ldHJ5XG4gIH1cbn1cblxuY29uc3QgYXBwbHlDcnMgPSAoZmVhdHVyZUNvbGxlY3Rpb24sIGNycykgPT4ge1xuICAvLyBPQ0FEIHVzZXMgMS8xMDAgbW0gb2YgXCJwYXBlciBjb29yZGluYXRlc1wiIGFzIHVuaXRzLCB3ZVxuICAvLyB3YW50IHRvIGNvbnZlcnQgdG8gbWV0ZXJzIGluIHJlYWwgd29ybGRcbiAgY29uc3QgaHVuZHJlZHNNbVRvTWV0ZXIgPSAxIC8gKDEwMCAqIDEwMDApXG5cbiAgY29vcmRFYWNoKGZlYXR1cmVDb2xsZWN0aW9uLCBjb29yZCA9PiB7XG4gICAgY29vcmRbMF0gPSAoY29vcmRbMF0gKiBodW5kcmVkc01tVG9NZXRlcikgKiBjcnMuc2NhbGUgKyBjcnMuZWFzdGluZ1xuICAgIGNvb3JkWzFdID0gKGNvb3JkWzFdICogaHVuZHJlZHNNbVRvTWV0ZXIpICogY3JzLnNjYWxlICsgY3JzLm5vcnRoaW5nXG4gIH0pXG59XG5cbmNvbnN0IGNvb3JkaW5hdGVzVG9SaW5ncyA9IGNvb3JkaW5hdGVzID0+IHtcbiAgY29uc3QgcmluZ3MgPSBbXVxuICBsZXQgY3VycmVudFJpbmcgPSBbXVxuICByaW5ncy5wdXNoKGN1cnJlbnRSaW5nKVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYyA9IGNvb3JkaW5hdGVzW2ldXG4gICAgaWYgKGMuaXNGaXJzdEhvbGVQb2ludCgpKSB7XG4gICAgICAvLyBDb3B5IGZpcnN0IGNvb3JkaW5hdGVcbiAgICAgIGN1cnJlbnRSaW5nLnB1c2goY3VycmVudFJpbmdbMF0uc2xpY2UoKSlcbiAgICAgIGN1cnJlbnRSaW5nID0gW11cbiAgICAgIHJpbmdzLnB1c2goY3VycmVudFJpbmcpXG4gICAgfVxuXG4gICAgY3VycmVudFJpbmcucHVzaChjKVxuICB9XG5cbiAgLy8gQ29weSBmaXJzdCBjb29yZGluYXRlXG4gIGN1cnJlbnRSaW5nLnB1c2goY3VycmVudFJpbmdbMF0uc2xpY2UoKSlcblxuICByZXR1cm4gcmluZ3Ncbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb2NhZFRvTWFwYm94R2xTdHlsZSAob2NhZEZpbGUsIG9wdGlvbnMpIHtcbiAgY29uc3QgdXNlZFN5bWJvbHMgPSB1c2VkU3ltYm9sTnVtYmVycyhvY2FkRmlsZSlcbiAgICAubWFwKHN5bU51bSA9PiBvY2FkRmlsZS5zeW1ib2xzLmZpbmQocyA9PiBzeW1OdW0gPT09IHMuc3ltTnVtKSlcbiAgICAuZmlsdGVyKHMgPT4gcylcblxuICBjb25zdCBzeW1ib2xMYXllcnMgPSB1c2VkU3ltYm9sc1xuICAgIC5tYXAoc3ltYm9sID0+IHN5bWJvbFRvTWFwYm94TGF5ZXIoc3ltYm9sLCBvY2FkRmlsZS5jb2xvcnMsIG9wdGlvbnMpKVxuICAgIC5maWx0ZXIobCA9PiBsKVxuXG4gIGNvbnN0IGVsZW1lbnRMYXllcnMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB1c2VkU3ltYm9sc1xuICAgIC5tYXAoc3ltYm9sID0+IHN5bWJvbEVsZW1lbnRzVG9NYXBib3hMYXllcihzeW1ib2wsIG9jYWRGaWxlLmNvbG9ycywgb3B0aW9ucykpXG4gICAgLmZpbHRlcihsID0+IGwpKVxuXG4gIHJldHVybiBzeW1ib2xMYXllcnMuY29uY2F0KGVsZW1lbnRMYXllcnMpXG4gICAgLnNvcnQoKGEsIGIpID0+IGIubWV0YWRhdGEuc29ydCAtIGEubWV0YWRhdGEuc29ydClcbn1cblxuY29uc3QgdXNlZFN5bWJvbE51bWJlcnMgPSBvY2FkRmlsZSA9PiBvY2FkRmlsZS5vYmplY3RzLnJlZHVjZSgoYSwgZikgPT4ge1xuICBjb25zdCBzeW1ib2xOdW0gPSBmLnN5bVxuICBpZiAoIWEuaWRTZXQuaGFzKHN5bWJvbE51bSkpIHtcbiAgICBhLnN5bWJvbE51bXMucHVzaChzeW1ib2xOdW0pXG4gICAgYS5pZFNldC5hZGQoc3ltYm9sTnVtKVxuICB9XG5cbiAgcmV0dXJuIGFcbn0sIHsgc3ltYm9sTnVtczogW10sIGlkU2V0OiBuZXcgU2V0KCkgfSkuc3ltYm9sTnVtc1xuXG5jb25zdCBzeW1ib2xUb01hcGJveExheWVyID0gKHN5bWJvbCwgY29sb3JzLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IGlkID0gYHN5bWJvbC0ke3N5bWJvbC5zeW1OdW19YFxuICBjb25zdCBmaWx0ZXIgPSBbJz09JywgWydnZXQnLCAnc3ltJ10sIHN5bWJvbC5zeW1OdW1dXG5cbiAgc3dpdGNoIChzeW1ib2wudHlwZSkge1xuICAgIC8vIGNhc2UgMTpcbiAgICAvLyAgIGNvbnN0IGVsZW1lbnQgPSBzeW1ib2wuZWxlbWVudHNbMF1cblxuICAgIC8vICAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcbiAgICAvLyAgICAgY2FzZSAzOlxuICAgIC8vICAgICBjYXNlIDQ6XG4gICAgLy8gICAgICAgcmV0dXJuIGNpcmNsZUxheWVyKGBzeW1ib2wtJHtzeW1ib2wuc3ltTnVtfWAsIG9wdGlvbnMuc291cmNlLCBvcHRpb25zLnNvdXJjZUxheWVyLCBmaWx0ZXIsIGVsZW1lbnQsIGNvbG9ycylcbiAgICAvLyAgIH1cblxuICAgIC8vICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBpZiAoIXN5bWJvbC5saW5lV2lkdGgpIHJldHVyblxuICAgICAgcmV0dXJuIGxpbmVMYXllcihpZCwgb3B0aW9ucy5zb3VyY2UsIG9wdGlvbnMuc291cmNlTGF5ZXIsIGZpbHRlciwgc3ltYm9sLCBjb2xvcnMpXG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGFyZWFMYXllcihpZCwgb3B0aW9ucy5zb3VyY2UsIG9wdGlvbnMuc291cmNlTGF5ZXIsIGZpbHRlciwgc3ltYm9sLCBjb2xvcnMpXG4gIH1cbn1cblxuY29uc3Qgc3ltYm9sRWxlbWVudHNUb01hcGJveExheWVyID0gKHN5bWJvbCwgY29sb3JzLCBvcHRpb25zKSA9PiB7XG4gIHZhciBlbGVtZW50cyA9IFtdXG4gIHZhciBuYW1lXG4gIHN3aXRjaCAoc3ltYm9sLnR5cGUpIHtcbiAgICBjYXNlIDE6XG4gICAgICBlbGVtZW50cyA9IHN5bWJvbC5lbGVtZW50c1xuICAgICAgbmFtZSA9ICdlbGVtZW50J1xuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBlbGVtZW50cyA9IHN5bWJvbC5wcmltU3ltRWxlbWVudHNcbiAgICAgIG5hbWUgPSAncHJpbSdcbiAgICAgIGJyZWFrXG4gIH1cblxuICByZXR1cm4gZWxlbWVudHNcbiAgICAubWFwKChlLCBpKSA9PiBjcmVhdGVFbGVtZW50TGF5ZXIoZSwgbmFtZSwgaSwgc3ltYm9sLCBjb2xvcnMsIG9wdGlvbnMpKVxuICAgIC5maWx0ZXIobCA9PiBsKVxufVxuXG5jb25zdCBjcmVhdGVFbGVtZW50TGF5ZXIgPSAoZWxlbWVudCwgbmFtZSwgaW5kZXgsIHN5bWJvbCwgY29sb3JzLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IGlkID0gYHN5bWJvbC0ke3N5bWJvbC5zeW1OdW19LSR7bmFtZX0tJHtpbmRleH1gXG4gIGNvbnN0IGZpbHRlciA9IFsnPT0nLCBbJ2dldCcsICdlbGVtZW50J10sIGAke3N5bWJvbC5zeW1OdW19LSR7bmFtZX0tJHtpbmRleH1gXVxuXG4gIHN3aXRjaCAoZWxlbWVudC50eXBlKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGxpbmVMYXllcihcbiAgICAgICAgaWQsXG4gICAgICAgIG9wdGlvbnMuc291cmNlLFxuICAgICAgICBvcHRpb25zLnNvdXJjZUxheWVyLFxuICAgICAgICBmaWx0ZXIsXG4gICAgICAgIGVsZW1lbnQsIGNvbG9ycylcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYXJlYUxheWVyKFxuICAgICAgICBpZCxcbiAgICAgICAgb3B0aW9ucy5zb3VyY2UsXG4gICAgICAgIG9wdGlvbnMuc291cmNlTGF5ZXIsXG4gICAgICAgIGZpbHRlcixcbiAgICAgICAgZWxlbWVudCwgY29sb3JzKVxuICAgIGNhc2UgMzpcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gY2lyY2xlTGF5ZXIoXG4gICAgICAgIGlkLFxuICAgICAgICBvcHRpb25zLnNvdXJjZSxcbiAgICAgICAgb3B0aW9ucy5zb3VyY2VMYXllcixcbiAgICAgICAgZmlsdGVyLFxuICAgICAgICBlbGVtZW50LCBjb2xvcnMpXG4gIH1cbn1cblxuY29uc3QgbGluZUxheWVyID0gKGlkLCBzb3VyY2UsIHNvdXJjZUxheWVyLCBmaWx0ZXIsIGxpbmVEZWYsIGNvbG9ycykgPT4ge1xuICBjb25zdCBiYXNlV2lkdGggPSAobGluZURlZi5saW5lV2lkdGggLyAxMClcbiAgY29uc3QgYmFzZU1haW5MZW5ndGggPSBsaW5lRGVmLm1haW5MZW5ndGggLyAoMTAgKiBiYXNlV2lkdGgpXG4gIGNvbnN0IGJhc2VNYWluR2FwID0gbGluZURlZi5tYWluR2FwIC8gKDEwICogYmFzZVdpZHRoKVxuICBjb25zdCBjb2xvckluZGV4ID0gbGluZURlZi5saW5lQ29sb3IgIT09IHVuZGVmaW5lZCA/IGxpbmVEZWYubGluZUNvbG9yIDogbGluZURlZi5jb2xvclxuXG4gIGNvbnN0IGxheWVyID0ge1xuICAgIGlkLFxuICAgIHNvdXJjZSxcbiAgICAnc291cmNlLWxheWVyJzogc291cmNlTGF5ZXIsXG4gICAgdHlwZTogJ2xpbmUnLFxuICAgIGZpbHRlcixcbiAgICBwYWludDoge1xuICAgICAgJ2xpbmUtY29sb3InOiBjb2xvcnNbY29sb3JJbmRleF0ucmdiLFxuICAgICAgJ2xpbmUtd2lkdGgnOiBleHBGdW5jKGJhc2VXaWR0aClcbiAgICB9LFxuICAgIG1ldGFkYXRhOiB7XG4gICAgICBzb3J0OiBjb2xvcnNbY29sb3JJbmRleF0ucmVuZGVyT3JkZXJcbiAgICB9XG4gIH1cblxuICBpZiAoYmFzZU1haW5MZW5ndGggJiYgYmFzZU1haW5HYXApIHtcbiAgICBsYXllci5wYWludFsnbGluZS1kYXNoYXJyYXknXSA9IFtiYXNlTWFpbkxlbmd0aCwgYmFzZU1haW5HYXBdXG4gIH1cblxuICByZXR1cm4gbGF5ZXJcbn1cblxuY29uc3QgYXJlYUxheWVyID0gKGlkLCBzb3VyY2UsIHNvdXJjZUxheWVyLCBmaWx0ZXIsIGFyZWFEZWYsIGNvbG9ycykgPT4ge1xuICBjb25zdCBmaWxsQ29sb3JJbmRleCA9IGFyZWFEZWYuZmlsbE9uICE9PSB1bmRlZmluZWRcbiAgICA/IGFyZWFEZWYuZmlsbE9uID8gYXJlYURlZi5maWxsQ29sb3IgOiBhcmVhRGVmLmNvbG9yc1swXVxuICAgIDogYXJlYURlZi5jb2xvclxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIHNvdXJjZSxcbiAgICAnc291cmNlLWxheWVyJzogc291cmNlTGF5ZXIsXG4gICAgdHlwZTogJ2ZpbGwnLFxuICAgIGZpbHRlcixcbiAgICBwYWludDoge1xuICAgICAgJ2ZpbGwtY29sb3InOiBjb2xvcnNbZmlsbENvbG9ySW5kZXhdLnJnYixcbiAgICAgICdmaWxsLW9wYWNpdHknOiBhcmVhRGVmLmZpbGxPbiA9PT0gdW5kZWZpbmVkIHx8IGFyZWFEZWYuZmlsbE9uXG4gICAgICAgID8gMVxuICAgICAgICA6IChhcmVhRGVmLmhhdGNoTGluZVdpZHRoIC8gYXJlYURlZi5oYXRjaERpc3QpIHx8IDAuNSAvLyBUT0RPOiBub3QgZXZlbiBjbG9zZSwgYnV0IGVtdWxhdGVzIGhhdGNoL3BhdHRlcm5zXG4gICAgfSxcbiAgICBtZXRhZGF0YToge1xuICAgICAgc29ydDogY29sb3JzW2ZpbGxDb2xvckluZGV4XS5yZW5kZXJPcmRlclxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjaXJjbGVMYXllciA9IChpZCwgc291cmNlLCBzb3VyY2VMYXllciwgZmlsdGVyLCBlbGVtZW50LCBjb2xvcnMpID0+IHtcbiAgY29uc3QgYmFzZVJhZGl1cyA9IChlbGVtZW50LmRpYW1ldGVyIC8gMiAvIDEwKSB8fCAxXG4gIGNvbnN0IGxheWVyID0ge1xuICAgIGlkLFxuICAgIHNvdXJjZSxcbiAgICAnc291cmNlLWxheWVyJzogc291cmNlTGF5ZXIsXG4gICAgdHlwZTogJ2NpcmNsZScsXG4gICAgZmlsdGVyLFxuICAgIHBhaW50OiB7XG4gICAgICAnY2lyY2xlLXJhZGl1cyc6IGV4cEZ1bmMoYmFzZVJhZGl1cylcbiAgICB9LFxuICAgIG1ldGFkYXRhOiB7XG4gICAgICBzb3J0OiBjb2xvcnNbZWxlbWVudC5jb2xvcl0ucmVuZGVyT3JkZXJcbiAgICB9XG4gIH1cblxuICBjb25zdCBjb2xvciA9IGNvbG9yc1tlbGVtZW50LmNvbG9yXS5yZ2JcbiAgaWYgKGVsZW1lbnQudHlwZSA9PT0gMykge1xuICAgIGNvbnN0IGJhc2VXaWR0aCA9IGVsZW1lbnQubGluZVdpZHRoIC8gMTBcbiAgICBsYXllci5wYWludFsnY2lyY2xlLW9wYWNpdHknXSA9IDBcbiAgICBsYXllci5wYWludFsnY2lyY2xlLXN0cm9rZS1jb2xvciddID0gY29sb3JcbiAgICBsYXllci5wYWludFsnY2lyY2xlLXN0cm9rZS13aWR0aCddID0gZXhwRnVuYyhiYXNlV2lkdGgpXG4gIH0gZWxzZSB7XG4gICAgbGF5ZXIucGFpbnRbJ2NpcmNsZS1jb2xvciddID0gY29sb3JcbiAgfVxuXG4gIHJldHVybiBsYXllclxufVxuXG5jb25zdCBleHBGdW5jID0gYmFzZSA9PiAoe1xuICAndHlwZSc6ICdleHBvbmVudGlhbCcsXG4gICdiYXNlJzogMixcbiAgJ3N0b3BzJzogW1xuICAgIFswLCBiYXNlICogTWF0aC5wb3coMiwgKDAgLSAxNSkpXSxcbiAgICBbMjQsIGJhc2UgKiBNYXRoLnBvdygyLCAoMjQgLSAxNSkpXVxuICBdXG59KVxuIl19
