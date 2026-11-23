# Which fence languages Markdown platforms render as DSLs (as of 2026-11)

Legend: **[V]** means I checked the primary doc or source code in this session (2026-11-23). **[K]** means it comes from prior knowledge and was not re-fetched this session. The URL is the canonical doc, but treat [K] items as lower confidence. "Fence" means a CommonMark fenced code block with that `lang` (i.e. an mdast `code` node with `lang=...`). Non-fence syntaxes are noted separately, because remark-docx does not see them as `code` nodes. Examples: `$$` math (an mdast `math` node via remark-math), `:::` containers, Quarto/MyST `{mermaid}` directives, Azure `::: mermaid`.

## Q1. Which rendered fence languages does each platform support (platform × DSL matrix)?

### Takeaway
`mermaid` is close to universal. It is natively rendered by almost every code host, notes app, docs generator, Japanese platform and ChatGPT. `math` as a fence comes second (GitHub, GitLab, Gitea, Qiita, esa, Docusaurus); elsewhere math is written as `$$`. `plantuml` is a strong third, concentrated in GitLab and Japanese platforms (Qiita, esa as `uml`, GROWI) plus HackMD and MPE. Everything else is niche: graphviz/dot, vega/vega-lite, abc, wavedrom, d2, kroki-*, geojson/topojson/stl, flow/sequence, csv, smiles.

### Matrix (fence languages rendered specially; ✓ = native, P = only via plugin or extension, – = none found)

