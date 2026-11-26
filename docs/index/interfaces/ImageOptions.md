[**API**](../../API.md)

***

# Interface: ImageOptions

Defined in: [src/mdast-util-to-docx.ts:68](https://github.com/inokawa/remark-docx/blob/094196e1ab168f7f234724d260523184b2a88bd7/src/mdast-util-to-docx.ts#L68)

## Properties

### load?

> `optional` **load?**: `LoadFn`

Defined in: [src/mdast-util-to-docx.ts:73](https://github.com/inokawa/remark-docx/blob/094196e1ab168f7f234724d260523184b2a88bd7/src/mdast-util-to-docx.ts#L73)

A function to resolve image data from url. `file` is the processed file, which can be used to resolve relative urls.

#### Default

loadWithFetch

***

### toPng?

> `optional` **toPng?**: [`ToPngFn`](../type-aliases/ToPngFn.md)

Defined in: [src/mdast-util-to-docx.ts:79](https://github.com/inokawa/remark-docx/blob/094196e1ab168f7f234724d260523184b2a88bd7/src/mdast-util-to-docx.ts#L79)

A function to convert images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG and WebP.
SVG is embedded with the PNG as fallback, because Word requires it. Others are embedded as PNG.
On browser, you can use [browserToPng](../variables/browserToPng.md).
