import {
  MathRun,
  MathSuperScript,
  MathSubScript,
  MathRadical,
  MathFraction,
  MathSum,
} from "docx";
import { parseMath } from "@unified-latex/unified-latex-util-parse";
import type * as latex from "@unified-latex/unified-latex-types";
import { invariant } from "./utils";

/**
 * @internal
 */
export type LatexParser = (value: string) => MathRun[][];

const hasSquareBrackets = (
  arg: latex.Argument | undefined,
): arg is latex.Argument => {
  return !!arg && arg.openMark === "[" && arg.closeMark === "]";
};
const hasCurlyBrackets = (
  arg: latex.Argument | undefined,
): arg is latex.Argument => {
  return !!arg && arg.openMark === "{" && arg.closeMark === "}";
};

const mapString = (s: string): MathRun => new MathRun(s);

const mapMacro = (n: latex.Macro, runs: MathRun[]): MathRun | false => {
  switch (n.content) {
    case "#":
      return mapString("#");
    case "$":
      return mapString("$");
    case "%":
      return mapString("%");
    case "&":
      return mapString("&");
    case "textasciitilde":
      return mapString("~");
    case "textasciicircum":
      return mapString("^");
    case "textbackslash":
      return mapString("∖");
    case "{":
      return mapString("{");
    case "}":
      return mapString("}");
    case "textbar":
      return mapString("|");
    case "textless":
      return mapString("<");
    case "textgreater":
      return mapString(">");
    case "neq":
      return mapString("≠");
    case "sim":
      return mapString("∼");
    case "simeq":
      return mapString("≃");
    case "approx":
      return mapString("≈");
    case "fallingdotseq":
      return mapString("≒");
    case "risingdotseq":
      return mapString("≓");
    case "equiv":
      return mapString("≡");
    case "geq":
      return mapString("≥");
    case "geqq":
      return mapString("≧");
    case "leq":
      return mapString("≤");
    case "leqq":
      return mapString("≦");
    case "gg":
      return mapString("≫");
    case "ll":
      return mapString("≪");
    case "times":
      return mapString("×");
    case "div":
      return mapString("÷");
    case "pm":
      return mapString("±");
    case "mp":
      return mapString("∓");
    case "oplus":
      return mapString("⊕");
    case "ominus":
      return mapString("⊖");
    case "otimes":
      return mapString("⊗");
    case "oslash":
      return mapString("⊘");
    case "circ":
      return mapString("∘");
    case "cdot":
      return mapString("⋅");
    case "bullet":
      return mapString("∙");
    case "ltimes":
      return mapString("⋉");
    case "rtimes":
      return mapString("⋊");
    case "in":
      return mapString("∈");
    case "ni":
      return mapString("∋");
    case "notin":
      return mapString("∉");
    case "subset":
      return mapString("⊂");
    case "supset":
      return mapString("⊃");
    case "subseteq":
      return mapString("⊆");
    case "supseteq":
      return mapString("⊇");
    case "nsubseteq":
      return mapString("⊈");
    case "nsupseteq":
      return mapString("⊉");
    case "subsetneq":
      return mapString("⊊");
    case "supsetneq":
      return mapString("⊋");
    case "cap":
      return mapString("∩");
    case "cup":
      return mapString("∪");
    case "emptyset":
      return mapString("∅");
    case "infty":
      return mapString("∞");
    case "partial":
      return mapString("∂");
    case "aleph":
      return mapString("ℵ");
    case "hbar":
      return mapString("ℏ");
    case "wp":
      return mapString("℘");
    case "Re":
      return mapString("ℜ");
    case "Im":
      return mapString("ℑ");
    case "alpha":
      return mapString("α");
    case "beta":
      return mapString("β");
    case "gamma":
      return mapString("γ");
    case "delta":
      return mapString("δ");
    case "epsilon":
      return mapString("ϵ");
    case "zeta":
      return mapString("ζ");
    case "eta":
      return mapString("η");
    case "theta":
      return mapString("θ");
    case "iota":
      return mapString("ι");
    case "kappa":
      return mapString("κ");
    case "lambda":
      return mapString("λ");
    case "eta":
      return mapString("η");
    case "mu":
      return mapString("μ");
    case "nu":
      return mapString("ν");
    case "xi":
      return mapString("ξ");
    case "pi":
      return mapString("π");
    case "rho":
      return mapString("ρ");
    case "sigma":
      return mapString("σ");
    case "tau":
      return mapString("τ");
    case "upsilon":
      return mapString("υ");
    case "phi":
      return mapString("ϕ");
    case "chi":
      return mapString("χ");
    case "psi":
      return mapString("ψ");
    case "omega":
      return mapString("ω");
    case "varepsilon":
      return mapString("ε");
    case "vartheta":
      return mapString("ϑ");
    case "varrho":
      return mapString("ϱ");
    case "varsigma":
      return mapString("ς");
    case "varphi":
      return mapString("φ");
    case "Gamma":
      return mapString("Γ");
    case "Delta":
      return mapString("Δ");
    case "Theta":
      return mapString("Θ");
    case "Lambda":
      return mapString("Λ");
    case "Xi":
      return mapString("Ξ");
    case "Pi":
      return mapString("Π");
    case "Sigma":
      return mapString("Σ");
    case "Upsilon":
      return mapString("Υ");
    case "Phi":
      return mapString("Φ");
    case "Psi":
      return mapString("Ψ");
    case "Omega":
      return mapString("Ω");
    case "newline":
    case "\\":
      // line break
      return false;
    case "^": {
      const prev = runs.pop();
      if (!prev) break;
      return new MathSuperScript({
        children: [prev],
        superScript: mapGroup(n.args?.[0]?.content ?? []),
      });
    }
    case "_": {
      const prev = runs.pop();
      if (!prev) break;
      return new MathSubScript({
        children: [prev],
        subScript: mapGroup(n.args?.[0]?.content ?? []),
      });
    }
    case "hat":
      // TODO: implement
      break;
    case "widehat":
      // TODO: implement
      break;
    case "sum": {
      // TODO: support superscript and subscript
      return new MathSum({
        children: [],
      });
    }
    case "int":
      return mapString("∫");
    case "frac":
    case "tfrac":
    case "dfrac": {
      const args = n.args ?? [];
      if (
        args.length === 2 &&
        hasCurlyBrackets(args[0]) &&
        hasCurlyBrackets(args[1])
      ) {
        return new MathFraction({
          numerator: mapGroup(args[0].content),
          denominator: mapGroup(args[1].content),
        });
      }
      break;
    }
    case "sqrt": {
      const args = n.args ?? [];
      if (args.length === 1 && hasCurlyBrackets(args[0])) {
        return new MathRadical({
          children: mapGroup(args[0].content),
        });
      }
      if (
        args.length === 2 &&
        hasSquareBrackets(args[0]) &&
        hasCurlyBrackets(args[1])
      ) {
        return new MathRadical({
          children: mapGroup(args[1].content),
          degree: mapGroup(args[0].content),
        });
      }
      break;
    }
    default:
      break;
  }
  return mapString(n.content);
};

