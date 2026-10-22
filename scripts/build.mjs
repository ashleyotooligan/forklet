import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
// Explicit dependency order keeps this small offline build reproducible.
const modules=['src/core/random.mjs','src/core/config.mjs','src/core/world.mjs','src/core/network.mjs','src/core/engine.mjs','src/lab/fork.mjs','src/view/plates.mjs','src/view/ink.mjs','src/view/figures.mjs','src/view/render.mjs','src/view/app.mjs'];
let code='';
for(const name of modules){
  const source=await readFile(root+name,'utf8');
  code+=`\n// ${name}\n`+source.replace(/^import .*?;\s*$/gm,'').replace(/\bexport (?=(?:async )?(?:function|const|let|class)\b)/g,'');
}
const image=async name=>'data:image/png;base64,'+(await readFile(root+name)).toString('base64');
const data={agent:await image('assets/brand/forklet-agent.png'),pair:await image('assets/art/forklet-pair.png'),batch:JSON.parse(await readFile(root+'data/batch.json','utf8'))};
const safe=v=>v.replace(/<\/script/gi,'<\\/script');
let html=await readFile(root+'index.html','utf8');
html=html.replace('<link rel="stylesheet" href="src/view/style.css">',`<style>${await readFile(root+'src/view/style.css','utf8')}</style>`)
  .replace('href="assets/brand/forklet-agent.png"',`href="${data.agent}"`)
  .replace('<script type="module" src="src/view/app.mjs"></script>',`<script>globalThis.FORKLET_EMBEDDED=${safe(JSON.stringify(data))};\n${safe(code)}</script>`);
await writeFile(root+'Forklet.html',html);
console.log(`Built Forklet.html (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MiB), with embedded artwork and study data.`);
