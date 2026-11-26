import { imageSize } from "image-size";

const alreadyWarned: { [message: string]: boolean } = {};

/**
 * @internal
 */
export function warnOnce(message: string): void {
  if (!alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}

const supportedTypes = ["png", "jpg", "gif", "bmp", "svg"] as const;
export type SupportedImageType = (typeof supportedTypes)[number];

export const isSupportedType = (
  type: string | undefined,
): type is SupportedImageType => {
  if (!type) return false;
  if ((supportedTypes as readonly string[]).includes(type)) {
    return true;
  }
  return false;
};

export type ToPngFn = (options: {
  buffer: ArrayBuffer;
  width: number;
  height: number;
}) => Promise<ArrayBuffer>;

/**
 * Converts images to PNG with canvas. Works only on browser.
 */
export const browserToPng: ToPngFn = async ({ buffer, width, height }) => {
  const svg = imageSize(new Uint8Array(buffer)).type === "svg";
  const blob = new Blob([buffer], svg ? { type: "image/svg+xml" } : undefined);
  const url = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    // Render vector images in the resolution of the device
    const dpr = svg ? window.devicePixelRatio : 1;

    const canvas = document.createElement("canvas");
    const scaledWidth = width * dpr;
    const scaledHeight = height * dpr;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    const png = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
    if (!png) {
      // e.g. the canvas exceeds the size limit of the browser
      throw new Error("Failed to convert canvas to PNG");
    }
    return png.arrayBuffer();
  } finally {
    URL.revokeObjectURL(url);
  }
};
