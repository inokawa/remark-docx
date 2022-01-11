import fs from "fs";
import path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import footnotes from "remark-footnotes";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import { File } from "docx";
import { Formatter } from "docx/src/export/formatter";
import docx from ".";

const FIXTURE_PATH = "../fixtures";

describe("e2e", () => {
  const toDocxProcessor = unified()
    .use(markdown)
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(frontmatter, ["yaml", "toml"])
    .use(math)
    .use(docx, {
      output: "raw",
      imageResolver: (url) => ({
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
        fs.readFileSync(path.join(fixturesDir, filename))
      );
      expect(
        new Formatter().format((doc.result as File).Document.View.Body)
      ).toMatchSnapshot();
    });
  });
});
