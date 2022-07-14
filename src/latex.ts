import * as docx from "docx";
import { latexParser, TeXBuildingBlocks, TeXChar, TeXRaw } from "latex-parser";

const mapTexRaw = (n: TeXRaw): docx.MathRun[] => {
  const res: docx.MathRun[] = [];
  let isGroup = false;
  const text = "";
  for (const c of n.characterCategories) {
    switch (c.category) {
      case 0: // Escape character
        break;
      case 1: // Begin group: {
        isGroup = true;
        break;
      case 2: // End group: }
        isGroup = false;
        if (text) {
          res.push(new docx.MathRun(text));
        }
        break;
      case 3: // Math shift: $
        break;
      case 4: // Alignment: &
        break;
      case 5: // End-of-line
        break;
      case 6: // Parameter for macros: #
        break;
      case 7: {
        // Math superscript: ^
        const prev = res.pop();
        if (!prev) break;
        res.push(
          new docx.MathSuperScript({
            children: [prev],
            superScript: [new docx.MathRun(c.string)],
          })
        );
        break;
      }
      case 8: {
        // Math subscript: _
        const prev = res.pop();
        if (!prev) break;
        res.push(
          new docx.MathSubScript({
            children: [prev],
            subScript: [new docx.MathRun(c.string)],
          })
        );
        break;
      }
      case 9: // Ignored character
        break;
      case 10: // Space
      case 11: // Letters: the alphabet.
      case 12: // 'Other' character - everything else: ., 1, :, etc.
        res.push(new docx.MathRun(c.string));
        break;
      case 13: // Active character - to be interpreted as control sequences: ~
        break;
      case 14: // Start-of-comment: %
        break;
      case 15: // Invalid-in-input: [DEL]
        break;
      default:
        const _: never = c.category;
        break;
    }
  }
  return res;
};

