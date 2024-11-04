import { it, describe, expect } from "vitest";
import { parseLatex } from "./latex";

const parse = (str: string) => parseLatex(str);

describe("parse", () => {
  [
    "L = \\frac{1}{2} \\rho v^2 S C_L",
    "i hbar \\frac{partial psi}{partial t} = H psi(x,t)",
    "\\f\\relax{x} = \\int_{-\\infty}^\\infty\\f\\hat\\xi\\,e^{2 \\pi i \\xi x}\\,d\\xi",
    "\\frac{a+b}{c+d}",
    "\\sqrt[30]{a+\\sqrt{b+c}}",
    "\\sum_{k=1}^{n} k=\frac{n(n+1)}{2}",
  ].forEach((s) => {
    it(s, () => {
      expect(parse(s)).toMatchSnapshot();
    });
  });

  describe("command", () => {
    it("greek1", () => {
      expect(
        parse(
          "\\alpha\\beta\\gamma\\delta\\epsilon\\zeta\\eta\\theta\\iota\\kappa\\lambda\\mu\\nu\\xi o\\pi\\rho\\sigma\\tau\\upsilon\\phi\\chi\\psi\\omega",
        ),
      ).toMatchSnapshot();
    });
    it("greek2", () => {
      expect(
        parse("\\varepsilon\\vartheta\\varrho\\varsigma\\varphi"),
      ).toMatchSnapshot();
    });
    it("greek3", () => {
      expect(
        parse(
          "\\Gamma\\Delta\\Theta\\Lambda\\Xi\\Pi\\Sigma\\Upsilon\\Phi\\Psi\\Omega",
        ),
      ).toMatchSnapshot();
    });
  });
});
