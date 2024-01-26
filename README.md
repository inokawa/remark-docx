# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![npm](https://img.shields.io/npm/dw/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

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
- [x] footnoteDefinition
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
- [x] footnote
- [x] footnoteReference
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

## Documentation

- [API reference](./docs/API.md)

## Contribute

All contributions are welcome.
If you find a problem, feel free to create an [issue](https://github.com/inokawa/remark-docx/issues) or a [PR](https://github.com/inokawa/remark-docx/pulls).

### Making a Pull Request

1. Fork this repo.
2. Run `npm install`.
3. Commit your fix.
4. Add tests to cover the fix.
5. Make a PR and confirm all the CI checks passed.

## Related projects

- [remark-slate-transformer](https://github.com/inokawa/remark-slate-transformer)
- [remark-pdf](https://github.com/inokawa/remark-pdf)
