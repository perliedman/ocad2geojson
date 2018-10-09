const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2));
const { readOcad, ocadToGeoJson } = require('./')
const filePath = argv._[0]
const outStream = argv.o ? fs.createWriteStream(argv.o) : process.stdout

readOcad(filePath)
  .then(ocadFile => {
    if (argv.v) {
      writeInfo(filePath, ocadFile, process.stderr)
    }

    let mode = 'geojson'

    if (argv.p) {
      mode = 'params'
    } else if (argv.s) {
      mode = 'symbols'
      const n = Number(argv.s)
      const t = Math.trunc(n)
      symNum = (t + (n - t) / 100) * 1000
    }

    switch (mode) {
      case 'geojson':
        outStream.write(JSON.stringify(ocadToGeoJson(ocadFile), null, 2))
        break
      case 'params':
        outStream.write(JSON.stringify(ocadFile.parameterStrings, null, 2))
        break
      case 'symbols':
        const symbol = ocadFile.symbols.find(s => s.symNum === symNum)

        if (!symbol) {
          console.error(`No such symbol ${argv.s} (${symNum})`)
          process.exit(1)
        }

        delete symbol.buffer
        if (!argv.iconBits) {
          delete symbol.iconBits
        }

        outStream.write(JSON.stringify(symbol, null, 2))
        break
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
