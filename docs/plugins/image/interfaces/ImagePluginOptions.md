[**API**](../../../API.md)

***

# Interface: ImagePluginOptions

Defined in: [src/plugins/image/index.ts:118](https://github.com/inokawa/remark-docx/blob/af0a1bf4d0ff4192c71f226d015f416f8a35afe9/src/plugins/image/index.ts#L118)

## Properties

### load?

> `optional` **load**: `LoadFn`

Defined in: [src/plugins/image/index.ts:123](https://github.com/inokawa/remark-docx/blob/af0a1bf4d0ff4192c71f226d015f416f8a35afe9/src/plugins/image/index.ts#L123)

A function to resolve image data from url.

#### Default

loadWithFetch

***

### fallbackSvg?

> `optional` **fallbackSvg**: `SvgToPngFn`

Defined in: [src/plugins/image/index.ts:128](https://github.com/inokawa/remark-docx/blob/af0a1bf4d0ff4192c71f226d015f416f8a35afe9/src/plugins/image/index.ts#L128)

A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.

#### Default

browserSvgToPng, which handles conversion only on browser
