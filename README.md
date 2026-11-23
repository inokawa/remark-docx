# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![npm](https://img.shields.io/npm/dw/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

> [remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx (Microsoft Word, Office Open XML).

- Uses [docx](https://github.com/dolanmiu/docx) for compilation.
- Works in any environment (e.g. browser, Node.js).
- Provides reasonable default style and also tunable enough (WIP).
- Supports advanced layouts (RTL, vertical, 2 columns).
- Has own plugin system. You can fully customize markdown to Word transformation.

### Supported [mdast](https://github.com/syntax-tree/mdast) nodes

Currently, some of the default styles may not be nice. If you have feature requests or improvements, please create a [issue](https://github.com/inokawa/remark-docx/issues) or [PR](https://github.com/inokawa/remark-docx/pulls).

- [x] paragraph
- [x] heading
- [x] thematicBreak (rendered as Page Break / Section Break / Horizontal line)
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
- [x] footnoteReference / footnoteDefinition
- [x] image / imageReference ([plugin](#image))
- [x] html (see [supported HTML](https://docx.js.org/#/usage/html))
- [x] code ([plugin](#code))
- [x] math / inlineMath (requires [remark-math](https://github.com/remarkjs/remark-math), supports [LaTeX](https://docx.js.org/#/usage/math-latex) only)

Links to headings in the same document use GitHub-style fragments, including
the `-1`, `-2` suffixes for duplicate headings. For example, `[Go](#中文-标题)`
links to `## 中文 标题`. Unmatched or malformed fragments remain plain text.

## Demo

https://inokawa.github.io/remark-docx/

## Install

```sh
npm install remark-docx
```

## Getting started

### Browser

```ts
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { saveAs } from "file-saver";

const processor = unified().use(markdown).use(docx);

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const uint8Array = doc.value;
  saveAs(new Blob([uint8Array as BlobPart]), "example.docx");
})();
```

### Node.js

```ts
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import * as fs from "fs";

const processor = unified().use(markdown).use(docx);

const text = "# hello world";

(async () => {
  const doc = await processor.process(text);
  const uint8Array = doc.value;
  fs.writeFileSync("example.docx", uint8Array);
})();
```

### CLI

See [remark-cli](https://github.com/remarkjs/remark/tree/main/packages/remark-cli) for usage.

```sh
npm install remark-cli
npx remark input.md --use remark-docx --output output.docx
```

## Plugins

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

URLs are resolved with [fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API) by default. You can use other methods such as file system.

```javascript
import * as fs from "fs/promises";

imagePlugin({
  load: async (url) => {
    return (await fs.readFile(url)).buffer;
  },
});
```

When we embed `svg` to docx, it also requires `png` image since legacy Word can't render `svg`. On browser, this plugin generate it automatically. On other enviroment like Node.js, please implement `fallbackSvg` prop.

```javascript
import sharp from "sharp";

imagePlugin({
  fallbackSvg: async ({ buffer }) => {
    return (await sharp(buffer).png().toBuffer()).buffer;
  },
});
```

### Code

#### Syntax highlight

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

#### Mermaid

Render [Mermaid](https://mermaid.js.org/) in code blocks with `mermaid` language. It only works in browser for now.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { mermaidPlugin } from "remark-docx/plugins/mermaid";

const processor = unified()
  .use(markdown)
  .use(docx, { plugins: [mermaidPlugin()] });
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
