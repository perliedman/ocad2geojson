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
