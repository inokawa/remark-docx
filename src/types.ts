import type { Paragraph, ParagraphChild, Table, TableOfContents } from "docx";
import type * as mdast from "mdast";
import type { GetDefinition } from "mdast-util-definitions";
import type { SupportedImageType } from "./utils";

/**
 * @internal
 */
export type Writeable<T> = {
  -readonly [key in keyof T]: T[key];
};

export type DocxContent = Paragraph | Table | TableOfContents | ParagraphChild;

type KnownNodeType = mdast.RootContent["type"];

type MdastNode<T extends string> = T extends KnownNodeType
  ? Extract<mdast.RootContent, { type: T }>
  : unknown;

export type DocxImageData = Readonly<
  {
    data: ArrayBuffer;
    width: number;
    height: number;
  } & (
    | { type: Exclude<SupportedImageType, "svg"> }
    | {
        type: Extract<SupportedImageType, "svg">;
        fallback: ArrayBuffer;
      }
  )
>;

type StyleContext = Readonly<{
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  inlineCode?: boolean;
  link?: boolean;
}>;

export type ListContext = Readonly<{
  level: number;
  meta: Readonly<
    | {
        type: "bullet";
      }
    | {
        type: "ordered";
        reference: string;
      }
    | {
        type: "task";
        checked: boolean;
      }
  >;
}>;

export type FootnoteRegistry = {
  id: (id: string) => number;
  set: (id: number, children: Paragraph[]) => void;
  toConfig: () => {
    [key: string]: { children: Paragraph[] };
  };
};

export type ThematicBreakType = "page" | "section" | "line";

export type Context = Readonly<{
  render: (node: readonly mdast.RootContent[], ctx?: Context) => DocxContent[];
  width: number;
  style: StyleContext;
  quote?: number;
  list?: ListContext;
  thematicBreak: ThematicBreakType;
  rtl?: boolean;
  definition: GetDefinition;
  images: ReadonlyMap<string, DocxImageData | null>;
  footnote: FootnoteRegistry;
  orderedId: () => string;
}>;

export type NodeBuilder<T extends string> = (
  node: MdastNode<T>,
  ctx: Context,
) => DocxContent | DocxContent[] | null;

export type NodeBuilders = {
  [K in KnownNodeType]?: NodeBuilder<K>;
};

export type RemarkDocxPlugin = (
  ctx: Readonly<{
    root: mdast.Root;
    images: Map<string, DocxImageData | null>;
    definition: GetDefinition;
  }>,
) => Promise<NodeBuilders>;
