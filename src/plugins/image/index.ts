import { warnOnce } from "../../utils";
import type { RemarkDocxPlugin } from "../../types";
import type * as mdast from "../../mdast";
import { ImageRun, type IImageOptions } from "docx";
import { visit } from "unist-util-visit";
import { imageSize } from "image-size";

const supportedTypes = ["png", "jpg", "gif", "bmp", "svg"] as const;

type SupportedImageType = (typeof supportedTypes)[number];

type ImageData = Readonly<{
  data: ArrayBuffer;
  width: number;
  height: number;
  type: SupportedImageType;
}>;

const buildImage = (image: ImageData, node: { alt?: string | null }) => {
  const altText = node.alt ? { name: node.alt } : undefined;

  if (image.type === "svg") {
    const { type, data, width, height } = image;
    return new ImageRun({
      type: type,
      data: data,
      transformation: {
        width,
        height,
      },
      altText,
    } as IImageOptions);
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

export interface ImagePluginOptions {
  /**
   * A function to resolve image data from url.
   * @default fetch
   */
  load?: (url: string) => Promise<ArrayBuffer>;
}

/**
 * A plugin to render "image" nodes
 */
export const imagePlugin = ({
  load = async (url) => {
    const res = await fetch(url);
    return res.arrayBuffer();
  },
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

              images.set(url, {
                type,
                width,
                height,
                data,
              });
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
          return [];
        }
        return buildImage(data, node);
      },
      imageReference: (node) => {
        const def = definition(node.identifier);
        if (def == null) {
          return [];
        }
        const data = images.get(def.url);
        if (!data) {
          return [];
        }
        return buildImage(data, node);
      },
    };
  };
};
