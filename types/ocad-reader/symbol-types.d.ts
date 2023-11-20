declare namespace _exports {
    export { PointSymbolType, LineSymbolType, AreaSymbolType, TextSymbolType, RectangleSymbolType, SymbolType };
}
declare namespace _exports {
    type PointSymbolType = 1;
    let PointSymbolType: number;
    type LineSymbolType = 2;
    let LineSymbolType: number;
    type AreaSymbolType = 3;
    let AreaSymbolType: number;
    type TextSymbolType = 4;
    let TextSymbolType: number;
    type RectangleSymbolType = 7;
    let RectangleSymbolType: number;
    let DblFillColorOn: number;
}
export = _exports;
type SymbolType = PointSymbolType | LineSymbolType | AreaSymbolType | TextSymbolType | RectangleSymbolType;
