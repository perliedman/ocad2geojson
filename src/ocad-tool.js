#!/usr/bin/env node
const fs = require('fs')
const https = require('https')
const mkdirp = require('mkdirp')
const { program } = require('commander')
const { toWgs84 } = require('reproject')
const geojsonvt = require('geojson-vt')
const vtpbf = require('vt-pbf')
const { XMLSerializer, DOMImplementation } = require('xmldom')
const {
  readOcad,
  ocadToGeoJson,
  ocadToMapboxGlStyle,
  ocadToQml,
  ocadToSvg,
} = require('./')

program
  .command('info <path>')
  .description('display file info')
  .option(
    '--symbols [identifiers]',
    'dump symbol information optionally limiting the output by a comma separated list of symbol identifiers'
  )
  .option(
    '--icons-bits',
    "display symbols' iconBits property (hidden by default)"
  )
  .option(
    '--parameter-strings [types]',
    'dump parameter strings optionally limiting the output by a comma separated list of type identifiers'
  )
  .option(
    '--object-strings [symbols]',
    'dump object strings optionally limiting the output by a comma separated list of symbol identifiers'
  )
  .action(info)

program
  .command('export <path> <output path>')
  .description('export OCAD map into another format')
  .option(
    '-f, --format <string>',
    'output format (geojson, svg, qml, mvt), otherwise guessed from output file extension'
  )
  .option(
    '--symbols <identifiers>',
    'limit the output by a comma separated list of symbol identifiers'
  )
  .option('--export-hidden', 'include hidden objects in the export', false)
  .option(
    '--crs <string>',
    'exported CRS; options are "source" (unmodified from OCAD file), "projection" (map\'s geographic projection, default) or "wgs84" (WGS84 coordinates); only applies to GeoJSON exports',
    'projection'
  )
  .action(exportMap)

program.parse(process.argv)

async function info(path, options) {
  const ocadFile = await readOcad(path)
  const header = ocadFile.header
  const stream = process.stdout

  let infos = [
    `File: ${path}`,
    `OCAD version: ${header.version}.${header.subVersion}.${header.subSubVersion}`,
    `File version: ${header.currentFileVersion}`,
    `Number symbols: ${ocadFile.symbols.length}`,
    `Number objects: ${ocadFile.objects.length}`,
  ]

  const crs = ocadFile.getCrs()
  infos = infos.concat([
    `Scale: 1:${crs.scale}`,
    `Grid ID: ${crs.gridId}`,
    `CRS Name: ${crs.name}`,
    `CRS identifier: ${crs.catalog}:${crs.code}`,
    `Grivation: ${((crs.grivation / Math.PI) * 180).toFixed(2)}°`,
    `Northing: ${crs.northing}`,
    `Easting: ${crs.easting}`,
  ])

  const bounds = ocadFile.getBounds()
  const projectedBounds = ocadFile.getBounds(crs.toProjectedCoord.bind(crs))
  infos = infos.concat([
    `Bounds (mm): ${bounds.map(x => x / 100)}`,
    `Bounds (CRS): ${projectedBounds}`,
  ])

  stream.write(infos.join('\n'))
  stream.write('\n')

  if (options.symbols) {
    let symNums
    if (typeof options.symbols === 'string') {
      symNums = new Set(parseSymNums(options.symbols))
    }
    const symbols = symNums
      ? ocadFile.symbols.filter(s => symNums.has(s.symNum))
      : ocadFile.symbols

    if (symbols.length === 0) {
      console.error(`No such symbol ${symNums} (${options.symbols})`)
      process.exit(1)
    }

    const symbolBlacklist = new Set(
      options.iconBits
        ? ['buffer', 'offset', '_startOffset', 'filePos']
        : ['iconBits', 'buffer', 'offset', '_startOffset', 'filePos']
    )

    stream.write(
      symbols
        .map(s =>
          [
            `${s.number} ${s.description}`,
            formatObject(s, symbolBlacklist),
          ].join('\n')
        )
        .join('\n\n')
    )
    stream.write('\n')
  }

  if (options.parameterStrings) {
    stream.write(
      Object.entries(ocadFile.parameterStrings)
        .filter(
          ([k, v]) =>
            typeof options.parameterStrings !== 'string' ||
            options.parameterStrings.split(',').indexOf(k) >= 0
        )
        .map(([k, v]) => `${k}\t${JSON.stringify(v)}\n`)
        .join('')
    )
  }

  if (options.objectStrings) {
    stream.write(
      ocadFile.objects
        .filter(
          o =>
            typeof options.objectStrings !== 'string' ||
            options.objectStrings
              .split(',')
              .indexOf(
                '' +
                  Math.trunc(o.sym / 1000) +
                  '.' +
                  String(o.sym % 1000).padStart(3, '0')
              ) >= 0
        )
        .map(o => `${o.sym}\t${o.objectString}\n`)
        .join('')
    )
  }
}

