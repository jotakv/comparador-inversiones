# Informe de viabilidad — SomaWellness AVS ultralean + microagencia de última milla

**Proyecto:** dos microestudios wellness en Calle Boldano 41 y Calle Puntallana 20, Madrid, combinados con Amazon Hub Delivery y Catcher mediante reparto delegado.  
**Horizonte:** 24 primeros meses.  
**Fecha de análisis:** 10 de septiembre de 2026.  
**Moneda:** euros, sin IVA recuperable y antes de IRPF/Impuesto sobre Sociedades.  
**Confianza:** alta en la aritmética; media en el wellness; media-baja en logística hasta disponer de ofertas y contratos aplicables a ambos locales.

> **Conclusión ejecutiva:** `CONDITIONAL GO` — 72/100. El negocio puede ser rentable con muy poco capital porque la renta AVS es baja y casi todos los costes son variables. Sin embargo, la valoración previa de 8,7/10 y el “FCF” de 25.000–28.500 €/año sobrestiman la certeza: 50 paquetes diarios por local exceden el volumen público de 20–30 paquetes que Amazon describe para Hub Delivery; el reparto 50/50 paga solo 16,80–25,20 € por clase al profesor durante gran parte de la rampa; y no se había valorado el trabajo del fundador. El caso V4 sigue siendo atractivo si estos tres puntos se validan por contrato y preventa.

## 1. Decisión y condiciones para invertir

La inversión debe aprobarse únicamente si, antes de comprometer gasto irreversible, se cumplen estas condiciones:

1. La autorización AVS para wellness y logística en los dos locales consta por escrito y se incorpora al expediente contractual.
2. Un técnico confirma por escrito actividad, aforo, accesibilidad, evacuación, ventilación, ruido y compatibilidad de la zona segregada de paquetes.
3. Amazon/Catcher confirman por escrito ambos puntos, tarifa neta, volumen mínimo o rango esperado, horario, radio, incidencias, seguros y posibilidad de ejecución mediante un autónomo contratado por el negocio.
4. Una prueba real demuestra que un solo repartidor puede recoger y operar las dos rutas sin solapamiento ni pérdida de SLA.
5. Se realiza una preventa mínima de **25 socios equivalentes entre ambos locales** antes de lanzar 18 clases semanales, o los profesores aceptan un contrato de alquiler fijo por franja sin mínimo garantizado para SomaWellness.
6. La inversión inicial física se limita a **2.850 €** solo si los locales ya son utilizables sin obra, climatización, insonorización ni correcciones de accesibilidad.

Si falla cualquiera de las condiciones 1–4, el proyecto no debe abrirse con dos locales a la vez. La alternativa correcta sería pilotar uno durante 8–12 semanas.

## 2. Concepto operativo

Los locales explotan dos capas compatibles por tiempo, no cinco negocios independientes:

- **Wellness:** yoga, movilidad, mindfulness, meditación y clases afines.
- **Talleres:** seis eventos mensuales en el caso estabilizado.
- **Microagencia logística:** recepción, clasificación y salida de paquetes Amazon Hub Delivery y pedidos Catcher.
- **Reparto:** delegado a un autónomo; su remuneración ya está incluida en el motor V4.

La microagencia no exige atención simultánea. Un solo autónomo recoge y opera ambos puntos de forma secuencial. La franja logística ocupa **1 m² en cada local, de lunes a sábado, de 11:30 a 14:00**. Para que no interfiera con wellness, el protocolo debe exigir que a las 14:00 los paquetes hayan salido a reparto o permanezcan en armario cerrado y segregado, nunca en la sala, aseos, puertas o recorridos de evacuación.

La restricción real no es el metro cuadrado sino el volumen y la geometría del paquete. El escenario de 50 paquetes por punto necesita prueba volumétrica con una jornada real: número de bultos, volumen máximo, altura de estantería admisible, tiempo de escaneo y carga. No se puede confirmar capacidad por superficie de suelo únicamente.

## 3. Los dos locales y capacidad

| Local | Superficie útil aportada | Aforo financiero | Zona logística | Observación |
|---|---:|---:|---:|---|
| Boldano 41, 28027 | 36,78 m² | 8 plazas/clase | 1 m² | Puede admitir 8–10 financieramente; el aforo legal queda pendiente del técnico. |
| Puntallana 20, 28017 | 29,70 m² | 8 plazas/clase | 1 m² | El escenario financiero no utiliza más de 8 plazas. |
| **Total** | **66,48 m²** | **16 plazas simultáneas** | **2 m²** | Dos salas independientes; no se suman para una sola clase. |

