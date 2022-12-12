# Interface: DocxOptions

## Hierarchy

- `Pick`<`IPropertiesOptions`, ``"title"`` \| ``"subject"`` \| ``"creator"`` \| ``"keywords"`` \| ``"description"`` \| ``"lastModifiedBy"`` \| ``"revision"`` \| ``"styles"`` \| ``"background"``\>

  ↳ **`DocxOptions`**

## Table of contents

### Properties

- [output](DocxOptions.md#output)
- [imageResolver](DocxOptions.md#imageresolver)
- [title](DocxOptions.md#title)
- [subject](DocxOptions.md#subject)
- [creator](DocxOptions.md#creator)
- [keywords](DocxOptions.md#keywords)
- [description](DocxOptions.md#description)
- [lastModifiedBy](DocxOptions.md#lastmodifiedby)
- [revision](DocxOptions.md#revision)
- [styles](DocxOptions.md#styles)
- [background](DocxOptions.md#background)

## Properties

### output

• `Optional` **output**: ``"buffer"`` \| ``"blob"``

Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `blob` is `Promise<Blob>`.

#### Defined in

[src/transformer.ts:136](https://github.com/inokawa/remark-docx/blob/bd70d1a/src/transformer.ts#L136)

___

### imageResolver

• `Optional` **imageResolver**: `ImageResolver`

**You must set** if your markdown includes images. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts).

#### Defined in

[src/transformer.ts:140](https://github.com/inokawa/remark-docx/blob/bd70d1a/src/transformer.ts#L140)

___

### title

• `Optional` `Readonly` **title**: `string`

#### Inherited from

Pick.title

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:11

___

### subject

• `Optional` `Readonly` **subject**: `string`

#### Inherited from

Pick.subject

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:12

___

### creator

• `Optional` `Readonly` **creator**: `string`

#### Inherited from

Pick.creator

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:13

___

### keywords

• `Optional` `Readonly` **keywords**: `string`

#### Inherited from

Pick.keywords

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:14

___

### description

• `Optional` `Readonly` **description**: `string`

#### Inherited from

Pick.description

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:15

___

### lastModifiedBy

• `Optional` `Readonly` **lastModifiedBy**: `string`

#### Inherited from

Pick.lastModifiedBy

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:16

___

### revision

• `Optional` `Readonly` **revision**: `number`

#### Inherited from

Pick.revision

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:17

___

### styles

• `Optional` `Readonly` **styles**: `IStylesOptions`

#### Inherited from

Pick.styles

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:19

___

### background

• `Optional` `Readonly` **background**: `IDocumentBackgroundOptions`

#### Inherited from

Pick.background

#### Defined in

node_modules/docx/build/file/core-properties/properties.d.ts:27
