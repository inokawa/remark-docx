import type { RemarkDocxPlugin } from "../../types";
import { warnOnce } from "../../utils";
import mermaid from "mermaid";
import { visit } from "unist-util-visit";
import { imageSize } from "image-size";
import { browserSvgToPng } from "../image";
import { Paragraph } from "docx";

const browserRender = async (value: string): Promise<string> => {
  const element = document.createElement("div");
  element.style.visibility = "hidden";
  document.body.appendChild(element);
  try {
    const result = await mermaid.render("mermaid", value, element);
    return result.svg;
  } finally {
    document.body.removeChild(element);
  }
};

/**
 * A plugin to render Mermaid inside "code" nodes with "mermaid" language.
 */
export const mermaidPlugin = (): RemarkDocxPlugin => {
  const renderSvg = browserRender;

  return async ({ root, images }) => {
    const promises: Promise<void>[] = [];
    visit(root, "code", ({ lang, value }) => {
      if (lang === "mermaid") {
        if (!images.has(value)) {
          images.set(value, null);

          promises.push(
            (async () => {
              try {
                const svg = await renderSvg(value);
                const data = new TextEncoder().encode(svg);
                const { width, height } = imageSize(data);
                const pngBuffer = await browserSvgToPng({
                  buffer: data.buffer,
                  width,
                  height,
                });

                images.set(value, {
                  type: "png",
                  width,
                  height,
                  data: pngBuffer,
                });
              } catch (e) {
                warnOnce(String(e));
              }
            })(),
          );
        }
      }
    });

    await Promise.all(promises);

    return {
      code: ({ lang, value }, ctx) => {
        if (lang !== "mermaid") {
          return null;
        }
        const image = ctx.images.get(value);
        if (image == null) {
          return null;
        }

        return new Paragraph({
          children: ctx.render([{ type: "image", url: value }]),
        });
      },
    };
  };
};
