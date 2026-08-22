# QA de producción V4

Fecha: 2026-08-22.

## Resultado local y subpath simulado

| Página | HTTP | Datos | Gráficos | Consola | Resultado |
|---|---:|---|---:|---|---|
| projections.html | 200 | 5 inversiones, A0–A10 | 11 SVG | 0 errores | PASS |
| executive-summary.html | 200 | KPIs, ranking, narrativa | 5 SVG | 0 errores | PASS |
| analytics.html | 200 | retornos, caja, patrimonio, riesgo, escenarios | 6 SVG | 0 errores | PASS |
| data-quality.html | 200 | variables, badges, freshness, prioridades | tabla (N/D) | 0 errores | PASS |
| report.html | 200 | resumen y 13 secciones | 5 SVG | 0 errores | PASS |

Playwright probó `http://127.0.0.1:8765/comparador-inversiones/…`, incluyendo status, `<main>`, encabezados, contenido, ausencia de error boundary, consola, requests fallidos, dimensiones de SVG y ausencia de `undefined`, `NaN` o `Infinity`. También se hizo QA manual automatizada en 1440×1000 y 390×844 sin overflow horizontal.

## Producción publicada

| Página | HTTP | Datos | Gráficos | Consola | Resultado |
|---|---:|---|---|---|---|
| projections.html | no verificable | no verificable | no verificable | no verificable | BLOCKED por proxy |
| executive-summary.html | no verificable | no verificable | no verificable | no verificable | BLOCKED por proxy |
| analytics.html | no verificable | no verificable | no verificable | no verificable | BLOCKED por proxy |
| data-quality.html | no verificable | no verificable | no verificable | no verificable | BLOCKED por proxy |
| report.html | no verificable | no verificable | no verificable | no verificable | BLOCKED por proxy |

Los intentos con curl devolvieron `CONNECT tunnel failed, response 403`; Chromium devolvió `net::ERR_TUNNEL_CONNECTION_FAILED`. El repositorio local tampoco tiene un remote configurado, por lo que este entorno no puede hacer push ni esperar GitHub Actions. La verificación publicada debe repetirse después de integrar el PR y concluir el workflow Pages.

## Screenshots

Visual QA completed locally en viewport desktop y móvil. Las capturas generadas se excluyen del repositorio porque son artefactos binarios y no son necesarias para ejecutar ni validar la aplicación.
