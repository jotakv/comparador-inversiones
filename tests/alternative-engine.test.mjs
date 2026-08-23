import test from'node:test';
import assert from'node:assert/strict';
import data from'../data/alternative-investments.json'with{type:'json'};
import catalog from'../data/investments.json'with{type:'json'};
import assumptions from'../data/model-assumptions.json'with{type:'json'};
import{allocateCapital,benchmarkRows,efficientFrontier,projectScenario,scoreAlternatives,validateAlternativeData}from'../assets/js/alternative-engine.js';
import{model}from'../assets/js/finance.js';

test('45k total keeps SEPE, indemnification and savings isolated',()=>{
  assert.equal(data.capital.sepe,28000);
  assert.equal(data.capital.indemnification,12000);
  assert.equal(data.capital.savings,5000);
  assert.equal(data.capital.ownFunds,17000);
  assert.equal(data.capital.totalAvailable,45000);
  assert.equal(data.capital.externalFinance,0);
});

test('capital allocation uses restricted SEPE before named own-fund buckets',()=>{
  assert.deepEqual(allocateCapital(44000,data.capital),{sepe:28000,indemnification:12000,savings:4000,external:0,unused:1000});
  assert.deepEqual(allocateCapital(18000,data.capital),{sepe:18000,indemnification:0,savings:0,external:0,unused:27000});
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
  const base=projectScenario(alternative,'base',30),stress=projectScenario(alternative,'base',30,{revenueFactor:.7,capexFactor:1.2});
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

test('absolute score thresholds do not change when one finalist leaves the universe',()=>{
  const full=scoreAlternatives(data),alternatives=data.alternatives.slice(0,9);
  const selected=new Set(alternatives.map(item=>item.id));
  const reduced=scoreAlternatives({...data,alternatives,universe:data.universe.map(item=>({...item,selected:selected.has(item.id)})),capitalStrategies:data.capitalStrategies.filter(strategy=>selected.has(strategy.alternativeId))});
  for(const row of reduced)assert.equal(row.score,full.find(item=>item.id===row.id).score);
});

test('efficient frontier contains no dominated member',()=>{
  const rows=scoreAlternatives(data),frontier=efficientFrontier(rows);
  assert.ok(frontier.length>0);
  for(const candidate of frontier)assert.ok(!rows.some(other=>other.id!==candidate.id&&other.annualizedEconomicReturn>=candidate.annualizedEconomicReturn&&other.riskAverage<=candidate.riskAverage&&other.initialInvestment<=candidate.initialInvestment&&other.rubric.liquidity>=candidate.rubric.liquidity&&(other.annualizedEconomicReturn>candidate.annualizedEconomicReturn||other.riskAverage<candidate.riskAverage||other.initialInvestment<candidate.initialInvestment||other.rubric.liquidity>candidate.rubric.liquidity)));
});

test('benchmarks reuse repository cost and split the 28k gap from external capital above 45k',()=>{
  const rows=benchmarkRows(catalog,assumptions,data);
  assert.equal(rows.length,5);
  for(const row of rows){
    const existing=model(assumptions[row.id]);
    assert.equal(row.initialInvestment,existing.projectCost);
    assert.equal(row.capitalBeyondSepe,Math.max(0,existing.projectCost-28000));
    assert.equal(row.externalCapitalRequired,Math.max(0,existing.projectCost-45000));
    assert.ok(Number.isFinite(row.economicIrr5));
    assert.ok(row.economicPaybackMonths===null||Number.isFinite(row.economicPaybackMonths));
    assert.ok(row.economicPaybackMonths===null||row.paybackMonths===null||row.economicPaybackMonths>=row.paybackMonths,'charging founder labor cannot accelerate operating payback');
  }
});
