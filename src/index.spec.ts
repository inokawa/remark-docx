import { vitest, beforeEach, afterEach, it, describe, expect } from "vitest";
import fs from "fs";
import path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import Zip from "adm-zip";
import prettier from "prettier";
import docx, { DocxOptions } from ".";

const FIXTURE_PATH = "../fixtures";

// mock unique id
beforeEach(() => {
  vitest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
});
afterEach(() => {
  vitest.spyOn(global.Math, "random").mockRestore();
});

describe("e2e", () => {
  const processor = (options: DocxOptions = {}) => {
    return unified()
      .use(markdown)
      .use(gfm)
      .use(frontmatter, ["yaml", "toml"])
      .use(math)
      .use(docx, {
        ...options,
        imageResolver: () => ({
          image: new Uint8Array(),
          width: 600,
          height: 400,
          type: "png",
        }),
      });
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

  const fixturesDir = path.join(__dirname, FIXTURE_PATH);

  it("article", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "article.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("break", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "break.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("code", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "code.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("footnotes", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "footnotes.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("footnotes2", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "footnotes2.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("frontmatter-toml", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "frontmatter-toml.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("frontmatter-yaml", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "frontmatter-yaml.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("heading", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "heading.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("image-reference", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "image-reference.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("link-reference", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "link-reference.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("list-numbering-restart", async () => {
    const md = fs.readFileSync(
      path.join(fixturesDir, "list-numbering-restart.md"),
    );
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("math", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "math.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("ml", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "ml.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("paragraph", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "paragraph.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("phrasing-1", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "phrasing-1.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });

  it("phrasing-2", async () => {
    const md = fs.readFileSync(path.join(fixturesDir, "phrasing-2.md"));
    const doc = await processor().process(md);
    for await (const xml of readDocx(await doc.result)) {
      expect(xml).toMatchSnapshot();
    }
  });
});
