import test from 'node:test';
import assert from 'node:assert/strict';
import {config} from '../src/core/config.mjs';
import {cloneAgent,envelope,restoreEnvelope,validateState,decision} from '../src/core/engine.mjs';
import {runFork,forkReceipt} from '../src/lab/fork.mjs';

test('JSON checkpoint replays the original branch exactly',()=>{
  const l=runFork(),payload=JSON.parse(JSON.stringify(envelope(l.checkpoint,l.config))),r=restoreEnvelope(payload),frames=[];
  while(r.state.tick<r.config.horizon)frames.push(decision(r.state,l.world,r.config,false));
  assert.deepEqual(frames,l.framesA);assert.deepEqual(r.state,l.a);
});
test('restored state does not share references with the supplied object',()=>{
  const l=runFork(),e=envelope(l.checkpoint,l.config),r=restoreEnvelope(e);r.state.model.bias[0]=2;assert.notEqual(e.state.model.bias[0],2);
});
test('receipt states its actual non-cryptographic identity scheme',()=>{
  const r=forkReceipt(runFork());assert.equal(r.synthetic,true);assert.match(r.stateIdType,/not a cryptographic proof/);assert.equal(r.checkpoint.tick,24);
});
test('configuration rejects malformed bounds and unknown studies',()=>{
  for(const bad of [{seed:-1},{seed:1.2},{horizon:4},{forkAt:95},{scenario:'magic'},{feeRate:NaN},{feeRate:.5},{duration:0}])assert.throws(()=>config(bad));
});
test('state validation rejects invalid or unsafe numeric payloads',()=>{
  const original=runFork().checkpoint;
  for(const mutate of [s=>s.hidden.pop(),s=>s.hidden[0]=Infinity,s=>s.model.input[0][0]=1e308,s=>s.cash=-1,s=>s.lastMove=7,s=>s.memory[0].reliability=2,s=>s.rng=-1,s=>s.schema='unknown']){
    const s=cloneAgent(original);mutate(s);assert.throws(()=>validateState(s));
  }
});
test('checkpoint must match seed and declared split tick',()=>{
  const l=runFork(),e=envelope(l.checkpoint,l.config);e.state.seed++;assert.throws(()=>restoreEnvelope(e));
  const b=envelope(l.checkpoint,l.config);b.state.tick++;assert.throws(()=>restoreEnvelope(b));assert.throws(()=>restoreEnvelope(null));
});