Los códigos postales son distintos. Esto refuerza la cobertura comercial, pero añade desplazamiento improductivo al repartidor. La ruta entre ambos puntos debe cronometrarse; el margen V4 no incorpora explícitamente ese tiempo muerto.

### Capacidad wellness

En el caso base estabilizado:

- 18 clases/semana × 4,33 semanas = **77,94 clases/mes**.
- 77,94 × 8 plazas = **623,52 plazas-asistencia/mes**.
- Al 60 % de ocupación = **374,11 asistencias/mes**.
- Si cada socio acude cinco veces al mes, se necesitan aproximadamente **75 socios activos equivalentes** entre los dos centros.
- Si acude cuatro veces, se necesitan aproximadamente **94 socios**.

La ocupación media del 60 % es posible matemáticamente, pero debe validarse por franja: una clase llena a las 19:00 no compensa otra vacía a las 09:00.

## 4. Single Source of Truth — supuestos centrales

| ID | Variable | Valor base | Rango | Tipo | Fuente/fecha | Confianza |
|---|---|---:|---:|---|---|---|
| local.boldano.area | Superficie útil Boldano | 36,78 m² | — | `SUPUESTO APORTADO` | Usuario, 10/09/2026 | media |
| local.puntallana.area | Superficie útil Puntallana | 29,70 m² | — | `SUPUESTO APORTADO` | Usuario, 10/09/2026 | media |
| wellness.capacity | Plazas por clase | 8 | 6–10 | `SUPUESTO` | Modelo financiero prudente | media |
| wellness.price | Ingreso efectivo/asistencia | 10,50 € | 9–12 € | `SUPUESTO` | Contraste de tarifas locales, 10/09/2026 | media |
| wellness.class.share | Parte del estudio | 50 % | 40–60 % | `SUPUESTO` | Modelo aportado | baja-media |
| wellness.workshop.share | Parte del estudio en talleres | 35 % | 30–40 % | `SUPUESTO` | Modelo aportado | media |
| wellness.base | Programación estabilizada | 18 clases/sem.; 60 % | 12–20; 45–65 % | `SUPUESTO` | Modelo aportado | media |
| workshops.base | Talleres estabilizados | 6/mes × 6 pax × 22 € | 4–8 | `SUPUESTO` | Modelo aportado | media-baja |
| rent.full | Renta conjunta completa | 585,64 €/mes | validar contrato | `SUPUESTO APORTADO` | V4 aportado | media |
| rent.discount | AVS 0/25/50/75/100 % | según mes | — | `VERIFICADO` | Comunidad de Madrid, consulta 10/09/2026 | alta |
| logistics.v4.30 | Margen antes de estructura | 851 €/mes | — | `SUPUESTO APORTADO` | Motor V4 | media-baja |
| logistics.v4.50 | Margen antes de estructura | 1.202 €/mes | — | `SUPUESTO APORTADO` | Motor V4 | media-baja |
| logistics.v4.60 | Margen antes de estructura | 1.358 €/mes | — | `SUPUESTO APORTADO` | Motor V4 | baja |
| logistics.public | Volumen público Amazon | 20–30 paquetes/día/comercio | 20–30 | `VERIFICADO` | Amazon España, publicación 07/08/2024 consultada 10/09/2026 | media-alta |
| opex.wellness | Estructura wellness | 650 €/mes | 650–950 € | `SUPUESTO` | Modelo aportado/desglose provisional | media-baja |
| opex.logistics | Estructura incremental | 120 €/mes | 120–250 € | `SUPUESTO` | Motor V4 | media-baja |
| capex.original | Capital inicial | 7.521,28 € | 7.500–12.000 € | `ESTIMACIÓN` | Cálculo auditado | media |
| founder.cost | Coste económico del fundador | 800 €/mes | 600–1.000 € | `SUPUESTO` | 35–50 h/mes, no desembolsado necesariamente | baja-media |
| teacher.floor | Suelo docente de sensibilidad | 30 €/clase | 25–40 € | `SUPUESTO` | No es presupuesto; prueba de sostenibilidad | baja |

### Evidencia de precios

El precio efectivo de 10,50 € por asistencia es defendible, aunque no está validado por preventa. En Ciudad Lineal se observan clases colectivas privadas con grupos de ocho a 17 € la sesión y mensualidades de 48–118 €; otro operador de 28027 anuncia clase suelta a 12 €. También existe competencia pública subvencionada con cuotas trimestrales de 35,40–63,20 €, mucho más baratas. Esto obliga a vender proximidad, grupos pequeños, calidad docente y flexibilidad, no solo “yoga barato”.

## 5. Inversión inicial

