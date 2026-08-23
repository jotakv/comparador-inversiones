import{appUrl,euro,load,mount,pct,table}from'./common.js';
import{allocateCapital,benchmarkRows,projectScenario,scoreAlternatives,scoreFormula}from'./alternative-engine.js';

const[data,catalog,assumptions]=await Promise.all([
  load('data/alternative-investments.json'),
  load('data/investments.json'),
  load('data/model-assumptions.json')
]);
mount();
const rows=scoreAlternatives(data);
const benchmarks=benchmarkRows(catalog,assumptions,data);
let selectedId=rows[0].id;

const sepeClass=rating=>rating==='Alta'?'ok':rating==='Condicionada'?'warn':'danger';
const sepeTag=rating=>`<span class="tag ${sepeClass(rating)}">${rating}</span>`;
const months=value=>value===null?'No recupera ≤5A':`${value.toFixed(1)} meses`;
const intensityRank={baja:1,media:2,alta:3};
const annualized=row=>Number.isFinite(row.annualizedEconomicReturn)?row.annualizedEconomicReturn:-.1;
const maxBy=(items,key)=>[...items].sort((a,b)=>key(b)-key(a))[0];
const minBy=(items,key)=>[...items].sort((a,b)=>key(a)-key(b))[0];
const categories=[...new Set(rows.map(row=>row.category))].sort();
const scoreLabels={profitability:'Rentabilidad potencial',sepeFit:'Compatibilidad SEPE',cashSpeed:'Velocidad de caja',risk:'Riesgo',scalability:'Escalabilidad',defensibility:'Barrera/defensibilidad',residual:'Valor residual',automation:'Automatización',liquidity:'Liquidez',founderFit:'Encaje con capacidades'};
const riskLabels={commercial:'Comercial',financial:'Financiero',technological:'Tecnológico',regulatory:'Regulatorio',operational:'Operacional',demand:'Demanda',liquidity:'Liquidez'};

document.querySelector('#capital-warning').innerHTML=`<b>Tres bolsas separadas:</b> ${euro(data.capital.sepe)} de pago único SEPE · ${euro(data.capital.indemnification)} de indemnización · ${euro(data.capital.savings)} de ahorro · ${euro(data.capital.externalFinance)} de financiación externa. Total disponible: <b>${euro(data.capital.totalAvailable)}</b>. Los 17.000 € propios son flexibles; los 28.000 € SEPE deben coincidir con la memoria y justificarse. La clasificación SEPE <b>no confirma que cada factura sea elegible</b>.`;

function renderKpis(){
  const bestReturn=maxBy(rows,row=>row.annualizedEconomicReturn);
  const fastest=minBy(rows,row=>row.base.paybackMonths??999);
  const efficient=maxBy(rows,row=>row.capitalEfficiencyScore);
  const bestSepe=rows.find(row=>row.sepe.rating==='Alta');
  document.querySelector('#alternative-kpis').innerHTML=[
    ['Capital analizado',euro(data.capital.totalAvailable),'28k SEPE + 17k propios'],
    ['Oportunidades',rows.length,`${data.universe.length} evaluadas`],
    ['Mejor retorno económico A5',pct(bestReturn.annualizedEconomicReturn),bestReturn.shortName],
    ['Menor payback',months(fastest.base.paybackMonths),fastest.shortName],
    ['Mejor Capital Efficiency',efficient.capitalEfficiencyScore.toFixed(0)+'/100',efficient.shortName],
    ['Mejor SEPE Fit',bestSepe.shortName,'Alta compatibilidad aparente']
  ].map(([label,value,note])=>`<article class="card"><span class="label">${label}</span><div class="kpi">${value}</div><small>${note}</small></article>`).join('');
}

function renderCapitalStrategies(){
  document.querySelector('#capital-strategies').innerHTML=data.capitalStrategies.map(strategy=>{
    const row=rows.find(item=>item.id===strategy.alternativeId);
    const funding=allocateCapital(strategy.committed,data.capital);
    return`<article class="card wide"><span class="tag ${strategy.verdict==='Recomendada'?'ok':'warn'}">${strategy.verdict}</span><h3>${strategy.name}</h3><p><b>${row.shortName}</b> · compromiso ${euro(strategy.committed)} · capital no comprometido ${euro(strategy.reserve)}</p><p>${strategy.thesis}</p><small>Aplicación teórica: SEPE ${euro(funding.sepe)} · indemnización ${euro(funding.indemnification)} · ahorro ${euro(funding.savings)}.</small></article>`;
  }).join('');
}