async function exportMap(path, outputPath, options) {
  const ocadFile = await readOcad(path)
  const format =
    options.format || /^.*\.(\w+)$/.exec(outputPath)[1].toLocaleLowerCase()
  const outputOptions = {
    exportHidden: options.exportHidden,
    includeSymbols:
      typeof options.symbols === 'string' && parseSymNums(options.symbols),
    applyCrs: options.crs !== 'source',
  }

  let output
  switch (format) {
    case 'json':
    case 'geojson': {
      const crs = ocadFile.getCrs()
      const crsDef =
        options.crs === 'projection'
          ? crs.catalog && crs.code
            ? {
                crs: {
                  type: 'name',
                  properties: {
                    name: `urn:ogc:def:crs:${crs.catalog}::${crs.code}`,
                  },
                },
              }
            : {}
          : {}
      const geojson = ocadToGeoJson(ocadFile, outputOptions)
      output = JSON.stringify({
        ...crsDef,
        ...(options.crs === 'wgs84'
          ? toWgs84(geojson, await getProj4Def(crs.code))
          : geojson),
      })
      break
    }
    case 'svg':
      output = toSvg(ocadFile, outputOptions)
      break
    case 'qml':
      output = new XMLSerializer().serializeToString(
        ocadToQml(ocadFile, outputOptions)
      )
      break
    case 'mvt':
      toMvt(ocadFile, outputPath, outputOptions)
      break
    default:
      console.error(`Unknown output format ${format}.`)
      process.exit(1)
  }

  if (output) {
    const stream = fs.createWriteStream(outputPath)
    stream.write(output)
    stream.close()
  }
}

function parseSymNums(s) {
  return s.split(',').map(parseSymNum)
}

function parseSymNum(x) {
  const n = Number(x)
  const t = Math.trunc(n)
  return (t + (n - t) / 100) * 1000
}

function formatObject(o, blackList) {
  return Object.keys(o)
    .filter(k => !blackList.has(k))
    .map(k => `\t${k}: ${JSON.stringify(o[k], replacer)}`)
    .join('\n')

  function replacer(k, v) {
    return !blackList.has(k) ? v : undefined
  }
}

async function toMvt(ocadFile, outputPath, outputOptions) {
  const crs = ocadFile.getCrs()
  if (crs.catalog !== 'EPSG' || crs.code <= 0) {
    throw new Error(`Unsupported CRS ${crs.catalog}:${crs.code} in OCAD file.`)
  }

  const geoJson = toWgs84(
    ocadToGeoJson(ocadFile, outputOptions),
    await getProj4Def(crs.code)
  )
  const tileIndex = geojsonvt(geoJson, {
    maxZoom: 14,
    indexMaxZoom: 14,
    indexMaxPoints: 0,
  })
  tileIndex.tileCoords.forEach(tc => {
    mkdirp.sync(`${outputPath}/${tc.z}/${tc.x}`)
    const tile = tileIndex.getTile(tc.z, tc.x, tc.y)
    const pbf = vtpbf.fromGeojsonVt({ ocad: tile })
    const tilePath = `${outputPath}/${tc.z}/${tc.x}/${tc.y}.pbf`
    fs.writeFileSync(tilePath, pbf)
    console.log(tilePath)
  })
  fs.writeFileSync(
    `${outputPath}/layers.json`,
    JSON.stringify(
      ocadToMapboxGlStyle(ocadFile, {
        source: 'map',
        sourceLayer: 'ocad',
      }),
      null,
      2
    )
  )
}

function toSvg(ocadFile, outputOptions) {
  const svgDoc = ocadToSvg(ocadFile, {
    ...outputOptions,
    document: new DOMImplementation().createDocument(null, 'xml', null),
  })
  fixIds(svgDoc)
  return new XMLSerializer().serializeToString(svgDoc)
}

function getProj4Def(crs) {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'epsg.io',
      path: `/${crs}.proj4`,
    }
    const request = https.request(options, function (res) {
      let data = ''
      res.on('data', function (chunk) {
        data += chunk
      })
      res.on('end', function () {
        resolve(data)
      })
    })
    request.on('error', function (e) {
      reject(e)
    })
    request.end()
  })
}

// In xmldom, node ids are normal attributes, while in the browser's
// DOM, they are a property on the node object itself. This method
// recursively "fixes" nodes by adding id attributes.
function fixIds(n) {
  if (n.id) {
    n.setAttributeNS('http://www.w3.org/2000/svg', 'id', n.id)
  }
  if (n.childNodes) {
    for (let i = 0; i < n.childNodes.length; i++) {
      fixIds(n.childNodes[i])
    }
  }
}
