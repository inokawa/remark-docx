[**API**](../../../API.md)

***

# Interface: CodeToImagePluginOptions

Defined in: [src/plugins/code-to-image/index.ts:9](https://github.com/inokawa/remark-docx/blob/094196e1ab168f7f234724d260523184b2a88bd7/src/plugins/code-to-image/index.ts#L9)

## Properties

### render

> **render**: (`node`) => `string` \| `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\> \| `Promise`\<`string` \| `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\> \| `null` \| `undefined`\> \| `null` \| `undefined`

Defined in: [src/plugins/code-to-image/index.ts:14](https://github.com/inokawa/remark-docx/blob/094196e1ab168f7f234724d260523184b2a88bd7/src/plugins/code-to-image/index.ts#L14)

A function to render a "code" node to an image. Returns SVG as string or image data such as PNG and JPEG.
Return `null` to leave the node to other plugins, for example when its language is not the target.

#### Parameters

##### node

`Code`

#### Returns

`string` \| `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\> \| `Promise`\<`string` \| `ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\> \| `null` \| `undefined`\> \| `null` \| `undefined`

***

### toPng?

> `optional` **toPng?**: [`ToPngFn`](../../../index/type-aliases/ToPngFn.md)

Defined in: [src/plugins/code-to-image/index.ts:27](https://github.com/inokawa/remark-docx/blob/094196e1ab168f7f234724d260523184b2a88bd7/src/plugins/code-to-image/index.ts#L27)

A function to convert rendered images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG.
On browser, you can use `browserToPng` of remark-docx.
