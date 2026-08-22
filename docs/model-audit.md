# Auditoría del modelo anterior

| Hallazgo | Impacto | Corrección V2 |
|---|---|---|
| HTML monolítico con copia completa de `data.json` | Dos fuentes divergentes y cifras difíciles de actualizar | Datos, cálculo y UI separados |
| Reus: 11 × 70 × 12 llamado 90 % | Sobreestima ingreso; en realidad es 100 % | Base: 11 × 60 × 12 × 90 % = 7.128 € |
| Camper singular por 45.000 € | No representa dos unidades | Flota = 2; 78–121k conversión y 93–132k terminadas |
| “2 L3H2 = 45.000 €” sin desglose | Omite puesta a punto, seguro, GPS, parking y circulante | Presupuestos flota 49,5/59,6/72,4k |
| IVA no separado | Confunde caja y coste económico | Escenarios 100/50/0 % recuperable, sujetos a asesor |
| Caja de vehículos constante diez años | Ignora crecimiento, inflación, averías y depreciación | OPEX creciente y residual depreciado |
| Plataformas y comisión implícitas | Riesgo contractual oculto | Comisión/seguro marcados pendientes de confirmación escrita |
| Tinamus presentado solo unlevered | No muestra llamadas de capital ni deuda | Reforma diferida y ficha de financiación/DSCR |
| ROI acumulado mezcla revalorización no realizada | Puede parecer caja | Tablas separan caja, activo, equity y residual |
| Ranking hardcodeado | Conclusión no responde a inputs | Rankings calculados y perfil multicriterio |
| Cambio de uso tratado en escenario base sin puerta binaria | Riesgo de pérdida severa | Etiqueta pendiente y NO-GO condicionado a informe favorable |
| Residual no tenía test explícito | Riesgo de doble contabilización | Motor añade residual una sola vez al flujo terminal |
| ROI anual restaba dos veces el CAPEX inicial y el dashboard omitía CAPEX diferido al estimar financiación | Distorsionaba retorno intermedio y gap de capital | Retorno reconciliado con inversión acumulada; `projectCost` incluye cada capital call una vez |
| Stress severo declaraba seis meses de retraso pero no lo calculaba | Downside excesivamente favorable | Primer año con ingresos se reduce proporcionalmente seis meses |

## Conservación

`data.json` se conserva como evidencia del modelo legado y para reconciliación, pero V2 no lo usa en cálculo.
