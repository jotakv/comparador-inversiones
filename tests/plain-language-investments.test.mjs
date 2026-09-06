import test from'node:test';
import assert from'node:assert/strict';
import registry from'../data/plain-language-investments.json' with{type:'json'};
import assumptions from'../data/model-assumptions.json' with{type:'json'};
import{model}from'../assets/js/finance.js';

const bySlug=Object.fromEntries(registry.investments.map(item=>[item.slug,item]));

test('plain-language registry exposes the four requested, unique routes',()=>{
  assert.deepEqual(Object.keys(bySlug).sort(),['aguilas','castellon','el-ejido','talavera']);
  assert.equal(new Set(registry.investments.map(item=>item.page)).size,4);
  for(const item of registry.investments){
    assert.ok(item.summary.length>60,`${item.slug}: summary`);
    for(const field of['steps','moneyIn','moneyOut','work','success','failure','dataStates','glossary'])assert.ok(item[field].length,`${item.slug}: ${field}`);
  }
});

test('model-backed explanations resolve to the canonical assumptions',()=>{
  for(const item of registry.investments.filter(item=>item.modelId)){
    assert.ok(assumptions[item.modelId],item.modelId);
    const result=model(assumptions[item.modelId]);
    assert.ok(result.projectCost>0);
    assert.equal(result.years.length,11);
  }
});

test('Castellón remains explicitly unmodelled instead of borrowing figures',()=>{
  const item=bySlug.castellon;
  assert.equal(item.modelId,null);
  assert.match(JSON.stringify(item),/no (?:contiene|consta|disponible)|pendiente/iu);
  assert.ok(item.dataStates.every(row=>row[2]==='PENDIENTE'));
});

test('every evidence state is visible as text, not represented only by colour',()=>{
  const allowed=new Set(['CONFIRMADO','ESTIMADO','HIPÓTESIS','PENDIENTE']);
  for(const item of registry.investments)for(const row of item.dataStates)assert.ok(allowed.has(row[2]),`${item.slug}: ${row[2]}`);
});
