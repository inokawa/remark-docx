# Data-visualization / data DSLs in Markdown fenced code blocks: demand for Word (.docx) output

Research date: 2026-11-23. Download counts are the ones fetched that day. Everything below cites a URL. Items marked **(inference)** are my reasoning, not something a source states.

Search log (what was searched, so absence of evidence can be judged):
- npm API `api.npmjs.org/downloads/point/last-week/<pkg>` for 15 packages (some returned Cloudflare error 1015 / rate limit: canvas, jsdom, linkedom, @resvg/resvg-js, @napi-rs/canvas, remark-docx).
- Obsidian `community-plugin-stats.json`, filtered by keywords chart/vega/plot/graph/csv/desmos/docx/word/export/pandoc/table.
- CRAN logs (cranlogs.r-pkg.org) for mschart, officer, flextable, rvg, ggplot2; PyPI stats for python-docx, python-pptx, docxtpl.
- GitHub issue search (unauthenticated REST API): `repo:quarto-dev/quarto-cli vega docx`, `repo:quarto-dev/quarto-cli ojs docx`, `repo:jgm/pandoc vega` (0 hits), `repo:jgm/pandoc chart docx native`, `repo:MohtashamMurshid/md-to-docx chart`, `repo:shd101wyy/vscode-markdown-preview-enhanced vega pandoc`, `repo:phibr0/obsidian-charts export`, `repo:mokeyish/obsidian-enhancing-export chart` (0 hits), `markdown docx "editable chart"`, `mermaid pie docx native chart`.
- Web searches: vega headless toSVG; echarts SSR; Observable Plot jsdom; plotly node without browser; govspeak barchart; GitHub geojson/topojson/stl; MPE vega + pandoc; Obsidian Charts YAML; ChatGPT chart → Word editable; Japanese "Markdown グラフ Word 変換 チャート docx 編集可能"; mermaid xychart/sankey/quadrant; mschart; chartjs-node-canvas; python-docx native charts; ApexCharts SSR page.
- Local: `node_modules/docx/dist/charts.d.ts` (docx 9.16.0) in this repo.

## Q1. Usage scale of each DSL / library

### Takeaway
Mermaid is by far the largest (about 28.7M npm downloads/week). Chart.js (18.0M) and ECharts (11.4M) lead among chart libraries. vega/vega-lite are around 2.5M each, and Observable Plot and plotly.js around 1.0–1.4M. In Markdown note-taking, Obsidian Charts (Chart.js, `chart` YAML fence, 338k installs) is the dominant chart DSL. The Vega (7k) and Plotly (12.7k) plugins are tiny next to it.

