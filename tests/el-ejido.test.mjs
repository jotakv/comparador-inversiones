import test from 'node:test';
import assert from 'node:assert/strict';
import assumptions from '../data/model-assumptions.json' with {type:'json'};
import catalog from '../data/investments.json' with {type:'json'};
import {model,outsourcedLastMileMetrics,dscr} from '../assets/js/finance.js';
import {yearlyProjection} from '../assets/js/projection-engine.js';
import {buildDecisionSet} from '../assets/js/decision-engine.js';

const id='el-ejido-outsourced-last-mile';
const a=assumptions[id];
const close=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);

test('capital and debt remain separate',()=>{
 assert.equal(a.scenarios.base.capex,34000);
 assert.equal(a.financing.debt,0);
 assert.equal(45000-a.scenarios.base.capex,11000);
 assert.equal(dscr(23174,0),null);
 assert.equal(yearlyProjection(a).years[1].dscr,null);
});

test('monthly package unit economics cover LOW, BASE, HIGH and PEAK',()=>{
 const expected={pessimistic:[4160,3328,1664,1664,1663+1/6],base:[4680,3744,1872,1872,1871+1/6],optimistic:[5200,4160,2080,2080,2079+1/6],peak:[6240,4992,2496,2496,2495+1/6]};
 for(const [scenario,values] of Object.entries(expected)){
  const z=outsourcedLastMileMetrics(a.operations,scenario).monthly;
  assert.equal(z.packages,values[0]);assert.equal(z.grossLogisticsRevenue,values[1]);assert.equal(z.outsourcingCost,values[2]);assert.equal(z.logisticsMargin,values[3]);close(z.preTaxCashFlow,values[4],1e-8);
 }
});

test('annual standard campaign regression matches supplied scenarios',()=>{
 const expected={pessimistic:[52320,41856,20928,20918],base:[57960,46368,23184,23174],optimistic:[63600,50880,25440,25430]};
 for(const [scenario,values] of Object.entries(expected)){
  const z=outsourcedLastMileMetrics(a.operations,scenario).annual;
  assert.deepEqual([z.packages,z.grossLogisticsRevenue,z.outsourcingCost,z.preTaxCashFlow],values);
  assert.equal(model(a,scenario).years[1].ebitda,values[3]);
 }
});

test('intensive campaign remains a secondary sensitivity',()=>{
 const expected={pessimistic:22454,base:24326,optimistic:26198};
 for(const [scenario,value] of Object.entries(expected))assert.equal(outsourcedLastMileMetrics(a.operations,scenario,'intensive').annual.preTaxCashFlow,value);
});

test('owner labor is never confused with supplier labor',()=>{
 assert.equal(a.ownerOperatingHoursMonth,0);
 assert.equal(a.ownerRouteHours,0);
 assert.equal(a.ownerDeliveryHours,0);
 assert.equal(a.imputedOwnerLaborCost,0);
 const row=buildDecisionSet(catalog,assumptions,'equilibrado',30).rows.find(item=>item.id===id);
 assert.equal(row.hours,0);
 assert.equal(row.adjustedAnnual,row.base.years[1].ebitda);
});

test('property and combined project returns use distinct labels and bases',()=>{
 const z=outsourcedLastMileMetrics(a.operations,'base');
 assert.equal(z.propertyNoi,2770);
 close(z.propertyOperatingYield,2770/34000);
 close(z.annual.preTaxCashFlow/34000,23174/34000);
 assert.equal(z.annual.propertyIncome,3850);
 assert.equal(z.annual.operatingExpenses,3860);
});

test('projection uses the common ten-year engine, one owned residual and year-two cost step',()=>{
 const m=model(a);
 assert.equal(m.years.length,11);
 assert.equal(m.residual,29000*1.02**10);
 assert.equal(m.settings.assetValue,29000);
 assert.equal(m.years[1].ebitda,23174);
 assert.equal(m.years[2].opex,a.scenarios.base.opex*1.02+2400);
 assert.ok(Number.isFinite(m.irr));assert.ok(Number.isFinite(m.roi));assert.ok(Number.isFinite(m.payback));
});
