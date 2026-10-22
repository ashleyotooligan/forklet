import {readFile} from 'node:fs/promises';
import {runFork,forkReceipt} from '../src/lab/fork.mjs';

const filename=process.argv[2]??new URL('../examples/config.json',import.meta.url);
const raw=await readFile(filename,'utf8');
if(raw.length>100_000)throw new Error('Configuration exceeds 100 KB');
console.log(JSON.stringify(forkReceipt(runFork(JSON.parse(raw))),null,2));
