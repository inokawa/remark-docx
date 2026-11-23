declare const supportedTypes: readonly ["png", "jpg", "gif", "bmp", "svg"];
export type SupportedImageType = (typeof supportedTypes)[number];
export declare const isSupportedType: (type: string | undefined) => type is SupportedImageType;
export type SvgToPngFn = (options: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
}) => Promise<ArrayBuffer>;
/**
 * Converts SVG to PNG with canvas. Works only on browser.
 */
export declare const browserSvgToPng: SvgToPngFn;
export {};