function renderTopPicks(){
  const easiest=minBy(rows,row=>row.riskAverage+intensityRank[row.operatingIntensity]*1.25+row.timeToFirstRevenueMonths/4+(100-row.rubric.founderFit)/20);
  const picks=[
    ['Mejor retorno económico',maxBy(rows,row=>annualized(row))],
    ['Mejor riesgo/retorno',rows[0]],
    ['Más fácil de ejecutar',easiest],
    ['Más automatizable',maxBy(rows,row=>row.automationPct)],
    ['Mayor caja A3',maxBy(rows,row=>row.base.years[3].ownerCash)],
    ['Mayor residual',maxBy(rows,row=>row.base.years[5].residual)],
    ['Mejor encaje SEPE',maxBy(rows,row=>row.scoreInputs.sepeFit+row.score/100)],
    ['Mayor capacidad de escalar',maxBy(rows,row=>row.rubric.scalability)],
    ['Mejor con 45.000 € disponibles',rows[0]],
    ['Mejor frente a inmobiliario',maxBy(rows,row=>row.score*.7+row.scoreInputs.cashSpeed*.3)]
  ];
  document.querySelector('#top-picks').innerHTML=picks.map(([label,row])=>`<article class="card alternative-pick" data-select="${row.id}" tabindex="0"><span class="label">${label}</span><h3>${row.shortName}</h3><b>${row.score.toFixed(1)}/100</b> · ${sepeTag(row.sepe.rating)}</article>`).join('');
}

const filterDefinitions=[
  ['capital','Capital máximo',[['45000','45.000 €'],['40000','40.000 €'],['30000','30.000 €'],['28000','28.000 €'],['20000','20.000 €']]],
  ['roi','ROI total A5 mínimo',[['-999','Todos'],['0','0 %'],['50','50 %'],['100','100 %']]],
  ['payback','Payback máximo',[['999','Todos'],['18','18 meses'],['24','24 meses'],['36','36 meses']]],
  ['risk','Riesgo máximo',[['10','Todos'],['6','≤ 6/10'],['5','≤ 5/10'],['4','≤ 4/10']]],
  ['sepe','SEPE Fit',[['all','Todos'],['Alta','Alta'],['Condicionada','Condicionada'],['Dudosa','Dudosa']]],
  ['category','Tipo de negocio',[['all','Todos'],...categories.map(category=>[category,category])]],
  ['medium','Físico/digital',[['all','Todos'],['Físico','Físico'],['Digital','Digital'],['Híbrido','Híbrido']]],
  ['intensity','Esfuerzo operativo',[['all','Todos'],['baja','Baja'],['media','Media'],['alta','Alta']]],
  ['residual','Residual mínimo',[['0','Todos'],['25','≥ 25 % capital'],['40','≥ 40 % capital']]],
  ['scale','Escalabilidad mínima',[['0','Todos'],['70','≥ 70/100'],['80','≥ 80/100']]]
];
document.querySelector('#alternative-filters').innerHTML=filterDefinitions.map(([id,label,options])=>`<label>${label}<select id="filter-${id}">${options.map(([value,text])=>`<option value="${value}">${text}</option>`).join('')}</select></label>`).join('')+`<label>Acciones<button id="reset-alternative-filters" type="button">Restablecer</button></label>`;

function filteredRows(){
  const value=id=>document.querySelector(`#filter-${id}`).value;
  return rows.filter(row=>row.initialInvestment<=+value('capital')&&
    row.base.roi5.total*100>=+value('roi')&&
    (row.base.paybackMonths??999)<=+value('payback')&&
    row.riskAverage<=+value('risk')&&
    (value('sepe')==='all'||row.sepe.rating===value('sepe'))&&
    (value('category')==='all'||row.category===value('category'))&&
    (value('medium')==='all'||row.medium===value('medium'))&&
    (value('intensity')==='all'||row.operatingIntensity===value('intensity'))&&
    row.base.years[5].residual/row.initialInvestment*100>=+value('residual')&&
    row.rubric.scalability>=+value('scale'));
}

