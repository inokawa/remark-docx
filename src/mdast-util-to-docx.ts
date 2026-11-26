import {
  Packer,
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  Footer,
  PageNumber,
  ExternalHyperlink,
  InternalHyperlink,
  Bookmark,
  HeadingLevel,
  LevelFormat,
  LineNumberRestartFormat,
  AlignmentType,
  type ILevelsOptions,
  FootnoteReferenceRun,
  type IPropertiesOptions,
  sectionPageSizeDefaults,
  sectionMarginDefaults,
  type IParagraphOptions,
  PageBreak,
  type ISectionPropertiesOptions,
  type IStylesOptions,
  ImageRun,
  type FileChild,
  type ParagraphChild,
  Math as DocxMath,
  TableOfContents,
} from "docx";
import { latexToMath } from "docx/math";
import { htmlToContent, htmlToRuns } from "docx/html";
import type * as mdast from "mdast";
import type { VFile } from "vfile";
import { readImage, toArrayBuffer, warnOnce, type ToPngFn } from "./utils";
import { definitions } from "mdast-util-definitions";
import { visit } from "unist-util-visit";
import deepmerge from "deepmerge";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import type {
  Context,
  DocxContent,
  DocxImageData,
  ListContext,
  NodeBuilder,
  NodeBuilders,
  RemarkDocxPlugin,
  ThematicBreakType,
} from "./types";

const BULLET_LIST_REF = "bullet";
const ORDERED_LIST_REF = "ordered";
const COMPLETE_TASK_LIST_REF = "task-complete";
const INCOMPLETE_TASK_LIST_REF = "task-incomplete";
const HYPERLINK_STYLE_ID = "Hyperlink";
const TOC_HEADING_STYLE_ID = "TOCHeading";
const QUOTE_STYLE_ID = "Quote";
const FOOTNOTE_TEXT_STYLE_ID = "FootnoteText";

const COLUMN_SPACE = 720;
const TABLE_CELL_MARGIN = 108;
const INDENT_UNIT = 10 * 40;
const QUOTE_INDENT = 720;

type LoadFn = (url: string, file: VFile) => Promise<ArrayBuffer | Uint8Array>;

export interface ImageOptions {
  /**
   * A function to resolve image data from url. `file` is the processed file, which can be used to resolve relative urls.
   * @default {@link loadWithFetch}
   */
  load?: LoadFn;
  /**
   * A function to convert images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG and WebP.
   * SVG is embedded with the PNG as fallback, because Word requires it. Others are embedded as PNG.
   * On browser, you can use {@link browserToPng}.
   */
  toPng?: ToPngFn;
}

/**
 * @internal
 */
export type ImageCache = Map<string, DocxImageData>;

interface TocOptions {
  /**
   * Title of the table of contents.
   */
  title?: string;
  /**
   * Max depth of headings listed in the table of contents.
   * @default 3
   */
  depth?: 1 | 2 | 3 | 4 | 5 | 6;
}

type ListFormat = {
  format: keyof typeof LevelFormat;
  text: string;
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
   * @default {@link sectionMarginDefaults}
   */
  margin?: {
    /**
     * Top margin.
     * @default 1440
     */
    top?: number;
    /**
     * Left margin.
     * @default 1440
     */
    left?: number;
    /**
     * Bottom margin.
     * @default 1440
     */
    bottom?: number;
    /**
     * Right margin.
     * @default 1440
     */
    right?: number;
    /**
     * Distance from the top edge to the header.
     * @default 708
     */
    header?: number;
    /**
     * Distance from the bottom edge to the footer.
     * @default 708
     */
    footer?: number;
    /**
     * Binding space added to the left margin.
     * @default 0
     */
    gutter?: number;
  };
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
   * Insert a table of contents generated from headings at the beginning of the document.
   * Word asks to update fields on open to fill in its page numbers.
   */
  toc?: boolean | TocOptions;
  /**
   * Show the current page number in a centered footer.
   */
  pageNumbers?: boolean;
  /**
   * Show line numbers in the margin, continuously through the document.
   */
  lineNumbers?: boolean;
  /**
   * Embed images of `image` / `imageReference` nodes. `png`, `jpg`, `gif`, `bmp` and `svg` are supported.
   * Images are not embedded if not set.
   */
  image?: boolean | ImageOptions;
  /**
   * Plugins to customize how mdast nodes are compiled.
   */
  plugins?: RemarkDocxPlugin[];
}

