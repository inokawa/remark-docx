import React, { useCallback, useEffect, useRef, useState } from "react";
import type { StoryObj } from "@storybook/react-vite";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import math from "remark-math";
import docx from "../src";
import { imagePlugin } from "../src/plugins/image";
import { shikiPlugin } from "../src/plugins/shiki";
import { htmlPlugin } from "../src/plugins/html";
import { latexPlugin } from "../src/plugins/latex";
import { mermaidPlugin } from "../src/plugins/mermaid";
// @ts-expect-error no type definition
import readmeMd from "../README.md?raw";
// @ts-expect-error no type definition
import codeTs from "../src/mdast-util-to-docx.ts?raw";
// @ts-expect-error no type definition
import latexMd from "../fixtures/latex.md?raw";
// @ts-expect-error no type definition
import mermaidMd from "../fixtures/mermaid.md?raw";
import { saveAs } from "file-saver";
import { renderAsync } from "docx-preview";
import debounce from "lodash.debounce";

const toDocxProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(math)
  .use(docx, {
    plugins: [
      imagePlugin(),
      mermaidPlugin(),
      shikiPlugin({ theme: "everforest-dark" }),
      htmlPlugin(),
      latexPlugin(),
    ],
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

export const Latex: StoryObj = {
  render: () => <Component text={latexMd} />,
};

export const Mermaid: StoryObj = {
  render: () => <Component text={mermaidMd} />,
};

export const Html: StoryObj = {
  render: () => {
    const url = "https://en.wikipedia.org/w/rest.php/v1/page/HTML/html";
    const [html, setHtml] = useState("");
    useEffect(() => {
      (async () => {
        const res = await fetch(url);
        if (res.ok) {
          const h = await res.text();
          const dom = new DOMParser().parseFromString(h, "text/html");
          const serializer = new XMLSerializer();
          setHtml(
            [...dom.body.childNodes]
              .map((t) => serializer.serializeToString(t))
              .join("\n"),
          );
        } else {
          setHtml(`${res.status}: ${res.statusText}`);
        }
      })();
    }, []);
    return html ? (
      <Component
        text={`${url}

${html}`}
      />
    ) : (
      <div>loading...</div>
    );
  },
};
