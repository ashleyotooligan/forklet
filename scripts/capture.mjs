import {createRequire} from 'node:module';
import {mkdir,writeFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {runFork} from '../src/lab/fork.mjs';
import {runBatch} from './experiments.mjs';
import {PLATES} from '../src/view/plates.mjs';
import {renderForklet} from '../src/view/render.mjs';
import {C,text,photo,rule} from '../src/view/ink.mjs';

const require=createRequire(import.meta.url);
let raster;
try{raster=require(process.env.FORKLET_CANVAS_MODULE??'@napi-rs/canvas');}
catch{throw new Error('Optional renderer missing. Install npm install --no-save --package-lock=false @napi-rs/canvas, then retry.');}
const {createCanvas,loadImage,GlobalFonts}=raster;
const fontDir=process.env.FORKLET_FONT_DIR??'/usr/share/fonts/truetype/dejavu';
for(const [file,family] of [['DejaVuSans.ttf','DejaVu Sans'],['DejaVuSerif.ttf','DejaVu Serif'],['DejaVuSansMono.ttf','DejaVu Sans Mono']]){
  const name=fontDir+'/'+file;await access(name);GlobalFonts.registerFromPath(name,family);
}
const root=fileURLToPath(new URL('../',import.meta.url));
await mkdir(root+'assets/screenshots',{recursive:true});
const art={agent:await loadImage(root+'assets/brand/forklet-agent.png'),pair:await loadImage(root+'assets/art/forklet-pair.png')};
const canvas=createCanvas(1440,1080),ctx=canvas.getContext('2d');
const state={lab:runFork(),plate:'origin',focusTick:32,art,batch:runBatch()};
const tracked=new Proxy(ctx,{
  get(target,key){
    if(key==='fillText')return (label,x,y,...rest)=>{
      const m=target.getTransform(),width=target.measureText(String(label)).width,height=parseFloat(target.font)*1.12;
      for(const [xx,yy] of [[x,y],[x+width,y],[x,y+height],[x+width,y+height]]){
        const px=m.a*xx+m.c*yy+m.e,py=m.b*xx+m.d*yy+m.f;
        if(px<0||px>1440||py<0||py>1080)throw new Error(`Text outside ${state.plate}: ${label}`);
      }
      return target.fillText(label,x,y,...rest);
    };
    const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
  },
  set(target,key,value){return Reflect.set(target,key,value,target);}
});
for(const [i,plate] of PLATES.entries()){
  state.plate=plate.id;renderForklet(tracked,state);
  await writeFile(root+`assets/screenshots/${String(i+1).padStart(2,'0')}-${plate.id}.png`,canvas.toBuffer('image/png'));
}
const cover=createCanvas(1600,800),c=cover.getContext('2d');c.fillStyle='#ffffff';c.fillRect(0,0,1600,800);
text(c,'forklet',78,128,142,C.ink,'serif');rule(c,86,323,659,323,C.ink,2);
text(c,'One state.',84,370,52,C.ink,'serif');text(c,'Two information paths.',84,438,52,C.ink,'serif');
text(c,'COPY / INTERVENE / COMPARE',87,621,19,C.blue,'mono');text(c,'A reproducible decision experiment',87,679,22,C.muted);
photo(c,art.agent,875,54,664,687);
await writeFile(root+'assets/brand/forklet-cover.png',cover.toBuffer('image/png'));
console.log('Rendered 12 distinct experiment plates (1440 × 1080) and a 1600 × 800 cover.');
