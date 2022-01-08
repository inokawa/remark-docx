import * as docx from "docx";
import { convertInchesToTwip } from "docx";
import { IPropertiesOptions } from "docx/build/file/core-properties";
import * as mdast from "./models/mdast";

const ORDERED_LIST_REF = "ordered";
const INDENT = 0.5;
const DEFAULT_NUMBERINGS: docx.ILevelsOptions[] = [
  {
    level: 0,
    format: docx.LevelFormat.DECIMAL,
    text: "%1.",
    alignment: docx.AlignmentType.START,
  },
  {
    level: 1,
    format: docx.LevelFormat.DECIMAL,
    text: "%2.",
    alignment: docx.AlignmentType.START,
    style: {
      paragraph: {
        indent: { start: convertInchesToTwip(INDENT * 1) },
      },
    },
  },
  {
    level: 2,
    format: docx.LevelFormat.DECIMAL,
    text: "%3.",
    alignment: docx.AlignmentType.START,
    style: {
      paragraph: {
        indent: { start: convertInchesToTwip(INDENT * 2) },
      },
    },
  },
  {
    level: 3,
    format: docx.LevelFormat.DECIMAL,
    text: "%4.",
    alignment: docx.AlignmentType.START,
    style: {
      paragraph: {
        indent: { start: convertInchesToTwip(INDENT * 3) },
      },
    },
  },
  {
    level: 4,
    format: docx.LevelFormat.DECIMAL,
    text: "%5.",
    alignment: docx.AlignmentType.START,
    style: {
      paragraph: {
        indent: { start: convertInchesToTwip(INDENT * 4) },
      },
    },
  },
  {
    level: 5,
    format: docx.LevelFormat.DECIMAL,
    text: "%6.",
    alignment: docx.AlignmentType.START,
    style: {
      paragraph: {
        indent: { start: convertInchesToTwip(INDENT * 5) },
      },
    },
  },
];

export type ImageDataMap = { [url: string]: ImageData };

export type ImageData = {
  image: docx.IImageOptions["data"];
  width: number;
  height: number;
};

export type ImageResolver = (url: string) => Promise<ImageData> | ImageData;

type Decoration = Readonly<{
  [key in (mdast.Emphasis | mdast.Strong | mdast.Delete)["type"]]?: true;
}>;

type ListInfo = Readonly<{
  level: number;
  ordered: boolean;
}>;

type Context = Readonly<{
  deco: Decoration;
  images: ImageDataMap;
  list?: ListInfo;
}>;

export type Opts = {
  docProperties?: Omit<IPropertiesOptions, "sections" | "numbering">;
  imageResolver?: ImageResolver;
};

type DocxChild = docx.Paragraph | docx.Table | docx.TableOfContents;
type DocxContent = DocxChild | docx.ParagraphChild;

const error = (message: string) => {
  throw new Error(message);
};

export function mdastToDocx(
  node: mdast.Root,
  opts: Opts,
  images: ImageDataMap
): docx.File {
  return buildDocxRoot(node, opts, images);
}

function buildDocxRoot(
  root: mdast.Root,
  opts: Opts,
  images: ImageDataMap
): docx.File {
  const ctx: Context = { deco: {}, images };
  const nodes = convertNodes(root.children, ctx, opts) as DocxChild[];
  return new docx.Document({
    ...opts.docProperties,
    sections: [{ children: nodes }],
    numbering: {
      config: [
        {
          reference: ORDERED_LIST_REF,
          levels: DEFAULT_NUMBERINGS,
        },
      ],
    },
  });
}

function convertNodes(
  nodes: mdast.Content[],
  ctx: Context,
  opts: Opts
): DocxContent[] {
  const results: DocxContent[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case "paragraph":
        results.push(buildParagraph(node, ctx, opts));
        break;
      case "heading":
        results.push(buildHeading(node, ctx, opts));
        break;
      case "thematicBreak":
        results.push(buildThematicBreak(node));
        break;
      case "blockquote":
        results.push(...buildBlockquote(node, ctx, opts));
        break;
      case "list":
        results.push(...buildList(node, ctx, opts));
        break;
      case "listItem":
        error("unreachable");
        break;
      case "table":
        results.push(buildTable(node, ctx, opts));
        break;
      case "tableRow":
        error("unreachable");
        break;
      case "tableCell":
        error("unreachable");
        break;
      case "html":
        results.push(buildHtml(node));
        break;
      case "code":
        results.push(buildCode(node));
        break;
      case "yaml":
        // FIXME: unimplemented
        break;
      case "toml":
        // FIXME: unimplemented
        break;
      case "definition":
        // FIXME: unimplemented
        break;
      case "footnoteDefinition":
        // FIXME: unimplemented
        break;
      case "text":
        results.push(buildText(node.value, ctx.deco));
        break;
      case "emphasis":
      case "strong":
      case "delete": {
        const { type, children } = node;
        results.push(
          ...convertNodes(
            children,
            { ...ctx, deco: { ...ctx.deco, [type]: true } },
            opts
          )
        );
        break;
      }
      case "inlineCode":
        // FIXME: transform to text for now
        results.push(buildText(node.value, ctx.deco));
        break;
      case "break":
        results.push(buildBreak(node));
        break;
      case "link":
        results.push(buildLink(node, ctx, opts));
        break;
      case "image":
        results.push(buildImage(node, ctx.images));
        break;
      case "linkReference":
        // FIXME: unimplemented
        break;
      case "imageReference":
        // FIXME: unimplemented
        break;
      case "footnote":
        results.push(buildFootnote(node, ctx, opts));
        break;
      case "footnoteReference":
        // FIXME: unimplemented
        break;
      case "math":
        results.push(buildMath(node));
        break;
      case "inlineMath":
        results.push(buildInlineMath(node));
        break;
      default:
        const _: never = node;
        break;
    }
  }
  return results;
}

