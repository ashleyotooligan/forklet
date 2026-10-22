import {runFork,summarizeFork,forkReceipt} from '../lab/fork.mjs';
import {envelope} from '../core/engine.mjs';
import {SCENARIOS} from '../core/config.mjs';
import {PLATES} from './plates.mjs';
import {renderForklet} from './render.mjs';

async function boot(){
  const $=id=>document.getElementById(id),canvas=$('figure'),ctx=canvas.getContext('2d');
  const loadImage=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Artwork could not load. Use Forklet.html or the local server.'));img.src=src;});
  const embedded=globalThis.FORKLET_EMBEDDED;
  const [agent,pair,batch]=await Promise.all([
    loadImage(embedded?.agent??'assets/brand/forklet-agent.png'),
    loadImage(embedded?.pair??'assets/art/forklet-pair.png'),
    embedded?Promise.resolve(embedded.batch):fetch('data/batch.json').then(r=>{if(!r.ok)throw new Error('Study data missing. Run npm run experiments.');return r.json();})
  ]);
  const state={lab:runFork(),plate:'origin',focusTick:32,art:{agent,pair},batch};
  for(const item of SCENARIOS){const option=document.createElement('option');option.value=item.id;option.textContent=item.name;$('scenario').appendChild(option);}
  for(const [i,plate] of PLATES.entries()){
    const button=document.createElement('button');button.type='button';button.textContent=plate.name;button.dataset.plate=plate.id;
    button.addEventListener('click',()=>{state.plate=plate.id;draw();});$('plates').appendChild(button);
  }
  function draw(){
    renderForklet(ctx,state);
    const plate=PLATES.find(v=>v.id===state.plate),s=summarizeFork(state.lab);
    $('title').textContent=plate.title;$('caption').textContent=plate.caption;
    canvas.setAttribute('aria-label',`${plate.title}. ${plate.caption} Seed ${state.lab.config.seed}. ${s.disagreements} action disagreements in ${s.comparedDecisions} paired decisions.`);
    $('tick-output').textContent=state.focusTick;
    $('status').textContent=`state ${state.lab.stateId} · ${s.disagreements}/${s.comparedDecisions} differing actions · mean TV ${s.meanTV.toFixed(3)} · synthetic / no wallet`;
    for(const b of $('plates').children)b.setAttribute('aria-current',String(b.dataset.plate===state.plate));
  }
  $('run').addEventListener('click',()=>{
    try{
      state.lab=runFork({seed:Number($('seed').value),forkAt:Number($('fork').value),scenario:$('scenario').value});
      $('tick').min=state.lab.config.forkAt+1;
      state.focusTick=Math.max(state.lab.config.forkAt+1,Math.min(96,state.focusTick));$('tick').value=state.focusTick;draw();
    }catch(error){$('status').textContent=error.message;}
  });
  $('tick').addEventListener('input',()=>{state.focusTick=Number($('tick').value);draw();});
  function save(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function saveJSON(data,name){save(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}),name);}
  $('png').addEventListener('click',()=>canvas.toBlob(blob=>{if(blob)save(blob,`forklet-${state.plate}-seed-${state.lab.config.seed}.png`);},'image/png'));
  $('checkpoint').addEventListener('click',()=>saveJSON(envelope(state.lab.checkpoint,state.lab.config),'forklet-checkpoint.json'));
  $('receipt').addEventListener('click',()=>saveJSON(forkReceipt(state.lab),'forklet-receipt.json'));
  canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const i=PLATES.findIndex(v=>v.id===state.plate);state.plate=PLATES[(i+(event.key==='ArrowRight'?1:-1)+PLATES.length)%PLATES.length].id;draw();});
  globalThis.FORKLET_TEST={state,draw};
  draw();
}
boot().catch(error=>{document.getElementById('status').textContent=error.message;console.error(error);});
