const fs = require('fs')
const mkdirp = require('mkdirp')
const { toWgs84 } = require('reproject')
const geojsonvt = require('geojson-vt')
const vtpbf = require('vt-pbf')
const argv = require('minimist')(process.argv.slice(2));
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } = require('./')
const filePath = argv._[0]
var outStream

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
    } else if (argv['vector-tiles']) {
      mode = 'vectortiles'
    }

    if (mode !== 'vectortiles') {
      outStream = argv.o ? fs.createWriteStream(argv.o) : process.stdout
    } else {
      mkdirp.sync(argv.o)
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
      case 'vectortiles':
        const geoJson = toWgs84(ocadToGeoJson(ocadFile), '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
        const tileIndex = geojsonvt(geoJson, {
          maxZoom: 14,
          indexMaxZoom: 14,
          indexMaxPoints: 0
        })
        tileIndex.tileCoords.forEach(tc => {
          mkdirp.sync(`${argv.o}/${tc.z}/${tc.x}`)
          const tile = tileIndex.getTile(tc.z, tc.x, tc.y)
          const pbf = vtpbf.fromGeojsonVt({ ocad: tile })
          const tilePath = `${argv.o}/${tc.z}/${tc.x}/${tc.y}.pbf`
          fs.writeFileSync(tilePath, pbf)
          console.log(tilePath)
        })
        fs.writeFileSync(`${argv.o}/layers.json`, JSON.stringify(ocadToMapboxGlStyle(ocadFile, {
          source: 'map',
          sourceLayer: 'ocad'
        }), null, 2))
        break
      default:
        console.error(`Unknown mode ${mode}.`)
        process.exit(1)
    }
  })

const writeInfo = (path, map, stream) => {
  const header = map.header

  let infos = [
    `File: ${path}`,
    `OCAD version: ${header.version}.${header.subVersion}.${header.subSubVersion}`,
    `File version: ${header.currentFileVersion}`,
    `Total number objects: ${map.objects.length}`,
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
