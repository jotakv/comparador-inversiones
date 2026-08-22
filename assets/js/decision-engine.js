import{model,normalize,weightedScore,rankingConfidence,expectedValue,cagr,breakEvenRevenue}from'./finance.js';

export const profiles={
 equilibrado:{return:20,risk:20,cash:15,wealth:15,liquidity:10,passivity:10,capital:5,scalability:5},
 conservador:{return:15,risk:30,wealth:20,liquidity:20,passivity:15},
 rentista:{cash:35,return:20,risk:15,passivity:15,liquidity:10,capital:5},
 patrimonial:{wealth:40,risk:20,return:15,liquidity:10,passivity:10,capital:5},
 emprendedor:{return:30,cash:20,scalability:25,capital:10,risk:5,liquidity:5,passivity:5},
 barbell:{risk:30,wealth:20,return:20,liquidity:15,scalability:15}
};

const hours={aguilas:8,reus:9,l3h2:24,campers:30,tinamus:10};
const probabilityLoss={aguilas:.25,reus:.16,l3h2:.23,campers:.31,tinamus:.29};
export function buildDecisionSet(catalog,assumptions,profile='equilibrado',hourValue=20){
 const rows=catalog.investments.filter(x=>x.id!=='local').map(i=>{const base=model(assumptions[i.id]),bear=model(assumptions[i.id],'pessimistic'),bull=model(assumptions[i.id],'optimistic');const equity=Math.min(catalog.capital,base.projectCost);const cash10=base.years.slice(1).reduce((s,y)=>s+Math.max(0,y.flow),0);const terminalWealth=cash10+base.residual;return{...i,base,bear,bull,equity,debt:Math.max(0,base.projectCost-equity),cash10,terminalWealth,hours:hours[i.id],probabilityLoss:probabilityLoss[i.id],adjustedAnnual:base.years[1].ebitda-hours[i.id]*12*hourValue,expectedNpv:expectedValue([bear.npv,base.npv,bull.npv],[.25,.5,.25]),capitalAtRisk:Math.max(0,equity-(bear.residual+Math.max(0,bear.years.slice(1).reduce((s,y)=>s+y.flow,0)))),wealthCagr:cagr(equity,terminalWealth,10),breakEven:breakEvenRevenue(base.settings.opex),criticalVariable:criticalVariable(i.id),confidence:dataConfidence(i.id)}});
 const ranges=key=>[Math.min(...rows.map(r=>key(r))),Math.max(...rows.map(r=>key(r)))];
 const rr=ranges(r=>r.base.irr),cash=ranges(r=>r.cash10),wealth=ranges(r=>r.terminalWealth),capital=ranges(r=>r.base.projectCost),risk=ranges(r=>r.risk),liq=ranges(r=>r.liquidity),pass=ranges(r=>r.passivity),scale=ranges(r=>r.scalability);
 rows.forEach(r=>{r.scores={return:normalize(r.base.irr,...rr),risk:normalize(r.risk,...risk,{inverse:true}),cash:normalize(r.cash10,...cash),wealth:normalize(r.terminalWealth,...wealth),liquidity:normalize(r.liquidity,...liq),passivity:normalize(r.passivity,...pass),capital:normalize(r.base.projectCost,...capital,{inverse:true}),scalability:normalize(r.scalability,...scale)};r.score=weightedScore(r.scores,profiles[profile]||profiles.equilibrado);r.riskAdjusted=weightedScore({return:r.scores.return,downside:normalize(r.capitalAtRisk,0,catalog.capital,{inverse:true}),loss:normalize(r.probabilityLoss,0,.5,{inverse:true}),capital:r.scores.capital,liquidity:r.scores.liquidity},{return:30,downside:20,loss:20,capital:15,liquidity:15})});
 rows.sort((a,b)=>b.score-a.score);return{rows,confidence:rankingConfidence(rows[0].score,rows[1].score),profile,weights:profiles[profile]||profiles.equilibrado};
}
export function criticalVariable(id){return({aguilas:'valor post-conversión',reus:'ocupación',l3h2:'días alquilados / ocupación',campers:'ADR × ocupación',tinamus:'valor post-cambio y reforma'})[id]}
export function dataConfidence(id){return({aguilas:.4,reus:.6,l3h2:.6,campers:.4,tinamus:.4})[id]}
export function dominance(rows,a,b){const good=['base.irr','terminalWealth','liquidity','passivity'],bad=['risk','base.projectCost','hours'];const get=(o,p)=>p.split('.').reduce((x,k)=>x[k],o);return good.every(k=>get(a,k)<=get(b,k))&&bad.every(k=>get(a,k)>=get(b,k))&&(good.some(k=>get(a,k)<get(b,k))||bad.some(k=>get(a,k)>get(b,k)))}
export function regret(rows){const scenarios=['bear','base','bull'];const matrix=rows.map(r=>({id:r.id,name:r.name,regrets:scenarios.map(s=>Math.max(...rows.map(x=>x[s].npv))-r[s].npv)}));matrix.forEach(x=>x.max=Math.max(...x.regrets));return{matrix,minimax:[...matrix].sort((a,b)=>a.max-b.max)[0]}}