### Versión ultralean original

| Partida | Importe |
|---|---:|
| 18–20 esterillas | 400,00 € |
| Zafus/cojines | 400,00 € |
| Estanterías generales | 250,00 € |
| Zapateros/percheros | 150,00 € |
| Sonido | 150,00 € |
| Pintura DIY | 250,00 € |
| Iluminación básica | 250,00 € |
| Señalización | 100,00 € |
| Botiquín/seguridad | 150,00 € |
| Microhub/estanterías | 250,00 € |
| CCTV/logística | 200,00 € |
| Otros | 300,00 € |
| **CAPEX físico** | **2.850,00 €** |
| Fianza estimada | 1.171,28 € |
| Circulante | 1.500,00 € |
| Técnico/licencia/trámites | 1.000,00 € |
| Colchón | 1.000,00 € |
| **Capital total exacto** | **7.521,28 €** |

El total no es exactamente 7.500 €, sino **7.521,28 €**. La fianza y el circulante no son gasto operativo; son capital inmovilizado. El CAPEX ultralean solo es válido si no aparecen necesidades de climatización, ventilación, aislamiento acústico, accesibilidad, protección contra incendios, obra de baño o electricidad.

### Capital recomendado para una decisión financiable

| Partida | Rango recomendado |
|---|---:|
| CAPEX físico | 2.850 € |
| Fianza | 1.171 € |
| Técnico, licencia y certificados | 1.500–3.000 € |
| Lanzamiento y preventa | 500 € |
| Circulante | 2.500 € |
| Contingencia | 1.500 € |
| **Capital recomendado** | **10.021–11.521 €** |

Para los cálculos “bancables” se usa **10.750 €**. No es necesario gastarlo todo: es liquidez disponible para no cerrar o deteriorar el producto ante el primer imprevisto.

## 6. OPEX mensual

El importe de 650 € no venía desglosado. Para hacerlo auditable se propone provisionalmente:

| Estructura wellness | €/mes |
|---|---:|
| Suministros e internet, dos locales | 220 € |
| Limpieza/lavandería | 160 € |
| Software de reservas y cobros | 50 € |
| Seguros | 50 € |
| Marketing local | 100 € |
| Consumibles y mantenimiento | 70 € |
| **Total wellness** | **650 €** |
| Estructura logística incremental | **120 €** |
| **Estructura total, sin renta** | **770 €** |

No están incluidos: cuota RETA o coste de sociedad, gestoría si no está dentro de otra partida, comisiones de TPV, música/licencias, protección de datos, mantenimiento extraordinario, impuestos, deuda ni remuneración del fundador. Si alguno aplica, debe añadirse; no puede tratarse como gasto personal ajeno al negocio.

## 7. Unit economics del wellness

### Clases estabilizadas

```text
18 clases/semana × 8 plazas × 60 % × 4,33 × 10,50 €
= 3.928,18 € de ventas mensuales
```

- Profesor al 50 %: **1.964,09 €**.
- Margen del estudio: **1.964,09 €**.
- Asistentes medios: **4,8 por clase**.
- Ingreso total por clase: **50,40 €**.
- Pago del profesor por clase al 50 %: **25,20 €**.

### Talleres estabilizados

```text
6 talleres × 6 asistentes × 22 € = 792 € de ventas
792 € × 35 % = 277,20 € para el estudio
```

### Margen wellness estabilizado

**1.964,09 + 277,20 = 2.241,29 €/mes**, antes de la estructura y la renta.

### Problema del 50/50

El reparto parece variable y seguro para SomaWellness, pero traslada el riesgo al profesor:

| Fase | Alumnos/clase | Pago docente al 50 % |
|---|---:|---:|
| Meses 1–3 | 3,2 | 16,80 €/clase |
| Meses 4–6 | 4,0 | 21,00 €/clase |
| Base estabilizada | 4,8 | 25,20 €/clase |
| Meses 10–12 | 5,2 | 27,30 €/clase |

La alternativa recomendada es una mezcla:

- profesores residentes que alquilan franjas fijas;
- clases de marca con mínimo de 25–30 € y bonus desde el quinto alumno;
- talleres con 35 % para el estudio;
- pilotos sin mínimo únicamente cuando el propio profesor aporta alumnos.

Con un suelo hipotético de **30 €/clase**, el coste docente adicional frente al 50/50 sería 5.175 € en el año 1 y 4.489 € en el año 2.

## 8. Unit economics de la microagencia logística

Se conserva V4 sin reconstruirlo:

