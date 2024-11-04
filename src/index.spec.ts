import { vitest, beforeEach, afterEach, it, describe, expect } from "vitest";
import fs from "fs";
import path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import footnotes from "remark-footnotes";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import Zip from "adm-zip";
import docx from ".";

const FIXTURE_PATH = "../fixtures";

// mock unique id
beforeEach(() => {
  vitest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
});
afterEach(() => {
  vitest.spyOn(global.Math, "random").mockRestore();
});

describe("e2e", () => {
  const toDocxProcessor = unified()
    .use(markdown)
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(frontmatter, ["yaml", "toml"])
    .use(math)
    .use(docx, {
      output: "buffer",
      imageResolver: () => ({
        image: new Uint8Array(),
        width: 600,
        height: 400,
      }),
    });

  const fixturesDir = path.join(__dirname, FIXTURE_PATH);
  const filenames = fs.readdirSync(fixturesDir);
  filenames.forEach((filename) => {
    it(filename, async () => {
      const doc = await toDocxProcessor.process(
        fs.readFileSync(path.join(fixturesDir, filename)),
      );
      const z = new Zip((await doc.result) as any);
      for (const e of z.getEntries()) {
        if (e.entryName.match(/word\/.*\.xml$/)) {
          expect(z.readAsText(e)).toMatchSnapshot();
        }
      }
    });
  });
});
