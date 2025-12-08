import type { Paragraph, ParagraphChild, Table, TableOfContents } from "docx";
import type * as mdast from "./mdast";
import type { GetDefinition } from "mdast-util-definitions";

export type DocxChild = Paragraph | Table | TableOfContents;
export type DocxContent = DocxChild | ParagraphChild;

type KnownNodeType = mdast.RootContent["type"];

type MdastNode<T extends string> = T extends KnownNodeType
  ? Extract<mdast.RootContent, { type: T }>
  : unknown;

export type NodeOverrides = {
  [K in KnownNodeType]?: (
    node: MdastNode<K>,
    next: (node: mdast.RootContent[]) => DocxContent[],
  ) => DocxContent | DocxContent[] | null;
};

export type RemarkDocxPlugin = (
  ctx: Readonly<{
    root: mdast.Root;
    definition: GetDefinition;
  }>,
) => Promise<NodeOverrides>;
