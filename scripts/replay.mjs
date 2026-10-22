import {readFile} from 'node:fs/promises';
import {restoreEnvelope,decision} from '../src/core/engine.mjs';
import {makeWorld} from '../src/core/world.mjs';

const name=process.argv[2]??new URL('../examples/checkpoint.json',import.meta.url);
const raw=await readFile(name,'utf8');
if(raw.length>1_000_000)throw new Error('Checkpoint exceeds 1 MB limit');
const restored=restoreEnvelope(JSON.parse(raw));
const world=makeWorld(restored.config.seed,restored.config.horizon),frames=[];
while(restored.state.tick<restored.config.horizon)frames.push(decision(restored.state,world,restored.config,false));
console.log(JSON.stringify({schema:'forklet/replay/1',branch:'A / original evidence',steps:frames.length,finalState:restored.state,finalValue:frames.at(-1).equity},null,2));
