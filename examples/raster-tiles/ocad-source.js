const ol = require('ol').default
const XYZSource = require('ol/source/xyz').default
const ImageTile = require('ol/imagetile').default
const TileState = require('ol/tilestate').default
const olSize = require('ol/size').default
const olDom = require('ol/dom').default
const Flatbush = require('flatbush')
const { ocadToSvg } = require('../../')

module.exports = OcadSource

const hundredsMmToMeter = 1 / (100 * 1000)

function OcadSource(options) {
  XYZSource.call(this, {
    opaque: false,
    projection: options.projection,
    tileGrid: options.tileGrid,
    wrapX: options.wrapX !== undefined ? options.wrapX : true,
  })

  this.ocadFile_ = options.ocadFile
  this.index_ = new Flatbush(this.ocadFile_.objects.length)

  const crs = this.ocadFile_.getCrs()
  for (const o of this.ocadFile_.objects) {
    let minX = Number.MAX_VALUE
    let minY = Number.MAX_VALUE
    let maxX = -Number.MAX_VALUE
    let maxY = -Number.MAX_VALUE

    for (const [x, y] of o.coordinates) {
      minX = Math.min(x, minX)
      minY = Math.min(y, minY)
      maxX = Math.max(x, maxX)
      maxY = Math.max(y, maxY)
    }
    this.index_.add(minX, minY, maxX, maxY)
  }

  this.index_.finish()
}

ol.inherits(OcadSource, XYZSource)

function getKeyZXY(z, x, y) {
  return `${z}/${x}/${y}`
}

OcadSource.prototype.getTile = function (z, x, y) {
  const tileCoordKey = getKeyZXY(z, x, y)
  if (this.tileCache.containsKey(tileCoordKey)) {
    return this.tileCache.get(tileCoordKey)
  } else {
    const crs = this.ocadFile_.getCrs()
    const tileGrid = this.getTileGrid()
    const resolution = tileGrid.getResolution(z)
    const tileSize = olSize.toSize(this.tileGrid.getTileSize(z))
    const tileCoord = [z, x, y]
    const extent = tileGrid.getTileCoordExtent(tileCoord)
    extent[0] = (extent[0] - crs.easting) / crs.scale / hundredsMmToMeter
    extent[1] = (extent[1] - crs.northing) / crs.scale / hundredsMmToMeter
    extent[2] = (extent[2] - crs.easting) / crs.scale / hundredsMmToMeter
    extent[3] = (extent[3] - crs.northing) / crs.scale / hundredsMmToMeter
    const objects = this.index_
      .search(extent[0], extent[1], extent[2], extent[3])
      .map(i => this.ocadFile_.objects[i])
    const svg = ocadToSvg(this.ocadFile_, { objects })

    const mapGroup = svg.querySelector('g')
    svg.setAttribute('width', tileSize[0])
    svg.setAttribute('height', tileSize[1])
    const transform = `scale(${
      (hundredsMmToMeter * crs.scale) / resolution
    }) translate(${-extent[0]}, ${extent[3]})`
    mapGroup.setAttribute('transform', transform)

    const tile = new OcadTile(tileCoord, tileSize, svg)
    this.tileCache.set(tileCoordKey, tile)

    return tile
  }
}

function OcadTile(tileCoord, tileSize, svg) {
  ImageTile.call(this, tileCoord, TileState.LOADING)

  this.tileSize_ = tileSize
  this.renderSvg(svg)
}

ol.inherits(OcadTile, ImageTile)

OcadTile.prototype.getImage = function () {
  return this.image_
}

OcadTile.prototype.renderSvg = function (svg) {
  const image = new Image()
  const xml = new XMLSerializer().serializeToString(svg)
  const blobUrl = `data:image/svg+xml;base64,${btoa(xml)}`
  image.onload = () => {
    this.image_ = image
    this.setState(TileState.LOADED)
  }
  image.onerror = err => {
    console.error(err)
    this.setState(TileState.ERROR)
  }
  image.src = blobUrl
}
