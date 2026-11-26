import { RemarkDocxPlugin } from '../../types';
import type * as mdast from "mdast";
type ImageSource = ArrayBuffer | Uint8Array;
export interface CodeToImagePluginOptions {
    /**
     * A function to render a "code" node to image data, such as PNG and SVG.
     * Images other than PNG, JPEG, GIF and BMP are converted with `toPng` of `image` option, like images in the document.
     * Return `null` to leave the node to other plugins, for example when its language is not the target.
     */
    render: (node: mdast.Code) => ImageSource | null | undefined | Promise<ImageSource | null | undefined>;
}
/**
 * A plugin to render "code" nodes as images, such as diagrams and charts written in their own languages.
 */
export declare const codeToImagePlugin: ({ render, }: CodeToImagePluginOptions) => RemarkDocxPlugin;
export {};
