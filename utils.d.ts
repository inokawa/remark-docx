declare const supportedTypes: readonly ["png", "jpg", "gif", "bmp", "svg"];
export type SupportedImageType = (typeof supportedTypes)[number];
export declare const isSupportedType: (type: string | undefined) => type is SupportedImageType;
export type ToPngFn = (options: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
}) => Promise<ArrayBuffer | Uint8Array>;
/**
 * Converts images to PNG with canvas. Works only on browser.
 */
export declare const browserToPng: ({ buffer, width, height }: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
}) => Promise<ArrayBuffer>;
export {};
