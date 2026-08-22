# Diagnóstico runtime V4

Fecha: 2026-08-22. La reproducción se realizó **antes de modificar código**. El proxy del entorno rechazó GitHub Pages (`CONNECT 403` / `net::ERR_TUNNEL_CONNECTION_FAILED`), por lo que no fue posible observar la consola del servidor publicado. Se reprodujo el mismo commit servido por HTTP local y se encontró el fallo compartido y determinista indicado abajo.

| Página | Error | Causa probable | Evidencia | Fix |
|---|---|---|---|---|
| projections.html | Permanece en “Cargando modelo…”, 0 gráficos | Import ES module inexistente | Chromium: `The requested module './finance.js' does not provide an export named 'euro'` | Importar `euro`/`pct` desde `common.js`, su módulo productor |
| executive-summary.html | Igual; no se inicializa el DOM | Mismo módulo compartido | HTTP 200 para HTML/JS/JSON, seguido del error de enlace ESM | Fix central en `v4-page.js` |
| analytics.html | Igual | Mismo módulo compartido | Sin requests 404; el error ocurre antes del primer render | Fix central y scatter compatible con claves anidadas |
| data-quality.html | Igual | Mismo módulo compartido | El loader llega a resolver recursos, pero el módulo no puede evaluarse | Fix central, validación/caché y error visible |
| report.html | Igual | Mismo módulo compartido | La evaluación completa de `v4-page.js` se aborta por export ausente | Fix central y error boundary |

## Causa raíz

`assets/js/v4-page.js` importaba `euro` y `pct` desde `finance.js`, que no exporta esos símbolos. Los módulos ES validan todos los exports antes de ejecutar: por eso ninguna instrucción de renderizado se alcanzaba y las cinco páginas compartidas quedaban en el loading inicial. No era una ruta absoluta rota. La auditoría confirmó que HTML, imports y fetch son relativos; `appUrl()` obtiene la raíz del proyecto a partir de la URL del propio módulo y es compatible con Project Pages.

Además, el gráfico risk-return pedía propiedades anidadas (`base.irr`, `base.projectCost`) a un renderer que solo leía propiedades planas. Esto generaba coordenadas SVG `NaN` aunque no arrojaba una excepción. El renderer ahora resuelve claves anidadas.

## Rutas y datos

Todos los JSON existentes bajo `data/` son válidos y respetan capitalización. El workflow copia `assets`, `data`, `inversiones`, todos los HTML raíz y `.nojekyll`. No se encontraron URLs de recursos ancladas a `/`. El loader central usa `new URL('../../', import.meta.url)`, comprueba HTTP, valida JSON, cachea promesas correctas y elimina fallos de caché para permitir reintentos.

## Modelo financiero

No se modificaron fórmulas financieras. Los tests existentes confirman Reus = `11 × 60 × 12 × 0,90 = 7.128 €`, dos unidades en L3H2 y campers, conversión de Águilas y reforma/capital futuro de Tinamus. Base 100 divide el patrimonio económico de cada año por la magnitud del patrimonio inicial; en Tinamus el patrimonio ya descuenta deuda, evitando normalizar por el valor bruto del activo.
