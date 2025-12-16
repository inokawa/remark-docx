import type { Paragraph, ParagraphChild, Table, TableOfContents } from "docx";
import type * as mdast from "mdast";
import type { GetDefinition } from "mdast-util-definitions";

/**
 * @internal
 */
export type Writeable<T> = {
  -readonly [key in keyof T]: T[key];
};

export type DocxChild = Paragraph | Table | TableOfContents;
export type DocxContent = DocxChild | ParagraphChild;

type KnownNodeType = mdast.RootContent["type"];

type MdastNode<T extends string> = T extends KnownNodeType
  ? Extract<mdast.RootContent, { type: T }>
  : unknown;

type DecorationContext = Readonly<{
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
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
  ref: (id: string) => number;
  def: (id: string, children: Paragraph[]) => void;
  toConfig: () => {
    [key: string]: { children: Paragraph[] };
  };
};

export type ThematicBreakType = "page" | "section";

export type Context = Readonly<{
  render: (node: readonly mdast.RootContent[], ctx?: Context) => DocxContent[];
  /**
   * @internal
   */
  width: number;
  /**
   * @internal
   */
  deco: DecorationContext;
  /**
   * @internal
   */
  indent: number;
  /**
   * @internal
   */
  list?: ListContext;
  /**
   * @internal
   */
  thematicBreak: ThematicBreakType;
  /**
   * @internal
   */
  definition: GetDefinition;
  /**
   * @internal
   */
  footnote: FootnoteRegistry;
  /**
   * @internal
   */
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
    definition: GetDefinition;
  }>,
) => Promise<NodeBuilders>;
