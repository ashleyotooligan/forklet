import {nextRandom,clamp} from './random.mjs';
/** Fictional common market. Branch actions cannot change this path. */
export function makeWorld(seed,horizon=96){
 let rng=(seed^0x58e3ab91)>>>0,price=0.25;const world=[];
 for(let tick=0;tick<=horizon;tick++){
  const r=nextRandom(rng);rng=r.state;const previous=price;
  const trend=0.006*Math.sin((tick-7)/10)+0.003*Math.cos(tick/23);
  price=Math.max(0.05,price*(1+trend+(r.value-0.5)*0.014));
  const earlier=world[Math.max(0,tick-4)]?.price??previous;
  const momentum=clamp((price/earlier-1)*25),bulletin=0.82*Math.sin((tick-9)/13);
  const volatility=clamp(Math.abs(price/previous-1)*60,0,1);
  world.push({tick,price,momentum,bulletin,volatility,reliability:0.85});
 }
 return world;
}
export function observations(state,world){
 const row=world[state.tick];if(!row)throw new Error('world horizon exceeded');const value=state.cash+state.units*row.price;
 return [row.momentum,row.bulletin,row.volatility,row.reliability,state.cash/value,state.units*row.price/value,state.lastMove,Math.sin(state.tick/16)];
}
