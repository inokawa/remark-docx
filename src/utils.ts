const alreadyWarned: { [message: string]: boolean } = {};

/**
 * @internal
 */
export function warnOnce(message: string, cond: boolean = false): void {
  if (!cond && !alreadyWarned[message]) {
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

export type SvgToPngFn = (options: {
  buffer: ArrayBuffer;
  width: number;
  height: number;
}) => Promise<ArrayBuffer>;

/**
 * Converts SVG to PNG with canvas. Works only on browser.
 */
export const browserSvgToPng: SvgToPngFn = async ({
  buffer,
  width,
  height,
}) => {
  const svgBlob = new Blob([buffer], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const dpr = window.devicePixelRatio;

    const canvas = document.createElement("canvas");
    const scaledWidth = width * dpr;
    const scaledHeight = height * dpr;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    return new Promise<ArrayBuffer>((resolve) => {
      canvas.toBlob((blob) => {
        blob!.arrayBuffer().then(resolve);
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
};
