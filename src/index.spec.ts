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
      image: { load: dummyImage },
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("link", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "link.md"));
    const doc = await processor({
      image: { load: dummyImage },
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("link heading", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "link-heading.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("image", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "image.md"));
    const doc = await processor({
      image: { load: dummyImage },
    }).process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("svg", async () => {
    const doc = await processor({
      image: {
        load: async () => {
          const img = await fs.readFile(
            path.join(fixturesDir, "images/tiger.svg"),
          );
          return img.buffer;
        },
      },
    }).process(`svg ![tiger](image.svg) test`);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("table align", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "table-align.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("svg with svgToPng", async () => {
    const doc = await processor({
      image: {
        load: async () => {
          const img = await fs.readFile(
            path.join(fixturesDir, "images/tiger.svg"),
          );
          return img.buffer;
        },
        // dummy png
        svgToPng: async () => {
          const img = await fs.readFile(
            path.join(fixturesDir, "images/img.png"),
          );
          return img.buffer;
        },
      },
    }).process(`svg ![tiger](image.svg) test`);
    const z = new Zip(Buffer.from(doc.value));
    const media = z
      .getEntries()
      .map((e) => e.entryName)
      .filter((n) => n.startsWith("word/media/"));
    expect(media.some((n) => n.endsWith(".svg"))).toBe(true);
    expect(media.some((n) => n.endsWith(".png"))).toBe(true);
  });

  it("image with data uri", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "image-data-uri.md"));
    const doc = await processor({ image: true }).process(md);
    const xml = new Zip(Buffer.from(doc.value)).readAsText("word/document.xml");
    expect(xml).toContain("<a:blip ");
  });

  it("image with invalid data", async () => {
    const doc = await processor({
      image: {
        load: async () =>
          new TextEncoder().encode("<html>Not Found</html>").buffer,
      },
    }).process(`![a](foo.png)`);
    const xml = new Zip(Buffer.from(doc.value)).readAsText("word/document.xml");
    expect(xml).not.toContain("<a:blip ");
  });

  it("image resolved by plugins takes precedence", async () => {
    const svg = await fs.readFile(path.join(fixturesDir, "images/tiger.svg"));
    const png = await fs.readFile(path.join(fixturesDir, "images/img.png"));
    const doc = await processor({
      image: { load: dummyImage },
      plugins: [
        async ({ images }) => {
          images.set("foo.png", {
            type: "svg",
            width: 10,
            height: 10,
            data: svg.buffer,
            fallback: png.buffer,
          });
          return {};
        },
      ],
    }).process(`![a](foo.png)`);
    const media = new Zip(Buffer.from(doc.value))
      .getEntries()
      .map((e) => e.entryName)
      .filter((n) => n.startsWith("word/media/"));
    expect(media.some((n) => n.endsWith(".svg"))).toBe(true);
  });

  it("image set by async plugins takes precedence", async () => {
    const svg = await fs.readFile(path.join(fixturesDir, "images/tiger.svg"));
    const png = await fs.readFile(path.join(fixturesDir, "images/img.png"));
    const doc = await processor({
      image: {
        load: async (url) => {
          await new Promise((r) => setTimeout(r, 10));
          return dummyImage(url);
        },
      },
      plugins: [
        async ({ images }) => {
          await Promise.resolve();
          images.set("foo.png", {
            type: "svg",
            width: 10,
            height: 10,
            data: svg.buffer,
            fallback: png.buffer,
          });
          return {};
        },
      ],
    }).process(`![a](foo.png)`);
    const media = new Zip(Buffer.from(doc.value))
      .getEntries()
      .map((e) => e.entryName)
      .filter((n) => n.startsWith("word/media/"));
    expect(media.some((n) => n.endsWith(".svg"))).toBe(true);
  });

  it("image cached in the same processor", async () => {
    let count = 0;
    const p = processor({
      image: {
        load: async (url) => {
          count++;
          return dummyImage(url);
        },
      },
    });
    await p.process(`![a](foo.png) ![b](foo.png)`);
    await p.process(`![a](foo.png)`);
    expect(count).toBe(1);
  });

  it("image disabled by default", async () => {
    const doc = await processor().process({
      path: path.join(fixturesDir, "dummy.md"),
      value: `![a](images/img.png)`,
    });
    const xml = new Zip(Buffer.from(doc.value)).readAsText("word/document.xml");
    expect(xml).not.toContain("<a:blip ");
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

  it("list ordered start", async () => {
    const md = await fs.readFile(
      path.join(fixturesDir, "list-ordered-start.md"),
    );
    const doc = await processor().process(md);
    for await (const xml of readDocx(doc.value)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list spread", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-spread.md"));
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