const mapGroup = (nodes: latex.Node[]): MathRun[] => {
  const group: MathRun[] = [];
  for (const c of nodes) {
    group.push(...(mapNode(c, group) || []));
  }
  return group;
};

const mapNode = (n: latex.Node, runs: MathRun[]): MathRun[] | false => {
  switch (n.type) {
    case "root":
      break;
    case "string":
      return [mapString(n.content)];
    case "whitespace":
      break;
    case "parbreak":
      break;
    case "comment":
      break;
    case "macro":
      const run = mapMacro(n, runs);
      if (!run) {
        // line break
        return false;
      } else {
        return [run];
      }
    case "environment":
    case "mathenv":
      break;
    case "verbatim":
      break;
    case "inlinemath":
      break;
    case "displaymath":
      break;
    case "group":
      return mapGroup(n.content);
    case "verb":
      break;
    default:
      invariant(false, "unreachable");
  }

  return [];
};

/**
 * @internal
 */
export const parseLatex: LatexParser = (value: string): MathRun[][] => {
  const parsed = parseMath(value);
  const paragraphs: MathRun[][] = [[]];
  let runs: MathRun[] = paragraphs[0]!;
  for (const n of parsed) {
    const res = mapNode(n, runs);
    if (!res) {
      // line break
      paragraphs.push((runs = []));
    } else {
      runs.push(...res);
    }
  }
  return paragraphs;
};
