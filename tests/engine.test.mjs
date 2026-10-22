import test from 'node:test';
import assert from 'node:assert/strict';
import {config} from '../src/core/config.mjs';
import {createAgent,decision,applyTrade,sample} from '../src/core/engine.mjs';
import {makeWorld} from '../src/core/world.mjs';
import {nextRandom} from '../src/core/random.mjs';

test('seeded stream is serializable and deterministic',()=>{
  const a=nextRandom(17),b=nextRandom(17);assert.deepEqual(a,b);
  assert.ok(a.value>=0&&a.value<1);assert.notEqual(nextRandom(a.state).value,a.value);
});
test('fictional world is independent of agent execution',()=>{
  const c=config(),before=makeWorld(c.seed,c.horizon),state=createAgent(c);
  for(let i=0;i<96;i++)decision(state,before,c);
  assert.deepEqual(before,makeWorld(c.seed,c.horizon));assert.notDeepEqual(before,makeWorld(18,c.horizon));
});
test('all probabilities normalize and activations remain bounded',()=>{
  for(const seed of [0,17,4294967295]){
    const c=config({seed}),world=makeWorld(seed,c.horizon),state=createAgent(c);
    for(let i=0;i<c.horizon;i++){
      const f=decision(state,world,c);
      assert.ok(Math.abs(f.probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
      assert.ok(f.probabilities.every(p=>p>=0&&p<=1));assert.ok(f.hidden.every(h=>Math.abs(h)<=1));
      assert.ok(state.cash>=0&&state.units>=0);assert.ok(Number.isFinite(f.equity));
    }
  }
});
test('ADD reduces marked wealth by the fee at a fixed price',()=>{
  const s=createAgent(config()),before=s.cash+s.units*.25,t=applyTrade(s,0,.25,.003);
  assert.ok(Math.abs(before-(s.cash+s.units*.25)-t.fee)<1e-12);
  assert.equal(t.notional,.35);assert.ok(s.units>0);
});
test('REDUCE respects available inventory and conserves value less fee',()=>{
  const s=createAgent(config());s.units=.4;const before=s.cash+s.units*.25,t=applyTrade(s,2,.25,.003);
  assert.equal(s.units,0);assert.ok(Math.abs(before-(s.cash+s.units*.25)-t.fee)<1e-12);
});
test('HOLD does not change balances or fees',()=>{
  const s=createAgent(config()),before={cash:s.cash,units:s.units,fees:s.fees};
  assert.deepEqual(applyTrade(s,1,.25,.003),{units:0,fee:0,notional:0});
  assert.deepEqual({cash:s.cash,units:s.units,fees:s.fees},before);
});
test('exposure cap prevents unconstrained accumulation',()=>{
  const s=createAgent(config());for(let i=0;i<200;i++)applyTrade(s,0,.25,.003);
  assert.ok(s.units*.25/(s.cash+s.units*.25)<=.600001);
});
test('sampling uses cumulative probability boundaries',()=>{
  assert.equal(sample([.2,.5,.3],.1),0);assert.equal(sample([.2,.5,.3],.2),1);assert.equal(sample([.2,.5,.3],.99),2);
});