function renderRanking(){
  const filtered=filteredRows();
  document.querySelector('#filter-summary').textContent=`${filtered.length} de ${rows.length} finalistas visibles. Score original conservado para evitar que el filtro cambie la metodología.`;
  document.querySelector('#alternative-ranking').innerHTML=filtered.length?table(filtered,[
    ['Rank',row=>rows.indexOf(row)+1],
    ['Oportunidad',row=>`<button class="link-button" data-select="${row.id}">${row.shortName}</button>${row.efficient?'<small class="frontier-mark">FRONTERA</small>':''}`],
    ['Capital',row=>euro(row.initialInvestment)],
    ['Caja A3',row=>euro(row.base.years[3].ownerCash)],
    ['FCF eco. A3',row=>euro(row.base.years[3].economicFcf)],
    ['TIR eco. A5',row=>pct(row.base.economicIrr5)],
    ['ROI A5',row=>pct(row.base.roi5.total)],
    ['Payback',row=>months(row.base.paybackMonths)],
    ['Riesgo',row=>row.riskAverage.toFixed(1)+'/10'],
    ['Residual',row=>euro(row.base.years[5].residual)],
    ['SEPE Fit',row=>sepeTag(row.sepe.rating)],
    ['Capital Eff.',row=>row.capitalEfficiencyScore.toFixed(0)],
    ['Score',row=>`<b>${row.score.toFixed(1)}</b>`]
  ]):'<div class="notice">Ninguna alternativa cumple todos los filtros. Amplía al menos un límite.</div>';
}

function scatterSvg(items,{quadrant=false}={}){
  const width=660,height=330,left=58,bottom=285,plotWidth=570,plotHeight=245;
  const yValues=items.map(row=>annualized(row));
  const minY=Math.min(0,...yValues),maxY=Math.max(...yValues,.01),span=maxY-minY||1;
  const color={Alta:'#087a55',Condicionada:'#a15c00',Dudosa:'#b42318'};
  const point=row=>{
    const xValue=quadrant?row.unconventionality:row.riskAverage;
    const x=left+(quadrant?xValue/10:(xValue-1)/9)*plotWidth;
    const yValue=annualized(row);
    const y=bottom-(yValue-minY)/span*plotHeight;
    const radius=7+Math.sqrt(row.initialInvestment)/35;
    return`<circle cx="${x}" cy="${y}" r="${radius}" fill="${color[row.sepe.rating]}" opacity=".78" stroke="${row.efficient&&!quadrant?'#10233f':'white'}" stroke-width="${row.efficient&&!quadrant?4:2}"><title>${row.name} · riesgo ${row.riskAverage.toFixed(1)} · retorno ${pct(row.annualizedEconomicReturn)} · ${euro(row.initialInvestment)} · SEPE ${row.sepe.rating}</title></circle><text x="${x-5}" y="${y+4}" font-size="10" font-weight="800" fill="white">${rows.indexOf(row)+1}</text>`;
  };
  const labels=quadrant?`<text x="75" y="55">Alta rentabilidad · convencional</text><text x="390" y="55">Alta rentabilidad · disruptivo</text><text x="75" y="270">Baja rentabilidad · convencional</text><text x="390" y="270">Baja rentabilidad · disruptivo</text>`:'';
  return`<svg class="alternative-scatter" viewBox="0 0 ${width} ${height}" role="img"><line x1="${left}" y1="${bottom}" x2="${left+plotWidth}" y2="${bottom}"/><line x1="${left}" y1="35" x2="${left}" y2="${bottom}"/>${quadrant?`<line class="guide" x1="${left+plotWidth/2}" y1="35" x2="${left+plotWidth/2}" y2="${bottom}"/><line class="guide" x1="${left}" y1="${bottom-(0-minY)/span*plotHeight}" x2="${left+plotWidth}" y2="${bottom-(0-minY)/span*plotHeight}"/>`:''}${labels}${items.map(point).join('')}<text x="280" y="322">${quadrant?'Convencional → disruptivo':'Riesgo →'}</text><text x="8" y="22">Retorno ↑</text></svg>`;
}

function renderCharts(){
  const filtered=filteredRows();
  const legend=`<div class="alternative-legend">${filtered.map(row=>`<span><b>${rows.indexOf(row)+1}.</b> ${row.shortName}</span>`).join('')}</div>`;
  document.querySelector('#efficient-frontier').innerHTML=scatterSvg(filtered)+legend;
  document.querySelector('#disruption-matrix').innerHTML=scatterSvg(filtered,{quadrant:true})+legend;
}

