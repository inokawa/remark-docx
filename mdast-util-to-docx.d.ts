import { LevelFormat, IPropertiesOptions } from 'docx';
import { RemarkDocxPlugin, ThematicBreakType } from './types';
import type * as mdast from "mdast";
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
     * Plugins to customize how mdast nodes are compiled.
     */
    plugins?: RemarkDocxPlugin[];
}
export declare const mdastToDocx: (node: mdast.Root, { plugins, title, subject, creator, keywords, description, styles, size, margin, orientation, columns, spacing, direction, background, thematicBreak, orderedListFormat, }?: DocxOptions) => Promise<ArrayBuffer>;
export {};