| Paquetes Amazon/día/punto | Margen Amazon + Catcher antes de estructura | Neto tras 120 € |
|---:|---:|---:|
| 30 | 851 € | 731 € |
| 50 | 1.202 € | 1.082 € |
| 60 | 1.358 € | 1.238 € |

Para 50 paquetes/día/punto, V4 aporta además:

- facturación logística: **3.766 €/mes**;
- pagos a repartidores: **2.565 €/mes**;
- margen declarado: **1.202 €/mes** por redondeo.

Debe reconciliarse si las cifras contienen o no IVA: 3.766 − 2.565 = 1.201 €, no 1.202 €. La diferencia de 1 € no cambia la decisión, pero revela que V4 trabaja con importes redondeados.

Amazon describe públicamente **20–30 paquetes diarios por comercio**, con un radio aproximado de 400 metros en entornos urbanos, y aclara que no es recogida en tienda: el comercio entrega en domicilios. Por tanto:

- **30 paquetes/punto** es el caso respaldado públicamente;
- **50 paquetes/punto** es un objetivo que exige contrato u oferta específica;
- **60 paquetes/punto** es upside, no base de inversión.

Catcher no garantiza volumen ni tarifa: el comercio y el repartidor publican precios y solo hay operación cuando se produce matching. Su contribución debe separarse de Amazon en la próxima versión de V4.

### Capacidad de un autónomo para dos puntos

El autónomo no necesita permanecer en ambos locales, pero debe:

1. recibir/escanear en Boldano;
2. recibir/escanear en Puntallana;
3. cargar y ordenar rutas;
4. ejecutar entregas en dos áreas;
5. gestionar intentos fallidos e incidencias.

La franja 11:30–14:00 puede servir para recepción y salida. No prueba que 100 entregas diarias quepan en 2,5 horas. A 100 paquetes/día, el modelo debe asumir una jornada de reparto sustancial fuera del local y comprobar que los 2.565 €/mes cubren tiempo, vehículo, combustible, seguros y autónomos del repartidor.

## 9. Alquiler AVS

La Comunidad de Madrid confirma el siguiente escalado para locales de emprendedores:

| Periodo | % de renta | Renta conjunta |
|---|---:|---:|
| Meses 1–6 | 0 % | 0,00 € |
| Meses 7–12 | 25 % | 146,41 € |
| Meses 13–24 | 50 % | 292,82 € |
| Meses 25–36 | 75 % | 439,23 € |
| Mes 37+ | 100 % | 585,64 € |

La página oficial también admite una actividad accesoria o complementaria en otro local AVS si se presenta memoria justificativa. En este informe se acepta como dato del promotor que AVS ya autoriza wellness + logística, pero se mantiene como condición que esa autorización sea documental y aplicable a ambos contratos.

## 10. Proyección mensual — caso de decisión V4

Hipótesis: wellness con la rampa aportada; logística a 30 paquetes/punto durante meses 1–6 y a 50 desde el mes 7; estructura de 770 €/mes; renta AVS; profesores y repartidor ya descontados; sin coste del fundador, fiscalidad, deuda ni CAPEX de mantenimiento.

| Mes | Clases/sem. | Ocup. | Talleres | Margen wellness | Margen logístico V4 | Renta AVS | EBITDA caja | Caja acum. tras 7.521 € |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 10 | 40 % | 2 | 819,84 € | 851,00 € | 0,00 € | 900,84 € | −6.620,44 € |
| 2 | 10 | 40 % | 2 | 819,84 € | 851,00 € | 0,00 € | 900,84 € | −5.719,60 € |
| 3 | 10 | 40 % | 2 | 819,84 € | 851,00 € | 0,00 € | 900,84 € | −4.818,76 € |
| 4 | 14 | 50 % | 4 | 1.457,82 € | 851,00 € | 0,00 € | 1.538,82 € | −3.279,94 € |
| 5 | 14 | 50 % | 4 | 1.457,82 € | 851,00 € | 0,00 € | 1.538,82 € | −1.741,12 € |
| 6 | 14 | 50 % | 4 | 1.457,82 € | 851,00 € | 0,00 € | 1.538,82 € | −202,30 € |
| 7 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 146,41 € | 2.526,88 € | 2.324,58 € |
| 8 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 146,41 € | 2.526,88 € | 4.851,46 € |
| 9 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 146,41 € | 2.526,88 € | 7.378,33 € |
| 10 | 20 | 65 % | 8 | 2.733,78 € | 1.202,00 € | 146,41 € | 3.019,37 € | 10.397,70 € |
| 11 | 20 | 65 % | 8 | 2.733,78 € | 1.202,00 € | 146,41 € | 3.019,37 € | 13.417,07 € |
| 12 | 20 | 65 % | 8 | 2.733,78 € | 1.202,00 € | 146,41 € | 3.019,37 € | 16.436,44 € |
| 13 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 18.816,91 € |
| 14 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 21.197,38 € |
| 15 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 23.577,85 € |
| 16 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 25.958,32 € |
| 17 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 28.338,78 € |
| 18 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 30.719,25 € |
| 19 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 33.099,72 € |
| 20 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 35.480,19 € |
| 21 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 37.860,66 € |
| 22 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 40.241,12 € |
| 23 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 42.621,59 € |
| 24 | 18 | 60 % | 6 | 2.241,29 € | 1.202,00 € | 292,82 € | 2.380,47 € | 45.002,06 € |

