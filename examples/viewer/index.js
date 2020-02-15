const Vue = window.Vue
const toBuffer = require('blob-to-buffer')
const bbox = require('@turf/bbox').default
const { toWgs84 } = require('reproject')
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('../../')
const { coordEach } = require('@turf/meta')

mapboxgl.accessToken = 'pk.eyJ1IjoibGllZG1hbiIsImEiOiJZc3U4UXowIn0.d4yPyJ_Bl7CAROv15im36Q';

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
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
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
