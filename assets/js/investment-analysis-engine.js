import {model} from './finance.js';

const sum=object=>Object.values(object).reduce((total,value)=>total+value,0);

export function ejidoUnitEconomics(operations){
 const price=operations.revenuePerPackage,cost=operations.outsourcedCostPerPackage,margin=price-cost;
 return{price,cost,margin,grossMargin:margin/price};
}

export function ejidoScenario(operations,packagesPerDayPerLocation){
 const locations=operations.locations,monthlyPackages=packagesPerDayPerLocation*locations*operations.deliveryDaysMonth;
 const annualPackages=packagesPerDayPerLocation*locations*operations.normalDaysYear+operations.peakPackagesPerDayPerLocation*locations*operations.peakDaysYear;
 const units=ejidoUnitEconomics(operations),propertyIncome=operations.propertyRentMonth*operations.propertyRentMonths;
 const fixedCosts=sum(operations.propertyCosts)+sum(operations.otherAnnualCosts);
 const annualMargin=annualPackages*units.margin,preTaxCashFlow=annualMargin+propertyIncome-fixedCosts;
 const knownHours={80:5,90:5.75,100:6.5,120:8},dailyHours=knownHours[packagesPerDayPerLocation]??packagesPerDayPerLocation/15;
 const monthlySupplierPay=monthlyPackages*units.cost;
 return{packagesPerDayPerLocation,totalDailyPackages:packagesPerDayPerLocation*locations,monthlyPackages,annualPackages,grossLogisticsRevenue:annualPackages*units.price,outsourcingCost:annualPackages*units.cost,logisticsMargin:annualMargin,propertyIncome,fixedCosts,preTaxCashFlow,reserves:[.15,.2,.3].map(rate=>({rate,cash:preTaxCashFlow*(1-rate)})),dailyHours,hourlyGross:monthlySupplierPay/(dailyHours*operations.deliveryDaysMonth),hourlyGrossExtraHalfHour:monthlySupplierPay/((dailyHours+.5)*operations.deliveryDaysMonth)};
}

export function ejidoBreakEven(operations){
 const margin=ejidoUnitEconomics(operations).margin,propertyIncome=operations.propertyRentMonth*operations.propertyRentMonths;
 const fixedCosts=sum(operations.propertyCosts)+sum(operations.otherAnnualCosts),annualPackages=fixedCosts/margin,combinedAnnualPackages=Math.max(0,(fixedCosts-propertyIncome)/margin);
 const annualActiveDays=operations.normalDaysYear+operations.peakDaysYear;
 const perDayPerLocation=annualPackages/(annualActiveDays*operations.locations);
 return{fixedCosts,annualPackages,combinedAnnualPackages,perDayPerLocation,revenue:annualPackages*operations.revenuePerPackage};
}

export function ejidoSensitivity(operations,{volume,price=operations.revenuePerPackage,cost=operations.outsourcedCostPerPackage,daysMonth=operations.deliveryDaysMonth}){
 const annualPackages=volume*operations.locations*daysMonth*12,propertyIncome=operations.propertyRentMonth*operations.propertyRentMonths;
 const fixedCosts=sum(operations.propertyCosts)+sum(operations.otherAnnualCosts),cashFlow=annualPackages*(price-cost)+propertyIncome-fixedCosts;
 return{annualPackages,cashFlow,paybackYears:cashFlow>0?34000/cashFlow:null};
}

export function ejidoFallback(operations){
 const propertyIncome=operations.propertyRentMonth*operations.propertyRentMonths,propertyCosts=sum(operations.propertyCosts);
 return{logisticsRevenue:0,propertyIncome,propertyCosts,cashFlow:propertyIncome-propertyCosts};
}

export function olivaRoomEconomics({rooms,rentPerRoomMonth,occupancy,opex,annualDebtService,projectCost,equity}){
 const grossRent=rooms*rentPerRoomMonth*12,effectiveRent=grossRent*occupancy,noi=effectiveRent-opex,cashFlow=noi-annualDebtService;
 return{grossRent,effectiveRent,noi,cashFlow,monthlyCashFlow:cashFlow/12,dscr:annualDebtService?noi/annualDebtService:null,yieldOnCost:noi/projectCost,cashOnCash:cashFlow/equity,paybackYears:cashFlow>0?equity/cashFlow:null};
}

export const olivaFunding=(maximumCashRequirement,funding)=>({declaredGap:maximumCashRequirement-funding.declaredResources,safeGap:maximumCashRequirement-funding.safeResourcesWithoutSepe});

export function olivaRentSensitivity(assumption,rent,occupancy){
 const op=assumption.operations.fourRooms;
 return olivaRoomEconomics({rooms:4,rentPerRoomMonth:rent,occupancy,opex:op.opex,annualDebtService:assumption.financing.annualDebtService,projectCost:assumption.scenarios.base.projectCost,equity:assumption.scenarios.base.projectCost-assumption.financing.debt});
}

export function olivaConstructionSensitivity(assumption,shock){
 const base=assumption.scenarios.base,works=base.futureCapex*(1+shock),projectCost=base.entryCost+works,maximumCashRequirement=projectCost+base.waitingDebtService;
 const changed={...assumption,scenarios:{...assumption.scenarios,base:{...base,capex:projectCost,projectCost,futureCapex:works,delayedCapex:works}}};
 const projection=model(changed),op=assumption.operations.fourRooms,equity=projectCost-assumption.financing.debt;
 return{shock,projectCost,maximumCashRequirement,fundingGap:maximumCashRequirement-assumption.funding.declaredResources,yieldOnCost:op.noi/projectCost,cashOnCash:op.preTaxCashFlow/equity,irr:projection.irr,payback:equity/op.preTaxCashFlow};
}

export function olivaCapitalBridge(assumption){const a=assumption.acquisition,b=assumption.scenarios.base;return[{label:'Compra',value:a.purchasePrice,total:a.purchasePrice},{label:'ITP',value:a.itp,total:a.purchasePrice+a.itp},{label:'Cierre',value:a.notaryRegistryManagement,total:a.purchasePrice+a.itp+a.notaryRegistryManagement},{label:'Due diligence',value:a.technicalDocumentDueDiligence,total:a.entryCost},{label:'Proyecto, obra y mobiliario',value:b.futureCapex,total:b.projectCost},{label:`${b.monthsToFirstIncome} cuotas antes de renta`,value:b.waitingDebtService,total:b.maximumCashRequirement}]}
