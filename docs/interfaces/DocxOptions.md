[**API**](../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-to-docx.ts:199](https://github.com/inokawa/remark-docx/blob/ed6c3b47c8e1e9d6d9d104ece07715dae1dca83f/src/mdast-to-docx.ts#L199)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"lastModifiedBy"` \| `"revision"` \| `"styles"` \| `"background"`\>

## Properties

### output?

> `optional` **output**: `"buffer"` \| `"arrayBuffer"` \| `"blob"`

Defined in: [src/mdast-to-docx.ts:215](https://github.com/inokawa/remark-docx/blob/ed6c3b47c8e1e9d6d9d104ece07715dae1dca83f/src/mdast-to-docx.ts#L215)

Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `arrayBuffer` is `Promise<ArrayBuffer>`. `blob` is `Promise<Blob>`.

***

### imageResolver?

> `optional` **imageResolver**: `ImageResolver`

Defined in: [src/mdast-to-docx.ts:219](https://github.com/inokawa/remark-docx/blob/ed6c3b47c8e1e9d6d9d104ece07715dae1dca83f/src/mdast-to-docx.ts#L219)

**You must set** if your markdown includes images. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts).

***

### title?

> `readonly` `optional` **title**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:1415

#### Inherited from

`Pick.title`

***

### subject?

> `readonly` `optional` **subject**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:1416

#### Inherited from

`Pick.subject`

***

### creator?

> `readonly` `optional` **creator**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:1417

#### Inherited from

`Pick.creator`

***

### keywords?

> `readonly` `optional` **keywords**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:1418

#### Inherited from

`Pick.keywords`

***

### description?

> `readonly` `optional` **description**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:1419

#### Inherited from

`Pick.description`

***

### lastModifiedBy?

> `readonly` `optional` **lastModifiedBy**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:1420

#### Inherited from

`Pick.lastModifiedBy`

***

### revision?

> `readonly` `optional` **revision**: `number`

Defined in: node\_modules/docx/dist/index.d.ts:1421

#### Inherited from

`Pick.revision`

***

### styles?

> `readonly` `optional` **styles**: `IStylesOptions`

Defined in: node\_modules/docx/dist/index.d.ts:1423

#### Inherited from

`Pick.styles`

***

### background?

> `readonly` `optional` **background**: `IDocumentBackgroundOptions`

Defined in: node\_modules/docx/dist/index.d.ts:1429

#### Inherited from

`Pick.background`
