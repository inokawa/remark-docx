import {
  convertInchesToTwip,
  Packer,
  Document,
  Paragraph,
  ParagraphChild,
  Table,
  TableRow,
  TableCell,
  TableOfContents,
  TextRun,
  ImageRun,
  ExternalHyperlink,
  Math,
  HeadingLevel,
  LevelFormat,
  AlignmentType,
  IImageOptions,
  ILevelsOptions,
} from "docx";
import type { IPropertiesOptions } from "docx/build/file/core-properties";
import type * as mdast from "./models/mdast";
import { parseLatex } from "./latex";
import { invariant, unreachable } from "./utils";

const ORDERED_LIST_REF = "ordered";
const INDENT = 0.5;
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

export type ImageDataMap = { [url: string]: ImageData };

export type ImageData = {
  image: IImageOptions["data"];
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
  indent: number;
  list?: ListInfo;
}>;

export interface DocxOptions
  extends Pick<
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
   * Set output type of `VFile.result`. `buffer` is `Promise<Buffer>`. `blob` is `Promise<Blob>`.
   */
  output?: "buffer" | "blob";
  /**
   * **You must set** if your markdown includes images. See example for [browser](https://github.com/inokawa/remark-docx/blob/main/stories/playground.stories.tsx) and [Node.js](https://github.com/inokawa/remark-docx/blob/main/src/index.spec.ts).
   */
  imageResolver?: ImageResolver;
}

type DocxChild = Paragraph | Table | TableOfContents;
type DocxContent = DocxChild | ParagraphChild;

export interface Footnotes {
  [key: number]: DocxContent;
}

// type to define the return value of `convertNodes`
export interface ConvertNodesReturn {
  nodes: DocxContent[];
  footnotes: Footnotes;
}

export const mdastToDocx = (
  node: mdast.Root,
  {
    output = "buffer",
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
  images: ImageDataMap
): Promise<any> => {
  const { nodes, footnotes } = convertNodes(node.children, {
    deco: {},
    images,
    indent: 0,
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
    sections: [{ children: nodes as DocxChild[] }],
    numbering: {
      config: [
        {
          reference: ORDERED_LIST_REF,
          levels: DEFAULT_NUMBERINGS,
        },
      ],
    },
  });

  switch (output) {
    case "buffer":
      return Packer.toBuffer(doc);
    case "blob":
      return Packer.toBlob(doc);
  }
};

const convertNodes = (nodes: mdast.Content[], ctx: Context): ConvertNodesReturn => {
  const results: DocxContent[] = [];
  const footnotes: Footnotes = {};
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
        const { nodes } = convertNodes(children, {
          ...ctx,
          deco: { ...ctx.deco, [type]: true },
        });
        results.push(
          ...nodes
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
  return {
    nodes: results,
    footnotes,
  };
};

const buildParagraph = ({ children }: mdast.Paragraph, ctx: Context) => {
  const list = ctx.list;
  const { nodes } = convertNodes(children, ctx);
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
};

const buildHeading = ({ children, depth }: mdast.Heading, ctx: Context) => {
  let heading: HeadingLevel;
  switch (depth) {
    case 1:
      heading = HeadingLevel.TITLE;
      break;
    case 2:
      heading = HeadingLevel.HEADING_1;
      break;
    case 3:
      heading = HeadingLevel.HEADING_2;
      break;
    case 4:
      heading = HeadingLevel.HEADING_3;
      break;
    case 5:
      heading = HeadingLevel.HEADING_4;
      break;
    case 6:
      heading = HeadingLevel.HEADING_5;
      break;
  }
  const { nodes } = convertNodes(children, ctx);
  return new Paragraph({
    heading,
    children: nodes,
  });
};

const buildThematicBreak = (_: mdast.ThematicBreak) => {
  return new Paragraph({
    thematicBreak: true,
  });
};

const buildBlockquote = ({ children }: mdast.Blockquote, ctx: Context) => {
  const { nodes } = convertNodes(children, { ...ctx, indent: ctx.indent + 1 });
  return nodes;
};

const buildList = (
  { children, ordered, start: _start, spread: _spread }: mdast.List,
  ctx: Context
) => {
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
};

const buildListItem = (
  { children, checked: _checked, spread: _spread }: mdast.ListItem,
  ctx: Context
) => {
  const { nodes } = convertNodes(children, ctx);
  return nodes;
};

const buildTable = ({ children, align }: mdast.Table, ctx: Context) => {
  const cellAligns: AlignmentType[] | undefined = align?.map((a) => {
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

  return new Table({
    rows: children.map((r) => {
      return buildTableRow(r, ctx, cellAligns);
    }),
  });
};

const buildTableRow = (
  { children }: mdast.TableRow,
  ctx: Context,
  cellAligns: AlignmentType[] | undefined
) => {
  return new TableRow({
    children: children.map((c, i) => {
      return buildTableCell(c, ctx, cellAligns?.[i]);
    }),
  });
};

const buildTableCell = (
  { children }: mdast.TableCell,
  ctx: Context,
  align: AlignmentType | undefined
) => {
  const { nodes } = convertNodes(children, ctx);
  return new TableCell({
    children: [
      new Paragraph({
        alignment: align,
        children: nodes,
      }),
    ],
  });
};

const buildHtml = ({ value }: mdast.HTML) => {
  // FIXME: transform to text for now
  return new Paragraph({
    children: [buildText(value, {})],
  });
};

const buildCode = ({ value, lang: _lang, meta: _meta }: mdast.Code) => {
  // FIXME: transform to text for now
  return new Paragraph({
    children: [buildText(value, {})],
  });
};

const buildMath = ({ value }: mdast.Math) => {
  return parseLatex(value).map(
    (runs) =>
      new Paragraph({
        children: [
          new Math({
            children: runs,
          }),
        ],
      })
  );
};

const buildInlineMath = ({ value }: mdast.InlineMath) => {
  return new Math({
    children: parseLatex(value).flatMap((runs) => runs),
  });
};

const buildText = (text: string, deco: Decoration) => {
  return new TextRun({
    text,
    bold: deco.strong,
    italics: deco.emphasis,
    strike: deco.delete,
  });
};

const buildBreak = (_: mdast.Break) => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink = (
  { children, url, title: _title }: mdast.Link,
  ctx: Context
) => {
  const { nodes } = convertNodes(children, ctx);
  return new ExternalHyperlink({
    link: url,
    children: nodes,
  });
};

const buildImage = (
  { url, title: _title, alt: _alt }: mdast.Image,
  images: ImageDataMap
) => {
  const img = images[url];
  invariant(img, `Fetch image was failed: ${url}`);

  const { image, width, height } = img;
  return new ImageRun({
    data: image,
    transformation: {
      width,
      height,
    },
  });
};

const buildFootnote = ({ children }: mdast.Footnote, ctx: Context) => {
  // FIXME: transform to paragraph for now
  const { nodes } = convertNodes(children, ctx);
  return new Paragraph({
    children: nodes,
  });
};
