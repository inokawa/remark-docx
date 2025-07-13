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
  FootnoteReferenceRun,
  CheckBox,
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

type Decoration = Readonly<{
  [key in (mdast.Emphasis | mdast.Strong | mdast.Delete)["type"]]?: true;
}>;

type ListInfo = Readonly<{
  level: number;
  ordered: boolean;
  checked?: boolean;
}>;

type FootnoteRegistry = { [identifier: string]: number };

type Context = Readonly<{
  deco: Decoration;
  images: ImageDataMap;
  indent: number;
  list?: ListInfo;
  footnoteRegistry?: FootnoteRegistry;
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

interface Footnotes {
  [key: string]: { children: Paragraph[] };
}

export const mdastToDocx = async (
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
  images: ImageDataMap,
): Promise<any> => {
  const footnoteRegistry: FootnoteRegistry = {};
  const [nodes, footnotes] = convertNodes(node.children, {
    deco: {},
    images,
    indent: 0,
    footnoteRegistry,
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
    footnotes,
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
      const bufOut = await Packer.toBuffer(doc);
      // feature detection instead of environment detection, but if Buffer exists
      // it's probably Node. If not, return the Uint8Array that JSZip returns
      // when it doesn't detect a Node environment.
      return typeof Buffer === "function" ? Buffer.from(bufOut) : bufOut;
    case "blob":
      return Packer.toBlob(doc);
  }
};

const getOrCreateFootnoteId = (
  identifier: string,
  registry: FootnoteRegistry,
): number => {
  if (!(identifier in registry)) {
    registry[identifier] = Object.keys(registry).length + 1;
  }
  return registry[identifier]!;
};

const convertNodes = (
  nodes: mdast.Content[],
  ctx: Context,
): [DocxContent[], Footnotes] => {
  const results: DocxContent[] = [];
  let footnotes: Footnotes = {};
  for (const node of nodes) {
    switch (node.type) {
      case "paragraph": {
        const [paragraph, nestedFootnotes] = buildParagraph(node, ctx);
        results.push(paragraph);
        footnotes = { ...footnotes, ...nestedFootnotes };
        break;
      }
      case "heading": {
        const [heading, nestedFootnotes] = buildHeading(node, ctx);
        results.push(heading);
        footnotes = { ...footnotes, ...nestedFootnotes };
        break;
      }
      case "thematicBreak":
        results.push(buildThematicBreak(node));
        break;
      case "blockquote": {
        const [blockquoteNodes, nestedFootnotes] = buildBlockquote(node, ctx);
        results.push(...blockquoteNodes);
        footnotes = { ...footnotes, ...nestedFootnotes };
        break;
      }
      case "list": {
        const [listNodes, nestedFootnotes] = buildList(node, ctx);
        results.push(...listNodes);
        footnotes = { ...footnotes, ...nestedFootnotes };
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
      case "footnoteDefinition": {
        const footnoteId = getOrCreateFootnoteId(
          node.identifier,
          ctx.footnoteRegistry || {},
        );
        footnotes[footnoteId] = buildFootnoteDefinition(node, ctx);
        break;
      }
      case "text":
        results.push(buildText(node.value, ctx.deco));
        break;
      case "emphasis":
      case "strong":
      case "delete": {
        const { type, children } = node;
        const [nodes, nestedFootnotes] = convertNodes(children, {
          ...ctx,
          deco: { ...ctx.deco, [type]: true },
        });
        results.push(...nodes);
        footnotes = { ...footnotes, ...nestedFootnotes };
        break;
      }
      case "inlineCode":
        // FIXME: transform to text for now
        results.push(buildText(node.value, ctx.deco));
        break;
      case "break":
        results.push(buildBreak(node));
        break;
      case "link": {
        const [link, nestedFootnotes] = buildLink(node, ctx);
        results.push(link);
        footnotes = { ...footnotes, ...nestedFootnotes };
        break;
      }
      case "image":
        results.push(buildImage(node, ctx.images));
        break;
      case "linkReference":
        // FIXME: unimplemented
        break;
      case "imageReference":
        // FIXME: unimplemented
        break;
      case "footnote": {
        const [footnoteRef, footnoteData] = buildFootnote(node, ctx);
        results.push(footnoteRef);
        footnotes = { ...footnotes, ...footnoteData };
        break;
      }
      case "footnoteReference":
        results.push(buildFootnoteReference(node, ctx));
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
  return [results, footnotes];
};

const buildParagraph = (
  { children }: mdast.Paragraph,
  ctx: Context,
): [DocxContent, Footnotes] => {
  const list = ctx.list;
  const [nodes, footnotes] = convertNodes(children, ctx);

  if (list && list.checked != null) {
    nodes.unshift(
      new CheckBox({
        checked: list.checked,
        checkedState: { value: "2611" },
        uncheckedState: { value: "2610" },
      }),
    );
  }
  return [
    new Paragraph({
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
    }),
    footnotes,
  ];
};

const buildHeading = (
  { children, depth }: mdast.Heading,
  ctx: Context,
): [DocxContent, Footnotes] => {
  let headingLevel: HeadingLevel;
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
  const [nodes, footnotes] = convertNodes(children, ctx);
  return [
    new Paragraph({
      heading: headingLevel,
      children: nodes,
    }),
    footnotes,
  ];
};

const buildThematicBreak = (_: mdast.ThematicBreak): DocxContent => {
  return new Paragraph({
    thematicBreak: true,
  });
};

const buildBlockquote = (
  { children }: mdast.Blockquote,
  ctx: Context,
): [DocxContent[], Footnotes] => {
  const [nodes, footnotes] = convertNodes(children, {
    ...ctx,
    indent: ctx.indent + 1,
  });
  return [nodes, footnotes];
};

const buildList = (
  { children, ordered, start: _start, spread: _spread }: mdast.List,
  ctx: Context,
): [DocxContent[], Footnotes] => {
  const list: ListInfo = {
    level: ctx.list ? ctx.list.level + 1 : 0,
    ordered: !!ordered,
  };
  let allFootnotes: Footnotes = {};
  const allNodes = children.flatMap((item) => {
    const [nodes, itemFootnotes] = buildListItem(item, {
      ...ctx,
      list,
    });
    allFootnotes = { ...allFootnotes, ...itemFootnotes };
    return nodes;
  });
  return [allNodes, allFootnotes];
};

const buildListItem = (
  { children, checked, spread: _spread }: mdast.ListItem,
  ctx: Context,
): [DocxContent[], Footnotes] => {
  const [nodes, footnotes] = convertNodes(children, {
    ...ctx,
    ...(ctx.list && { list: { ...ctx.list, checked: checked ?? undefined } }),
  });
  return [nodes, footnotes];
};

const buildTable = (
  { children, align }: mdast.Table,
  ctx: Context,
): DocxContent => {
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
  cellAligns: AlignmentType[] | undefined,
): TableRow => {
  return new TableRow({
    children: children.map((c, i) => {
      return buildTableCell(c, ctx, cellAligns?.[i]);
    }),
  });
};

const buildTableCell = (
  { children }: mdast.TableCell,
  ctx: Context,
  align: AlignmentType | undefined,
): TableCell => {
  const [nodes] = convertNodes(children, ctx);
  return new TableCell({
    children: [
      new Paragraph({
        alignment: align,
        children: nodes,
      }),
    ],
  });
};

const buildHtml = ({ value }: mdast.HTML): DocxContent => {
  // FIXME: transform to text for now
  return new Paragraph({
    children: [buildText(value, {})],
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

const buildMath = ({ value }: mdast.Math): DocxContent[] => {
  return parseLatex(value).map(
    (runs) =>
      new Paragraph({
        children: [
          new Math({
            children: runs,
          }),
        ],
      }),
  );
};

const buildInlineMath = ({ value }: mdast.InlineMath): DocxContent => {
  return new Math({
    children: parseLatex(value).flatMap((runs) => runs),
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

const buildBreak = (_: mdast.Break): DocxContent => {
  return new TextRun({ text: "", break: 1 });
};

const buildLink = (
  { children, url, title: _title }: mdast.Link,
  ctx: Context,
): [DocxContent, Footnotes] => {
  const [nodes, footnotes] = convertNodes(children, ctx);
  return [
    new ExternalHyperlink({
      link: url,
      children: nodes,
    }),
    footnotes,
  ];
};

const buildImage = (
  { url, title: _title, alt: _alt }: mdast.Image,
  images: ImageDataMap,
): DocxContent => {
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

const buildFootnote = (
  { children }: mdast.Footnote,
  ctx: Context,
): [DocxContent, Footnotes] => {
  // Generate auto ID based on current registry size to ensure uniqueness
  const registry = ctx.footnoteRegistry || {};
  const autoId = `inline-${Object.keys(registry).length + 1}`;
  const footnoteId = getOrCreateFootnoteId(autoId, registry);

  const footnoteContent = children.map((node) => {
    // Convert each node and extract the first result as a paragraph
    const [nodes] = convertNodes([node], ctx);
    if (nodes[0] instanceof Paragraph) {
      return nodes[0] as Paragraph;
    }
    // For non-paragraph content, wrap in a paragraph
    return new Paragraph({ children: nodes });
  });

  return [
    new FootnoteReferenceRun(footnoteId),
    {
      [footnoteId]: { children: footnoteContent },
    },
  ];
};

const buildFootnoteDefinition = (
  { children }: mdast.FootnoteDefinition,
  ctx: Context,
): Footnotes[string] => {
  return {
    children: children.map((node) => {
      // Convert each node and extract the first result as a paragraph
      const [nodes] = convertNodes([node], ctx);
      if (nodes[0] instanceof Paragraph) {
        return nodes[0] as Paragraph;
      }
      // For non-paragraph content, wrap in a paragraph
      return new Paragraph({ children: nodes });
    }),
  };
};

const buildFootnoteReference = (
  { identifier }: mdast.FootnoteReference,
  ctx: Context,
): DocxContent => {
  const footnoteId = getOrCreateFootnoteId(
    identifier,
    ctx.footnoteRegistry || {},
  );
  return new FootnoteReferenceRun(footnoteId);
};
