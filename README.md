# Investment Decision Lab V3

Comparador estático, auditable y responsive de seis alternativas de inversión a diez años. Separa el coste total del proyecto, equity, deuda, circulante, caja y patrimonio; no confunde una estimación con un hecho.

## Cómo usar Decision Lab

Abra `decision-lab.html`, elija un perfil y cambie el benchmark y el valor de su hora. El ranking normaliza las métricas a 0–10, aplica pesos que se normalizan al 100 % y etiqueta diferencias inferiores al 5 % como empate técnico. Use `compare.html` para el cara a cara, `mi-decision.html` para límites obligatorios y `financing.html` para deuda y DSCR.

Los datos se actualizan únicamente en `data/model-assumptions.json`, `data/investments.json` y `data/risk-register.json`. Las recomendaciones se derivan del motor; no se escriben ganadores fijos en HTML. Las probabilidades de riesgo están marcadas como supuestos y el resultado por defecto es **PRE-TAX**.

## Desarrollo local

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Servir por HTTP es necesario porque la aplicación carga JSON con `fetch`.

En Windows también puede usar `python -m http.server 8000`.

## Tests

En otra terminal, ejecute:

```bash
npm test
```

## GitHub Pages

### Producción

La aplicación está preparada para publicarse como Project Pages en
`https://<usuario>.github.io/<repositorio>/`, sin fijar el usuario ni el nombre
del repositorio en el código. Los recursos estáticos se resuelven dentro del
subdirectorio de la aplicación.

### Despliegue

Cada `push` a `main` inicia GitHub Actions: instala las herramientas de test,
ejecuta `npm test`, prepara únicamente el sitio público y lo despliega con las
acciones oficiales de GitHub Pages. Consulte
[`docs/github-pages-deployment.md`](docs/github-pages-deployment.md) para la
configuración inicial y resolución de problemas.

## Arquitectura

- `data/model-assumptions.json`: hipótesis editables y escenarios.
- `data/investments.json`: catálogo y evaluación multicriterio.
- `data/market-data.json`, `*-listings.json`, `camperization-quotes.json`: muestras de mercado separadas del modelo.
- `data/platforms.json` y `data/sources.json`: trazabilidad y asuntos pendientes de confirmación.
- `assets/js/finance.js`: fórmulas puras; `assets/js/decision-engine.js`: normalización, perfiles, ranking y regret; los demás módulos presentan resultados.
- `inversiones/`: una ficha por alternativa; `docs/`: auditoría e informe.

## Actualizar datos o añadir una inversión

Actualice primero las observaciones fechadas en `data/`, manteniendo URL, estado de evidencia y fecha de consulta. Después cambie los supuestos, nunca el HTML. Para añadir una alternativa, incorpore su ficha en ambos JSON, cree una página con `data-investment`, y añada tests de unidades, inversión diferida y residual. La metodología, fórmulas y criterios de clasificación están en `metodologia.html`.

## Límites

Es una herramienta pre-fiscal de decisión, no una tasación ni asesoramiento. Precios de anuncios no son precios de cierre. Comisiones, seguro, IVA, licencias y cambios de uso requieren confirmación escrita antes de comprometer capital.

## Ejecución y pruebas de V4

La aplicación es estática y debe servirse por HTTP (no mediante `file://`):

```bash
npm ci
npm run serve
# http://localhost:8000/
```

`npm test` valida el modelo, los JSON, las rutas y las series. `npm run test:browser` abre las cinco vistas V4 con Playwright, falla ante errores de consola o de red y comprueba contenido y SVG visibles. Para instalar Chromium por primera vez: `npx playwright install --with-deps chromium`.

### Rutas y GitHub Pages

Los recursos se resuelven en `assets/js/common.js` desde `import.meta.url`. Por ello la misma versión funciona en la raíz local y en el subpath `/comparador-inversiones/`, sin hardcodear el nombre del repositorio. El loader central carga y valida JSON desde `data/`; `projection-engine.js` produce las series financieras y `report-engine.js` comparte ranking, recomendación y métricas entre resumen, analítica e informe. El workflow prueba primero el sitio y publica HTML, `assets/`, `data/`, `inversiones/` y `.nojekyll` como artefacto de Pages.
