# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![npm](https://img.shields.io/npm/dw/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

> [remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx (Microsoft Word, Office Open XML).

- Uses [docx](https://github.com/dolanmiu/docx) for compilation.
- Works in any environment (e.g. browser, Node.js).
- You can customize [mdast](https://github.com/syntax-tree/mdast) to Word transformation with plugin system.

### Supported mdast nodes

Currently, some of the default styles may not be nice. If you have feature requests or improvements, please create a [issue](https://github.com/inokawa/remark-docx/issues) or [PR](https://github.com/inokawa/remark-docx/pulls).

- [x] paragraph
- [x] heading
- [x] thematicBreak
- [x] blockquote
- [x] list / listItem
- [x] table / tableRow / tableCell
- [x] definition
- [x] text
- [x] emphasis
- [x] strong
- [x] delete
- [x] inlineCode
- [x] break
- [x] link / linkReference
- [x] image / imageReference ([remark-docx/plugins/image](#image) is required)
- [x] footnote / footnoteReference / footnoteDefinition
- [x] html ([remark-docx/plugins/html](#html) is required)
- [ ] code
- [x] math / inlineMath ([remark-math](https://github.com/remarkjs/remark-math) and [remark-docx/plugins/math](#latex) are required)

## Demo

https://inokawa.github.io/remark-docx/

## Install

```sh
npm install remark-docx
```

## Getting started

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

## With plugins

### Image

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { imagePlugin } from "remark-docx/plugins/image";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [imagePlugin()] });
```

### HTML

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { htmlPlugin } from "remark-docx/plugins/html";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [htmlPlugin()] });
```

### LaTeX

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import math from "remark-math";
import docx from "remark-docx";
import { latexPlugin } from "remark-docx/plugins/math";

const processor = unified()
  .use(markdown)
  .use(math)
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
