import { unified } from "unified";
import markdown from "remark-parse";
import footnotes from "remark-footnotes";
import docx from "./src/index";
import * as fs from "fs";

const processor = unified()
  .use(markdown)
  .use(footnotes, { inlineNotes: true })
  .use(docx, { 
    output: "buffer",
    imageResolver: () => ({
      image: new Uint8Array(),
      width: 600,
      height: 400,
    }),
  });

// Use the same content as the working test fixture
const text = fs.readFileSync('./fixtures/node-footnotes.md', 'utf8');

(async () => {
  const doc = await processor.process(text);
  const buffer = await doc.result as Buffer;
  
  // Ensure output directory exists
  const outputDir = './output';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write file to output folder
  const outputPath = `${outputDir}/fixture-test.docx`;
  fs.writeFileSync(outputPath, buffer);
  console.log(`File written to: ${outputPath}`);
})();