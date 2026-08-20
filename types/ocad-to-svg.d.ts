declare namespace _exports {
    export { SvgNodeDef };
}
declare namespace _exports {
    export function ocadToSvg(ocadFile: import("./ocad-reader/ocad-file"), options: any): import("./mini-dom").Element | import("./mini-dom").TextNode;
    export { patternToSvg };
    export { createSvgNode };
}
export = _exports;
type SvgNodeDef = {
    type: string;
    text?: string | undefined;
    id?: string | undefined;
    order?: number | undefined;
    attrs?: Record<string, string> | undefined;
    children?: SvgNodeDef[] | undefined;
};
declare function patternToSvg(colors: any, s: any): ({
    id: string;
    'data-symbol-name': any;
    type: string;
    attrs: {
        patternUnits: string;
        patternTransform: string;
        width: number;
        height: any;
    };
    children: {
        type: string;
        attrs: {
            x: number;
            y: number;
            width: number;
            height: any;
            fill: any;
        };
    }[];
} | {
    id: string;
    'data-symbol-name': any;
    type: string;
    attrs: {
        patternUnits: string;
        patternTransform: string;
        width: any;
        height: number;
    };
    children: any;
})[];
/**
 * @typedef {object} SvgNodeDef
 * @property {string} type
 * @property {string=} text
 * @property {string=} id
 * @property {number=} order
 * @property {Record<string, string>=} attrs
 * @property {SvgNodeDef[]=} children
 */
/**
 *
 * @param {import('./mini-dom').Document} document
 * @param {SvgNodeDef} n
 * @returns
 */
declare function createSvgNode(document: import("./mini-dom").Document, n: SvgNodeDef): import("./mini-dom").Element | import("./mini-dom").TextNode;
