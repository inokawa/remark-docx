[**API**](../../API.md)

***

# Interface: ImageOptions

Defined in: [src/mdast-util-to-docx.ts:233](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L233)

## Properties

### load?

> `optional` **load?**: `LoadFn`

Defined in: [src/mdast-util-to-docx.ts:238](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L238)

A function to resolve image data from url. `file` is the processed file, which can be used to resolve relative urls.

#### Default

loadWithFetch

***

### toPng?

> `optional` **toPng?**: [`ToPngFn`](../type-aliases/ToPngFn.md)

Defined in: [src/mdast-util-to-docx.ts:244](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L244)

A function to convert images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG and WebP.
SVG is embedded with the PNG as fallback, because Word requires it. Others are embedded as PNG.
On browser, you can use [browserToPng](../variables/browserToPng.md).
