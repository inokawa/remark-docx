# remark-docx

![npm](https://img.shields.io/npm/v/remark-docx) ![npm](https://img.shields.io/npm/dw/remark-docx) ![check](https://github.com/inokawa/remark-docx/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-docx/workflows/demo/badge.svg)

> [remark](https://github.com/remarkjs/remark) plugin to compile markdown to docx (Microsoft Word, Office Open XML).

- Uses [docx](https://github.com/dolanmiu/docx) for compilation.
- Works in any environment (e.g. browser, Node.js, CLI).
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
- [x] link / linkReference (links to headings like `[text](#heading-text)` are resolved by [github-slugger](https://github.com/Flet/github-slugger))
- [x] footnoteReference / footnoteDefinition
- [x] image / imageReference (requires [`image` option](#image))
- [x] html (see [supported HTML](https://docx.js.org/#/usage/html))
- [x] code ([plugin](#code))
- [x] math / inlineMath (requires [remark-math](https://github.com/remarkjs/remark-math), supports [LaTeX](https://docx.js.org/#/usage/math-latex) only)

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

To embed local images, use [remark-embed-images](https://github.com/remarkjs/remark-embed-images) with `image` option.

```sh
npx remark input.md --use remark-embed-images --use remark-docx=image:true --output output.docx
```

## Image

Set `image` option to embed `png`, `jpg`, `gif` and `bmp` images.

```javascript
const processor = unified().use(markdown).use(docx, { image: true });
```

Images are fetched with [fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API) by default. You can customize it with `load` option, which also receives the processed file to resolve relative urls.

```javascript
import * as fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

const processor = unified()
  .use(markdown)
  .use(docx, {
    image: {
      load: (url, file) => fs.readFile(new URL(url, pathToFileURL(file.path))),
    },
  });
```

To embed other images such as `svg` and `webp`, also set `toPng` option to convert them to `png`, which Word can show. On browser, you can use `browserToPng`, which converts images that the browser can show.

```javascript
import docx, { browserToPng } from "remark-docx";

const processor = unified()
  .use(markdown)
  .use(docx, { image: { toPng: browserToPng } });
```

On other environments like Node.js, implement it by yourself.

```javascript
import sharp from "sharp";

const processor = unified()
  .use(markdown)
  .use(docx, {
    image: {
      toPng: ({ buffer }) => sharp(buffer).png().toBuffer(),
    },
  });
```

## Plugins

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

#### Image

Render code blocks as images with `codeToImagePlugin`. `render` returns image data such as PNG and SVG, or `null` to leave the code block to the next plugins.

##### Mermaid

Render [Mermaid](https://mermaid.js.org/) in code blocks with `mermaid` language. It only works in browser.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx, { browserToPng } from "remark-docx";
import { codeToImagePlugin } from "remark-docx/plugins/code-to-image";
import mermaid from "mermaid";

const processor = unified()
  .use(markdown)
  .use(docx, {
    image: { toPng: browserToPng },
    plugins: [
      codeToImagePlugin({
        render: async ({ lang, value }) => {
          if (lang !== "mermaid") return null;
          // Mermaid leaves its elements in the container if it fails to render
          const container = document.createElement("div");
          document.body.appendChild(container);
          try {
            const { svg } = await mermaid.render("mermaid", value, container);
            return new TextEncoder().encode(svg);
          } finally {
            container.remove();
          }
        },
      }),
    ],
  });
```

##### Graphviz

Render [Graphviz](https://graphviz.org/) in code blocks with `dot` language.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { codeToImagePlugin } from "remark-docx/plugins/code-to-image";
import sharp from "sharp";
import { instance } from "@viz-js/viz";

const viz = await instance();
const processor = unified()
  .use(markdown)
  .use(docx, {
    image: { toPng: ({ buffer }) => sharp(buffer).png().toBuffer() },
    plugins: [
      codeToImagePlugin({
        render: ({ lang, value }) =>
          lang === "dot"
            ? new TextEncoder().encode(
                viz.renderString(value, { format: "svg" }),
              )
            : null,
      }),
    ],
  });
```

##### Vega-Lite

Render [Vega-Lite](https://vega.github.io/vega-lite/) in code blocks with `vega-lite` language.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { codeToImagePlugin } from "remark-docx/plugins/code-to-image";
import sharp from "sharp";
import { View, parse } from "vega";
import { compile } from "vega-lite";

const processor = unified()
  .use(markdown)
  .use(docx, {
    image: { toPng: ({ buffer }) => sharp(buffer).png().toBuffer() },
    plugins: [
      codeToImagePlugin({
        render: async ({ lang, value }) =>
          lang === "vega-lite"
            ? new TextEncoder().encode(
                await new View(parse(compile(JSON.parse(value)).spec), {
                  renderer: "none",
                }).toSVG(),
              )
            : null,
      }),
    ],
  });
```

##### SMILES

Render [SMILES](https://en.wikipedia.org/wiki/Simplified_Molecular_Input_Line_Entry_System) in code blocks with `smiles` language, using [OpenChemLib](https://github.com/cheminfo/openchemlib-js).

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { codeToImagePlugin } from "remark-docx/plugins/code-to-image";
import sharp from "sharp";
import { Molecule } from "openchemlib";

const processor = unified()
  .use(markdown)
  .use(docx, {
    image: { toPng: ({ buffer }) => sharp(buffer).png().toBuffer() },
    plugins: [
      codeToImagePlugin({
        render: ({ lang, value }) =>
          lang === "smiles"
            ? new TextEncoder().encode(
                Molecule.fromSmiles(value).toSVG(300, 200),
              )
            : null,
      }),
    ],
  });
```

Other languages can be rendered with servers such as [Kroki](https://kroki.io/). Note that code blocks are sent to the server.

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
