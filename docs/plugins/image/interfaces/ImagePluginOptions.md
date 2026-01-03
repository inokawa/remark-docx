[**API**](../../../API.md)

***

# Interface: ImagePluginOptions

Defined in: [src/plugins/image/index.ts:56](https://github.com/inokawa/remark-docx/blob/dbe6d8c473599ded70a066ebd74d9d146ff16fd9/src/plugins/image/index.ts#L56)

## Properties

### load?

> `optional` **load**: `LoadFn`

Defined in: [src/plugins/image/index.ts:61](https://github.com/inokawa/remark-docx/blob/dbe6d8c473599ded70a066ebd74d9d146ff16fd9/src/plugins/image/index.ts#L61)

A function to resolve image data from url.

#### Default

loadWithFetch

***

### fallbackSvg?

> `optional` **fallbackSvg**: `SvgToPngFn`

Defined in: [src/plugins/image/index.ts:66](https://github.com/inokawa/remark-docx/blob/dbe6d8c473599ded70a066ebd74d9d146ff16fd9/src/plugins/image/index.ts#L66)

A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.

#### Default

browserSvgToPng, which handles conversion only on browser
