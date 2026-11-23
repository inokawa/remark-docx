# Science, engineering and education DSLs in Markdown: demand for Word (.docx) output and JS rendering feasibility

Research date: 2026-11-23. Method: Obsidian community-plugin data files were downloaded and filtered by keyword. npm weekly downloads came from api.npmjs.org (week of 2026-11-16 to 2026-11-22). The renderers were installed locally and tested in Node.js v26 (scratchpad, outside the repo). About 15 web searches and fetches were run.

Legend: **[V]** = checked here (local test, or data/page fetched directly). **[S]** = from a search-result summary or third-party page, not opened in full. **[I]** = inference.

**Searches run**
- Obsidian:
  - community-plugins.json (10,759 plugins) and community-plugin-stats.json, filtered with keyword regexes: smiles, chem, molec, fasta, phylo, newick, plasmid, protein, pdb, circuit, wavedrom, spice, asciimath, typst, desmos, geogebra, abc, music, lilypond, chord, guitar, fretboard, qr, tikz, plot, and others.
- Web:
  - "pandoc mhchem \ce docx Word"
  - "abc notation to Word document export"
  - "quarto extension smiles rdkit"
  - "wavedrom docx export markdown"
  - "electronic lab notebook markdown export docx chemotion eLabFTW"
  - "abcjs node.js server side render svg jsdom"
  - "smiles-drawer node.js svg jsdom"
  - "obsidian chem plugin smiles export pdf docx"
  - "HackMD abc music notation fretboard"
  - "RDKit.js get_svg Node.js"
  - "Markdown 化学式 Word 変換 mhchem pandoc docx" (JP)
  - "MyST markdown chemistry smiles directive"
  - "insert chemical structure SMILES into Microsoft Word add-in"
  - "楽譜 ABC記法 Word 貼り付け 教材 プリント" (JP)
  - "GitHub ```math GitLab math fence"
  - "pandoc filter abc lilypond docx"
  - "markdown newick phylogenetic tree code block"
  - "markdown-it-smiles / remark smiles"
  - "Mathpix Markdown smiles docx"
- Fetched pages: Microsoft Learn's mhchem page, the Obsidian forum thread "SMILES in Obsidian", the folkdb/abc-render-svg README, and the smiles-drawer README.

## Q1. Which platforms and tools support each DSL in Markdown, and how big is the user base?

### Takeaway
All of the chemistry, music, EE and math DSLs have working Markdown renderers, mostly as Obsidian plugins. Lifetime Obsidian downloads are moderate:
- abc: about 36k
- Desmos: about 33k
- chord sheets: about 26k
- SMILES ("Chem" plugin): about 22k
- Typst math: about 20k
- AsciiMath: about 11k
- WaveDrom: about 8k

Biology formats (FASTA, Newick, GenBank) have almost no Markdown tooling. For comparison, TikZJax has about 65k and Latex Suite has about 735k.

### Cited Findings

**Obsidian plugin lifetime downloads [V]**

Source for every number below: [community-plugin-stats.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json). Plugin metadata comes from [community-plugins.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json).

- **Chemistry**
  - `chem` (acylation/obsidian-chem; "Rendering SMILES strings into chemistry structures"): **22,440**
  - `ketcher` (yulei-chen; view and draw structures and reactions): 11,044
  - `chemical-structure-renderer` (xaya1001; SMILES to PNG or SVG via Ketcher): 7,273
  - `chemedit` (ruzx; "Chemistry editor ... with ELN support"): 6,389
  - `chemedit-universal` (SMILES/MOL): 1,145
  - `molren` (SMILES, molfile, SDF, rxn; RDKit.js): 1,047
  - `chemrender` (3D proteins and molecules): 841
  - `chemtrails` (SMILES to SVG): 817
  - `chem-search` (substructure search): 431
  - `chemspec` (NMR/IR spectra): 253
  - `lab-kit` (chemistry lab notebook): 182
  - `smiles-structure-preview` (SMILES/SMARTS): 39
  - Total across the SMILES/structure plugins: roughly 50k+ [I, sum of the above].
