import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
export async function filesAt(dir=root,prefix=''){
  const result=[];
  for(const item of await readdir(dir,{withFileTypes:true})){
    if(['node_modules','.git'].includes(item.name))continue;
    const relative=prefix+item.name;
    if(item.isDirectory())result.push(...await filesAt(dir+item.name+'/',relative+'/'));
    else if(item.isFile()&&relative!=='MANIFEST.sha256')result.push(relative);
  }
  return result.sort();
}
export async function manifest(){
  const files=await filesAt();return (await Promise.all(files.map(async name=>createHash('sha256').update(await readFile(root+name)).digest('hex')+'  '+name))).join('\n')+'\n';
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const content=await manifest();
  if(process.argv.includes('--verify')){
    if(await readFile(root+'MANIFEST.sha256','utf8')!==content)throw new Error('Manifest mismatch: missing, modified or additional files.');
    console.log('All package files match MANIFEST.sha256.');
  }else{await writeFile(root+'MANIFEST.sha256',content);console.log('Wrote MANIFEST.sha256.');}
}
