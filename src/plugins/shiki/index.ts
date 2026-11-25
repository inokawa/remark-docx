import { Paragraph, TextRun } from "docx";
import type { RemarkDocxPlugin } from "../../types";
import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";
import { visit } from "unist-util-visit";
import type { FontStyle } from "shiki/textmate";
import { warnOnce } from "../../utils";

/**
 * Format to 6 disit hex. Alpha is blended onto base (6 digit hex) because docx doesn't support it.
 */
const formatHex = (str: string, base = "#ffffff"): string => {
  // #RGB
  if (str.length === 4) {
    const r = str[1]!;
    const g = str[2]!;
    const b = str[3]!;
    return str[0]! + r + r + g + g + b + b;
  }
  // #RRGGBBAA
  if (str.length === 9) {
    const alpha = parseInt(str.slice(7), 16) / 255;
    let res = "#";
    for (let i = 1; i < 7; i += 2) {
      const c = parseInt(str.slice(i, i + 2), 16);
      const b = parseInt(base.slice(i, i + 2), 16);
      res += Math.round(c * alpha + b * (1 - alpha))
        .toString(16)
        .padStart(2, "0");
    }
    return res;
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
  const failedLangs = new Set<string>();

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
        langs: [],
      });
    }
    await Promise.all(
      newLangs.map(async (l) => {
        try {
          await highlighter!.loadLanguage(l as BundledLanguage);
        } catch (e) {
          failedLangs.add(l);
          warnOnce(String(e));
        }
      }),
    );

    return {
      code: ({ value, lang }) => {
        if (!lang || failedLangs.has(lang)) {
          return null;
        }
        const res = highlighter!.codeToTokens(value, {
          lang: lang as BundledLanguage,
          theme,
        });
        let { bg, fg } = res;
        if (bg) {
          bg = formatHex(bg);
        }
        if (fg) {
          fg = formatHex(fg, bg);
        }

        return res.tokens.map((r) => {
          return new Paragraph({
            shading: {
              type: "clear",
              color: "auto",
              fill: bg,
            },
            children: r.map(({ content, bgColor, color, fontStyle }) => {
              if (bgColor) {
                bgColor = formatHex(bgColor, bg);
              }
              if (color) {
                color = formatHex(color, bgColor ?? bg);
              }
              const style = fontStyle ?? 0;
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
                bold: !!(style & (2 satisfies FontStyle.Bold)),
                italics: !!(style & (1 satisfies FontStyle.Italic)),
                underline:
                  style & (4 satisfies FontStyle.Underline)
                    ? { type: "single", color: fg }
                    : undefined,
                strike: !!(style & (8 satisfies FontStyle.Strikethrough)),
              });
            }),
          });
        });
      },
    };
  };
};
