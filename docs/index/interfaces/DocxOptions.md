[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:361](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L361)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size?**: `object`

Defined in: [src/mdast-util-to-docx.ts:375](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L375)

Page size defined in twip (1 twip == 1/1440 inch).

#### width?

> `optional` **width?**: `number`

#### height?

> `optional` **height?**: `number`

#### Default

A4 (sectionPageSizeDefaults)

***

### margin?

> `optional` **margin?**: `object`

Defined in: [src/mdast-util-to-docx.ts:380](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L380)

Page margin defined in twip (1 twip == 1/1440 inch).

#### top?

> `optional` **top?**: `number`

#### left?

> `optional` **left?**: `number`

#### bottom?

> `optional` **bottom?**: `number`

#### right?

> `optional` **right?**: `number`

#### Default

1 inch (sectionMarginDefaults)

***

### orientation?

> `optional` **orientation?**: `"portrait"` \| `"landscape"`

Defined in: [src/mdast-util-to-docx.ts:385](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L385)

Page orientation.

#### Default

```ts
"portrait"
```

***

### columns?

> `optional` **columns?**: `number`

Defined in: [src/mdast-util-to-docx.ts:390](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L390)

Number of page columns.

#### Default

```ts
1
```

***

### spacing?

> `optional` **spacing?**: `number`

Defined in: [src/mdast-util-to-docx.ts:395](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L395)

Spacing after Paragraphs in twip (1 twip == 1/1440 inch).

#### Default

```ts
0
```

***

### direction?

> `optional` **direction?**: `"ltr"` \| `"rtl"` \| `"vertical"`

Defined in: [src/mdast-util-to-docx.ts:400](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L400)

Direction of texts.

#### Default

```ts
"ltr"
```

***

### orderedListFormat?

> `optional` **orderedListFormat?**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:405](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L405)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

***

### thematicBreak?

> `optional` **thematicBreak?**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:414](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L414)

An option to select how thematicBreak works.

- "page": Page Break
- "section": Section Break
- "line": Horizontal line

#### Default

```ts
"page"
```

***

### toc?

> `optional` **toc?**: `boolean` \| `TocOptions`

Defined in: [src/mdast-util-to-docx.ts:419](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L419)

Insert a table of contents generated from headings at the beginning of the document.
Word asks to update fields on open to fill in its page numbers.

***

### image?

> `optional` **image?**: `boolean` \| [`ImageOptions`](ImageOptions.md)

Defined in: [src/mdast-util-to-docx.ts:424](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L424)

Embed images of `image` / `imageReference` nodes. `png`, `jpg`, `gif`, `bmp` and `svg` are supported.
Images are not embedded if not set.

***

### plugins?

> `optional` **plugins?**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:428](https://github.com/inokawa/remark-docx/blob/7cc61bae2cf9b6ec1b7d26122aa1d57bf1436ec7/src/mdast-util-to-docx.ts#L428)

Plugins to customize how mdast nodes are compiled.

***

### title?

> `readonly` `optional` **title?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7530

#### Inherited from

`Pick.title`

***

### subject?

> `readonly` `optional` **subject?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7531

#### Inherited from

`Pick.subject`

***

### creator?

> `readonly` `optional` **creator?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7532

#### Inherited from

`Pick.creator`

***

### keywords?

> `readonly` `optional` **keywords?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7533

#### Inherited from

`Pick.keywords`

***

### description?

> `readonly` `optional` **description?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7534

#### Inherited from

`Pick.description`

***

### styles?

> `readonly` `optional` **styles?**: `IStylesOptions`

Defined in: node\_modules/docx/dist/index.d.ts:7538

#### Inherited from

`Pick.styles`

***

### background?

> `readonly` `optional` **background?**: `IDocumentBackgroundOptions`

Defined in: node\_modules/docx/dist/index.d.ts:7547

#### Inherited from

`Pick.background`
