import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {filesAt} from './checksums.mjs';
import {PLATES} from '../src/view/plates.mjs';
import {config} from '../src/core/config.mjs';

const root=fileURLToPath(new URL('../',import.meta.url)),files=await filesAt(),names=new Set(files);
let links=0;
for(const name of files.filter(n=>n.endsWith('.md'))){
  const markdown=await readFile(root+name,'utf8');
  for(const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)){
    const target=match[1].split('#')[0].split('?')[0];if(!target||/^[a-z]+:/i.test(target))continue;
    const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(name),decodeURIComponent(target)));
    assert.ok(names.has(resolved),`${name} links to missing or incorrectly cased ${resolved}`);links++;
  }
  for(const match of markdown.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)){
    const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(name),match[1]));assert.ok(names.has(resolved),`Missing HTML image ${resolved}`);links++;
  }
}
for(const [i,plate] of PLATES.entries()){
  const name=`assets/screenshots/${String(i+1).padStart(2,'0')}-${plate.id}.png`,b=await readFile(root+name);
  assert.equal(b.subarray(1,4).toString(),'PNG');assert.equal(b.readUInt32BE(16),1440);assert.equal(b.readUInt32BE(20),1080);
}
const cover=await readFile(root+'assets/brand/forklet-cover.png');assert.equal(cover.readUInt32BE(16),1600);assert.equal(cover.readUInt32BE(20),800);
for(const name of files.filter(n=>n.endsWith('.mjs')))execFileSync(process.execPath,['--check',root+name],{stdio:'pipe'});
for(const name of files.filter(n=>n.endsWith('.json')))JSON.parse(await readFile(root+name,'utf8'));
for(const name of files.filter(n=>/^experiments\/\d/.test(n)))config(JSON.parse(await readFile(root+name,'utf8')));
const html=await readFile(root+'Forklet.html','utf8');assert.ok(html.includes('FORKLET_EMBEDDED'));assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!/<link[^>]+href="(?!data:)/.test(html));
const batch=JSON.parse(await readFile(root+'data/batch.json','utf8'));assert.equal(batch.runs.length,48);assert.ok(batch.runs.filter(r=>r.scenario==='control').every(r=>r.disagreements===0&&r.meanTV===0));
const biggest=Math.max(...await Promise.all(files.map(async n=>(await stat(root+n)).size)));assert.ok(biggest<25*1024*1024);assert.ok(files.length+1<=100);
console.log(`Checked ${files.length+1} package files; ${links} local links; 12 figure PNGs; source syntax, JSON, offline embedding, controls and upload sizes.`);
