/* Verifies a generated build. Run after build.mjs; exits non-zero on any failure.
   Usage: node src/verify.mjs [buildDir]                                          */
import fs from "fs";
import path from "path";

const ROOT = process.argv[2] || ".";
const CHUNK_CAP = 26;      // CHUNKS_PER_PAGE, pageVectors.ts
const CHUNK_CHARS = 2000;  // maxChars, chunkPage()

const fail = [], warn = [];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules" || e.name === "src") continue;
    const f = path.join(dir, e.name);
    e.isDirectory() ? walk(f, acc) : acc.push(f);
  }
  return acc;
}

const files = walk(ROOT).filter(f => f.endsWith(".html"));
if (!files.length) fail.push("no HTML files found in " + path.resolve(ROOT));

/* ---- 1. every local link and asset resolves ---- */
let refs = 0;
for (const f of files) {
  const html = fs.readFileSync(f, "utf8"), dir = path.dirname(f);
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|data:)/.test(u)) continue;
    if (u.startsWith("#")) {
      if (u !== "#" && !ids.has(u.slice(1))) fail.push(`${f}: dead anchor ${u}`);
      continue;
    }
    refs++;
    let t = path.normalize(path.join(dir, u));
    if (!path.extname(t)) t = path.join(t, "index.html");
    if (!fs.existsSync(t)) fail.push(`${f}: broken link ${u}`);
  }
}

/* ---- 2. head requirements ---- */
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail.push(`${f}: missing or thin <title>`);
  if (!/<meta name="description" content="[^"]{60,}"/.test(html)) fail.push(`${f}: missing or thin meta description`);
  if (!/<link rel="canonical" href="https?:\/\//.test(html)) fail.push(`${f}: missing canonical`);
  if ([...html.matchAll(/<h1[ >]/g)].length !== 1) fail.push(`${f}: needs exactly one h1`);
  if (!/<html lang="/.test(html)) fail.push(`${f}: missing lang attribute`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail.push(`${f}: invalid JSON-LD`); }
  }
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt=/.test(m[1])) fail.push(`${f}: img without alt`);
  }
}

/* ---- 3. retrieval budgets, measured from the source text of each H2 section ---- */
const stripTags = s => s.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  const article = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/) || [, ""])[1];
  if (!article) continue;
  const secs = [...article.matchAll(/<section class="sec"[^>]*>([\s\S]*?)<\/section>/g)].map(m => m[1]);
  if (secs.length > CHUNK_CAP) {
    fail.push(`${f}: ${secs.length} sections, over the ${CHUNK_CAP}-chunk page ceiling`);
  }
  secs.forEach(s => {
    const n = stripTags(s.replace(/<div class="scope"[\s\S]*/, "")).length;
    if (n > CHUNK_CHARS) {
      const h = stripTags((s.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [, "?"])[1]);
      fail.push(`${f}: section "${h}" is ${n} chars, over the ${CHUNK_CHARS}-char chunk ceiling`);
    }
  });
}

/* ---- 4. no orphans: every page is linked from at least one other page ---- */
const pageOf = f => "/" + path.relative(ROOT, f).replace(/\\/g, "/").replace(/index\.html$/, "").replace(/\/$/, "");
const inbound = new Map(files.map(f => [pageOf(f), 0]));
for (const f of files) {
  const html = fs.readFileSync(f, "utf8"), dir = path.dirname(f), self = pageOf(f), seen = new Set();
  for (const m of html.matchAll(/<a [^>]*href="([^"#]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:)/.test(u)) continue;
    let t = path.normalize(path.join(dir, u));
    if (!path.extname(t)) t = path.join(t, "index.html");
    if (!fs.existsSync(t)) continue;
    const to = pageOf(t);
    if (to === self || seen.has(to)) continue;
    seen.add(to);
    if (inbound.has(to)) inbound.set(to, inbound.get(to) + 1);
  }
}
for (const [p, n] of inbound) if (n === 0 && p !== "") fail.push(`orphan page, nothing links to it: ${p}`);

/* ---- 5. sitemap covers every page ---- */
const smPath = path.join(ROOT, "sitemap.xml");
if (!fs.existsSync(smPath)) {
  fail.push("sitemap.xml missing");
} else {
  const sm = fs.readFileSync(smPath, "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].length;
  if (locs !== files.length) fail.push(`sitemap lists ${locs} URLs but there are ${files.length} pages`);
}

/* ---- report ---- */
const edges = [...inbound.values()].reduce((a, b) => a + b, 0);
console.log(`pages       ${files.length}`);
console.log(`local refs  ${refs}`);
console.log(`page links  ${edges} (includes the nav and page tree present on every page)`);
console.log(`chunk cap   ${CHUNK_CAP} per page, ${CHUNK_CHARS} chars per section`);
if (warn.length) { console.log("\nwarnings:"); warn.forEach(w => console.log("  " + w)); }
if (fail.length) {
  console.log(`\nFAILED — ${fail.length} problem(s):`);
  fail.forEach(x => console.log("  " + x));
  process.exit(1);
}
console.log("\nOK — links, metadata, retrieval budgets, orphans and sitemap all pass.");
