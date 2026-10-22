import {nextRandom,mean} from './random.mjs';
export function makeModel(seed){
 let rng=(seed^0xb178342f)>>>0;const rand=()=>{const r=nextRandom(rng);rng=r.state;return r.value;};
 const input=Array.from({length:8},(_,i)=>Array.from({length:8},(_,j)=>(rand()-.5)*.6+(j===1?(i%2===0?.7:-.5):0)));
 const recurrent=Array.from({length:8},(_,i)=>Array.from({length:8},(_,j)=>i===j?.48:(rand()-.5)*.12));
 return {input,recurrent,bias:Array.from({length:8},()=> (rand()-.5)*.12),readout:[.22,-.18,.16,-.12,.18,-.08,.1,-.1]};
}
export function activate(model,hidden,inputs,memory){
 const next=hidden.map((_,i)=>Math.tanh(model.bias[i]+model.input[i].reduce((s,w,j)=>s+w*inputs[j],0)+model.recurrent[i].reduce((s,w,j)=>s+w*hidden[j],0)));
 const history=mean(memory.map(v=>v.bulletin));
 const score=(.65*inputs[0]+.95*inputs[1]+.20*history+next.reduce((s,v,i)=>s+v*model.readout[i],0))*inputs[3];
 const logits=[1.9*score,0.28+0.8*(1-inputs[3])+0.25*inputs[2],-1.9*score];
 const top=Math.max(...logits),weights=logits.map(v=>Math.exp(v-top)),z=weights.reduce((a,b)=>a+b,0);
 return {hidden:next,score,probabilities:weights.map(v=>v/z)};
}
