const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('../')
const { Buffer } = require('buffer')
const { toWgs84 } = require('reproject')
const Color = require('color')
const toBuffer = require('blob-to-buffer')
const bbox = require('@turf/bbox').default
const mapboxgl = window.mapboxgl

fetch('example.ocd')
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => toBuffer(blob, (err, buffer) => {
    if (err) reject(err)
    resolve(buffer)
  })))
  .then(buffer => readOcad(buffer))
  .then(ocadFile => {
    const geoJson = toWgs84(ocadToGeoJson(ocadFile), '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
    const bounds = bbox(geoJson)

    ocadFile.colors.forEach((c, i) => {
      ocadFile.colors[i].rgb = Color(ocadFile.colors[i].rgb).desaturate(0.4).rgb().string()
    })
    
    const map = window._map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        name: 'OCAD demo',
        sources: {
          map: {
            type: 'geojson',
            data: geoJson
          }
        },
        layers: ocadToMapboxGlStyle(ocadFile, {
          source: 'map'
        })
      },
      center: [11.93, 57.75],
      zoom: 14
    })

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    map.fitBounds(bounds)
  })