### Resumen de 24 meses

| Métrica | Año 1 | Año 2 | Total 24 meses |
|---|---:|---:|---:|
| EBITDA caja simplificado | 23.957,72 € | 28.565,62 € | 52.523,34 € |
| Inversión inicial | 7.521,28 € | — | 7.521,28 € |
| Excedente acumulado tras inversión | 16.436,44 € | 28.565,62 € | **45.002,06 €** |
| EBITDA medio mensual | 1.996,48 € | 2.380,47 € | 2.188,47 € |

El payback exacto se produce aproximadamente en el **mes 6,08**, es decir, al inicio del mes 7. El dato previo “6,1 meses” era correcto para la rampa 30→50; el payback de cinco meses solo corresponde a 50 paquetes/punto desde el primer mes.

## 11. Esto no es todavía FCF

La cifra anterior debe llamarse **EBITDA caja simplificado**, no flujo de caja libre o FCF. Todavía faltan:

- tributación empresarial;
- cuota y estructura jurídica del promotor;
- comisiones de cobro no incluidas;
- inversión de mantenimiento;
- variaciones reales de circulante;
- deuda, si existe;
- remuneración económica del fundador.

### Vista económica ajustada

Para evitar un ROI artificial, se añade:

- coste económico del fundador: **800 €/mes**;
- suelo docente de **30 €/clase** cuando el 50 % genere menos;
- capital disponible inicial: **10.750 €**.

| Métrica ajustada | Año 1 | Año 2 | 24 meses |
|---|---:|---:|---:|
| EBITDA económico ajustado | 9.182,51 € | 14.476,27 € | 23.658,78 € |
| Excedente tras capital inicial de 10.750 € | — | — | **12.908,78 €** |
| Payback económico | | **mes 13,3** | |

Esta vista no pretende afirmar que Kevin deba pagarse 800 € desde el primer día. Mide si el negocio crea valor después de reconocer su tiempo y una relación docente más sostenible.

## 12. Escenarios

Todos los escenarios conservan el mismo calendario AVS y la rampa wellness aportada, salvo el estrés.

| Escenario | Logística | Capital | Año 1 | Año 2 | 24 meses | Payback |
|---|---|---:|---:|---:|---:|---:|
| V4 original agresivo | 50 desde mes 1 | 7.521 € | 26.063,72 € | 28.565,62 € | 54.629,34 € | 4,99 meses |
| **Caso de decisión condicionado** | 30 meses 1–6; 50 desde mes 7 | 7.521 € | **23.957,72 €** | **28.565,62 €** | **52.523,34 €** | **6,08 meses** |
| Benchmark público Amazon | 30 durante 24 meses | 7.521 € | 21.851,72 € | 24.353,62 € | 46.205,34 € | 6,09 meses |
| Upside no bancable | 60 desde mes 1 | 7.521 € | 27.935,72 € | 30.437,62 € | 58.373,34 € | 4,61 meses |
| **Económico ajustado** | 30→50; suelo docente; fundador | 10.750 € | **9.182,51 €** | **14.476,27 €** | **23.658,78 €** | **13,3 meses** |

La diferencia entre 30 y 50 paquetes por punto es menor de lo que aparenta: solo **351 €/mes** de margen. El proyecto no necesita 50 para ser positivo; sí necesita contrato para presentar 50 como escenario base.

### Estrés combinado

Supuestos:

- inversión inicial: 12.000 €;
- meses 1–3 sin logística;
- desde mes 4: 30 paquetes/punto;
- wellness: 8 clases al 30 % y 1 taller; después 10 al 40 % y 2; después 12 al 45 % y 4; año 2, 14 al 50 % y 4;
- suelo docente de 30 €/clase;
- sin valorar todavía el coste económico del fundador.

Resultados:

