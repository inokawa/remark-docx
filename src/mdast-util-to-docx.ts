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
  type IRunOptions,
  type IParagraphOptions,
} from "docx";
import type * as mdast from "mdast";
import { warnOnce } from "./utils";
import { definitions } from "mdast-util-definitions";
import type {
  Context,
  DocxChild,
  DocxContent,
  FootnoteRegistry,
  ListInfo,
  NodeBuilder,
  NodeBuilders,
  RemarkDocxPlugin,
  Writeable,
} from "./types";

const CONTENT_WIDTH =
  sectionPageSizeDefaults.WIDTH -
  sectionMarginDefaults.LEFT -
  sectionMarginDefaults.RIGHT;
const ORDERED_LIST_REF = "ordered";
const TASK_LIST_REF = "task";
const HYPERLINK_STYLE_ID = "Hyperlink";
const INLINE_CODE_STYLE_ID = "InlineCode";
const INDENT = 0.5;

const createFootnoteRegistry = (): FootnoteRegistry => {
  const idToInternalId = new Map<string, number>();
  const defs = new Map<number, Paragraph[]>();

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
          acc[key] = { children: def };
          return acc;
        },
        {} as {
          [key: string]: { children: Paragraph[] };
        },
      );
    },
  };
};

type ListFormat = {
  format: keyof typeof LevelFormat;
  text: string;
};

type NumberingRegistry = {
  createId: () => string;
  getIds: () => string[];
};
const createNumberingRegistry = (): NumberingRegistry => {
  let counter = 1;

  return {
    createId: () => {
      return `${ORDERED_LIST_REF}-${counter++}`;
    },
    getIds: () => {
      return Array.from(
        { length: counter },
        (_, i) => `${ORDERED_LIST_REF}-${i}`,
      );
    },
  };
};

const composeBuilders = (
  pluginsBuilders: readonly NodeBuilders[],
  defaultBuilders: NodeBuilders,
): NodeBuilders => {
  return pluginsBuilders.reduceRight<NodeBuilders>((acc, p) => {
    type Key = keyof typeof p;
    for (const [k, cur] of Object.entries(p)) {
      const prev = acc[k as Key];
      acc[k as Key] = (
        prev
          ? (n, c) => {
              const r = cur(n as any, c);
              if (r) {
                return r;
              }
              return prev(n as any, c);
            }
          : cur
      ) as NodeBuilder<any>;
    }
    return acc;
  }, defaultBuilders);
};
const defaultTaskList: ListFormat[] = [
  { text: "", format: "NONE" },
  { text: "", format: "NONE" },
  { text: "", format: "NONE" },
  { text: "", format: "NONE" },
  { text: "", format: "NONE" },
  { text: "", format: "NONE" },
];

const defaultOrderedList: ListFormat[] = [
  { text: "%1.", format: "DECIMAL" },
  { text: "%2.", format: "DECIMAL" },
  { text: "%3.", format: "DECIMAL" },
  { text: "%4.", format: "DECIMAL" },
  { text: "%5.", format: "DECIMAL" },
  { text: "%6.", format: "DECIMAL" },
];

const buildLevels = (formats: readonly ListFormat[]): ILevelsOptions[] =>
  formats.map(({ format, text }, i) => {
    return {
      level: i,
      format: LevelFormat[format],
      text: text,
      alignment: AlignmentType.START,
      style:
        i === 0
          ? undefined
          : {
              paragraph: {
                indent: { start: convertInchesToTwip(INDENT * i) },
              },
            },
    };
  });

export interface DocxOptions extends Pick<
  IPropertiesOptions,
  | "title"
  | "subject"
  | "creator"
  | "keywords"
  | "description"
  | "styles"
  | "background"
