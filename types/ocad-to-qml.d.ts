declare namespace _exports {
    export { NodeDef };
}
declare function _exports(ocadFile: any, options: any): import("./mini-dom").Element;
export = _exports;
/**
 * //  *
 */
type NodeDef = {
    /**
     * //  *
     */
    id?: string | undefined;
    /**
     * //  *
     */
    type: string;
    /**
     * //  *
     */
    attrs?: Record<string, string | number> | undefined;
    children?: NodeDef[] | undefined;
};
