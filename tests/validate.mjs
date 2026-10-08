import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const root = process.cwd();
const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);

const html = files.filter((p) => extname(p).toLowerCase() === ".html");
const errors = [];
for (const file of html) {
  const source = await readFile(file, "utf8");
  const refs = [
    ...source.matchAll(/(?:href|src)=["']([^"']+)["']/gi),
  ].map((m) => m[1]);

  for (const ref of refs) {
    if (!ref || /^(#|https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = join(file.substring(0, file.lastIndexOf("/")), clean);
    try { await stat(target); } catch { errors.push(`${file}: missing ${ref}`); }
  }

  if (!/<meta[^>]+charset=/i.test(source)) errors.push(`${file}: missing charset`);
  if (!/<title>.*?<\/title>/is.test(source)) errors.push(`${file}: missing title`);
}

const required = [
  "index.html","biography.html","chronology.html","works.html","ideas.html",
  "petersburg.html","family.html","gallery.html","research.html","sources.html",
  "styles.css","app.js","legacy-redesign.css"
];
for (const file of required) {
  if (!files.includes(join(root, file))) errors.push(`missing required file: ${file}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${html.length} HTML pages and ${files.length} project files.`);
