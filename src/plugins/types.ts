import type { DocxContent } from "../types";
import type * as mdast from "../mdast";
import type { GetDefinition } from "mdast-util-definitions";

type KnownNodeType = mdast.RootContent["type"];

type MdastNode<T extends string> = T extends KnownNodeType
  ? Extract<mdast.RootContent, { type: T }>
  : unknown;

export type NodeOverrides = {
  [K in KnownNodeType]?: (
    node: MdastNode<K>,
    next: (node: any) => DocxContent[],
  ) => DocxContent | DocxContent[] | null;
};

export type RemarkDocxPlugin = (
  ctx: Readonly<{
    root: mdast.Root;
    definition: GetDefinition;
  }>,
) => Promise<NodeOverrides>;