function buildParagraph(node: mdast.Paragraph, ctx: Context, opts: Opts) {
  const { type, children } = node;
  const list = ctx.list;
  return new docx.Paragraph({
    children: convertNodes(children, ctx, opts),
    ...(list &&
      (list.ordered
        ? {
            numbering: {
              reference: ORDERED_LIST_REF,
              level: list.level,
            },
          }
        : {
            bullet: {
              level: list.level,
            },
          })),
  });
}

function buildHeading(node: mdast.Heading, ctx: Context, opts: Opts) {
  const { type, children, depth } = node;
  let heading: docx.HeadingLevel;
  switch (depth) {
    case 1:
      heading = docx.HeadingLevel.TITLE;
      break;
    case 2:
      heading = docx.HeadingLevel.HEADING_1;
      break;
    case 3:
      heading = docx.HeadingLevel.HEADING_2;
      break;
    case 4:
      heading = docx.HeadingLevel.HEADING_3;
      break;
    case 5:
      heading = docx.HeadingLevel.HEADING_4;
      break;
    case 6:
      heading = docx.HeadingLevel.HEADING_5;
      break;
  }
  return new docx.Paragraph({
    heading,
    children: convertNodes(children, ctx, opts),
  });
}

function buildThematicBreak(node: mdast.ThematicBreak) {
  return new docx.Paragraph({
    thematicBreak: true,
  });
}

function buildBlockquote(node: mdast.Blockquote, ctx: Context, opts: Opts) {
  // FIXME: do nothing for now
  return convertNodes(node.children, ctx, opts);
}

function buildList(node: mdast.List, ctx: Context, opts: Opts) {
  const { type, children, ordered, start, spread } = node;

  const list: ListInfo = {
    level: ctx.list ? ctx.list.level + 1 : 0,
    ordered: !!ordered,
  };
  return children.reduce((acc, item) => {
    acc.push(
      ...buildListItem(
        item,
        {
          ...ctx,
          list,
        },
        opts
      )
    );
    return acc;
  }, [] as DocxContent[]);
}

function buildListItem(node: mdast.ListItem, ctx: Context, opts: Opts) {
  const { type, children, checked, spread } = node;
  return convertNodes(children, ctx, opts);
}

function buildTable(node: mdast.Table, ctx: Context, opts: Opts) {
  const { type, children, align } = node;

  const cellAligns: docx.AlignmentType[] | undefined = align?.map((a) => {
    switch (a) {
      case "left":
        return docx.AlignmentType.LEFT;
      case "right":
        return docx.AlignmentType.RIGHT;
      case "center":
        return docx.AlignmentType.CENTER;
      default:
        return docx.AlignmentType.LEFT;
    }
  });

  return new docx.Table({
    rows: children.map((r) => {
      return buildTableRow(r, ctx, opts, cellAligns);
    }),
  });
}

function buildTableRow(
  node: mdast.TableRow,
  ctx: Context,
  opts: Opts,
  cellAligns: docx.AlignmentType[] | undefined
) {
  const { type, children } = node;
  return new docx.TableRow({
    children: children.map((c, i) => {
      return buildTableCell(c, ctx, opts, cellAligns?.[i]);
    }),
  });
}

function buildTableCell(
  node: mdast.TableCell,
  ctx: Context,
  opts: Opts,
  align: docx.AlignmentType | undefined
) {
  const { type, children } = node;
  return new docx.TableCell({
    children: [
      new docx.Paragraph({
        alignment: align,
        children: convertNodes(children, ctx, opts),
      }),
    ],
  });
}

function buildHtml(node: mdast.HTML) {
  const { type, value } = node;
  // FIXME: transform to text for now
  return new docx.Paragraph({
    children: [buildText(value, {})],
  });
}

function buildCode(node: mdast.Code) {
  const { type, value, lang, meta } = node;
  // FIXME: transform to text for now
  return new docx.Paragraph({
    children: [buildText(value, {})],
  });
}

function buildMath(node: mdast.Math) {
  const { type, value } = node;
  // FIXME: transform to text for now
  return new docx.Paragraph({
    children: [new docx.TextRun(value)],
  });
}

function buildInlineMath(node: mdast.InlineMath) {
  const { type, value } = node;
  // FIXME: transform to text for now
  return new docx.TextRun(value);
}

function buildText(text: string, deco: Decoration) {
  return new docx.TextRun({
    text,
    bold: deco.strong,
    italics: deco.emphasis,
    strike: deco.delete,
  });
}

function buildBreak(node: mdast.Break) {
  return new docx.TextRun({ text: "", break: 1 });
}

function buildLink(node: mdast.Link, ctx: Context, opts: Opts) {
  const { type, children, url, title } = node;
  return new docx.ExternalHyperlink({
    link: url,
    children: convertNodes(children, ctx, opts),
  });
}

function buildImage(node: mdast.Image, images: ImageDataMap) {
  const { type, url, title, alt } = node;
  if (!images[url]) {
    return error(`Fetch image was failed: ${url}`);
  }
  const { image, width, height } = images[url];
  return new docx.ImageRun({
    data: image,
    transformation: {
      width,
      height,
    },
  });
}

function buildFootnote(node: mdast.Footnote, ctx: Context, opts: Opts) {
  const { type, children } = node;
  // FIXME: transform to paragraph for now
  return new docx.Paragraph({
    children: convertNodes(children, ctx, opts),
  });
}