> {
  /**
   * An option to override the text format of ordered list.
   * See https://docx.js.org/#/usage/numbering?id=level-options for more details.
   * @default {@link defaultOrderedList}
   */
  orderedListFormat?: ListFormat[];
  /**
   * Plugins to customize how mdast nodes are compiled.
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
    styles,
    background,
    orderedListFormat = defaultOrderedList,
  }: DocxOptions = {},
): Promise<ArrayBuffer> => {
  const definition = definitions(node);

  const numbering = createNumberingRegistry();
  const footnote = createFootnoteRegistry();

  const pluginCtx = { root: node, definition };

  const builders = composeBuilders(
    await Promise.all(plugins.map((p) => p(pluginCtx))),
    {
      paragraph: buildParagraph,
      heading: buildHeading,
      thematicBreak: buildThematicBreak,
      blockquote: buildBlockquote,
      list: buildList,
      listItem: buildListItem,
      table: buildTable,
      tableRow: noop,
      tableCell: noop,
      html: fallbackText,
      code: fallbackText,
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
      // image: warnImage,
      // imageReference: warnImage,
      footnoteReference: buildFootnoteReference,
      math: fallbackText,
      inlineMath: fallbackText,
    },
  );

  const renderNode = (
    node: mdast.RootContent,
    c: Context,
  ): DocxContent[] | null => {
    const builder = builders[node.type];
    if (!builder) {
      warnOnce(`${node.type} node is not supported without plugins.`);
      return null;
    }
    const r = builder(node as any, c);
    if (r) {
      if (Array.isArray(r)) {
        return r;
      } else {
        return [r];
      }
    }
    return null;
  };

  const ctx: Context = {
    render(nodes, c) {
      const results: DocxContent[] = [];
      for (const node of nodes) {
        const r = renderNode(node, c ?? this);
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
    orderedListId: numbering.createId,
  };

  const sections: DocxContent[][] = [[]];
  for (const n of node.children) {
    const r = renderNode(n, ctx);
    if (r) {
      if (!r.length) {
        // thematicBreak
        sections.push([]);
      } else {
        const lastSection = sections[sections.length - 1]!;
        lastSection.push(...r);
      }
    }
  }

  const orderedLevels = buildLevels(orderedListFormat);

  const doc = new Document({
    title,
    subject,
    creator,
    keywords,
    description,
    styles: {
      ...styles,
      characterStyles: [
        ...(styles?.characterStyles ?? []),
        {
          id: INLINE_CODE_STYLE_ID,
          run: {
            highlight: "lightGray",
          },
        },
      ],
    },
    background,
    sections: sections
      .filter((s) => s.length)
      .map((s) => ({ children: s as DocxChild[] })),
    footnotes: footnote.toConfig(),
    numbering: {
      config: [
        ...numbering.getIds().map((ref) => ({
          reference: ref,
          levels: orderedLevels,
        })),
        {
          reference: TASK_LIST_REF,
          levels: buildLevels(defaultTaskList),
        },
      ],
    },
  });

  return Packer.toArrayBuffer(doc);
};

const buildParagraph: NodeBuilder<"paragraph"> = ({ children }, ctx) => {
  const list = ctx.list;
  const nodes = ctx.render(children);

  const options: Writeable<IParagraphOptions> = {
    children: nodes,
  };

  if (ctx.indent > 0) {
    options.indent = {
      start: convertInchesToTwip(INDENT * ctx.indent),
    };
  }

  if (list) {
    if (list.type === "task") {
      nodes.unshift(
        new CheckBox({
          checked: list.checked,
          checkedState: { value: "2611" },
          uncheckedState: { value: "2610" },
        }),
      );
      options.numbering = {
        reference: TASK_LIST_REF,
        level: list.level,
      };
    } else if (list.type === "ordered") {
      options.numbering = {
        reference: list.reference,
        level: list.level,
      };
    } else {
      options.bullet = {
        level: list.level,
      };
    }
  }

  return new Paragraph(options);
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
  const nodes = ctx.render(children);
  return new Paragraph({
    heading: headingLevel,
    children: nodes,
  });
};

const buildThematicBreak: NodeBuilder<"thematicBreak"> = () => {
  // Returning empty array at toplevel means section insertion.
  return [];
};

const buildBlockquote: NodeBuilder<"blockquote"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    indent: ctx.indent + 1,
  });
};

const buildList: NodeBuilder<"list"> = ({ children, ordered }, ctx) => {
  const isTopLevel = !ctx.list;
  const level = isTopLevel ? 0 : ctx.list.level + 1;

  const parentList = ctx.list;
  let list: ListInfo;
  if (ordered) {
    list = {
      type: "ordered",
      level,
      reference:
        parentList && parentList.type === "ordered"
          ? parentList.reference
          : ctx.orderedListId(),
    };
  } else {
    list = { type: "bullet", level };
  }

  return ctx.render(children, {
    ...ctx,
    list,
  });
};

const buildListItem: NodeBuilder<"listItem"> = ({ children, checked }, ctx) => {
  let list = ctx.list;
  if (list) {
    // listItem must be the child of list
    if (checked != null) {
      list = {
        type: "task",
        level: list.level,
        checked,
      };
    }
  }
  return ctx.render(children, {
    ...ctx,
    list,
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
                children: ctx.render(c.children),
              }),
            ],
          });
        }),
      });
    }),
  });
};

const buildText: NodeBuilder<"text"> = ({ value }, { deco }) => {
  const options: Writeable<IRunOptions> = {
    text: value,
    bold: deco.bold,
    italics: deco.italic,
    strike: deco.strike,
  };
  if (deco.link) {
    // https://docx.js.org/#/usage/hyperlinks?id=styling-hyperlinks
    options.style = HYPERLINK_STYLE_ID;
  }
  return new TextRun(options);
};

const buildEmphasis: NodeBuilder<"emphasis"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    deco: { ...ctx.deco, italic: true },
  });
};

const buildStrong: NodeBuilder<"strong"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    deco: { ...ctx.deco, bold: true },
  });
};

const buildDelete: NodeBuilder<"delete"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    deco: { ...ctx.deco, strike: true },
  });
};

const buildInlineCode: NodeBuilder<"inlineCode"> = ({ value }) => {
  return new TextRun({
    text: value,
    style: INLINE_CODE_STYLE_ID,
  });
};

const buildBreak: NodeBuilder<"break"> = () => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink: NodeBuilder<"link"> = ({ children, url }, ctx) => {
  const nodes = ctx.render(children, {
    ...ctx,
    deco: { ...ctx.deco, link: true },
  });
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
    return ctx.render(children);
  }
  return buildLink({ type: "link", children, url: def.url }, ctx);
};

const buildFootnoteDefinition: NodeBuilder<"footnoteDefinition"> = (
  { children, identifier },
  ctx,
) => {
  ctx.footnote.def(
    identifier,
    ctx.render(children).filter((c) => c instanceof Paragraph),
  );
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

const fallbackText = (node: { type: string; value: string }, ctx: Context) => {
  warnOnce(
    `${node.type} node is not supported without plugins, falling back to text.`,
  );
  return buildText({ type: "text", value: node.value }, ctx);
};
