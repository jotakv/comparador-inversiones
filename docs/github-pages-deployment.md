# Despliegue en GitHub Pages

## Arquitectura

Investment Decision Lab es un sitio estático: HTML real, CSS, módulos JavaScript
y datasets JSON del mismo origen. Producción no necesita Node, Python, servidor
de aplicación, API ni base de datos. Node se usa únicamente para validación en CI.

El artefacto publicado contiene `*.html`, `.nojekyll`, `assets/`, `data/` e
`inversiones/`. No contiene Git, tests, documentación interna, hojas de cálculo,
PDF de trabajo ni `node_modules`. `.nojekyll` desactiva el procesamiento Jekyll
y permite servir el árbol estático tal como fue validado.

No se usa Chart.js: los gráficos actuales son SVG generados localmente por los
módulos de la aplicación, por lo que no existe una dependencia CDN ni riesgo de
mixed content.

## Project Pages y subpath

Una Project Page se publica en `https://<usuario>.github.io/<repositorio>/`.
HTML usa referencias relativas según su profundidad. El helper de
`assets/js/common.js` obtiene la raíz del sitio con `import.meta.url` y resuelve
desde ella datasets y navegación dinámica. Así, la misma copia funciona en `/`
y en cualquier subdirectorio, aunque cambie el nombre del repositorio.

Las query strings, por ejemplo `?scenario=base`, permanecen en la página actual.
`localStorage` es relativo al origen del navegador y solo guarda valores de
estado, nunca URLs de localhost.

## Workflow

`.github/workflows/pages.yml` se ejecuta en pushes a `main` o manualmente. El job
`test` hace checkout, configura Node, instala con `npm ci` y ejecuta `npm test`.
Solo si termina correctamente, `deploy` prepara `_site`, configura Pages, sube
el artefacto y lo despliega mediante las acciones oficiales. `GITHUB_TOKEN`
emplea exclusivamente permisos de lectura de contenidos, escritura de Pages e
identidad OIDC; no requiere PAT ni secretos propios.

## First-time GitHub configuration

El propietario debe abrir **Settings → Pages → Build and deployment** y elegir
**Source: GitHub Actions** si todavía no está seleccionado. Este ajuste no puede
realizarse desde el código del repositorio. Después basta con integrar los
cambios en `main` o ejecutar manualmente el workflow.

La URL final aparece en el environment `github-pages` y en la salida del job de
deploy. Habitualmente será `https://<usuario>.github.io/<repositorio>/`.

## Desarrollo local

Desde la raíz:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/`. En otra terminal ejecute `npm test`.

## Producción

El usuario final solo abre la URL HTTPS de Pages. No instala paquetes ni ejecuta
un servidor. Los JSON requeridos se publican deliberadamente junto a la web y
son, por definición, públicos.

## Troubleshooting

- **404 en todos los recursos:** confirme que Pages usa GitHub Actions y que el
  workflow terminó con éxito.
- **404 solo bajo el repositorio:** ejecute `npm test`; el test de paths impide
  referencias internas que comiencen en `/`.
- **JSON no carga:** compruebe el nombre exacto (incluidas mayúsculas) en `data/`
  y la respuesta del recurso en las herramientas del navegador.
- **Escenario inesperado:** revise `?scenario=` y la clave `idl-scenario` de
  `localStorage`; la query string válida tiene prioridad.
- **Cambios no visibles:** verifique el commit desplegado y espere a que concluya
  el environment `github-pages`; no es necesario limpiar rutas del servidor.
