import React, { useMemo, useRef, useState } from "react";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import docx from "../src";
import TextEditor from "./components/text-editor";
// @ts-expect-error no type definition
import text from "../fixtures/article.md";
import { saveAs } from "file-saver";

const fetchImage = async (
  url: string
): Promise<{ image: ArrayBuffer; width: number; height: number }> => {
  const image = new Image();
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve({
        image: buf,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = reject;
    image.src = URL.createObjectURL(new Blob([buf], { type: "image/png" }));
  });
};

const toDocxProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(docx, {
    output: "blob",
    imageResolver: fetchImage,
  });

const toDocx = async (s: string) => {
  const doc = await toDocxProcessor.process(s);
  return doc.result;
};

export default {
  title: "Playground",
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={useMemo(
      () => ({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        fontSize: "10.5pt",
      }),
      []
    )}
  >
    {children}
  </div>
);

export const MarkdownToDocx = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={async () => {
            if (!ref.current) return;
            const blob = await toDocx(ref.current.value);
            saveAs(blob, "example.docx");
          }}
        >
          {"convert to docx"}
        </button>
      </div>
      <Wrapper>
        <TextEditor ref={ref} initialValue={text} />
      </Wrapper>
    </>
  );
};
