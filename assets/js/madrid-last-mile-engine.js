const money=value=>Math.round((value+Number.EPSILON)*100)/100;
const sum=values=>Object.values(values).reduce((total,value)=>total+value,0);
export function calculateMadridAgency(input){
 const c=input.catcher,a=input.amazon;
 const catcher={orders:c.ordersMonthDisplay,grossRevenue:c.ordersMonthDisplay*c.grossFeeOrder,platformFees:c.ordersMonthDisplay*c.platformCommissionOrder,netRevenue:c.netRevenueMonthly,courierPay:c.netRevenueMonthly*c.courierShare,agencyMargin:c.netRevenueMonthly*c.agencyShare};
 const packages=a.points*a.packagesDayPoint*a.daysMonth;
 const amazon={packages,grossRevenue:packages*a.grossFeePackage,courierPay:packages*a.courierFeePackage,agencyMargin:money(packages*(a.grossFeePackage-a.courierFeePackage))};
 const fixedCosts=sum(input.fixedCostsMonthly),revenue=catcher.netRevenue+amazon.grossRevenue,courierPayments=catcher.courierPay+amazon.courierPay,contribution=catcher.agencyMargin+amazon.agencyMargin,preTax=contribution-fixedCosts;
 catcher.inputReconciliation=catcher.netRevenue-(catcher.grossRevenue-catcher.platformFees);return{catcher,amazon,fixedCosts,revenue,courierPayments,contribution,preTax,annualPreTax:preTax*12,margin:preTax/revenue,breakEven:{catcherContribution:catcher.agencyMargin,fixedCosts,afterStructure:catcher.agencyMargin-fixedCosts}};
}
export function calculateAgencyScenarios(input){return input.scenarios.map(s=>{const packages=input.amazon.points*s.amazonPackagesDayPoint*input.amazon.daysMonth,amazonMargin=money(packages*(input.amazon.grossFeePackage-input.amazon.courierFeePackage)),contribution=amazonMargin+s.catcherAgencyMargin;return{...s,packages,amazonMargin,contribution,preTax:contribution-sum(input.fixedCostsMonthly)}})}
export function initialCapital(input,tier='base'){const parts=input.initialCapitalEstimates[tier];return{tier,parts,total:sum(parts)}}
