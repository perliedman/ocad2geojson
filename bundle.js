(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Vue = window.Vue
const toBuffer = require('blob-to-buffer')
const bbox = require('@turf/bbox').default
const { toWgs84 } = require('reproject')
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('ocad2geojson')
const { coordEach } = require('@turf/meta')

Vue.use(MuseUI);
MuseUI.theme.use('dark')

Vue.component('upload-form', {
  template: '#upload-form-template',
  props: ['loading'],
  data () {
    return {
      form: {
        files: [],
        epsg: 3006
      }
    }
  },
  methods: {
    fileSelected (e) {
      this.form.files = e.target.files
    },
    loadFile () {
      const reader = new FileReader()
      reader.onload = () => {
        const blob = new Blob([reader.result], {type: 'application/octet-stream'})
        toBuffer(blob, (err, buffer) => {
          this.$emit('fileselected', {
            name: file.name,
            content: buffer,
            epsg: this.form.epsg
          })
        })
      }

      const file = this.form.files[0]
      reader.readAsArrayBuffer(file)
    }
  }
})

Vue.component('info', {
  template: '#info-template',
  data: () => ({open: false}),
  methods: {
    toggle () {
      this.open = !this.open
    }
  }
})

Vue.component('file-info', {
  template: '#file-info-template',
  props: ['name', 'file', 'error', 'geojson'],
  data () {
    return {
      menuOpen: false
    }
  },
  computed: {
    crs () {
      return this.file && this.file.parameterStrings[1039] && this.file.parameterStrings[1039][0]
    },
    version () {
      if (!this.file || !this.file.header) return '-'
      const header = this.file.header
      return `${header.version}.${header.subVersion}.${header.subSubVersion}`
    }
  },
  methods: {
    downloadGeoJson () {
      if (!this.geojson || this.error) { return }

      const link = document.createElement('a')
      const blob = new Blob([JSON.stringify(this.geojson, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = this.name + '.json'
      document.body.appendChild(link)
      link.click()

      // Clean up, since createObjectURL can leak memory
      const remove = () => {
        setTimeout(() => URL.revokeObjectURL(url))
        link.removeEventListener('pointerup', remove)
        document.body.removeChild(link)
      }

      link.addEventListener('pointerup', remove)
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
    loading: false,
    epsgCache: {}
  },
  methods: {
    selectFile ({path, content, name, epsg}) {
      this.name = name
      this.file = null
      this.error = null
      this.loading = true

      Vue.nextTick(() => {
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
            this.loading = false
            this.file = Object.freeze(ocadFile)
            this.layers = ocadToMapboxGlStyle(this.file, {source: 'map', sourceLayer: ''})

            crsDef.then(projDef => {
              this.geojson = toWgs84(ocadToGeoJson(this.file), projDef)
              coordEach(this.geojson, c => {
                c[0] = formatNum(c[0], 6)
                c[1] = formatNum(c[1], 6)
              })            
            })
          })
          .catch(err => {
            this.error = err.message
            this.loading = false
          })
      })
    }
  }
})

function formatNum(num, digits) {
	var pow = Math.pow(10, (digits === undefined ? 6 : digits));
	return Math.round(num * pow) / pow;
}

},{"@turf/bbox":2,"@turf/meta":4,"blob-to-buffer":6,"ocad2geojson":11,"reproject":33}],2:[function(require,module,exports){
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

},{"@turf/meta":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"@turf/helpers":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
},{"buffer":8}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
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

},{"base64-js":5,"ieee754":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
const readOcad = require('./ocad-reader')
const ocadToGeoJson = require('./ocad-to-geojson')
const ocadToMapboxGlStyle = require('./ocad-to-mapbox-gl-style')

module.exports = {
  readOcad,
  ocadToGeoJson,
  ocadToMapboxGlStyle
}

},{"./ocad-reader":15,"./ocad-to-geojson":30,"./ocad-to-mapbox-gl-style":31}],12:[function(require,module,exports){
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

},{"./symbol":27}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
const Block = require('./block')

module.exports = class FileHeader extends Block {
  constructor (buffer, offset) {
    super(buffer, offset)

    if (buffer.length - offset < 60) {
      throw new Error('Not an OCAD file (not large enough to hold header)')
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

},{"./block":13}],15:[function(require,module,exports){
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
  const header = new FileHeader(buffer, 0)
  if (!header.isValid()) {
    throw new Error(`Not an OCAD file (invalid header ${header.ocadMark} !== ${0x0cad})`)
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

},{"../cmyk-to-rgb":10,"./file-header":14,"./object-index":18,"./string-index":22,"./symbol-index":25,"buffer":8,"fs":7}],16:[function(require,module,exports){
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

},{"./block":13,"./symbol":27}],17:[function(require,module,exports){
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

},{"./block":13}],18:[function(require,module,exports){
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
      .filter(o => o.status === 1) // Remove deleted and hidden objects
      .map(o => this.parseObject(o, o.objType))
      .filter(o => o)
  }

  parseObject (objIndex, objType) {
    if (!objIndex.pos) return

    return new TObject[this.version](this.buffer, objIndex.pos, objType)
  }
}

},{"./block":13,"./lrect":17,"./tobject":29}],19:[function(require,module,exports){
module.exports = {
  PointObjectType: 1,
  LineObjectType: 2,
  AreaObjectType: 3
}

},{}],20:[function(require,module,exports){
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

},{"./block":13}],21:[function(require,module,exports){
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

},{"./symbol":27}],22:[function(require,module,exports){
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

},{"./block":13,"./parameter-string":20}],23:[function(require,module,exports){
module.exports = {
  LineElementType: 1,
  AreaElementType: 2,
  CircleElementType: 3,
  DotElementType: 4
}

},{}],24:[function(require,module,exports){
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

},{"./block":13,"./td-poly":28}],25:[function(require,module,exports){
const Block = require('./block')
const PointSymbol = require('./point-symbol')
const LineSymbol = require('./line-symbol')
const AreaSymbol = require('./area-symbol')
const { PointSymbolType, LineSymbolType, AreaSymbolType } = require('./symbol-types')

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
      case PointSymbolType:
        return new PointSymbol[this.version](this.buffer, offset)
      case LineSymbolType:
        return new LineSymbol[this.version](this.buffer, offset)
      case AreaSymbolType:
        return new AreaSymbol[this.version](this.buffer, offset)
    }

    // Ignore other symbols for now
  }
}

},{"./area-symbol":12,"./block":13,"./line-symbol":16,"./point-symbol":21,"./symbol-types":26}],26:[function(require,module,exports){
module.exports = {
  PointSymbolType: 1,
  LineSymbolType: 2,
  AreaSymbolType: 3
}

},{}],27:[function(require,module,exports){
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

  isHidden () {
    return (this.status & 0xf) === 2
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

},{"./block":13,"./symbol-element":24}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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
    this.nItem = this.readCardinal()
    this.nText = this.readWord()
    this.mark = this.readByte()
    this.snappingMark = this.readByte()
    this.col = this.readInteger()
    this.lineWidth = this.readSmallInt()
    this.diamFlags = this.readSmallInt()
    this.serverObjectId = this.readInteger()
    this.height = this.readInteger()
    this._date = this.readDouble()
    this.coordinates = new Array(this.nItem)

    for (let i = 0; i < this.nItem; i++) {
      this.coordinates[i] = new TdPoly(this.readInteger(), this.readInteger())
    }
  }
}

