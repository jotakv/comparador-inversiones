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
