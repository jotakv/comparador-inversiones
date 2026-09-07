import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateMadridAgency,calculateAgencyScenarios,initialCapital} from '../assets/js/madrid-last-mile-engine.js';
const input=JSON.parse(await readFile(new URL('../data/madrid-last-mile-agency.json',import.meta.url),'utf8'));
test('objetivo Madrid reconcilia canales, estructura y margen pre-tax',()=>{const r=calculateMadridAgency(input);assert.equal(1686*.25,421.5);assert.equal(r.catcher.agencyMargin,421.5);assert.equal(2*60*26*.8,2496);assert.equal(r.amazon.grossRevenue,2496);assert.equal(r.amazon.courierPay,1560);assert.equal(r.amazon.agencyMargin,936);assert.equal(r.revenue,4182);assert.equal(r.courierPayments,2824.5);assert.equal(r.contribution,1357.5);assert.equal(r.fixedCosts,420);assert.equal(r.preTax,937.5);assert.equal(r.annualPreTax,11250);assert.ok(Math.abs(r.margin-.2241750359)<1e-9);assert.equal(r.breakEven.afterStructure,1.5)});
test('cinco escenarios se derivan de volumen Amazon, margen Catcher y estructura',()=>{const rows=calculateAgencyScenarios(input);assert.deepEqual(rows.map(x=>x.amazonMargin),[468,780,936,1248,1560]);assert.deepEqual(rows.map(x=>x.contribution),[851,1201.5,1357.5,1707.75,2058]);assert.deepEqual(rows.map(x=>x.preTax),[431,781.5,937.5,1287.75,1638])});
test('capital LOW BASE HIGH suma exclusivamente inputs editables',()=>{assert.deepEqual(['low','base','high'].map(k=>initialCapital(input,k).total),[2500,4500,7000])});