function renderBenchmarks(){
  const alternativeRows=rows.map(row=>({
    id:row.id,name:row.shortName,type:'alternativa',category:row.category,initialInvestment:row.initialInvestment,capitalBeyondSepe:Math.max(0,row.initialInvestment-data.capital.sepe),externalCapitalRequired:Math.max(0,row.initialInvestment-data.capital.totalAvailable),
    annualCash:row.base.years[3].ownerCash,economicFcf:row.base.years[3].economicFcf,irr5:row.base.ownerIrr5,roi5:row.base.roi5.total,
    economicIrr5:row.base.economicIrr5,paybackMonths:row.base.paybackMonths,economicPaybackMonths:row.base.economicPaybackMonths,residualValue:row.base.years[5].residual,riskAverage:row.riskAverage,liquidity:row.rubric.liquidity,
    operatingIntensity:row.operatingIntensity,scalability:row.rubric.scalability,sepe:row.sepe
  }));
  const combined=[...alternativeRows,...benchmarks];
  const realEstate=benchmarks.filter(row=>['aguilas','reus','tinamus'].includes(row.id));
  const beatsRealEstate=alternativeRows.filter(row=>realEstate.every(benchmark=>row.initialInvestment<benchmark.initialInvestment&&row.paybackMonths!==null&&(benchmark.paybackMonths===null||row.paybackMonths<benchmark.paybackMonths)&&row.liquidity>=benchmark.liquidity));
  document.querySelector('#benchmark-verdict').innerHTML=beatsRealEstate.length?`<b>${beatsRealEstate.length} alternativas</b> superan a los tres benchmarks inmobiliarios en capital requerido, payback de caja y liquidez según el modelo: ${beatsRealEstate.map(row=>row.name).join(', ')}. Esto no significa que creen más patrimonio residual.`:'Ninguna alternativa domina simultáneamente a los tres benchmarks inmobiliarios en capital, payback y liquidez.';
  document.querySelector('#benchmark-table').innerHTML=table(combined,[
    ['Modelo',row=>`${row.type==='benchmark'?'<span class="tag">Benchmark repo</span>':'<span class="tag ok">Nueva</span>'} ${row.name}`],
    ['Capital total',row=>euro(row.initialInvestment)],
    ['Capital adicional al SEPE',row=>euro(row.capitalBeyondSepe)],
    ['Financiación externa >45k',row=>euro(row.externalCapitalRequired)],
    ['Caja anual',row=>euro(row.annualCash)],
    ['FCF eco.',row=>euro(row.economicFcf)],
    ['TIR A5',row=>pct(row.irr5)],
    ['TIR eco. A5',row=>pct(row.economicIrr5)],
    ['ROI A5',row=>pct(row.roi5)],
    ['Payback',row=>months(row.paybackMonths)],
    ['Payback eco.',row=>months(row.economicPaybackMonths)],
    ['Residual A5',row=>euro(row.residualValue)],
    ['Riesgo',row=>row.riskAverage.toFixed(1)+'/10'],
    ['Liquidez',row=>row.liquidity+'/100'],
    ['Esfuerzo',row=>row.operatingIntensity],
    ['Escala',row=>row.scalability+'/100'],
    ['SEPE Fit',row=>sepeTag(row.sepe.rating)]
  ]);
}

function lineChart(row){
  const metrics=[['Ingresos','revenue','#2563eb'],['EBITDA','ebitda','#087a55'],['Caja propietario','ownerCash','#a15c00'],['FCF económico','economicFcf','#7555a5']];
  const values=row.base.years.flatMap(year=>metrics.map(([,key])=>year[key]));
  const min=Math.min(0,...values),max=Math.max(...values,1),span=max-min;
  const x=year=>50+year*100,y=value=>260-(value-min)/span*210;
  return`<div class="chart-scroll"><svg class="alternative-line" viewBox="0 0 610 305" role="img"><line x1="50" y1="260" x2="570" y2="260"/><line x1="50" y1="35" x2="50" y2="260"/>${[0,1,2,3,4,5].map(year=>`<text x="${x(year)-8}" y="285">A${year}</text>`).join('')}${metrics.map(([label,key,color])=>`<polyline fill="none" stroke="${color}" stroke-width="3" points="${row.base.years.map(year=>`${x(year.year)},${y(year[key])}`).join(' ')}"><title>${label}</title></polyline>`).join('')}</svg></div><div class="chart-legend">${metrics.map(([label,,color])=>`<span><i style="background:${color}"></i>${label}</span>`).join('')}</div>`;
}

