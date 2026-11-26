[**API**](../../../API.md)

***

# Interface: CodeToImagePluginOptions

Defined in: [src/plugins/code-to-image/index.ts:9](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/plugins/code-to-image/index.ts#L9)

## Properties

### render

> **render**: (`node`) => `ImageSource` \| `Promise`\<ImageSource \| null \| undefined\> \| `null` \| `undefined`

Defined in: [src/plugins/code-to-image/index.ts:15](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/plugins/code-to-image/index.ts#L15)

A function to render a "code" node to image data, such as PNG and SVG.
Images other than PNG, JPEG, GIF and BMP are converted with `toPng` of `image` option, like images in the document.
Return `null` to leave the node to other plugins, for example when its language is not the target.

#### Parameters

##### node

`Code`

#### Returns

`ImageSource` \| `Promise`\<ImageSource \| null \| undefined\> \| `null` \| `undefined`
