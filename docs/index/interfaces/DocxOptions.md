[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:147](https://github.com/inokawa/remark-docx/blob/e4359d9d7c6bc092791506a230cc319d29a84325/src/mdast-util-to-docx.ts#L147)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size**: `object`

Defined in: [src/mdast-util-to-docx.ts:161](https://github.com/inokawa/remark-docx/blob/e4359d9d7c6bc092791506a230cc319d29a84325/src/mdast-util-to-docx.ts#L161)

Page size defined in twip (1 twip == 1/1440 inch).

#### width?

> `optional` **width**: `number`

#### height?

> `optional` **height**: `number`

#### Default

A4 (sectionPageSizeDefaults)

***

### margin?

> `optional` **margin**: `object`

Defined in: [src/mdast-util-to-docx.ts:166](https://github.com/inokawa/remark-docx/blob/e4359d9d7c6bc092791506a230cc319d29a84325/src/mdast-util-to-docx.ts#L166)

Page margin defined in twip (1 twip == 1/1440 inch).

#### top?

> `optional` **top**: `number`

#### left?

> `optional` **left**: `number`

#### bottom?

> `optional` **bottom**: `number`

#### right?

> `optional` **right**: `number`

#### Default

1 inch (sectionMarginDefaults)

***

### orderedListFormat?

> `optional` **orderedListFormat**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:171](https://github.com/inokawa/remark-docx/blob/e4359d9d7c6bc092791506a230cc319d29a84325/src/mdast-util-to-docx.ts#L171)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

***

### thematicBreak?

> `optional` **thematicBreak**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:176](https://github.com/inokawa/remark-docx/blob/e4359d9d7c6bc092791506a230cc319d29a84325/src/mdast-util-to-docx.ts#L176)

An option to select how thematicBreak works. "page" is Page Break. "section" is Section Break.

#### Default

```ts
"page"
```

***

### plugins?

> `optional` **plugins**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:180](https://github.com/inokawa/remark-docx/blob/e4359d9d7c6bc092791506a230cc319d29a84325/src/mdast-util-to-docx.ts#L180)

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