| Estrés | Año 1 | Año 2 | Total 24 meses |
|---|---:|---:|---:|
| EBITDA caja tras suelo docente | 1.465,69 € | 8.405,04 € | 9.870,73 € |
| Caja tras inversión de 12.000 € | | | **−2.129,27 €** |
| Payback | | | **No alcanzado en 24 meses** |

El escenario defensivo anterior de 570 €/mes era incompleto: mantenía simultáneamente logística desde el inicio, CAPEX de 7.500 € y profesores sin garantía mínima. El estrés completo sigue operativo, pero no recupera la inversión en dos años.

## 13. Break-even

### Con logística a 30 paquetes/punto y renta completa

Con 4 talleres/mes:

```text
Costes fijos y renta: 650 + 120 + 585,64 = 1.355,64 €
Menos margen logístico: −851,00 €
Menos margen talleres: −184,80 €
Necesidad de margen de clases: 319,84 €
```

Cada asistencia aporta 5,25 € al estudio bajo 50/50. Por tanto:

- break-even: **60,92 asistencias/mes**;
- con 12 clases/semana: **1,17 alumnos medios por clase**.

Es un break-even financiero muy bajo gracias a logística. No es un mínimo comercial sostenible para profesores.

### Wellness sin logística, renta completa

Con 18 clases/semana y 6 talleres:

- asistencias necesarias: **205,42/mes**;
- alumnos medios por clase: **2,64**;
- ocupación: **33,0 %**.

Con suelo docente de 30 €/clase, el wellness base todavía deja aproximadamente **512 €/mes** antes del trabajo del fundador. Después de imputar 800 €/mes, quedaría en pérdida económica de unos 288 €/mes. La logística no es necesaria para evitar pérdidas de caja, pero sí para remunerar razonablemente la gestión en el caso central.

## 14. Sensibilidades dominantes

### Volumen logístico, con wellness base y renta completa

| Paquetes/día/punto | EBITDA caja mensual | EBITDA anual |
|---:|---:|---:|
| 30 | 1.736,65 € | 20.839,80 € |
| 50 | 2.087,65 € | 25.051,80 € |
| 60 | 2.243,65 € | 26.923,80 € |

Las diferencias de 1 € respecto a otras tablas se deben al redondeo del margen wellness y V4.

### Ocupación wellness, 18 clases/semana, 6 talleres, logística 30 y renta completa

| Ocupación | Alumnos/clase | Margen wellness | EBITDA caja aprox. |
|---:|---:|---:|---:|
| 40 % | 3,2 | 1.586,59 € | 1.081,95 € |
| 50 % | 4,0 | 1.913,94 € | 1.409,30 € |
| 60 % | 4,8 | 2.241,29 € | 1.736,65 € |
| 70 % | 5,6 | 2.568,64 € | 2.064,00 € |

Esta tabla mantiene el 50/50 puro. Con suelo docente, la sensibilidad de los primeros alumnos recae más en SomaWellness.

### Precio efectivo

Cada euro adicional por asistencia genera aproximadamente **187 €/mes** para el estudio en el caso base (374 asistencias × 50 %). Cada euro menos destruye la misma cantidad. Por ello, descuentos y agregadores deben modelarse por separado; 10,50 € no puede ser un promedio aspiracional.

## 15. Riesgos y mitigaciones

| Riesgo | Prob. | Impacto | Señal temprana | Mitigación | Residual |
|---|---|---|---|---|---|
| 50 paquetes/punto no contratables | Alta | Alto | Oferta de 20–30 o sin garantía | Base a 30; subir a 50 solo con contrato | Medio |
| Un repartidor no cubre dos rutas | Media-alta | Alto | retrasos, >8 h/día, incidencias | piloto cronometrado; rutas secuenciales; sustituto | Medio |
| Profesores rechazan 50/50 | Alta en rampa | Alto | baja respuesta o rotación | suelo 25–30 €, bonus, alquiler por franja | Medio |
| 1 m² insuficiente | Media | Alto | bultos fuera del armario | prueba volumétrica y límite de bultos | Bajo-medio |
| Licencia/aforo/ventilación | Media | Alto | requerimiento técnico/obra | informe previo y condición suspensiva | Bajo si se valida |
| AVS autoriza solo parcialmente | Baja según dato aportado | Crítico | autorización verbal o ambigua | resolución/correo contractual por ambos locales | Bajo-medio |
| Competencia pública barata | Alta | Medio | conversión baja a 10,50 € | nicho, cercanía, grupos pequeños, horarios | Medio |
| Fundador imprescindible | Alta | Medio-alto | tareas >50 h/mes | SOP, reservas automáticas, profesor coordinador | Medio |
| Autónomo/falso autónomo | Media | Alto | exclusividad, horario y control excesivo | revisión laboral; autonomía real; contrato mercantil | Medio |
| Catcher sin matching suficiente | Alta | Medio | pedidos esporádicos | separar margen Amazon/Catcher; no garantizar ingreso | Alto |
| CAPEX ultralean insuficiente | Media | Alto | climatización, ruido o accesibilidad | presupuesto técnico; reserva 3.000–4.000 € | Medio |

