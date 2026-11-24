[**API**](../../API.md)

***

# Interface: ImageOptions

Defined in: [src/mdast-util-to-docx.ts:235](https://github.com/inokawa/remark-docx/blob/3e43711c62b7e099eee74bf0405f50515237f051/src/mdast-util-to-docx.ts#L235)

## Properties

### load?

> `optional` **load?**: `LoadFn`

Defined in: [src/mdast-util-to-docx.ts:240](https://github.com/inokawa/remark-docx/blob/3e43711c62b7e099eee74bf0405f50515237f051/src/mdast-util-to-docx.ts#L240)

A function to resolve image data from url. `file` is the processed file, which can be used to resolve relative urls.

#### Default

loadWithFetch

***

### toPng?

> `optional` **toPng?**: [`ToPngFn`](../type-aliases/ToPngFn.md)

Defined in: [src/mdast-util-to-docx.ts:246](https://github.com/inokawa/remark-docx/blob/3e43711c62b7e099eee74bf0405f50515237f051/src/mdast-util-to-docx.ts#L246)

A function to convert images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG and WebP.
SVG is embedded with the PNG as fallback, because Word requires it. Others are embedded as PNG.
On browser, you can use [browserToPng](../variables/browserToPng.md).
