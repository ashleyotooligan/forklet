import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runBatch} from '../scripts/experiments.mjs';
import {runFork,forkReceipt} from '../src/lab/fork.mjs';

const read=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));
test('committed twelve-seed study matches the engine',async()=>assert.deepEqual(await read('data/batch.json'),runBatch()));
test('all twelve negative controls have zero separation',()=>{
  const controls=runBatch().runs.filter(r=>r.scenario==='control');assert.equal(controls.length,12);
  assert.ok(controls.every(r=>r.disagreements===0&&r.meanTV===0&&r.maxHiddenL2===0));
});
test('committed receipt is reproducible',async()=>assert.deepEqual(await read('examples/receipt.json'),forkReceipt(runFork())));
test('committed default run records actual engine frames',async()=>{
  const r=await read('data/default-run.json'),l=runFork();assert.deepEqual(r.framesA,l.framesA);assert.deepEqual(r.framesB,l.framesB);assert.deepEqual(r.checkpoint,l.checkpoint);
});
