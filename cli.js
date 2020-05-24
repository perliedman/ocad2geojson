const fs = require('fs')
const mkdirp = require('mkdirp')
const { toWgs84 } = require('reproject')
const geojsonvt = require('geojson-vt')
const vtpbf = require('vt-pbf')
const argv = require('minimist')(process.argv.slice(2));
const { readOcad, ocadToGeoJson, ocadToMapboxGlStyle, ocadToQml } = require('./')
const { XMLSerializer } = require('xmldom')
const filePath = argv._[0]
var outStream

const deleteBuffer = x => {
  if (x instanceof Object) {
    Object.keys(x).forEach(k => {
      if (k === 'buffer') {
        delete x[k]
      } else {
        deleteBuffer(x[k])
      }
    })
  }
}

readOcad(filePath)
  .then(ocadFile => {
    if (argv.v || argv.info) {
      writeInfo(filePath, ocadFile, process.stderr)
    }

    let mode = 'geojson'
    let symNum

    if (argv.p) {
      mode = 'params'
    } if (argv.qml) {
      mode = 'qml'
    } else if (argv.s) {
      mode = 'symbols'
      if (argv.s !== true) {
        const n = Number(argv.s)
        const t = Math.trunc(n)
        symNum = (t + (n - t) / 100) * 1000
      }
    } else if (argv.info) {
      mode = 'info'
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
        const options = {
          generateSymbolElements: argv['symbol-elements'] === undefined || argv['symbol-elements'] !== 'false'
        }
        const geojson = ocadToGeoJson(ocadFile, options)
        outStream.write(JSON.stringify(geojson, null, 2))
        break
      case 'qml':
        outStream.write(new XMLSerializer().serializeToString(ocadToQml(ocadFile)))
        break
      case 'params':
        outStream.write(JSON.stringify(ocadFile.parameterStrings, null, 2))
        break
      case 'symbols':
        const symbols = symNum ? ocadFile.symbols.filter(s => s.symNum === symNum) : ocadFile.symbols

        if (symbols.length === 0) {
          console.error(`No such symbol ${argv.s} (${symNum})`)
          process.exit(1)
        }

        symbols.forEach(symbol => {
          deleteBuffer(symbol)
          if (!argv.iconBits) {
            delete symbol.iconBits
          }

          outStream.write(JSON.stringify(symbol, null, 2))
        })
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
      case 'info':
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

  const crs = map.getCrs()
  infos = infos.concat([
    `Scale: 1:${crs.scale}`,
    `Northing: ${crs.northing}`,
    `Easting: ${crs.easting}`,
    `Grid ID: ${crs.gridId}`,
    `CRS Name: ${crs.name}`,
    `CRS identifier: ${crs.catalog}:${crs.code}`
  ])

  stream.write(infos.join('\n'))
  stream.write('\n')
}
