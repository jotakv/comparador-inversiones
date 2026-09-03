import test,{after,before} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const pages={
  'projections.html':{heading:/Investment Projection Center/i,charts:10,content:['Águilas - local a vivienda','Reus - alquiler de trasteros','2 furgonetas para carsharing','2 camper vans para alquiler','Madrid - local a vivienda','El Ejido — Local + reparto externalizado']},
  'executive-summary.html':{heading:/RESUMEN EJECUTIVO/i,charts:5,content:['TIR','VAN','MOIC','Confianza']},
  'analytics.html':{heading:/Analytics Center/i,charts:6,content:['Return Analytics','Cash Flow Analytics','Risk Analytics']},
  'alternatives.html':{heading:/Capital productivo/i,charts:3,content:['45.000 €','28.000 €','12.000 €','5.000 €','Top 10 oportunidades','Frontera eficiente','Clinic AI OS','Edge-AI visual','Benchmarks','Moonshots']},
  'data-quality.html':{heading:/Data Quality Center/i,charts:0,content:['VERIFIED','MARKET OBSERVED','UNKNOWN','Sensibilidad']},
  'report.html':{heading:/RESUMEN DEL INFORME/i,charts:5,content:['Capital','Ranking','Due diligence','Próximos pasos']}
};
let server,browser;
before(async()=>{server=spawn('python3',['-m','http.server','8765','--directory','..'],{stdio:'ignore'});for(let i=0;i<30;i++){try{const r=await fetch('http://127.0.0.1:8765/comparador-inversiones/index.html');if(r.ok)break}catch{}await new Promise(r=>setTimeout(r,100))}browser=await chromium.launch({headless:true})});
after(async()=>{await browser?.close();server?.kill()});
for(const [name,expect] of Object.entries(pages))test(`${name} renders under project subpath`,async()=>{const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],failed=[];page.on('console',m=>m.type()==='error'&&errors.push(m.text()));page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(`${r.url()}: ${r.failure()?.errorText}`));const response=await page.goto(`http://127.0.0.1:8765/comparador-inversiones/${name}`,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.equal(await page.locator('main').count(),1);const text=(await page.locator('main').innerText()).replace(/\s/g,' ');assert.match(text,expect.heading);for(const value of expect.content)assert.ok(text.toLocaleLowerCase('es').includes(value.toLocaleLowerCase('es')),`${name}: ${value}`);assert.equal(await page.locator('.error-state').count(),0);assert.equal(errors.length,0,errors.join('\n'));assert.equal(failed.length,0,failed.join('\n'));const charts=page.locator('main svg');assert.ok(await charts.count()>=expect.charts);for(let i=0;i<await charts.count();i++){const box=await charts.nth(i).boundingBox();assert.ok(box&&box.width>0&&box.height>0,`${name}: chart ${i}`)}assert.doesNotMatch(text,/undefined|NaN|Infinity/);await page.close()});

test('alternatives filters and detail remain interactive on mobile',async()=>{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('console',message=>message.type()==='error'&&errors.push(message.text()));
  await page.goto('http://127.0.0.1:8765/comparador-inversiones/alternatives.html',{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390,'mobile page must not overflow the viewport');
  await page.selectOption('#filter-capital','20000');
  assert.match(await page.locator('#filter-summary').innerText(),/1 de 10/);
  assert.equal(await page.locator('#alternative-ranking tbody tr').count(),1);
  assert.match(await page.locator('#alternative-ranking').innerText(),/Clinic AI OS/);
  await page.click('#reset-alternative-filters');
  assert.match(await page.locator('#filter-summary').innerText(),/10 de 10/);
  await page.locator('[data-select="digital-twin-studio"]').first().click();
  assert.match(await page.locator('#alternative-detail').innerText(),/Estudio móvil de gemelos digitales/);
  assert.equal(await page.locator('.error-state').count(),0);
  assert.equal(errors.length,0,errors.join('\n'));
  await page.close();
});

test('El Ejido is selectable, ranked and its detail works under Project Pages',async()=>{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],failed=[];
  page.on('console',message=>message.type()==='error'&&errors.push(message.text()));
  page.on('pageerror',error=>errors.push(error.message));
  page.on('requestfailed',request=>failed.push(request.url()));
  await page.goto('http://127.0.0.1:8765/comparador-inversiones/compare.html',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#a option[value="el-ejido-outsourced-last-mile"]').count(),1);
  await page.selectOption('#a','el-ejido-outsourced-last-mile');
  assert.match(await page.locator('#comparison').innerText(),/El Ejido/);
  await page.goto('http://127.0.0.1:8765/comparador-inversiones/inversiones/el-ejido-delegado.html',{waitUntil:'networkidle'});
  const text=await page.locator('main').innerText();
  for(const value of ['57.960','46.368','23.184','23.174','Horas operativas propietario','0'])assert.ok(text.includes(value),value);
  assert.equal(await page.locator('main svg').count(),13);
  assert.equal(errors.length,0,errors.join('\n'));assert.equal(failed.length,0,failed.join('\n'));
  await page.close();
});
