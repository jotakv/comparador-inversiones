import {irr,model} from './finance.js';

const clamp=(value,min=0,max=100)=>Math.max(min,Math.min(max,value));
const finite=value=>Number.isFinite(value)?value:0;

export function projectScenario(alternative,scenario='base',founderHourCost=20,stress={}){
  const source=alternative.scenarios[scenario];
  if(!source)throw new Error(`Escenario ${scenario} no existe para ${alternative.id}`);
  const settings={...source,steadyRevenue:source.steadyRevenue*(stress.revenueFactor??1)};
  const investment=alternative.initialInvestment*(stress.capexFactor??1);
  const years=[{year:0,revenue:0,opex:0,ebitda:0,maintenanceCapex:investment,ownerCash:-investment,founderLabor:0,economicFcf:-investment,cumulativeOwnerCash:-investment,residual:alternative.tangibleAssetValue,economicWealth:alternative.tangibleAssetValue-investment}];
  let cumulativeOwnerCash=-investment;
  let cumulativeEconomicFcf=-investment;
  for(let year=1;year<=5;year++){
    const ramp=year===1?settings.year1Ramp:year===2?settings.year2Ramp:1;
    const growth=(1+settings.growth)**Math.max(0,year-3);
    const revenue=settings.steadyRevenue*ramp*growth;
    const fixedOpex=settings.fixedOpex*1.02**(year-1);
    const opex=fixedOpex+revenue*settings.variableCostPct;
    const ebitda=revenue-opex;
    const maintenanceCapex=settings.maintenanceCapex;
    const ownerCash=ebitda-maintenanceCapex;
    const founderLabor=alternative.founderHoursMonth*12*founderHourCost;
    const economicFcf=ownerCash-founderLabor;
    cumulativeOwnerCash+=ownerCash;
    cumulativeEconomicFcf+=economicFcf;
    const residual=alternative.tangibleAssetValue+(settings.residualValue5-alternative.tangibleAssetValue)*(year/5);
    years.push({year,revenue,opex,ebitda,maintenanceCapex,ownerCash,founderLabor,economicFcf,cumulativeOwnerCash,cumulativeEconomicFcf,residual,economicWealth:cumulativeOwnerCash+residual});
  }
  const ownerFlows=years.map(row=>row.ownerCash);
  const economicFlows=years.map(row=>row.economicFcf);
  ownerFlows[5]+=years[5].residual;
  economicFlows[5]+=years[5].residual;
  const paybackMonths=interpolatedPayback(years.map(row=>row.ownerCash));
  const economicPaybackMonths=interpolatedPayback(years.map(row=>row.economicFcf));
  const roiAt=horizon=>{
    const row=years[horizon];
    const operatingCash=years.slice(1,horizon+1).reduce((sum,item)=>sum+item.ownerCash,0);
    const economicCash=years.slice(1,horizon+1).reduce((sum,item)=>sum+item.economicFcf,0);
    return{
      operating:operatingCash/investment,
      total:(operatingCash+row.residual-investment)/investment,
      laborAdjusted:(economicCash+row.residual-investment)/investment
    };
  };
  const breakEvenRevenue=(settings.fixedOpex+settings.maintenanceCapex)/(1-settings.variableCostPct);
  return{
    scenario,
    investment,
    years,
    ownerIrr5:irr(ownerFlows),
    economicIrr5:irr(economicFlows),
    paybackMonths,
    economicPaybackMonths,
    roi1:roiAt(1),
    roi3:roiAt(3),
    roi5:roiAt(5),
    breakEvenRevenue,
    steadyMargin:(settings.steadyRevenue-settings.fixedOpex-settings.steadyRevenue*settings.variableCostPct)/settings.steadyRevenue,
    revenueToCapital:years[3].revenue/investment,
    ebitdaToCapital:years[3].ebitda/investment,
    fcfToCapital:years[3].ownerCash/investment,
    economicFcfToCapital:years[3].economicFcf/investment
  };
}

export function interpolatedPayback(flows){
  let cumulative=finite(flows[0]);
  for(let year=1;year<flows.length;year++){
    const before=cumulative;
    cumulative+=finite(flows[year]);
    if(cumulative>=0&&flows[year]>0)return(year-1)*12+(-before/flows[year])*12;
  }
  return null;
}

export function validateAlternativeData(data){
  if(data.capital.sepe!==28000)throw new Error('El escenario independiente debe mantener 28.000 € SEPE');
  if(data.alternatives.length<8||data.alternatives.length>12)throw new Error('Deben existir entre 8 y 12 finalistas');
  const ids=new Set();
  for(const alternative of data.alternatives){
    if(ids.has(alternative.id))throw new Error(`ID duplicado: ${alternative.id}`);
    ids.add(alternative.id);
    const budget=alternative.budget.reduce((sum,item)=>sum+item.amount,0);
    if(budget!==alternative.initialInvestment)throw new Error(`${alternative.id}: presupuesto ${budget} != inversión ${alternative.initialInvestment}`);
    const staged=Object.values(alternative.stages).reduce((sum,value)=>sum+value,0);
    if(staged!==alternative.initialInvestment)throw new Error(`${alternative.id}: fases ${staged} != inversión ${alternative.initialInvestment}`);
    for(const scenario of ['conservative','base','optimistic']){
      const projection=projectScenario(alternative,scenario,data.capital.founderHourCost);
      if(projection.years.length!==6||projection.years.some(row=>Object.values(row).some(value=>typeof value==='number'&&!Number.isFinite(value))))throw new Error(`${alternative.id}: proyección no finita`);
    }
  }
  return true;
}