const listIndent = (i: number): { hanging: number; left: number } => {
  return { hanging: INDENT_UNIT, left: INDENT_UNIT * (i + 1) };
};

// Indents of texts in blockquotes and lists
const textIndent = (
  quote: number | undefined,
  list: ListContext | undefined,
): { left: number; right: number } => {
  return {
    left:
      (quote != null ? QUOTE_INDENT * (quote + 1) : 0) +
      (list ? listIndent(list.level).left : 0),
    right: quote != null ? QUOTE_INDENT : 0,
  };
};

const maxImageSize = (ctx: Context): { width: number; height: number } => {
  const { left, right } = textIndent(ctx.quote, ctx.list);
  // twip to px
  return {
    width: ((ctx.width - left - right) / 1440) * 96,
    height: (ctx.height / 1440) * 96,
  };
};

const imageTransformation = (
  image: DocxImageData,
  ctx: Context,
): { width: number; height: number } => {
  const max = maxImageSize(ctx);
  const scale = Math.min(1, max.width / image.width, max.height / image.height);
  return { width: image.width * scale, height: image.height * scale };
};

const numberingLevels = (formats: readonly ListFormat[]): ILevelsOptions[] => {
  return formats.map(({ format, text }, i) => {
    return {
      level: i,
      format: LevelFormat[format],
      text: text,
      alignment: AlignmentType.LEFT,
      style: {
        paragraph: {
          indent: listIndent(i),
        },
      },
    };
  });
};

const docxParagraph = (options: IParagraphOptions, ctx: Context): Paragraph => {
  const { quote, list, rtl, inFootnote } = ctx;
  const { left, right } = textIndent(quote, list);
  // Footnotes keep their text style in blockquotes, so indent them directly instead of the Quote style
  const quoteStyle = quote != null && !options.heading && !inFootnote;
  let indent: IParagraphOptions["indent"];
  let numbering: IParagraphOptions["numbering"];
  if (list) {
    const { level, meta, continuation } = list;
    if (continuation) {
      indent = { left };
    } else {
      if (quote != null) {
        indent = { ...listIndent(level), left };
      }
      numbering = {
        reference:
          meta.type === "task"
            ? meta.checked
              ? COMPLETE_TASK_LIST_REF
              : INCOMPLETE_TASK_LIST_REF
            : meta.type === "ordered"
              ? meta.reference
              : BULLET_LIST_REF,
        level,
      };
    }
  } else if (quote != null && (!quoteStyle || quote > 0)) {
    // The Quote style indents the outermost blockquote
    indent = { left };
  }
  if (quote != null && !quoteStyle) {
    indent = { ...indent, right };
  }

  return new Paragraph({
    ...options,
    style: quoteStyle
      ? QUOTE_STYLE_ID
      : (options.style ??
        (inFootnote && !options.heading ? FOOTNOTE_TEXT_STYLE_ID : undefined)),
    indent,
    numbering,
    bidirectional: rtl || undefined,
  });
};

const docxTextLines = (value: string): TextRun[] => {
  return value.split(/\r?\n/).map(
    (line, index) =>
      new TextRun({
        text: line,
        break: index === 0 ? undefined : 1,
      }),
  );
};

const docxMath = (value: string): DocxMath | null => {
  try {
    return new DocxMath({ children: latexToMath(value) });
  } catch (e) {
    warnOnce(
      `Failed to convert LaTeX to a Word equation, falling back to text.\n` +
        (e instanceof Error ? e.message : String(e)),
    );
    return null;
  }
};

const noop = () => {
  return null;
};

const buildParagraph: NodeBuilder<"paragraph"> = ({ children }, ctx) => {
  return docxParagraph(
    {
      children: ctx.render(children) as ParagraphChild[],
      // Later blocks of an item in tight lists aren't paragraphs of the item itself (e.g. in blockquotes)
      contextualSpacing:
        (ctx.list?.tight && !ctx.list.continuation) || undefined,
    },
    ctx,
  );
};

const buildHeading: NodeBuilder<"heading"> = (node, ctx) => {
  const id = ctx.bookmarks.get(node);
  const children = ctx.render(node.children) as ParagraphChild[];
  return docxParagraph(
    {
      heading: HeadingLevel[`HEADING_${node.depth}`],
      children: id ? [new Bookmark({ id, children })] : children,
    },
    ctx,
  );
};

