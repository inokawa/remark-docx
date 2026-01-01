[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:186](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L186)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size**: `object`

Defined in: [src/mdast-util-to-docx.ts:200](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L200)

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

Defined in: [src/mdast-util-to-docx.ts:205](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L205)

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

### orientation?

> `optional` **orientation**: `"portrait"` \| `"landscape"`

Defined in: [src/mdast-util-to-docx.ts:210](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L210)

Page orientation.

#### Default

```ts
"portrait"
```

***

### columns?

> `optional` **columns**: `number`

Defined in: [src/mdast-util-to-docx.ts:215](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L215)

Number of page columns.

#### Default

```ts
1
```

***

### spacing?

> `optional` **spacing**: `number`

Defined in: [src/mdast-util-to-docx.ts:220](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L220)

Spacing after Paragraphs in twip (1 twip == 1/1440 inch).

#### Default

```ts
0
```

***

### direction?

> `optional` **direction**: `"ltr"` \| `"rtl"` \| `"vertical"`

Defined in: [src/mdast-util-to-docx.ts:225](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L225)

Direction of texts.

#### Default

```ts
"ltr"
```

***

### orderedListFormat?

> `optional` **orderedListFormat**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:230](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L230)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

***

### thematicBreak?

> `optional` **thematicBreak**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:239](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L239)

An option to select how thematicBreak works.

- "page": Page Break
- "section": Section Break
- "line": Horizontal line

#### Default

```ts
"page"
```

***

### plugins?

> `optional` **plugins**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:243](https://github.com/inokawa/remark-docx/blob/8503d167fc89562de8d2f890d1f1434f22e8c620/src/mdast-util-to-docx.ts#L243)

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
