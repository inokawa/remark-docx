# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![npm](https://img.shields.io/npm/dw/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

> [remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx (Microsoft Word, Office Open XML).

- Uses [docx](https://github.com/dolanmiu/docx) for compilation.
- Works in any environment (e.g. browser, Node.js).
- You can customize [mdast](https://github.com/syntax-tree/mdast) to Word transformation with plugin system.

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
- [x] definition
- [x] footnoteDefinition
- [x] text
- [x] emphasis
- [x] strong
- [x] delete
- [x] break
- [x] link / linkReference
- [x] image / imageReference
- [x] footnote / footnoteReference
- [ ] html
- [ ] yaml
- [ ] toml
- [ ] code / inlineCode
- [x] math / inlineMath ([remark-math](https://github.com/remarkjs/remark-math) and [latexPlugin](#latex) are required)

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

const processor = unified().use(markdown).use(docx);

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const arrayBuffer = await doc.result;
  saveAs(new Blob([arrayBuffer]), "example.docx");
})();
```

### Node.js

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import * as fs from "fs";

const processor = unified().use(markdown).use(docx);

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const arrayBuffer = await doc.result;
  fs.writeFileSync("example.docx", Buffer.from(arrayBuffer));
})();
```

### With plugins

#### LaTeX

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { latexPlugin } from "remark-docx/plugins/math";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [latexPlugin()] });
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
