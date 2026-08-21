/*
 * This is an extremely crude DOM implementation with the sole purpose
 * of being able to serialize the documents produced by ocad-to-svg and ocad-to-qml
 * without relying on xmldom or other external libraries - when run in the browser,
 * its native DOM support will/should be used instead.
 *
 * Do not in any way assume this is a DOM implementation you can re-use for
 * anything else! :)
 */

class Document {
  /**
   * @type {Element?}
   */
  firstChild

  /**
   *
   * @param {string=} ns
   * @param {string=} rootTag
   */
  constructor(ns, rootTag) {
    if (rootTag) {
      this.firstChild = this.createElementNS(ns, rootTag)
    }
  }

  /**
   *
   * @param {string} tagName
   * @returns
   */
  createElement(tagName) {
    return new Element(tagName)
  }

  /**
   *
   * @param {string} namespace
   * @param {string} tagName
   * @returns {Element}
   */
  createElementNS(namespace, tagName) {
    const el = new Element(tagName)
    el.namespace = namespace
    el.attributes.xmlns = namespace
    return el
  }

  /**
   *
   * @param {string} content
   * @returns {TextNode}
   */
  createTextNode(content) {
    return new TextNode(content)
  }

  /**
   *
   * @param {string[]} serializer
   */
  serialize(serializer) {
    this.firstChild.serialize(serializer)
  }
}

class Node {
  nodeType = 0

  /**
   *
   * @param {string[]} serializer
   */
  serialize(serializer) {}

  /**
   *
   * @param {Node} node
   */
  appendChild(node) {
    throw new Error('Not supported')
  }
}

class TextNode extends Node {
  nodeType = 3

  /**
   *
   * @param {string} content
   */
  constructor(content) {
    super()
    this.content = content
  }

  /**
   *
   * @param {string[]} serializer
   */
  serialize(serializer) {
    serializer.push(escapeAttribute(this.content))
  }
}

class Element extends Node {
  nodeType = 1

  /**
   * @type {string?}
   */
  id

  /**
   * @type {string?}
   */
  namespace

  /**
   * @type {string}
   */
  tagName
  /**
   * @type {Record<string,string>}
   */
  attributes
  /**
   * @type {Node[]}
   */
  childNodes
  /**
   * @type {Node?}
   */
  firstChild

  /**
   *
   * @param {string} tagName
   */
  constructor(tagName) {
    super()
    this.tagName = tagName
    this.attributes = {}
    this.childNodes = []
  }

  /**
   *
   * @param {Node} node
   */
  appendChild(node) {
    if (
      node instanceof Element &&
      node.namespace &&
      node.namespace === this.namespace
    ) {
      delete node.attributes.xmlns
    }
    if (this.childNodes.length === 0) {
      this.firstChild = node
    }
    this.childNodes.push(node)
  }

  /**
   *
   * @param {string[]} serializer
   */
  serialize(serializer) {
    const attribs = Object.keys(this.attributes)
    const hasChildren = this.childNodes.length > 0
    const startTag = `<${this.tagName}${this.id ? ' ' + `id="${escapeAttribute(this.id)}"` : ''}${attribs.length > 0 ? ' ' + attribs.map(attrib => `${attrib}="${escapeAttribute(this.attributes[attrib])}"`).join(' ') : ''}${!hasChildren ? '/' : ''}>`
    serializer.push(startTag)
    this.childNodes.forEach(c => c.serialize(serializer))
    if (hasChildren) {
      serializer.push(`</${this.tagName}>`)
    }
  }

  /**
   *
   * @param {string} attr
   * @param {string} value
   */
  setAttribute(attr, value) {
    this.attributes[attr] = value
  }

  /**
   *
   * @param {string} ns
   * @param {string} attr
   * @param {string} value
   */
  setAttributeNS(ns, attr, value) {
    this.setAttribute(attr, value)
  }

  getAttribute(attr) {
    return this.attributes[attr]
  }
}

/**
 *
 * @param {string} value
 */
function escapeAttribute(value) {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r\n/g, '&#13;') /* Must be before the next replacement. */
    .replace(/[\r\n]/g, '&#13;')
}

class XMLSerializer {
  /**
   *
   * @param {Node} doc
   */
  serializeToString(doc) {
    /** @type {string[]} */
    const fragments = []
    doc.serialize(fragments)
    return fragments.join('')
  }
}

module.exports = {
  Document,
  XMLSerializer,
  Element,
  TextNode,
  Node,
}
