OCAD to GeoJSON
===============

Work in progress to export OCAD files to GeoJSON, put put some more GIS in the orienteering world.

![Example Map Output](example-map.png)

You can use this to get geo/GIS data out of an OCAD file. This is currently more or less three modules
working together:

* _OCAD file reader_, to get meaningful data out of the binary OCAD files
* _OCAD to GeoJSON_, to export the geographic objects from OCAD files
* _OCAD to Mapbox GL style_, to get the styling (colors, line widths, etc.) into something you can
  use with other tools

OCAD version 10, 11 and 12 files are mostly supported.

## Usage

```js
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('../')

readOcad(filePath)
  .then(map => {
    const geojson = ocadToGeoJson(ocadFile)
    console.log(JSON.stringify(geojson))
  })
```

The argument to `readOcad` can either be a file path (string) or a `Buffer` object.

## Command line

There is also a command line utility in `cli.js` which you can look at and use, but docs will have to wait.

## License

Since I highly dislike the closed source nature of some of the software used in orienteering (well, mostly OCAD),
this software is licensed under [AGPL-3.0](LICENSE); in short, to use this software, you must distribute source.
