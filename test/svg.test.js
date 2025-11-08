/**
 * @typedef {import('../node_modules/ava/types/test-fn').ExecutionContext} ExecutionContext
 */
const path = require('path')
/** @type {import('ava').default} */
const test = require('ava')
const { readOcad, ocadToSvg } = require('..')

const { readdirSync, existsSync } = require('fs')
const xmldom = require('xmldom')
const { default: kinks } = require('@turf/kinks')
const DOMImplementation = new xmldom.DOMImplementation()

test('can convert to SVG', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  const svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
  })

  t.is('svg', /** @type {Element} */ (svgDoc).tagName)
  const defs = svgDoc.firstChild
  if (!defs || defs.nodeType !== 1) t.fail('Expected defs element')
  else {
    const defsEl = /** @type {Element} */ (defs)
    t.is('defs', defsEl.tagName)
    t.is(2, defsEl.childNodes.length)
    t.truthy(
      Array.from(defsEl.childNodes)
        .filter(n => n.nodeType === 1)
        .every(x => /** @type {Element} */ (x).tagName === 'pattern')
    )
  }
  const mainGroupNode = svgDoc.childNodes[1]
  if (!mainGroupNode || mainGroupNode.nodeType !== 1)
    t.fail('Expected main group element')
  else {
    const mainGroup = /** @type {Element} */ (mainGroupNode)
    t.is('g', mainGroup.tagName)
    const children = mainGroup.childNodes
    t.is(4, children.length)
    t.is('path', /** @type {Element} */ (children[0]).tagName)
    t.is('path', /** @type {Element} */ (children[1]).tagName)
    t.is('path', /** @type {Element} */ (children[2]).tagName)
    t.is('path', /** @type {Element} */ (children[3]).tagName)
  }
})

test('SVG can filter colors', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'basic-1.ocd'))
  let svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
    fromColor: 0,
    toColor: 1,
  })
  let mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)
  t.is(0, mainGroup.childNodes.length)

  svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
    fromColor: 0,
    toColor: 2,
  })
  mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)
  t.is(3, mainGroup.childNodes.length)

  svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
    fromColor: 2,
    toColor: 4,
  })
  mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)
  t.is(3, mainGroup.childNodes.length)

  svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
    fromColor: 3,
    toColor: 5,
  })
  mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)
  t.is(0, mainGroup.childNodes.length)

  svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
    fromColor: 2,
    toColor: 6,
  })
  mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)
  t.is(4, mainGroup.childNodes.length)
})

test('renders double line correctly', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'double-line.ocd'))
  const svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
  })

  t.is('svg', /** @type {Element} */ (svgDoc).tagName)
  const mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)

  // Should render exactly 3 paths for the double line with fill
  const paths = Array.from(mainGroup.childNodes)
    .filter(n => n.nodeType === 1)
    .map(n => /** @type {Element} */ (n))
    .filter(n => n.tagName === 'path')
  t.is(3, paths.length, 'Should render exactly 3 paths')

  // Extract stroke widths and colors from the style attributes
  const pathStyles = paths.map(p => {
    const style = p.getAttribute('style') || ''
    const widthMatch = style.match(/stroke-width:\s*(\d+)/)
    const colorMatch = style.match(/stroke:\s*rgb\(([^)]+)\)/)
    return {
      width: widthMatch ? parseInt(widthMatch[1]) : null,
      color: colorMatch ? colorMatch[1] : null,
    }
  })

  // Verify the three paths have the expected structure:
  // 1. Outer border (width 78, color 44, 46, 53 = dblLeftColor)
  // 2. Main line (width 64, color 242, 178, 127 = lineColor)
  // 3. Inner fill (width 50, color 242, 178, 127 = dblFillColor)

  t.truthy(pathStyles[0].width != null && pathStyles[0].color != null)
  const w0 = /** @type {number} */ (pathStyles[0].width)
  const c0 = /** @type {string} */ (pathStyles[0].color)
  t.is(64, w0, 'Main line should have width 64')
  t.is('242, 178, 127', c0, 'Main line should be color 242, 178, 127')

  t.truthy(pathStyles[1].width != null && pathStyles[1].color != null)
  const w1 = /** @type {number} */ (pathStyles[1].width)
  const c1 = /** @type {string} */ (pathStyles[1].color)
  t.is(78, w1, 'Outer border should have width 78')
  t.true(c1 === '44, 46, 53', 'First path should be border')

  t.truthy(pathStyles[2].width != null && pathStyles[2].color != null)
  const w2 = /** @type {number} */ (pathStyles[2].width)
  const c2 = /** @type {string} */ (pathStyles[2].color)
  t.is(50, w2, 'Inner fill should have width 50')
  t.is('242, 178, 127', c2, 'Inner fill should be color 242, 178, 127')
})

