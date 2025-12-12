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
import { warnOnce } from "./utils";
import { definitions } from "mdast-util-definitions";
import type {
  Context,
  DocxChild,
  DocxContent,
  FootnoteDefinition,
  FootnoteRegistry,
  NodeBuilder,
  NodeBuilders,
  NumberingRegistry,
  RemarkDocxPlugin,
} from "./types";

const CONTENT_WIDTH =
  sectionPageSizeDefaults.WIDTH -
  sectionMarginDefaults.LEFT -
  sectionMarginDefaults.RIGHT;
const ORDERED_LIST_REF = "ordered";
const INDENT = 0.5;

type ListInfo = Readonly<{
  level: number;
  ordered: boolean;
  reference: string;
  checked?: boolean;
}>;

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

  const defaultBuilders: NodeBuilders = {
    paragraph: buildParagraph,
    heading: buildHeading,
    thematicBreak: buildThematicBreak,
    blockquote: buildBlockquote,
    list: buildList,
    listItem: buildListItem,
    table: buildTable,
    // tableRow
    // tableCell
    html: warnHtml,
    code: warnCode,
    definition: noop,
    footnoteDefinition: buildFootnoteDefinition,
    text: buildText,
    emphasis: buildEmphasis,
    strong: buildStrong,
    delete: buildDelete,
    inlineCode: buildInlineCode,
    break: buildBreak,
    link: buildLink,
    linkReference: buildLinkReference,
    image: warnImage,
    imageReference: warnImage,
    footnoteReference: buildFootnoteReference,
    math: warnMath,
    inlineMath: warnMath,
  };

  const builders = (
    await Promise.all(plugins.map((p) => p(pluginCtx)))
  ).reduceRight((acc, p) => ({ ...acc, ...p }), defaultBuilders);

  const ctx: Context = {
    next(nodes, c) {
      const results: DocxContent[] = [];
      for (const node of nodes) {
        const r = convertNode(node, builders, c ?? this);
        if (r) {
          results.push(...r);
        }
      }
      return results;
    },
    deco: {},
    indent: 0,
    definition: definition,
    footnote,
    numbering,
  };

  const nodes = ctx.next(node.children);

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

const convertNode = (
  node: mdast.RootContent,
  builders: NodeBuilders,
  ctx: Context,
): DocxContent[] | null => {
  const builder = builders[node.type];
  if (!builder) {
    warnOnce(`${node.type} node is not officially supported.`);
    return null;
  }
  const customNodes = builder(node as any, ctx);
  if (customNodes != null) {
    if (Array.isArray(customNodes)) {
      return customNodes;
    } else {
      return [customNodes];
    }
  }
  return null;
};

const buildParagraph: NodeBuilder<"paragraph"> = ({ children }, ctx) => {
  const list = ctx.list;
  const nodes = ctx.next(children);

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

const buildHeading: NodeBuilder<"heading"> = ({ children, depth }, ctx) => {
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
  const nodes = ctx.next(children);
  return new Paragraph({
    heading: headingLevel,
    children: nodes,
  });
};

const buildThematicBreak: NodeBuilder<"thematicBreak"> = () => {
  return new Paragraph({
    thematicBreak: true,
  });
};

const buildBlockquote: NodeBuilder<"blockquote"> = ({ children }, ctx) => {
  return ctx.next(children, {
    ...ctx,
    indent: ctx.indent + 1,
  });
};

const buildList: NodeBuilder<"list"> = ({ children, ordered }, ctx) => {
  const isTopLevel = !ctx.list;
  const list: ListInfo = {
    level: ctx.list ? ctx.list.level + 1 : 0,
    ordered: !!ordered,
    reference:
      isTopLevel && ordered
        ? ctx.numbering.create()
        : ctx.list?.reference || ORDERED_LIST_REF,
  };
  return ctx.next(children, {
    ...ctx,
    list,
  });
};

const buildListItem: NodeBuilder<"listItem"> = ({ children, checked }, ctx) => {
  return ctx.next(children, {
    ...ctx,
    ...(ctx.list && { list: { ...ctx.list, checked: checked ?? undefined } }),
  });
};

const buildTable: NodeBuilder<"table"> = ({ children, align }, ctx) => {
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
                children: ctx.next(c.children),
              }),
            ],
          });
        }),
      });
    }),
  });
};

const buildText: NodeBuilder<"text"> = ({ value }, { deco }) => {
  return new TextRun({
    text: value,
    bold: deco.strong,
    italics: deco.emphasis,
    strike: deco.delete,
  });
};

const buildEmphasis: NodeBuilder<"emphasis"> = ({ children }, ctx) => {
  return ctx.next(children, {
    ...ctx,
    deco: { ...ctx.deco, emphasis: true },
  });
};

const buildStrong: NodeBuilder<"strong"> = ({ children }, ctx) => {
  return ctx.next(children, {
    ...ctx,
    deco: { ...ctx.deco, strong: true },
  });
};

const buildDelete: NodeBuilder<"delete"> = ({ children }, ctx) => {
  return ctx.next(children, {
    ...ctx,
    deco: { ...ctx.deco, delete: true },
  });
};

const buildInlineCode: NodeBuilder<"inlineCode"> = ({ value }) => {
  return new TextRun({
    text: value,
    highlight: "lightGray",
  });
};

const buildBreak: NodeBuilder<"break"> = () => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink: NodeBuilder<"link"> = ({ children, url }, ctx) => {
  const nodes = ctx.next(children);
  return new ExternalHyperlink({
    link: url,
    children: nodes,
  });
};

const buildLinkReference: NodeBuilder<"linkReference"> = (
  { children, identifier },
  ctx,
) => {
  const def = ctx.definition(identifier);
  if (def == null) {
    return ctx.next(children);
  }
  return buildLink({ type: "link", children, url: def.url }, ctx);
};

const buildFootnoteDefinition: NodeBuilder<"footnoteDefinition"> = (
  { children, identifier },
  ctx,
) => {
  const definition: FootnoteDefinition = {
    children: children.map((node) => {
      // Convert each node and extract the first result as a paragraph
      const nodes = ctx.next([node]);
      if (nodes[0] instanceof Paragraph) {
        return nodes[0] as Paragraph;
      }
      // For non-paragraph content, wrap in a paragraph
      return new Paragraph({ children: nodes });
    }),
  };
  ctx.footnote.def(identifier, definition);
  return null;
};

const buildFootnoteReference: NodeBuilder<"footnoteReference"> = (
  { identifier },
  ctx,
) => {
  return new FootnoteReferenceRun(ctx.footnote.ref(identifier));
};

const noop = () => {
  return null;
};

const warnImage = (node: { type: string }) => {
  warnOnce(
    `${node.type} node is not rendered since remark-docx/plugins/image is not provided.`,
  );
  return null;
};

const warnCode = (node: { type: string }) => {
  warnOnce(
    `${node.type} node is not rendered since remark-docx/plugins/code is not provided.`,
  );
  return null;
};

const warnHtml = (node: { type: string }) => {
  warnOnce(
    `${node.type} node is not rendered since remark-docx/plugins/html is not provided.`,
  );
  return null;
};

const warnMath = (node: { type: string }) => {
  warnOnce(
    `${node.type} node is not rendered since remark-docx/plugins/math is not provided.`,
  );
  return null;
};
