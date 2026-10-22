/** Serializable Mulberry32-style stream: one draw per agent decision. */
export function nextRandom(state){
 const next=(state+0x6D2B79F5)>>>0;let t=next;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return {state:next,value:((t^(t>>>14))>>>0)/4294967296};
}
export const clamp=(v,lo=-1,hi=1)=>Math.max(lo,Math.min(hi,v));
export const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
export function debugId(value){let h=0x811c9dc5;for(const char of JSON.stringify(value)){h^=char.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');}
