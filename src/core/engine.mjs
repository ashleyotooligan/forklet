import {MODEL_VERSION,config} from './config.mjs';
import {nextRandom} from './random.mjs';
import {makeModel,activate} from './network.mjs';
import {observations} from './world.mjs';
export function createAgent(c){return {schema:'forklet/state/1',modelVersion:MODEL_VERSION,seed:c.seed,tick:0,model:makeModel(c.seed),hidden:Array(8).fill(0),memory:[],cash:10,units:0,fees:0,lastMove:0,rng:(c.seed^0xc981ab7)>>>0};}
export function cloneAgent(state){return JSON.parse(JSON.stringify(state));}
export function sample(probabilities,u){let edge=0;for(let i=0;i<probabilities.length;i++){edge+=probabilities[i];if(u<edge)return i;}return probabilities.length-1;}
export function applyTrade(state,action,price,feeRate){
 let units=0,fee=0,notional=0;const equity=state.cash+state.units*price;
 if(action===0){const budget=Math.min(.35,state.cash,Math.max(0,.6*equity-state.units*price));fee=budget*feeRate;units=(budget-fee)/price;state.cash-=budget;state.units+=units;notional=budget;}
 if(action===2){units=Math.min(state.units,.35/price);const gross=units*price;fee=gross*feeRate;state.units-=units;state.cash+=gross-fee;notional=gross;}
 state.cash=Math.max(0,state.cash);state.units=Math.max(0,state.units);state.fees+=fee;state.lastMove=action===0?1:action===2?-1:0;
 return {units,fee,notional};
}
export function decision(state,world,c,intervene=false){
 const raw=observations(state,world),effective=raw.slice(),tick=state.tick;
 const active=intervene&&c.scenario!=='control'&&tick>=c.forkAt&&tick<c.forkAt+c.duration;
 let evidenceTick=tick;
 if(active&&c.scenario==='bulletin')effective[1]=-effective[1];
 if(active&&c.scenario==='latency'){evidenceTick=Math.max(0,tick-6);effective[0]=world[evidenceTick].momentum;effective[1]=world[evidenceTick].bulletin;}
 if(active&&c.scenario==='reliability')effective[3]=0.15;
 const computation=activate(state.model,state.hidden,effective,state.memory),r=nextRandom(state.rng);state.rng=r.state;
 const action=sample(computation.probabilities,r.value),price=world[tick].price;state.hidden=computation.hidden;
 state.memory.push({bulletin:effective[1],momentum:effective[0],reliability:effective[3]});if(state.memory.length>6)state.memory.shift();
 const trade=applyTrade(state,action,price,c.feeRate);state.tick++;
 return {tick:state.tick,worldTick:tick,evidenceTick,raw,effective,active,hidden:state.hidden.slice(),score:computation.score,probabilities:computation.probabilities,draw:r.value,action,price,trade,cash:state.cash,units:state.units,fees:state.fees,equity:state.cash+state.units*price};
}
export function validateState(s){
 if(!s||s.schema!=='forklet/state/1'||s.modelVersion!==MODEL_VERSION)throw new Error('unsupported state schema');
 if(!Number.isInteger(s.tick)||s.tick<0||s.tick>255||!Number.isInteger(s.seed)||s.seed<0||s.seed>0xffffffff||!Number.isInteger(s.rng)||s.rng<0||s.rng>0xffffffff)throw new Error('invalid state counters');
 if([s.cash,s.units,s.fees,s.lastMove].some(v=>!Number.isFinite(v))||s.cash<0||s.units<0||s.fees<0||![0,1,-1].includes(s.lastMove)||Math.max(s.cash,s.units,s.fees)>1e9)throw new Error('invalid resource state');
 const vec=(a,n)=>Array.isArray(a)&&a.length===n&&a.every(Number.isFinite);
 if(!vec(s.hidden,8)||s.hidden.some(v=>Math.abs(v)>1)||!s.model||!vec(s.model.bias,8)||!vec(s.model.readout,8))throw new Error('invalid neural state');
 for(const name of ['input','recurrent'])if(!Array.isArray(s.model[name])||s.model[name].length!==8||s.model[name].some(row=>!vec(row,8)))throw new Error('invalid model matrix');
 if([s.model.bias,s.model.readout,...s.model.input,...s.model.recurrent].some(row=>row.some(v=>Math.abs(v)>10)))throw new Error('model value outside supported bounds');
 if(!Array.isArray(s.memory)||s.memory.length>6||s.memory.some(v=>!v||[v.bulletin,v.momentum].some(x=>!Number.isFinite(x)||Math.abs(x)>1)||!Number.isFinite(v.reliability)||v.reliability<0||v.reliability>1))throw new Error('invalid memory');
 return true;
}
export function envelope(state,c){return {schema:'forklet/checkpoint/1',config:{...c},state:cloneAgent(state)};}
export function restoreEnvelope(payload){if(!payload||payload.schema!=='forklet/checkpoint/1')throw new Error('unsupported checkpoint');const c=config(payload.config);validateState(payload.state);if(payload.state.seed!==c.seed||payload.state.tick!==c.forkAt)throw new Error('checkpoint does not match fork configuration');return {state:cloneAgent(payload.state),config:c};}
