# Auditoría del PR V4 — diff solo texto

Base auditada: commit `5fa8c81` (último commit integrado antes del cambio V4). Rama contaminada auditada: `work` en `d63b6a5`. Rama limpia: `fix/pr-text-only-v4`.

## Binarios encontrados

| Archivo | Tipo | ¿Estaba en el diff? | ¿Necesario? | Acción |
|---|---|---:|---:|---|
| `docs/screenshots/v4-fix/analytics.png` | PNG de QA | Sí | No | Excluido de la rama limpia |
| `docs/screenshots/v4-fix/data-quality.png` | PNG de QA | Sí | No | Excluido de la rama limpia |
| `docs/screenshots/v4-fix/executive-summary.png` | PNG de QA | Sí | No | Excluido de la rama limpia |
| `docs/screenshots/v4-fix/projections.png` | PNG de QA | Sí | No | Excluido de la rama limpia |
| `docs/screenshots/v4-fix/report.png` | PNG de QA | Sí | No | Excluido de la rama limpia |
| `Compador inversiones.xlsx` | Excel de origen histórico | No; ya pertenece a la base | No es dependencia runtime | Sin cambios en este PR |
| `Ficha local Las Aguilas.pdf` | Documento histórico de evidencia | No; ya pertenece a la base | No es dependencia runtime | Sin cambios en este PR |

Los cinco PNG eran los únicos registros `- -` de `git diff --numstat 5fa8c81...d63b6a5`. No había ZIP, Excel, PDF u otro binario nuevo en el diff. El código usa exclusivamente los JSON versionados en `data/`; ningún HTML o módulo carga el Excel, el PDF o una captura.

## Paridad funcional

| Feature | Rama anterior | Rama limpia | Estado |
|---|---:|---:|---|
| Projections | Sí | Sí | OK |
| Executive Summary | Sí | Sí | OK |
| Analytics | Sí | Sí | OK |
| Data Quality | Sí | Sí | OK |
| Report | Sí | Sí | OK |
| Gráficos SVG generados por código | Sí | Sí | OK |
| Projection engine | Sí | Sí | OK |
| Report engine | Sí | Sí | OK |
| Loader y resolución de base path | Sí | Sí | OK |
| Documentación | Sí | Sí | OK |
| Tests unitarios y Playwright | Sí | Sí | OK |

## Política de artefactos

`.gitignore` excluye los screenshots locales V4, ZIP y directorios habituales de exportación. No ignora globalmente PDF, Excel o imágenes, porque el historial del repositorio contiene documentos de evidencia legítimos. Visual QA sigue ejecutándose; solamente se evita versionar su salida binaria.
