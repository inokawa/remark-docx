[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:166](https://github.com/inokawa/remark-docx/blob/af0a1bf4d0ff4192c71f226d015f416f8a35afe9/src/mdast-util-to-docx.ts#L166)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### orderedListFormat?

> `optional` **orderedListFormat**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:181](https://github.com/inokawa/remark-docx/blob/af0a1bf4d0ff4192c71f226d015f416f8a35afe9/src/mdast-util-to-docx.ts#L181)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

#### Default

defaultOrderedList

***

### plugins?

> `optional` **plugins**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:185](https://github.com/inokawa/remark-docx/blob/af0a1bf4d0ff4192c71f226d015f416f8a35afe9/src/mdast-util-to-docx.ts#L185)

Plugins to customize how mdast nodes are compiled.

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