- **Biology**
  - `gene-code` (DNA variant lollipop and pedigree diagrams): 155
  - `biosequence` (amino-acid/DNA/RNA sequence colouring): 61
  - `reverse-complement`: 1,999
  - No Newick/phylotree, FASTA alignment or GenBank/plasmid plugin is in the official list.
  - An Obsidian phylotree plugin does exist outside the official list ([echinopscis blog](https://echinopscis.github.io/blog/2024/phylo-vis)) [S].
- **Physics and EE**
  - `obsidian-wavedrom`: 8,158
  - `circuit-sketcher`: 7,928
  - `obsidian-circuitjs`: 6,677
  - `circuit` (JSON schematics): 135
  - `spice-schematic-preview` (SPICE netlist code blocks to schematic): 56
  - `obsidian-tikzjax` (TikZ, used for circuitikz-style drawings): 64,896
  - `tikzjax-next`: 2,622
  - `luatikz`: 1,582
- **Math and education**
  - `obsidian-desmos`: 33,161
  - `typst-mate` (Typst instead of MathJax for math): 20,559
  - `typst` (code and math blocks): 14,960
  - `wypst`: 5,335
  - `obsidian-asciimath`: 11,196
  - `obsidian-plotly`: 12,665
  - `lmath` (function graphs): 4,470
  - `mathematica-plot`: 3,433
  - `geogebra`: 399
  - `obsidian-latex-suite` (benchmark): 734,738
- **Music**
  - `music-code-blocks` (abcjs): **35,611**
  - `chord-sheets`: 26,295
  - `obsidian-jtab` (guitar tabs/chords): 11,353
  - `scales-chords`: 8,619
  - `vextab`: 6,917
  - `chord-lyrics`: 6,204
  - `markdown-chords`: 5,509
  - `lilypond`: 4,902
  - `sheet-music` (ABC, strumming, chords): 3,546
  - `verovio-music-renderer` (MEI, MusicXML, abc): 3,312
  - `guitar-chord`: 3,113
  - `gtp-preview` (Guitar Pro): 2,520
  - `chopro-viewer` (ChordPro): 1,904
  - `fretboard-renderer`: 1,374
- **Other**
  - `obsidian-qrcode-plugin`: 12,999
  - `chessview` (PGN/FEN): 2,295

**Demand history for SMILES**
- The Obsidian forum request "SMILES in Obsidian" was opened 2022-04-17 and had 13 posts. A physics/chemistry teacher wanted to test it. Acylation released obsidian-chem on 2023-04-29, using smiles-drawer. Export to Word or PDF was not discussed. — [Obsidian forum](https://forum.obsidian.md/t/smiles-in-obsidian/35974) [V]
- Chem renders `smiles` code blocks with Smiles Drawer and RDKit.js, and has a right-click image copy. — [Obsidian plugin page](https://community.obsidian.md/plugins/chem) [S]
- Chemical Structure Renderer warns that it may conflict with Obsidian-Chem because both transform `smiles` code blocks. This shows that ```` ```smiles ```` is the de-facto fence name. — [plugin page](https://community.obsidian.md/plugins/chemical-structure-renderer) [S]

**Other Markdown ecosystems**
- **Mathpix Markdown** (mathpix-markdown-it, 9,475 downloads per week on npm [V])
  - Supports SMILES in a ```` ```smiles ```` fence and inline. — [npm](https://www.npmjs.com/package/mathpix-markdown-it) [S]
  - Mathpix sells Markdown-to-DOCX conversion "optimized for scientific documents". — [Mathpix](https://mathpix.com/markdown-to-docx) [S]
  - Its Markdown-to-PDF page says SMILES renders as diagrams in PDF. — [Mathpix](https://mathpix.com/markdown-to-pdf) [S]
  - I found no statement on whether SMILES survives into DOCX (gap).
- **markdown-it-smiles** (smiles-drawer; block and inline; "browser and Node.js" in v2): 20 downloads per week.
  - remark-smiles: 20 per week; last release more than 3 years ago.
  - rehype-smiles (openchemlib): 20 per week.
  - Sources: [markdown-it-smiles README](https://cdn.jsdelivr.net/npm/markdown-it-smiles@2.1.3/README.md), [remark-smiles on ecosyste.ms](https://packages.ecosyste.ms/registries/npmjs.org/packages/remark-smiles), [rehype-smiles](https://www.npmjs.com/package/rehype-smiles) [S]. npm counts [V].
- **MyST and Quarto**
  - I found no SMILES directive for MyST or Sphinx.
  - MyST's `myst_fence_as_directive` (v1.0.0) lets fences act as directives. — [MyST optional syntax](https://myst-parser.readthedocs.io/en/latest/syntax/optional.html) [S]
  - I found no Quarto extension for SMILES. The only chemistry-related Quarto extension found is MolViewSpec, for 3D Mol* structures. — [molstar.org/molviewspec-quarto](https://molstar.org/molviewspec-quarto/); [Quarto extensions listing](https://quarto.org/docs/extensions/) [S]
- **HackMD/CodiMD:** renders abc notation with abc.js — [HackMD extra syntax](https://hackmd.io/@codimd/extra-supported-syntax). HackMD also published a "music sheet" use-case blog post — [HackMD blog](https://hackmd.io/blog/2022/11/21/usecase-musicsheet) [S]. No HackMD fretboard block was found.
- **Joplin:** has ABC sheet music and WaveDrom plugins — [Joplin ABC](https://joplinapp.org/plugins/plugin/org.joplinapp.plugins.AbcSheetMusic/), [Joplin WaveDrom](https://joplinapp.org/plugins/plugin/net.cwesson.joplin-plugin-wavedrom/) [S].
- **WaveDrom elsewhere:** also supported by Asciidoctor-diagram, a MkDocs plugin and DokuWiki — [Asciidoctor](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/wavedrom/), [mkdocs-wavedrom-plugin](https://pypi.org/project/mkdocs-wavedrom-plugin/0.1.0/) [S].
- **GitHub and GitLab `math` fences**
  - GitHub supports a ```` ```math ```` fence as an alternative to `$$` (MathJax). — [GitHub Docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions)
  - GitLab supports ```` ```math ```` with KaTeX. — [GLFM](https://archives.docs.gitlab.com/15.8/ee/user/markdown.html)
  - A pandoc issue reports that ```` ```math ```` was not handled the way GitHub handles it. — [pandoc#8633](https://github.com/jgm/pandoc/issues/8633) [S]
- **ELNs**
  - eLabFTW has a Markdown editor. It exports PDF, CSV, JSON and .eln, with no DOCX listed. — [search summary of university ELN pages, e.g. TU Graz eLabFTW guide](https://repository.tugraz.at/records/aptp3-zj734/files/eLabFTW_Guide_User_en_v5.0.pdf?download=1) [S]
  - Sciformation ELN outputs .pdf, html or .docx reports. — [Uni Düsseldorf paper](https://www.cpclab.uni-duesseldorf.de/data/_uploaded/file/paper/291.pdf) [S]
  - A Düsseldorf paper describes method descriptions kept in .docx for reuse in theses and manuscripts. — [same source](https://www.cpclab.uni-duesseldorf.de/data/_uploaded/file/paper/291.pdf) [S]
  - Chemotion: no Markdown or DOCX export was found [S].

### Inferences
- The strongest Markdown-native signals, by Obsidian downloads and npm activity, are:
  1. abc music
  2. SMILES / chemical structures (spread across many plugins)
  3. chord sheets and tabs
  4. Typst math
  5. AsciiMath
  6. QR codes
  7. WaveDrom
- Biology (FASTA, MSA, Newick, GenBank) has almost no Markdown-native demand.
- ```` ```smiles ```` and ```` ```abc ```` are de-facto standard fence names across several tools (Obsidian Chem, Mathpix, markdown-it-smiles; HackMD, Obsidian abcjs).

### Gaps
- Obsidian figures are lifetime downloads, not active users.
- Not checked: InChI, reaction-SMILES-specific tooling, GenBank/plasmid Markdown tooling, circuitikz outside TikZJax, schemdraw (Python-only), LTspice, ChordPro outside Obsidian, Quarto abc/lilypond extensions, Jupyter/MPE support for these fences, Benchling/SciNote/RSpace export formats.

## Q2. Is there evidence of demand for Word/.docx output specifically?

### Takeaway
Direct "Markdown DSL to docx" requests are rare. I found no issue or forum post asking for SMILES or abc in a Word export. The indirect evidence is strong, though:
- Microsoft added native mhchem `\ce{}` input to Word in 2026.
- Commercial Word add-ins convert SMILES to structures.
- Mathpix sells science Markdown-to-DOCX conversion.
- Pandoc users hit the problem that `\ce` is dropped in docx output.

### Cited Findings
- **Microsoft 365 mhchem support [V]**
  - Word, Excel and PowerPoint now accept LaTeX `\ce{...}` (mhchem) in equation input and convert it to standard OMML. This needs Version 2605 (Build 20026.20000) for Windows or 16.109 for Mac; nested groups need 2610 / 16.114. The page is dated 2026-11-07.
  - Not supported: `\pu{}`, `\bond{}`, `<=>>`-style arrows, `@{}` arrow labels, and double or triple bond rendering.
  - Round-trip goes back to plain math, for example `\mathrm{H}_{2}\mathrm{O}`.
  - Source: [Microsoft Learn: LaTeX mhchem Support](https://learn.microsoft.com/en-us/office/math/latex.mhchem)
- **Pandoc and `\ce`**
  - A community pandoc Lua filter strips `\ce` entirely when the output is docx. — [pd-chem-filter.lua](https://gogs.elic.ucl.ac.be/pbarriat/learning-markdown/src/692de0a30ce286e919fdf963bf82fe01a7de2ae3/example/assets/pd-chem-filter.lua) [S]
  - pandoc-chem-struct (`s:{...}` syntax) emits sub/superscripted text for docx. — [pandoc-chem-struct README](https://github.com/scotthartley/pandoc-chem-struct/blob/master/README.md) [S]
  - Together these show existing demand for chemistry in Markdown-to-docx pipelines [I].
- **SMILES add-ins for Word**
  - ChemAxon JChem for Office has a "From SMILES" ribbon button that inserts structures into Word (as images). — [ChemAxon docs](https://docs.chemaxon.com/Convert_from_SMILES_to_Structure.html) [S]
  - Microsoft Research's Chem4Word (Chemistry Add-in for Word, CML-based) targets students and researchers. — [MSR](https://www.microsoft.com/en-us/research/?p=185494) [S]
  - Another Word add-in on Microsoft Marketplace takes SMILES input. — [Marketplace WA200011363](https://marketplace.microsoft.com/ar-ly/product/WA200011363?tab=Overview) [S]
  - This shows chemists want SMILES-driven structures in Word documents [I].
- **Mathpix:** sells Markdown-to-DOCX for scientific documents; its Markdown supports SMILES. — [Mathpix markdown-to-docx](https://mathpix.com/markdown-to-docx) [S]
- **Music to Word:** I found no direct ABC-to-Word exporter. Suggested routes are abcm2ps or EasyABC to SVG/PDF, then insert into Word. A MuseScore forum thread notes that getting a score into Word is hard. — [MuseScore forum](https://musescore.org/en/node/319825), [EasyABC](https://easyabc.sourceforge.net/) [S]
- **Japanese search** (楽譜 ABC記法 Word 教材): found only ABC primers ([asahi-net](https://www.asahi-net.or.jp/~mf4n-nmr/abc_notation.html)) and a Hyogo prefecture ICT teaching PDF ([hyogo-c.ed.jp](https://www.hyogo-c.ed.jp/~ictcnt/h19se/pdf/2/17.pdf)). Nothing on an ABC-to-Word workflow [S].
- **Japanese chemistry search** (Markdown 化学式 Word): found only generic pandoc md-to-docx articles ([classmethod](https://dev.classmethod.jp/articles/pandoc-docker-md-to-docx/)) and the Microsoft mhchem page [S].
- **WaveDrom to docx:** no DOCX path found. The documented route is the CLI to SVG, then `@resvg/resvg-js-cli` to PNG. — [wavedrom README](https://cdn.jsdelivr.net/npm/wavedrom@3.6.1/README.md) [S]
- **Pandoc LilyPond filters:** exist but are tied to LaTeX/PDF output. — [pandoc/lua-filters#167](https://github.com/pandoc/lua-filters/issues/167), [pandocfilters lilypond.py](https://sources.debian.org/src/python-pandocfilters/1.5.1-1/examples/lilypond.py) [S]

### Inferences
- mhchem has the clearest docx story:
  - Word itself now treats `\ce{}` as first-class.
  - A Markdown math node containing `\ce{}` going to docx is a gap users will notice in remark-docx.
  - Native OMML output (not an image) matches what Word does.
- SMILES demand exists. It shows up through Word add-ins, ELN/report workflows and Mathpix rather than as "please add to my Markdown-to-docx tool" posts. Lack of such posts reflects how few Markdown-to-docx tools exist, not lack of demand [I].
- Music (abc, chords) has large Markdown usage, but no documented Word workflow was found. Teachers making worksheets are a plausible use case but unverified [I].

### Gaps
- No GitHub issues found asking for SMILES, abc or WaveDrom in docx output from pandoc, Quarto or Obsidian export plugins. I did not search the GitHub issue trackers of obsidian-chem, obsidian-enhancing-export or quarto-dev directly.
- No Japanese lab-report or thesis sources found on Markdown-to-Word with chemistry or music.

## Q3. Can each DSL be rendered in JS in both the browser and Node.js? (npm downloads, size, license)

### Takeaway
DOM-free renderers that work in Node.js today (tested locally):
- **RDKit.js** `get_svg()`, including reactions
- **OpenChemLib** `toSVG()`, including reactions and molfile
- **WaveDrom** `renderAny` + `onml.stringify`
- **mhchemparser** → LaTeX
- **asciimath2tex** → LaTeX

DOM-dependent (fail in Node without jsdom, also tested):
- **smiles-drawer**
- **abcjs**

**mhchemparser output does not fully pass docx's `latexToMath`:** `\longrightleftharpoons` (`<=>`) throws.

### Cited Findings

**Local tests [V]**

Node v26, packages installed in the scratchpad, test scripts run directly.

- **@rdkit/rdkit 2026.9.2**
  - Results:
    - `initRDKitModule()` then `get_mol('c1ccccc1O').get_svg()` returns an SVG string (4,256 chars). No DOM needed.
    - `get_rxn('CCO>>CC=O').get_svg()` also works (reaction SMILES).
    - The dist contains `RDKit_minimal.wasm` at **7.39 MB** plus a 103 KB JS loader.
  - Package facts: BSD-3-Clause; unpacked 7.5 MB; 99,824 downloads per week.
  - Sources: [npm @rdkit/rdkit](https://www.npmjs.com/package/@rdkit/rdkit); [Getting started (Debian copy of RDKit docs)](https://sources.debian.org/data/main/r/rdkit/202503.1-4/Code/MinimalLib/docs/GettingStartedInJS.html) [S]
  - Known Node quirk: importing assigns `initRDKitModule` to globalThis, and there are ESM build issues. — [rdkit-js#389](https://www.github.com/rdkit/rdkit-js/issues/389) [S]
- **openchemlib 9.26.0**
  - Results:
    - ESM. `Molecule.fromSmiles(...).toSVG(300,200)` returns SVG (2,809 chars) with no DOM.
    - `Reaction.fromSmiles` works.
    - Molfile round-trip works.
  - Package facts: BSD-3-Clause; unpacked 6.1 MB (5.8 MB on disk); no dependencies; 54,135 downloads per week. — [npm openchemlib](https://www.npmjs.com/package/openchemlib)
- **smiles-drawer 2.4.2**
  - Result: the package loads in Node, but `SvgDrawer` is not reachable as a constructor in Node.
  - Its source (`src/SvgWrapper.js`) uses `document.getElementById` / `document.createElementNS` 42 times. So it needs a DOM (jsdom or linkedom) for SVG output.
  - The README shows only browser usage, drawing into a page element. — [smiles-drawer README](https://cdn.jsdelivr.net/npm/smiles-drawer@2.4.2/README.md)
  - Package facts: MIT; unpacked 6.9 MB; dependency chroma-js; 101,961 downloads per week.
- **mhchemparser 4.2.1**
  - Results:
    - `toTex('CO2 + H2O <=> H2CO3','ce')` and `toTex('123 kJ/mol','pu')` work. The `pu` result is `{123~\mathrm{kJ}/\mathrm{mol}}`.
    - The output uses `\vphantom{A}`, `\smash[t]{}` and `\mathrel{\longrightleftharpoons}`.
  - Package facts: Apache-2.0; unpacked 277 KB; no dependencies; 1,634,671 downloads per week (pulled in by MathJax/KaTeX ecosystems [I]).
- **mhchemparser output through remark-docx's converter (docx/math `latexToMath`, the converter remark-docx imports)**
  - Packs without error:
    - `H2O`
    - `SO4^2-`
    - `A ->[catalyst] B`
    - `CuSO4 * 5 H2O`
    - `\pu{123 kJ/mol}`
  - Throws `latexToMath: unknown command \longrightleftharpoons`:
    - `CO2 + H2O <=> H2CO3`
  - So mhchem support needs either an extra command mapping or a pre-pass that rewrites mhchem-specific macros. It is not a pure pass-through.
- **asciimath2tex 1.5.0**
  - Result: `sum_(i=1)^n i^3=((n(n+1))/2)^2` becomes `\sum_{i = 1}^{n} i^{3} = \left ( \frac{...}{2} \right )^{2}` (standard LaTeX that latexToMath should handle [I]).
  - Package facts: Apache-2.0; 412 KB; 10,119 downloads per week. asciimath-to-latex: 5,159 per week.
- **wavedrom 3.8.0**
  - Result: `renderAny(0, {signal:[...]}, waveSkin)` then `onml.stringify` gives SVG (41 KB) in Node with no DOM.
  - Package facts: MIT; 835 KB unpacked; depends on onml, json5, tspan, logidrom, bit-field (bit-field is the register-diagram renderer); 127,134 downloads per week.
- **abcjs 6.7.3**
  - Result: `renderAbc` throws `document is not defined` in Node. It needs a DOM shim.
  - Package facts: MIT; 6.0 MB unpacked; 178,923 downloads per week.
  - folkdb/abc-render-svg wraps abcjs for Node SVG, but its README does not say which DOM shim it uses. — [folkdb/abc-render-svg](https://github.com/folkdb/abc-render-svg) [S]

**Other npm weekly downloads [V]** (api.npmjs.org, week of 2026-11-16 to 2026-11-22)

| Area | Package | Downloads per week |
| --- | --- | --- |
| Math | katex | 47.9M |
| Math | temml | 2.59M |
| Math | mathjax-full | 1.40M |
| Math | @mathjax/src | 254k |
| Typst | @myriaddreamin/typst.ts | 125k |
| Plots | jsxgraph | 93k |
| Plots | function-plot | 13k |
| Molecular 3D | 3dmol | 125k |
| Chemistry | kekule | 4.3k |
| Music | vexflow | 97k |
| Music | opensheetmusicdisplay | 48k |
| Music | @coderline/alphatab | 27k |
| Music | verovio | 26k |
| Music | chordsheetjs | 4.8k |
| Biology | phylotree | 5.4k |
| Biology | msa | 335 |
| QR codes | qrcode | 42.6M |
| DOM shims | jsdom | 167M |
| DOM shims | linkedom | 10.5M |
| DOM shims | svgdom | 88k |
| SVG to PNG | @resvg/resvg-wasm | 7.9M |

- function-plot depends on d3-selection and the DOM [V, from its dependency list: d3-axis, d3-zoom, d3-selection and others].
- qrcode can generate SVG strings without a DOM [I, from training knowledge; not tested].

### Inferences
- **Easiest to add, with native OMML and no images:**
  - mhchem `\ce{}` / `\pu{}`: needs mhchemparser (277 KB, Apache-2.0) plus handling of `\longrightleftharpoons`, `\vphantom` and `\smash`.
  - AsciiMath: needs asciimath2tex.
  - Both reuse the existing LaTeX-to-OMML path and work the same in browser and Node.
- **SVG-to-image plugins without DOM issues:**
  - SMILES / molfile / reaction SMILES: OpenChemLib (smaller, pure JS) or RDKit.js (7.4 MB wasm, higher quality).
  - WaveDrom.
  - QR codes.
  - These need the same SVG-embedding path remark-docx already uses for mermaid/images.
- **Need jsdom or linkedom in Node:** abcjs, smiles-drawer, function-plot. That conflicts with "runs in both browser and Node" unless the DOM is injected by the user.
- **Typst math:** has no JS Typst-to-LaTeX or Typst-to-OMML converter. typst.ts compiles to SVG via wasm, so Typst math would end up as images [I].

### Gaps
- Not checked:
  - Bundle-size impact in a browser build.
  - Whether `\vphantom` / `\smash[t]` from mhchemparser produce visually correct OMML. The pack succeeded, but the XML was not inspected.
  - Newick renderers without D3/DOM.
  - LilyPond (needs a native binary; no JS port found).
  - ChordPro rendering (chordsheetjs outputs HTML/text, which might map to docx paragraphs [I]).
  - InChI-to-structure in JS (RDKit.js has InChI support per its docs [I, not tested]).
