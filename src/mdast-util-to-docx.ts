import {
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
  type IPropertiesOptions,
  sectionPageSizeDefaults,
  sectionMarginDefaults,
  type IRunOptions,
  type IParagraphOptions,
  PageBreak,
  type ISectionPropertiesOptions,
  type IIndentAttributesProperties,
  type IStylesOptions,
  type ITableOptions,
  ImageRun,
} from "docx";
import type * as mdast from "mdast";
import { warnOnce } from "./utils";
import { definitions } from "mdast-util-definitions";
import deepmerge from "deepmerge";
import type {
  Context,
  DocxChild,
  DocxContent,
  DocxImageData,
  FootnoteRegistry,
  ListContext,
  NodeBuilder,
  NodeBuilders,
  RemarkDocxPlugin,
  ThematicBreakType,
  Writeable,
} from "./types";

const BULLET_LIST_REF = "bullet";
const ORDERED_LIST_REF = "ordered";
const COMPLETE_TASK_LIST_REF = "task-complete";
const INCOMPLETE_TASK_LIST_REF = "task-incomplete";
const HYPERLINK_STYLE_ID = "Hyperlink";

const calcIndent = (i: number): IIndentAttributesProperties => {
  const INDENT_UNIT = 10 * 40;
  return { hanging: INDENT_UNIT, left: INDENT_UNIT * (i + 1) };
};

