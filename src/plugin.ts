import type { Plugin } from "unified";
import { IImageOptions, IPropertiesOptions } from "docx";
import { toDocx } from "mdast2docx";
import {
  htmlPlugin,
  imagePlugin,
  tablePlugin,
  listPlugin,
  mathPlugin,
} from "mdast2docx/dist/plugins";
import { Root } from "mdast";

export type ImageData = {
  image: IImageOptions["data"];
  width: number;
  height: number;
};

export type ImageResolver = (url: string) => Promise<ImageData> | ImageData;

export interface DocxOptions
  extends Pick<
    IPropertiesOptions,
    | "title"
    | "subject"
    | "creator"
    | "keywords"
    | "description"
    | "lastModifiedBy"
    | "revision"
    | "styles"
    | "background"
  > {
  /**
   * Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `blob` is `Promise<Blob>`.
   */
  output?: "buffer" | "blob";
  /**
   * **You must set** if your markdown includes images on node.js env. We have got you covered on browser. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts).
   */
  imageResolver?: ImageResolver;
}

/**
 * Default mdast2docx plugins used when none are provided in `sectionProps`.
 * For server-side (Node.js), excludes the `htmlPlugin` and `imagePlugin` to avoid DOM usage.
 */
const defaultPlugins = [
  htmlPlugin(),
  tablePlugin(),
  listPlugin(),
  mathPlugin(),
  imagePlugin(),
];

const plugin: Plugin<[DocxOptions?], Root> = function remarkDocxPlugin(
  opts = {}
) {
  const { imageResolver, output = "blob", ...docxProps } = opts;
  // @ts-ignore -- compiler does not support promise
  this.compiler = function (node: Root) {
    if (imageResolver)
      defaultPlugins[0] = imagePlugin({
        imageResolver: async (src) => {
          const { image, width, height } = await imageResolver(src);
          return {
            data: image,
            type: "png",
            transformation: { width, height },
          };
        },
      });
    const plugins =
      typeof window === "undefined"
        ? defaultPlugins.slice(imageResolver ? 0 : 1, -1) // server-side: skip html & image plugins
        : defaultPlugins;
    return toDocx(
      node,
      docxProps,
      { plugins },
      output === "buffer" ? "arraybuffer" : "blob"
    );
  };

  return (node) => node;
};

export default plugin;
