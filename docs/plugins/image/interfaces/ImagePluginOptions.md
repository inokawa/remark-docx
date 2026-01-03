[**API**](../../../API.md)

***

# Interface: ImagePluginOptions

Defined in: [src/plugins/image/index.ts:60](https://github.com/inokawa/remark-docx/blob/7af433469f4246f0e13c6b3b2d40b84089f854cc/src/plugins/image/index.ts#L60)

## Properties

### load?

> `optional` **load**: `LoadFn`

Defined in: [src/plugins/image/index.ts:65](https://github.com/inokawa/remark-docx/blob/7af433469f4246f0e13c6b3b2d40b84089f854cc/src/plugins/image/index.ts#L65)

A function to resolve image data from url.

#### Default

loadWithFetch

***

### fallbackSvg?

> `optional` **fallbackSvg**: `SvgToPngFn`

Defined in: [src/plugins/image/index.ts:70](https://github.com/inokawa/remark-docx/blob/7af433469f4246f0e13c6b3b2d40b84089f854cc/src/plugins/image/index.ts#L70)

A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.

#### Default

browserSvgToPng, which handles conversion only on browser
