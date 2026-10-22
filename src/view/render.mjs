import {C,text,paragraph,rule,disc,photo,footer,series,axes,signedBars} from './ink.mjs';
import {probabilityRows,radar,film,splitPath} from './figures.mjs';
import {PLATES} from './plates.mjs';
import {SCENARIOS,ACTIONS} from '../core/config.mjs';
import {summarizeFork} from '../lab/fork.mjs';
export const SIZE={width:1440,height:1080};
export function renderForklet(c,state){
 const lab=state.lab,summary=summarizeFork(lab),plate=PLATES.find(p=>p.id===state.plate)||PLATES[0],number=PLATES.indexOf(plate)+1;
 const scenario=SCENARIOS.find(s=>s.id===lab.config.scenario),focus=state.focusTick??lab.config.forkAt+8;
 const at=frames=>frames.find(f=>f.tick===focus)||frames.at(-1),fa=at(lab.framesA),fb=at(lab.framesB);
 const allA=[...lab.prefix,...lab.framesA],allB=[...lab.prefix,...lab.framesB],id=plate.id;
 const bg=['origin','timeline','portrait'].includes(id)?C.white:['evidence','memory','batch'].includes(id)?C.night:id==='lineage'?C.lightBlue:C.paper;
 c.clearRect(0,0,1440,1080);c.fillStyle=bg;c.fillRect(0,0,1440,1080);
 const dark=bg===C.night,ink=dark?'#f5f2ed':C.ink,muted=dark?'#b8c2d2':C.muted;
 if(id==='origin'){
  text(c,'FORKLET',77,72,24,C.ink,'mono');rule(c,78,116,574,116,C.ink,2);text(c,'A shared',74,194,86,C.ink,'serif');text(c,'beginning.',74,299,86,C.ink,'serif');
  paragraph(c,'Copy a decision system. Change one stream of evidence. Follow the difference.',80,463,590,27,C.muted,41);photo(c,state.art.agent,745,128,630,665);
  c.fillStyle=C.night;c.fillRect(0,814,1440,188);text(c,'01 / PRESERVE',79,852,15,'#bcc7d7','mono');text(c,'02 / INTERVENE',530,852,15,'#bcc7d7','mono');text(c,'03 / COMPARE',1023,852,15,'#bcc7d7','mono');
  text(c,'One checkpoint',79,899,26,'#f8f7f2');text(c,scenario.name,530,899,26,'#f8f7f2');text(c,summary.disagreements+' differing moves',1023,899,26,'#f8f7f2');
 }else if(id==='checkpoint'){
  text(c,'STATE PASSPORT',78,68,15,C.blue,'mono');text(c,'The moment before the split.',76,117,53,C.ink,'serif');
  c.fillStyle='#e8edf7';c.fillRect(77,246,768,671);text(c,'CHECKPOINT',110,281,18,C.blue,'mono');text(c,String(lab.config.forkAt).padStart(3,'0'),105,340,119,C.ink,'serif');text(c,'decisions already completed',113,482,22,C.muted);
  const rows=[['state identifier',lab.stateId],['weights','8 x 8 + 8 x 8'],['recurrent state','8 signed activations'],['memory',lab.checkpoint.memory.length+' recent observations'],['random state',String(lab.checkpoint.rng)],['resources',lab.checkpoint.cash.toFixed(4)+' SOL + DEMO']];
  rows.forEach(([a,b],i)=>{const yy=555+i*47;rule(c,111,yy-12,805,yy-12,'#c6cedd');text(c,a,113,yy,15,C.muted);text(c,b,418,yy,16,C.ink,'mono');});
  text(c,'THE SAVED VECTOR',899,290,15,C.muted,'mono');signedBars(c,lab.checkpoint.hidden,899,366,452,259,C.blue);paragraph(c,'Both branches receive a deep copy of this complete state.',901,744,429,26,C.ink,38);text(c,'Short ID: debug checksum, not proof.',901,932,13,C.muted);
 }else if(id==='lineage'){
  text(c,'LINEAGE / '+lab.stateId,78,68,15,C.blue,'mono');text(c,'A shared past.',76,113,67,C.ink,'serif');text(c,'A controlled fork.',76,196,67,C.ink,'serif');
  rule(c,720,326,720,434,C.ink,7);disc(c,720,335,11,C.ink);splitPath(c,720,434,365,708,C.blue);splitPath(c,720,434,1073,708,C.coral);
  disc(c,365,710,24,C.blue);disc(c,1073,710,24,C.coral);text(c,'tick '+lab.config.forkAt,758,377,20,C.ink,'mono');text(c,'A',336,762,74,C.blue,'serif');text(c,'B',1043,762,74,C.coral,'serif');
  text(c,'Original evidence',220,865,25,C.ink);text(c,scenario.name,907,865,25,C.ink);text(c,'same weights / same memory / same random stream',394,949,17,C.muted,'mono');
 }else if(id==='evidence'){
  text(c,'INFORMATION INTERVENTION',78,68,15,'#afbed7','mono');text(c,'Change the evidence.',76,117,66,ink,'serif');paragraph(c,scenario.change.replaceAll('18',String(Math.min(lab.config.duration,lab.config.horizon-lab.config.forkAt))),80,226,1190,25,'#c6cedf',37);
  const channel=lab.config.scenario==='reliability'?3:1,start=Math.max(0,lab.config.forkAt-6),end=Math.min(lab.config.horizon,lab.config.forkAt+lab.config.duration+12),a=allA.slice(start,end),b=allB.slice(start,end);
  text(c,'A / ORIGINAL',80,350,18,'#a8bfea','mono');rule(c,80,535,1350,535,'#68768d');series(c,a.map(f=>f.effective[channel]),80,398,1270,230,'#9ab7ee',-1,1,4);
  text(c,'B / INTERVENED',80,683,18,'#f2bc9f','mono');rule(c,80,868,1350,868,'#68768d');series(c,b.map(f=>f.effective[channel]),80,731,1270,230,'#f2b08e',-1,1,4);
  text(c,'DECISION '+(start+1),80,983,13,'#acb8cb','mono');text(c,'DECISION '+end,1209,983,13,'#acb8cb','mono');
 }else if(id==='timeline'){
  text(c,'THE DECISION FILM',79,67,15,C.muted,'mono');text(c,'Same draw.',75,118,73,C.ink,'serif');text(c,'Different choices.',75,206,73,C.ink,'serif');
  text(c,'A',80,400,36,C.blue,'serif');film(c,allA,183,424,1149,C.blue);text(c,'B',80,690,36,C.coral,'serif');film(c,allB,183,714,1149,C.coral);
  const fx=183+(lab.config.forkAt-.5)/(lab.config.horizon-1)*1149;c.setLineDash([6,7]);rule(c,fx,367,fx,874,C.muted,2);c.setLineDash([]);text(c,'fork',Math.min(fx+10,1290),370,13,C.muted,'mono');
  text(c,'A dot is one sampled action, not a trade guarantee.',80,942,21,C.muted);text(c,'01',184,886,13,C.muted,'mono');text(c,String(lab.config.horizon),1290,886,13,C.muted,'mono');
 }else if(id==='memory'){
  text(c,'RECURRENT STATE / DECISION '+fa.tick,78,68,15,'#b6c3d8','mono');text(c,'The difference reaches inside.',76,119,55,ink,'serif');
  radar(c,fa.hidden,400,543,242,'#a8beeb');radar(c,fb.hidden,1040,543,242,'#efb08d');text(c,'A',363,856,66,'#a8beeb','serif');text(c,'B',1003,856,66,'#efb08d','serif');
  text(c,'Eight artificial recurrent units. Radius maps -1 to +1.',80,969,20,'#c1cada');text(c,'Schematic / not biological neurons',927,972,14,'#a9b5c8');
 }else if(id==='divergence'){
  text(c,'PAIRED DIVERGENCE',78,68,15,C.lilac,'mono');text(c,'From one input',76,115,63,C.ink,'serif');text(c,'to a different policy.',76,191,63,C.ink,'serif');
  const x=154,y=362,w=1195,h=407;axes(c,x,y,w,h,0,1);const vals=[...lab.prefix.map(()=>0),...lab.paired.map(v=>v.tv)],fx=x+(lab.config.forkAt-.5)/(lab.config.horizon-1)*w,fw=Math.min(x+w-fx,lab.config.duration/(lab.config.horizon-1)*w);c.fillStyle='#e4e0ed66';c.fillRect(fx,y,fw,h);series(c,vals,x,y,w,h,C.lilac,0,1,4);text(c,'total variation distance / action probabilities',154,801,17,C.muted,'mono');
  text(c,summary.meanTV.toFixed(3),79,867,64,C.lilac,'serif');text(c,'mean probability distance',83,946,19,C.muted);text(c,summary.firstActionDifference===null?'none':'#'+summary.firstActionDifference,814,867,64,C.ink,'serif');text(c,'first action disagreement',820,946,19,C.muted);
 }else if(id==='diff'){
  c.fillStyle=C.lightBlue;c.fillRect(0,0,720,1014);c.fillStyle=C.lightCoral;c.fillRect(720,0,720,1014);
  const tick=summary.firstActionDifference??fa.tick,aa=lab.framesA.find(v=>v.tick===tick),bb=lab.framesB.find(v=>v.tick===tick);
  text(c,summary.firstActionDifference===null?'No action disagreement':'The first disagreement',78,69,46,C.ink,'serif');text(c,'DECISION '+tick,81,153,18,C.muted,'mono');
  text(c,ACTIONS[aa.action].toUpperCase(),79,257,68,C.blue,'serif');text(c,ACTIONS[bb.action].toUpperCase(),800,257,68,C.coral,'serif');
  probabilityRows(c,aa,100,413,510,C.blue);probabilityRows(c,bb,820,413,510,C.coral);rule(c,80,771,1361,771,'#bcc1c7');text(c,'ONE SHARED UNIFORM DRAW',82,814,16,C.muted,'mono');text(c,aa.draw.toFixed(8),79,858,57,C.ink,'mono');
  paragraph(c,'Different probabilities can select different actions from the same draw.',811,820,508,26,C.ink,39);
 }else if(id==='resources'){
  text(c,'PAPER RESOURCE LEDGER',78,68,15,C.muted,'mono');text(c,'Two ledgers.',76,114,71,C.ink,'serif');text(c,'One price path.',76,201,71,C.ink,'serif');
  text(c,'A / ORIGINAL',677,328,18,C.blue,'mono');text(c,'B / INTERVENED',1020,328,18,C.coral,'mono');const rows=[['Starting cash','10.0000 SOL','10.0000 SOL'],['Final cash',lab.a.cash.toFixed(4)+' SOL',lab.b.cash.toFixed(4)+' SOL'],['Final inventory',lab.a.units.toFixed(4)+' DEMO',lab.b.units.toFixed(4)+' DEMO'],['Cumulative fees',lab.a.fees.toFixed(4)+' SOL',lab.b.fees.toFixed(4)+' SOL'],['Marked value',summary.finalEquityA.toFixed(4)+' SOL',summary.finalEquityB.toFixed(4)+' SOL']];
  rows.forEach(([label,a,b],i)=>{const yy=395+i*80;rule(c,80,yy-17,1354,yy-17);text(c,label,82,yy,23,C.ink);text(c,a,677,yy+1,23,C.blue,'mono');text(c,b,1020,yy+1,23,C.coral,'mono');});
  text(c,'Synthetic SOL / DEMO',81,865,20,C.muted);series(c,lab.world.slice(0,lab.config.horizon).map(v=>v.price),682,848,669,104,C.ink,Math.min(...lab.world.map(v=>v.price)),Math.max(...lab.world.map(v=>v.price)),2);text(c,'Shared fictional price path. No market impact.',81,963,17,C.muted);
 }else if(id==='replay'){
  text(c,'THE REPLAY RECEIPT',78,68,15,C.blue,'mono');text(c,'Keep the whole starting state.',76,117,53,C.ink,'serif');
  c.save();c.translate(730,610);c.rotate(-.035);c.fillStyle='#deded8';c.fillRect(-478,-325,960,657);c.fillStyle=C.white;c.fillRect(-490,-340,960,657);text(c,'FORKLET / STATE ARCHIVE',-448,-298,22,C.blue,'mono');rule(c,-449,-244,426,-244,C.line);
  const lines=['schema        forklet/state/1','model         forklet/rnn8/1','tick          '+lab.checkpoint.tick,'state id      '+lab.stateId,'hidden        8 signed values','memory        '+lab.checkpoint.memory.length+' observations','weights       both matrices + readout','random        '+lab.checkpoint.rng,'resources     cash + inventory + fees'];lines.forEach((v,i)=>text(c,v,-448,-196+i*44,20,C.ink,'mono'));text(c,'A full state copy, not just an account balance.',-448,240,17,C.muted);c.restore();
  text(c,'Short ID is a debug checksum. Exported JSON retains the full state.',80,964,19,C.muted);
 }else if(id==='batch'){
  text(c,'TWELVE-SEED STUDY / FIXED FORK 24 / HORIZON 96',78,68,14,'#bdc8db','mono');text(c,'Repeat the comparison.',76,117,63,ink,'serif');
  const seeds=state.batch?.seeds??[],runs=state.batch?.runs??[],colors=['#9fb9e8','#f0b093','#c5b2d9','#8b9baf'];
  ['bulletin','latency','reliability','control'].forEach((name,j)=>{disc(c,83+j*332,252,5,colors[j]);text(c,name,100+j*332,241,17,colors[j],'mono');});
  for(let i=0;i<seeds.length;i++){const yy=343+i*46;text(c,String(seeds[i]).padStart(2,'0'),83,yy-5,14,'#c3ccda','mono');rule(c,151,yy+6,1320,yy+6,'#64738a33');['bulletin','latency','reliability','control'].forEach((mode,j)=>{const r=runs.find(v=>v.seed===seeds[i]&&v.scenario===mode);const xx=151+(r?.disagreements??0)/72*1165;disc(c,xx,yy+j*4,4,colors[j]);});}
  text(c,'0 disagreements',153,929,15,'#bdc8db','mono');text(c,'72 disagreements',1157,929,15,'#bdc8db','mono');text(c,'Paired action counts, not evidence of real-world performance.',80,973,19,'#c4cdde');
 }else if(id==='portrait'){
  text(c,'Forklet.',75,88,115,C.ink,'serif');text(c,'An origin worth keeping.',83,245,30,C.muted);photo(c,state.art.pair,70,317,1300,622);text(c,'A / original evidence',83,941,22,C.blue);text(c,'B / changed evidence',938,941,22,C.coral);text(c,'Original character artwork / not a visualization of model state',83,987,13,C.muted);
 }
 footer(c,number,lab.config,dark?'#9daac0':C.muted);
}
