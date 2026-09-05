import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{buildProjectionSet,validateSeries,rankingAt,crossovers,metricSeries}from'../assets/js/projection-engine.js';import{buildReport}from'../assets/js/report-engine.js';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));const c=j('data/investments.json'),a=j('data/model-assumptions.json'),set=buildProjectionSet(c,a);
test('projection consistency year 0, 1 and 10',()=>{assert.equal(validateSeries(set),true);assert.deepEqual(set[0].projection.years.map(x=>x.year),[0,1,2,3,4,5,6,7,8,9,10])});
test('scenario switching changes output',()=>assert.notEqual(buildProjectionSet(c,a,'bear')[0].projection.years[10].wealth,set[0].projection.years[10].wealth));
test('ranking works at each horizon',()=>[3,5,7,10].forEach(h=>assert.equal(rankingAt(set,h).length,7)));
test('normalized index has finite aligned series',()=>metricSeries(set,'wealth',true).forEach(s=>{assert.equal(s.values.length,11);assert.ok(s.values.every(Number.isFinite))}));
test('crossover detection is deterministic',()=>assert.deepEqual(crossovers(set),crossovers(set)));
test('summary uses same engine rows',()=>{const r=buildReport(c,a);assert.equal(r.set.find(x=>x.id===r.winner.id).projection.years[10].wealth,set.find(x=>x.id===r.winner.id).projection.years[10].wealth)});