function renderDetail(){
  const row=rows.find(item=>item.id===selectedId)||rows[0];
  const funding=allocateCapital(row.initialInvestment,data.capital);
  const sourceMap=new Map(data.sources.map(source=>[source.id,source]));
  const scenarioRows=[row.conservative,row.base,row.optimistic];
  const scenarioLabel={conservative:'Conservador',base:'Base',optimistic:'Optimista'};
  const stressRows=[
    {name:'Base',model:row.base},
    {name:'Ingresos −30 %',model:projectScenario(row,'base',data.capital.founderHourCost,{revenueFactor:.7})},
    {name:'CAPEX +20 %',model:projectScenario(row,'base',data.capital.founderHourCost,{capexFactor:1.2})},
    {name:'Ambos shocks',model:row.downside}
  ];
  document.querySelector('#alternative-detail').innerHTML=`
    <div class="decision-hero"><div class="eyebrow">#${rows.indexOf(row)+1} · Score ${row.score.toFixed(1)}/100 · Capital Efficiency ${row.capitalEfficiencyScore.toFixed(0)}/100</div><h2>${row.name}</h2><p>${row.concept}</p><div>${sepeTag(row.sepe.rating)} <span class="tag">${row.medium}</span> <span class="tag">${row.client}</span></div></div>
    <div class="grid">${[
      ['Capital',euro(row.initialInvestment)],['Mínimo validación',euro(row.minimumViableCapital)],['Capital ideal',euro(row.idealCapital)],['Primeros ingresos',`${row.timeToFirstRevenueMonths} meses`],
      ['Caja A3',euro(row.base.years[3].ownerCash)],['FCF económico A3',euro(row.base.years[3].economicFcf)],['Payback',months(row.base.paybackMonths)],['Residual A5',euro(row.base.years[5].residual)]
    ].map(([label,value])=>`<article class="card"><span class="label">${label}</span><div class="kpi">${value}</div></article>`).join('')}</div>
    <div class="decision-split"><article><h3>Tesis y cliente</h3><p><b>Oportunidad.</b> ${row.opportunity}</p><p><b>Cliente.</b> ${row.client}</p><p><b>Modelo.</b> ${row.businessModel}</p><p><b>Ingresos.</b> ${row.revenueModels.join(' · ')}</p></article><article><h3>SEPE: ${row.sepe.rating}</h3><p>${row.sepe.summary}</p><p><b>Condición.</b> ${row.sepe.conditional}</p><p><b>No confundir.</b> ${row.sepe.notAutomaticallyEligible}</p></article></div>
    <h3>Escenarios financieros</h3>${table(scenarioRows,[
      ['Escenario',model=>scenarioLabel[model.scenario]],['Ingresos A3',model=>euro(model.years[3].revenue)],['OPEX A3',model=>euro(model.years[3].opex)],['Margen',model=>pct(model.steadyMargin)],['Caja A3',model=>euro(model.years[3].ownerCash)],['FCF eco. A3',model=>euro(model.years[3].economicFcf)],['ROI A1',model=>pct(model.roi1.total)],['ROI A3',model=>pct(model.roi3.total)],['ROI A5',model=>pct(model.roi5.total)],['TIR propietario',model=>pct(model.ownerIrr5)],['TIR económica',model=>pct(model.economicIrr5)],['Payback caja',model=>months(model.paybackMonths)],['Payback económico',model=>months(model.economicPaybackMonths)],['Break-even',model=>euro(model.breakEvenRevenue)]
    ])}
    <h3>Proyección base · Año 0–5</h3>${lineChart(row)}${table(row.base.years,[['Año',year=>year.year],['Ingresos',year=>euro(year.revenue)],['Gastos',year=>euro(year.opex)],['EBITDA',year=>euro(year.ebitda)],['CAPEX',year=>euro(year.maintenanceCapex)],['Caja',year=>euro(year.ownerCash)],['Trabajo imputado',year=>euro(year.founderLabor)],['FCF económico',year=>euro(year.economicFcf)],['Caja acumulada',year=>euro(year.cumulativeOwnerCash)],['Residual',year=>euro(year.residual)],['Valor económico',year=>euro(year.economicWealth)]])}
    <h3>Capital Efficiency y score</h3><div class="grid">${[
      ['Ingresos / capital',row.base.revenueToCapital.toFixed(2)+'×'],['EBITDA / capital',row.base.ebitdaToCapital.toFixed(2)+'×'],['Caja / capital',row.base.fcfToCapital.toFixed(2)+'×'],['FCF eco. / capital',row.base.economicFcfToCapital.toFixed(2)+'×'],['Retorno eco. anualizado',pct(row.annualizedEconomicReturn)],['Capital Efficiency',row.capitalEfficiencyScore.toFixed(0)+'/100']
    ].map(([label,value])=>`<article class="card"><span class="label">${label}</span><div class="kpi">${value}</div></article>`).join('')}</div>${table(Object.entries(row.scoreInputs).map(([criterion,value])=>({criterion,value})),[['Criterio',item=>scoreLabels[item.criterion]],['Input 0–100',item=>item.value.toFixed(1)],['Peso',item=>data.methodology.weights[item.criterion]+' %'],['Contribución',item=>(item.value*data.methodology.weights[item.criterion]/100).toFixed(1)]])}
    <h3>Despliegue de capital</h3>${table(row.budget,[['Partida',item=>item.label],['Tipo',item=>item.type],['Importe',item=>euro(item.amount)],['% capital',item=>pct(item.amount/row.initialInvestment)]])}
    <h3>Fuentes de financiación</h3>${table([
      {source:'Pago único SEPE',amount:funding.sepe,note:'Asignación financiera teórica; elegibilidad partida a partida pendiente.'},
      {source:'Indemnización',amount:funding.indemnification,note:'Fondo propio flexible.'},
      {source:'Ahorro',amount:funding.savings,note:'Fondo propio flexible; preservar si no mejora la validación.'},
      {source:'Capital no comprometido',amount:funding.unused,note:'No se fuerza su gasto. Si pertenece al pago único recibido, no puede quedar sin justificar.'}
    ],[['Fuente',item=>item.source],['Aplicación',item=>euro(item.amount)],['Tratamiento',item=>item.note]])}
    <div class="grid stage-grid">${[['Fase 1 · Validación',row.stages.validation],['Fase 2 · MVP',row.stages.mvp],['Fase 3 · Escala',row.stages.scale],['Capital at Risk antes de validar',row.capitalAtRiskBeforeValidation]].map(([label,value])=>`<article class="card"><span class="label">${label}</span><div class="kpi">${euro(value)}</div></article>`).join('')}</div>
    <h3>Stress test obligatorio</h3>${table(stressRows,[['Caso',item=>item.name],['Inversión',item=>euro(item.model.investment)],['Caja A3',item=>euro(item.model.years[3].ownerCash)],['FCF eco. A3',item=>euro(item.model.years[3].economicFcf)],['ROI A5',item=>pct(item.model.roi5.total)],['Payback',item=>months(item.model.paybackMonths)],['Residual',item=>euro(item.model.years[5].residual)]])}
    <div class="decision-split"><article><h3>Riesgos y cuello de botella</h3><p><b>Principal cuello.</b> ${row.bottleneck}</p><ul>${row.risks.map(risk=>`<li>${risk}</li>`).join('')}</ul>${table(Object.entries(row.risk).map(([category,value])=>({category,value})),[['Categoría',item=>riskLabels[item.category]],['Riesgo',item=>item.value+'/10']])}<p><b>Una persona.</b> ${row.onePerson}</p></article><article><h3>Escala</h3><p><b>50.000 €:</b> ${row.scaling['50000']}</p><p><b>100.000 €:</b> ${row.scaling['100000']}</p><p><b>250.000 €:</b> ${row.scaling['250000']}</p><p><b>Automatización:</b> ${row.automationPct}% · <b>intensidad:</b> ${row.operatingIntensity} · <b>encaje promotor:</b> ${row.rubric.founderFit}/100.</p></article></div>
    <h3>Hechos, supuestos y estimaciones</h3><div class="grid evidence-grid"><article class="card"><h4>HECHOS</h4><ul>${row.sources.map(id=>{const source=sourceMap.get(id);return`<li>${source.supports}</li>`}).join('')}</ul></article><article class="card"><h4>SUPUESTOS</h4><ul><li>Ingresos estables base: ${euro(row.scenarios.base.steadyRevenue)}/año.</li><li>Rampa A1 ${pct(row.scenarios.base.year1Ramp)} y A2 ${pct(row.scenarios.base.year2Ramp)}.</li><li>${row.founderHoursMonth} horas/mes del promotor valoradas a ${euro(data.capital.founderHourCost)}/h.</li><li>Los presupuestos sin fuente pública requieren proforma antes de presentar.</li></ul></article><article class="card"><h4>ESTIMACIONES</h4><ul><li>ROI total A5 ${pct(row.base.roi5.total)}.</li><li>TIR propietario A5 ${pct(row.base.ownerIrr5)}.</li><li>Capital Efficiency ${row.capitalEfficiencyScore.toFixed(0)}/100 relativo.</li><li>Residual recuperable A5 ${euro(row.base.years[5].residual)}.</li></ul></article></div>
    <p class="notice"><b>Auditoría adversa.</b> La demanda no queda demostrada por una tendencia sectorial. Antes de gastar la Fase 3: preventa, proformas, seguro, licencias, prueba de precio y confirmación escrita de las partidas SEPE. El valor residual es una estimación de venta; no es caja hasta realizarla.</p>`;
}

