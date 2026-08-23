import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import{entryMetrics,CAPITAL_AVAILABLE}from'../assets/js/aguilas-entry.js';
import{model}from'../assets/js/finance.js';
const assumptions=JSON.parse(fs.readFileSync(new URL('../data/model-assumptions.json',import.meta.url)));

test('Águilas separates entry cost from conditional future capex',()=>{
 const e=entryMetrics('base'),m=model(assumptions.aguilas);
 assert.equal(e.entryCost,40780);assert.equal(e.futureCapex,23700);assert.equal(e.projectCost,64480);
 assert.ok(e.entryCost<e.projectCost);assert.equal(m.years[0].investment,e.entryCost);assert.notEqual(m.years[0].investment,m.projectCost);
 assert.equal(m.years[2].investment,e.futureCapex);assert.equal(e.liquidity,CAPITAL_AVAILABLE-e.entryCost);assert.equal(e.fundingGap,0);
});

test('entry table excludes later operating and conversion items',()=>{
 const view=fs.readFileSync(new URL('../assets/js/aguilas-entry-view.js',import.meta.url),'utf8');
 const table=view.slice(view.indexOf('const rows='),view.indexOf('const table='));
 for(const excluded of ['reforma residencial','working capital','reserva','mobiliario','licencia'])assert.doesNotMatch(table,new RegExp(excluded,'i'));
 assert.match(table,/Informe preliminar técnico/);assert.match(view,/No es una licencia/);
});
