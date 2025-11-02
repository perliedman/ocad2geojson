/**
 * @typedef {import('../node_modules/ava/types/test-fn').ExecutionContext} ExecutionContext
 */
const path = require('path')
/** @type {import('ava').default} */
const test = require('ava')
const { readOcad, ocadToSvg } = require('..')

const { readdirSync, existsSync } = require('fs')
const xmldom = require('xmldom')
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
