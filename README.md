# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![npm](https://img.shields.io/npm/dw/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

> [remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx (Microsoft Word, Office Open XML).

- Uses [docx](https://github.com/dolanmiu/docx) for compilation.
- Works in any environment (e.g. browser, Node.js).
- Provides reasonable default style and also tunable enough (WIP).
- Has own plugin system. You can fully customize [mdast](https://github.com/syntax-tree/mdast) to Word transformation.

### Supported mdast nodes

Currently, some of the default styles may not be nice. If you have feature requests or improvements, please create a [issue](https://github.com/inokawa/remark-docx/issues) or [PR](https://github.com/inokawa/remark-docx/pulls).

- [x] paragraph
- [x] heading
- [x] thematicBreak (rendered as Page Break/Section Break)
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
- [x] footnote / footnoteReference / footnoteDefinition
- [x] image / imageReference ([plugin](#image))
- [x] html ([plugin](#html))
- [x] code ([plugin](#code))
- [x] math / inlineMath ([remark-math](https://github.com/remarkjs/remark-math) and [plugin](#math))

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

Fetch image data and embed into docx. `png`, `jpg`, `gif`, `bmp`, `svg` urls are supported.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { imagePlugin } from "remark-docx/plugins/image";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [imagePlugin()] });
```

When we embed `svg` to docx, it also requires `png` image since legacy Word can't render `svg`. On browser, this plugin generate it automatically. On other enviroment like Node.js, please implement `fallbackSvg` prop.

```javascript
import sharp from "sharp";

imagePlugin({
  fallbackSvg: async ({ buffer }) => {
    const png = await sharp(buffer).png().toBuffer();
    return png.buffer;
  },
});
```

### Code

Syntax highlighting with [shiki](https://github.com/shikijs/shiki).

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { shikiPlugin } from "remark-docx/plugins/shiki";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [shikiPlugin({ theme: "dark-plus" })] });
```

### Math

Render LaTeX with [MathJax](https://github.com/mathjax/MathJax).

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import math from "remark-math";
import docx from "remark-docx";
import { latexPlugin } from "remark-docx/plugins/latex";

const processor = unified()
  .use(markdown)
  .use(math)
  .use(docx, { plugins: [latexPlugin()] });
```

### HTML

Transform HTML to markdown.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { htmlPlugin } from "remark-docx/plugins/html";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [htmlPlugin()] });
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
