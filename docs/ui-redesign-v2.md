# Investment Decision Lab V2 — BI interface redesign

## Audit of the previous visual layer

The previous V2 already separated finance, data and presentation and included cards, basic SVG bars, tables and per-investment content. Reusable assets were `finance.js`, structured JSON, the scenario definitions and financial tests. The visual layer remained a page-oriented collection: no persistent shell, global scenario state, coherent provenance, sortable scorecard, accessible BI chart grammar, risk tracker or printable reporting.

No economic assumption or formula was changed in this iteration. The existing financial engine remains the single source of truth.

## Visual architecture

- Fixed topbar: scenario, data date and print action.
- Persistent desktop sidebar and mobile drawer.
- Breadcrumb, compact page header, sticky analytical filter bar.
- Three-layer story: opportunities; explanatory financial analytics; downside and due diligence.
- Shared investment template: summary, thesis, Sources & Uses, unit economics, cash, sensitivity, stress and decision panel.

## Design system

Semantic CSS tokens cover surfaces, borders, typography, positive/negative/warning/information and risk states. Financial values use tabular numerals. Each investment has one immutable color. Status always includes text or an icon, never color alone.

## Components

`ui.js` owns shell, formatters, KPI, badge, tooltip and panel primitives. `state.js` owns query/localStorage scenario persistence. `view-model.js` converts finance-engine output to comparison-ready values. Tables, comparison rows, heat cells, alerts, provenance and quality bars share CSS primitives.

## Visualizations and questions

| Visual | Question answered |
|---|---|
| Risk/return bubble | Which return requires which risk and project size? |
| Capital/return bubble | How capital-intensive is each TIR? |
| TIR/ROI/MOIC selector | Who leads one comparable return metric? |
| VAN ranking | Who creates discounted value at 8%? |
| Payback ranking | Who recovers cash first? |
| Cumulative cash line | When is cash break-even crossed? |
| Stacked wealth | How much A10 wealth is cash versus residual? |
| Funding bars | What exceeds the 45k equity budget? |
| Multicriteria heatmap | Where is each project strong, medium or weak? |
| Sources & Uses waterfalls | Who funds and where is capital consumed? |
| Sensitivity heatmap/tornado | Which inputs dominate the result? |
| Scenario ranges | How wide are downside and upside? |
| Risk matrix | Which open risks combine probability and impact? |

All SVG charts are generated from data. No raster charts, CDN or framework dependency was introduced.

## Responsive and accessibility

Breakpoints at 1100, 780 and 430 px produce 3/2/1 KPI density, single-column analytical panels, a keyboard-operable drawer, horizontal tables and adaptive SVGs. Visible focus, labelled controls, semantic landmarks, textual statuses and `prefers-reduced-motion` are included.

## Print / PDF

Landscape A4 print rules remove shell/filter navigation, retain SVG, avoid splitting panels and compact tables. The topbar print button invokes `window.print()`.

## Files and responsibilities

- `style.css`: design tokens, shell, components, charts, responsive and print.
- `ui.js`: component primitives and application shell.
- `state.js`: persisted global scenario.
- `view-model.js`: dashboard-ready metrics without chart calculations.
- `charts.js`: dependency-free SVG visualizations.
- `app.js`: global dashboard orchestration.
- `investment.js`: standard detail analytics.
- `scenarios.js`, `risks.js`, `sources-page.js`: specialist dashboards.

## Future improvements

- Browser-level accessibility regression checks when a browser runtime is available.
- Optional saved user weighting presets with an explicit, documented scoring methodology.
- Export of selected tables to CSV and a deterministic PDF pagination pass.
