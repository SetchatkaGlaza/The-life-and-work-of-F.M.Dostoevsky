import { readdir, readFile, stat } from "node:fs/promises";
import { join, normalize, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root=normalize(join(fileURLToPath(new URL(".",import.meta.url)),".."));
const files=[];

async function walk(dir){
  for(const name of await readdir(dir)){
    if(name===".git"||name==="node_modules")continue;
    const path=join(dir,name);
    const info=await stat(path);
    if(info.isDirectory())await walk(path);
    else files.push(normalize(path));
  }
}
await walk(root);

const html=files.filter((path)=>extname(path).toLowerCase()===".html");
const errors=[];

for(const file of html){
  const source=await readFile(file,"utf8");
  const relativeFile=relative(root,file).replaceAll("\\","/");

  if(!/<html[^>]+lang=/i.test(source))errors.push(`${relativeFile}: missing html lang`);
  if(!/<meta[^>]+charset=/i.test(source))errors.push(`${relativeFile}: missing charset`);
  if(!/<title>.*?<\/title>/is.test(source))errors.push(`${relativeFile}: missing title`);

  const ids=[...source.matchAll(/\bid=["']([^"']+)["']/gi)].map((match)=>match[1]);
  const duplicates=[...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
  if(duplicates.length)errors.push(`${relativeFile}: duplicate ids: ${duplicates.join(", ")}`);

  for(const image of source.matchAll(/<img\b([^>]*)>/gi)){
    if(!/\balt=["'][^"']*["']/i.test(image[1]))errors.push(`${relativeFile}: image without alt text`);
  }

  for(const match of source.matchAll(/(?:href|src)=["']([^"']+)["']/gi)){
    const ref=match[1];
    if(/^(#|https?:|mailto:|tel:|data:|javascript:)/i.test(ref))continue;
    const clean=decodeURIComponent(ref.split("#")[0].split("?")[0]);
    if(!clean)continue;
    const base=relativeFile.includes("/")?relativeFile.slice(0,relativeFile.lastIndexOf("/")+1):"";
    const target=normalize(join(root,base,clean));
    try{await stat(target);}catch{errors.push(`${relativeFile}: missing ${ref}`);}
  }
}

const required=["index.html","biography.html","chronology.html","works.html","ideas.html","petersburg.html","family.html","gallery.html","research.html","sources.html","404.html","styles.css","app.js","tests/validate.mjs","books/poor-folk.html","books/double.html","books/white-nights.html","books/dead-house.html","books/humiliated.html","books/notes-underground.html","books/crime-and-punishment.html","books/idiot.html","books/gambler.html","books/demons.html","books/eternal-husband.html","books/teenager.html","books/gentle-creature.html","books/dream-funny-man.html","books/brothers-karamazov.html"];
for(const file of required)if(!files.includes(normalize(join(root,file))))errors.push(`missing required file: ${file}`);

const forbidden=["Биография/","Романы/","Повести/","Рассказы/","Дневник писателя/","Цитаты/","Контакты/","Главная страница/","legacy-redesign.css"];
for(const file of files){const rel=relative(root,file).replaceAll("\\","/");if(forbidden.some((prefix)=>rel===prefix||rel.startsWith(prefix)))errors.push(`legacy/unused file remains: ${rel}`);}

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`Validated ${html.length} HTML pages and ${files.length} project files.`);