### Cited Findings
npm weekly downloads, 2026-11-16 to 2026-11-22 (source: `https://api.npmjs.org/downloads/point/last-week/<pkg>`):
- mermaid 28,707,819 — [npm API](https://api.npmjs.org/downloads/point/last-week/mermaid)
- chart.js 17,950,574 — [npm API](https://api.npmjs.org/downloads/point/last-week/chart.js)
- docx 12,349,862 — [npm API](https://api.npmjs.org/downloads/point/last-week/docx)
- echarts 11,384,716 — [npm API](https://api.npmjs.org/downloads/point/last-week/echarts)
- apexcharts 2,912,007 — [npm API](https://api.npmjs.org/downloads/point/last-week/apexcharts)
- vega 2,503,537 / vega-lite 2,455,680 / vega-embed 1,679,180 — [npm API](https://api.npmjs.org/downloads/point/last-week/vega-lite)
- @observablehq/plot 1,364,094 — [npm API](https://api.npmjs.org/downloads/point/last-week/@observablehq/plot)
- plotly.js 1,024,446 (+ plotly.js-dist-min 771,751) — [npm API](https://api.npmjs.org/downloads/point/last-week/plotly.js)
- chartjs-node-canvas 417,374; skia-canvas 367,478 — [npm API](https://api.npmjs.org/downloads/point/last-week/chartjs-node-canvas)
- function-plot 13,056 — [npm API](https://api.npmjs.org/downloads/point/last-week/function-plot)
- @mohtasham/md-to-docx 161,437 (the unscoped `md-to-docx` package: 369) — [npm API](https://api.npmjs.org/downloads/point/last-week/@mohtasham/md-to-docx)

Obsidian community plugins, cumulative downloads ([community-plugin-stats.json](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json)):
- dataview 5,373,055; table-editor-obsidian 3,391,614 (tables and data are a mainstream note use)
- obsidian-pandoc 570,097; obsidian-enhancing-export 482,431 (Pandoc-based exporters, including docx); docxer 131,735; docx-exporter 20,518; to-word 13,319
- mermaid-tools 378,572; obsidian-tracker 373,752; **obsidian-charts 338,465**; obsidian-chartsview-plugin (AntV) 99,458; obsidian-csv-table 39,654; obsidian-desmos 33,161; bases-charts 30,761; csv-obsidian 30,108; bases-chart-views 17,098; obsidian-plotly 12,665; **obsidian-vega 7,030**
- No entries found for the keys obsidian-echarts, obsidian-apexcharts, obsidian-functionplot or obsidian-chartjs. They may exist under other IDs that my keyword filter missed.

R and Python (signals of interest in native Office charts):
- CRAN, last month (2026-10-23 to 2026-11-21): **mschart 5,235**, officer 113,609, flextable 105,375, rvg 14,052, ggplot2 2,076,524 — [cranlogs](https://cranlogs.r-pkg.org/downloads/total/last-month/mschart)
- PyPI, last month: python-docx 140.0M, python-pptx 142.2M, docxtpl 4.7M — [pypistats python-docx](https://pypistats.org/api/packages/python-docx/recent), [pypistats python-pptx](https://pypistats.org/api/packages/python-pptx/recent)

### Inferences
- mschart is about 4.6% of officer's downloads, so few officer users go on to native editable charts. It is still a real, non-trivial niche of report automation (R → Word/PowerPoint). Most R users put ggplot images in Word instead (rvg, which makes editable vector graphics, is 14k). **(inference)**
- Among Obsidian users, the `chart` YAML (Chart.js) DSL has about 48× the installs of the vega plugin. For Markdown authors (as opposed to notebook/Altair users), Vega is a minority DSL. **(inference)**

### Gaps
- npm counts for canvas, jsdom, linkedom, @resvg/resvg-js and @napi-rs/canvas were rate-limited (HTTP 1015) and not obtained.
- Mermaid usage could not be split by diagram type (pie/xychart/gantt/sankey/quadrant). No source gives that breakdown.

## Q2. Fields and use cases for each DSL

### Takeaway
Chart fences in Markdown are used in personal and knowledge-management notes (Obsidian Charts/Tracker), in technical docs and READMEs (Mermaid, GitHub geojson/topojson/stl), in government publishing (GOV.UK Govspeak `{barchart}`), and in data-science notebooks and Quarto (vega-lite/Altair, OJS). There is also an emerging case of Markdown→DOCX report generation, where the tool author's stated rationale is "report-generation users" (md-to-docx).

### Cited Findings
- **Obsidian Charts**: a `chart` fence with YAML `type`, `labels` and `series` (`title`, `data`). Types include bar, line, pie, doughnut, polarArea and radar — [Obsidian Charts docs](https://deploy-preview-99--obsidiancharts.netlify.app/Basic%20Usage), [Medium setup guide](https://medium.com/technology-hits/my-obsidian-setup-part-16-charts-bc6296d3a27a)
- Obsidian Charts users asked for CSV as the data source (issue #17, 8 reactions) — [phibr0/obsidian-charts#17](https://github.com/phibr0/obsidian-charts/issues/17)
- **GOV.UK Govspeak**: putting `{barchart}` after a numeric table renders a bar chart. Multiple columns give grouped bars, and `{barchart stacked}`, `negative` and `compact` are also available. The HTML is a table with a `js-barchart-table` class that JavaScript progressively enhances into a chart — [GOV.UK Markdown guidance](https://www.gov.uk/guidance/how-to-publish-on-gov-uk/markdown), [Publishing guidance: charts](https://guidance.publishing.service.gov.uk/formatting-content/text-formatting/charts), [govspeak repo docs](https://docs.publishing.service.gov.uk/repos/govspeak.html), [Govspeak chart component example](https://components.publishing.service.gov.uk/component-guide/govspeak/charts)
- **GitHub** renders `geojson` and `topojson` fences as interactive Leaflet maps and `stl` fences as 3D viewers, in issues, PRs, discussions, wikis and .md files (since 2022-03-17) — [GitHub changelog](https://github.blog/changelog/2022-03-17-mermaid-topojson-geojson-and-ascii-stl-diagrams-are-now-supported-in-markdown-and-as-files/), [GitHub Docs: Creating diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
- GitHub renders CSV/TSV *files* (not fences) as tables, per its "working with non-code files" docs — [GitHub Docs](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files). I did not re-read the page in this session for CSV details.
- **Quarto**: a feature request for a `{vega-lite}` fence "like the Mermaid diagrams" has been open since Oct 2022 (4 comments, 1 reaction) — [quarto-cli#2885](https://github.com/quarto-dev/quarto-cli/issues/2885). Altair vega-lite mimetype cells: [quarto-cli#6271](https://github.com/quarto-dev/quarto-cli/issues/6271) (3 reactions)
- **MPE (Markdown Preview Enhanced)** renders `vega` and `vega-lite` fences (JSON or YAML) and can `@import` spec files — [MPE repo](https://github.com/shd101wyy/vscode-markdown-preview-enhanced), [MPE docs mirror](https://portrait.gitee.com/mirsking/markdown-preview-enhanced/blob/master/docs/advanced-export.md)
- **Mermaid chart types**: `xychart-beta` (bar/line series, horizontal or vertical), `quadrantChart` (points in [0,1]²), `sankey-beta` (CSV-like source,target,value), `pie` — [mermaid xyChart](https://mermaid.js.org/syntax/xyChart.html), [quadrantChart doc v11](https://cdn.jsdelivr.net/gh/knsv/mermaid@11.0.0/docs/syntax/quadrantChart.md), [drawio Mermaid types](https://www.drawio.com/docs/manual/mermaid/mermaid-supported-diagram-types/)
- md-to-docx issue #59 gives this rationale: "Report-generation users often need charts in Word output. Markdown sources increasingly contain structured chart blocks, and some Markdown-to-DOCX tools support Chart.js-style rendering" — [md-to-docx#59](https://github.com/MohtashamMurshid/md-to-docx/issues/59)

### Inferences
- I found no direct evidence of data journalism or academic papers using Markdown chart fences that then go to Word. Academic use goes through Quarto/R Markdown with code cells (ggplot/matplotlib images), not declarative fences. **(inference)**
- LLM-generated reports: chat UIs render charts by running code (images) or as HTML artifacts. I found no evidence that LLMs routinely emit `chart`/`vega-lite` fences inside Markdown meant for docx. **(inference, weak evidence)**

### Gaps
- I did not find usage statistics for Govspeak `{barchart}` or examples of it outside GOV.UK.
- function-plot/desmos: the only signal is obsidian-desmos (33k installs, education/math notes). No evidence of demand for docx output.

## Q3. Evidence of demand for chart DSLs → Word/docx

### Takeaway
Direct, user-originated demand for "chart fences → docx" is **thin**. Quarto has one open vega-lite fence request (not docx-specific). Pandoc has zero vega issues. Obsidian Charts has export complaints about PDF, not docx, and MPE has one "vega output to png" request. The most concrete signal is from tool builders. md-to-docx (161k/week) added `chart`/`chartjs` fences as PNG (Jun 2026) and as **native editable Word charts** (merged 2026-11-15, using docx 9.15 `docx/charts`). Both changes were maintainer- or AI-driven, not driven by user issues. Converters in the market (Markdown Viewer extension, docu.md) export Vega-Lite/ECharts to docx **as images**.

### Cited Findings
- md-to-docx PR #76 (merged 2026-06-19) is an opt-in `chartRendering` for `chart`/`chartjs` fences. It validates a Chart.js-like JSON subset and has a built-in offline PNG raster for bar/line/pie/doughnut — [md-to-docx#76](https://github.com/MohtashamMurshid/md-to-docx/pull/76)
- md-to-docx PR #107 (merged 2026-11-15) adds `chartRendering.output: "native"`, which renders bar/line/pie/doughnut fences "as editable Word charts, so 'Edit Data' opens Excel". It uses "docx 9.15's `docx/charts`". The default stays image. The PR states "Not verified: opening a native chart in Word or LibreOffice", and the PR body says it was "Created with Claude Opus 5.5 in Claude Code" — [md-to-docx#107](https://github.com/MohtashamMurshid/md-to-docx/pull/107)
- Quarto: `{vega-lite}` fence request open since 2022 — [quarto-cli#2885](https://github.com/quarto-dev/quarto-cli/issues/2885). OJS in docx: `echo: false` is ignored for {ojs} cells in docx/pdf output — [quarto-cli#14641](https://github.com/quarto-dev/quarto-cli/issues/14641). A long thread asks for clearer `prefer-html` messages when HTML widgets go to non-HTML formats (22 comments) — [quarto-cli#8717](https://github.com/quarto-dev/quarto-cli/issues/8717). Mermaid→docx leaves temp PNGs — [quarto-cli#1146](https://github.com/quarto-dev/quarto-cli/issues/1146)
- Pandoc: the GitHub issue search `repo:jgm/pandoc vega` returned 0 results, and "chart docx native" returned only unrelated issues — [GitHub search API](https://api.github.com/search/issues?q=repo:jgm/pandoc+vega)
- MPE: request to "support setting vega output to png" (0 comments) — [MPE#853](https://github.com/shd101wyy/vscode-markdown-preview-enhanced/issues/853). MPE docs say code chunks are only partially compatible with pandoc export, and mermaid/wavedrom do not work in pandoc export — [MPE docs mirror](https://portrait.gitee.com/mirsking/markdown-preview-enhanced/blob/master/docs/advanced-export.md)
- Obsidian Charts export issues are about PDF: charts missing in PDF with Dataview ([#101](https://github.com/phibr0/obsidian-charts/issues/101)), incorrect bar value after PDF export ([#54](https://github.com/phibr0/obsidian-charts/issues/54), 6 comments), charts too large in PDF ([#41](https://github.com/phibr0/obsidian-charts/issues/41)), white background for exported images ([#36](https://github.com/phibr0/obsidian-charts/issues/36)), small text after image conversion ([#138](https://github.com/phibr0/obsidian-charts/issues/138))
- obsidian-enhancing-export (Pandoc-based, 482k): search "chart" returned 0 issues — [GitHub search](https://github.com/mokeyish/obsidian-enhancing-export/issues?q=chart)
- Markdown Viewer browser extension advertises Markdown → Word with "Vega/Vega-Lite data charts → High-resolution images" and LaTeX → editable Word equations — [Firefox add-on](https://addons.mozilla.org/addon/markdown-viewer-extension/), [repo](https://github.com/xicilion/markdown-viewer-extension). docu.md Chrome extension: DOCX export supporting up to 9 diagram formats including ECharts. Editability of charts is not stated — [Chrome Web Store](https://chromewebstore.google.com/detail/jekhhoflgcfoikceikgeenibinpojaoi)
- ibis-office (masanork, Japanese author, Rust Office suite, 1 star) converts Mermaid `pie` to a **native Office chart** with an SVG fallback, and keeps the editable Mermaid source (PR merged 2026-11-18) — [ibis-office#124](https://github.com/masanork/ibis-office/pull/124)
- Japanese search: no tool was found that explicitly outputs Markdown charts (Mermaid, Vega-Lite and so on) as editable Word charts. Tools embed them as images — sources surveyed: [markdocx](https://github.com/zhao-kun/markdocx), [Classmethod pandoc docx article](https://dev.classmethod.jp/etc/pandoc_markdown_to_docx/), [ONLYOFFICE JA blog on Word charts](https://onlyoffice.com/blog/ja/2025/08/word-chart)
- ChatGPT → Word: no source describes exporting a ChatGPT chart as an editable Word chart. Workarounds are to rebuild the chart in Excel and paste/link it into Word, or to use chat-to-Word extensions that preserve images/tables/code — [OpenAI community thread](https://community.openai.com/t/how-to-export-chatgpt-to-word-without-losing-formatting/1384095), [AiDocx extension](https://chromewebstore.google.com/detail/aidocx-export-ai-chats-to/mbfiokokcgpkdggleiepjjcefebeahkj?hl=en), [OpenAI help: documents with ChatGPT](https://help-lb.openai.com/en/articles/20001278-creating-and-editing-documents-spreadsheets-and-presentations-with-chatgpt-work)

**Native editable charts vs images**
- R `mschart` writes native Office charts whose data is embedded in the file and that are editable in the host application. It extends officer, which "does not provide native 'Microsoft' chart production". Types: bar, line, area, scatter, pie, bubble, radar, stock, plus chartEx waterfall/treemap/histogram (Office 2016+) — [CRAN mschart](https://cran.r-project.org/web/packages/mschart/readme/README.html), [refman](https://cran.r-project.org/web/packages/mschart/refman/mschart.html)
- python-docx has **no** native chart support. The common answer is matplotlib → image; an old PR (#392) tried to port python-pptx charts. python-pptx does support native charts. A small `docx-charts` PyPI package exists — [SO: python-docx charts](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/41471887/how-can-i-write-charts-to-python-docx-document), [python-pptx charts](https://python-pptx.readthedocs.io/en/latest/user/charts.html), [docx-charts](https://pypi.org/project/docx-charts/)
- Jmix forum: "Support native charts in DOCX/XLSX reports" (enterprise reporting request) — [Jmix forum](https://forum.jmix.io/t/support-native-charts-in-docx-xlsx-reports/4175)

### Inferences
- The demand for native editable charts is real in **report automation** (mschart, python-pptx charts, Aspose, Jmix requests, md-to-docx #107). For **Markdown-fence authors**, the observable asks are mostly "make my chart appear at all / look right in export" (PDF and PNG issues). **(inference)**
- md-to-docx is the closest competitor and already ships `chart`/`chartjs` fences to native docx charts with a Chart.js-like JSON schema. A remark-docx plugin would be catching up rather than pioneering. On the other hand, the competitor's feature was not driven by user issues, so its uptake is unknown. **(inference)**
- Japanese sources show the gap ("no tool outputs editable Word charts") rather than demand. **(inference)**

### Gaps
- Jupyter → docx (nbconvert/pandoc) handling of vega/altair outputs was not researched in depth.
- I did not verify whether Claude or ChatGPT docx outputs contain native charts.
- I could not check the author of md-to-docx issue #59 or any download/usage telemetry for its chart feature.

## Q4. Rendering feasibility in JS (browser + Node.js)

### Takeaway
Pure-JS SVG output in Node without a DOM or canvas is **official** for Vega/Vega-Lite (`view.toSVG()` with `renderer:'none'`), ECharts (`ssr:true` + `renderToSVGString()`, since 5.3.0) and ApexCharts (`apexcharts/ssr`, `renderToString`, 8.x). Observable Plot needs a virtual DOM (jsdom/linkedom via the `document` option). Chart.js needs a canvas (node-canvas via chartjs-node-canvas, a native dependency). Plotly.js needs jsdom (SVG only, unofficial gist), Electron/Orca or Kaleido (headless Chromium). SVG must then be rasterized or embedded. docx images need PNG, or SVG with a PNG fallback.

### Cited Findings
- Vega: `new vega.View(vega.parse(spec), {renderer:'none'})` then `view.toSVG()` works headless. node-canvas is needed only for PNG/canvas output and for accurate text measurement; without it, text placement uses a rough heuristic — [Vega usage](https://vega.github.io/vega/usage), [Vega View API](https://vega.github.io/vega/docs/api/view), [vl-convert](https://www.github.com/vega/vl-convert) (Rust/Deno-based converter, alternative)
- ECharts: `echarts.init(null, null, {renderer:'svg', ssr:true, width, height})` then `chart.renderToSVGString()`. It has zero dependencies and has existed since 5.3.0 — [ECharts SSR handbook](https://echarts.apache.org/handbook/en/how-to/cross-platform/server), [5.5.0 notes](https://echarts.apache.org/handbook/en/basics/release-note/5-5-0)
- ApexCharts: `apexcharts/ssr` runs in Node, and `ApexCharts.renderToString(options,{width,height})` returns SVG. Trellis charts are browser-only, and since 8.0 some chart types need explicit feature imports. The page does not mention a jsdom requirement — [ApexCharts SSR](https://apexcharts.com/docs/server-side-rendering/)
- Observable Plot: the `document` option "can be changed to another document, say when using a virtual DOM implementation for server-side rendering in Node". There are community examples with jsdom (Svelte) and linkedom (Framework) — [Plot: plots](https://observablehq.com/plot/features/plots), [plot discussion #1759](https://github.com/observablehq/plot/discussions/1759), [Observable forum linkedom answer](https://talk.observablehq.com/t/generate-static-png-or-svg-at-build-time-with-framework/8833/2)
- Chart.js in Node: chartjs-node-canvas depends on the native `canvas` package, which may need `npm rebuild`. SVG output is possible with `type:'svg'` (sync API only) — [chartjs-node-canvas npm](https://npmjs.com/package/chartjs-node-canvas), [README v5](https://cdn.jsdelivr.net/npm/chartjs-node-canvas@5.0.0/README.md). In the browser Chart.js draws to a `<canvas>` and can produce PNG via `toDataURL` **(inference from Chart.js architecture; not re-verified here)**
- Plotly.js: Plotly's own gist generates SVG in Node with jsdom (PNG left as a to-do). Otherwise use Orca (Electron) or Kaleido (headless Chromium, Python-focused) — [etpinard gist](https://gist.github.com/etpinard/58a9e054b9ca7c0ca4c39976fc8bbf8a), [plotly/orca](https://github.com/plotly/orca), [Kaleido](https://www.github.com/plotly/Kaleido)

### Inferences
- For a remark-docx plugin that must run in both browser and Node with no native dependency: vega-lite, ECharts and ApexCharts are feasible as SVG producers. Observable Plot is feasible if the user supplies a `document` (linkedom). Chart.js and Plotly are poor fits on Node. **(inference)**
- A native-chart route (no rendering at all) avoids canvas and DOM entirely and works identically in browser and Node. That is the strongest feasibility argument for mapping to `docx/charts`. **(inference)**

### Gaps
- I did not test the quality of Vega text layout without canvas, or SVG → PNG rasterization options (resvg-wasm and so on). npm stats for those were rate-limited.

## Q5. Mapping DSLs to docx.js native charts (docx 9.16.0 `docx/charts`)

### Takeaway
docx.js (9.16.0 in this repo; md-to-docx says charts arrived in 9.15) exports `ChartRun` with these types: column, bar, line, area, pie, doughnut, pieOfPie, barOfPie, radar, scatter, bubble and stock. It also supports per-series combo types (column/line/area), a secondary value axis, stacking (none/stacked/percent), date and grouped categories, data labels, trendlines, error bars and a data table. Several DSL subsets map cleanly to these: Obsidian Charts YAML, a Chart.js config subset, Mermaid `pie`/`xychart`, Govspeak-style table→barchart, and a vega-lite subset. Sankey, gantt and geo/stl have no native equivalent.

### Cited Findings
- `ChartRunOptions = Column | Bar | Line | Area | Pie | Doughnut | PieOfPie | BarOfPie | Radar | Scatter | Bubble | Stock`. The base options are title, legend, font, chartArea/plotArea, `transformation` (size, default 576×336 px), floating, and `altText` (auto-described from data if omitted). Category charts have `categories` (string/number/Date or grouped), `series`, `stacking`, axes (title, gridlines, reverseOrder, crossesAt, labelRotation, numberFormat), `secondaryValueAxis`, `dataLabels`, `emptyValues`, and `dataTable`. A series has a `type` override for combo charts, `axis`, per-bar `colors`, markers, smooth, line style, trendlines (linear/exponential/logarithmic/polynomial/power/movingAverage) and errorBars. `ChartRun` throws on invalid input (for example, a pie with more than one series, or negative pie values) — local file `/Users/inokawa/repos/inokawa/remark-docx/node_modules/docx/dist/charts.d.ts` (lines 15–1222). The package version comes from `node_modules/docx/package.json`.
- md-to-docx already maps a Chart.js-like JSON subset (bar/line/pie/doughnut) to these native charts — [md-to-docx#107](https://github.com/MohtashamMurshid/md-to-docx/pull/107)
- mschart's type set (bar, line, area, scatter, pie, bubble, radar, stock) is nearly identical. Its chartEx types (waterfall/treemap/histogram) are not in docx.js — [CRAN mschart README](https://cran.r-project.org/web/packages/mschart/readme/README.html)

### Inferences (mapping feasibility, per DSL)
- **Obsidian Charts YAML (`chart`)**: bar/line/pie/doughnut/radar map directly (`labels` → categories, `series[].title/data` → series). polarArea has no native equivalent and would need an image fallback. Stacked bars map to `stacking`. **High feasibility.** **(inference)**
- **Chart.js config (`chartjs`)**: `data.labels` and `datasets[].label/data/type` map to categories/series/combo. `indexAxis:'y'` → bar. Scatter/bubble map to point data. Plugins and callbacks cannot map. **High feasibility for a subset.** **(inference)**
- **Mermaid `pie`** → pie (single series). **Mermaid `xychart-beta`** → column/line combo (`horizontal` → bar). **`quadrantChart`** → scatter with axes crossing at 0.5, but the quadrant fill and labels would be lost. **`sankey`** has no equivalent. **`gantt`** could only be approximated with a stacked bar plus an invisible first series and date axes (a hack). **(inference)**
- **Govspeak `{barchart}` / table→chart**: a GFM table with a numeric column maps to column/bar, with `stacked` → stacking. This needs a non-standard marker syntax in mdast (a paragraph after the table), so it is lower priority outside GOV.UK. **(inference)**
- **vega-lite subset**: single-view `mark: bar|line|area|point|arc` with nominal/temporal x and quantitative y, inline `data.values`, and `color` as the series split map to native charts. Aggregations and transforms would need vega's dataflow evaluation (vega-lite compile + vega View, which runs headless) before mapping. Layered/faceted/concat specs, geoshape and selections would need the SVG fallback. **Medium feasibility.** **(inference)**
- **ECharts / ApexCharts / Plotly options**: the series-based option objects also map for basic types, but their DSLs are JS-object-oriented and rarely written as Markdown fences. **Low priority.** **(inference)**
- **csv/tsv fences → table**: no chart mapping is needed. This is a straightforward conversion to a docx table. **(inference)**
- **geojson/topojson/stl**: no native Word equivalent. Only an image could be produced (map tiles or 3D rendering would be heavy), so they are poor candidates. **(inference)**

### Gaps
- I did not verify that docx.js native charts open correctly in Word, LibreOffice or Google Docs (md-to-docx #107 also lists this as unverified).
- I did not test how faithfully Vega's computed scenegraph/data can be extracted for mapping.
