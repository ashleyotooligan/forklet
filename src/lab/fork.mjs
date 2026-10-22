import {config} from '../core/config.mjs';
import {debugId,mean} from '../core/random.mjs';
import {makeWorld} from '../core/world.mjs';
import {createAgent,cloneAgent,decision} from '../core/engine.mjs';
export function runFork(overrides={}){
 const c=config(overrides),world=makeWorld(c.seed,c.horizon),parent=createAgent(c),prefix=[];
 while(parent.tick<c.forkAt)prefix.push(decision(parent,world,c,false));
 const checkpoint=cloneAgent(parent),a=cloneAgent(checkpoint),b=cloneAgent(checkpoint),framesA=[],framesB=[];
 while(a.tick<c.horizon){framesA.push(decision(a,world,c,false));framesB.push(decision(b,world,c,true));}
 const paired=framesA.map((aa,i)=>{const bb=framesB[i];return {tick:aa.tick,actionDiff:aa.action!==bb.action,tv:.5*aa.probabilities.reduce((s,p,j)=>s+Math.abs(p-bb.probabilities[j]),0),hiddenL2:Math.hypot(...aa.hidden.map((v,j)=>v-bb.hidden[j])),equityGap:bb.equity-aa.equity};});
 return {config:c,world,checkpoint,stateId:debugId(checkpoint),prefix,a,b,framesA,framesB,paired};
}
export function summarizeFork(lab){const p=lab.paired;return {seed:lab.config.seed,scenario:lab.config.scenario,forkAt:lab.config.forkAt,horizon:lab.config.horizon,stateId:lab.stateId,firstActionDifference:p.find(v=>v.actionDiff)?.tick??null,disagreements:p.filter(v=>v.actionDiff).length,comparedDecisions:p.length,meanTV:mean(p.map(v=>v.tv)),maxHiddenL2:Math.max(...p.map(v=>v.hiddenL2)),finalEquityA:lab.framesA.at(-1).equity,finalEquityB:lab.framesB.at(-1).equity,feesA:lab.a.fees,feesB:lab.b.fees};}
export function forkReceipt(lab){return {schema:'forklet/receipt/1',synthetic:true,engine:'classical recurrent toy model',stateIdType:'FNV-1a debug checksum, not a cryptographic proof',stateId:lab.stateId,config:lab.config,summary:summarizeFork(lab),checkpoint:lab.checkpoint};}
