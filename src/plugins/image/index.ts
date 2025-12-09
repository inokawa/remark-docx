import { warnOnce } from "../../utils";
import type { RemarkDocxPlugin } from "../../types";
import type * as mdast from "../../mdast";
import { ImageRun, type IImageOptions } from "docx";
import { visit } from "unist-util-visit";
import { imageSize } from "image-size";

type ImageData = Readonly<{
  data: IImageOptions["data"];
  width: number;
  height: number;
  type: IImageOptions["type"];
}>;

const buildImage = ({ data, width, height, type }: ImageData) => {
  return new ImageRun({
    type: type,
    data: data,
    transformation: {
      width,
      height,
    },
  } as IImageOptions);
};

const supportedTypes = ["png", "jpg", "gif", "bmp", "svg"] as const;

const isSupportedType = (
  type: string | undefined,
): type is (typeof supportedTypes)[number] => {
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
  const resolver = async (url: string): Promise<ImageData> => {
    const buf = await load(url);

    const { width, height, type } = imageSize(new Uint8Array(buf));
    if (!isSupportedType(type)) {
      const err = `Not supported image type: ${type}`;
      warnOnce(err);
      throw new Error(err);
    }
    return { data: buf, width, height, type };
  };

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
