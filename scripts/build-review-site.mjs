import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = process.cwd();
const source = path.join(root, 'training-content');
const out = path.join(root, 'site');
await fs.mkdir(out, { recursive: true });
const curriculum = JSON.parse(await fs.readFile(path.join(source, 'curriculum.json'), 'utf8'));
const css = 'body{font:17px/1.65 Arial,sans-serif;max-width:900px;margin:35px auto;padding:0 24px;color:#171717}h1{line-height:1.2;border-bottom:4px solid #bd242b;padding-bottom:22px}h2{margin-top:30px}a{color:#a51f25}pre{white-space:pre-wrap;overflow-wrap:anywhere}img{max-width:100%}';
for (const course of curriculum.courses) {
  await fs.cp(path.join(source, course.folder), path.join(out, course.folder), { recursive: true });
  const lessons = path.join(out, course.folder, 'lessons');
  for (const file of await fs.readdir(lessons)) {
    if (!file.endsWith('.html')) continue;
    const target = path.join(lessons, file);
    const body = (await fs.readFile(target, 'utf8')).replace(/^[\s\S]*?(?=<h1>)/, '');
    await fs.writeFile(target, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AITS course lesson</title><style>${css}</style><nav><a href="../../index.html">← All courses</a></nav><main>${body}</main></html>`);
  }
}
for (const relative of ['sources/inventory.json', 'knowledge-base/items.json', 'knowledge-base/practice-sessions.json', 'curriculum.json', 'content-manifest.json']) {
  const target = path.join(out, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(path.join(source, relative), target);
}
let index = await fs.readFile(path.join(source, 'index.html'), 'utf8');
index = index.replace(/<aside>[\s\S]*?<\/aside>/, '<aside><strong>Public course review library.</strong> These draft materials are pending company approval. English with provisional Thai summaries. This static site provides reading and downloads; employee login, saved progress, manager reports and live AI require the separate full LMS backend. <a href="https://github.com/AITSCCTV/aits-learning-hub">Application source and deployment status</a>.</aside>');
index = index.replace(/<section><h2>Sources, knowledge and evidence[\s\S]*$/, '<section><h2>Sources and practice definitions</h2><ul><li><a href="sources/inventory.json">Source registry</a></li><li><a href="knowledge-base/items.json">Draft knowledge records</a></li><li><a href="knowledge-base/practice-sessions.json">Mentor practice definitions (not a live AI service)</a></li></ul></section></html>');
await fs.writeFile(path.join(out, 'index.html'), index);
await fs.writeFile(path.join(out, '.nojekyll'), '');
const manifest = JSON.parse(await fs.readFile(path.join(out, 'content-manifest.json'), 'utf8'));
for (const asset of manifest.assets) {
  const bytes = await fs.readFile(path.join(out, asset.path));
  asset.source_sha256 = asset.sha256;
  asset.sha256 = createHash('sha256').update(bytes).digest('hex');
  asset.bytes = bytes.length;
}
manifest.publication_note = 'HTML lessons have a navigation wrapper; source_sha256 preserves the original review-package hash.';
await fs.writeFile(path.join(out, 'content-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Built public review site with ${curriculum.courses.length} courses in site/`);