const buildThematicBreak: NodeBuilder<"thematicBreak"> = (_, ctx) => {
  switch (ctx.thematicBreak) {
    case "page":
      return new Paragraph({ children: [new PageBreak()] });
    case "section":
      // Returning empty array at toplevel means section insertion.
      return [];
    case "line":
      return new Paragraph({ thematicBreak: true });
  }
};

const buildBlockquote: NodeBuilder<"blockquote"> = ({ children }, ctx) => {
  return ctx.render(children, {
    ...ctx,
    quote: ctx.quote == null ? 0 : ctx.quote + 1,
  });
};

const buildList: NodeBuilder<"list"> = (
  { children, ordered, start, spread },
  ctx,
) => {
  const parentList = ctx.list;
  const level = parentList ? parentList.level + 1 : 0;

  let meta: ListContext["meta"] = { type: "bullet" };
  if (ordered) {
    const reference =
      parentList?.meta.type === "ordered"
        ? parentList.meta.reference
        : ctx.orderedId();
    if (start != null) {
      ctx.orderedStart(reference, level, start);
    }
    meta = { type: "ordered", reference };
  }

  return ctx.render(children, {
    ...ctx,
    list: {
      level,
      meta,
      // https://spec.commonmark.org/0.31.2/#loose
      tight: !spread && !children.some((c) => c.spread),
    },
  });
};

const buildListItem: NodeBuilder<"listItem"> = ({ children, checked }, ctx) => {
  let list = ctx.list;
  // listItem must be the child of list
  if (list && checked != null) {
    list = { ...list, meta: { type: "task", checked } };
  }
  return children.flatMap((child, i) =>
    ctx.render([child], {
      ...ctx,
      list: list && i > 0 ? { ...list, continuation: true } : list,
    }),
  );
};

const buildTable: NodeBuilder<"table"> = ({ children, align }, ctx) => {
  const columnLength = children[0]!.children.length;
  const columnWidth = ctx.width / columnLength;
  const cellCtx: Context = {
    ...ctx,
    width: columnWidth - TABLE_CELL_MARGIN * 2,
    quote: undefined,
    list: undefined,
    // https://github.com/dolanmiu/docx/blob/master/demo/22-right-to-left-text.ts
    rtl: undefined,
  };

  return new Table({
    columnWidths: Array.from({ length: columnLength }, () => columnWidth),
    rows: children.map(
      (row, rowIndex) =>
        new TableRow({
          tableHeader: rowIndex === 0 || undefined,
          children: row.children.map(
            (cell, i) =>
              new TableCell({
                width: { size: columnWidth, type: "dxa" },
                children: [
                  new Paragraph({
                    alignment: align?.[i] ?? undefined,
                    children: ctx.render(
                      cell.children,
                      cellCtx,
                    ) as ParagraphChild[],
                  }),
                ],
              }),
          ),
        }),
    ),
    visuallyRightToLeft: ctx.rtl || undefined,
  });
};

const FLOW_PARENTS = new Set<mdast.Parents["type"]>([
  "root",
  "blockquote",
  "listItem",
  "footnoteDefinition",
]);

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Nodes that toHtml can convert
const HTML_PHRASING = new Set<string>([
  "html",
  "text",
  "break",
  "strong",
  "emphasis",
  "delete",
  "inlineCode",
  "link",
  "linkReference",
  "image",
  "imageReference",
  "inlineMath",
]);

const isHtmlPhrasing = (node: mdast.RootContent): boolean =>
  HTML_PHRASING.has(node.type) &&
  (!("children" in node) || node.children.every(isHtmlPhrasing));

/**
 * In markdown, inline raw HTML is split into a node per tag, with markdown parsed between them.
 * https://spec.commonmark.org/0.31.2/#raw-html
 * So join nodes around it into one node, to let docx.js parse them as HTML like browsers.
 */
