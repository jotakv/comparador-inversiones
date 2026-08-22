# Investment Decision Lab V2

Comparador estático, auditable y responsive de seis alternativas de inversión a diez años. Separa el coste total del proyecto, equity, deuda, circulante, caja y patrimonio; no confunde una estimación con un hecho.

## Ejecutar y comprobar

```bash
python3 -m http.server 8000
npm test
```

Abra `http://localhost:8000`. Servir por HTTP es necesario porque la aplicación carga JSON con `fetch`.

## Arquitectura

- `data/model-assumptions.json`: hipótesis editables y escenarios.
- `data/investments.json`: catálogo y evaluación multicriterio.
- `data/market-data.json`, `*-listings.json`, `camperization-quotes.json`: muestras de mercado separadas del modelo.
- `data/platforms.json` y `data/sources.json`: trazabilidad y asuntos pendientes de confirmación.
- `assets/js/finance.js`: fórmulas puras; `app.js` y `investment.js`: presentación.
- `inversiones/`: una ficha por alternativa; `docs/`: auditoría e informe.

## Actualizar datos o añadir una inversión

Actualice primero las observaciones fechadas en `data/`, manteniendo URL, estado de evidencia y fecha de consulta. Después cambie los supuestos, nunca el HTML. Para añadir una alternativa, incorpore su ficha en ambos JSON, cree una página con `data-investment`, y añada tests de unidades, inversión diferida y residual. La metodología, fórmulas y criterios de clasificación están en `metodologia.html`.

## Límites

Es una herramienta pre-fiscal de decisión, no una tasación ni asesoramiento. Precios de anuncios no son precios de cierre. Comisiones, seguro, IVA, licencias y cambios de uso requieren confirmación escrita antes de comprometer capital.

## UI architecture

The interface is a vanilla-JS BI shell: fixed topbar, persistent desktop sidebar, responsive mobile drawer and a shared content grid. Pages inject the shell through `mountShell()` so navigation, scenario state and print controls remain consistent.

## Design system and components

`assets/css/style.css` defines semantic tokens for application surfaces, text, borders, financial states and risk levels. Reusable JS components include KPI cards, badges, tooltips, panels, tables, rankings, alerts, empty states and source/risk status. Financial values use tabular numerals.

## Charts

`assets/js/charts.js` provides dependency-free SVG renderers for horizontal bars, bubble scatters, cumulative lines, stacked wealth, waterfalls and sensitivity heatmaps. SVG was selected instead of a CDN dependency so the static app remains offline-capable. Each chart consumes the view model; it does not reproduce formulas from `finance.js`.

To add a chart:

1. add or reuse an SVG renderer in `charts.js`;
2. pass it a result returned by `model()` or `buildResults()`;
3. use the stable color mapping from `ui.js`;
4. state in the panel subtitle which decision question it answers;
5. include accessible SVG titles and a zero baseline when financially meaningful.

## Scenario propagation

`state.js` reads `?scenario=pessimistic|base|optimistic`, falls back to `localStorage`, and defaults to base. The topbar writes both URL and storage. Navigation carries the query string so dashboard, detail pages and printable reports remain in the same scenario.

## Investment colors

Colors are assigned once in `ui.js` and mirrored by semantic CSS variables: Águilas blue, Reus green, L3H2 amber, campers rose, Tinamus violet and local grey. A project never changes color between charts.

## Print / PDF

Every page exposes **Imprimir / PDF**. Print CSS removes application navigation, preserves charts, prevents important panels from splitting and compacts tables for landscape A4 reporting.
