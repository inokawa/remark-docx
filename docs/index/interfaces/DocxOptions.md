[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:188](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L188)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size**: `object`

Defined in: [src/mdast-util-to-docx.ts:202](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L202)

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

Defined in: [src/mdast-util-to-docx.ts:207](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L207)

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

Defined in: [src/mdast-util-to-docx.ts:212](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L212)

Page orientation.

#### Default

```ts
"portrait"
```

***

### columns?

> `optional` **columns**: `number`

Defined in: [src/mdast-util-to-docx.ts:217](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L217)

Number of page columns.

#### Default

```ts
1
```

***

### spacing?

> `optional` **spacing**: `number`

Defined in: [src/mdast-util-to-docx.ts:222](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L222)

Spacing after Paragraphs in twip (1 twip == 1/1440 inch).

#### Default

```ts
0
```

***

### direction?

> `optional` **direction**: `"ltr"` \| `"rtl"` \| `"vertical"`

Defined in: [src/mdast-util-to-docx.ts:227](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L227)

Direction of texts.

#### Default

```ts
"ltr"
```

***

### orderedListFormat?

> `optional` **orderedListFormat**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:232](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L232)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

***

### thematicBreak?

> `optional` **thematicBreak**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:241](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L241)

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

Defined in: [src/mdast-util-to-docx.ts:245](https://github.com/inokawa/remark-docx/blob/b937c08ac4cbc850df98aebcd10a83f7274f9c72/src/mdast-util-to-docx.ts#L245)

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
