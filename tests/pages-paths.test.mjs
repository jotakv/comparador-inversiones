import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicHtml = [
  'index.html', 'projections.html', 'executive-summary.html', 'analytics.html', 'alternatives.html', 'data-quality.html', 'report.html', 'decision-lab.html', 'compare.html', 'escenarios.html', 'riesgos.html', 'metodologia.html',
  'fuentes.html', 'glosario.html', 'inversiones/aguilas.html',
  'inversiones/reus-trasteros.html', 'inversiones/l3h2-madrid.html',
  'inversiones/campers.html', 'inversiones/tinamus.html',
  'inversiones/el-ejido-delegado.html',
  'inversiones/local-generico.html'
];

async function filesBelow(directory, extensions) {
  const entries = await readdir(join(root, directory), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(path, extensions));
    else if (extensions.some(extension => entry.name.endsWith(extension))) files.push(path);
  }
  return files;
}

test('public pages and required metadata exist', async () => {
  for (const page of publicHtml) {
    const html = await readFile(join(root, page), 'utf8');
    assert.match(html, /<meta charset=["']utf-8["']/i, `${page}: charset`);
    assert.match(html, /<meta name=["']viewport["']/i, `${page}: viewport`);
    assert.match(html, /<title>[^<]+<\/title>/i, `${page}: title`);
  }
});

test('browser resources never use the domain root', async () => {
  const files = [
    ...publicHtml,
    ...await filesBelow('assets', ['.js', '.css'])
  ];
  const forbidden = [
    /(?:href|src)\s*=\s*["']\/(?!\/)/i,
    /fetch\s*\(\s*["']\/(?!\/)/i,
    /url\s*\(\s*["']?\/(?!\/)/i,
    /(?:from|import)\s*["']\/(?!\/)/i,
    /(?:location\.href|window\.location)\s*=\s*["']\/(?!\/)/i,
    /["']\/(?:assets|data|inversiones)\//i
  ];
  for (const file of files) {
    const source = await readFile(join(root, file), 'utf8');
    for (const pattern of forbidden) assert.doesNotMatch(source, pattern, `${file}: ${pattern}`);
    assert.doesNotMatch(source, /(?:src|href)=["']http:\/\//i, `${file}: mixed content`);
  }
});

test('static HTML references resolve to files', async () => {
  for (const page of publicHtml) {
    const html = await readFile(join(root, page), 'utf8');
    for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
      const reference = match[1];
      if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(reference) || reference.includes('${')) continue;
      const target = normalize(join(root, dirname(page), reference.split(/[?#]/)[0]));
      assert.ok(relative(root, target) && !relative(root, target).startsWith('..'), `${page}: unsafe ${reference}`);
      assert.ok((await stat(target)).isFile(), `${page}: missing ${reference}`);
    }
  }
});

test('all published datasets are valid JSON', async () => {
  const files = await filesBelow('data', ['.json']);
  assert.ok(files.length >= 8, 'expected browser datasets');
  for (const file of files) {
    const source = await readFile(join(root, file), 'utf8');
    assert.doesNotThrow(() => JSON.parse(source), file);
  }
});

test('resource resolver derives the Project Pages base from its module URL', async () => {
  const source = await readFile(join(root, 'assets/js/common.js'), 'utf8');
  assert.match(source, /new URL\('\.\.\/\.\.\/',import\.meta\.url\)/);
  assert.match(source, /url=appUrl\(path\),response=await fetch\(url\)/);
});
