[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-to-docx.ts:187](https://github.com/inokawa/remark-docx/blob/90d5b14619e79d1e7b908199d361022715ee63fa/src/mdast-to-docx.ts#L187)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"lastModifiedBy"` \| `"revision"` \| `"styles"` \| `"background"`\>

## Properties

### plugins?

> `optional` **plugins**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-to-docx.ts:202](https://github.com/inokawa/remark-docx/blob/90d5b14619e79d1e7b908199d361022715ee63fa/src/mdast-to-docx.ts#L202)

Plugins to customize how mdast nodes are transformed.

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
