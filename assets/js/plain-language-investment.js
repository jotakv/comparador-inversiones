import{appUrl,euro,pct,load,mount}from'./common.js';
import{model}from'./finance.js';

const slug=document.body.dataset.simpleInvestment;
const[registry,assumptions,catalog]=await Promise.all([load('data/plain-language-investments.json'),load('data/model-assumptions.json'),load('data/investments.json')]);
const item=registry.investments.find(entry=>entry.slug===slug);
if(!item)throw new Error(`No existe la explicación ${slug}`);
const assumption=item.modelId?assumptions[item.modelId]:null;
const meta=item.modelId?catalog.investments.find(entry=>entry.id===item.modelId):null;
const scenarios=assumption?Object.fromEntries(['pessimistic','base','optimistic'].map(key=>[key,model(assumption,key)])):null;
const base=scenarios?.base;
const labels={pessimistic:'Si va peor',base:'Referencia central',optimistic:'Si va mejor'};
const statusTone=status=>status==='CONFIRMADO'?'ok':status==='PENDIENTE'?'danger':'warn';
const list=values=>`<ul>${values.map(value=>`<li>${value}</li>`).join('')}</ul>`;
const months=years=>Number.isFinite(years)?`${Math.floor(years)} años y ${Math.round((years%1)*12)} meses`:'más de 10 años o no recuperado en el periodo';
const quick=base?[
  ['DINERO NECESARIO',euro(base.projectCost),'Coste total central; puede incluir desembolso futuro'],
  ['QUÉ COMPRAMOS',meta.assetName,'El segundo espacio, si existe, se alquila'],
  ['CÓMO GENERA DINERO',item.income,'Previsión, no garantía'],
  ['DEUDA',assumption.financing?.debt?euro(assumption.financing.debt):'No en el modelo','Confirmar financiación real'],
  ['TRABAJO DEL PROPIETARIO',item.effort,'No equivale a ausencia de gestión'],
  ['TIEMPO PARA RECUPERAR',base.payback?months(base.payback):'No se recupera en 10 años','Cálculo si se cumplen las hipótesis'],
  ['PRINCIPAL VENTAJA',item.advantage,''],['PRINCIPAL RIESGO',item.risk,'']
]:[['DINERO NECESARIO','No disponible','Pendiente'],['QUÉ COMPRAMOS','No documentado','Pendiente'],['CÓMO GENERA DINERO','No documentado','Pendiente'],['DEUDA','No disponible','Pendiente'],['TRABAJO DEL PROPIETARIO',item.effort,''],['TIEMPO PARA RECUPERAR','No calculable','Sin modelo'],['PRINCIPAL VENTAJA',item.advantage,''],['PRINCIPAL RIESGO',item.risk,'']];
const scenarioCards=scenarios?Object.entries(scenarios).map(([key,result])=>`<article class="scenario-card"><h3>${labels[key]}</h3><p><b>Dinero que queda en el primer año:</b> ${euro(result.years[1].ebitda)}</p><p><b>Tiempo estimado para recuperar:</b> ${result.payback?months(result.payback):'más de 10 años'}</p><p><b>Valor estimado del inmueble en el año 10:</b> ${euro(result.residual)}</p><small>${key==='base'?'Es el caso usado para comparar; no está garantizado.':key==='pessimistic'?'Supone menos ingresos, mayores costes o una evolución más débil según el modelo.':'Es una posibilidad favorable, no una promesa.'}</small></article>`).join(''):'<div class="notice"><b>No hay escenarios.</b> Sin datos de compra, ingresos y gastos no sería honesto fabricar un caso desfavorable, central o favorable.</div>';
const annual=base?.years[1];
const ten=base?.years[10];
const hundred=base&&base.projectCost?annual.ebitda/base.projectCost*100:null;

