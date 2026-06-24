import type { Plugin, Transformer } from "unified";
import type { Root } from "mdast";
import { mdastToDocx, type DocxOptions } from "./mdast-util-to-docx";

export type { DocxOptions };

/**
 * @internal
 */
declare module "vfile" {
  interface DataMap {
    docx: Uint8Array;
  }
}

const plugin: Plugin<[DocxOptions?], Root, Uint8Array> = function (opts) {
  this.compiler = (_, file) => {
    // unified compiler must be a synchronous function according to the spec.
    // However this compiler is asynchrounous for a few inevitable reasons.
    // - `jszip` used by `docx` lib doesn't have synchronous zip function
    // - resolving assets such as images is asynchronous
    // So we use it in an async transformer and pass the result to compiler by VFile.data for now.
    return file.data.docx!;
  };

  const transformer: Transformer<Root, Root> = async (node, file) => {
    file.data.docx = await mdastToDocx(node as Root, opts);
    return node;
  };

  return transformer as any;
};
export default plugin;
