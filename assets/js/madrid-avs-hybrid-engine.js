import {calculateMadridAgency} from './madrid-last-mile-engine.js';
import {irr} from './finance.js';

const money=value=>Math.round((value+Number.EPSILON)*100)/100;
const sum=object=>Object.values(object).reduce((total,value)=>total+value,0);

export function chairRevenue(equivalentOccupiedChairs,chairMonthlyPrice){return money(equivalentOccupiedChairs*chairMonthlyPrice)}
export function barberSharedOperatingCost(costs){return money(costs.perLocation.reduce((total,location)=>total+sum(location),0)+sum(costs.sharedBusiness))}
export function effectiveRent(stabilizedRent,rentFactorForYear){return money(stabilizedRent*rentFactorForYear)}
export function startupCapex(input,tier='base',mirrorQty=input.equipment.mirrorQty){
  const value=key=>input.equipment[key][tier];
  const barberChairsCapex=input.equipment.barberChairQty*value('barberChairUnitCost');
  const mirrorsCapex=mirrorQty*value('mirrorUnitCost');
  const parts={barberChairsCapex,mirrorsCapex,shelvesCost:value('shelvesCost'),basicFurnitureCost:value('basicFurnitureCost'),waitingFurnitureCost:value('waitingFurnitureCost'),lightingCost:value('lightingCost'),electricalAdaptationCost:value('electricalAdaptationCost'),cleaningBinsCost:value('cleaningBinsCost'),diyPaintingCost:value('diyPaintingCost'),microhubEquipmentCost:value('microhubEquipmentCost'),signageCost:value('signageCost'),transportCost:value('transportCost'),physicalContingency:value('physicalContingency')};
  const physicalCapex=money(sum(parts));
  const startup={avsDeposit:value('avsDeposit'),logisticsWorkingCapital:value('logisticsWorkingCapital'),launchBuffer:value('launchBuffer'),technicalAndPermits:value('technicalAndPermits')};
  return{tier,mirrorQty,parts,startup,physicalCapex,total:money(physicalCapex+sum(startup))};
}
export function calculateHybrid(input,{chairs=input.barber.baseEquivalentChairs,packagesDayPoint=input.logistics.basePackagesDayPoint,rentFactor=1,costOverride=null}={}){
  const scenarioCatcherMargin=input.logistics.catcherAgencyMarginByPackages?.[packagesDayPoint];
  const catcher=scenarioCatcherMargin===undefined?input.logistics.agency.catcher:{...input.logistics.agency.catcher,netRevenueMonthly:scenarioCatcherMargin/input.logistics.agency.catcher.agencyShare};
  const agencyInput={...input.logistics.agency,catcher,amazon:{...input.logistics.agency.amazon,packagesDayPoint},fixedCostsMonthly:{}};
  const logistics=calculateMadridAgency(agencyInput);
  const operatingCost=costOverride??barberSharedOperatingCost(input.operatingCosts);
  const rent=effectiveRent(input.avsRent.stabilizedMonthly,rentFactor);
  const revenue=chairRevenue(chairs,input.barber.chairMonthlyPrice);
  const totalSharedCost=money(operatingCost+input.logistics.incrementalStructureMonthly+rent);
  const monthlyProfit=money(revenue+logistics.contribution-totalSharedCost);
  return{chairs,packagesDayPoint,chairRevenue:revenue,logistics,barberSharedOperatingCost:operatingCost,incrementalLogisticsCost:input.logistics.incrementalStructureMonthly,avsRent:rent,totalSharedCost,monthlyProfit,annualProfit:money(monthlyProfit*12)};
}
export function fiveYearProjection(input,options={}){return input.avsRent.yearFactors.map((factor,index)=>({year:index+1,rentFactor:factor,...calculateHybrid(input,{...options,rentFactor:factor})}))}
export function scenarioMatrix(input){return input.barber.chairScenarios.flatMap(chairs=>input.logistics.matrixPackages.map(packagesDayPoint=>calculateHybrid(input,{chairs,packagesDayPoint})))}
export function monthlyProjection(input,tier='base'){
  const initial=startupCapex(input,tier).total,rows=[];let cumulative=-initial;
  input.rampUp.chairOccupancy.forEach((occupancy,index)=>{
    const logisticsFactor=input.rampUp.logisticsFactor[index];
    const steady=calculateHybrid(input,{chairs:input.barber.installedChairs*occupancy,rentFactor:input.avsRent.yearFactors[0]});
    const logisticsContribution=money(steady.logistics.contribution*logisticsFactor);
    const cashFlow=money(steady.chairRevenue+logisticsContribution-steady.totalSharedCost);
    const before=cumulative;cumulative=money(cumulative+cashFlow);
    rows.push({month:index+1,occupancy,logisticsFactor,cashFlow,cumulative,before});
  });
  let month=rows.length;
  while(cumulative<0&&month<120){month++;const year=Math.min(5,Math.ceil(month/12));const result=calculateHybrid(input,{rentFactor:input.avsRent.yearFactors[year-1]});const before=cumulative;cumulative=money(cumulative+result.monthlyProfit);rows.push({month,occupancy:input.barber.baseOccupancy,logisticsFactor:1,cashFlow:result.monthlyProfit,cumulative,before})}
  const recovery=rows.find(x=>x.cumulative>=0);const projectedPayback=recovery?money(recovery.month-1+(-recovery.before/recovery.cashFlow)):null;
  return{initial,rows,projectedPayback,theoreticalPayback:money(initial/calculateHybrid(input).monthlyProfit)};
}
export function longTermProjection(input,tier='base',years=10){
  const initial=startupCapex(input,tier).total,firstYear=monthlyProjection(input,tier).rows.slice(0,12).reduce((n,x)=>n+x.cashFlow,0),annual=[];let cumulative=-initial;
  for(let year=1;year<=years;year++){const fcf=money(year===1?firstYear:calculateHybrid(input,{rentFactor:input.avsRent.yearFactors[Math.min(year,5)-1]}).annualProfit);cumulative=money(cumulative+fcf);annual.push({year,fcf,cumulative,economicEquity:cumulative,propertyResidual:0,accumulatedRoi:money(cumulative/initial)})}
  const flows=[-initial,...annual.map(x=>x.fcf)];
  return{initial,annual,irr:irr(flows),propertyResidual:0};
}
