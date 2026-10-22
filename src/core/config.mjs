export const MODEL_VERSION='forklet/rnn8/1';
export const ACTIONS=['add','hold','reduce'];
export const INPUTS=['momentum','bulletin','volatility','reliability','cash share','exposure','previous move','clock'];
export const SCENARIOS=[
 {id:'bulletin',name:'Opposite bulletin',change:'Invert only the bulletin signal for 18 decisions.',tag:'information intervention'},
 {id:'latency',name:'Late evidence',change:'Read momentum and bulletin from six ticks earlier for 18 decisions.',tag:'information intervention'},
 {id:'reliability',name:'Lower reliability',change:'Set the reliability channel to 0.15 for 18 decisions.',tag:'information intervention'},
 {id:'control',name:'Identical evidence',change:'Change nothing. The two branches must remain identical.',tag:'negative control'}
];
export function config(overrides={}){
 const c={seed:17,horizon:96,forkAt:24,scenario:'bulletin',duration:18,feeRate:0.003,...overrides};
 if(!Number.isInteger(c.seed)||c.seed<0||c.seed>0xffffffff)throw new Error('seed must be a uint32');
 if(!Number.isInteger(c.horizon)||c.horizon<16||c.horizon>256)throw new Error('horizon must be 16..256');
 if(!Number.isInteger(c.forkAt)||c.forkAt<1||c.forkAt>=c.horizon-1)throw new Error('forkAt must precede the final two decisions');
 if(!SCENARIOS.some(s=>s.id===c.scenario))throw new Error('unknown scenario');
 if(!Number.isInteger(c.duration)||c.duration<1||c.duration>c.horizon)throw new Error('duration must be within the horizon');
 if(!Number.isFinite(c.feeRate)||c.feeRate<0||c.feeRate>0.05)throw new Error('feeRate outside 0..0.05');
 return c;
}
