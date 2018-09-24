const ocad2geojson = require('../')
const { Buffer } = require('buffer')
const { toWgs84 } = require('reproject')
const toBuffer = require('blob-to-buffer')
const bbox = require('@turf/bbox').default
const mapboxgl = window.mapboxgl

fetch('example.ocd')
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => toBuffer(blob, (err, buffer) => {
    if (err) reject(err)
    resolve(buffer)
  })))
  .then(buffer => ocad2geojson(buffer))
  .then(mapData => {
    const geoJson = toWgs84(mapData.featureCollection, '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
    const bounds = bbox(geoJson)
    
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
        layers: [
          {
            id: 'lines',
            source: 'map',
            type: 'line',
            filter: ['==', ['geometry-type'], 'LineString']
          }
        ]
      },
      center: [11.9, 57.73],
      zoom: 14
    })

    // map.fitBounds(bounds)
  })
