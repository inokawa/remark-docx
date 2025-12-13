import type { Plugin } from "unified";
import type { Root } from "mdast";
import { mdastToDocx, type DocxOptions } from "./mdast-util-to-docx";

export type { DocxOptions };

declare module "unified" {
  interface CompileResultMap {
    docx: Promise<ArrayBuffer>;
  }
}

const plugin: Plugin<[DocxOptions?], Root, Promise<ArrayBuffer>> = function (
  opts,
) {
  this.compiler = (node) => {
    return mdastToDocx(node as Root, opts);
  };
};
export default plugin;