const mapLatex = (n: TeXBuildingBlocks | TeXRaw | TeXChar): docx.MathRun[] => {
  if ("type" in n) {
    switch (n.type) {
      case "TeXRaw":
        return mapTexRaw(n);
      case "TeXComm":
        switch (n.name) {
          case "#":
            return [new docx.MathRun("#")];
          case "$":
            return [new docx.MathRun("$")];
          case "%":
            return [new docx.MathRun("%")];
          case "&":
            return [new docx.MathRun("&")];
          case "textasciitilde":
            return [new docx.MathRun("~")];
          case "_":
            return [new docx.MathRun("_")];
          case "textasciicircum":
            return [new docx.MathRun("^")];
          case "textbackslash":
            return [new docx.MathRun("∖")];
          case "{":
            return [new docx.MathRun("{")];
          case "}":
            return [new docx.MathRun("}")];
          case "textbar":
            return [new docx.MathRun("|")];
          case "textless":
            return [new docx.MathRun("<")];
          case "textgreater":
            return [new docx.MathRun(">")];
          // math
          case "neq":
            return [new docx.MathRun("≠")];
          case "sim":
            return [new docx.MathRun("∼")];
          case "simeq":
            return [new docx.MathRun("≃")];
          case "approx":
            return [new docx.MathRun("≈")];
          case "fallingdotseq":
            return [new docx.MathRun("≒")];
          case "risingdotseq":
            return [new docx.MathRun("≓")];
          case "equiv":
            return [new docx.MathRun("≡")];
          case "geq":
            return [new docx.MathRun("≥")];
          case "geqq":
            return [new docx.MathRun("≧")];
          case "leq":
            return [new docx.MathRun("≤")];
          case "leqq":
            return [new docx.MathRun("≦")];
          case "gg":
            return [new docx.MathRun("≫")];
          case "ll":
            return [new docx.MathRun("≪")];
          case "times":
            return [new docx.MathRun("×")];
          case "div":
            return [new docx.MathRun("÷")];
          case "pm":
            return [new docx.MathRun("±")];
          case "mp":
            return [new docx.MathRun("∓")];
          case "oplus":
            return [new docx.MathRun("⊕")];
          case "ominus":
            return [new docx.MathRun("⊖")];
          case "otimes":
            return [new docx.MathRun("⊗")];
          case "oslash":
            return [new docx.MathRun("⊘")];
          case "circ":
            return [new docx.MathRun("∘")];
          case "cdot":
            return [new docx.MathRun("⋅")];
          case "bullet":
            return [new docx.MathRun("∙")];
          case "ltimes":
            return [new docx.MathRun("⋉")];
          case "rtimes":
            return [new docx.MathRun("⋊")];
          case "in":
            return [new docx.MathRun("∈")];
          case "ni":
            return [new docx.MathRun("∋")];
          case "notin":
            return [new docx.MathRun("∉")];
          case "subset":
            return [new docx.MathRun("⊂")];
          case "supset":
            return [new docx.MathRun("⊃")];
          case "subseteq":
            return [new docx.MathRun("⊆")];
          case "supseteq":
            return [new docx.MathRun("⊇")];
          case "nsubseteq":
            return [new docx.MathRun("⊈")];
          case "nsupseteq":
            return [new docx.MathRun("⊉")];
          case "subsetneq":
            return [new docx.MathRun("⊊")];
          case "supsetneq":
            return [new docx.MathRun("⊋")];
          case "cap":
            return [new docx.MathRun("∩")];
          case "cup":
            return [new docx.MathRun("∪")];
          case "emptyset":
            return [new docx.MathRun("∅")];
          case "infty":
            return [new docx.MathRun("∞")];
          // greek
          case "alpha":
            return [new docx.MathRun("α")];
          case "beta":
            return [new docx.MathRun("β")];
          case "gamma":
            return [new docx.MathRun("γ")];
          case "delta":
            return [new docx.MathRun("δ")];
          case "epsilon":
            return [new docx.MathRun("ϵ")];
          case "zeta":
            return [new docx.MathRun("ζ")];
          case "eta":
            return [new docx.MathRun("η")];
          case "theta":
            return [new docx.MathRun("θ")];
          case "iota":
            return [new docx.MathRun("ι")];
          case "kappa":
            return [new docx.MathRun("κ")];
          case "lambda":
            return [new docx.MathRun("λ")];
          case "eta":
            return [new docx.MathRun("η")];
          case "mu":
            return [new docx.MathRun("μ")];
          case "nu":
            return [new docx.MathRun("ν")];
          case "xi":
            return [new docx.MathRun("ξ")];
          case "pi":
            return [new docx.MathRun("π")];
          case "rho":
            return [new docx.MathRun("ρ")];
          case "sigma":
            return [new docx.MathRun("σ")];
          case "tau":
            return [new docx.MathRun("τ")];
          case "upsilon":
            return [new docx.MathRun("υ")];
          case "phi":
            return [new docx.MathRun("ϕ")];
          case "chi":
            return [new docx.MathRun("χ")];
          case "psi":
            return [new docx.MathRun("ψ")];
          case "omega":
            return [new docx.MathRun("ω")];
          case "varepsilon":
            return [new docx.MathRun("ε")];
          case "vartheta":
            return [new docx.MathRun("ϑ")];
          case "varrho":
            return [new docx.MathRun("ϱ")];
          case "varsigma":
            return [new docx.MathRun("ς")];
          case "varphi":
            return [new docx.MathRun("φ")];
          case "Gamma":
            return [new docx.MathRun("Γ")];
          case "Delta":
            return [new docx.MathRun("Δ")];
          case "Theta":
            return [new docx.MathRun("Θ")];
          case "Lambda":
            return [new docx.MathRun("Λ")];
          case "Xi":
            return [new docx.MathRun("Ξ")];
          case "Pi":
            return [new docx.MathRun("Π")];
          case "Sigma":
            return [new docx.MathRun("Σ")];
          case "Upsilon":
            return [new docx.MathRun("Υ")];
          case "Phi":
            return [new docx.MathRun("Φ")];
          case "Psi":
            return [new docx.MathRun("Ψ")];
          case "Omega":
            return [new docx.MathRun("Ω")];
          // commands
          case "frac":
          case "tfrac":
          case "dfrac":
            return [
              new docx.MathFraction({
                numerator: mapLatex(n.arguments[0].latex[0]),
                denominator: mapLatex(n.arguments[1].latex[0]),
              }),
            ];
          case "sqrt":
            break;
          default:
            return n.arguments.flatMap((a) => {
              return a.latex.flatMap(mapLatex);
            });
        }
        break;
      default:
        break;
    }
  }
  return [];
};

export const parseLatex = (value: string): docx.MathRun[] => {
  const parsed = latexParser.parse(value);
  let latex: docx.MathRun[] = [];
  if (parsed.status) {
    latex = parsed.value.reduce((acc, n) => {
      const res = mapLatex(n);
      if (res) {
        acc.push(...res);
      }
      return acc;
    }, [] as docx.MathRun[]);
  }
  return latex;
};
