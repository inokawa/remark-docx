import { isSupportedType, warnOnce } from "../../utils";
import { type DocxImageData, type RemarkDocxPlugin } from "../../types";
import type * as mdast from "mdast";
import { visit } from "unist-util-visit";
import { imageSize } from "image-size";

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

/**
 * @internal
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
  const cache = new Map<string, DocxImageData>();

  const maxCacheLength = 100;

  return async ({ root, definition, images }) => {
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
        if (images.has(url)) {
          return;
        }
        if (cache.has(url)) {
          images.set(url, cache.get(url)!);
          return;
        }
        if (!promises.has(url)) {
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
                  const docxImage: DocxImageData = {
                    type,
                    width,
                    height,
                    data,
                    fallback,
                  };
                  images.set(url, docxImage);
                  cache.set(url, docxImage);
                } catch (e) {
                  warnOnce(`Failed to create fallback image: ${url} ${e}`);
                  return;
                }
              } else {
                const docxImage: DocxImageData = { type, width, height, data };
                images.set(url, docxImage);
                cache.set(url, docxImage);
              }
            })(),
          );
        }
      });

      await Promise.all(promises.values());
    }

    if (cache.size > maxCacheLength) {
      let deleteCount = cache.size - maxCacheLength;
      for (const key of cache.keys()) {
        cache.delete(key);
        deleteCount--;
        if (deleteCount <= 0) {
          break;
        }
      }
    }

    return {};
  };
};
