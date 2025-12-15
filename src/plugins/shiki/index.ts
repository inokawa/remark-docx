import { Paragraph, TextRun } from "docx";
import type { RemarkDocxPlugin } from "../../types";
import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";
import { visit } from "unist-util-visit";
import type { FontStyle } from "shiki/textmate";

/**
 * Format to 6 disit hex
 */
const formatHex = (str: string): string => {
  // #RGB
  if (str.length === 4) {
    const r = str[1]!;
    const g = str[2]!;
    const b = str[3]!;
    return str[0]! + r + r + g + g + b + b;
  }
  // #RRGGBBAA
  if (str.length === 9) {
    return str.slice(0, 7);
  }
  return str;
};

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
        let { bg, fg } = res;
        if (fg) {
          fg = formatHex(fg);
        }
        if (bg) {
          bg = formatHex(bg);
        }

        return res.tokens.map((r) => {
          return new Paragraph({
            shading: {
              type: "clear",
              color: "auto",
              fill: bg,
            },
            children: r.map(({ content, bgColor, color, fontStyle }) => {
              if (color) {
                color = formatHex(color);
              }
              if (bgColor) {
                bgColor = formatHex(bgColor);
              }
              return new TextRun({
                text: content,
                color: color ?? fg,
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
                    ? { type: "single", color: fg }
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
