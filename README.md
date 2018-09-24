OCAD to GeoJSON
===============

Work in progress to export OCAD files to GeoJSON, put put some more GIS in the orienteering world.

This is barely useful at the moment, but you can at least get the geometry out of an OCAD file.

# Usage

```js
const ocad2geojson = require('ocad2geojson')

ocad2geojson(filePath)
  .then(map => {
    console.log(JSON.stringify(map.featureCollection))
  })
```

The argument to `ocad2geojson` can either be a file path (string) or a `Buffer` object.

# Command line

There is also a command line utility in `cli.js` which you can look at and use, but docs will have to wait.

# License

Since I highly dislike the closed source nature of some of the software used in orienteering (well, mostly OCAD),
this software is licensed under [AGPL-3.0](LICENSE); in short, to use this software, you must distribute source.
