import type {
  ILevelsOptions,
  Paragraph,
  ParagraphChild,
  Table,
  TableOfContents,
} from "docx";
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

type Decoration = Readonly<{
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  link?: boolean;
}>;

type ListInfo = Readonly<{
  level: number;
  ordered: boolean;
  reference: string;
  checked?: boolean;
}>;

export type FootnoteRegistry = {
  ref: (id: string) => number;
  def: (id: string, children: Paragraph[]) => void;
  toConfig: () => {
    [key: string]: { children: Paragraph[] };
  };
};

export type NumberingRegistry = {
  create: () => string;
  toConfig: () => Array<{ reference: string; levels: ILevelsOptions[] }>;
};

export type Context = Readonly<{
  render: (node: readonly mdast.RootContent[], ctx?: Context) => DocxContent[];
  /**
   * @internal
   */
  deco: Decoration;
  /**
   * @internal
   */
  indent: number;
  /**
   * @internal
   */
  list?: ListInfo;
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
  numbering: NumberingRegistry;
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
