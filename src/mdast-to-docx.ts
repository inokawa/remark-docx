import {
  convertInchesToTwip,
  Packer,
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  AlignmentType,
  type ILevelsOptions,
  FootnoteReferenceRun,
  CheckBox,
  type IPropertiesOptions,
  sectionPageSizeDefaults,
  sectionMarginDefaults,
} from "docx";
import type * as mdast from "./mdast";
import { invariant, warnOnce } from "./utils";
import { definitions, type GetDefinition } from "mdast-util-definitions";
import type {
  DocxChild,
  DocxContent,
  NodeOverrides,
  RemarkDocxPlugin,
} from "./types";

const CONTENT_WIDTH =
  sectionPageSizeDefaults.WIDTH -
  sectionMarginDefaults.LEFT -
  sectionMarginDefaults.RIGHT;
const ORDERED_LIST_REF = "ordered";
const INDENT = 0.5;

type Decoration = Readonly<{
  [key in (mdast.Emphasis | mdast.Strong | mdast.Delete)["type"]]?: true;
}>;

type ListInfo = Readonly<{
  level: number;
  ordered: boolean;
  reference: string;
  checked?: boolean;
}>;

type FootnoteDefinition = Readonly<{ children: Paragraph[] }>;
type FootnoteRegistry = {
  ref: (id: string) => number;
  def: (id: string, def: FootnoteDefinition) => void;
  toConfig: () => {
    [key: string]: FootnoteDefinition;
  };
};

const createFootnoteRegistry = (): FootnoteRegistry => {
  const idToInternalId = new Map<string, number>();
  const defs = new Map<number, FootnoteDefinition>();

  const getId = (id: string): number => {
    let internalId = idToInternalId.get(id);
    if (internalId == null) {
      idToInternalId.set(id, (internalId = idToInternalId.size + 1));
    }
    return internalId;
  };

  return {
    ref: (id) => {
      return getId(id);
    },
    def: (id, def) => {
      const internalId = getId(id);
      defs.set(internalId, def);
    },
    toConfig: () => {
      return defs.entries().reduce(
        (acc, [key, def]) => {
          acc[key] = def;
          return acc;
        },
        {} as {
          [key: string]: FootnoteDefinition;
        },
      );
    },
  };
};

type NumberingRegistry = {
  create: () => string;
  toConfig: () => Array<{ reference: string; levels: ILevelsOptions[] }>;
};

const createNumberingRegistry = (): NumberingRegistry => {
  let counter = 1;

  const DEFAULT_NUMBERINGS: ILevelsOptions[] = [
    {
      level: 0,
      format: LevelFormat.DECIMAL,
      text: "%1.",
      alignment: AlignmentType.START,
    },
    {
      level: 1,
      format: LevelFormat.DECIMAL,
      text: "%2.",
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: { start: convertInchesToTwip(INDENT * 1) },
        },
      },
    },
    {
      level: 2,
      format: LevelFormat.DECIMAL,
      text: "%3.",
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: { start: convertInchesToTwip(INDENT * 2) },
        },
      },
    },
    {
      level: 3,
      format: LevelFormat.DECIMAL,
      text: "%4.",
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: { start: convertInchesToTwip(INDENT * 3) },
        },
      },
    },
    {
      level: 4,
      format: LevelFormat.DECIMAL,
      text: "%5.",
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: { start: convertInchesToTwip(INDENT * 4) },
        },
      },
    },
    {
      level: 5,
      format: LevelFormat.DECIMAL,
      text: "%6.",
      alignment: AlignmentType.START,
      style: {
        paragraph: {
          indent: { start: convertInchesToTwip(INDENT * 5) },
        },
      },
    },
  ];

  return {
    create: () => {
      return `${ORDERED_LIST_REF}-${counter++}`;
    },
    toConfig: () => {
      return Array.from({ length: counter }, (_, i) => ({
        reference: `${ORDERED_LIST_REF}-${i}`,
        levels: DEFAULT_NUMBERINGS,
      }));
    },
  };
};

type Context = Readonly<{
  overrides: NodeOverrides;
  deco: Decoration;
  indent: number;
  list?: ListInfo;
  definition: GetDefinition;
  footnote: FootnoteRegistry;
  numbering: NumberingRegistry;
}>;

export interface DocxOptions extends Pick<
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
   * Plugins to customize how mdast nodes are transformed.
   */
  plugins?: RemarkDocxPlugin[];
}

