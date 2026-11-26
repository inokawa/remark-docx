import type * as mdast from "mdast";
import { Paragraph, type ParagraphChild } from "docx";
import { visit } from "unist-util-visit";
import type { RemarkDocxPlugin } from "../../types";
import { warnOnce } from "../../utils";

type ImageSource = ArrayBuffer | Uint8Array;

export interface CodeToImagePluginOptions {
  /**
   * A function to render a "code" node to image data, such as PNG and SVG.
   * Images other than PNG, JPEG, GIF and BMP are converted with `toPng` of `image` option, like images in the document.
   * Return `null` to leave the node to other plugins, for example when its language is not the target.
   */
  render: (
    node: mdast.Code,
  ) => ImageSource | null | undefined | Promise<ImageSource | null | undefined>;
}

let instanceCount = 0;

/**
 * A plugin to render "code" nodes as images, such as diagrams and charts written in their own languages.
 */
export const codeToImagePlugin = ({
  render,
}: CodeToImagePluginOptions): RemarkDocxPlugin => {
  // NUL can't be in urls of Markdown, so the keys don't conflict with images in the document.
  const prefix = `\0code-to-image-${instanceCount++}\0`;
  const keyOf = ({ lang, meta, value }: mdast.Code): string =>
    prefix + JSON.stringify([lang, meta, value]);

  return async ({ root, images, readImage }) => {
    const promises: Promise<void>[] = [];
    visit(root, "code", (node) => {
      const key = keyOf(node);
      if (images.has(key)) {
        return;
      }
      images.set(key, null);

      promises.push(
        (async () => {
          const name = `${node.lang ?? ""} code`;
          let source: ImageSource | null | undefined;
          try {
            source = await render(node);
          } catch (e) {
            warnOnce(`Failed to render ${name}: ${e}`);
            return;
          }
          if (source == null) {
            return;
          }
          const image = await readImage(source, name);
          if (image) {
            images.set(key, image);
          }
        })(),
      );
    });

    await Promise.all(promises);

    return {
      code: (node, ctx) => {
        const key = keyOf(node);
        if (!ctx.images.get(key)) {
          return null;
        }
        return new Paragraph({
          children: ctx.render([
            { type: "image", url: key },
          ]) as ParagraphChild[],
        });
      },
    };
  };
};
