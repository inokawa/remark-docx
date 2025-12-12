import type { RemarkDocxPlugin } from "../../types";
import { fromHtml } from "hast-util-from-html";
import { toMdast } from "hast-util-to-mdast";
import type { Root } from "mdast";

/**
 * A plugin to render "html" node.
 */
export const htmlPlugin = (): RemarkDocxPlugin => {
  return async () => {
    return {
      html: ({ value }, ctx) => {
        const hast = fromHtml(value, { fragment: true });
        const mdast = toMdast(hast, {
          nodeHandlers: {
            comment: () => {
              // Ignore comment node to avoid "RangeError: Maximum call stack size exceeded"
            },
          },
        });
        return ctx.next((mdast as Root).children);
      },
    };
  };
};