const joinInlineHtml = (
  nodes: readonly mdast.RootContent[],
  joined: Map<mdast.Html, readonly mdast.RootContent[]>,
): mdast.RootContent[] => {
  const results: mdast.RootContent[] = [];
  let run: mdast.RootContent[] = [];
  const flush = () => {
    // docx.js trims whitespaces at the edges and line breaks at the end of HTML like browsers, so keep them outside
    let end = run.length;
    while (end && run[end - 1]!.type === "break") end--;
    const content = run.slice(0, end);
    if (content.some((n) => n.type === "html")) {
      const head = content[0]!;
      const tail = content[content.length - 1]!;
      if (head.type === "text" && /^\s/.test(head.value)) {
        results.push({ type: "text", value: " " });
      }
      const node: mdast.Html = { type: "html", value: "" };
      joined.set(node, content);
      results.push(node);
      if (tail.type === "text" && /\s$/.test(tail.value)) {
        results.push({ type: "text", value: " " });
      }
      results.push(...run.slice(end));
    } else {
      results.push(...run);
    }
    run = [];
  };
  for (const n of nodes) {
    if (isHtmlPhrasing(n)) {
      run.push(
        n.type === "html" && /^<br[\s/>]/i.test(n.value)
          ? { type: "break" }
          : n,
      );
    } else {
      flush();
      results.push(n);
    }
  }
  flush();
  return results;
};

const HTML_LINK_CLASS = "remark-docx-link";

/**
 * Converts markdown to HTML that docx.js renders like the default builders.
 */
const toHtml = (node: mdast.RootContent, ctx: Context): string => {
  const children = () =>
    "children" in node ? node.children.map((c) => toHtml(c, ctx)).join("") : "";
  switch (node.type) {
    case "html":
      // Hyperlinks can't be nested
      return ctx.style.link
        ? node.value.replace(/^<(\/?)a(?=[\s/>])/i, "<$1span")
        : node.value;
    case "text":
      return escapeHtml(node.value);
    case "break":
      return "<br>";
    case "strong":
      return `<b>${children()}</b>`;
    case "emphasis":
      return `<i>${children()}</i>`;
    case "delete":
      return `<s>${children()}</s>`;
    case "inlineCode":
      // Converted to lightGray highlight by docx.js
      return `<span style="background-color:#c0c0c0">${escapeHtml(node.value)}</span>`;
    case "link": {
      let href: string | undefined = node.url;
      if (href.startsWith("#")) {
        const anchor = ctx.bookmarks.get(href);
        href = anchor && (anchor === "_top" ? "#" : `#${anchor}`);
      }
      return href
        ? `<a href="${escapeHtml(href)}">${children()}</a>`
        : children();
    }
    case "linkReference": {
      const def = ctx.definition(node.identifier);
      return def
        ? toHtml({ type: "link", url: def.url, children: node.children }, ctx)
        : children();
    }
    case "image": {
      const image = ctx.images.get(node.url);
      if (!image) {
        return escapeHtml(node.alt ?? "");
      }
      const { width, height } = imageTransformation(image, ctx);
      return (
        `<img src="${escapeHtml(node.url)}" width="${width}" height="${height}"` +
        ` alt="${escapeHtml(node.alt ?? "")}" title="${escapeHtml(node.title ?? "")}">`
      );
    }
    case "imageReference": {
      const def = ctx.definition(node.identifier);
      return def
        ? toHtml(
            { type: "image", url: def.url, alt: node.alt, title: def.title },
            ctx,
          )
        : "";
    }
    case "inlineMath":
      // docx.js reads LaTeX in MathML annotation like KaTeX's output
      return docxMath(node.value)
        ? `<math><annotation encoding="application/x-tex">${escapeHtml(node.value)}</annotation></math>`
        : escapeHtml(node.value);
  }
  return "";
};

const buildHtml: NodeBuilder<"html"> = (node, ctx) => {
  const element = ctx.inlineHtml.get(node);
  const inline = !!element;
  // Apply the context of markdown to HTML
  const { style, rtl } = ctx;
  let value = element
    ? element.map((n) => toHtml(n, ctx)).join("")
    : node.value;
  if (style.bold) value = `<b>${value}</b>`;
  if (style.italic) value = `<i>${value}</i>`;
  if (style.strike) value = `<s>${value}</s>`;
  if (style.link) value = `<span class="${HTML_LINK_CLASS}">${value}</span>`;
  if (rtl) value = `<div dir="rtl">${value}</div>`;

  // Paragraphs from docx.js can't be indented or numbered afterwards, so wrap runs with a paragraph instead.
  const paragraph = !inline && (ctx.quote != null || !!ctx.list);
  const results = (inline || paragraph ? htmlToRuns : htmlToContent)(value, {
    styleMap: {
      [`.${HTML_LINK_CLASS}`]: HYPERLINK_STYLE_ID,
    },
    onWarning: ({ message }) => {
      warnOnce(
        `Failed to convert some HTML to Word as is, leaving it out or changing it.\n` +
          message,
      );
    },
    images: (source) => {
      const image = ctx.images.get(source);
      if (!image) {
        return;
      }
      return image.type === "svg"
        ? { data: image.data, fallback: image.fallback }
        : image.data;
    },
    maxImageWidth: maxImageSize(ctx).width,
  });
  if (!results.length) {
    // Returning an empty array at root means a section break, so return null instead.
    return null;
  }
  return paragraph
    ? docxParagraph({ children: results as readonly ParagraphChild[] }, ctx)
    : (results as DocxContent[]);
};

