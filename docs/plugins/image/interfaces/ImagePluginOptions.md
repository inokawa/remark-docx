[**API**](../../../API.md)

***

# Interface: ImagePluginOptions

Defined in: [src/plugins/image/index.ts:108](https://github.com/inokawa/remark-docx/blob/6d3f3952ce686908f92e5b18859e84c2edf90c88/src/plugins/image/index.ts#L108)

## Properties

### load?

> `optional` **load**: `LoadFn`

Defined in: [src/plugins/image/index.ts:113](https://github.com/inokawa/remark-docx/blob/6d3f3952ce686908f92e5b18859e84c2edf90c88/src/plugins/image/index.ts#L113)

A function to resolve image data from url.

#### Default

loadWithFetch

***

### fallbackSvg?

> `optional` **fallbackSvg**: `SvgToPngFn`

Defined in: [src/plugins/image/index.ts:118](https://github.com/inokawa/remark-docx/blob/6d3f3952ce686908f92e5b18859e84c2edf90c88/src/plugins/image/index.ts#L118)

A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.

#### Default

browserSvgToPng, which handles conversion only on browser
