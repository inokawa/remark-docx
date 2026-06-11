import { RemarkDocxPlugin } from '../../types';
type LoadFn = (url: string) => Promise<ArrayBuffer>;
type SvgToPngFn = (options: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
}) => Promise<ArrayBuffer>;
export interface ImagePluginOptions {
    /**
     * A function to resolve image data from url.
     * @default {@link loadWithFetch}
     */
    load?: LoadFn;
    /**
     * A function to convert SVG to PNG. According to the docx specifications, embedding SVG images also requires including PNG.
     * @default {@link browserSvgToPng}, which handles conversion only on browser
     */
    fallbackSvg?: SvgToPngFn;
}
/**
 * A plugin to render "image" nodes
 */
export declare const imagePlugin: ({ load, fallbackSvg, }?: ImagePluginOptions) => RemarkDocxPlugin;
export {};
