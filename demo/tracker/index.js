const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('../../')
const { Buffer } = require('buffer')
const { toWgs84 } = require('reproject')
const Color = require('color')
const toBuffer = require('blob-to-buffer')
const bbox = require('@turf/bbox').default
const { gpx } = require('@mapbox/togeojson')
const mapboxgl = window.mapboxgl

const fetchTrack = fetch('example.gpx')

fetch('../example.ocd')
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => toBuffer(blob, (err, buffer) => {
    if (err) reject(err)
    resolve(buffer)
  })))
  .then(buffer => readOcad(buffer))
  .then(ocadFile => {
    const geoJson = toWgs84(ocadToGeoJson(ocadFile), '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')

    ocadFile.colors.forEach((c, i) => {
      ocadFile.colors[i].rgb = Color(ocadFile.colors[i].rgb).desaturate(0.15).rgb().string()
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
      // center: [11.93, 57.75],
      // zoom: 14
    })

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    map.on('load', function() {
      const bounds = bbox(geoJson)
      map.fitBounds(bounds, {
        padding: 20,
        animate: false
      })

      fetchTrack
        .then(res => res.text())
        .then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
        .then(doc => gpx(doc))
        .then(trackGeoJson => {
          const replaySpeedFactor = 10
          const trackPath = trackGeoJson.features[0]
          const coordTimes = trackPath.properties.coordTimes.map((t, i) => ({t: +new Date(t), i}))
          const startT = +new Date()
          const trackStartT = +new Date(coordTimes[0].t)

          const currentPath = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
          const currentGeoJson = {
            type: 'FeatureCollection',
            features: [currentPath]
          }

          map.addLayer({
            id: 'track',
            type: 'line',
            source: {
              type: 'geojson',
              data: currentGeoJson
            },
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
                "line-color": "#a00",
                "line-width": {
                  'type': 'exponential',
                  'base': 2,
                  'stops': [
                    [0, 4 * Math.pow(2, (0 - 16))],
                    [24, 4 * Math.pow(2, (24 - 16))]
                  ]
                },
                "line-opacity": 0.85
            }
          })

          let firstIndex = 0
          let lastIndex = 0

          const update = () => {
            const relT = (+new Date() - startT) * replaySpeedFactor
            const trackT = trackStartT + relT
            const minT = trackT - 60 * 1000

            while (coordTimes[firstIndex].t < minT) firstIndex++
            while (coordTimes[lastIndex].t < trackT) lastIndex++

            currentPath.geometry.coordinates = trackPath.geometry.coordinates.slice(firstIndex, lastIndex + 1)
            map.getSource('track').setData(currentGeoJson);

            window.requestAnimationFrame(update)
          }

          window.requestAnimationFrame(update)
        })
    })
  })
