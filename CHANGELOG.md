# Changelog

## Investment Decision Lab V2 — BI interface redesign — 2026-08-22

- Added persistent BI application shell, topbar, sidebar, breadcrumbs and global scenario state.
- Rebuilt the global dashboard with sortable scorecard, KPI strip, risk/return and capital/return scatterplots, rankings, cash series, wealth composition, funding gap, heatmap and professional A/B analysis.
- Standardized investment pages with executive KPIs, Sources & Uses, unit economics, waterfalls, cash-flow analytics, sensitivity, tornado, stress tests and decision panels.
- Added explicit binary change-of-use cases, two-vehicle/two-camper analytics, IVA views and Madrid versus seasonal camper strategy.
- Rebuilt scenario, risk, due-diligence, provenance, methodology and searchable glossary dashboards.
- Added responsive drawer/table/chart behavior, WCAG-oriented focus states, reduced-motion support and printable PDF reporting.
- Added shared SVG chart renderers, view models, scenario state and UI tests.

## 2.0.0 — 2026-08-21

- Sustituido el modelo opaco embebido por datos, cálculos y vistas separados.
- Corregida la ocupación de Reus: 11 × 60 € × 12 × 90 % = 7.128 €.
- Remodeladas **dos** L3H2 y **dos** campers, con escenarios low/base/premium, IVA y compra escalonada.
- Añadidas fichas independientes, flujos anuales y mensuales, stress tests, sensibilidades y gráficos.
- Añadidos Tinamus unlevered/levered, DSCR/LTV y distinción project IRR/equity IRR.
- Añadidos dashboard, riesgo-retorno, rankings múltiples y matriz configurable.
- Añadidos fuentes trazables, auditoría, informe V2, glosario y tests financieros.

### Fixed — audit reconciliation
- Corrected annual ROI/MOIC so acquisition CAPEX is not subtracted twice.
- `projectCost` now includes deferred conversion works/capital calls exactly once across detail and comparison views.
- Severe stress now applies the documented six-month revenue delay, in addition to revenue, OPEX and CAPEX shocks.
