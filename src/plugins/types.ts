import type { DocxContent } from "../types";
import type * as mdast from "../mdast";

type KnownNodeType = mdast.RootContent["type"];

type MdastNode<T extends string> = T extends KnownNodeType
  ? Extract<mdast.RootContent, { type: T }>
  : unknown;

export type RemarkDocxOverrides = {
  [K in KnownNodeType]?: (
    node: MdastNode<K>,
    next: (node: any) => DocxContent[],
  ) => DocxContent[] | undefined;
};
