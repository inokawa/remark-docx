[**API**](../../API.md)

***

# Interface: ImageOptions

Defined in: [src/mdast-util-to-docx.ts:70](https://github.com/inokawa/remark-docx/blob/5c16511c356dbeca44eade6652cad52ca3117d4c/src/mdast-util-to-docx.ts#L70)

## Properties

### load?

> `optional` **load?**: `LoadFn`

Defined in: [src/mdast-util-to-docx.ts:75](https://github.com/inokawa/remark-docx/blob/5c16511c356dbeca44eade6652cad52ca3117d4c/src/mdast-util-to-docx.ts#L75)

A function to resolve image data from url. `file` is the processed file, which can be used to resolve relative urls.

#### Default

loadWithFetch

***

### toPng?

> `optional` **toPng?**: [`ToPngFn`](../type-aliases/ToPngFn.md)

Defined in: [src/mdast-util-to-docx.ts:81](https://github.com/inokawa/remark-docx/blob/5c16511c356dbeca44eade6652cad52ca3117d4c/src/mdast-util-to-docx.ts#L81)

A function to convert images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG and WebP.
SVG is embedded with the PNG as fallback, because Word requires it. Others are embedded as PNG.
On browser, you can use [browserToPng](../variables/browserToPng.md).
