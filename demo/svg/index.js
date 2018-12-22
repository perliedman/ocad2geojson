const { readOcad, ocadToSvg } = require('../../')
const toBuffer = require('blob-to-buffer')



fetch('example.ocd')
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => toBuffer(blob, (err, buffer) => {
    if (err) reject(err)
    resolve(buffer)
  })))
  .then(buffer => readOcad(buffer))
  .then(ocadFile => ocadToSvg(ocadFile))
  .then(svg => {
    svg.setAttribute('transform', 'scale(0.04) translate(14000, 16000)')
    document.getElementById('container').appendChild(svg)
  })
