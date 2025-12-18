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
import { latexPlugin } from "./plugins/latex";
import { imagePlugin } from "./plugins/image";
import { htmlPlugin } from "./plugins/html";
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

  const img = await readFile(path.join(fixturesDir, "img.png"));

  return img.buffer as ArrayBuffer;
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

  async function* readDocx(buffer: ArrayBuffer) {
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
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("break", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "break.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("code", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "code.md"));
    const doc = await processor({
      plugins: [shikiPlugin({ theme: "dark-plus" })],
    }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("footnotes", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "footnotes.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("footnotes2", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "footnotes2.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("frontmatter", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "frontmatter.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("heading", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "heading.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("reference", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "reference.md"));
    const doc = await processor({
      plugins: [imagePlugin({ load: dummyImage })],
    }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list bullet", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-bullet.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list ordered", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-ordered.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list task", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "list-task.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("math", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "math.md"));
    const doc = await processor({ plugins: [latexPlugin()] }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("latex", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "latex.md"));
    const doc = await processor({ plugins: [latexPlugin()] }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("tag", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "tag.md"));
    const doc = await processor({ plugins: [htmlPlugin()] }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("paragraph", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "paragraph.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("decoration", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "decoration.md"));
    const doc = await processor({
      plugins: [imagePlugin({ load: dummyImage })],
    }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("alt", async () => {
    const md = await fs.readFile(path.join(fixturesDir, "alt.md"));
    const doc = await processor({
      plugins: [imagePlugin({ load: dummyImage })],
    }).process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });
});
