import test from'node:test';
import assert from'node:assert/strict';
import data from'../data/alternative-investments.json'with{type:'json'};
import catalog from'../data/investments.json'with{type:'json'};
import assumptions from'../data/model-assumptions.json'with{type:'json'};
import{benchmarkRows,efficientFrontier,projectScenario,scoreAlternatives,validateAlternativeData}from'../assets/js/alternative-engine.js';
import{model}from'../assets/js/finance.js';

test('28k SEPE is isolated from own funds and external finance',()=>{
  assert.equal(data.capital.sepe,28000);
  assert.equal(data.capital.ownFunds,0);
  assert.equal(data.capital.externalFinance,0);
});

test('ten finalists have balanced budgets, stages and finite scenarios',()=>{
  assert.equal(data.alternatives.length,10);
  assert.equal(validateAlternativeData(data),true);
  for(const alternative of data.alternatives){
    assert.equal(alternative.budget.reduce((sum,item)=>sum+item.amount,0),alternative.initialInvestment);
    assert.equal(Object.values(alternative.stages).reduce((sum,value)=>sum+value,0),alternative.initialInvestment);
  }
});

test('ROI includes residual once and operating ROI excludes it',()=>{
  const alternative=data.alternatives[0],projection=projectScenario(alternative,'base',data.capital.founderHourCost);
  const cash=projection.years[1].ownerCash;
  const expected=(cash+projection.years[1].residual-alternative.initialInvestment)/alternative.initialInvestment;
  assert.equal(projection.roi1.total,expected);
  assert.equal(projection.roi1.operating,cash/alternative.initialInvestment);
});

test('payback uses operating cash and never terminal residual',()=>{
  const projection=projectScenario(data.alternatives.find(item=>item.id==='smart-locker-network'),'base',data.capital.founderHourCost);
  assert.ok(projection.paybackMonths>24);
  assert.ok(projection.paybackMonths<60);
});

test('adverse case applies revenue -30% and CAPEX +20%',()=>{
  const alternative=data.alternatives[0];
  const base=projectScenario(alternative,'base',20),stress=projectScenario(alternative,'base',20,{revenueFactor:.7,capexFactor:1.2});
  assert.equal(stress.investment,base.investment*1.2);
  assert.equal(stress.years[3].revenue,base.years[3].revenue*.7);
  assert.ok(stress.roi5.total<base.roi5.total);
});

test('scores are bounded, sorted and fully derived',()=>{
  const rows=scoreAlternatives(data);
  assert.equal(rows.length,10);
  assert.ok(rows.every(row=>row.score>=0&&row.score<=100&&row.capitalEfficiencyScore>=0&&row.capitalEfficiencyScore<=100));
  assert.deepEqual(rows,[...rows].sort((a,b)=>b.score-a.score));
  assert.ok(rows.every(row=>Object.keys(row.scoreInputs).length===10));
});

test('efficient frontier contains no dominated member',()=>{
  const rows=scoreAlternatives(data),frontier=efficientFrontier(rows);
  assert.ok(frontier.length>0);
  for(const candidate of frontier)assert.ok(!rows.some(other=>other.id!==candidate.id&&other.annualizedEconomicReturn>=candidate.annualizedEconomicReturn&&other.riskAverage<=candidate.riskAverage&&other.initialInvestment<=candidate.initialInvestment&&other.rubric.liquidity>=candidate.rubric.liquidity&&(other.annualizedEconomicReturn>candidate.annualizedEconomicReturn||other.riskAverage<candidate.riskAverage||other.initialInvestment<candidate.initialInvestment||other.rubric.liquidity>candidate.rubric.liquidity)));
});

test('benchmarks reuse repository project cost and require extra capital above 28k',()=>{
  const rows=benchmarkRows(catalog,assumptions,data);
  assert.equal(rows.length,5);
  for(const row of rows){
    const existing=model(assumptions[row.id]);
    assert.equal(row.initialInvestment,existing.projectCost);
    assert.equal(row.externalCapitalRequired,Math.max(0,existing.projectCost-28000));
  }
});