class TObject12 extends BaseTObject {
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
  12: TObject12
}

},{"./block":13,"./td-poly":28}],30:[function(require,module,exports){
const { coordEach } = require('@turf/meta')
const { PointSymbolType, LineSymbolType } = require('./ocad-reader/symbol-types')
const { PointObjectType, LineObjectType, AreaObjectType } = require('./ocad-reader/object-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')

const defaultOptions = {
  assignIds: true,
  applyCrs: true,
  generateSymbolElements: true,
  exportHidden: false,
  coordinatePrecision: 6
}

module.exports = function (ocadFile, options) {
  options = { ...defaultOptions, ...options }

  let id = 1
  const symbols = ocadFile.symbols.reduce((ss, s) => {
    ss[s.symNum] = s
    return ss
  }, {})

  let features = ocadFile.objects
    .map(tObjectToGeoJson.bind(null, options, symbols))
    .filter(f => f)

  if (options.assignIds) {
    features.forEach(o => {
      o.id = id++
    })
  }

  if (options.generateSymbolElements) {
    const elementFeatures = features
      .map(generateSymbolElements.bind(null, options, symbols))
      .filter(f => f)

    if (options.assignIds) {
      elementFeatures.forEach(o => {
        o.id = id++
      })
    }

    features = features.concat(Array.prototype.concat.apply([], elementFeatures))
  }

  const featureCollection = {
    type: 'FeatureCollection',
    features
  }

  if (options.applyCrs) {
    applyCrs(featureCollection, ocadFile.getCrs())
  }

  coordEach(featureCollection, c => {
    c[0] = formatNum(c[0], options.coordinatePrecision)
    c[1] = formatNum(c[1], options.coordinatePrecision)
  })

  return featureCollection
}

const tObjectToGeoJson = (options, symbols, object) => {
  const symbol = symbols[object.sym]
  if (!options.exportHidden && (!symbol || symbol.isHidden())) return

  var geometry
  switch (object.objType) {
    case PointObjectType:
      geometry = {
        type: 'Point',
        coordinates: object.coordinates[0]
      }
      break
    case LineObjectType:
      geometry = {
        type: 'LineString',
        coordinates: object.coordinates
      }
      break
    case AreaObjectType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(object.coordinates)
      }
      break
    default:
      return
  }

  return {
    type: 'Feature',
    properties: object.getProperties(),
    geometry
  }
}

const generateSymbolElements = (options, symbols, feature) => {
  const symbol = symbols[feature.properties.sym]
  let elements = []

  if (!options.exportHidden && (!symbol || symbol.isHidden())) return elements

  switch (symbol.type) {
    case PointSymbolType:
      const angle = feature.properties.ang ? feature.properties.ang / 10 / 180 * Math.PI : 0
      elements = symbol.elements
        .map((e, i) => createElement(symbol, 'element', i, feature, e, feature.geometry.coordinates, angle))
      break
    case LineSymbolType:
      if (symbol.primSymElements.length > 0) {
        const coords = feature.geometry.coordinates
        const endLength = symbol.endLength
        const mainLength = symbol.mainLength
        const spotDist = symbol.primSymDist

        let d = endLength

        for (let i = 1; i < coords.length; i++) {
          const c0 = coords[i - 1]
          const c1 = coords[i]
          const v = c1.sub(c0)
          const angle = Math.atan2(v[1], v[0])
          const u = v.unit()
          const segmentLength = v.vLength()

          let c = c0.add(u.mul(d))
          let j = 0
          while (d < segmentLength) {
            elements = elements.concat(symbol.primSymElements
              .map((e, i) => createElement(symbol, 'prim', i, feature, e, c, angle)))

            j++
            const step = (spotDist && j % symbol.nPrimSym) ? spotDist : mainLength

            c = c.add(u.mul(step))
            d += step
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
    case LineElementType:
      geometry = {
        type: 'LineString',
        coordinates: translatedCoords
      }
      break
    case AreaElementType:
      geometry = {
        type: 'Polygon',
        coordinates: coordinatesToRings(translatedCoords)
      }
      break
    case CircleElementType:
    case DotElementType:
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

function formatNum(num, digits) {
	var pow = Math.pow(10, (digits === undefined ? 6 : digits));
	return Math.round(num * pow) / pow;
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

},{"./ocad-reader/object-types":19,"./ocad-reader/symbol-element-types":23,"./ocad-reader/symbol-types":26,"@turf/meta":4}],31:[function(require,module,exports){
const { PointSymbolType, LineSymbolType, AreaSymbolType } = require('./ocad-reader/symbol-types')
const { LineElementType, AreaElementType, CircleElementType, DotElementType } = require('./ocad-reader/symbol-element-types')

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
    case LineSymbolType:
      if (!symbol.lineWidth) return
      return lineLayer(id, options.source, options.sourceLayer, filter, symbol, colors)
    case AreaSymbolType:
      return areaLayer(id, options.source, options.sourceLayer, filter, symbol, colors)
  }
}

const symbolElementsToMapboxLayer = (symbol, colors, options) => {
  var elements = []
  var name
  switch (symbol.type) {
    case PointSymbolType:
      elements = symbol.elements
      name = 'element'
      break
    case LineSymbolType:
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
    case LineElementType:
      return lineLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
    case AreaElementType:
      return areaLayer(
        id,
        options.source,
        options.sourceLayer,
        filter,
        element, colors)
    case CircleElementType:
    case DotElementType:
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
  if (element.type === CircleElementType) {
    const baseWidth = element.lineWidth / 10
    layer.paint['circle-opacity'] = 0
    layer.paint['circle-stroke-color'] = color
    layer.paint['circle-stroke-width'] = expFunc(baseWidth)
  } else {
    // DotElementType
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

},{"./ocad-reader/symbol-element-types":23,"./ocad-reader/symbol-types":26}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"proj4":32}]},{},[1]);
