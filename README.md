# OCAD to GeoJSON

Export [OCAD](https://www.ocad.com/) files to open formats:

- [GeoJSON](http://geojson.org/)
- [Mapbox Style Spec](https://www.mapbox.com/mapbox-gl-js/style-spec/)
- SVG
- PDF
- [QGIS](https://qgis.org/en/site/) / QML (very rough and incomplete)

You might also want to look at [ocad2tiles](https://github.com/perliedman/ocad2tiles) which uses ocad2geojson to create overview images and tiles for online maps from OCAD files.

![Example Map Output](example-map-2.png)
![Example Map Output](example-map-3.png)
![Example Map Output](example-map.png)

Demo: [OCAD map viewer and converter in your browser](https://www.liedman.net/ocad2geojson/)

You can use this to get geo/GIS data out of an OCAD file. This is currently more or less four modules
working together:

- _OCAD file reader_, to get meaningful data out of the binary OCAD files
- _OCAD to GeoJSON_, to export the geographic objects from OCAD files
- _OCAD to SVG_, to export the map to vector graphics; SVG can then also easily be used to produce PDFs
- _OCAD to QML_, to export the map styling to QGIS QML format
- _OCAD to Mapbox GL style_, to get the styling (colors, line widths, etc.) into something you can use with other tools

OCAD version 10, 11 and 12 and 2018 files are mostly supported. Some OCAD features are currently not fully supported:

- Hatch fills are not supported when exported to Mapbox styles and emulated by semi-transparent fills
- Fill patterns are ~~not supported~~ supported for SVG and PDF exports
- ~~Curves are not supported~~ Bezier curves now supported!
- ~~Some texts are not exported~~
- ~~SVG / PDF currently lack any text~~ SVG and PDF now have text support
- ...and probably a lot more that I do not even know is missing

Feel free to open issues for lacking features - I will not promise to add them, but good to keep track of what is missing.

Have you built something with this module, or want to help out improving it? I'd love to know; open an issue, pull request or contact [per@liedman.net](mailto:per@liedman.net).

## Usage

### Command line

Installing the `ocad2geojson` package will also install the binary `ocad-tool` in
your path.

It can be used to get data out of an OCAD file in various formats:

```
Usage: ocad-tool [options] [command]

Options:
  -h, --help                       display help for command

Commands:
  info [options] <path>            display file info
  export [options] <path> <outpu>  export OCAD map into another format
  help [command]                   display help for command
```

Use `info` to extract information from OCAD files:

```
Usage: ocad-tool info [options] <path>

display file info

Options:
  --symbols                   dump symbol information
  --filter-symbols <numbers>  only show numbered symbols
  --icons-bits                display symbols' iconBits property (hidden by default)
  -h, --help                  display help for command
```

Use `export` to export OCAD files to other formats:

```
Usage: ocad-tool export [options] <path> <outpu>

export OCAD map into another format

Options:
  -f, --format <string>  output format (geojson, svg, qml, mvt), otherwise guessed from output file extension
  --export-hidden        include hidden objects in the export (default: false)
  -h, --help             display help for command
```

### API

```js
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('../')

readOcad(filePath).then(ocadFile => {
  const geojson = ocadToGeoJson(ocadFile)
  console.log(JSON.stringify(geojson))
  const layerStyles = ocadToMapboxGlStyle(ocadFile)
  console.log(JSON.stringify(layerStyles))
})
```

The argument to `readOcad` can either be a file path (string) or a `Buffer` object.

I will try to write some docs, in the meantime, check out the [demo directory](demo) for some examples of how to use this module.

## License

Since I highly dislike the closed source nature of some of the software used in orienteering (well, mostly OCAD),
this software is licensed under [AGPL-3.0](LICENSE); in short, to use this software, you must distribute source.
