import { FeatureCollection } from 'geojson'
import { Buffer } from 'buffer'

declare module 'ocad2geojson'

export function readOcad(
  path: string | Buffer,
  options?: ReadOcadOptions
): OcadFile

export function ocadToGeoJson(
  ocadFile: OcadFile,
  options?: OcadToGeoJsonOptions
): FeatureCollection

export function ocadToSvg(ocadFile: OcadFile, options?: OcadToSvgOptions): any

export function ocadToMapboxGlStyle(
  ocadFile: OcadFile,
  options?: OcadToMapboxGlStyleOptions
): any

export function ocadToQml(ocadFile: OcadFile, options?: OcadToQmlOptions): any

export interface ReadOcadOptions {
  bypassVersionCheck: boolean
  quietWarnings: boolean
  failOnWarning: boolean
}

export interface OcadToGeoJsonOptions {
  assignIds: boolean
  applyCrs: boolean
  generateSymbolElements: boolean
  exportHidden: boolean
  coordinatePrecision: number
}

export interface OcadToSvgOptions {
  generateSymbolElements: boolean
  exportHidden: boolean
  fill: 'transparent'
}

export interface OcadFile {
  header: any
  colors: []
  objects: []
  parameterString: { [id: string]: {} }
  symbols: []
  warnings: []
}

export interface OcadToMapboxGlStyleOptions {
  scaleFactor: number
}

export interface OcadToQmlOptions {
  generateSymbolElements: boolean
  exportHidden: boolean
}
