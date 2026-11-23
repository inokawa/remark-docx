import { vitest, beforeEach, afterEach, it, describe, expect } from "vitest";
import fs from "fs/promises";
import path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import Zip from "adm-zip";
import prettier from "prettier";
import docx, { type DocxOptions } from ".";
import { imagePlugin } from "./plugins/image";
import { shikiPlugin } from "./plugins/shiki";
import { readFile } from "fs/promises";

const FIXTURE_PATH = "../fixtures";

const fixturesDir = path.join(__dirname, FIXTURE_PATH);

// mock unique id
beforeEach(() => {
  vitest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
});
afterEach(() => {
  vitest.spyOn(global.Math, "random").mockRestore();
});

const loaded = new Map<string, ArrayBuffer>();
const dummyImage = async (url: string): Promise<ArrayBuffer> => {
  if (loaded.has(url)) {
    return loaded.get(url)!;
  }

  const img = await readFile(path.join(fixturesDir, "images/img.png"));

  return img.buffer;
};

describe("e2e", () => {
  const processor = (options: DocxOptions = {}) => {
    return unified()
      .use(markdown)
      .use(gfm)
      .use(frontmatter, ["yaml", "toml"])
      .use(math)
      .use(docx, options);
  };

  async function* readDocx(buffer: Uint8Array | string) {
    const z = new Zip(Buffer.from(buffer));
    for (const e of z.getEntries()) {
      if (e.entryName.match(/word\/.*\.xml$/)) {
        const xml = await prettier.format(z.readAsText(e), {
          parser: "xml",
          plugins: ["@prettier/plugin-xml"],
        });
        yield xml;
      }
    }
  }

  it("article", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "article.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("article rtl", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "article.md"));
    const doc = await processor({ direction: "rtl" }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("break", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "break.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("footnotes", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "footnotes.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("heading", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "heading.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("heading toc", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "heading.md"));
    const doc = await processor({ toc: true }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("heading toc with options", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "heading.md"));
    const doc = await processor({
      toc: { title: "Contents", depth: 6 },
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("paragraph", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "paragraph.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("decoration", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "decoration.md"));
    const doc = await processor({
      plugins: [imagePlugin({ load: dummyImage })],
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("link", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "link.md"));
    const doc = await processor({
      plugins: [imagePlugin({ load: dummyImage })],
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("links to GitHub-style heading fragments with Word bookmarks", async () => {
    const doc = await processor().process(`
[first](#中文-公式) [second](#%E4%B8%AD%E6%96%87-%E5%85%AC%E5%BC%8F-1)
[formatted](#hello-world) [reference][ref] [missing](#missing)
[external](https://example.com/#中文-公式)

[ref]: #中文-公式-1

## 中文 公式
## 中文 公式
## **Hello**, \`world\`!
`);
    const zip = new Zip(Buffer.from(doc.value));
    const xml = zip.readAsText("word/document.xml");
    const rels = zip.readAsText("word/_rels/document.xml.rels");

    const starts = [...xml.matchAll(/<w:bookmarkStart\b[^>]*w:name="([^"]+)"[^>]*w:id="([^"]+)"[^>]*\/>/g)];
    const ends = [...xml.matchAll(/<w:bookmarkEnd\b[^>]*w:id="([^"]+)"[^>]*\/>/g)];
    expect(starts.map((match) => match[1])).toEqual([
        "md_heading_1", "md_heading_2", "md_heading_3",
      ]);
    expect(ends.map((match) => match[1])).toEqual(starts.map((match) => match[2]));
    expect(new Set(starts.map((match) => match[2])).size).toBe(3);
    for (const [i, start] of starts.entries()) {
      expect(start.index).toBeLessThan(ends[i]!.index!);
      if (i + 1 < starts.length) {
        expect(ends[i]!.index).toBeLessThan(starts[i + 1]!.index!);
      }
    }
    expect([...xml.matchAll(/w:hyperlink(?![^>]*r:id=)[^>]*w:anchor="([^"]+)"/g)]
      .map((match) => match[1])).toEqual([
        "md_heading_1", "md_heading_2", "md_heading_3", "md_heading_2",
      ]);
    expect(xml).toContain("missing");
    expect(rels).toContain("https://example.com/");
    expect(xml).toContain('w:anchor="中文-公式"');
    expect(rels).toContain('TargetMode="External"');
  });

  it("counts unreferenced duplicate headings and preserves broken links as text", async () => {
    const doc = await processor().process(`
[third](#重复-2) [missing](#not-found) [empty](#) [invalid](#%E0%A4%A)

## 重复
## 重复
## 重复
`);
    const xml = new Zip(Buffer.from(doc.value)).readAsText("word/document.xml");
    expect(xml.match(/<w:bookmarkStart\b/g)).toHaveLength(1);
    expect(xml.match(/<w:hyperlink\b/g)).toHaveLength(1);
    expect(xml).toContain('w:anchor="md_heading_1"');
    for (const text of ["third", "missing", "empty", "invalid"]) {
      expect(xml).toContain(`>${text}</w:t>`);
    }
  });

  it("image", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "image.md"));
    const doc = await processor({
      plugins: [imagePlugin({ load: dummyImage })],
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("svg", async () => {
    const doc = await processor({
      plugins: [
        imagePlugin({
          load: async () => {
            const img = await fs.readFile(
              path.join(fixturesDir, "images/tiger.svg"),
            );
            return img.buffer;
          },
        }),
      ],
    }).process(`svg ![tiger](image.svg) test`);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list bullet", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-bullet.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list ordered", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-ordered.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list task", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-task.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list multiple blocks", async () => {
    const md = await fs.readFile(
      path.join(fixturesDir, "list-multiple-blocks.md"),
    );
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("code", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "code.md"));
    const doc = await processor({
      plugins: [shikiPlugin({ theme: "dark-plus" })],
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("frontmatter", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "frontmatter.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("math", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "math.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("latex", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "latex.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("math text", async () => {
    // https://github.com/inokawa/remark-docx/issues/210
    const md = [
      "$x^2 + 1$",
      "$\\frac{1}{2.50}$",
      "$x_{01}$",
      "$e^{+3}$",
      "$a < b$",
      "$a \\& b$",
      "$\\text{if } x$",
      "$\\infty \\mathrm{d}x \\mathbb{R} \\%$",
    ].join("\n\n");
    const doc = await processor().process(md);
    const xml = new Zip(Buffer.from(doc.value as Uint8Array)).readAsText(
      "word/document.xml",
    );
    const texts = [...xml.matchAll(/<m:t[^>]*>([^<]*)<\/m:t>/g)].map(
      (m) => m[1],
    );
    expect(texts).toEqual(
      expect.arrayContaining([
        "+1",
        "2.50",
        "01",
        "+3",
        "a&lt;b",
        "&amp;",
        "if ",
      ]),
    );
    expect(xml).not.toContain('m:val="undefined"');
  });

  it("math fallback", async () => {
    const warn = vitest.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const md = [
        "inline $\\newcommand{\\R}{\\mathbb{R}}\\R$ math",
        "$$\n\\frac{a}\n\\undefinedcommand\n$$",
      ].join("\n\n");
      const doc = await processor().process(md);
      const xml = new Zip(Buffer.from(doc.value as Uint8Array)).readAsText(
        "word/document.xml",
      );
      expect(xml).not.toContain("<m:oMath");
      expect(xml).toContain("\\newcommand{\\R}{\\mathbb{R}}\\R");
      expect(xml).toContain("\\frac{a}");
      expect(xml).toContain("\\undefinedcommand");
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it("html", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "html.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });
});
