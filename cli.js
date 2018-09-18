const ocad2geojson = require('./')

ocad2geojson(process.argv[2])
  .then(map => console.log(JSON.stringify({type: 'FeatureCollection', features: map.objects}, null, 2)))
