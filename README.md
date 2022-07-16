# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx (Microsoft Word, Office Open XML).

### 🚧 WIP 🚧

This project is aiming to support all nodes in [mdast](https://github.com/syntax-tree/mdast) syntax tree, but currently transformation and stylings may not be well.

If you have some feature requests or improvements, please create a [issue](https://github.com/inokawa/remark-docx/issues) or [PR](https://github.com/inokawa/remark-docx/pulls).

- [x] paragraph
- [x] heading
- [x] thematicBreak
- [x] blockquote
- [x] list
- [x] listItem
- [x] table
- [x] tableRow
- [x] tableCell
- [ ] html
- [ ] code
- [ ] yaml
- [ ] toml
- [ ] definition
- [ ] footnoteDefinition
- [x] text
- [x] emphasis
- [x] strong
- [x] delete
- [ ] inlineCode
- [x] break
- [x] link
- [x] image
- [ ] linkReference
- [ ] imageReference
- [ ] footnote
- [ ] footnoteReference
- [x] LaTeX support with math and inlineMath ([remark-math](https://github.com/remarkjs/remark-math) is required)

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

| Key            | Default   | Type                        | Description                                                                                                                                                                                                                                      |
| -------------- | --------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| output         | "buffer"  | `"buffer"` `"blob"`         | Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `blob` is `Promise<Blob>`.                                                                                                                                                     |
| imageResolver  | undefined | ImageResolver?              | **You must set** if your markdown includes images. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts). |
| title          | undefined | string?                     |                                                                                                                                                                                                                                                  |
| subject        | undefined | string?                     |                                                                                                                                                                                                                                                  |
| creator        | undefined | string?                     |                                                                                                                                                                                                                                                  |
| keywords       | undefined | string?                     |                                                                                                                                                                                                                                                  |
| description    | undefined | string?                     |                                                                                                                                                                                                                                                  |
| lastModifiedBy | undefined | string?                     |                                                                                                                                                                                                                                                  |
| revision       | undefined | number?                     |                                                                                                                                                                                                                                                  |
| styles         | undefined | IStylesOptions?             |                                                                                                                                                                                                                                                  |
| background     | undefined | IDocumentBackgroundOptions? |                                                                                                                                                                                                                                                  |

## Related projects

- [remark-slate-transformer](https://github.com/inokawa/remark-slate-transformer)
- [remark-pdf](https://github.com/inokawa/remark-pdf)
