const mapboxgl = window.mapboxgl

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
            tiles: ['http://localhost:8080/tiles/hp/{z}/{x}/{y}.pbf'],
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