const createFootnoteRegistry = (): FootnoteRegistry => {
  const idToInternalId = new Map<string, number>();
  const defs = new Map<number, Paragraph[]>();

  return {
    id: (id) => {
      let internalId = idToInternalId.get(id);
      if (internalId == null) {
        idToInternalId.set(id, (internalId = idToInternalId.size + 1));
      }
      return internalId;
    },
    set: (id, def) => {
      defs.set(id, def);
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

type OrderedListRegistry = {
  createId: () => string;
  getIds: () => string[];
};
const createOrderedListRegistry = (): OrderedListRegistry => {
  let counter = 1;

  const ids: string[] = [];

  return {
    createId: () => {
      const id = `${ORDERED_LIST_REF}-${counter++}`;
      ids.push(id);
      return id;
    },
    getIds: () => {
      return ids;
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

const buildLevels = (formats: readonly ListFormat[]): ILevelsOptions[] => {
  return formats.map(({ format, text }, i) => {
    return {
      level: i,
      format: LevelFormat[format],
      text: text,
      alignment: AlignmentType.LEFT,
      style: {
        paragraph: {
          indent: calcIndent(i),
        },
      },
    };
  });
};

const docxParagraph = (
  options: Writeable<IParagraphOptions>,
  ctx: Context,
): Paragraph => {
  if (ctx.quote != null) {
    options.indent = calcIndent(ctx.quote + 1);
  }

  if (ctx.list) {
    const { level, meta } = ctx.list;
    if (meta.type === "task") {
      options.numbering = {
        reference: meta.checked
          ? COMPLETE_TASK_LIST_REF
          : INCOMPLETE_TASK_LIST_REF,
        level,
      };
    } else if (meta.type === "ordered") {
      options.numbering = {
        reference: meta.reference,
        level,
      };
    } else {
      options.numbering = {
        reference: BULLET_LIST_REF,
        level,
      };
    }
  }

  if (ctx.rtl) {
    options.bidirectional = true;
  }

  return new Paragraph(options);
};

const docxImage = (
  image: DocxImageData,
  node: { alt?: string | null; title?: string | null },
  { width: pageWidth }: Context,
) => {
  let { width, height } = image;

  const pageWidthInch = pageWidth / 1440;
  const DPI = 96;
  const pageWidthPx = pageWidthInch * DPI;
  if (width > pageWidthPx) {
    const scale = pageWidthPx / width;
    width *= scale;
    height *= scale;
  }

  const altText =
    node.alt || node.title
      ? {
          name: "",
          description: node.alt ?? undefined,
          title: node.title ?? undefined,
        }
      : undefined;

  if (image.type === "svg") {
    const { type, data, fallback } = image;
    return new ImageRun({
      type: type,
      data: data,
      transformation: {
        width,
        height,
      },
      // https://github.com/dolanmiu/docx/issues/1162#issuecomment-3228368003
      fallback: { type: "png", data: fallback },
      altText,
    });
  }

  const { type, data } = image;
  return new ImageRun({
    type: type,
    data: data,
    transformation: {
      width,
      height,
    },
    altText,
  });
};

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
   * Page size defined in twip (1 twip == 1/1440 inch).
   * @default A4 ({@link sectionPageSizeDefaults})
   */
  size?: { width?: number; height?: number };
  /**
   * Page margin defined in twip (1 twip == 1/1440 inch).
   * @default 1 inch ({@link sectionMarginDefaults})
   */
  margin?: { top?: number; left?: number; bottom?: number; right?: number };
  /**
   * Page orientation.
   * @default "portrait"
   */
  orientation?: "portrait" | "landscape";
  /**
   * Number of page columns.
   * @default 1
   */
  columns?: number;
  /**
   * Spacing after Paragraphs in twip (1 twip == 1/1440 inch).
   * @default 0
   */
  spacing?: number;
  /**
   * Direction of texts.
   * @default "ltr"
   */
  direction?: "ltr" | "rtl" | "vertical";
  /**
   * An option to override the text format of ordered list.
   * See https://docx.js.org/#/usage/numbering?id=level-options for more details.
   */
  orderedListFormat?: ListFormat[];
  /**
   * An option to select how thematicBreak works.
   *
   * - "page": Page Break
   * - "section": Section Break
   * - "line": Horizontal line
   * @default "page"
   */
  thematicBreak?: ThematicBreakType;
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
    size,
    margin,
    orientation,
    columns,
    spacing,
    direction,
    background,
    thematicBreak = "page",
    orderedListFormat,
  }: DocxOptions = {},
): Promise<ArrayBuffer> => {
  const definition = definitions(node);

  const ordered = createOrderedListRegistry();
  const footnote = createFootnoteRegistry();

  const images = new Map<string, DocxImageData>();
  const pluginCtx = { root: node, images, definition };

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
      image: buildImage,
      imageReference: buildImageReference,
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

  let { WIDTH: pageWidth, HEIGHT: pageHeight } = sectionPageSizeDefaults;
  if (size) {
    if (size.width != null) {
      pageWidth = size.width;
    }
    if (size.height != null) {
      pageHeight = size.height;
    }
  }
  let {
    TOP: marginTop,
    LEFT: marginLeft,
    BOTTOM: marginBottom,
    RIGHT: marginRight,
  } = sectionMarginDefaults;
  if (margin) {
    if (margin.top != null) {
      marginTop = margin.top;
    }
    if (margin.left != null) {
      marginLeft = margin.left;
    }
    if (margin.bottom != null) {
      marginBottom = margin.bottom;
    }
    if (margin.right != null) {
      marginRight = margin.right;
    }
  }

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
    width: pageWidth - marginLeft - marginRight,
    style: {},
    thematicBreak,
    rtl: direction === "rtl",
    definition: definition,
    images,
    footnote,
    orderedId: ordered.createId,
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

  const orderedLevels = buildLevels(
    orderedListFormat ?? [
      { text: "%1.", format: "DECIMAL" },
      { text: "%2.", format: "DECIMAL" },
      { text: "%3.", format: "DECIMAL" },
      { text: "%4.", format: "DECIMAL" },
      { text: "%5.", format: "DECIMAL" },
      { text: "%6.", format: "DECIMAL" },
    ],
  );

  const sectionProperties: ISectionPropertiesOptions = {
    column: columns ? { count: columns } : undefined,
    page: {
      textDirection: direction === "vertical" ? "tbRl" : undefined,
      size: { width: pageWidth, height: pageHeight, orientation },
      margin: {
        top: marginTop,
        left: marginLeft,
        bottom: marginBottom,
        right: marginRight,
      },
    },
  };

  const doc = new Document({
    title,
    subject,
    creator,
    keywords,
    description,
    styles: deepmerge<IStylesOptions>(
      {
        default: {
          document: {
            paragraph: {
              spacing: spacing ? { after: spacing } : undefined,
            },
          },
        },
      },
      styles || {},
    ),
    background,
    sections: sections
      .filter((s) => s.length)
      .map((s) => ({
        properties: sectionProperties,
        children: s as DocxChild[],
      })),
    footnotes: footnote.toConfig(),
    numbering: {
      config: [
        {
          reference: BULLET_LIST_REF,
          levels: buildLevels([
            { text: "\u25CF", format: "BULLET" },
            { text: "\u25CB", format: "BULLET" },
            { text: "\u25A0", format: "BULLET" },
            { text: "\u25CF", format: "BULLET" },
            { text: "\u25CB", format: "BULLET" },
            { text: "\u25A0", format: "BULLET" },
          ]),
        },
        ...ordered.getIds().map((ref) => ({
          reference: ref,
          levels: orderedLevels,
        })),
        {
          reference: COMPLETE_TASK_LIST_REF,
          levels: buildLevels([
            { text: "\u2611", format: "BULLET" },
            { text: "\u2611", format: "BULLET" },
            { text: "\u2611", format: "BULLET" },
            { text: "\u2611", format: "BULLET" },
            { text: "\u2611", format: "BULLET" },
            { text: "\u2611", format: "BULLET" },
          ]),
        },
        {
          reference: INCOMPLETE_TASK_LIST_REF,
          levels: buildLevels([
            { text: "\u2610", format: "BULLET" },
            { text: "\u2610", format: "BULLET" },
            { text: "\u2610", format: "BULLET" },
            { text: "\u2610", format: "BULLET" },
            { text: "\u2610", format: "BULLET" },
            { text: "\u2610", format: "BULLET" },
          ]),
        },
      ],
    },
  });

  // HACK: docx.js has no option to remove default numbering definitions from .docx. So do it here for now.
  // https://github.com/dolanmiu/docx/blob/master/src/file/numbering/numbering.ts
  const defaultBulletKey = "default-bullet-numbering";
  const _numbering = (doc as any).numbering;
  _numbering.abstractNumberingMap.delete(defaultBulletKey);
  _numbering.concreteNumberingMap.delete(defaultBulletKey);

  return Packer.toArrayBuffer(doc);
};

const buildParagraph: NodeBuilder<"paragraph"> = ({ children }, ctx) => {
  return docxParagraph(
    {
      children: ctx.render(children),
    },
    ctx,
  );
};

const buildHeading: NodeBuilder<"heading"> = ({ children, depth }, ctx) => {
  let level: keyof typeof HeadingLevel;
  switch (depth) {
    case 1:
      level = "TITLE";
      break;
    case 2:
      level = "HEADING_1";
      break;
    case 3:
      level = "HEADING_2";
      break;
    case 4:
      level = "HEADING_3";
      break;
    case 5:
      level = "HEADING_4";
      break;
    case 6:
      level = "HEADING_5";
      break;
  }
  return docxParagraph(
    {
      heading: HeadingLevel[level],
      children: ctx.render(children),
    },
    ctx,
  );
};

const buildThematicBreak: NodeBuilder<"thematicBreak"> = (_, ctx) => {
  switch (ctx.thematicBreak) {
    case "page": {
      return new Paragraph({ children: [new PageBreak()] });
    }
    case "section": {
      // Returning empty array at toplevel means section insertion.
      return [];
    }
    case "line": {
      return new Paragraph({ thematicBreak: true });
    }
  }
};

const buildBlockquote: NodeBuilder<"blockquote"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    quote: ctx.quote == null ? 0 : ctx.quote + 1,
  });
};

const buildList: NodeBuilder<"list"> = ({ children, ordered }, ctx) => {
  const parentList = ctx.list;

  let meta: ListContext["meta"];
  if (ordered) {
    meta = {
      type: "ordered",
      reference:
        parentList && parentList.meta.type === "ordered"
          ? parentList.meta.reference
          : ctx.orderedId(),
    };
  } else {
    meta = { type: "bullet" };
  }

  return ctx.render(children, {
    ...ctx,
    list: {
      level: !parentList ? 0 : parentList.level + 1,
      meta,
    },
  });
};

const buildListItem: NodeBuilder<"listItem"> = ({ children, checked }, ctx) => {
  let list = ctx.list;
  if (list) {
    // listItem must be the child of list
    if (checked != null) {
      list = {
        level: list.level,
        meta: {
          type: "task",
          checked,
        },
      };
    }
  }
  return ctx.render(children, {
    ...ctx,
    list,
  });
};

const buildTable: NodeBuilder<"table"> = ({ children, align }, ctx) => {
  const textAlign = align?.map((a): keyof typeof AlignmentType => {
    switch (a) {
      case "left":
        return "LEFT";
      case "right":
        return "RIGHT";
      case "center":
        return "CENTER";
      default:
        return "LEFT";
    }
  });

  const columnLength = children[0]!.children.length;
  const columnWidth = ctx.width / columnLength;

  const options: Writeable<ITableOptions> = {
    columnWidths: Array.from({ length: columnLength }).map(() => columnWidth),
    rows: children.map((r) => {
      return new TableRow({
        children: r.children.map((c, i) => {
          return new TableCell({
            width: { size: columnWidth, type: "dxa" },
            children: [
              new Paragraph({
                alignment: AlignmentType[textAlign?.[i] ?? "LEFT"],
                children: ctx.render(c.children, {
                  ...ctx,
                  // https://github.com/dolanmiu/docx/blob/master/demo/22-right-to-left-text.ts
                  rtl: undefined,
                }),
              }),
            ],
          });
        }),
      });
    }),
  };

  if (ctx.rtl) {
    options.visuallyRightToLeft = true;
  }

  return new Table(options);
};

const buildText: NodeBuilder<"text"> = ({ value }, { style, rtl }) => {
  const options: Writeable<IRunOptions> = {
    text: value,
    bold: style.bold,
    italics: style.italic,
    strike: style.strike,
  };
  if (style.inlineCode) {
    options.highlight = "lightGray";
  }
  if (style.link) {
    // https://docx.js.org/#/usage/hyperlinks?id=styling-hyperlinks
    options.style = HYPERLINK_STYLE_ID;
  }
  if (rtl) {
    options.rightToLeft = true;
  }

  return new TextRun(options);
};

const buildEmphasis: NodeBuilder<"emphasis"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    style: { ...ctx.style, italic: true },
  });
};

