import React, { useRef } from "react";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import docx from "../src";
import { imagePlugin } from "../src/plugins/image";
// @ts-expect-error no type definition
import text from "../fixtures/article.md?raw";
import { saveAs } from "file-saver";

const toDocxProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(math)
  .use(docx, {
    plugins: [imagePlugin()],
  });

const toDocx = async (s: string) => {
  const doc = await toDocxProcessor.process(s);
  return doc.result;
};

export default {
  title: "Playground",
};

export const MarkdownToDocx = () => {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      style={{
        height: "calc(100vh - 16px)",
        display: "flex",
        flexDirection: "column",
        fontSize: "10.5pt",
        padding: 8,
        gap: 4,
      }}
    >
      <div>
        <button
          onClick={async () => {
            if (!ref.current) return;
            const buffer = await toDocx(ref.current.value);
            saveAs(new Blob([buffer]), "example.docx");
          }}
        >
          {"download docx"}
        </button>
      </div>
      <textarea ref={ref} style={{ flex: 1 }} defaultValue={text} />
    </div>
  );
};
