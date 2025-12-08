import React, { useEffect, useRef } from "react";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import math from "remark-math";
import docx from "../src";
import { imagePlugin } from "../src/plugins/image";
import TextEditor from "./components/text-editor";
// @ts-expect-error no type definition
import text from "../fixtures/article.md?raw";
import { saveAs } from "file-saver";
import { renderAsync } from "docx-preview";

const toDocxProcessor = unified()
  .use(markdown)
  .use(gfm)
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
  const previewRef = useRef<HTMLDivElement>(null);
  const onChange = async (v: string) => {
    const el = previewRef.current;
    if (!el) return;
    const blob = await toDocx(v);
    renderAsync(blob, el);
  };

  useEffect(() => {
    onChange(text);
  }, []);

  return (
    <>
      <div>
        <button
          onClick={async () => {
            if (!ref.current) return;
            const buffer = await toDocx(ref.current.value);
            saveAs(new Blob([buffer]), "example.docx");
          }}
        >
          {"download docx"}
        </button>{" "}
        <span>Live preview may be different from the real Word rendering</span>
      </div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          fontSize: "10.5pt",
        }}
      >
        <TextEditor ref={ref} initialValue={text} onChange={onChange} />
        <div style={{ flex: 1, overflow: "auto" }}>
          <div ref={previewRef} style={{ flex: "none" }} />
        </div>
      </div>
    </>
  );
};
