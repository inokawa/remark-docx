import * as docx from "docx";
import { convertInchesToTwip, Packer } from "docx";
import type { IPropertiesOptions } from "docx/build/file/core-properties";
import type * as mdast from "./models/mdast";
import { parseLatex } from "./latex";
import { invariant, unreachable } from "./utils";

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

type Decoration = Readonly<
  {
    [key in (mdast.Emphasis | mdast.Strong | mdast.Delete)["type"]]?: true;
  }
>;

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
  output?: "buffer" | "blob";
  imageResolver?: ImageResolver;
} & Pick<
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
>;

type DocxChild = docx.Paragraph | docx.Table | docx.TableOfContents;
type DocxContent = DocxChild | docx.ParagraphChild;

export function mdastToDocx(
  node: mdast.Root,
  {
    output,
    title,
    subject,
    creator,
    keywords,
    description,
    lastModifiedBy,
    revision,
    styles,
    background,
  }: Opts,
  images: ImageDataMap
): Promise<any> {
  const nodes = convertNodes(node.children, {
    deco: {},
    images,
  }) as DocxChild[];
  const doc = new docx.Document({
    title,
    subject,
    creator,
    keywords,
    description,
    lastModifiedBy,
    revision,
    styles,
    background,
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

  switch (output ?? "buffer") {
    case "buffer":
      return Packer.toBuffer(doc);
    case "blob":
      return Packer.toBlob(doc);
  }
}

function convertNodes(nodes: mdast.Content[], ctx: Context): DocxContent[] {
  const results: DocxContent[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case "paragraph":
        results.push(buildParagraph(node, ctx));
        break;
      case "heading":
        results.push(buildHeading(node, ctx));
        break;
      case "thematicBreak":
        results.push(buildThematicBreak(node));
        break;
      case "blockquote":
        results.push(...buildBlockquote(node, ctx));
        break;
      case "list":
        results.push(...buildList(node, ctx));
        break;
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
          ...convertNodes(children, {
            ...ctx,
            deco: { ...ctx.deco, [type]: true },
          })
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
        results.push(buildLink(node, ctx));
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
        results.push(buildFootnote(node, ctx));
        break;
      case "footnoteReference":
        // FIXME: unimplemented
        break;
      case "math":
        results.push(...buildMath(node));
        break;
      case "inlineMath":
        results.push(buildInlineMath(node));
        break;
      default:
        unreachable(node);
        break;
    }
  }
  return results;
}

function buildParagraph({ children }: mdast.Paragraph, ctx: Context) {
  const list = ctx.list;
  return new docx.Paragraph({
    children: convertNodes(children, ctx),
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

function buildHeading({ children, depth }: mdast.Heading, ctx: Context) {
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
    children: convertNodes(children, ctx),
  });
}

function buildThematicBreak(_: mdast.ThematicBreak) {
  return new docx.Paragraph({
    thematicBreak: true,
  });
}

function buildBlockquote({ children }: mdast.Blockquote, ctx: Context) {
  // FIXME: do nothing for now
  return convertNodes(children, ctx);
}

function buildList(
  { children, ordered, start: _start, spread: _spread }: mdast.List,
  ctx: Context
) {
  const list: ListInfo = {
    level: ctx.list ? ctx.list.level + 1 : 0,
    ordered: !!ordered,
  };
  return children.reduce((acc, item) => {
    acc.push(
      ...buildListItem(item, {
        ...ctx,
        list,
      })
    );
    return acc;
  }, [] as DocxContent[]);
}

function buildListItem(
  { children, checked: _checked, spread: _spread }: mdast.ListItem,
  ctx: Context
) {
  return convertNodes(children, ctx);
}

function buildTable({ children, align }: mdast.Table, ctx: Context) {
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
      return buildTableRow(r, ctx, cellAligns);
    }),
  });
}

function buildTableRow(
  { children }: mdast.TableRow,
  ctx: Context,
  cellAligns: docx.AlignmentType[] | undefined
) {
  return new docx.TableRow({
    children: children.map((c, i) => {
      return buildTableCell(c, ctx, cellAligns?.[i]);
    }),
  });
}

function buildTableCell(
  { children }: mdast.TableCell,
  ctx: Context,
  align: docx.AlignmentType | undefined
) {
  return new docx.TableCell({
    children: [
      new docx.Paragraph({
        alignment: align,
        children: convertNodes(children, ctx),
      }),
    ],
  });
}

function buildHtml({ value }: mdast.HTML) {
  // FIXME: transform to text for now
  return new docx.Paragraph({
    children: [buildText(value, {})],
  });
}

function buildCode({ value, lang: _lang, meta: _meta }: mdast.Code) {
  // FIXME: transform to text for now
  return new docx.Paragraph({
    children: [buildText(value, {})],
  });
}

function buildMath({ value }: mdast.Math) {
  return parseLatex(value).map(
    (runs) =>
      new docx.Paragraph({
        children: [
          new docx.Math({
            children: runs,
          }),
        ],
      })
  );
}

function buildInlineMath({ value }: mdast.InlineMath) {
  return new docx.Math({
    children: parseLatex(value).flatMap((runs) => runs),
  });
}

function buildText(text: string, deco: Decoration) {
  return new docx.TextRun({
    text,
    bold: deco.strong,
    italics: deco.emphasis,
    strike: deco.delete,
  });
}

function buildBreak(_: mdast.Break) {
  return new docx.TextRun({ text: "", break: 1 });
}

function buildLink({ children, url, title: _title }: mdast.Link, ctx: Context) {
  return new docx.ExternalHyperlink({
    link: url,
    children: convertNodes(children, ctx),
  });
}

function buildImage(
  { url, title: _title, alt: _alt }: mdast.Image,
  images: ImageDataMap
) {
  const img = images[url];
  invariant(img, `Fetch image was failed: ${url}`);

  const { image, width, height } = img;
  return new docx.ImageRun({
    data: image,
    transformation: {
      width,
      height,
    },
  });
}

function buildFootnote({ children }: mdast.Footnote, ctx: Context) {
  // FIXME: transform to paragraph for now
  return new docx.Paragraph({
    children: convertNodes(children, ctx),
  });
}