| Platform | mermaid | math (fence) | plantuml | graphviz/dot | vega / vega-lite | abc | flow / sequence | geojson / topojson / stl | other | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| GitHub | ✓ | ✓ `math` [K] | – | – | – | – | – | ✓ all three | – | [V] diagrams doc; math [K] |
| GitLab | ✓ | ✓ `math` | ✓ (on by default on .com; self-managed needs an admin) | via Kroki | via Kroki | – | – | – | `kroki`, `json:table`; mermaid `treeView-beta` | [V] |
| Gitea (Forgejo is a fork, inferred to match) | ✓ | ✓ `math` | – | – | – | – | – | – | – | [V] source code + docs |
| Bitbucket Cloud | P (Marketplace app) | P | – | – | – | – | – | – | – | [V] community + marketplace |
| Azure DevOps Wiki | ✓ (both `::: mermaid` and a ```mermaid fence) | `$$` KaTeX; doc examples use a ```KaTeX fence | – | – | – | – | – | – | – | [V] |
| Notion | ✓ (code block with language set to Mermaid) | (equation block, not a fence) | – | – | – | – | – | – | – | secondary sources only |
| Confluence Cloud | P (macro apps only; pasted fences stay plain text) | – | P | P | – | – | – | – | – | [V] community 2026 + marketplace |
| Obsidian core | ✓ | `$$` (not a fence) | P | P | P | P | – | P (Leaflet maps) | many plugins, see Q2 | [K] core; plugins [V] |
| Joplin | ✓ | `$$` KaTeX + mhchem | – | – | – | ✓ `abc` | – | – | – | [V] |
| Typora | ✓ | `$$` | – | – | – | – | ✓ `flow`, `sequence` | – | – | [V] |
| HackMD (CodiMD/HedgeDoc are related) | ✓ | `$$` | ✓ | ✓ `graphviz` | ✓ `vega` (Vega-Lite) | ✓ `abc` | ✓ `flow`, `sequence` | – | `fretboard`, `csvpreview` | [V] HackMD features page |
| VS Code Markdown Preview Enhanced | ✓ | `$$` | ✓ `puml`/`plantuml`/`wsd` | ✓ `graphviz`/`viz`/`dot` | ✓ `vega`, `vega-lite` | – | – | – | `wavedrom`, `bitfield`, `d2`, `tikz`, `kroki-*` | [V] crossnote source |
| VS Code built-in + "Markdown Preview Mermaid Support" ext | ✓ (extension) | `$$` (built-in KaTeX) [K] | – | – | – | – | – | – | – | [K] |
| Docusaurus | ✓ (`@docusaurus/theme-mermaid`, opt-in) | ✓ `math` (remark-math) | – | – | – | – | – | – | – | [V] |
| VitePress | – (community plugin) | `$$` opt-in [K] | – | – | – | – | – | – | – | [V] no mermaid in guide |
| MkDocs Material | ✓ (via SuperFences custom fence) | `$$` / arithmatex | – | – | – | – | – | – | – | [V] |
| Sphinx / MyST | P (sphinxcontrib-mermaid) [K] | `{math}` directive | P | ✓ `{graphviz}` ext [K] | – | – | – | – | – | [V] math; others [K] |
| Quarto | ✓ `{mermaid}` cell | `$$` | – | ✓ `{dot}` cell | – | – | – | – | – | [V] |
| Jupyter Book 2 (MyST) | ✓ `{mermaid}` directive [K] | `{math}`/`$$` | – | – | – | – | – | – | – | [K] |
| Hugo | template-hook recipe (not built in) | passthrough [K] | – | – | – | – | – | – | `goat` (ASCII diagram) built in | [V] |
| Astro Starlight | – | – | – | – | – | – | – | – | – | [V] none in authoring guide |
| Zenn | ✓ (limited to 2000 chars per block) | `$$` | – | – | – | – | – | – | `html-embed` (beta), `diff` | [V] |
| Qiita | ✓ | ✓ `math` | ✓ | – | – | – | – | – | `diff_*` | [V] |
| esa | ✓ | ✓ `math` | ✓ as `uml` | – | – | – | – | – | `uiflow` | [V] |
| GROWI | ✓ [K] | `$$` [K] | ✓ (needs PLANTUML_URI server) | – | – | – | – | – | blockdiag (BLOCKDIAG_URI), drawio | partial [V] |
| Backlog | not found | not found | – | – | – | – | – | – | – | gap |
| Cosense (Scrapbox) | ✓ (since about 2023-08; also `.mmd` filename) | own `[$ ]` syntax [K] | – | – | – | – | – | – | – | [V] |
| Redmine | ✓ new in **7.1.0** (fixed 2026-10-04) | – | P (plugins) | – | – | – | – | – | – | [V] |
| note | – | `$${}$$` [K] | – | – | – | – | – | – | – | [K] |
| Crowi | not verified | | | | | | | | | gap |
| Logseq | P [K] | `$$` | – | – | – | – | – | – | – | gap |
| ChatGPT | ✓ (preview) | renders LaTeX (not a fence) | – | – | ✓ vega / vega-lite | – | – | – | html, react, svg | [V] OpenAI help |
| Claude.ai | ✓ (as an artifact) | LaTeX rendering [K] | – | – | – | – | – | – | html, react, svg | third-party guides only |
| Gemini | – (only extensions/userscripts found) | LaTeX [K] | – | – | – | – | – | – | – | [V] absence of evidence |
| Copilot (Visual Studio chat) | ✓ | – | – | – | – | – | – | – | – | [V] MS devblog |

### Cited Findings
- **GitHub** renders four fences specially: `mermaid`, `geojson`, `topojson` and `stl` — [GitHub Docs: Creating diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams). A ```math fence is also supported [K] — [GitHub Docs: Writing mathematical expressions](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions)
- **GitLab** supports these fences:
  - `mermaid`, with `treeView-beta` available inside it.
  - `plantuml`: "enabled on GitLab.com"; on self-managed, an admin must enable it.
  - `kroki`: an admin must enable it.
  - `math`: KaTeX, limited to the first 1000 inline instances.
  - `json:table`.
  - Source: [GitLab Flavored Markdown](https://docs.gitlab.com/user/markdown/)
- **GitLab Kroki** types: Bytefield, D2, DBML, Ditaa, Erd, GraphViz, Nomnoml, PlantUML (including C4), Structurizr, Svgbob, UMlet, Vega, Vega-Lite and WaveDrom — [GitLab Kroki integration](https://docs.gitlab.com/administration/integration/kroki/)
- **Gitea** docs mention only the `math` fence — [Gitea Markdown](https://docs.gitea.com/usage/markdown). However, the frontend code runs `initMarkupCodeMermaid` and `initMarkupCodeMath` on every markup block — [gitea web_src/js/markup/content.ts](https://raw.githubusercontent.com/go-gitea/gitea/main/web_src/js/markup/content.ts)
- **Bitbucket Cloud**: a community answer says Markdown is "CommonMark only". A Mermaid request was closed as won't-fix (BCLOUD-18559) and re-filed as BCLOUD-21675 — [Atlassian Community](https://community.atlassian.com/t5/Bitbucket-questions/Mermaid-support-for-bitbucket-markdown/qaq-p/2264240). Mermaid is available through a Marketplace app — [Mermaid Diagrams for Bitbucket](https://marketplace.atlassian.com/apps/240968513/mermaid-diagrams-for-bitbucket)
- **Azure DevOps**:
  - Wiki Mermaid accepts both "the `:::` container syntax with the `mermaid` keyword" and "a standard fenced code block with the `mermaid` language identifier".
  - Syntax support is limited; for example, `flowchart` is unsupported, so use `graph`.
  - Math uses `$`/`$$` KaTeX, and the doc examples wrap it in a ```KaTeX fence.
  - Source: [Azure DevOps Markdown guidance](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance) (updated 2026-11-03)
- **Notion**: a code block set to Mermaid renders the diagram — [DEV: Embed Mermaid in Notion (2026)](https://dev.to/levi_liu/embed-mermaid-in-notion-the-4-working-approaches-in-2026-257f). This is secondary; I found no Notion help page.
- **Confluence Cloud** has no native Mermaid as of mid-2026, and the Markdown importer treats code blocks as plain text — [Atlassian Community 2026](https://community.atlassian.com/forums/Confluence-questions/Auto-convert-pasted-Mermaid-code-blocks-into-rendered-diagrams/qaq-p/3249075). Many Mermaid macro apps exist — [e.g. Mermaid Diagrams Viewer](https://marketplace.atlassian.com/apps/1232887/mermaid-diagrams-viewer)
- **Joplin** renders KaTeX math with mhchem, a ```mermaid fence and an `abc` fence (sheet music) — [Joplin Markdown guide](https://raw.githubusercontent.com/laurent22/joplin/dev/readme/apps/markdown.md)
- **Typora** renders `sequence`, `flow` and `mermaid` fences (the Mermaid types include C4, mindmap, sankey, xychart, zenuml and others) — [Typora: Draw Diagrams](https://support.typora.io/Draw-Diagrams-With-Markdown/)
- **HackMD** renders `mermaid`, `sequence`, `flow`, `graphviz`, `abc`, `plantuml`, `vega` (Vega-Lite), `fretboard` and `csvpreview`. Math uses `$`/`$$` — [HackMD features](https://hackmd.io/features?both)
- **Markdown Preview Enhanced**: its `supportedLanguages` list is `mermaid, puml, plantuml, wavedrom, bitfield, bit-field, graphviz, viz, dot, vega, vega-lite, wsd, d2, tikz`. It also accepts any `kroki-<type>` lang or a `{kroki=...}` attribute — [crossnote fenced-diagrams.ts](https://raw.githubusercontent.com/shd101wyy/crossnote/master/src/render-enhancers/fenced-diagrams.ts)
- **Docusaurus**:
  - Mermaid uses a ```mermaid fence — [Docusaurus Diagrams](https://docusaurus.io/docs/markdown-features/diagrams)
  - Block math may use a ```math fence: "For equation block or display mode, use ```math fenced code blocks" — [Docusaurus Math](https://docusaurus.io/docs/markdown-features/math-equations)
- **MkDocs Material** renders ``` mermaid via SuperFences — [Material Diagrams](https://squidfunk.github.io/mkdocs-material/reference/diagrams/)
- **Quarto** has "native support for embedding Mermaid and Graphviz" through `{mermaid}` and `{dot}` cells. Notably, "For print output formats like `pdf` or `docx`, diagram rendering makes use of the Chrome or Edge web browser to create a high-quality PNG" — [Quarto Diagrams](https://quarto.org/docs/authoring/diagrams)
- **MyST** uses a ```{math} directive — [MyST math](https://myst-parser.readthedocs.io/en/latest/syntax/math.html)
- **Hugo** "natively supports GoAT diagrams" (```goat). Hugo "does not provide a built-in template for Mermaid diagrams" and offers a render-hook recipe instead — [Hugo Diagrams](https://gohugo.io/content-management/diagrams/)
- **VitePress** markdown guide: no Mermaid or diagram fence in core (only `:::` containers and code-group) — [VitePress Markdown](https://vitepress.dev/guide/markdown)
- **Astro Starlight** authoring guide: no diagram fences — [Starlight Authoring content](https://starlight.astro.build/guides/authoring-content/)
- **Zenn**:
  - `mermaid`: limited to 2000 characters, at most 10 `&` chains, and clicks are disabled.
  - `html-embed` (beta, 50KB) and `diff`.
  - Math uses `$$` with KaTeX.
  - Source: [Zenn Markdown guide](https://zenn.dev/zenn/articles/markdown-guide)
- **Qiita** renders `math`, `mermaid`, `plantuml` and `diff_*` fences — [Qiita Markdown記法 一覧表](https://qiita.com/Qiita/items/c686397e4a0f4f11683d)
- **esa** renders `math`, `uml` (PlantUML, including `@startmindmap`), `mermaid` and `uiflow` — [esa docs/49](https://docs.esa.io/posts/49)
- **GROWI** needs an external server for PlantUML (`PLANTUML_URI`) and blockdiag (`BLOCKDIAG_URI`), and has a remark-drawio plugin — [GROWI repo (fork mirror)](https://github.com/tats-u/growi); [GROWI docs index](https://docsearch.algolia.com/mcp/docs/repo/growilabs/growi). The official docs page I tried returned 404, so this is weak.
- **Cosense** supports Mermaid with lang `mermaid` or a `.mmd` filename — [Cosense help: Mermaid](https://scrapbox.io/help-jp/Mermaid). It became official around 2023-08-22 — [cist-it](https://scrapbox.io/cist-it/Scrapbox%E3%81%A7Mermaid%E3%82%92%E4%BD%BF%E3%81%86)
- **Redmine** added a Mermaid fence natively in Feature #44425. It is closed as Fixed (r25202–r25206, 2026-10-04) with target **7.1.0** — [Redmine #44425](https://www.redmine.org/issues/44425)
- **ChatGPT** code-block Preview "may include: HTML pages, React components, SVG images, Mermaid diagrams, Vega or Vega-Lite charts" — [OpenAI Help](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt). This conflicts with a community thread saying Mermaid did not render — [OpenAI Community](https://community.openai.com/t/rendering-support-for-mermaid-code/1085642), so rollout may vary.
- **Claude.ai** artifacts types include Mermaid (`application/vnd.ant.mermaid`), SVG, HTML and React — [third-party guide](https://github.com/Microtechx-GmbH/claude-artifacts-guide). A Claude Code issue asks for the same Mermaid preview in Claude Desktop's Code tab — [anthropics/claude-code#52517](https://github.com/anthropics/claude-code/issues/52517)
- **Gemini**: I found only third-party Mermaid renderers (a Chrome extension and a userscript) — [Gemini Mermaid Renderer](https://chromewebstore.google.com/detail/foijjhbimgpajefepdmpbnogjlcabdhf); [Voyager guide](https://raw.githubusercontent.com/Nagi-ovo/voyager/main/docs/en/guide/mermaid.md)
- **Copilot**: Visual Studio Copilot chat generates and views Mermaid diagrams — [MS DevBlog, Sept 2025](https://devblogs.microsoft.com/visualstudio/generating-and-viewing-mermaid-diagrams-with-copilot)

### Inferences
- **Aggregate counts.** These are native ✓ only, out of the roughly 30 platforms surveyed, and approximate because some cells are [K].
  - `mermaid` ≈ 22 (all code hosts except Bitbucket; Notion, Joplin, Typora, HackMD, MPE, Obsidian, Docusaurus, MkDocs Material, Quarto, Jupyter Book, Zenn, Qiita, esa, GROWI, Cosense, Redmine 7.1, ChatGPT, Claude, Copilot).
  - `math` as a ```math fence ≈ 6 (GitHub, GitLab, Gitea, Qiita, esa, Docusaurus); math overall (`$$` included) is in nearly every platform.
  - `plantuml` ≈ 6 (GitLab, Qiita, esa as `uml`, GROWI, HackMD, MPE).
  - `graphviz`/`dot` ≈ 4 (HackMD, MPE, Quarto, Sphinx ext; GitLab via Kroki).
  - `vega`/`vega-lite` ≈ 3 (HackMD, MPE, ChatGPT; GitLab via Kroki).
  - `abc` = 2 (Joplin, HackMD).
  - `flow`/`sequence` = 2 (Typora, HackMD).
  - `geojson`/`topojson`/`stl` = 1 (GitHub only).
  - `wavedrom`, `d2`, `tikz`, `kroki-*` = 1 (MPE), plus GitLab Kroki.
  - `goat` = 1 (Hugo), `uiflow` = 1 (esa), `csvpreview` = 1 (HackMD), `json:table` = 1 (GitLab), `html-embed` = 1 (Zenn).
- **Japanese platforms** lean hard on PlantUML: Qiita, esa (`uml`, a non-standard fence name) and GROWI all support it, while most Western docs sites do not. Qiita and esa also use the ```math fence rather than `$$`. A remark-docx PlantUML plugin should therefore accept `uml` as an alias.
- **Inferred priority order** for remark-docx: `mermaid` >> `math` fence (cheap, because it can reuse the existing math path) > `plantuml`/`uml` > `graphviz`/`dot` > `vega-lite`. geojson/stl matter only for GitHub; abc/flow/sequence are legacy or niche.
- **Quarto's docx output rasterises Mermaid/Graphviz to PNG via headless Chrome.** That is precedent that image fallback is acceptable to docx users.
- **Fences vs. directives.** MyST and Quarto use `{mermaid}`/`{dot}` directive braces, and Azure uses `::: mermaid`. Plain remark parses MyST/Quarto syntax as `code` with lang `{mermaid}`, so normalising braces could widen coverage. This is an inference, not verified against remark output.

### Gaps
- Backlog: no official mention of Mermaid or math found. Its help center describes a `{code}` macro and Markdown, but nothing on diagrams.
- Crowi, note and Logseq: not verified this session.
- Notion: no official help page found.
- Claude.ai rendering: from third-party guides only.
- Gemini and Copilot (non-VS): no official docs found.
- Forgejo: assumed to match Gitea, not checked.
- Sphinx Mermaid/PlantUML and Jupyter Book 2 Mermaid: [K], not re-fetched.
- Obsidian core Mermaid/math: [K] — [Obsidian Help: Advanced formatting syntax](https://help.obsidian.md/Editing+and+formatting/Advanced+formatting+syntax).
- No quantitative usage data, e.g. number of GitHub files containing ```plantuml vs ```mermaid; GitHub code search needs auth.

## Q2. Obsidian DSL renderer plugins by download count

### Takeaway
Among third-party plugins, the most-downloaded "diagram" plugins are drawing tools rather than text DSLs (Excalidraw at 9.1M, draw.io at roughly 220K). Of the text-DSL renderers, Mermaid tooling, Markmap mind maps, Charts (Chart.js YAML), Leaflet and PlantUML lead. Graphviz, Vega, WaveDrom, Kroki and D2 are all under 25K.

### Cited Findings
All counts are cumulative downloads from [community-plugin-stats.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json), fetched 2026-11-23. Ids and descriptions are from [community-plugins.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json), which lists 10,759 plugins. Mermaid and math are core and not plugins. For reference, Dataview has 5,373,055.

| Plugin (id) | Downloads | DSL / what it renders |
|---|---|---|
| Excalidraw (obsidian-excalidraw-plugin) | 9,137,406 | Drawing files; not a fence DSL |
| Mind Map (obsidian-mind-map) | 917,077 | Markmap from Markdown |
| Latex Suite | 734,738 | Math input aid; no renderer |
| Mermaid Tools (mermaid-tools) | 378,572 | Mermaid toolbar |
| Charts (obsidian-charts) | 338,465 | ```chart YAML (Chart.js) [K for fence name] |
| Leaflet (obsidian-leaflet-plugin) | 321,894 | ```leaflet maps [K fence] |
| Enhancing Mindmap | 243,534 | Mind maps |
| Diagrams (drawio-obsidian) | 223,477 | draw.io files |
| PlantUML (obsidian-plantuml) | 167,983 | ```plantuml |
| Mindmap NextGen | 138,954 | Markmap |
| Charts View (obsidian-chartsview-plugin) | 99,458 | AntV charts |
| Timeline (obsidian-timeline) | 97,143 | Timelines |
| Numerals | 76,813 | Calculator code block |
| Chronos Timeline | 68,921 | ```chronos timelines |
| TikZJax (obsidian-tikzjax) | 64,896 | ```tikz |
| draw.io (drawio) | 64,814 | draw.io |
| Markwhen | 48,637 | Markwhen timeline/Gantt |
| Diagrams.net (obsidian-diagrams-net) | 46,227 | draw.io |
| Mehrmaid | 44,548 | Mermaid plus Markdown |
| CSV Table (obsidian-csv-table) | 39,654 | ```csv → table |
| ABC Music Notation (music-code-blocks) | 35,611 | ```music-abc (abcjs) [K fence] |
| Diagram Popup (mermaid-popup) | 26,793 | Popup for Mermaid, PlantUML, Graphviz |
| Chord Sheets | 26,295 | Chord sheets |
| Chem (chem) | 22,440 | ```smiles |
| Pseudocode | 21,814 | ```pseudo (LaTeX algorithmic) |
| D2 (d2-obsidian) | 21,163 | ```d2 |
| Typst Mate | 20,559 | Typst math |
| Mermaid Themes | 17,428 | Mermaid |
| BPMN (bpmn-plugin) | 16,364 | BPMN XML |
| Typst Renderer | 14,960 | ```typst |
| Chesser | 14,047 | Chess PGN |
| Chessboard Viewer (obsidian-chessboard) | 13,034 | ```chessboard FEN |
| Kroki (obsidian-kroki) | 12,855 | Kroki types |
| Plotly (obsidian-plotly) | 12,665 | Plotly JSON |
| jTab Guitar | 11,353 | Guitar tabs |
| Asciimath | 11,196 | AsciiMath |
| Ketcher | 11,044 | Chemical structures |
| Nomnoml Diagram | 10,841 | nomnoml |
| Fix Math | 9,857 | Converts ChatGPT/AI LaTeX to Obsidian math |
| Argdown | 9,154 | Argument maps |
| WaveDrom (obsidian-wavedrom) | 8,158 | ```wavedrom |
| Pikchr (adamantine-pick) | 7,282 | Pikchr |
| Chemical Structure Renderer | 7,273 | SMILES |
| Vega Visualizations (obsidian-vega) | 7,030 | ```vega / vega-lite |
| Vextab | 6,917 | Music tab |
| CircuitJS | 6,677 | Circuits |
| Embed 3D (3d_embeds) | 6,235 | STL, GLB and other 3D files |
| CSV Codeblock | 5,938 | ```csv |
| PUML Viewer | 5,394 | PlantUML |
| Lilypond | 4,902 | LilyPond |
| Echarts Lite | 1,151 | ECharts |
| Graphviz View (graphviz) | 543 | Graphviz |
| Byte Field Diagrams | 411 | bytefield |
| Structurizr Diagrams | 142 | Structurizr |

### Inferences
- Within Obsidian, the text-DSL ranking is: mermaid (core) > markmap/mindmap > chart (Chart.js) > leaflet > plantuml (168K) > tikz (65K) > csv (40K) > abc (36K) > smiles (22K) > d2 (21K) > kroki (13K) > wavedrom (8K) > vega (7K) > graphviz (<1K for the listed plugin).
- PlantUML is the clear second diagram DSL after Mermaid. Graphviz in Obsidian is surprisingly weak. A previously popular "obsidian-graphviz" id was not found in the current list (see Gaps).
- `chart` (Chart.js YAML) is popular in Obsidian but platform-specific, so it is not a portable DSL.

### Gaps
- Exact fence identifiers for Charts, Leaflet, ABC Music and Chem were not verified from their READMEs.
- The well-known "obsidian-graphviz" and "function-plot" plugins were not found under the searched ids. They may have been renamed or removed.
- Download counts are cumulative over all time and say nothing about current activity.

## Q3. Which DSLs do LLMs emit, and what do chat UIs render?

### Takeaway
LLM chat UIs converge on Mermaid as the only diagram DSL they render, plus HTML, SVG and React. ChatGPT additionally previews Vega/Vega-Lite. LaTeX math is the other common LLM output, and its delimiter quirks cause enough friction to spawn tooling.

### Cited Findings
- ChatGPT previews HTML, React, SVG, Mermaid and Vega/Vega-Lite — [OpenAI Help](https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt)
- Claude artifacts include Mermaid, SVG, HTML and React — [third-party guide](https://github.com/Microtechx-GmbH/claude-artifacts-guide)
- Visual Studio Copilot renders Mermaid — [MS DevBlog](https://devblogs.microsoft.com/visualstudio/generating-and-viewing-mermaid-diagrams-with-copilot)
- Gemini users rely on extensions to render the Mermaid that Gemini outputs, and failed renders are often due to Gemini syntax errors — [Voyager guide](https://raw.githubusercontent.com/Nagi-ovo/voyager/main/docs/en/guide/mermaid.md)
- Evidence that users paste AI-generated Mermaid into Confluence and it does not render — [Atlassian Community 2026](https://community.atlassian.com/forums/Confluence-questions/Copy-markdown-code-into-confluence-with-embedded-mermaid-code/qaa-p/3241625)
- The Obsidian plugin "Fix Math" (9,857 downloads) exists to "Convert LaTeX equations from ChatGPT and AI assistants to the correct Markdown format" — [community-plugins.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json)

### Inferences
- For "LLM answer → .docx" workflows, Mermaid and math are the must-haves. Vega-Lite is a distant third, because only ChatGPT renders it.
- LLMs also emit `\[ \]` / `\( \)` math delimiters, which remark-math does not parse by default. This is relevant but outside the fence-plugin scope.

### Gaps
- No quantitative study found of fence-language frequency in LLM outputs.
- Claude's and Gemini's official docs on rendered fence types were not found or fetched.
