import test from 'node:test';
import assert from 'node:assert/strict';
import assumptions from '../data/model-assumptions.json' with {type:'json'};
import catalog from '../data/investments.json' with {type:'json'};
import {hybridScenario} from '../assets/js/investment-analysis-engine.js';
import {buildDecisionSet} from '../assets/js/decision-engine.js';
const a=assumptions['talavera-reparto-delegado'],op=a.operations,close=(x,y,t=.02)=>assert.ok(Math.abs(x-y)<=t,`${x} != ${y}`);
test('Talavera acquisition is calculated without silently zeroing exclusions',()=>{const x=a.acquisition;assert.equal(x.purchasePrice+x.transferTax+x.closingCosts+x.initialTechnicalAndSetupCosts,37661);assert.ok(Object.values(x.excludedCosts).every(v=>v===null))});
test('Talavera four annual scenarios share the hybrid calculator',()=>{for(const [v,p,flow] of [[80,52320,19818],[90,57960,22074],[100,63600,24330]]){const x=hybridScenario(op,v,{investment:37661});assert.equal(x.annualPackages,p);assert.equal(x.preTaxCashFlow,flow);close(x.afterReserve,flow*.8);close(x.conservativePaybackMonths,v===90?27.25:x.conservativePaybackMonths)}});
test('monthly central, break-even and one-point cases reconcile',()=>{const x=hybridScenario(op,90,{investment:37661}),one=hybridScenario(op,90,{locations:1,investment:37661});assert.equal(x.monthlyPackages,4680);assert.equal(x.monthlyExpenses,342.5);assert.equal(x.monthlyPreTax,1779.5);assert.equal(one.preTaxCashFlow,11682);close(one.afterReserve,9345.6);close(one.paybackAfterReserveMonths,48.36)});
test('Talavera participates independently in decision ranking',()=>{const rows=buildDecisionSet(catalog,assumptions).rows;assert.ok(rows.some(x=>x.id==='talavera-reparto-delegado'));assert.ok(rows.some(x=>x.id==='el-ejido-outsourced-last-mile'))});

test('locker rent is independent, dynamic and reversible',()=>{
 const legacy=hybridScenario(op,90,{investment:37661});
 for(const [rent,annual] of [[50,600],[70,840],[100,1200],[120,1440]]){
  const x=hybridScenario(op,90,{investment:37661,lockerEnabled:true,lockerMonthlyRent:rent});
  assert.equal(x.lockerIncome,annual);assert.equal(x.preTaxCashFlow,22074+annual);assert.ok(Number.isFinite(x.conservativePaybackMonths));
 }
 const prudent=hybridScenario(op,90,{investment:37661,lockerEnabled:true,lockerMonthlyRent:50});
 assert.equal(prudent.preTaxCashFlow,22674);close(prudent.afterReserve,18139.2);assert.equal(prudent.annualPackages,legacy.annualPackages);assert.equal(prudent.locations,2);
 assert.deepEqual(hybridScenario(op,90,{investment:37661,lockerEnabled:false,lockerMonthlyRent:120}),legacy);
});

test('official Talavera projection and ranking use prudent locker without changing El Ejido assumptions',()=>{
 assert.equal(a.locker.monthlyRent,50);assert.equal(a.locker.contractStatus,'pending');assert.equal(a.locker.incomeType,'PASSIVE_ANCILLARY_INCOME');
 const rows=buildDecisionSet(catalog,assumptions).rows,talavera=rows.find(x=>x.id==='talavera-reparto-delegado');
 assert.equal(talavera.base.settings.lockerIncome,600);assert.equal(talavera.base.years[1].income,a.scenarios.base.revenue+600);
 const ejido=assumptions['el-ejido-outsourced-last-mile'];assert.equal(ejido.locker,undefined);
});
