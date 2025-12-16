[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:164](https://github.com/inokawa/remark-docx/blob/4a768649423164be1b6603c2c99793b2a24c097f/src/mdast-util-to-docx.ts#L164)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### orderedListFormat?

> `optional` **orderedListFormat**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:179](https://github.com/inokawa/remark-docx/blob/4a768649423164be1b6603c2c99793b2a24c097f/src/mdast-util-to-docx.ts#L179)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

#### Default

defaultOrderedList

***

### thematicBreak?

> `optional` **thematicBreak**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:184](https://github.com/inokawa/remark-docx/blob/4a768649423164be1b6603c2c99793b2a24c097f/src/mdast-util-to-docx.ts#L184)

An option to select how thematicBreak works. "page" is Page Break. "section" is Section Break.

#### Default

```ts
"page"
```

***

### plugins?

> `optional` **plugins**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:188](https://github.com/inokawa/remark-docx/blob/4a768649423164be1b6603c2c99793b2a24c097f/src/mdast-util-to-docx.ts#L188)

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