export const mdastToDocx = async (
  node: mdast.Root,
  {
    plugins = [],
    title,
    subject,
    creator,
    keywords,
    description,
    lastModifiedBy,
    revision,
    styles,
    background,
  }: DocxOptions,
): Promise<ArrayBuffer> => {
  const definition = definitions(node);

  const footnote = createFootnoteRegistry();
  const numbering = createNumberingRegistry();

  const pluginCtx = { root: node, definition };
  const nodes = convertNodes(node.children, {
    overrides: (
      await Promise.all(plugins.map((p) => p(pluginCtx)))
    ).reduceRight((acc, p) => ({ acc, ...p }), {}),
    deco: {},
    indent: 0,
    definition: definition,
    footnote,
    numbering,
  });

  const doc = new Document({
    title,
    subject,
    creator,
    keywords,
    description,
    lastModifiedBy,
    revision,
    styles,
    background,
    footnotes: footnote.toConfig(),
    sections: [{ children: nodes as DocxChild[] }],
    numbering: {
      config: numbering.toConfig(),
    },
  });

  return Packer.toArrayBuffer(doc);
};

const convertNodes = (
  nodes: mdast.RootContent[],
  ctx: Context,
): DocxContent[] => {
  const results: DocxContent[] = [];
  for (const node of nodes) {
    const customNodes = ctx.overrides[node.type]?.(node as any, (children) =>
      convertNodes(children, ctx),
    );
    if (customNodes != null) {
      if (Array.isArray(customNodes)) {
        results.push(...customNodes);
      } else {
        results.push(customNodes);
      }
      continue;
    }

    switch (node.type) {
      case "paragraph": {
        results.push(buildParagraph(node, ctx));
        break;
      }
      case "heading": {
        results.push(buildHeading(node, ctx));
        break;
      }
      case "thematicBreak":
        results.push(buildThematicBreak(node));
        break;
      case "blockquote": {
        results.push(...buildBlockquote(node, ctx));
        break;
      }
      case "list": {
        results.push(...buildList(node, ctx));
        break;
      }
      case "listItem":
        invariant(false, "unreachable");
      case "table":
        results.push(buildTable(node, ctx));
        break;
      case "tableRow":
        invariant(false, "unreachable");
      case "tableCell":
        invariant(false, "unreachable");
      case "html":
        warnOnce(
          `${node.type} node is not rendered since remark-docx/plugins/html is not provided.`,
        );
        break;
      case "code":
        results.push(buildCode(node));
        break;
      // case "yaml":
      //   // unimplemented
      //   break;
      // case "toml":
      //   // unimplemented
      //   break;
      case "definition":
        // noop
        break;
      case "footnoteDefinition": {
        registerFootnoteDefinition(node, ctx);
        break;
      }
      case "text":
        results.push(buildText(node.value, ctx.deco));
        break;
      case "emphasis":
      case "strong":
      case "delete": {
        const { type, children } = node;
        const nodes = convertNodes(children, {
          ...ctx,
          deco: { ...ctx.deco, [type]: true },
        });
        results.push(...nodes);
        break;
      }
      case "inlineCode":
        results.push(buildInlineCode(node));
        break;
      case "break":
        results.push(buildBreak(node));
        break;
      case "link": {
        results.push(buildLink(node, ctx));
        break;
      }
      case "linkReference":
        results.push(...buildLinkReference(node, ctx));
        break;
      case "image":
      case "imageReference": {
        warnOnce(
          `${node.type} node is not rendered since remark-docx/plugins/image is not provided.`,
        );
        break;
      }
      // case "footnote": {
      //   // inline footnote was removed in mdast v5
      //   break;
      // }
      case "footnoteReference":
        results.push(buildFootnoteReference(node, ctx));
        break;
      case "math":
      case "inlineMath":
        warnOnce(
          `${node.type} node is not rendered since remark-docx/plugins/math is not provided.`,
        );
        break;
      default:
        warnOnce(`${node.type} node is not officially supported.`);
        break;
    }
  }
  return results;
};

const buildParagraph = (
  { children }: mdast.Paragraph,
  ctx: Context,
): DocxContent => {
  const list = ctx.list;
  const nodes = convertNodes(children, ctx);

  if (list && list.checked != null) {
    nodes.unshift(
      new CheckBox({
        checked: list.checked,
        checkedState: { value: "2611" },
        uncheckedState: { value: "2610" },
      }),
    );
  }
  return new Paragraph({
    children: nodes,
    indent:
      ctx.indent > 0
        ? {
            start: convertInchesToTwip(INDENT * ctx.indent),
          }
        : undefined,
    ...(list &&
      (list.ordered
        ? {
            numbering: {
              reference: list.reference,
              level: list.level,
            },
          }
        : {
            bullet: {
              level: list.level,
            },
          })),
  });
};

