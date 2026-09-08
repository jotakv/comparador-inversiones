import {calculateMadridAgency} from './madrid-last-mile-engine.js';

const money=value=>Math.round((value+Number.EPSILON)*100)/100;
const sum=object=>Object.values(object).reduce((total,value)=>total+value,0);

export function chairRevenue(equivalentOccupiedChairs,chairMonthlyPrice){return money(equivalentOccupiedChairs*chairMonthlyPrice)}
export function barberSharedOperatingCost(costs){return money(costs.perLocation.reduce((total,location)=>total+sum(location),0)+sum(costs.sharedBusiness))}
export function effectiveRent(stabilizedRent,rentFactorForYear){return money(stabilizedRent*rentFactorForYear)}
export function startupCapex(input,tier='base',mirrorQty=input.equipment.mirrorQty){
  const value=key=>input.equipment[key][tier];
  const barberChairsCapex=input.equipment.barberChairQty*value('barberChairUnitCost');
  const mirrorsCapex=mirrorQty*value('mirrorUnitCost');
  const parts={barberChairsCapex,mirrorsCapex,basicFurnitureCost:value('basicFurnitureCost'),lightingCost:value('lightingCost'),electricalAdaptationCost:value('electricalAdaptationCost'),sharedDryersCost:value('sharedDryersCost'),securityHardwareCost:value('securityHardwareCost'),tpvHardwareCost:value('tpvHardwareCost'),microhubEquipmentCost:value('microhubEquipmentCost'),avsDeposit:value('avsDeposit'),logisticsWorkingCapital:value('logisticsWorkingCapital'),contingency:value('contingency')};
  return{tier,mirrorQty,parts,barberBasicCapex:money(barberChairsCapex+mirrorsCapex+parts.basicFurnitureCost+parts.lightingCost+parts.electricalAdaptationCost+parts.sharedDryersCost),securityCapex:parts.securityHardwareCost,total:money(sum(parts))};
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
