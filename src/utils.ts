import { imageSize } from "image-size";
import type { DocxImageData } from "./types";

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
}) => Promise<ArrayBuffer | Uint8Array>;

/**
 * @internal
 */
export const toArrayBuffer = (data: ArrayBuffer | Uint8Array): ArrayBuffer =>
  ArrayBuffer.isView(data)
    ? // Node.js Buffer may be a view of a shared pool
      new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice()
        .buffer
    : data;

/**
 * Reads image data to embed. Images Word can't show are converted with `toPng`, and SVG keeps the PNG as fallback.
 * @internal
 */
export const readImage = async (
  data: ArrayBuffer,
  toPng: ToPngFn | undefined,
  name: string,
): Promise<DocxImageData | undefined> => {
  let size: ReturnType<typeof imageSize>;
  try {
    size = imageSize(new Uint8Array(data));
  } catch (e) {
    warnOnce(`Failed to detect image type: ${name} ${e}`);
    return;
  }
  const { width, height } = size;
  const type = size.type!;
  if (isSupportedType(type) && type !== "svg") {
    return { type, width, height, data };
  }
  if (!toPng) {
    warnOnce(`toPng option is required to embed ${type}: ${name}`);
    return;
  }
  let png: ArrayBuffer;
  try {
    png = toArrayBuffer(await toPng({ buffer: data, width, height }));
  } catch (e) {
    warnOnce(`Failed to convert image to png: ${name} ${e}`);
    return;
  }
  return type === "svg"
    ? { type, width, height, data, fallback: png }
    : { type: "png", width, height, data: png };
};

/**
 * Converts images to PNG with canvas. Works only on browser.
 */
export const browserToPng = (async ({ buffer, width, height }) => {
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
}) satisfies ToPngFn;
