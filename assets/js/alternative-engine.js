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
  if(data.capital.indemnification!==12000||data.capital.savings!==5000)throw new Error('Las fuentes propias deben mantenerse separadas: 12.000 € indemnización y 5.000 € ahorro');
  if(data.capital.totalAvailable!==45000||data.capital.sepe+data.capital.indemnification+data.capital.savings!==data.capital.totalAvailable)throw new Error('Las fuentes de capital deben sumar 45.000 €');
  if(data.capital.ownFunds!==data.capital.indemnification+data.capital.savings)throw new Error('Fondos propios debe sumar indemnización y ahorro');
  if(data.alternatives.length<8||data.alternatives.length>12)throw new Error('Deben existir entre 8 y 12 finalistas');
  const ids=new Set();
  const sourceIds=new Set(data.sources.map(source=>source.id));
  for(const alternative of data.alternatives){
    if(ids.has(alternative.id))throw new Error(`ID duplicado: ${alternative.id}`);
    ids.add(alternative.id);
    const budget=alternative.budget.reduce((sum,item)=>sum+item.amount,0);
    if(budget!==alternative.initialInvestment)throw new Error(`${alternative.id}: presupuesto ${budget} != inversión ${alternative.initialInvestment}`);
    const staged=Object.values(alternative.stages).reduce((sum,value)=>sum+value,0);
    if(staged!==alternative.initialInvestment)throw new Error(`${alternative.id}: fases ${staged} != inversión ${alternative.initialInvestment}`);
    if(alternative.initialInvestment>data.capital.totalAvailable)throw new Error(`${alternative.id}: inversión superior al capital consolidado`);
    if(alternative.sources.some(source=>!sourceIds.has(source)))throw new Error(`${alternative.id}: referencia a fuente inexistente`);
    for(const scenario of ['conservative','base','optimistic']){
      const projection=projectScenario(alternative,scenario,data.capital.founderHourCost);
      if(projection.years.length!==6||projection.years.some(row=>Object.values(row).some(value=>typeof value==='number'&&!Number.isFinite(value))))throw new Error(`${alternative.id}: proyección no finita`);
    }
  }
  const selectedUniverse=new Set(data.universe.filter(item=>item.selected).map(item=>item.id));
  if(selectedUniverse.size!==ids.size||[...ids].some(id=>!selectedUniverse.has(id)))throw new Error('Universo seleccionado y finalistas no coinciden');
  for(const strategy of data.capitalStrategies){
    const alternative=data.alternatives.find(item=>item.id===strategy.alternativeId);
    if(!alternative||strategy.committed!==alternative.initialInvestment)throw new Error(`${strategy.id}: alternativa o compromiso inconsistente`);
    if(strategy.committed+strategy.reserve!==data.capital.totalAvailable)throw new Error(`${strategy.id}: compromiso y reserva no suman 45.000 €`);
  }
  return true;
}

const threshold=(value,worst,best)=>Number.isFinite(value)?clamp(100*(value-worst)/(best-worst)):0;
const sepePoints={Alta:100,Condicionada:65,Dudosa:30,'No adecuada':0};

export function scoreAlternatives(data){
  validateAlternativeData(data);
  const rows=data.alternatives.map(alternative=>{
    const base=projectScenario(alternative,'base',data.capital.founderHourCost);
    const conservative=projectScenario(alternative,'conservative',data.capital.founderHourCost);
    const optimistic=projectScenario(alternative,'optimistic',data.capital.founderHourCost);
    const downside=projectScenario(alternative,'base',data.capital.founderHourCost,{revenueFactor:.7,capexFactor:1.2});
    const riskAverage=Object.values(alternative.risk).reduce((sum,value)=>sum+value,0)/Object.values(alternative.risk).length;
    const annualizedEconomicReturn=Number.isFinite(base.economicIrr5)?base.economicIrr5:null;
    return{...alternative,base,conservative,optimistic,downside,riskAverage,annualizedEconomicReturn};
  });
  const weights=data.methodology.weights;
  for(const row of rows){
    const economicPayback=row.base.economicPaybackMonths;
    const inputs={
      profitability:threshold(row.annualizedEconomicReturn,-.10,.40),
      sepeFit:sepePoints[row.sepe.rating]??0,
      cashSpeed:.4*threshold(row.timeToFirstRevenueMonths,6,1)+.6*threshold(economicPayback,60,18),
      risk:threshold(row.riskAverage,9,2),
      scalability:row.rubric.scalability,
      defensibility:row.rubric.defensibility,
      residual:threshold(row.base.years[5].residual/row.initialInvestment,0,.60),
      automation:row.automationPct,
      liquidity:row.rubric.liquidity,
      founderFit:row.rubric.founderFit
    };
    row.scoreInputs=inputs;
    row.score=Object.entries(weights).reduce((sum,[key,weight])=>sum+inputs[key]*weight,0)/Object.values(weights).reduce((a,b)=>a+b,0);
    row.capitalEfficiencyScore=.5*threshold(row.base.economicFcfToCapital,0,.75)+.2*threshold(row.base.revenueToCapital,0,2)+.3*threshold(economicPayback,60,18);
  }
  rows.sort((a,b)=>b.score-a.score);
  const frontier=efficientFrontier(rows);
  rows.forEach(row=>row.efficient=frontier.some(item=>item.id===row.id));
  return rows;
}

export function efficientFrontier(rows){
  const value=row=>Number.isFinite(row.annualizedEconomicReturn)?row.annualizedEconomicReturn:-1;
  return rows.filter(candidate=>!rows.some(other=>other.id!==candidate.id&&
    value(other)>=value(candidate)&&
    other.riskAverage<=candidate.riskAverage&&
    other.initialInvestment<=candidate.initialInvestment&&
    other.rubric.liquidity>=candidate.rubric.liquidity&&
    (value(other)>value(candidate)||other.riskAverage<candidate.riskAverage||other.initialInvestment<candidate.initialInvestment||other.rubric.liquidity>candidate.rubric.liquidity)
  ));
}

export function allocateCapital(initialInvestment,capital){
  let remaining=initialInvestment;
  const sepe=Math.min(remaining,capital.sepe);remaining-=sepe;
  const indemnification=Math.min(remaining,capital.indemnification);remaining-=indemnification;
  const savings=Math.min(remaining,capital.savings);remaining-=savings;
  return{sepe,indemnification,savings,external:Math.max(0,remaining),unused:Math.max(0,capital.totalAvailable-initialInvestment)};
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
    const founderLabor=hoursMonth*12*data.capital.founderHourCost;
    const economicOperatingFlows=result.flows.slice(0,6);
    for(let year=1;year<economicOperatingFlows.length;year++)economicOperatingFlows[year]-=founderLabor;
    const economicFlows=[...economicOperatingFlows];
    economicFlows[5]+=year5.asset;
    return{
      id:item.id,
      name:item.name,
      type:'benchmark',
      category:item.type,
      initialInvestment:result.projectCost,
      capitalBeyondSepe:Math.max(0,result.projectCost-data.capital.sepe),
      externalCapitalRequired:Math.max(0,result.projectCost-data.capital.totalAvailable),
      annualCash:result.years[3].ebitda,
      economicFcf:result.years[3].ebitda-founderLabor,
      irr5:irr(flows),
      economicIrr5:irr(economicFlows),
      roi5,
      paybackMonths:result.payback===null?null:result.payback*12,
      // Payback measures recovery through operating cash only. Residual value is
      // included in IRR/ROI, but adding a hypothetical sale to payback would make
      // benchmarks incomparable with the alternative-business projections.
      economicPaybackMonths:interpolatedPayback(economicOperatingFlows),
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