test('jarnvag: renders patterned dashed double line correctly', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(path.join(__dirname, 'data', 'jarnvag.ocd'))
  const svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
  })

  // Root svg element presence
  t.is('svg', /** @type {Element} */ (svgDoc).tagName)
  const mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)

  // Collect path elements
  const paths = Array.from(mainGroup.childNodes)
    .filter(n => n.nodeType === 1)
    .map(n => /** @type {Element} */ (n))
    .filter(n => n.tagName === 'path')

  // We expect four path elements: two dark outer strokes, two white dashed inner strokes
  t.is(4, paths.length, 'Expected four path elements')

  // Helper to parse style into key/value map
  /**
   * @param {string} style
   * @returns {Record<string,string>}
   */
  const parseStyle = style => {
    return Object.fromEntries(
      style
        .split(';')
        .map((s /** @type {string} */) => s.trim())
        .filter(Boolean)
        .map(part => {
          const [k, v] = part.split(':').map(x => x.trim())
          return [k, v]
        })
    )
  }

  const styleInfos = paths.map(p => parseStyle(p.getAttribute('style') || ''))

  // Extract matching groups
  const darkStrokes = styleInfos.filter(s => s.stroke === 'rgb(44, 46, 53)')
  const whiteStrokes = styleInfos.filter(s => s.stroke === 'rgb(255, 255, 255)')

  t.is(2, darkStrokes.length, 'Should have two dark border strokes')
  t.is(2, whiteStrokes.length, 'Should have two white dashed strokes')

  // Verify stroke widths
  darkStrokes.forEach(s => t.is('45', s['stroke-width']))
  whiteStrokes.forEach(s => t.is('25', s['stroke-width']))

  // Verify dashed pattern exists only on white strokes
  darkStrokes.forEach(s => t.falsy(s['stroke-dasharray']))
  whiteStrokes.forEach(s => t.is('100 150', s['stroke-dasharray']))

  // Verify line join & cap for all
  styleInfos.forEach(s => {
    t.is('bevel', s['stroke-linejoin'])
    t.is('butt', s['stroke-linecap'])
  })
})

test('renders house with offset outline without kinks', async (/** @type {ExecutionContext} */ t) => {
  const map = await readOcad(
    path.join(__dirname, 'data', 'myggfritt_byggnad2.ocd')
  )
  const svgDoc = ocadToSvg(map, {
    document: DOMImplementation.createDocument(null, 'xml', null),
  })
  const mainGroup = /** @type {Element} */ (svgDoc.childNodes[1])
  t.is('g', mainGroup.tagName)

  const paths = Array.from(mainGroup.childNodes)
    .filter(n => n.nodeType === 1)
    .map(n => /** @type {Element} */ (n))
    .filter(n => n.tagName === 'path')

  for (const path of paths) {
    const pathStr = path.getAttribute('d') || ''
    const coordMatches = pathStr.matchAll(/(\w) ([-\d.]+ [-\d.]+)/g)
    /** @type {number[][]} */
    let currentRing = []
    const rings = []
    for (const coordMatch of coordMatches) {
      const c = coordMatch[2].split(' ').map(Number)
      if (coordMatch[1] === 'M') {
        currentRing = [c]
        rings.push(currentRing)
      } else {
        currentRing.push(c)
      }
    }
    /** @type {import('geojson').Polygon} */
    const geometry = { type: 'Polygon', coordinates: rings }
    const pathKinks = kinks(geometry)
    t.is(0, pathKinks.features.length)
  }
})

test('can open all local test maps', async (/** @type {ExecutionContext} */ t) => {
  const localDir = path.join(__dirname, 'data', 'local')
  if (!existsSync(localDir)) {
    console.warn('No local test maps found in ', localDir)
    t.pass()
    return
  }
  const files = readdirSync(localDir).filter(f => f.endsWith('.ocd'))
  for (const file of files) {
    try {
      const ocadFile = await readOcad(path.join(localDir, file))
      t.truthy(ocadFile)
      t.truthy(
        ocadToSvg(ocadFile, {
          document: DOMImplementation.createDocument(null, 'xml', null),
        })
      )
    } catch (e) {
      console.error(`Failed to read ${file}: ${e}`)
      throw e
    }
  }
})
