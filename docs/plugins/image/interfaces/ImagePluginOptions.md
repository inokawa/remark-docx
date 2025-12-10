[**API**](../../../API.md)

***

# Interface: ImagePluginOptions

Defined in: [src/plugins/image/index.ts:104](https://github.com/inokawa/remark-docx/blob/90dfb62d1764cf80fa6425379d82fc9c21ddbc04/src/plugins/image/index.ts#L104)

## Properties

### load?

> `optional` **load**: `LoadFn`

Defined in: [src/plugins/image/index.ts:109](https://github.com/inokawa/remark-docx/blob/90dfb62d1764cf80fa6425379d82fc9c21ddbc04/src/plugins/image/index.ts#L109)

A function to resolve image data from url.

#### Default

loadWithFetch

***

### fallbackSvg?

> `optional` **fallbackSvg**: `SvgToPngFn`

Defined in: [src/plugins/image/index.ts:114](https://github.com/inokawa/remark-docx/blob/90dfb62d1764cf80fa6425379d82fc9c21ddbc04/src/plugins/image/index.ts#L114)

A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.

#### Default

browserSvgToPng, which handles conversion only on browser