const buildStrong: NodeBuilder<"strong"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    style: { ...ctx.style, bold: true },
  });
};

const buildDelete: NodeBuilder<"delete"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    style: { ...ctx.style, strike: true },
  });
};

const buildInlineCode: NodeBuilder<"inlineCode"> = ({ value }, ctx) => {
  return buildText(
    { type: "text", value },
    {
      ...ctx,
      style: { ...ctx.style, inlineCode: true },
    },
  );
};

const buildBreak: NodeBuilder<"break"> = () => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink: NodeBuilder<"link"> = ({ children, url }, ctx) => {
  if (url.startsWith("#")) {
    // TODO support anchor link
    return ctx.render(children);
  }
  return new ExternalHyperlink({
    link: url,
    children: ctx.render(children, {
      ...ctx,
      style: { ...ctx.style, link: true },
    }),
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

const buildImage: NodeBuilder<"image"> = (node, ctx) => {
  const data = ctx.images.get(node.url);
  if (!data) {
    return null;
  }
  return docxImage(data, node, ctx);
};

const buildImageReference: NodeBuilder<"imageReference"> = (node, ctx) => {
  const def = ctx.definition(node.identifier);
  if (def == null) {
    return null;
  }
  const data = ctx.images.get(def.url);
  if (!data) {
    return null;
  }
  return docxImage(data, { alt: node.alt, title: def.title }, ctx);
};

const buildFootnoteDefinition: NodeBuilder<"footnoteDefinition"> = (
  { children, identifier },
  ctx,
) => {
  const contents = ctx.render(children).filter((c) => c instanceof Paragraph);
  ctx.footnote.set(ctx.footnote.id(identifier), contents);
  return null;
};

const buildFootnoteReference: NodeBuilder<"footnoteReference"> = (
  { identifier },
  ctx,
) => {
  return new FootnoteReferenceRun(ctx.footnote.id(identifier));
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
