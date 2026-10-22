import test from 'node:test';
import assert from 'node:assert/strict';
import {runFork,summarizeFork} from '../src/lab/fork.mjs';
import {cloneAgent} from '../src/core/engine.mjs';

test('identical-evidence control produces identical full trajectories',()=>{
  for(const seed of [0,3,17,127]){
    const l=runFork({seed,scenario:'control'});assert.deepEqual(l.framesA,l.framesB);assert.deepEqual(l.a,l.b);
    assert.ok(l.paired.every(p=>p.tv===0&&p.hiddenL2===0&&!p.actionDiff));
  }
});
test('deep copies do not alias weights, memory, or hidden vectors',()=>{
  const original=runFork().checkpoint,copy=cloneAgent(original),baseline=cloneAgent(original);
  copy.hidden[0]=.99;copy.model.input[0][0]=9;copy.memory[0].bulletin=-.99;assert.deepEqual(original,baseline);
});
test('branches use the same draw at every paired decision',()=>{
  for(const scenario of ['bulletin','latency','reliability','control']){
    const l=runFork({scenario});assert.deepEqual(l.framesA.map(f=>f.draw),l.framesB.map(f=>f.draw));
  }
});
test('bulletin intervention changes only its declared channel at the split',()=>{
  const l=runFork(),a=l.framesA[0],b=l.framesB[0];
  assert.deepEqual(a.raw,b.raw);assert.equal(b.effective[1],-a.effective[1]);
  a.effective.forEach((v,i)=>{if(i!==1)assert.equal(v,b.effective[i]);});
});
test('intervention ends at the configured boundary',()=>{
  const l=runFork();assert.equal(l.framesB.filter(f=>f.active).length,18);
  assert.equal(l.framesB[17].worldTick,41);assert.equal(l.framesB[18].active,false);
});
test('late evidence changes hidden state without requiring an action disagreement',()=>{
  const l=runFork({scenario:'latency'}),s=summarizeFork(l);
  assert.equal(s.disagreements,0);assert.ok(s.meanTV>0);assert.ok(s.maxHiddenL2>0);assert.notDeepEqual(l.framesA[0].hidden,l.framesB[0].hidden);
});
test('recorded bulletin result is reproducible',()=>{
  const s=summarizeFork(runFork());assert.equal(s.firstActionDifference,25);assert.equal(s.disagreements,19);assert.equal(s.comparedDecisions,72);
});
test('scenario choice does not alter the checkpoint or external world',()=>{
  const a=runFork(),b=runFork({scenario:'reliability'});assert.deepEqual(a.checkpoint,b.checkpoint);assert.deepEqual(a.world,b.world);
});
