[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:164](https://github.com/inokawa/remark-docx/blob/c9a70652456207aa404e894435515e6511ac224f/src/mdast-util-to-docx.ts#L164)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size**: `object`

Defined in: [src/mdast-util-to-docx.ts:178](https://github.com/inokawa/remark-docx/blob/c9a70652456207aa404e894435515e6511ac224f/src/mdast-util-to-docx.ts#L178)

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

Defined in: [src/mdast-util-to-docx.ts:183](https://github.com/inokawa/remark-docx/blob/c9a70652456207aa404e894435515e6511ac224f/src/mdast-util-to-docx.ts#L183)

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

Defined in: [src/mdast-util-to-docx.ts:189](https://github.com/inokawa/remark-docx/blob/c9a70652456207aa404e894435515e6511ac224f/src/mdast-util-to-docx.ts#L189)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

#### Default

defaultOrderedList

***

### thematicBreak?

> `optional` **thematicBreak**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:194](https://github.com/inokawa/remark-docx/blob/c9a70652456207aa404e894435515e6511ac224f/src/mdast-util-to-docx.ts#L194)

An option to select how thematicBreak works. "page" is Page Break. "section" is Section Break.

#### Default

```ts
"page"
```

***

### plugins?

> `optional` **plugins**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:198](https://github.com/inokawa/remark-docx/blob/c9a70652456207aa404e894435515e6511ac224f/src/mdast-util-to-docx.ts#L198)

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
