const { readOcad } = require('../../')
const toBuffer = require('blob-to-buffer')
const blobStream = require('blob-stream')
const Map = require('ol/map').default
const TileLayer = require('ol/layer/tile').default
// const OsmSource = require('ol/source/osm').default
const View = require('ol/view').default
const proj4 = require('proj4')
const olProj = require('ol/proj').default
const OcadSource = require('./ocad-source')

proj4.defs(
  'EPSG:3006',
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
)
olProj.setProj4(proj4)

const projection = olProj.get('EPSG:3006')

fetch('example.ocd')
  .then(res => res.blob())
  .then(
    blob =>
      new Promise((resolve, reject) =>
        toBuffer(blob, (err, buffer) => {
          if (err) reject(err)
          resolve(buffer)
        })
      )
  )
  .then(buffer => readOcad(buffer))
  .then(ocadFile => {
    var map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OcadSource({ ocadFile }),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([11.94, 57.75], projection),
        zoom: 16,
      }),
      projection,
    })
  })
