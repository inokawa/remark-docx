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
  MathRun,
} from "docx";
import type { IPropertiesOptions } from "docx/build/file/core-properties";
import type * as mdast from "./models/mdast";
import { invariant, unreachable } from "./utils";
import { visit } from "unist-util-visit";

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
  reference: string;
  checked?: boolean;
}>;

/**
 * @internal
 */
export type LatexParser = (value: string) => MathRun[][];

type Definition = Record<string, string>;
type FootnoteDefinition = Readonly<{ children: Paragraph[] }>;

type FootnoteRegistry = {
  ref: (id: string) => number;
  def: (id: string, def: FootnoteDefinition) => void;
  footnotes: () => {
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
    footnotes: () => {
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
  getAll: () => Array<{ reference: string; levels: ILevelsOptions[] }>;
};

const createNumberingRegistry = (): NumberingRegistry => {
  let counter = 1;

  return {
    create: () => {
      return `${ORDERED_LIST_REF}-${counter++}`;
    },
    getAll: () => {
      return Array.from({ length: counter }, (_, i) => ({
        reference: `${ORDERED_LIST_REF}-${i}`,
        levels: DEFAULT_NUMBERINGS,
      }));
    },
  };
};

type Context = Readonly<{
  deco: Decoration;
  images: Readonly<ImageDataMap>;
  indent: number;
  list?: ListInfo;
  def: Readonly<Definition>;
  footnote: FootnoteRegistry;
  numbering: NumberingRegistry;
  latex: LatexParser;
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
  latex: LatexParser,
): Promise<any> => {
  const definition: Definition = {};
  visit(node, "definition", (node) => {
    definition[node.identifier] = node.url;
  });

  const footnote = createFootnoteRegistry();
  const numbering = createNumberingRegistry();
  const nodes = convertNodes(node.children, {
    deco: {},
    images,
    indent: 0,
    def: definition,
    footnote,
    numbering,
    latex,
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
    footnotes: footnote.footnotes(),
    sections: [{ children: nodes as DocxChild[] }],
    numbering: {
      config: numbering.getAll(),
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

const convertNodes = (nodes: mdast.Content[], ctx: Context): DocxContent[] => {
  const results: DocxContent[] = [];
  for (const node of nodes) {
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
        // FIXME: transform to text for now
        results.push(buildText(node.value, ctx.deco));
        break;
      case "break":
        results.push(buildBreak(node));
        break;
      case "link": {
        results.push(buildLink(node, ctx));
        break;
      }
      case "image":
        results.push(buildImage(node, ctx.images));
        break;
      case "linkReference":
        results.push(...buildLinkReference(node, ctx));
        break;
      case "imageReference": {
        const image = buildImageReference(node, ctx);
        if (image) {
          results.push(image);
        }
        break;
      }
      case "footnote": {
        // inline footnote was removed in mdast v5
        break;
      }
      case "footnoteReference":
        results.push(buildFootnoteReference(node, ctx));
        break;
      case "math":
        results.push(...buildMath(node, ctx));
        break;
      case "inlineMath":
        results.push(buildInlineMath(node, ctx));
        break;
      default:
        unreachable(node);
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
  { children, ordered, start: _start, spread: _spread }: mdast.List,
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
  { children, checked, spread: _spread }: mdast.ListItem,
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
  const nodes = convertNodes(children, ctx);
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

const buildMath = ({ value }: mdast.Math, ctx: Context): DocxContent[] => {
  return ctx.latex(value).map(
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

const buildInlineMath = (
  { value }: mdast.InlineMath,
  ctx: Context,
): DocxContent => {
  return new Math({
    children: ctx.latex(value).flatMap((runs) => runs),
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
  { children, url }: Pick<mdast.Link, "children" | "url">,
  ctx: Context,
): DocxContent => {
  const nodes = convertNodes(children, ctx);
  return new ExternalHyperlink({
    link: url,
    children: nodes,
  });
};

const buildImage = (
  { url }: Pick<mdast.Image, "url">,
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

const buildLinkReference = (
  { children, identifier }: mdast.LinkReference,
  ctx: Context,
): DocxContent[] => {
  const def = ctx.def[identifier];
  if (def == null) {
    return convertNodes(children, ctx);
  }
  return [buildLink({ children, url: def }, ctx)];
};

const buildImageReference = (
  { identifier }: mdast.ImageReference,
  ctx: Context,
): DocxContent | undefined => {
  const def = ctx.def[identifier];
  if (def == null) {
    return;
  }
  return buildImage({ url: def }, ctx.images);
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
