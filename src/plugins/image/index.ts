import { warnOnce } from "../../utils";
import type { RemarkDocxPlugin } from "../../types";
import type * as mdast from "mdast";
import { ImageRun } from "docx";
import { visit } from "unist-util-visit";
import { imageSize } from "image-size";

const supportedTypes = ["png", "jpg", "gif", "bmp", "svg"] as const;

type SupportedImageType = (typeof supportedTypes)[number];

type ImageData = Readonly<
  {
    data: ArrayBuffer;
    width: number;
    height: number;
  } & (
    | { type: Exclude<SupportedImageType, "svg"> }
    | {
        type: Extract<SupportedImageType, "svg">;
        fallback: ArrayBuffer;
      }
  )
>;

const buildImage = (
  image: ImageData,
  node: { alt?: string | null; title?: string | null },
) => {
  const altText =
    node.alt || node.title
      ? {
          name: "",
          description: node.alt ?? undefined,
          title: node.title ?? undefined,
        }
      : undefined;

  if (image.type === "svg") {
    const { type, data, width, height, fallback } = image;
    return new ImageRun({
      type: type,
      data: data,
      transformation: {
        width,
        height,
      },
      // https://github.com/dolanmiu/docx/issues/1162#issuecomment-3228368003
      fallback: { type: "png", data: fallback },
      altText,
    });
  }

  const { type, data, width, height } = image;
  return new ImageRun({
    type: type,
    data: data,
    transformation: {
      width,
      height,
    },
    altText,
  });
};

const isSupportedType = (
  type: string | undefined,
): type is SupportedImageType => {
  if (!type) return false;
  if ((supportedTypes as readonly string[]).includes(type)) {
    return true;
  }
  return false;
};

type LoadFn = (url: string) => Promise<ArrayBuffer>;

type SvgToPngFn = (options: {
  buffer: ArrayBuffer;
  width: number;
  height: number;
}) => Promise<ArrayBuffer>;

const loadWithFetch: LoadFn = async (url) => {
  const res = await fetch(url);
  return res.arrayBuffer();
};

const browserSvgToPng: SvgToPngFn = async ({ buffer, width, height }) => {
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
export const imagePlugin = ({
  load = loadWithFetch,
  fallbackSvg = browserSvgToPng,
}: ImagePluginOptions = {}): RemarkDocxPlugin => {
  const images = new Map<string, ImageData>();

  return async ({ root, definition }) => {
    const imageList: (mdast.Image | mdast.Definition)[] = [];
    visit(root, "image", (node) => {
      imageList.push(node);
    });
    visit(root, "imageReference", (node) => {
      const maybeImage = definition(node.identifier)!;
      if (maybeImage) {
        imageList.push(maybeImage);
      }
    });

    if (imageList.length !== 0) {
      const promises = new Map<string, Promise<void>>();
      imageList.forEach(({ url }) => {
        if (!images.has(url) && !promises.has(url)) {
          promises.set(
            url,
            (async () => {
              let data: ArrayBuffer;
              try {
                data = await load(url);
              } catch (e) {
                warnOnce(`Failed to load image: ${url} ${e}`);
                return;
              }

              const { width, height, type } = imageSize(new Uint8Array(data));
              if (!isSupportedType(type)) {
                warnOnce(`Not supported image type: ${type}`);
                return;
              }

              if (type === "svg") {
                try {
                  const fallback = await fallbackSvg({
                    buffer: data,
                    width,
                    height,
                  });
                  images.set(url, {
                    type,
                    width,
                    height,
                    data,
                    fallback: fallback,
                  });
                } catch (e) {
                  warnOnce(`Failed to create fallback image: ${url} ${e}`);
                  return;
                }
              } else {
                images.set(url, { type, width, height, data });
              }
            })(),
          );
        }
      });

      await Promise.all(promises.values());
    }

    return {
      image: (node) => {
        const data = images.get(node.url);
        if (!data) {
          return null;
        }
        return buildImage(data, node);
      },
      imageReference: (node) => {
        const def = definition(node.identifier);
        if (def == null) {
          return null;
        }
        const data = images.get(def.url);
        if (!data) {
          return null;
        }
        return buildImage(data, node);
      },
    };
  };
};
