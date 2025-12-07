import type { RemarkDocxOverrides } from "../types";
import { Math, Paragraph } from "docx";
import { parseLatex } from "./parser";

/**
 * A plugin to render latex inside "math" and "inlineMath" nodes
 */
export const latexPlugin = (): RemarkDocxOverrides => {
  return {
    math: ({ value }) => {
      return parseLatex(value).map(
        (runs) =>
          new Paragraph({
            children: [
              new Math({
                children: runs,
              }),
            ],
          }),
      );
    },
    inlineMath: ({ value }) => {
      return [
        new Math({
          children: parseLatex(value).flatMap((runs) => runs),
        }),
      ];
    },
  };
};
