[**API**](../../../API.md)

***

# Interface: ImagePluginOptions

Defined in: [src/plugins/image/index.ts:108](https://github.com/inokawa/remark-docx/blob/563658fe09ad9cdc75b51d00e8c82f453b72d12d/src/plugins/image/index.ts#L108)

## Properties

### load?

> `optional` **load**: `LoadFn`

Defined in: [src/plugins/image/index.ts:113](https://github.com/inokawa/remark-docx/blob/563658fe09ad9cdc75b51d00e8c82f453b72d12d/src/plugins/image/index.ts#L113)

A function to resolve image data from url.

#### Default

loadWithFetch

***

### fallbackSvg?

> `optional` **fallbackSvg**: `SvgToPngFn`

Defined in: [src/plugins/image/index.ts:118](https://github.com/inokawa/remark-docx/blob/563658fe09ad9cdc75b51d00e8c82f453b72d12d/src/plugins/image/index.ts#L118)

A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.

#### Default

browserSvgToPng, which handles conversion only on browser
