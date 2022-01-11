# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx.

### 🚧 WIP 🚧

The goal is to support all nodes in [mdast](https://github.com/syntax-tree/mdast) syntax tree, but currently transformation and stylings may not be well.

If you have some feature requests or improvements, please create a [issue](https://github.com/inokawa/remark-docx/issues) or [PR](https://github.com/inokawa/remark-docx/pulls).

## Demo

https://inokawa.github.io/remark-docx/

## Install

```sh
npm install remark-docx
```

## Usage

### Browser

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { saveAs } from "file-saver";

const processor = unified().use(markdown).use(docx, { output: "blob" });

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const blob = await doc.result;
  saveAs(blob, "example.docx");
})();
```

### Node.js

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import * as fs from "fs";

const processor = unified().use(markdown).use(docx, { output: "buffer" });

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const buffer = await doc.result;
  fs.writeFileSync("example.docx", buffer);
})();
```

## Options

| Key           | Default   | Type                        | Description                                                                                                                                                                                                                                      |
| ------------- | --------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| output        | "buffer"  | `"buffer"` `"blob"` `"raw"` | Set output type of `VFile.result`. `buffer` is `Promise<ArrayBuffer>`. `blob` is `Promise<Blob>`. `raw` is internal data for testing.                                                                                                            |
| docProperties | undefined | object                      | Override properties of document.                                                                                                                                                                                                                 |
| imageResolver | undefined | ImageResolver               | **You must set** if your markdown includes images. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts). |
