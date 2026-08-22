import test from'node:test';import assert from'node:assert/strict';import{roi,irr,npv,reusRevenue,model}from'../assets/js/finance.js';import assumptions from'../data/model-assumptions.json' with {type:'json'};
test('Reus 11 × 60 × 12 × 90% = 7,128',()=>assert.equal(reusRevenue(11,60,.9),7128));
test('ROI uses total value less investment',()=>assert.equal(roi(250,100),1.5));
test('IRR and NPV reconcile',()=>{const flows=[-100,60,60];const r=irr(flows);assert.ok(Math.abs(npv(r,flows))<.01);assert.ok(r>.12&&r<.14)});
test('cumulative cash has no double counting',()=>{const m=model(assumptions.reus);assert.equal(m.years[2].cumulative,m.years[1].flow+m.years[2].flow-m.projectCost)});
test('residual is added once in terminal flow',()=>{const m=model(assumptions.l3h2);assert.equal(m.flows[10],m.years[10].flow+m.residual)});
test('Tinamus includes future conversion capex',()=>{const m=model(assumptions.tinamus);assert.equal(m.years[2].investment,32500)});
test('camper model has exactly two units',()=>assert.equal(assumptions.campers.unitCount,2));
test('L3H2 model has exactly two units',()=>assert.equal(assumptions.l3h2.unitCount,2));
