import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

// A DOM wiring harness, not a browser engine or a visual browser test.
async function loadUI(){
  const nodes=new Map(),downloads=[],ctx=new Proxy({measureText:s=>({width:String(s).length*13})},{get:(o,k)=>k in o?o[k]:(()=>{})});
  function element(id=''){
    return {id,value:'',children:[],dataset:{},attributes:{},listeners:{},style:{},appendChild(n){this.children.push(n);},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){this.listeners[k]=v;},click(){downloads.push(this.download);this.listeners.click?.({});},getContext:()=>ctx,toBlob:cb=>cb(new Blob(['png'],{type:'image/png'}))};
  }
  for(const id of ['figure','scenario','seed','fork','tick','tick-output','plates','run','title','caption','status','png','checkpoint','receipt'])nodes.set(id,element(id));
  for(const [id,value] of [['seed','17'],['fork','24'],['tick','32'],['scenario','bulletin']])nodes.get(id).value=value;
  let fetches=0;
  class FakeImage{constructor(){this.width=1024;this.height=1024;}set src(v){this.url=v;queueMicrotask(()=>this.onload());}}
  const sandbox={document:{getElementById:id=>nodes.get(id),createElement:()=>element()},Image:FakeImage,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}},setTimeout:()=>{},queueMicrotask,console,fetch:()=>{fetches++;throw new Error('Offline bundle attempted a fetch');}};
  const html=await readFile(new URL('../Forklet.html',import.meta.url),'utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const context=vm.createContext(sandbox);new vm.Script(script,{filename:'Forklet.html'}).runInContext(context);
  for(let i=0;i<5&&!context.FORKLET_TEST;i++)await new Promise(resolve=>setImmediate(resolve));
  assert.ok(context.FORKLET_TEST,'app booted');return {context,nodes,downloads,fetches};
}
test('standalone bundle boots offline with twelve plate choices',async()=>{
  const ui=await loadUI();assert.equal(ui.fetches,0);assert.equal(ui.nodes.get('plates').children.length,12);assert.ok(ui.nodes.get('caption').textContent.length>30);
});
test('all plate controls call the renderer and update accessible labels',async()=>{
  const {nodes}=await loadUI();for(const b of nodes.get('plates').children){b.click();assert.equal(b.attributes['aria-current'],'true');assert.ok(nodes.get('figure').attributes['aria-label'].length>50);}
});
test('running the control updates the visible result',async()=>{
  const {nodes,context}=await loadUI();nodes.get('scenario').value='control';nodes.get('run').click();assert.equal(context.FORKLET_TEST.state.lab.config.scenario,'control');assert.match(nodes.get('status').textContent,/0\/72/);
});
test('invalid form input displays an error without replacing the run',async()=>{
  const {nodes,context}=await loadUI();nodes.get('seed').value='-1';nodes.get('run').click();assert.match(nodes.get('status').textContent,/uint32/);assert.equal(context.FORKLET_TEST.state.lab.config.seed,17);
});
test('exports create download links and the scrubber selects a decision',async()=>{
  const {nodes,downloads,context}=await loadUI();nodes.get('tick').value='50';nodes.get('tick').listeners.input();assert.equal(context.FORKLET_TEST.state.focusTick,50);
  for(const id of ['png','checkpoint','receipt'])nodes.get(id).click();assert.ok(downloads.includes('forklet-checkpoint.json'));assert.ok(downloads.includes('forklet-receipt.json'));assert.ok(downloads.includes('forklet-origin-seed-17.png'));
});
