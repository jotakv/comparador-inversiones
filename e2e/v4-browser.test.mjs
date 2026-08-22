import test,{after,before} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const pages={
  'projections.html':{heading:/Investment Projection Center/i,charts:10,content:['Águilas - local a vivienda','Reus - alquiler de trasteros','2 furgonetas para carsharing','2 camper vans para alquiler','Madrid - local a vivienda']},
  'executive-summary.html':{heading:/RESUMEN EJECUTIVO/i,charts:5,content:['TIR','VAN','MOIC','Confianza']},
  'analytics.html':{heading:/Analytics Center/i,charts:6,content:['Return Analytics','Cash Flow Analytics','Risk Analytics']},
  'data-quality.html':{heading:/Data Quality Center/i,charts:0,content:['VERIFIED','MARKET OBSERVED','UNKNOWN','Sensibilidad']},
  'report.html':{heading:/RESUMEN DEL INFORME/i,charts:5,content:['Capital','Ranking','Due diligence','Próximos pasos']}
};
let server,browser;
before(async()=>{server=spawn('python3',['-m','http.server','8765','--directory','..'],{stdio:'ignore'});for(let i=0;i<30;i++){try{const r=await fetch('http://127.0.0.1:8765/comparador-inversiones/index.html');if(r.ok)break}catch{}await new Promise(r=>setTimeout(r,100))}browser=await chromium.launch({headless:true})});
after(async()=>{await browser?.close();server?.kill()});
for(const [name,expect] of Object.entries(pages))test(`${name} renders under project subpath`,async()=>{const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],failed=[];page.on('console',m=>m.type()==='error'&&errors.push(m.text()));page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(`${r.url()}: ${r.failure()?.errorText}`));const response=await page.goto(`http://127.0.0.1:8765/comparador-inversiones/${name}`,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.equal(await page.locator('main').count(),1);assert.match(await page.locator('main').innerText(),expect.heading);for(const value of expect.content)assert.ok((await page.locator('main').innerText()).toLocaleLowerCase('es').includes(value.toLocaleLowerCase('es')),`${name}: ${value}`);assert.equal(await page.locator('.error-state').count(),0);assert.equal(errors.length,0,errors.join('\n'));assert.equal(failed.length,0,failed.join('\n'));const charts=page.locator('main svg');assert.ok(await charts.count()>=expect.charts);for(let i=0;i<await charts.count();i++){const box=await charts.nth(i).boundingBox();assert.ok(box&&box.width>0&&box.height>0,`${name}: chart ${i}`)}const text=await page.locator('main').innerText();assert.doesNotMatch(text,/undefined|NaN|Infinity/);await page.close()});
