# API

## Table of contents

### Functions

- [default](API.md#default)

### Interfaces

- [DocxOptions](interfaces/DocxOptions.md)

## Functions

### default

▸ **default**(`this`, `...settings`): `void` \| `Transformer`<`Node`<`Data`\>, `Node`<`Data`\>\>

A plugin is a function.
It configures the processor and in turn can receive options.
Plugins can configure processors by interacting with parsers and compilers
(at `this.Parser` or `this.Compiler`) or by specifying how the syntax tree
is handled (by returning a `Transformer`).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `Processor`<`void`, `Node`<`Data`\>, `void`, `void`\> | - |
| `...settings` | [DocxOptions?] | Configuration for plugin. Plugins typically receive one options object, but could receive other and more values. Users can also pass a boolean instead of settings: `true` (to turn a plugin on) or `false` (to turn a plugin off). When a plugin is turned off, it won’t be called. When creating your own plugins, please accept only a single object! It allows plugins to be reconfigured and it helps users to know that every plugin accepts one options object. |

#### Returns

`void` \| `Transformer`<`Node`<`Data`\>, `Node`<`Data`\>\>

Plugins can return a `Transformer` to specify how the syntax tree is
  handled.

#### Defined in

node_modules/unified/index.d.ts:531
