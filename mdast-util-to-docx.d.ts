import { LevelFormat, IPropertiesOptions } from 'docx';
import { VFile } from 'vfile';
import { ToPngFn } from './utils';
import { RemarkDocxPlugin, ThematicBreakType } from './types';
import type * as mdast from "mdast";
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
export interface DocxOptions extends Pick<IPropertiesOptions, "title" | "subject" | "creator" | "keywords" | "description" | "styles" | "background"> {
    /**
     * Page size defined in twip (1 twip == 1/1440 inch).
     * @default A4 ({@link sectionPageSizeDefaults})
     */
    size?: {
        width?: number;
        height?: number;
    };
    /**
     * Page margin defined in twip (1 twip == 1/1440 inch).
     * @default 1 inch ({@link sectionMarginDefaults})
     */
    margin?: {
        top?: number;
        left?: number;
        bottom?: number;
        right?: number;
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
export declare const mdastToDocx: (node: mdast.Root, { plugins, image, title, subject, creator, keywords, description, styles, size, margin, orientation, columns, spacing, direction, background, thematicBreak, toc, pageNumbers, lineNumbers, orderedListFormat, }: DocxOptions | undefined, imageCache: ImageCache, file: VFile) => Promise<Uint8Array>;
export {};
