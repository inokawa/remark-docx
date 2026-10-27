[**API**](../../API.md)

***

# Interface: DocxOptions

Defined in: [src/mdast-util-to-docx.ts:189](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L189)

## Extends

- `Pick`\<`IPropertiesOptions`, `"title"` \| `"subject"` \| `"creator"` \| `"keywords"` \| `"description"` \| `"styles"` \| `"background"`\>

## Properties

### size?

> `optional` **size?**: `object`

Defined in: [src/mdast-util-to-docx.ts:203](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L203)

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

Defined in: [src/mdast-util-to-docx.ts:208](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L208)

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

Defined in: [src/mdast-util-to-docx.ts:213](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L213)

Page orientation.

#### Default

```ts
"portrait"
```

***

### columns?

> `optional` **columns?**: `number`

Defined in: [src/mdast-util-to-docx.ts:218](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L218)

Number of page columns.

#### Default

```ts
1
```

***

### spacing?

> `optional` **spacing?**: `number`

Defined in: [src/mdast-util-to-docx.ts:223](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L223)

Spacing after Paragraphs in twip (1 twip == 1/1440 inch).

#### Default

```ts
0
```

***

### direction?

> `optional` **direction?**: `"ltr"` \| `"rtl"` \| `"vertical"`

Defined in: [src/mdast-util-to-docx.ts:228](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L228)

Direction of texts.

#### Default

```ts
"ltr"
```

***

### orderedListFormat?

> `optional` **orderedListFormat?**: `ListFormat`[]

Defined in: [src/mdast-util-to-docx.ts:233](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L233)

An option to override the text format of ordered list.
See https://docx.js.org/#/usage/numbering?id=level-options for more details.

***

### thematicBreak?

> `optional` **thematicBreak?**: `ThematicBreakType`

Defined in: [src/mdast-util-to-docx.ts:242](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L242)

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

> `optional` **plugins?**: [`RemarkDocxPlugin`](../type-aliases/RemarkDocxPlugin.md)[]

Defined in: [src/mdast-util-to-docx.ts:246](https://github.com/inokawa/remark-docx/blob/f6f57050d759e6359a8e75dbfeceaae6d6934e98/src/mdast-util-to-docx.ts#L246)

Plugins to customize how mdast nodes are compiled.

***

### title?

> `readonly` `optional` **title?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7399

#### Inherited from

`Pick.title`

***

### subject?

> `readonly` `optional` **subject?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7400

#### Inherited from

`Pick.subject`

***

### creator?

> `readonly` `optional` **creator?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7401

#### Inherited from

`Pick.creator`

***

### keywords?

> `readonly` `optional` **keywords?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7402

#### Inherited from

`Pick.keywords`

***

### description?

> `readonly` `optional` **description?**: `string`

Defined in: node\_modules/docx/dist/index.d.ts:7403

#### Inherited from

`Pick.description`

***

### styles?

> `readonly` `optional` **styles?**: `IStylesOptions`

Defined in: node\_modules/docx/dist/index.d.ts:7407

#### Inherited from

`Pick.styles`

***

### background?

> `readonly` `optional` **background?**: `IDocumentBackgroundOptions`

Defined in: node\_modules/docx/dist/index.d.ts:7416

#### Inherited from

`Pick.background`