## 16. Modelo optimizado recomendado

No abriría dos academias idénticas con 18 clases desde el principio. Haría:

1. **Local ancla:** 60–65 % de las clases, recepción digital central y primera comunidad.
2. **Local satélite:** franjas de profesores residentes y talleres; ampliar clases de marca cuando la preventa lo justifique.
3. **Logística:** 30 paquetes/punto como base; 50 solo tras cuatro semanas reales sin fallos.
4. **Profesores:** alquiler fijo por franja para quien aporta su comunidad; mínimo + bonus para clases de SomaWellness.
5. **Oferta:** membresía de 4 y 8 sesiones, bono flexible y drop-in; reconciliar socios, ARPU y asistencias para no duplicar ventas.
6. **Operación:** paquetes fuera de sala antes de las 14:00; primera clase a partir de las 17:00; limpieza y ventilación intermedia.
7. **Control:** dashboard semanal de asistencias, ocupación por franja, altas, bajas, CAC, ingreso/asistencia, pago docente/clase, paquetes/punto, minutos/entrega, incidencias y margen por ruta.

### Umbrales de escalado

| Decisión | Umbral |
|---|---|
| Pasar de 10 a 14 clases/semana | ≥4 alumnos medios en las franjas existentes durante 4 semanas |
| Pasar de 14 a 18 | ≥55 % ocupación y lista de espera o rechazo de demanda |
| Mantener una clase | ≥3 asistentes o profesor en alquiler fijo |
| Activar segundo microhub a plena capacidad | ruta piloto con margen positivo y SLA cumplido 4 semanas |
| Modelar 50 paquetes/punto | contrato/oferta escrita + prueba de espacio y ruta |
| Contratar apoyo operativo | fundador >50 h/mes durante 2 meses o incidencias crecientes |

## 17. Puntuación de inversión

| Dimensión | Peso | Nota | Puntos | Motivo |
|---|---:|---:|---:|---|
| Mercado | 20 | 3,5/5 | 14 | Precio plausible y oferta local, pero competencia privada y pública relevante. |
| Ubicación/local | 15 | 3,3/5 | 10 | Dos áreas y renta baja; falta validar recorrido, estado técnico y demanda micro-local. |
| Unit economics | 20 | 4,0/5 | 16 | Contribución alta y break-even bajo; 50/50 docente débil en rampa. |
| Rentabilidad/caja | 20 | 3,5/5 | 14 | Payback 6 meses en caja, 13 meses ajustado; CAPEX ultralean puede crecer. |
| Riesgo | 15 | 2,7/5 | 8 | Contratos, licencia y capacidad del autónomo aún dominan la decisión. |
| Resiliencia/escalabilidad | 10 | 5,0/5 | 10 | Dos ingresos, costes variables y multiplexación temporal; dependencia del fundador. |
| **Total** | **100** | | **72/100** | **Potencial atractivo, todavía condicionado.** |

La nota previa de 8,7/10 no es defendible antes de cerrar los contratos y el piloto. Tras validarlos y conseguir preventa, el proyecto podría subir a 82–86/100.

## 18. Datos que faltan por validar

### Críticos

- Autorización AVS documental para las dos actividades y los dos locales.
- Certificado técnico de actividad, aforo y zona logística segregada.
- Oferta/contrato Amazon por cada dirección y desglose separado de Catcher.
- Distancia y tiempo reales entre locales y rutas; capacidad diaria de un autónomo.
- Volumen de paquete de una jornada pico dentro de 1 m² por local.

### Importantes

- Presupuestos reales de profesor: fijo, mínimo, revenue-share y alquiler por franja.
- Distribución del OPEX de 650 € con presupuestos de suministros, limpieza, seguros y software.
- Preventa por local y por franja; no solo interés general.
- IVA y forma jurídica aplicables a cada línea; compatibilidad de facturación.
- Cuota RETA/gestoría y horas reales de gestión del fundador.

### Secundarios

- Material adicional, decoración y equipamiento de talleres.
- Upsell de terapias, retiros o contenido digital; se excluye hasta validarlo.
- Expansión por alquiler de sala; no se incorpora al caso base.

## 19. Plan de validación de 30 días

