import { warnOnce } from "../../utils";
import type { RemarkDocxPlugin } from "../../types";
import type * as mdast from "../../mdast";
import { ImageRun, type IImageOptions } from "docx";
import { visit } from "unist-util-visit";

type ImageData = {
  image: IImageOptions["data"];
  width: number;
  height: number;
  type: IImageOptions["type"];
};

const buildImage = ({ image, width, height, type }: ImageData) => {
  return new ImageRun({
    type: type,
    data: image,
    transformation: {
      width,
      height,
    },
  } as IImageOptions);
};

const imagePlugin = (
  resolver: (url: string) => Promise<ImageData>,
): RemarkDocxPlugin => {
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
              try {
                const img = await resolver(url);
                images.set(url, img);
              } catch (e) {
                warnOnce(`Failed to fetch image: ${url}`);
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
          return [];
        }
        return buildImage(data);
      },
      imageReference: ({ identifier }) => {
        const def = definition(identifier);
        if (def == null) {
          return [];
        }
        const data = images.get(def.url);
        if (!data) {
          return [];
        }
        return buildImage(data);
      },
    };
  };
};

/**
 * A plugin to render "image" nodes on browser.
 */
export const browserImagePlugin = (): RemarkDocxPlugin =>
  imagePlugin(async (url) => {
    const image = new Image();
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve({
          image: buf,
          width: image.naturalWidth,
          height: image.naturalHeight,
          type: "png",
        });
      };
      image.onerror = reject;
      image.src = URL.createObjectURL(new Blob([buf], { type: "image/png" }));
    });
  });

interface NodeImagePluginOptions {
  /**
   * A function to resolve image data from url.
   * @default fetch
   */
  load: (url: string) => Promise<ArrayBuffer>;
}

/**
 * A plugin to render "image" nodes on Node.js.
 */
export const nodeImagePlugin = ({
  load = async (url) => {
    const res = await fetch(url);
    return res.arrayBuffer();
  },
}: NodeImagePluginOptions): RemarkDocxPlugin => {
  const is = import("image-size");

  const isSupportedType = (
    type: string | undefined,
  ): type is "png" | "jpg" | "gif" | "bmp" => {
    if (!type) return false;
    if (type === "png" || type === "jpg" || type === "gif" || type === "bmp") {
      return true;
    }
    return false;
  };

  return imagePlugin(async (url) => {
    const { imageSize } = await is;
    const buf = await load(url);

    const { width, height, type } = imageSize(new Uint8Array(buf));
    if (!isSupportedType(type)) {
      const err = `Not supported image type: ${type}`;
      warnOnce(err);
      throw new Error(err);
    }
    return { image: buf, width, height, type };
  });
};
