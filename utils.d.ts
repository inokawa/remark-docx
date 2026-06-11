declare const supportedTypes: readonly ["png", "jpg", "gif", "bmp", "svg"];
export type SupportedImageType = (typeof supportedTypes)[number];
export declare const isSupportedType: (type: string | undefined) => type is SupportedImageType;
export {};