1. **Días 1–5:** obtener documentos AVS y visita técnica; límite: no invertir si la adaptación supera 4.000 € por encima del CAPEX físico.
2. **Días 1–10:** solicitud Amazon/Catcher por ambas direcciones; registrar volumen, tarifa, SLA, radio y delegación.
3. **Días 6–15:** prueba con 20–30 bultos ficticios/reales por local y recorrido cronometrado de un solo autónomo.
4. **Días 8–20:** contratar 4–6 profesores candidatos y comparar alquiler fijo, mínimo + bonus y 50/50.
5. **Días 10–25:** landing y preventa reembolsable; objetivo ≥25 socios equivalentes y ≥40 leads cualificados.
6. **Días 21–30:** dos clases piloto en cada barrio; objetivo ≥50 % de asistencia sobre reserva y ≥30 % de conversión a bono/membresía.
7. **Día 30:** recalcular V5 con datos reales y decidir abrir uno o dos locales.

## 20. Recomendación final

El proyecto merece pasar a validación contractual y piloto. No merece todavía una aprobación irrevocable de dos locales.

El caso de caja aportado es potente:

> **7.521 € de capital · EBITDA caja de 23.958 € en año 1 y 28.566 € en año 2 · payback 6,08 meses con rampa 30→50.**

La cifra adecuada para decidir con disciplina es más modesta:

> **10.750 € disponibles · 30 paquetes/punto como base hasta demostrar 50 · suelo docente de 30 €/clase · coste económico del fundador de 800 €/mes · 23.659 € de beneficio económico acumulado en 24 meses · payback aproximado en el mes 13,3.**

La verdad operativa es sencilla: la bonificación AVS hace que el alquiler deje de ser el problema. El proyecto vive o muere por tres variables: **contrato logístico real, profesores sostenibles y adquisición de 75–94 socios equivalentes para sostener el 60 % de ocupación**.

## Fuentes

| Fuente | Dato utilizado | Consulta | Fiabilidad/limitación |
|---|---|---|---|
| [Comunidad de Madrid — Locales AVS](https://www.comunidad.madrid/vivienda/locales-agencia-vivienda-social) | Carencia y escalado 0/25/50/75/100 %; actividad complementaria | 10/09/2026 | Oficial; la web no sustituye el contrato individual. |
| [Sede Comunidad de Madrid — Locales para emprendedores](https://sede.comunidad.madrid/prestacion-social/locales-emprendedores) | Trámite permanente, solvencia y documentación | 10/09/2026 | Oficial; contenido orientativo y no vinculante. |
| [Amazon España — Hub Delivery](https://www.aboutamazon.es/noticias/apoyo-a-las-pymes/amazon-y-el-pequeno-comercio-trabajando-de-la-mano-para-entregar-pedidos-a-sus-clientes) | 20–30 paquetes/día/comercio; radio urbano de 400 m; reparto a domicilio | 10/09/2026 | Fuente corporativa de 2024; no garantiza condiciones actuales ni del local. |
| [Amazon Logistics — Hub Delivery](https://logistics.amazon.es/hubdelivery) | No es punto de recogida; el comercio realiza entregas | 10/09/2026 | Oficial; condiciones finales dependen del alta/contrato. |
| [Catcher — FAQ](https://catcher.delivery/preguntas-frecuentes/) | Matching, precio configurado y ausencia de asignación garantizada | 10/09/2026 | Fuente corporativa; no acredita volumen local. |
| [Fisioterapia Ciudad Lineal — tarifas](https://fisioterapiaciudadlineal.com/tarifas/) | Clase colectiva 17 €; grupos de 8; mensualidades 48–118 € | 10/09/2026 | Precio anunciado, no ventas realizadas. |
| [El Árbol de la Vida — tarifas](https://elarboldelavidacytn.webnode.es/clases-/tarifas/) | Clase suelta 12 € en 28027 | 10/09/2026 | Precio anunciado; vigencia a confirmar. |
| [Ayuntamiento de Madrid — talleres Ciudad Lineal 2025/26](https://www.madrid.es/UnidadesDescentralizadas/DistritoCiudadLineal/PROGRAMACIONCULTURAL/Talleres/2025-2026/TalleresCiudadLineal2025-2026.pdf) | Competencia pública y cuotas trimestrales | 10/09/2026 | Oficial; programa 2025/26, útil como referencia de presión de precio. |

---

**Nota metodológica:** este documento es un análisis empresarial preliminar. No confirma licencias, compatibilidad urbanística, encaje fiscal, laboral o contractual. Las cifras V4 de logística se conservan como datos aportados y deben reconciliarse con ofertas y contratos antes de invertir.
