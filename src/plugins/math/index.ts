import type { RemarkDocxPlugin } from "../../types";
import { Paragraph, XmlAttributeComponent, XmlComponent } from "docx";
import { mml2omml } from "mathml2omml";
import { XMLParser } from "fast-xml-parser";
import { mathjax } from "@mathjax/src/js/mathjax.js";
import { TeX } from "@mathjax/src/js/input/tex.js";
import { SerializedMmlVisitor } from "@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js";
import { STATE } from "@mathjax/src/js/core/MathItem.js";
import { liteAdaptor } from "@mathjax/src/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js";
// import { source } from "@mathjax/src/components/js/source.js";
import { Loader } from "@mathjax/src/js/components/loader.js";
import "@mathjax/src/components/js/input/tex/extensions/noerrors/noerrors.js";
import "@mathjax/src/components/js/input/tex/extensions/ams/ams.js";
import "@mathjax/src/components/js/input/tex/extensions/boldsymbol/boldsymbol.js";
import "@mathjax/src/components/js/input/tex/extensions/newcommand/newcommand.js";
import "@mathjax/src/components/js/input/tex/extensions/textmacros/textmacros.js";
import "@mathjax/src/components/js/input/tex/extensions/unicode/unicode.js";

// https://devblogs.microsoft.com/math-in-office/officemath/

class MathAttributeComponent extends XmlAttributeComponent<
  Record<string, any>
> {}

class MathXmlComponent extends XmlComponent {
  constructor(
    rootKey: string,
    children: (MathXmlComponent | string)[],
    attrs?: Record<string, any>,
  ) {
    super(rootKey);
    if (attrs) {
      const mathAttrs: Record<string, any> = {};
      for (const [k, v] of Object.entries(attrs)) {
        if (k.startsWith("m:")) {
          mathAttrs[k] = v;
        }
      }
      this.root.push(new MathAttributeComponent(mathAttrs));
    }
    if (children.length) {
      this.root.push(...children);
    }
  }
}

interface XmlText {
  "#text": string | number | boolean;
}
interface XmlAttr {
  [key: string]: string | number | boolean;
}
interface XmlElement {
  [key: string]: typeof key extends ":@" ? XmlAttr : XmlNode[];
}
type XmlNode = XmlElement | XmlText;

const isXmlText = (o: XmlNode): o is XmlText => "#text" in o;

const buildElement = (o: XmlElement): XmlComponent | null => {
  const attrs = o[":@"];
  let tagName = "";
  let children: XmlNode[] | undefined;
  for (const k of Object.keys(o)) {
    if (k !== ":@") {
      tagName = k;
      children = o[k];
      break;
    }
  }

  if (tagName.startsWith("m:")) {
    const mathChildren: (MathXmlComponent | string)[] = [];
    for (const n of children ?? []) {
      if (isXmlText(n)) {
        const text = n["#text"];
        mathChildren.push(String(text));
      } else {
        const c = buildElement(n);
        if (c) {
          mathChildren.push(c);
        }
      }
    }
    return new MathXmlComponent(tagName, mathChildren, attrs);
  }

  return null;
};

/**
 * A plugin to render latex inside "math" and "inlineMath" nodes
 */
export const latexPlugin = (): RemarkDocxPlugin => {
  // https://github.com/mathjax/MathJax-demos-node/blob/master/mjs/mixed/tex2mml
  // https://github.com/mathjax/MathJax-src/blob/master/components/mjs/input/tex/tex.js
  // https://github.com/mathjax/MathJax-src/blob/master/ts/components/startup.ts#L490
  // https://github.com/mathjax/MathJax-src/blob/master/testsuite/src/setupTex.ts#L162
  RegisterHTMLHandler(liteAdaptor() as any);

  const load = [
    "[tex]/noerrors",
    "[tex]/ams",
    "[tex]/newcommand",
    "[tex]/boldsymbol",
    "[tex]/textmacros",
    "[tex]/unicode",
  ];
  const packages = ["base"].concat(load.map((name) => name.slice(6)));
  Loader.preLoaded(...load);

  const tex = new TeX({ packages });
  const doc = mathjax.document("", { InputJax: tex });
  const visitor = new SerializedMmlVisitor();

  const parser = new XMLParser({
    ignoreAttributes: false,
    preserveOrder: true,
    attributeNamePrefix: "",
  });

  const parseLatex = (value: string): XmlComponent | null => {
    const node = doc.convert(value, { end: STATE["CONVERT"] });
    const mathml = visitor.visitTree(node);
    const omml = mml2omml(mathml);
    const obj = parser.parse(omml);
    return buildElement(obj[0]);
  };

  return async () => {
    return {
      math: ({ value }) => {
        const math = parseLatex(value);
        if (!math) {
          return null;
        }
        return new Paragraph({
          children: [math],
        });
      },
      inlineMath: ({ value }) => {
        return parseLatex(value);
      },
    };
  };
};