const buildCode: NodeBuilder<"code"> = ({ value }, ctx) => {
  warnOnce(`code node is not supported without plugins, falling back to text.`);
  return docxParagraph({ children: docxTextLines(value) }, ctx);
};

const buildMath: NodeBuilder<"math"> = ({ value }, ctx) => {
  const math = docxMath(value);
  return docxParagraph({ children: math ? [math] : docxTextLines(value) }, ctx);
};

const buildFootnoteDefinition: NodeBuilder<"footnoteDefinition"> = (
  { children, identifier },
  ctx,
) => {
  const contents = ctx
    .render(children, { ...ctx, inFootnote: true })
    .filter((c) => c instanceof Paragraph);
  ctx.footnote.set(ctx.footnote.id(identifier), contents);
  return null;
};

const buildText: NodeBuilder<"text"> = ({ value }, { style, rtl }) => {
  return new TextRun({
    text: value,
    bold: style.bold,
    italics: style.italic,
    strike: style.strike,
    highlight: style.inlineCode ? "lightGray" : undefined,
    // https://docx.js.org/#/usage/hyperlinks?id=styling-hyperlinks
    style: style.link ? HYPERLINK_STYLE_ID : undefined,
    rightToLeft: rtl || undefined,
  });
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
    { ...ctx, style: { ...ctx.style, inlineCode: true } },
  );
};

