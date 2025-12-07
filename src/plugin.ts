import type { Plugin } from "unified";
import type { Definition, Image, Root } from "mdast";
import { visit } from "unist-util-visit";
import {
  mdastToDocx,
  type DocxOptions,
  type ImageDataMap,
  type ImageData,
} from "./mdast-to-docx";
import { invariant } from "./utils";
import { parseLatex } from "./latex";

export type { DocxOptions };

declare module "unified" {
  interface CompileResultMap {
    docx: Promise<ArrayBuffer>;
  }
}

const plugin: Plugin<[DocxOptions?], Root, Promise<ArrayBuffer>> = function (
  opts = {},
) {
  let images: ImageDataMap = {};

  this.compiler = (node) => {
    return mdastToDocx(node as Root, opts, images, parseLatex);
  };

  return (async (node: Root) => {
    const imageList: (Image | Definition)[] = [];
    visit(node, "image", (node) => {
      imageList.push(node);
    });
    const defs = new Map<string, Definition>();
    visit(node, "definition", (node) => {
      defs.set(node.identifier, node);
    });
    visit(node, "imageReference", (node) => {
      const maybeImage = defs.get(node.identifier)!;
      if (maybeImage) {
        imageList.push(maybeImage);
      }
    });
    if (imageList.length === 0) {
      return node;
    }

    const imageResolver = opts.imageResolver;
    invariant(imageResolver, "options.imageResolver is not defined.");

    const resolved = new Set<string>();
    const promises: Promise<{ img: ImageData; url: string }>[] = [];
    imageList.forEach(({ url }) => {
      if (!resolved.has(url)) {
        resolved.add(url);
        promises.push(
          (async () => {
            const img = await imageResolver(url);
            return { img, url };
          })(),
        );
      }
    });
    images = (await Promise.all(promises)).reduce((acc, { img, url }) => {
      acc[url] = img;
      return acc;
    }, {} as ImageDataMap);
    return node;
  }) as any; // FIXME
};
export default plugin;
