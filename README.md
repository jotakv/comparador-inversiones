# Investment Decision Lab V3

Comparador estático, auditable y responsive de nueve alternativas modelizadas y una referencia a diez años. Separa el coste total del proyecto, equity, deuda, circulante, caja y patrimonio; no confunde una estimación con un hecho.

## Cómo usar Decision Lab

Abra `decision-lab.html`, elija un perfil y cambie el benchmark y el valor de su hora. El ranking normaliza las métricas a 0–10, aplica pesos que se normalizan al 100 % y etiqueta diferencias inferiores al 5 % como empate técnico. Use `compare.html` para el cara a cara, `mi-decision.html` para límites obligatorios y `financing.html` para deuda y DSCR.

Los datos se actualizan únicamente en `data/model-assumptions.json`, `data/investments.json` y `data/risk-register.json`. Las recomendaciones se derivan del motor; no se escriben ganadores fijos en HTML. Las probabilidades de riesgo están marcadas como supuestos y el resultado por defecto es **PRE-TAX**.

## Desarrollo local

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Servir por HTTP es necesario porque la aplicación carga JSON con `fetch`.

En Windows también puede usar `python -m http.server 8000`.

## Laboratorio de alternativas con 45.000 €

`alternatives.html` analiza 45.000 € disponibles manteniendo separadas sus fuentes: 28.000 € de pago único SEPE, 12.000 € de indemnización y 5.000 € de ahorro. Parte de 24 modelos, selecciona diez finalistas y reutiliza los cinco escenarios financieros existentes como benchmarks.

Los inputs están en `data/alternative-investments.json`; `assets/js/alternative-engine.js` calcula proyecciones, ROI, TIR, payback, residual, stress, frontera eficiente y un score 0–100 contra umbrales absolutos. La caja del propietario se separa del FCF económico, que imputa las horas del promotor a 30 €/h. Las etiquetas SEPE son una evaluación preliminar: no confirman la elegibilidad de una partida ni sustituyen la memoria, las facturas o la respuesta del SEPE.

## Tests

En otra terminal, ejecute:

```bash
npm test
```

## Inversiones explicadas de forma sencilla

La página `entender-inversiones.html` explica individualmente Águilas, Castellón, Talavera de la Reina y El Ejido para lectores sin conocimientos financieros. Describe qué se compra, cómo entra y sale el dinero, la dedicación, los riesgos, los escenarios y lo que podría quedar tras diez años. Las cifras calculadas se obtienen de `data/model-assumptions.json`; `data/plain-language-investments.json` mantiene la narrativa y distingue datos confirmados, estimaciones, hipótesis y asuntos pendientes. Cuando el repositorio no contiene datos —actualmente, Castellón— la interfaz lo dice expresamente en vez de completar los huecos con cifras de otra operación.

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

## Nombres y presupuestos de arranque

Los nombres visibles se centralizan en `data/investments.json` (`displayName`, `shortName` y `assetName`) sin cambiar los IDs ni las URLs. Los presupuestos LOW/BASE/HIGH, fases, timeline, checklist y pasos operativos de las cinco estrategias se mantienen en `data/startup-budgets.json`; `assets/js/startup-plan.js` los presenta de forma común en cada ficha. Purchase price, all-in cost, project cost y maximum cash requirement no son conceptos intercambiables.

### Talavera: locker pasivo complementario

Talavera conserva el modelo de local comercial y dos puntos de reparto delegado y añade, como ingreso independiente, un locker exterior operado por un tercero. La valoración y el ranking usan **50 €/mes (hipótesis prudente)** hasta obtener una oferta contractual; la página permite comparar sin locker, 70 €/mes (base), 100 €/mes (optimista) y 120 €/mes (optimista alto). La oferta, aprobación del emplazamiento/comunidad, instalación, electricidad, licencia, duración y terminación contractual siguen pendientes. El supuesto provisional de coste incremental es 0 € exclusivamente para reproducir la valoración y no acredita que los costes reales sean cero.

### Agencia última milla Madrid — Catcher + Amazon

La alternativa `madrid-last-mile-agency` es un negocio operativo semi-delegado, no una inversión pasiva. Sus inputs auditables, cinco escenarios y estados de evidencia están en `data/madrid-last-mile-agency.json`; las fórmulas puras de ambos canales están en `assets/js/madrid-last-mile-engine.js`. El caso objetivo distingue 4.182 € facturados, 2.824,50 € pagados a dos repartidores, 1.357,50 € de margen antes de estructura y 937,50 €/mes pre-tax. Contratos, tarifas, volúmenes, RETA, local, fiscalidad y capital de arranque siguen marcados como hipótesis o pendientes.

### Madrid AVS híbrido — barbería + Catcher + Amazon

La inversión independiente `madrid-avs-hybrid-barber-logistics` opera dos locales AVS alquilados con seis sillas, cuatro espejos mínimos editables y dos microhubs. La infraestructura es compartida y lean: cada barbero aporta su maquinaria profesional y no se instala inicialmente lavacabezas. El caso base es 90 % de ocupación y 50 paquetes/día/punto; la referencia anterior era ≈22.300 €/año pre-tax, mientras el modelo principal usa gastos auditados y CAPEX bottom-up LOW/BASE/HIGH (objetivo histórico 16.000–18.000 €, no dogma). Es un negocio operativo, sin inmueble residual; contratos, licencia y autorización AVS están pendientes.