document.querySelector('#simple-investment').innerHTML=`
<header><div class="top hero"><div class="eyebrow">Inversión explicada de forma sencilla</div><h1>${item.name}</h1><p class="lead">${item.summary}</p></div></header>
<main class="simple-detail">
  <nav class="simple-breadcrumb" aria-label="Navegación de la inversión"><a href="${appUrl('entender-inversiones.html')}">Todas las explicaciones</a><a href="${appUrl('compare.html')}">Comparar inversiones</a>${item.modelId?`<a href="${appUrl(`inversiones/${item.modelId==='talavera-reparto-delegado'?'talavera-reparto-delegado':item.modelId==='el-ejido-outsourced-last-mile'?'el-ejido-delegado':item.modelId==='madrid-last-mile-agency'?'madrid-last-mile-agency':item.modelId==='madrid-avs-hybrid-barber-logistics'?'madrid-avs-hybrid-barber-logistics':item.modelId==='madrid-avs-hybrid-wellness-logistics'?'madrid-avs-hybrid-wellness-logistics':'aguilas'}.html`)}">Modelo financiero</a>`:''}<a href="${appUrl('fuentes.html')}">Documentación</a></nav>
  ${!item.modelId?'<div class="notice danger"><b>No hay datos suficientes para analizar esta alternativa.</b> Esta ausencia se muestra expresamente para no trasladar a Castellón cifras de otra inversión.</div>':''}
  <section aria-labelledby="quick"><h2 id="quick">Ficha rápida</h2><div class="quick-grid">${quick.map(([label,value,note])=>`<article><span>${label}</span><strong>${value}</strong>${note?`<small>${note}</small>`:''}</article>`).join('')}</div></section>
  <section aria-labelledby="one"><h2 id="one">En una frase: ¿qué estamos haciendo aquí?</h2><p class="plain-callout">${item.summary}</p></section>
  <section class="simple-columns" aria-label="Compra y dinero inicial"><article><h2>¿Qué estás comprando exactamente?</h2><p>${item.ownership}</p><p>Lo que seguirá siendo tuyo es únicamente lo descrito como comprado; los espacios alquilados y los contratos de actividad no son inmuebles en propiedad.</p></article><article><h2>¿Cuánto dinero hay que poner?</h2>${base?`<div class="money-lines"><span>Precio o entrada inicial <b>${euro(base.entryCost)}</b></span>${base.futureCapex?`<span>Inversión futura condicionada <b>${euro(base.futureCapex)}</b></span>`:''}<span class="total">Dinero total central <b>${euro(base.projectCost)}</b></span></div><p>Es una estimación del modelo. Los costes excluidos o pendientes pueden aumentar esta cantidad.</p>`:'<p><b>No disponible.</b> Todavía no sabemos cuánto costaría. Antes de invertir habría que identificar la operación y obtener precios y presupuestos reales.</p>'}</article></section>
  <section aria-labelledby="flow"><h2 id="flow">¿Cómo se supone que genera dinero?</h2><div class="flow-steps">${item.steps.map((step,index)=>`<div><span>${index+1}</span><p>${step}</p></div>`).join('')}</div></section>
  <section class="simple-columns" aria-label="Entradas y salidas"><article class="money-in"><h2>Dinero que entra</h2>${list(item.moneyIn)}</article><article class="money-out"><h2>Dinero que sale</h2>${list(item.moneyOut)}<p><b>Dinero que queda = lo que entra − lo que sale.</b></p></article></section>
  ${annual?`<section aria-labelledby="figures"><h2 id="figures">Las cifras, sin jerga</h2><p>En el escenario central, el primer año entra ${euro(annual.income)} y se estiman ${euro(annual.opex)} de gastos. Antes de impuestos y sin contar la compra, quedarían ${euro(annual.ebitda)}.</p><div class="plain-metrics"><article><span>Rentabilidad sobre el dinero invertido (ROI), acumulada a 10 años</span><strong>${pct(base.roi)}</strong><small>Compara todo lo recuperado durante diez años con el coste total; no es lo ganado cada año.</small></article><article><span>Tiempo aproximado para recuperar el dinero</span><strong>${base.payback?months(base.payback):'Más de 10 años'}</strong><small>Supone que se dedica todo el dinero generado a compensar el desembolso inicial.</small></article><article><span>Rentabilidad anual equivalente (TIR)</span><strong>${pct(base.irr)}</strong><small>Permite comparar cobros en momentos distintos. No significa que se gane exactamente ese porcentaje cada año.</small></article></div>${Number.isFinite(hundred)?`<p class="hundred-example"><b>Ejemplo con 100 €:</b> si toda la inversión costara 100 € y el primer año se comportara proporcionalmente como este escenario, quedarían aproximadamente ${hundred.toLocaleString('es-ES',{maximumFractionDigits:1})} € antes de impuestos. Es una escala para entender la proporción, no una participación real ni una promesa.</p>`:''}</section>`:''}
  <section aria-labelledby="scenarios"><h2 id="scenarios">Tres formas de ver la incertidumbre</h2><div class="scenario-grid">${scenarioCards}</div></section>
  <section aria-labelledby="ten"><h2 id="ten">¿Qué tendríamos después de 10 años?</h2>${ten?`<div class="wealth-equation"><span>Dinero acumulado<br><b>${euro(ten.cumulative)}</b></span><i>+</i><span>Valor estimado del inmueble<br><b>${euro(ten.asset)}</b></span><i>−</i><span>Deuda pendiente<br><b>${euro(ten.debt||0)}</b></span><i>=</i><span>Patrimonio estimado<br><b>${euro(ten.cumulative+ten.asset-(ten.debt||0))}</b></span></div><p>El valor del inmueble es una estimación, no una tasación ni un precio de venta garantizado. Para convertirlo en dinero habría que vender y asumir los costes correspondientes.</p>`:'<p>No puede calcularse. No sabemos qué bien quedaría, cuánto dinero generaría ni si existiría deuda.</p>'}</section>
  <section aria-labelledby="work"><h2 id="work">¿Cuánto trabajo requiere?</h2><p class="effort"><b>${item.effort}</b></p>${list(item.work)}</section>
  <section class="simple-columns" aria-label="Qué puede ir bien o mal"><article><h2>Qué tendría que pasar para que funcione bien</h2>${list(item.success)}</article><article><h2>Qué puede hacer que ganemos menos</h2>${list(item.failure)}</article></section>
  <section class="simple-columns thesis" aria-label="Argumentos a favor y en contra"><article><h2>¿Por qué tendría sentido invertir aquí?</h2><p>${item.thesisFor}</p></article><article><h2>¿Por qué podría no tener sentido?</h2><p>${item.thesisAgainst}</p></article></section>
  <section aria-labelledby="known"><h2 id="known">Qué sabemos y qué no sabemos todavía</h2><div class="data-states">${item.dataStates.map(([name,value,status])=>`<article><span class="state ${statusTone(status)}">${status}</span><b>${name}</b><p>${value}</p></article>`).join('')}</div></section>
  <section aria-labelledby="words"><h2 id="words">Palabras que usamos en esta página</h2><dl class="mini-glossary">${item.glossary.map(([word,meaning])=>`<div><dt>${word}</dt><dd>${meaning}</dd></div>`).join('')}</dl></section>
  <nav class="simple-bottom-nav" aria-label="Siguientes pasos"><a href="${appUrl('entender-inversiones.html')}">← Volver a las explicaciones</a><a href="${appUrl('compare.html')}">Comparar inversiones →</a></nav>
</main><footer></footer>`;
mount();