function renderMethod(){
  const methodRows=Object.entries(data.methodology.weights).map(([key,weight])=>({key,weight}));
  const methodTable=table(methodRows,[['Criterio',row=>scoreLabels[row.key]],['Peso',row=>row.weight+' %'],['Base',row=>['profitability','cashSpeed','risk','residual'].includes(row.key)?'Normalización cuantitativa entre finalistas':['sepeFit'].includes(row.key)?'Escala legal declarada':'Rúbrica 0–100 declarada']]);
  document.querySelector('#score-method').innerHTML=`<div class="notice"><b>Fórmula:</b> ${scoreFormula(data)}. Los pesos suman 100 %. El ranking usa FCF económico después del coste imputado del trabajo; no trata el tiempo del promotor como gratis.</div>${methodTable}<ul>${data.methodology.scoreNotes.map(note=>`<li>${note}</li>`).join('')}</ul>`;
  document.querySelector('#universe-table').innerHTML=table(data.universe,[['Modelo',item=>item.name],['Resultado',item=>item.selected?'<span class="tag ok">Finalista</span>':'<span class="tag">Descartada</span>'],['Motivo',item=>item.reason]]);
  document.querySelector('#sepe-framework').innerHTML=data.sepeFramework.map(item=>`<article class="card ${item.kind==='HECHO'?'winner':''}"><span class="label">${item.kind}</span><p>${item.text}</p>${item.source?`<a href="#source-${item.source}">Fuente</a>`:''}</article>`).join('');
  document.querySelector('#alternative-sources').innerHTML=table(data.sources,[['Organismo',source=>source.organization],['Fuente',source=>`<a id="source-${source.id}" href="${source.url}" target="_blank" rel="noopener">${source.title}</a>`],['Consulta',source=>source.consulted],['Dato respaldado',source=>source.supports]]);
}

