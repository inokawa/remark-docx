import { Paragraph, TextRun } from "docx";
import type { RemarkDocxPlugin } from "../../types";
import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";
import { visit } from "unist-util-visit";
import type { FontStyle } from "shiki/textmate";

export interface ShikiPluginOptions {
  /**
   * https://shiki.style/themes
   */
  theme: BundledTheme;
}

/**
 * A plugin to render "code" nodes, with syntax highlighting powered by shiki.
 */
export const shikiPlugin = ({
  theme,
}: ShikiPluginOptions): RemarkDocxPlugin => {
  let highlighter: Awaited<ReturnType<typeof createHighlighter>> | undefined;
  const langs = new Set<string>();

  return async ({ root }) => {
    const newLangs: string[] = [];

    visit(root, "code", ({ lang }) => {
      if (lang) {
        if (!langs.has(lang)) {
          langs.add(lang);
          newLangs.push(lang);
        }
      }
    });

    if (!highlighter) {
      highlighter = await createHighlighter({
        themes: [theme],
        langs: [...langs],
      });
    } else {
      await Promise.all(
        newLangs.map((l) => highlighter!.loadLanguage(l as BundledLanguage)),
      );
    }

    return {
      code: ({ value, lang }) => {
        if (!lang) {
          return null;
        }
        const res = highlighter!.codeToTokens(value, {
          lang: lang as BundledLanguage,
          theme,
        });

        return res.tokens.map((r) => {
          return new Paragraph({
            shading: {
              type: "clear",
              color: "auto",
              fill: res.bg,
            },
            children: r.map(({ content, bgColor, color, fontStyle }) => {
              return new TextRun({
                text: content,
                color: color ?? res.fg,
                shading: bgColor
                  ? {
                      type: "clear",
                      color: "auto",
                      fill: bgColor,
                    }
                  : undefined,
                bold: fontStyle === (2 satisfies FontStyle.Bold),
                italics: fontStyle === (1 satisfies FontStyle.Italic),
                underline:
                  fontStyle === (4 satisfies FontStyle.Underline)
                    ? { type: "single", color: res.fg }
                    : undefined,
                strike: fontStyle === (8 satisfies FontStyle.Strikethrough),
              });
            }),
          });
        });
      },
    };
  };
};
