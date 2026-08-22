import{model}from'./finance.js';
export function buildResults(catalog,assumptions,scenario='base'){
  return catalog.investments.filter(i=>i.id!=='local').map(investment=>{
    const metrics=model(assumptions[investment.id],scenario);
    const totalCost=metrics.projectCost+(metrics.settings.delayedCapex||0);
    const cash10=metrics.years[10].cumulative;
    return{...investment,metrics,totalCost,cash10,fundingGap:Math.max(0,totalCost-catalog.capital),capitalRemaining:Math.max(0,catalog.capital-totalCost),financedShare:Math.max(0,totalCost-catalog.capital)/Math.max(totalCost,1),totalWealth:cash10+metrics.residual,efficiency:(cash10+metrics.residual)/catalog.capital,complexity:investment.effort};
  });
}
export function rank(results,key,direction='desc'){
  const value=x=>key.split('.').reduce((v,k)=>v?.[k],x);
  return[...results].sort((a,b)=>{
    const av=value(a),bv=value(b);
    if(!Number.isFinite(av))return Number.isFinite(bv)?1:0;
    if(!Number.isFinite(bv))return-1;
    return(direction==='asc'?1:-1)*(av-bv);
  });
}
export function compare(a,b){
  const defs=[['Capital','totalCost','lower'],['Financiación','fundingGap','lower'],['TIR','metrics.irr','higher'],['ROI','metrics.roi','higher'],['VAN','metrics.npv','higher'],['Payback','metrics.payback','lower'],['Caja A10','cash10','higher'],['Residual','metrics.residual','higher'],['Riesgo','risk','lower'],['Pasividad','passivity','higher'],['Complejidad','complexity','lower']];
  const get=(x,k)=>k.split('.').reduce((v,p)=>v?.[p],x);
  return defs.map(([label,key,preference])=>{const av=get(a,key),bv=get(b,key);return{label,key,av,bv,winner:av===bv?'tie':((preference==='higher'?av>bv:av<bv)?'a':'b')}});
}
