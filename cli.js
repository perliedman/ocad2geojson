const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2));
const ocad2geojson = require('./')
const filePath = argv._[0]
const outStream = argv.o ? fs.createWriteStream(argv.o) : process.stdout

ocad2geojson(filePath)
  .then(map => {
    if (argv.v) {
      writeInfo(filePath, map, process.stderr)
    }

    if (!argv.p) {
      outStream.write(JSON.stringify(map.featureCollection, null, 2))
    } else {
      outStream.write(JSON.stringify(map.parameterStrings, null, 2))
    }
  })

const writeInfo = (path, map, stream) => {
  const header = map.header

  let infos = [
    `File: ${path}`,
    `OCAD version: ${header.version}.${header.subVersion}.${header.subSubVersion}`,
    `File version: ${header.currentFileVersion}`,
    `Total number objects: ${map.featureCollection.features.length}`,
  ]

  if (map.parameterStrings[1039]) {
    const scalePar = map.parameterStrings[1039][0]
    infos = infos.concat([
      `Scale: 1:${scalePar.m}`,
      `Northing: ${scalePar.y}`,
      `Easting: ${scalePar.x}`
    ])
  }

  stream.write(infos.join('\n'))
  stream.write('\n')
}
