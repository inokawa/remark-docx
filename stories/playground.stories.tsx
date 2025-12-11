import React, { useCallback, useEffect, useRef } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import math from "remark-math";
import docx from "../src";
import { imagePlugin } from "../src/plugins/image";
import { shikiPlugin } from "../src/plugins/code";
// @ts-expect-error no type definition
import readmeMd from "../README.md?raw";
// @ts-expect-error no type definition
import codeTs from "../src/mdast-to-docx.ts?raw";
import { saveAs } from "file-saver";
import { renderAsync } from "docx-preview";
import debounce from "lodash.debounce";

const toDocxProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(math)
  .use(docx, {
    plugins: [imagePlugin(), shikiPlugin({ theme: "everforest-dark" })],
  });

const toDocx = async (s: string) => {
  const doc = await toDocxProcessor.process(s);
  return doc.result;
};

export default {
  title: "Playground",
};

const Component = ({ text }: { text: string }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const onChange = async (v: string) => {
    const el = previewRef.current;
    if (!el) return;
    const buffer = await toDocx(v);
    renderAsync(buffer, el);
  };

  useEffect(() => {
    onChange(text);
  }, []);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          fontSize: "10.5pt",
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
          </button>{" "}
          <span>
            Live preview may be different from the real Word rendering
          </span>
        </div>
        <textarea
          ref={ref}
          style={{ flex: 1 }}
          defaultValue={text}
          onChange={useCallback(
            debounce(
              (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange(e.target.value),
              2000,
            ),
            [],
          )}
        />
        <div style={{ flex: 1, overflow: "auto" }}>
          <div ref={previewRef} style={{ flex: "none" }} />
        </div>
      </div>
    </>
  );
};

export const Readme: StoryObj = {
  render: () => <Component text={readmeMd} />,
};

export const Code: StoryObj = {
  render: () => <Component text={"```ts\n" + codeTs + "\n```"} />,
};
