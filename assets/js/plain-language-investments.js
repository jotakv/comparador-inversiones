import{appUrl,euro,load,mount}from'./common.js';
import{model}from'./finance.js';

const[registry,assumptions]=await Promise.all([load('data/plain-language-investments.json'),load('data/model-assumptions.json')]);
mount();

const cards=registry.investments.map(item=>{
  const result=item.modelId&&assumptions[item.modelId]?model(assumptions[item.modelId]):null;
  const amount=item.projectCostText||(result?euro(result.projectCost):'No disponible');
  return`<article class="simple-card">
    <div class="simple-card-head"><span class="tag">${item.modelId||item.projectCostText?'MODELO DISPONIBLE':'DATOS PENDIENTES'}</span><h3>${item.name}</h3></div>
    <p>${item.summary}</p>
    <dl class="quick-list">
      <div><dt>Dinero aproximado</dt><dd>${amount}${result||item.projectCostText?'<small> coste total del proyecto central</small>':''}</dd></div>
      <div><dt>Cómo entra dinero</dt><dd>${item.income}</dd></div>
      <div><dt>Trabajo del propietario</dt><dd>${item.effort}</dd></div>
      <div><dt>Principal ventaja</dt><dd>${item.advantage}</dd></div>
      <div><dt>Principal riesgo</dt><dd>${item.risk}</dd></div>
    </dl>
    <a class="simple-cta" href="${appUrl(item.page)}">Entender ${item.name}<span aria-hidden="true"> →</span></a>
  </article>`;
}).join('');
document.querySelector('#simple-index').innerHTML=cards;