const buildBreak: NodeBuilder<"break"> = () => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink: NodeBuilder<"link"> = ({ children, url }, ctx) => {
  const linkCtx: Context = { ...ctx, style: { ...ctx.style, link: true } };
  if (!url.startsWith("#")) {
    return new ExternalHyperlink({
      link: url,
      children: ctx.render(children, linkCtx) as ParagraphChild[],
    });
  }
  const anchor = ctx.bookmarks.get(url);
  if (!anchor) {
    return ctx.render(children);
  }
  return new InternalHyperlink({
    anchor,
    children: ctx.render(children, linkCtx) as ParagraphChild[],
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
  const image = ctx.images.get(node.url);
  if (!image) {
    // Keep the description of the image if it can't be embedded
    return node.alt ? buildText({ type: "text", value: node.alt }, ctx) : null;
  }

  const transformation = imageTransformation(image, ctx);
  const altText =
    node.alt || node.title
      ? {
          name: "",
          description: node.alt ?? undefined,
          title: node.title ?? undefined,
        }
      : undefined;

  if (image.type === "svg") {
    return new ImageRun({
      type: image.type,
      data: image.data,
      transformation,
      // https://github.com/dolanmiu/docx/issues/1162#issuecomment-3228368003
      fallback: { type: "png", data: image.fallback },
      altText,
    });
  }
  return new ImageRun({
    type: image.type,
    data: image.data,
    transformation,
    altText,
  });
};

const buildImageReference: NodeBuilder<"imageReference"> = (node, ctx) => {
  const def = ctx.definition(node.identifier);
  if (def == null) {
    return null;
  }
  return buildImage(
    { type: "image", url: def.url, alt: node.alt, title: def.title },
    ctx,
  );
};

const buildFootnoteReference: NodeBuilder<"footnoteReference"> = (
  { identifier },
  ctx,
) => {
  return new FootnoteReferenceRun(ctx.footnote.id(identifier));
};

const buildInlineMath: NodeBuilder<"inlineMath"> = ({ value }, ctx) => {
  return docxMath(value) ?? buildText({ type: "text", value }, ctx);
};

const defaultBuilders: NodeBuilders = {
  paragraph: buildParagraph,
  heading: buildHeading,
  thematicBreak: buildThematicBreak,
  blockquote: buildBlockquote,
  list: buildList,
  listItem: buildListItem,
  table: buildTable,
  tableRow: noop,
  tableCell: noop,
  html: buildHtml,
  code: buildCode,
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
  math: buildMath,
  inlineMath: buildInlineMath,
};

const loadWithFetch: LoadFn = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.arrayBuffer();
};

const MAX_CACHE_SIZE = 100;

const loadImage = async (
  url: string,
  file: VFile,
  load: LoadFn,
  toPng: ToPngFn | undefined,
): Promise<DocxImageData | undefined> => {
  let data: ArrayBuffer;
  try {
    data = toArrayBuffer(await load(url, file));
  } catch (e) {
    warnOnce(`Failed to load image: ${url} ${e}`);
    return;
  }
  return readImage(data, toPng, url);
};

const loadImages = async (
  urls: ReadonlySet<string>,
  images: Map<string, DocxImageData | null>,
  cache: ImageCache,
  file: VFile,
  { load = loadWithFetch, toPng }: ImageOptions,
): Promise<void> => {
  await Promise.all(
    Array.from(urls, async (url) => {
      if (images.has(url)) {
        return;
      }
      // Relative urls may point to different images from other files
      const key = `${file.dirname}\0${url}`;
      const image = cache.get(key) ?? (await loadImage(url, file, load, toPng));
      if (!image) {
        return;
      }
      cache.set(key, image);
      // Plugins may have set this url while loading.
      if (!images.has(url)) {
        images.set(url, image);
      }
    }),
  );

  for (const key of cache.keys()) {
    if (cache.size <= MAX_CACHE_SIZE) {
      break;
    }
    cache.delete(key);
  }
};

export const mdastToDocx = async (
  node: mdast.Root,
  {
    plugins = [],
    image,
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
    toc,
    pageNumbers,
    lineNumbers,
    orderedListFormat,
  }: DocxOptions = {},
  imageCache: ImageCache,
  file: VFile,
): Promise<Uint8Array> => {
  const definition = definitions(node);

  // Bookmark headings referenced by links. Word bookmark names are stricter
  // than GitHub-style slugs, so generate them.
  const slugger = new GithubSlugger();
  // Slugs are unique, so headings can be keyed by them
  const headings = new Map<string, mdast.Heading>();
  const fragments = new Map<string, string>();
  let hasBlockquote = false;
  const imageUrls = new Set<string>();
  const inlineHtml = new Map<mdast.Html, readonly mdast.RootContent[]>();
  // Children with inline html joined, keyed by the original children
  const joinedChildren = new WeakMap<
    readonly mdast.RootContent[],
    mdast.RootContent[]
  >();
  visit(node, (n) => {
    switch (n.type) {
      case "blockquote":
        hasBlockquote = true;
        break;
      case "heading": {
        // Like GitHub, slug the rendered text
        const text = toString(n, {
          includeHtml: false,
          includeImageAlt: false,
        });
        headings.set(slugger.slug(text), n);
        break;
      }
      case "link":
      case "linkReference": {
        const url = n.type === "link" ? n.url : definition(n.identifier)?.url;
        if (url?.startsWith("#")) {
          try {
            fragments.set(url, decodeURIComponent(url.slice(1)));
          } catch {
            // Leave malformed fragments unlinked
          }
        }
        break;
      }
      case "image":
        imageUrls.add(n.url);
        break;
      case "imageReference": {
        const def = definition(n.identifier);
        if (def) {
          imageUrls.add(def.url);
        }
        break;
      }
      case "html":
        if (image) {
          // Collect <img> sources as docx.js reads them
          htmlToRuns(n.value, {
            images: (source) => {
              imageUrls.add(source);
              return undefined;
            },
          });
        }
        break;
    }

    if (
      "children" in n &&
      !FLOW_PARENTS.has(n.type) &&
      n.children.some((c) => c.type === "html")
    ) {
      joinedChildren.set(n.children, joinInlineHtml(n.children, inlineHtml));
    }
  });

  const referenced = new Set(fragments.values());
  // Bookmark names keyed by heading or link url
  const bookmarks = new Map<mdast.Heading | string, string>();
  for (const [slug, heading] of headings) {
    if (referenced.has(slug)) {
      bookmarks.set(heading, `md_heading_${bookmarks.size + 1}`);
    }
  }
  for (const [url, fragment] of fragments) {
    // Like HTML, `#` and `#top` go to the top unless a heading has that slug.
    // `_top` is Word's reserved bookmark for the beginning of the document.
    const heading = headings.get(fragment);
    const anchor = heading
      ? bookmarks.get(heading)
      : /^(top)?$/i.test(fragment)
        ? "_top"
        : undefined;
    if (anchor) {
      bookmarks.set(url, anchor);
    }
  }

  const images = new Map<string, DocxImageData | null>();
  const [pluginBuilders] = await Promise.all([
    Promise.all(
      plugins.map((p) =>
        p({
          root: node,
          images,
          readImage: (data, name) =>
            readImage(
              toArrayBuffer(data),
              typeof image === "object" ? image.toPng : undefined,
              name,
            ),
        }),
      ),
    ),
    // Images set by plugins take precedence.
    image &&
      loadImages(
        imageUrls,
        images,
        imageCache,
        file,
        image === true ? {} : image,
      ),
  ]);
  const layers: NodeBuilders[] = [...pluginBuilders, defaultBuilders];

  const renderNode = (
    node: mdast.RootContent,
    c: Context,
  ): DocxContent[] | null => {
    let supported = false;
    for (const layer of layers) {
      const builder = layer[node.type] as
        NodeBuilder<mdast.RootContent["type"]> | undefined;
      if (builder) {
        supported = true;
        const r = builder(node, c);
        if (r) {
          return Array.isArray(r) ? r : [r];
        }
      }
    }
    if (!supported) {
      warnOnce(`${node.type} node is not supported without plugins.`);
    }
    return null;
  };

  const pageWidth = size?.width ?? sectionPageSizeDefaults.WIDTH;
  const pageHeight = size?.height ?? sectionPageSizeDefaults.HEIGHT;
  const marginTop = margin?.top ?? sectionMarginDefaults.TOP;
  const marginLeft = margin?.left ?? sectionMarginDefaults.LEFT;
  const marginBottom = margin?.bottom ?? sectionMarginDefaults.BOTTOM;
  const marginRight = margin?.right ?? sectionMarginDefaults.RIGHT;
  const marginHeader = margin?.header ?? sectionMarginDefaults.HEADER;
  const marginFooter = margin?.footer ?? sectionMarginDefaults.FOOTER;
  const marginGutter = margin?.gutter ?? sectionMarginDefaults.GUTTER;
  // docx swaps width and height of landscape pages
  const bodyWidth = orientation === "landscape" ? pageHeight : pageWidth;
  const bodyHeight = orientation === "landscape" ? pageWidth : pageHeight;
  const columnCount = columns || 1;

  // Numbered in the order of rendering
  const footnoteIds = new Map<string, number>();
  const footnotes: { [id: number]: { children: Paragraph[] } } = {};
  // Start numbers by level, keyed by ordered list references
  const orderedStarts = new Map<string, (number | undefined)[]>();

  const ctx: Context = {
    render(nodes, c) {
      const results: DocxContent[] = [];
      for (const node of joinedChildren.get(nodes) ?? nodes) {
        const r = renderNode(node, c ?? this);
        if (r) {
          results.push(...r);
        }
      }
      return results;
    },
    width:
      (bodyWidth -
        marginLeft -
        marginRight -
        marginGutter -
        COLUMN_SPACE * (columnCount - 1)) /
      columnCount,
    height: bodyHeight - marginTop - marginBottom,
    style: {},
    thematicBreak,
    rtl: direction === "rtl",
    definition,
    images,
    footnote: {
      id: (identifier) => {
        let id = footnoteIds.get(identifier);
        if (id == null) {
          footnoteIds.set(identifier, (id = footnoteIds.size + 1));
        }
        return id;
      },
      set: (id, children) => {
        footnotes[id] = { children };
      },
    },
    orderedId: () => {
      const id = `${ORDERED_LIST_REF}-${orderedStarts.size + 1}`;
      orderedStarts.set(id, []);
      return id;
    },
    orderedStart: (id, level, start) => {
      // Nested lists at the same level share a numbering, so the first one wins.
      orderedStarts.get(id)![level] ??= start;
    },
    bookmarks,
    inlineHtml,
  };

  const sections: DocxContent[][] = [[]];
  for (const n of node.children) {
    const r = renderNode(n, ctx);
    if (!r) {
      continue;
    }
    if (!r.length) {
      // thematicBreak
      sections.push([]);
      continue;
    }
    sections[sections.length - 1]!.push(...r);
  }

  const tocOptions: TocOptions | undefined =
    toc === true ? {} : toc || undefined;
  if (tocOptions) {
    const { title: tocTitle, depth = 3 } = tocOptions;
    const first = sections[0]!;
    first.unshift(
      ...(tocTitle
        ? [docxParagraph({ style: TOC_HEADING_STYLE_ID, text: tocTitle }, ctx)]
        : []),
      new TableOfContents(undefined, {
        headingStyleRange: `1-${depth}`,
        hyperlink: true,
      }),
      // The next section break already starts a new page
      ...(first.length ? [new Paragraph({ children: [new PageBreak()] })] : []),
    );
  }

  const orderedLevels = numberingLevels(
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
    lineNumbers: lineNumbers
      ? {
          // Word shows no line numbers with countBy 0
          countBy: 1,
          restart: LineNumberRestartFormat.CONTINUOUS,
        }
      : undefined,
    page: {
      textDirection: direction === "vertical" ? "tbRl" : undefined,
      size: { width: pageWidth, height: pageHeight, orientation },
      margin: {
        top: marginTop,
        left: marginLeft,
        bottom: marginBottom,
        right: marginRight,
        header: marginHeader,
        footer: marginFooter,
        gutter: marginGutter,
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
          // Outline levels of Word's built-in heading styles, for the navigation pane and the TOC
          heading1: { paragraph: { outlineLevel: 0 } },
          heading2: { paragraph: { outlineLevel: 1 } },
          heading3: { paragraph: { outlineLevel: 2 } },
          heading4: { paragraph: { outlineLevel: 3 } },
          heading5: { paragraph: { outlineLevel: 4 } },
          heading6: { paragraph: { outlineLevel: 5 } },
        },
        paragraphStyles: [
          // Word's built-in "TOC Heading" style.
          // Outline level 9 (body text) keeps it out of the navigation pane.
          ...(tocOptions?.title &&
          !styles?.paragraphStyles?.some((s) => s.id === TOC_HEADING_STYLE_ID)
            ? [
                {
                  id: TOC_HEADING_STYLE_ID,
                  name: "TOC Heading",
                  basedOn: "Heading1",
                  paragraph: { outlineLevel: 9 },
                },
              ]
            : []),
          // Word's built-in "Quote" style.
          ...(hasBlockquote
            ? [
                {
                  id: QUOTE_STYLE_ID,
                  name: "Quote",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  paragraph: {
                    indent: { left: QUOTE_INDENT, right: QUOTE_INDENT },
                  },
                },
              ]
            : []),
        ],
      },
      styles || {},
    ),
    background,
    features: tocOptions ? { updateFields: true } : undefined,
    sections: sections
      .filter((s) => s.length)
      .map((s) => ({
        footers: pageNumbers
          ? {
              default: new Footer({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ children: [PageNumber.CURRENT] })],
                  }),
                ],
              }),
            }
          : undefined,
        properties: sectionProperties,
        children: s as FileChild[],
      })),
    footnotes,
    numbering: {
      config: [
        {
          reference: BULLET_LIST_REF,
          levels: numberingLevels([
            { text: "●", format: "BULLET" },
            { text: "○", format: "BULLET" },
            { text: "■", format: "BULLET" },
            { text: "●", format: "BULLET" },
            { text: "○", format: "BULLET" },
            { text: "■", format: "BULLET" },
          ]),
        },
        ...Array.from(orderedStarts, ([reference, starts]) => ({
          reference,
          levels: orderedLevels.map((l, i) =>
            starts[i] != null ? { ...l, start: starts[i] } : l,
          ),
        })),
        {
          reference: COMPLETE_TASK_LIST_REF,
          levels: numberingLevels([
            { text: "☑", format: "BULLET" },
            { text: "☑", format: "BULLET" },
            { text: "☑", format: "BULLET" },
            { text: "☑", format: "BULLET" },
            { text: "☑", format: "BULLET" },
            { text: "☑", format: "BULLET" },
          ]),
        },
        {
          reference: INCOMPLETE_TASK_LIST_REF,
          levels: numberingLevels([
            { text: "☐", format: "BULLET" },
            { text: "☐", format: "BULLET" },
            { text: "☐", format: "BULLET" },
            { text: "☐", format: "BULLET" },
            { text: "☐", format: "BULLET" },
            { text: "☐", format: "BULLET" },
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

  return new Uint8Array(await Packer.toArrayBuffer(doc));
};
