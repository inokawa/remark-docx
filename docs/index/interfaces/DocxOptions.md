[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:106](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L106)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size?**: `object`

Defined in: [src/mdast-util-to-docx.ts:120](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L120)

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

Defined in: [src/mdast-util-to-docx.ts:125](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L125)

Page margin defined in twip (1 twip == 1/1440 inch).

#### top?

> `optional` **top?**: `number`

Top margin.

##### Default

```ts
1440
```

#### left?

> `optional` **left?**: `number`

Left margin.

##### Default

```ts
1440
```

#### bottom?

> `optional` **bottom?**: `number`

Bottom margin.

##### Default

```ts
1440
```

#### right?

> `optional` **right?**: `number`

Right margin.

##### Default

```ts
1440
```

#### header?

> `optional` **header?**: `number`

Distance from the top edge to the header.

##### Default

```ts
708
```

#### footer?

> `optional` **footer?**: `number`

Distance from the bottom edge to the footer.

##### Default

```ts
708
```

#### gutter?

> `optional` **gutter?**: `number`

Binding space added to the left margin.

##### Default

```ts
0
```

#### Default

sectionMarginDefaults

***

### orientation?

> `optional` **orientation?**: `"portrait"` \| `"landscape"`

Defined in: [src/mdast-util-to-docx.ts:166](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L166)

Page orientation.

#### Default

```ts
"portrait"
```

***

### columns?

> `optional` **columns?**: `number`

Defined in: [src/mdast-util-to-docx.ts:171](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L171)

Number of page columns.

#### Default

```ts
1
```

***

### spacing?

> `optional` **spacing?**: `number`

Defined in: [src/mdast-util-to-docx.ts:176](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L176)

Spacing after Paragraphs in twip (1 twip == 1/1440 inch).

#### Default

```ts
0
```

***

### direction?

> `optional` **direction?**: `"ltr"` \| `"rtl"` \| `"vertical"`

Defined in: [src/mdast-util-to-docx.ts:181](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L181)

Direction of texts.

#### Default

```ts
"ltr"
```

***

### orderedListFormat?

> `optional` **orderedListFormat?**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:186](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L186)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

***

### thematicBreak?

> `optional` **thematicBreak?**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:195](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L195)

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

Defined in: [src/mdast-util-to-docx.ts:200](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L200)

Insert a table of contents generated from headings at the beginning of the document.
Word asks to update fields on open to fill in its page numbers.

***

### pageNumbers?

> `optional` **pageNumbers?**: `boolean`

Defined in: [src/mdast-util-to-docx.ts:204](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L204)

Show the current page number in a centered footer.

***

### lineNumbers?

> `optional` **lineNumbers?**: `boolean`

Defined in: [src/mdast-util-to-docx.ts:208](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L208)

Show line numbers in the margin, continuously through the document.

***

### image?

> `optional` **image?**: `boolean` \| [`ImageOptions`](ImageOptions.md)

Defined in: [src/mdast-util-to-docx.ts:213](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L213)

Embed images of `image` / `imageReference` nodes. `png`, `jpg`, `gif`, `bmp` and `svg` are supported.
Images are not embedded if not set.

***

### plugins?

> `optional` **plugins?**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:217](https://github.com/inokawa/remark-docx/blob/04cd4532e52c156d348ed47710f3607801c67aa5/src/mdast-util-to-docx.ts#L217)

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
