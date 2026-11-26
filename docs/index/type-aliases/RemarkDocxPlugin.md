[**API**](../../API.md)

***

# Type Alias: RemarkDocxPlugin

> **RemarkDocxPlugin** = (`ctx`) => `Promise`\<`NodeBuilders`\>

Defined in: [src/types.ts:91](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/types.ts#L91)

## Parameters

### ctx

`Readonly`\<\{ `root`: `mdast.Root`; `images`: `Map`\<`string`, `DocxImageData` \| `null`\>; `readImage`: (`data`, `name`) => `Promise`\<`DocxImageData` \| `undefined`\>; \}\>

## Returns

`Promise`\<`NodeBuilders`\>