const buildHeading = (
  { children, depth }: mdast.Heading,
  ctx: Context,
): DocxContent => {
  let headingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel];
  switch (depth) {
    case 1:
      headingLevel = HeadingLevel.TITLE;
      break;
    case 2:
      headingLevel = HeadingLevel.HEADING_1;
      break;
    case 3:
      headingLevel = HeadingLevel.HEADING_2;
      break;
    case 4:
      headingLevel = HeadingLevel.HEADING_3;
      break;
    case 5:
      headingLevel = HeadingLevel.HEADING_4;
      break;
    case 6:
      headingLevel = HeadingLevel.HEADING_5;
      break;
  }
  const nodes = convertNodes(children, ctx);
  return new Paragraph({
    heading: headingLevel,
    children: nodes,
  });
};

const buildThematicBreak = (_: mdast.ThematicBreak): DocxContent => {
  return new Paragraph({
    thematicBreak: true,
  });
};

const buildBlockquote = (
  { children }: mdast.Blockquote,
  ctx: Context,
): DocxContent[] => {
  return convertNodes(children, {
    ...ctx,
    indent: ctx.indent + 1,
  });
};

const buildList = (
  { children, ordered }: mdast.List,
  ctx: Context,
): DocxContent[] => {
  const isTopLevel = !ctx.list;
  const list: ListInfo = {
    level: ctx.list ? ctx.list.level + 1 : 0,
    ordered: !!ordered,
    reference:
      isTopLevel && ordered
        ? ctx.numbering.create()
        : ctx.list?.reference || ORDERED_LIST_REF,
  };
  return children.flatMap((item) => {
    return buildListItem(item, {
      ...ctx,
      list,
    });
  });
};

const buildListItem = (
  { children, checked }: mdast.ListItem,
  ctx: Context,
): DocxContent[] => {
  return convertNodes(children, {
    ...ctx,
    ...(ctx.list && { list: { ...ctx.list, checked: checked ?? undefined } }),
  });
};

const buildTable = (
  { children, align }: mdast.Table,
  ctx: Context,
): DocxContent => {
  const cellAligns:
    | (typeof AlignmentType)[keyof typeof AlignmentType][]
    | undefined = align?.map((a) => {
    switch (a) {
      case "left":
        return AlignmentType.LEFT;
      case "right":
        return AlignmentType.RIGHT;
      case "center":
        return AlignmentType.CENTER;
      default:
        return AlignmentType.LEFT;
    }
  });

  const columnLength = children[0]!.children.length;
  const columnWidth = CONTENT_WIDTH / columnLength;

  return new Table({
    columnWidths: Array.from({ length: columnLength }).map(() => columnWidth),
    rows: children.map((r) => {
      return new TableRow({
        children: r.children.map((c, i) => {
          return new TableCell({
            width: { size: columnWidth, type: "dxa" },
            children: [
              new Paragraph({
                alignment: cellAligns?.[i],
                children: convertNodes(c.children, ctx),
              }),
            ],
          });
        }),
      });
    }),
  });
};

const buildCode = ({
  value,
  lang: _lang,
  meta: _meta,
}: mdast.Code): DocxContent => {
  // FIXME: transform to text for now
  return new Paragraph({
    children: [buildText(value, {})],
  });
};

const buildText = (text: string, deco: Decoration): DocxContent => {
  return new TextRun({
    text,
    bold: deco.strong,
    italics: deco.emphasis,
    strike: deco.delete,
  });
};

const buildInlineCode = ({ value }: mdast.InlineCode): DocxContent => {
  return new TextRun({
    text: value,
    highlight: "lightGray",
  });
};

const buildBreak = (_: mdast.Break): DocxContent => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink = (
  { children, url }: Pick<mdast.Link, "children" | "url">,
  ctx: Context,
): DocxContent => {
  const nodes = convertNodes(children, ctx);
  return new ExternalHyperlink({
    link: url,
    children: nodes,
  });
};

const buildLinkReference = (
  { children, identifier }: mdast.LinkReference,
  ctx: Context,
): DocxContent[] => {
  const def = ctx.definition(identifier);
  if (def == null) {
    return convertNodes(children, ctx);
  }
  return [buildLink({ children, url: def.url }, ctx)];
};

const registerFootnoteDefinition = (
  { children, identifier }: mdast.FootnoteDefinition,
  ctx: Context,
): void => {
  const definition: FootnoteDefinition = {
    children: children.map((node) => {
      // Convert each node and extract the first result as a paragraph
      const nodes = convertNodes([node], ctx);
      if (nodes[0] instanceof Paragraph) {
        return nodes[0] as Paragraph;
      }
      // For non-paragraph content, wrap in a paragraph
      return new Paragraph({ children: nodes });
    }),
  };
  ctx.footnote.def(identifier, definition);
};

const buildFootnoteReference = (
  { identifier }: mdast.FootnoteReference,
  ctx: Context,
): DocxContent => {
  return new FootnoteReferenceRun(ctx.footnote.ref(identifier));
};
