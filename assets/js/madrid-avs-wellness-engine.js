import {calculateMadridAgency} from './madrid-last-mile-engine.js';
import {irr} from './finance.js';

const money=value=>Math.round((value+Number.EPSILON)*100)/100;
const sum=object=>Object.values(object).reduce((total,value)=>total+value,0);

export function calculateClassRevenue({classesPerWeek,weeksPerMonth,classCapacity,occupancyRate,effectiveRevenuePerAttendance,studioShare}){
  const studentsPerClass=classCapacity*occupancyRate;
  const gross=classesPerWeek*weeksPerMonth*studentsPerClass*effectiveRevenuePerAttendance;
  return{studentsPerClass,moneyGross:money(gross),gross,studioContribution:money(gross*studioShare)};
}
export function calculateWorkshopRevenue({workshopsPerMonth,attendeesPerWorkshop,effectiveWorkshopPrice,studioShare}){
  const gross=workshopsPerMonth*attendeesPerWorkshop*effectiveWorkshopPrice;
  return{gross:money(gross),studioContribution:money(gross*studioShare)};
}
export function calculateWellnessContribution(input,overrides={}){
  const regular=calculateClassRevenue({...input.wellness.regular,...overrides});
  const workshops=calculateWorkshopRevenue({...input.wellness.workshops,...overrides});
  return{regular,workshops,total:money(regular.studioContribution+workshops.studioContribution)};
}
export function calculateAvsRentForMonth(input,month){
  if(!Number.isInteger(month)||month<1)throw new RangeError('month must be a positive integer');
  const band=input.avsRent.bands.find(x=>month<=x.throughMonth)??input.avsRent.bands.at(-1);
  return money(input.avsRent.stabilizedMonthly*band.factor);
}
export function calculateLogistics(input,packagesDayPoint=input.logistics.basePackagesDayPoint){
  const margin=input.logistics.catcherAgencyMarginByPackages[String(packagesDayPoint)];
  const catcher={...input.logistics.agency.catcher,netRevenueMonthly:margin/input.logistics.agency.catcher.agencyShare};
  const result=calculateMadridAgency({...input.logistics.agency,catcher,amazon:{...input.logistics.agency.amazon,packagesDayPoint},fixedCostsMonthly:{}});
  return{...result,afterIncrementalStructure:money(result.contribution-input.logistics.incrementalStructureMonthly)};
}
export function calculateWellnessLogisticsMonth(input,{month=37,packagesDayPoint=input.logistics.basePackagesDayPoint,...wellness}={}){
  const contribution=calculateWellnessContribution(input,wellness),logistics=calculateLogistics(input,packagesDayPoint),rent=calculateAvsRentForMonth(input,month);
  const cashFlow=money(contribution.total+logistics.contribution-input.logistics.incrementalStructureMonthly-input.operatingCosts.wellnessStructureMonthly-rent);
  return{month,wellness:contribution,logistics,rent,wellnessStructure:input.operatingCosts.wellnessStructureMonthly,incrementalLogisticsStructure:input.logistics.incrementalStructureMonthly,courierPaymentsAlreadyDeducted:true,cashFlow};
}
export function startupCapital(input,tier='base'){
  const parts=Object.fromEntries(Object.entries(input.startup.items).map(([key,value])=>[key,value[tier]]));
  return{tier,parts,physicalCapex:money(Object.entries(parts).filter(([key])=>input.startup.physicalItems.includes(key)).reduce((n,[,v])=>n+v,0)),total:input.startup.total[tier]};
}
export function projectWellnessInvestment(input,{tier='base',years=10,prudentLogistics=false}={}){
  const initial=startupCapital(input,tier).total,months=[],annual=[];let cumulative=-initial;
  for(let month=1;month<=years*12;month++){
    const ramp=month<=12?input.rampUp.find(x=>month<=x.throughMonth):input.scenarios.base;
    const packages=prudentLogistics&&month<=6?30:(ramp.packagesDayPoint??input.logistics.basePackagesDayPoint);
    const row=calculateWellnessLogisticsMonth(input,{month,...ramp,packagesDayPoint:packages});
    cumulative=money(cumulative+row.cashFlow);months.push({...row,cumulative});
  }
  for(let year=1;year<=years;year++){
    const rows=months.slice((year-1)*12,year*12),fcf=money(rows.reduce((n,x)=>n+x.cashFlow,0));
    annual.push({year,fcf,cumulative:rows.at(-1).cumulative,propertyResidual:0});
  }
  const recovery=months.find(x=>x.cumulative>=0),payback=recovery?money(recovery.month-1+(recovery.cashFlow-recovery.cumulative)/recovery.cashFlow):null;
  return{initial,months,annual,payback,irr:irr([-initial,...annual.map(x=>x.fcf)]),propertyResidual:0,operatingFcf:money(annual.reduce((n,x)=>n+x.fcf,0)),netCash:annual.at(-1).cumulative};
}
export function scenarioResult(input,name){const s=input.scenarios[name];return calculateWellnessLogisticsMonth(input,{month:37,...s});}