function renderMoonshots(){document.querySelector('#moonshot-grid').innerHTML=data.moonshots.map(item=>`<article class="card wide"><span class="tag danger">Experimental</span><h3>${item.name}</h3><p><b>Validación:</b> ${euro(item.validationCapital)} · ${sepeTag(item.sepeFit)}</p><p><b>Observable:</b> ${item.observable}</p><p><b>Hipótesis:</b> ${item.hypothesis}</p><p><b>Riesgo:</b> ${item.risk}</p></article>`).join('')}

function selectAlternative(id){selectedId=id;renderDetail();document.querySelector('#detalle').scrollIntoView({behavior:'smooth',block:'start'})}
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-select]');if(trigger)selectAlternative(trigger.dataset.select)});
document.addEventListener('keydown',event=>{const trigger=event.target.closest('[data-select]');if(trigger&&(event.key==='Enter'||event.key===' ')){event.preventDefault();selectAlternative(trigger.dataset.select)}});
document.querySelector('#alternative-filters').addEventListener('change',()=>{renderRanking();renderCharts()});
document.querySelector('#reset-alternative-filters').addEventListener('click',()=>{document.querySelectorAll('#alternative-filters select').forEach(select=>select.selectedIndex=0);renderRanking();renderCharts()});

renderKpis();renderCapitalStrategies();renderTopPicks();renderRanking();renderCharts();renderBenchmarks();renderDetail();renderMoonshots();renderMethod();