const normalize=(value,min,max,inverse=false)=>{
  if(![value,min,max].every(Number.isFinite)||max===min)return 50;
  const raw=100*(value-min)/(max-min);
  return clamp(inverse?100-raw:raw);
};
const range=(rows,key)=>[Math.min(...rows.map(key)),Math.max(...rows.map(key))];
const sepePoints={Alta:100,Condicionada:65,Dudosa:30,'No adecuada':0};

export function scoreAlternatives(data){
  validateAlternativeData(data);
  const rows=data.alternatives.map(alternative=>{
    const base=projectScenario(alternative,'base',data.capital.founderHourCost);
    const conservative=projectScenario(alternative,'conservative',data.capital.founderHourCost);
    const optimistic=projectScenario(alternative,'optimistic',data.capital.founderHourCost);
    const downside=projectScenario(alternative,'base',data.capital.founderHourCost,{revenueFactor:.7,capexFactor:1.2});
    const riskAverage=Object.values(alternative.risk).reduce((sum,value)=>sum+value,0)/Object.values(alternative.risk).length;
    const annualizedEconomicReturn=base.roi5.laborAdjusted<=-1?-1:(1+base.roi5.laborAdjusted)**(1/5)-1;
    return{...alternative,base,conservative,optimistic,downside,riskAverage,annualizedEconomicReturn};
  });
  const profitabilityRange=range(rows,row=>row.annualizedEconomicReturn);
  const firstRevenueRange=range(rows,row=>row.timeToFirstRevenueMonths);
  const paybackRange=range(rows,row=>row.base.paybackMonths??120);
  const riskRange=range(rows,row=>row.riskAverage);
  const residualRange=range(rows,row=>row.base.years[5].residual/row.initialInvestment);
  const fcfRange=range(rows,row=>row.base.economicFcfToCapital);
  const revenueRange=range(rows,row=>row.base.revenueToCapital);
  const efficiencyPaybackRange=range(rows,row=>row.base.economicPaybackMonths??180);
  const weights=data.methodology.weights;
  for(const row of rows){
    const inputs={
      profitability:normalize(row.annualizedEconomicReturn,...profitabilityRange),
      sepeFit:sepePoints[row.sepe.rating]??0,
      cashSpeed:(normalize(row.timeToFirstRevenueMonths,...firstRevenueRange,true)+normalize(row.base.paybackMonths??120,...paybackRange,true))/2,
      risk:normalize(row.riskAverage,...riskRange,true),
      scalability:row.rubric.scalability,
      defensibility:row.rubric.defensibility,
      residual:normalize(row.base.years[5].residual/row.initialInvestment,...residualRange),
      automation:row.automationPct,
      liquidity:row.rubric.liquidity,
      founderFit:row.rubric.founderFit
    };
    row.scoreInputs=inputs;
    row.score=Object.entries(weights).reduce((sum,[key,weight])=>sum+inputs[key]*weight,0)/Object.values(weights).reduce((a,b)=>a+b,0);
    row.capitalEfficiencyScore=.5*normalize(row.base.economicFcfToCapital,...fcfRange)+.2*normalize(row.base.revenueToCapital,...revenueRange)+.3*normalize(row.base.economicPaybackMonths??180,...efficiencyPaybackRange,true);
  }
  rows.sort((a,b)=>b.score-a.score);
  const frontier=efficientFrontier(rows);
  rows.forEach(row=>row.efficient=frontier.some(item=>item.id===row.id));
  return rows;
}

export function efficientFrontier(rows){
  return rows.filter(candidate=>!rows.some(other=>other.id!==candidate.id&&
    other.annualizedEconomicReturn>=candidate.annualizedEconomicReturn&&
    other.riskAverage<=candidate.riskAverage&&
    other.initialInvestment<=candidate.initialInvestment&&
    other.rubric.liquidity>=candidate.rubric.liquidity&&
    (other.annualizedEconomicReturn>candidate.annualizedEconomicReturn||other.riskAverage<candidate.riskAverage||other.initialInvestment<candidate.initialInvestment||other.rubric.liquidity>candidate.rubric.liquidity)
  ));
}

export function benchmarkRows(catalog,assumptions,data){
  return catalog.investments.filter(item=>item.id!=='local').map(item=>{
    const result=model(assumptions[item.id]);
    const year5=result.years[5];
    const flows=result.flows.slice(0,6);
    flows[5]+=year5.asset;
    const operatingCash5=result.years.slice(1,6).reduce((sum,row)=>sum+row.ebitda,0);
    const roi5=(operatingCash5+year5.asset-result.projectCost)/result.projectCost;
    const hoursMonth=item.effort*3;
    return{
      id:item.id,
      name:item.name,
      type:'benchmark',
      category:item.type,
      initialInvestment:result.projectCost,
      externalCapitalRequired:Math.max(0,result.projectCost-data.capital.sepe),
      annualCash:result.years[3].ebitda,
      economicFcf:result.years[3].ebitda-hoursMonth*12*data.capital.founderHourCost,
      irr5:irr(flows),
      roi5,
      paybackMonths:result.payback===null?null:result.payback*12,
      residualValue:year5.asset,
      riskAverage:item.risk,
      liquidity:item.liquidity*10,
      operatingIntensity:item.effort>=8?'alta':item.effort>=5?'media':'baja',
      scalability:item.scalability*10,
      sepe:data.benchmarkSepe[item.id]
    };
  });
}

export const scoreFormula=data=>Object.entries(data.methodology.weights).map(([key,weight])=>`${key} ${weight} %`).join(' + ');
