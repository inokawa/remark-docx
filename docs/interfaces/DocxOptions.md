[**API**](../API.md)

***

# Interface: DocxOptions

Defined in: [src/transformer.ts:124](https://github.com/inokawa/remark-docx/blob/020caed5daac73edb3764fa82eba18e03f68d466/src/transformer.ts#L124)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"lastModifiedBy"` \| `"revision"` \| `"styles"` \| `"background"`\>

## Properties

### output?

> `optional` **output**: `"buffer"` \| `"blob"`

Defined in: [src/transformer.ts:140](https://github.com/inokawa/remark-docx/blob/020caed5daac73edb3764fa82eba18e03f68d466/src/transformer.ts#L140)

Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `blob` is `Promise<Blob>`.

***

### imageResolver?

> `optional` **imageResolver**: `ImageResolver`

Defined in: [src/transformer.ts:144](https://github.com/inokawa/remark-docx/blob/020caed5daac73edb3764fa82eba18e03f68d466/src/transformer.ts#L144)

**You must set** if your markdown includes images. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts).

***

### title?

> `readonly` `optional` **title**: `string`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:12

#### Inherited from

`Pick.title`

***

### subject?

> `readonly` `optional` **subject**: `string`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:13

#### Inherited from

`Pick.subject`

***

### creator?

> `readonly` `optional` **creator**: `string`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:14

#### Inherited from

`Pick.creator`

***

### keywords?

> `readonly` `optional` **keywords**: `string`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:15

#### Inherited from

`Pick.keywords`

***

### description?

> `readonly` `optional` **description**: `string`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:16

#### Inherited from

`Pick.description`

***

### lastModifiedBy?

> `readonly` `optional` **lastModifiedBy**: `string`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:17

#### Inherited from

`Pick.lastModifiedBy`

***

### revision?

> `readonly` `optional` **revision**: `number`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:18

#### Inherited from

`Pick.revision`

***

### styles?

> `readonly` `optional` **styles**: `IStylesOptions`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:20

#### Inherited from

`Pick.styles`

***

### background?

> `readonly` `optional` **background**: `IDocumentBackgroundOptions`

Defined in: node\_modules/docx/build/file/core-properties/properties.d.ts:28

#### Inherited from

`Pick.background`
