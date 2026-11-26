[**API**](../../API.md)

***

# Interface: ImageOptions

Defined in: [src/mdast-util-to-docx.ts:69](https://github.com/inokawa/remark-docx/blob/abed5b556b3c26039b9a2e778adb93b4f8e72c17/src/mdast-util-to-docx.ts#L69)

## Properties

### load?

> `optional` **load?**: `LoadFn`

Defined in: [src/mdast-util-to-docx.ts:74](https://github.com/inokawa/remark-docx/blob/abed5b556b3c26039b9a2e778adb93b4f8e72c17/src/mdast-util-to-docx.ts#L74)

A function to resolve image data from url. `file` is the processed file, which can be used to resolve relative urls.

#### Default

loadWithFetch

***

### toPng?

> `optional` **toPng?**: [`ToPngFn`](../type-aliases/ToPngFn.md)

Defined in: [src/mdast-util-to-docx.ts:80](https://github.com/inokawa/remark-docx/blob/abed5b556b3c26039b9a2e778adb93b4f8e72c17/src/mdast-util-to-docx.ts#L80)

A function to convert images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG and WebP.
SVG is embedded with the PNG as fallback, because Word requires it. Others are embedded as PNG.
On browser, you can use [browserToPng](../variables/browserToPng.md).
