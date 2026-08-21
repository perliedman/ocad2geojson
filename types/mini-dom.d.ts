export class Document {
    /**
     *
     * @param {string=} ns
     * @param {string=} rootTag
     */
    constructor(ns?: string | undefined, rootTag?: string | undefined);
    /**
     * @type {Element?}
     */
    firstChild: Element | null;
    /**
     *
     * @param {string} tagName
     * @returns
     */
    createElement(tagName: string): Element;
    /**
     *
     * @param {string} namespace
     * @param {string} tagName
     * @returns {Element}
     */
    createElementNS(namespace: string, tagName: string): Element;
    /**
     *
     * @param {string} content
     * @returns {TextNode}
     */
    createTextNode(content: string): TextNode;
    /**
     *
     * @param {string[]} serializer
     */
    serialize(serializer: string[]): void;
}
export class XMLSerializer {
    /**
     *
     * @param {Node} doc
     */
    serializeToString(doc: Node): string;
}
export class Element extends Node {
    /**
     *
     * @param {string} tagName
     */
    constructor(tagName: string);
    /**
     * @type {string?}
     */
    id: string | null;
    /**
     * @type {string?}
     */
    namespace: string | null;
    /**
     * @type {string}
     */
    tagName: string;
    /**
     * @type {Record<string,string>}
     */
    attributes: Record<string, string>;
    /**
     * @type {Node[]}
     */
    childNodes: Node[];
    /**
     * @type {Node?}
     */
    firstChild: Node | null;
    /**
     *
     * @param {string} attr
     * @param {string} value
     */
    setAttribute(attr: string, value: string): void;
    /**
     *
     * @param {string} ns
     * @param {string} attr
     * @param {string} value
     */
    setAttributeNS(ns: string, attr: string, value: string): void;
    getAttribute(attr: any): string;
}
export class TextNode extends Node {
    /**
     *
     * @param {string} content
     */
    constructor(content: string);
    content: string;
}
export class Node {
    nodeType: number;
    /**
     *
     * @param {string[]} serializer
     */
    serialize(serializer: string[]): void;
    /**
     *
     * @param {Node} node
     */
    appendChild(node: Node): void;
}
