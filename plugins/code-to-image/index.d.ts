import { RemarkDocxPlugin } from '../../types';
import { ToPngFn } from '../../utils';
import type * as mdast from "mdast";
export interface CodeToImagePluginOptions {
    /**
     * A function to render a "code" node to an image. Returns SVG as string or image data such as PNG and JPEG.
     * Return `null` to leave the node to other plugins, for example when its language is not the target.
     */
    render: (node: mdast.Code) => string | ArrayBuffer | Uint8Array | null | undefined | Promise<string | ArrayBuffer | Uint8Array | null | undefined>;
    /**
     * A function to convert rendered images to PNG. Required to embed images other than PNG, JPEG, GIF and BMP, such as SVG.
     * On browser, you can use `browserToPng` of remark-docx.
     */
    toPng?: ToPngFn;
}
/**
 * A plugin to render "code" nodes as images, such as diagrams and charts written in their own languages.
 */
export declare const codeToImagePlugin: ({ render, toPng, }: CodeToImagePluginOptions) => RemarkDocxPlugin;
