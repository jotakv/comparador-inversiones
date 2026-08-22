import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/investments.json' with {type:'json'};
import budgets from '../data/startup-budgets.json' with {type:'json'};
const names={tinamus:'Madrid - local a vivienda',l3h2:'2 furgonetas para carsharing',aguilas:'Águilas - local a vivienda',reus:'Reus - alquiler de trasteros',campers:'2 camper vans para alquiler'};
test('visible investment labels have a single source of truth',()=>{for(const [id,name] of Object.entries(names)){const item=catalog.investments.find(x=>x.id===id);assert.equal(item.displayName,name);assert.equal(item.name,name);assert.ok(item.shortName)}});
test('Águilas narrative preserves the commercial then residential sequence',()=>{const p=budgets.investments.aguilas;const text=JSON.stringify(p);assert.match(text,/Año 1/);assert.match(text,/Actividad comercial/i);assert.match(text,/Año 2/);assert.match(text,/cambio de uso/i)});
test('every modeled investment has a complete finite startup budget',()=>{for(const id of Object.keys(names)){const p=budgets.investments[id];assert.ok(p.items.length>=5,id);for(const row of p.items){assert.equal(row.length,8);for(const value of row.slice(1,4))assert.ok(Number.isFinite(value),`${id}: finite values`)}const base=p.items.reduce((sum,row)=>sum+row[2],0);assert.ok(base>0,`${id}: base total`);assert.ok(p.items.some(x=>x[5]==='Capital circulante'),`${id}: working capital`);assert.ok(p.items.some(x=>x[5]==='Contingencia'),`${id}: contingency`);assert.ok(Number.isFinite(base),`${id}: all-in`)}});
