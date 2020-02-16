const { readOcad, ocadToSvg } = require('../../')
const toBuffer = require('blob-to-buffer')
const PDFDocument = require('pdfkit')
const SVGtoPDF = require('svg-to-pdfkit')
const blobStream = require('blob-stream')

fetch('example.ocd')
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => toBuffer(blob, (err, buffer) => {
    if (err) reject(err)
    resolve(buffer)
  })))
  .then(buffer => readOcad(buffer))
  .then(ocadFile => {
    const svg = ocadToSvg(ocadFile)
    const container = document.getElementById('svg-container')
    // width / height corresponds to A4 paper
    svg.setAttribute('width', '595')
    svg.setAttribute('height', '842')
    svg.querySelector('g').setAttribute('transform', 'scale(0.14) translate(2400, 9200)')
    container.appendChild(svg)

    const doc = new PDFDocument()
    stream = doc.pipe(blobStream())
    SVGtoPDF(doc, svg, 0, 0, {
      assumePt: true,
      colorCallback: x => {
        const color = x && ocadFile.colors.find(c => c && c.rgbArray[0] === x[0][0] && c.rgbArray[1] === x[0][1] && c.rgbArray[2] === x[0][2])
        return color && color.cmyk && [color.cmyk, x[1]] || x
      }
    })

    doc.end()
    stream.on('finish', () => {
      // const blob = stream.toBlob('application/pdf')
      url = stream.toBlobURL('application/pdf')
      document.getElementById('pdf-frame').src = url
    })
  })
