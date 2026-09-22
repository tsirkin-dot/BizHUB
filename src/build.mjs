/* Static site generator — turns the page data into real HTML files, one directory per URL. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || path.join(HERE, "dist");
const ORIGIN = (process.env.SITE_ORIGIN || "https://bizdraft.com").replace(/\/+$/, "");
/* Link style. "file" appends index.html so the build opens by double-click from disk;
   "pretty" emits directory URLs for a real web server. Canonical tags and the sitemap
   always carry the pretty URL either way, so this never affects what search engines index.
   Override with:  node build.mjs <outdir> pretty                                        */
const LINK_STYLE = (process.argv[3] || "file").toLowerCase();

/* ---------- load the page data ---------- */
const window = {};
globalThis.window = window;
for (const f of ["docs-a", "docs-b", "situations", "audience", "glossary"]) {
  new Function("window", fs.readFileSync(path.join(HERE, "data", f + ".js"), "utf8"))(window);
}
const PAGES = {};
for (const k of Object.keys(window)) if (k.startsWith("P_")) for (const p of window[k]) PAGES[p.path] = p;
const PATHS = Object.keys(PAGES);

const CHUNK_CAP = 26, CHUNK_CHARS = 2000, MIN_CHUNK = 40;
const KIND_LABEL = {
  category: "Category hub", template: "Document", usecase: "Situation",
  glossary: "Glossary term", role: "Audience hub", industry: "Industry"
};

const GROUPS = [
  { ct: "Documents", h: "Agreements · real estate",
    p: "Each page owns one document. It says what the document does, when it is the wrong one, and what has to be filled in before it means anything.",
    paths: ["/agreements/real-estate", "/agreements/real-estate/residential-lease-agreement",
      "/agreements/real-estate/month-to-month-rental-agreement", "/agreements/real-estate/sublease-agreement",
      "/agreements/real-estate/roommate-agreement", "/agreements/real-estate/rental-application",
      "/agreements/real-estate/lease-renewal-agreement", "/agreements/real-estate/lease-termination-agreement",
      "/agreements/real-estate/notice-to-vacate"] },
  { ct: "Situations", h: "Use cases",
    p: "A page per moment somebody is actually in. These own the spoken, full-sentence queries — the ones that name a problem rather than a document.",
    paths: ["/use-cases/renting-out-your-first-property", "/use-cases/new-tenant-moving-in",
      "/use-cases/tenant-stopped-paying-rent", "/use-cases/getting-your-security-deposit-back"] },
  { ct: "Audience", h: "Roles & industries",
    p: "Who the reader is, and the whole stack of documents that role keeps — the entry point for somebody who does not yet know which document they need.",
    paths: ["/for-business/landlords", "/industries/property-management"] },
  { ct: "Definitions", h: "Glossary",
    p: "One term, one page, one definition. These own the “what does X mean” queries so no document page has to compete for them.",
    paths: ["/glossary/security-deposit", "/glossary/normal-wear-and-tear",
      "/glossary/joint-and-several-liability", "/glossary/quiet-enjoyment", "/glossary/holdover-tenant"] }
];
const NAV = [
  { l: "Agreements", p: "/agreements/real-estate" },
  { l: "Industries", p: "/industries/property-management" },
  { l: "Use cases", p: "/use-cases/renting-out-your-first-property" },
  { l: "Glossary", p: "/glossary/security-deposit" },
  { l: "For business", p: "/for-business/landlords" }
];

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = s => esc(s).replace(/"/g, "&quot;");
const plain = s => String(s).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "");
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 46);

/* every page lives at <path>/index.html, so the link to another page is a relative dir path */
function rel(from, to) {
  const depth = from === "/" ? 0 : from.split("/").filter(Boolean).length;
  const up = depth === 0 ? "./" : "../".repeat(depth);
  const tail = LINK_STYLE === "pretty" ? "" : "index.html";
  if (to === "/") return (up === "./" ? "./" : up) + tail;
  return up + to.replace(/^\//, "") + "/" + tail;
}
/* Assets are content-addressed. The stylesheet and the script keep their names
   across builds, which means a browser holding yesterday's copy will happily pair
   it with today's HTML and render markup the old CSS has no rules for. Putting a
   hash of the bytes in the filename makes that impossible: changed content is a
   changed URL, so a stale cache entry is never the one the page asks for. */
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#FFB000"/><path d="M9 8h9.2c3.5 0 5.6 1.8 5.6 4.6 0 1.9-1 3.2-2.6 3.8 2 .5 3.2 2 3.2 4.1 0 3.1-2.3 5.1-6 5.1H9V8Zm4.3 6.6h4c1.3 0 2.1-.7 2.1-1.8s-.8-1.7-2.1-1.7h-4v3.5Zm0 7.2h4.4c1.5 0 2.4-.8 2.4-2s-.9-1.9-2.4-1.9h-4.4v3.9Z" fill="#241E14"/></svg>`;

const ASSET_SRC = {
  "styles.css": fs.readFileSync(path.join(HERE, "build-assets/styles.css"), "utf8"),
  "site.js": fs.readFileSync(path.join(HERE, "build-assets/site.js"), "utf8"),
  "full.css": fs.readFileSync(path.join(HERE, "build-assets/full.css"), "utf8"),
  "logo-on-light.svg": fs.readFileSync(path.join(HERE, "logo-on-light.svg"), "utf8"),
  "logo-on-dark.svg": fs.readFileSync(path.join(HERE, "logo-on-dark.svg"), "utf8"),
  "favicon.svg": FAVICON,
};
const ASSET_NAME = {};
for (const name of Object.keys(ASSET_SRC)) {
  const hash = crypto.createHash("sha1").update(ASSET_SRC[name]).digest("hex").slice(0, 8);
  ASSET_NAME[name] = name.replace(/\.([a-z]+)$/, "." + hash + ".$1");
}

function asset(from, file) {
  const depth = from === "/" ? 0 : from.split("/").filter(Boolean).length;
  return (depth === 0 ? "./" : "../".repeat(depth)) + "assets/" + (ASSET_NAME[file] || file);
}

function rich(s, from) {
  return esc(s)
    .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_, t, h) => {
      if (!PAGES[h]) throw new Error("broken link " + h + " on " + from);
      return `<a href="${rel(from, h)}">${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/* ---------- blocks ---------- */
function block(b, from) {
  if (typeof b === "string") return `<p>${rich(b, from)}</p>`;
  if (b.a) return `<p class="answer" data-ann="answer">${rich(b.a, from)}</p>`;
  if (b.p) return `<p>${rich(b.p, from)}</p>`;
  if (b.h3) return `<h3>${rich(b.h3, from)}</h3>`;
  if (b.ul) return `<ul>${b.ul.map(i => `<li>${rich(i, from)}</li>`).join("")}</ul>`;
  if (b.ol) return `<ol>${b.ol.map(i => `<li>${rich(i, from)}</li>`).join("")}</ol>`;
  if (b.note) {
    const n = b.note;
    return `<div class="note ${n.k || "info"}"><span class="nt">${esc(n.t)}</span>` +
      (n.d ? `<p>${rich(n.d, from)}</p>` : "") +
      (n.ul ? `<ul>${n.ul.map(i => `<li>${rich(i, from)}</li>`).join("")}</ul>` : "") + `</div>`;
  }
  if (b.cards) return `<div class="cards">${b.cards.map(c =>
    `<div class="card"><h4>${rich(c.h, from)}</h4><p>${rich(c.p, from)}</p></div>`).join("")}</div>`;
  if (b.steps) return `<ol class="steps">${b.steps.map(s =>
    `<li><b>${rich(s.b, from)}</b><span>${rich(s.s, from)}</span></li>`).join("")}</ol>`;
  if (b.table) {
    const t = b.table;
    return `<div class="tbl-scroll"><table><thead><tr>${t.c.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>` +
      t.r.map(row => `<tr>${row.map(c => `<td>${rich(c, from)}</td>`).join("")}</tr>`).join("") +
      `</tbody></table></div>`;
  }
  return "";
}
const blocks = (arr, from) => (arr || []).map(b => block(b, from)).join("");

function roleOf(sec) {
  const b = sec.b || [], has = k => b.some(x => x && x[k]);
  if (has("steps")) return "sequence";
  if (has("table")) return "comparison";
  if (b.some(x => x && x.note && x.note.k === "warn")) return "risk";
  if (has("ul") || has("ol") || has("cards")) return "checklist";
  if (has("a")) return "answer";
  return "evidence";
}

/* ---------- chrome ---------- */
const MIC = '<svg class="mic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5a2 2 0 0 0-2 2v4a2 2 0 1 0 4 0v-4a2 2 0 0 0-2-2Zm-4 5.5a.75.75 0 0 1 .75.75 3.25 3.25 0 0 0 6.5 0 .75.75 0 0 1 1.5 0 4.75 4.75 0 0 1-4 4.69v1.31a.75.75 0 0 1-1.5 0v-1.31a4.75 4.75 0 0 1-4-4.69A.75.75 0 0 1 4 7Z"/></svg>';

function railHtml(cur) {
  let h = `<h5>Cluster</h5><nav class="tree"><a class="${cur === "/" ? "on" : ""}" href="${rel(cur, "/")}">Map &amp; intent register</a></nav>`;
  for (const g of GROUPS) {
    h += `<h5>${esc(g.h)}</h5><nav class="tree">`;
    for (const pp of g.paths) {
      const t = PAGES[pp]; if (!t) continue;
      const sub = g.ct === "Documents" && pp !== "/agreements/real-estate";
      h += `<a class="${sub ? "sub " : ""}${pp === cur ? "on" : ""}" href="${rel(cur, pp)}"${pp === cur ? ' aria-current="page"' : ""}>${esc(t.title)}</a>`;
    }
    h += `</nav>`;
  }
  return h;
}
function navHtml(cur) {
  return NAV.map(n => {
    const root = "/" + n.p.split("/")[1];
    return `<a class="${cur.indexOf(root) === 0 ? "on" : ""}" href="${rel(cur, n.p)}">${n.l}</a>`;
  }).join("");
}

function shell({ cur, title, desc, head, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${attr(title)}</title>
<meta name="description" content="${attr(desc)}">
<link rel="canonical" href="${ORIGIN}${cur === "/" ? "/" : cur + "/"}">
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${ORIGIN}${cur === "/" ? "/" : cur + "/"}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${asset(cur, "favicon.svg")}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Open+Sans:wght@300;400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${asset(cur, "styles.css")}">
<link rel="stylesheet" href="${asset(cur, "full.css")}" id="fullskin-css" disabled>
${head}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top-in">
    <button class="ghost burger" id="burger" aria-label="Open page tree" aria-expanded="false">☰</button>
    <a class="brand" href="${rel(cur, "/")}">
      <img class="logo-l" src="${asset(cur, "logo-on-light.svg")}" alt="BizDraft" width="92" height="21">
      <img class="logo-d" src="${asset(cur, "logo-on-dark.svg")}" alt="BizDraft" width="92" height="21">
    </a>
    <nav class="nav" aria-label="Sections">${navHtml(cur)}</nav>
    <div class="top-right">
      <button class="ghost" id="build" aria-pressed="false" title="Show how each block on the page was assembled"><span class="dot"></span>How it was built</button>
      <button class="ghost" id="theme" aria-label="Switch colour theme" title="Switch colour theme">Theme</button>
${PAGES[cur] && PAGES[cur].cta ? `
      <div class="seg" id="skinseg" role="group" aria-label="Design">
        <button type="button" data-skin="basis" aria-pressed="true">Basis</button>
        <button type="button" data-skin="full" aria-pressed="false">Full</button>
      </div>
      <div class="seg" id="ctaseg" role="group" aria-label="Call to action style">
        <button type="button" data-cta="pitch" aria-pressed="true">Pitch</button>
        <button type="button" data-cta="chat" aria-pressed="false">Chat</button>
      </div>` : ""}
      <a class="cta-top" href="${rel(cur, "/")}">Start a draft</a>
    </div>
  </div>
</header>
<div class="buildbar">
  <div class="buildbar-in">
    <b>Build mode is on.</b>
    <span>Every dashed block carries a numbered pin. Open one to see what that block is for, which rule produced it, and the constraint it has to stay inside.</span>
  </div>
</div>
<div class="frame">
  <aside class="rail" id="rail" aria-label="All pages in this cluster">${railHtml(cur)}</aside>
  <main id="main">${body}</main>
</div>
<footer>
  <div class="foot-in">
    <p style="margin:0 0 9px"><strong>BizDraft is not a law firm</strong> and does not provide legal advice. These pages explain how residential rental documents normally work in the United States so you can describe your own situation accurately. Landlord–tenant law is set by each state, and often by the city, so a rule described here as usual may not be the rule where your property is.</p>
    <p style="margin:0">Demonstration cluster · US residential rental · ${PATHS.length} pages · Structure follows the intent-owned knowledge-graph architecture. Voice-query hypotheses follow the Voicescope four-axis framework and are hypotheses, never measured demand. Section sizing is measured against the Vectorscope retrieval budget on every page.</p>
  </div>
</footer>
<script src="${asset(cur, "site.js")}" defer></script>
</body>
</html>
`;
}

/* ---------- the full skin ----------
   A second markup tree for the same page, written against the product's own
   block library (bz-*) instead of this cluster's documentation layout. It ships
   inside a <template>, which the parser keeps out of the document: the page is
   still one copy of its own text for anything that reads or indexes it, and the
   script clones the tree in only when somebody asks for the design.
   The instrumentation — pins, page tree, retrieval panel — stays with the basis
   skin, because it describes how the page was built rather than what it says. */
function bzBlock(x, from) {
  if (typeof x === "string") return `<p class="bzp">${rich(x, from)}</p>`;
  if (x.a) return `<p class="bzp bzp--lead">${rich(x.a, from)}</p>`;
  if (x.p) return `<p class="bzp">${rich(x.p, from)}</p>`;
  if (x.h3) return `<h3 class="bzh3">${rich(x.h3, from)}</h3>`;
  if (x.ul) return `<ul class="bzul">${x.ul.map(i => `<li>${rich(i, from)}</li>`).join("")}</ul>`;
  if (x.ol) return `<ol class="bzul">${x.ol.map(i => `<li>${rich(i, from)}</li>`).join("")}</ol>`;
  if (x.note) {
    const n = x.note;
    return `<div class="bznote bznote--${n.k || "info"}"><b>${esc(n.t)}</b>` +
      (n.d ? `<p>${rich(n.d, from)}</p>` : "") +
      (n.ul ? `<ul class="bzul">${n.ul.map(i => `<li>${rich(i, from)}</li>`).join("")}</ul>` : "") + `</div>`;
  }
  if (x.cards) return `<div class="bz-features-type-1__grid">` + x.cards.map(c =>
    `<div class="bz-features-type-1__card"><h3 class="bz-features-type-1__card-heading">${rich(c.h, from)}</h3>` +
    `<p class="bz-features-type-1__card-text">${rich(c.p, from)}</p></div>`).join("") + `</div>`;
  if (x.steps) return `<div class="bz-features-type-2__grid">` + x.steps.map((s, i) =>
    `<div class="bz-features-type-2__step"><div class="bz-features-type-2__step-num">${i + 1}</div>` +
    `<h3 class="bz-features-type-2__step-heading">${rich(s.b, from)}</h3>` +
    `<p class="bz-features-type-2__step-text">${rich(s.s, from)}</p></div>`).join("") + `</div>`;
  if (x.table) {
    const t = x.table;
    return `<div class="bz-comparison-type-1__wrap"><table class="bz-comparison-type-1__table"><thead><tr>` +
      t.c.map(c => `<th class="bz-comparison-type-1__th">${esc(c)}</th>`).join("") + `</tr></thead><tbody>` +
      t.r.map(row => `<tr>` + row.map((c, i) =>
        `<td class="bz-comparison-type-1__td${i === 0 ? " bz-comparison-type-1__td--label" : ""}">${rich(c, from)}</td>`).join("") +
        `</tr>`).join("") + `</tbody></table></div>`;
  }
  return "";
}
const bzBlocks = (arr, from) => (arr || []).map(x => bzBlock(x, from)).join("");

function bzCards(d, from) {
  return `<div class="bz-features-type-3__grid">` + d.items.map(i =>
    `<div class="bz-features-type-3__card"><div class="bz-features-type-3__card-body">` +
    `<h3 class="bz-features-type-3__card-heading">${rich(i.h, from)}</h3>` +
    `<p class="bz-features-type-3__card-text">${rich(i.p, from)}</p></div></div>`).join("") + `</div>`;
}

function renderFull(p) {
  const from = p.path;
  const home = rel(from, "/");
  const nav = NAV.map(n => `<a class="bz-navbar-type-1__link" href="${rel(from, n.p)}">${esc(n.l)}</a>`).join("");

  const secs = (p.secs || []).map((s, i) =>
    `<section class="bz-features-type-1${i % 2 ? " bzalt" : ""}"><div class="bz-features-type-1__inner">` +
    `<p class="bz-section-label">${esc(KIND_LABEL[p.kind] || p.kind)} · ${esc(roleOf(s))}</p>` +
    `<h2 class="bz-section-heading">${rich(s.h, from)}</h2>` +
    bzBlocks(s.b, from) + `</div></section>`).join("");

  const pit = (d, defH, label) => d && (d.items || []).length
    ? `<section class="bz-features-type-3"><div class="bz-features-type-3__inner">` +
      `<p class="bz-section-label">${label}</p><h2 class="bz-section-heading">${esc(d.h || defH)}</h2>` +
      `<p class="bz-section-description">${rich(d.d, from)}</p>` + bzCards(d, from) + `</div></section>`
    : "";

  const faq = (p.faq || []).length
    ? `<section class="bz-faq-type-1"><div class="bz-faq-type-1__inner">` +
      `<h2 class="bz-section-heading">${esc(p.faqH || "Frequently asked questions")}</h2>` +
      `<div class="bz-faq-type-1__block">` + p.faq.map(f =>
        `<details class="bz-faq-type-1__item"><summary>${rich(f.q, from)}<span class="bz-faq-type-1__chevron"></span></summary>` +
        `<div class="bz-faq-type-1__answer">` +
        (Array.isArray(f.a) ? bzBlocks(f.a, from) : `<p class="bzp">${rich(f.a, from)}</p>`) +
        `</div></details>`).join("") + `</div></div></section>`
    : "";

  const related = (p.rel || []).length
    ? `<section class="bz-products-type-1"><div class="bz-products-type-1__inner">` +
      `<h2 class="bz-products-type-1__heading">${esc(p.relH || "Where to go next")}</h2>` +
      `<div class="bz-products-type-1__grid">` + p.rel.map(r =>
        `<div class="bz-products-type-1__card"><h3 class="bzh3">${esc(PAGES[r.p].title)}</h3>` +
        `<p class="bzp">${rich(r.w, from)}</p><a href="${rel(from, r.p)}">Read it \u2192</a></div>`).join("") +
      `</div></div></section>`
    : "";

  const voice = (p.voice || []).length
    ? `<section class="bz-products-type-1 bzalt"><div class="bz-products-type-1__inner">` +
      `<h2 class="bz-products-type-1__heading">Spoken questions this page answers</h2>` +
      `<div class="bz-products-type-1__grid">` +
      p.voice.map(v => `<div class="bz-products-type-1__card"><p class="bzp">${esc(v)}</p></div>`).join("") +
      `</div></div></section>`
    : "";

  return `<nav class="bz-navbar-type-1"><div class="bz-navbar-type-1__container">
  <a class="bz-navbar-type-1__logo" href="${home}"><img class="bz-navbar-type-1__logo-img" src="${asset(from, "logo-on-light.svg")}" alt="BizDraft" width="92" height="21"></a>
  <div class="bz-navbar-type-1__links">${nav}</div>
  <div class="seg bzseg" role="group" aria-label="Design">
    <button type="button" data-skin="basis" aria-pressed="false">Basis</button>
    <button type="button" data-skin="full" aria-pressed="true">Full</button>
  </div>
  <a class="bz-navbar-type-1__cta" href="${home}">${esc(p.cta ? p.cta.b1 : "Start a draft")}</a>
</div></nav>
<section class="bz-hero-header-type-1"><div class="bz-hero-header-type-1__inner"><div class="bz-hero-header-type-1__content">
  <p class="bz-hero-header-type-1__eyebrow">${esc(KIND_LABEL[p.kind] || p.kind)}</p>
  <h1 class="bz-hero-header-type-1__heading">${rich(p.h1 || p.title, from)}</h1>
  <p class="bz-hero-header-type-1__subtitle">${rich(p.lede, from)}</p>
  ${p.cta ? `<a class="bz-hero-header-type-1__cta" href="${home}">${esc(p.cta.b1)}</a>` : ""}
  ${p.ask ? `<form class="bzask" action="${home}" method="get"><textarea name="q" rows="2" placeholder="${attr(p.ask)}" aria-label="Describe the document you need"></textarea><button type="submit" aria-label="Start the draft">\u2192</button></form>` : ""}
  <p class="bz-hero-header-type-1__trust">Free · No sign-up · Word or PDF · All 50 states</p>
</div></div></section>
${p.job ? `<section class="bz-banner-type-3"><p class="bz-banner-type-3__text"><strong>The one job this page owns.</strong> ${rich(p.job, from)}</p></section>` : ""}
${voice}${secs}${pit(p.mistakes, "Common mistakes", "What you do")}${pit(p.flags, "Red flags", "What you are shown")}${faq}${related}
${p.cta ? `<section class="bz-call-to-action-type-1"><div class="bz-call-to-action-type-1__inner">
  <h2 class="bz-call-to-action-type-1__heading">${rich(p.cta.h, from)}</h2>
  <p class="bz-call-to-action-type-1__description">${rich(p.cta.p, from)}</p>
  <a class="bz-call-to-action-type-1__cta" href="${home}">${esc(p.cta.b1)}</a>
</div></section>` : ""}
<footer class="bz-footer-type-1"><div class="bz-footer-type-1__inner">
  <a class="bz-footer-type-1__logo" href="${home}"><img class="bz-footer-type-1__logo-img" src="${asset(from, "logo-on-light.svg")}" alt="BizDraft" width="92" height="21"></a>
  <div class="bz-footer-type-1__links">${NAV.map(n => `<a class="bz-footer-type-1__link" href="${rel(from, n.p)}">${esc(n.l)}</a>`).join("")}</div>
  <p class="bz-footer-type-1__copyright">Demonstration cluster. Not legal advice.</p>
</div></footer>`;
}

/* ---------- a content page ---------- */
function renderPage(p) {
  const from = p.path;
  const ids = (p.secs || []).map(s => s.id || slug(s.h));

  const crumbParts = from.split("/").filter(Boolean);
  let acc = "";
  const crumbs = [`<a href="${rel(from, "/")}">bizdraft.com</a>`];
  const crumbLd = [{ "@type": "ListItem", position: 1, name: "BizDraft", item: ORIGIN + "/" }];
  crumbParts.forEach((seg, i) => {
    acc += "/" + seg;
    const last = i === crumbParts.length - 1;
    crumbs.push(last || !PAGES[acc]
      ? `<span>/</span>${esc(seg)}`
      : `<span>/</span><a href="${rel(from, acc)}">${esc(seg)}</a>`);
    crumbLd.push({ "@type": "ListItem", position: i + 2, name: PAGES[acc] ? PAGES[acc].title : seg, item: ORIGIN + acc + "/" });
  });

  const body = (p.secs || []).map((s, i) =>
    `<section class="sec" id="${ids[i]}"><h2 data-ann="h2"${i === 0 ? ' data-first="1"' : ""}>${rich(s.h, from)}</h2>${blocks(s.b, from)}</section>`).join("");

  const voice = (p.voice || []).length
    ? `<div class="voiceblock" data-ann="voice"><div class="vh">${MIC}<b>Spoken questions this page answers</b><em>${p.voice.length} hypotheses</em><a class="tryout" href="https://www.getlooploop.com/voicescope" target="_blank" rel="noopener">Try Voicescope online ↗</a></div>` +
      `<div class="vlist">${p.voice.map(v => `<p>${esc(v)}</p>`).join("")}</div></div>`
    : "";

  /* Two halves of the same lesson, kept apart on purpose: a mistake is something the
     reader does, a red flag is something the reader is shown. Both are H2 sections so
     each one is a retrieval chunk in its own right rather than an aside nobody lifts. */
  const pitfall = (d, cls, ann, defH, id) => d && (d.items || []).length
    ? `<section class="sec" id="${id}"><h2 data-ann="h2">${esc(d.h || defH)}</h2>` +
      `<div class="pitfalls ${cls}" data-ann="${ann}"><p class="pf-d">${rich(d.d, from)}</p>` +
      `<ul class="pf-list">${d.items.map(i =>
        `<li><b>${rich(i.h, from)}</b><span>${rich(i.p, from)}</span></li>`).join("")}</ul></div></section>`
    : "";
  /* Two ways into the product, rendered together and switched with CSS so the
     choice costs no layout shift and the page still works with the script off.
     The guided route is the default; the field is the same question asked in
     the reader's own words, seeded with an example for this document. */
  const heroCta = p.cta ? `<div class="hcta" data-ann="hcta">
  <p class="hc-chips"><span>Free</span><span>No sign-up</span><span>Word or PDF</span><span>All 50 states</span></p>
  <div class="hc-v hc-pitch">
    <p class="hc-h">Skip the blank template.</p>
    <p class="hc-p">Answer a few questions about the property, the term and the state, and get it back with your own numbers and your state's rules already in it.</p>
    <div class="hc-act"><a class="btn" href="${rel(from, "/")}">${esc(p.cta.b1)}</a>
      <button type="button" class="hc-alt" data-cta-to="chat">or describe it in your own words</button></div>
  </div>
  <div class="hc-v hc-chat">
    <p class="hc-h">Describe what you need in plain English.</p>
    <form class="hc-form" action="${rel(from, "/")}" method="get">
      <textarea name="q" rows="2" placeholder="${attr(p.ask || "")}" aria-label="Describe the document you need"></textarea>
      <button class="hc-send" type="submit" aria-label="Start the draft">→</button>
    </form>
    <p class="hc-note">About 90 seconds. <button type="button" class="hc-alt" data-cta-to="pitch">or answer a few questions instead</button></p>
  </div>
</div>` : "";

  const mistakesSec = pitfall(p.mistakes, "mistakes", "mistakes", "Common mistakes", "mistakes");
  const flagsSec = pitfall(p.flags, "flags", "flags", "Red flags", "red-flags");
  const mistakesH = p.mistakes && (p.mistakes.h || "Common mistakes");
  const flagsH = p.flags && (p.flags.h || "Red flags");

  const faqGroups = [];
  if ((p.faq || []).length) {
    const at = p.faq2At && p.faq2At < p.faq.length ? p.faq2At : p.faq.length;
    faqGroups.push({ id: "faq", h: p.faqH || "Frequently asked questions", items: p.faq.slice(0, at) });
    if (at < p.faq.length) faqGroups.push({ id: "faq-2", h: p.faq2H || "More questions", items: p.faq.slice(at) });
  }
  const faq = faqGroups.map(g =>
    `<section class="sec" id="${g.id}"><h2 data-ann="h2">${esc(g.h)}</h2>` +
    `<div class="faq"${g.id === "faq" ? ' data-ann="faq"' : ""}><div class="fblock">` + g.items.map(f =>
      `<details><summary>${rich(f.q, from)}</summary><div class="fa">` +
      (Array.isArray(f.a) ? blocks(f.a, from) : `<p>${rich(f.a, from)}</p>`) + `</div></details>`).join("") +
    `</div></div></section>`).join("");

  const relSec = (p.rel || []).length
    ? `<section class="sec" id="related"><h2 data-ann="h2">${esc(p.relH || "Where to go next")}</h2><div class="rel" data-ann="rel">` +
      p.rel.map(r => {
        if (!PAGES[r.p]) throw new Error("broken related " + r.p + " on " + from);
        return `<a href="${rel(from, r.p)}"><span class="rl">${esc(PAGES[r.p].title)}</span><span class="rw">${rich(r.w, from)}</span></a>`;
      }).join("") + `</div></section>`
    : "";

  const cta = p.cta
    ? `<div class="cta" data-ann="cta"><h3>${rich(p.cta.h, from)}</h3><p>${rich(p.cta.p, from)}</p>` +
      `<a class="btn" href="${rel(from, "/")}">${esc(p.cta.b1)}</a>` +
      (p.cta.b2 ? `<a class="btn sec" href="${rel(from, p.cta.b2p)}">${esc(p.cta.b2)}</a>` : "") + `</div>`
    : "";

  const headings = (p.secs || []).map((s, i) => ({ h: s.h, id: ids[i] }));
  if (mistakesSec) headings.push({ h: mistakesH, id: "mistakes" });
  if (flagsSec) headings.push({ h: flagsH, id: "red-flags" });
  faqGroups.forEach(g => headings.push({ h: g.h, id: g.id }));
  const aside = `<div class="aside"><h6>On this page</h6><nav class="toc" id="toc" aria-label="On this page">` +
    headings.map(h => `<a href="#${h.id}" data-id="${h.id}">${esc(h.h)}</a>`).join("") + `</nav></div>`;

  /* the chunk ledger is emitted at build time from the source, then re-measured in the browser */
  const ledger = [];
  (p.secs || []).forEach((s, i) => ledger.push({ i, h: s.h, role: roleOf(s) }));
  if (mistakesSec) ledger.push({ i: ledger.length, h: mistakesH, role: "checklist" });
  if (flagsSec) ledger.push({ i: ledger.length, h: flagsH, role: "risk" });
  faqGroups.forEach(g => ledger.push({ i: ledger.length, h: g.h, role: "answer" }));
  if ((p.rel || []).length) ledger.push({ i: ledger.length, h: p.relH || "Where to go next", role: "action" });

  const scope = `<section class="scope" id="scope" data-ann="scope">
  <div class="scope-h"><b>Retrieval read of this page</b><em>measured from the rendered page, not stored</em></div>
  <div class="scope-body" id="scope-body" data-ledger="${attr(JSON.stringify(ledger))}"></div>
  <div class="scope-foot"><a class="tryout" href="https://www.getlooploop.com/vectorscope" target="_blank" rel="noopener">Try Vectorscope online ↗</a></div></section>`;

  const fullSkin = `<template id="fullskin">${renderFull(p)}</template>`;
  const article = `<div class="wrap"><article id="article">
<div class="crumb" aria-label="Breadcrumb">${crumbs.join("")}</div>
<div class="kind" data-ann="kind">${esc(KIND_LABEL[p.kind] || p.kind)}</div>
<h1>${rich(p.h1 || p.title, from)}</h1>
<p class="lede">${rich(p.lede, from)}</p>
${p.job ? `<div class="job" data-ann="job"><span class="k">The one job this page owns</span><span class="v">${rich(p.job, from)}</span></div>` : ""}
${heroCta}
${voice}${body}${mistakesSec}${flagsSec}${faq}${relSec}${cta}
<div class="disc" data-ann="disc"><strong>Not legal advice.</strong> ${rich(p.disc ||
    "This page describes how residential rental documents usually work in the United States. Residential tenancy is governed by state and often city law, and a rule that is usual is not universal. Check your own state and city before you sign, and speak to a landlord–tenant attorney for anything contested.", from)}</div>
${scope}
</article>${aside}</div>${fullSkin}`;

  const ld = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbLd },
    { "@context": "https://schema.org", "@type": "WebPage", name: p.title,
      description: plain(p.lede).slice(0, 300), url: ORIGIN + p.path + "/", inLanguage: "en-US",
      isPartOf: { "@type": "WebSite", name: "BizDraft", url: ORIGIN + "/" } }
  ];
  if ((p.faq || []).length) {
    ld.push({ "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: p.faq.map(f => ({
        "@type": "Question", name: plain(f.q),
        acceptedAnswer: { "@type": "Answer",
          text: plain(Array.isArray(f.a) ? f.a.map(b => typeof b === "string" ? b : (b.a || b.p || "")).join(" ") : f.a) }
      })) });
  }
  if (p.kind === "glossary") {
    ld.push({ "@context": "https://schema.org", "@type": "DefinedTerm", name: p.title,
      description: plain(p.lede).slice(0, 300), inDefinedTermSet: { "@type": "DefinedTermSet", name: "BizDraft rental glossary", url: ORIGIN + "/glossary/" } });
  }

  const head = ld.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join("\n");
  const desc = plain(p.lede).replace(/\s+/g, " ").slice(0, 157).replace(/[\s,;:]+\S*$/, "") + "…";

  return shell({ cur: from, title: p.title + " · BizDraft", desc, head, body: article });
}

/* ---------- the cluster map ---------- */
function inbound(target) {
  let n = 0;
  for (const k of PATHS) {
    if (k === target) continue;
    const pg = PAGES[k];
    let hit = (pg.rel || []).some(r => r.p === target);
    if (!hit && (JSON.stringify(pg.secs || []) + JSON.stringify(pg.faq || [])).includes("](" + target + ")")) hit = true;
    if (hit) n++;
  }
  return n;
}

function renderHome() {
  const from = "/";
  let links = 0, voices = 0;
  for (const k of PATHS) { links += inbound(k); voices += (PAGES[k].voice || []).length; }

  const cols = GROUPS.map(g =>
    `<div class="map-col"><div class="ct">${esc(g.ct)}</div><h3>${esc(g.h)}</h3><p>${esc(g.p)}</p><div class="map-links">` +
    g.paths.map(pp => PAGES[pp]
      ? `<a href="${rel(from, pp)}">${esc(PAGES[pp].title)}<small>${esc(pp)} · ${inbound(pp)} inbound</small></a>` : "").join("") +
    `</div></div>`).join("");

  const rows = PATHS.map(k => [PAGES[k].job || "—", `[${PAGES[k].title}](${k})`, KIND_LABEL[PAGES[k].kind]]);

  const body = `<div class="full">
<div class="hero">
  <p class="eyebrow">Cluster map · US residential rental</p>
  <h1>Twenty pages, one niche, no two of them competing</h1>
  <p class="lede">Residential tenancy in the United States, from the lease itself down to what “normal wear and tear” means. Every page owns exactly one job, links to the pages that own the adjacent jobs, and is sized so a retrieval system can lift a whole answer out of a single section. Turn on <strong>How it was built</strong> in the header to see the reasoning laid over any page.</p>
  <div class="stat-row">
    <div class="stat"><b>${PATHS.length}</b><span>Pages</span></div>
    <div class="stat"><b>${links}</b><span>Internal link edges</span></div>
    <div class="stat"><b>${voices}</b><span>Voice hypotheses</span></div>
    <div class="stat"><b>${CHUNK_CAP}</b><span>Chunk ceiling per page</span></div>
    <div class="stat"><b>${CHUNK_CHARS.toLocaleString("en-US")}</b><span>Char ceiling per chunk</span></div>
  </div>
</div>
<h2>The four layers</h2>
<p class="sub">A document page answers “what is this and what goes in it”. A situation page answers “this just happened to me”. An audience page answers “who am I and what do I need”. A glossary page answers “what does this word mean”. Four different questions, so four different pages — never one page trying to hold all four.</p>
<div class="map-grid">${cols}</div>
<h2>How a page here is assembled</h2>
<p class="sub">Two instruments decide what goes on a page and how it is shaped. One works before the writing, on what somebody would actually say out loud. The other works after it, on what a retrieval system is able to lift back out. Neither produces prose — they produce constraints, and the constraints are visible on every page in this cluster.</p>
<article class="mcard wide">
  <div class="mh"><span class="mk">Intent ownership</span><span class="mkind">before either tool runs</span></div>
  <p class="mlede">Neither instrument below decides what the pages are. That happens first, and it is a single operation: take the demand somebody actually has, and split it by the <em>shape</em> of the question rather than by subject. “Rental agreement” is not one intent, it is four, and they want four different answers. Give each shape its own page and no two pages compete; give one page two shapes and it answers neither well while quietly cannibalising the page that should have owned the other.</p>
  <div class="mtwo">
    <div>
      <svg class="mfig" viewBox="0 0 340 168" role="img" aria-label="Diagram: one demand is split by the shape of the question into four lanes — what is this, this happened to me, who am I, what does this mean — each owned by a different page type">
  <rect class="fb key" x="60" y="6" width="220" height="26" rx="6"/>
  <text class="ft" x="170" y="23">one demand: “rental agreement”</text>
  <g class="fl">
    <path d="M170 32 V44 H39 V56"/><path d="M170 32 V44 H126 V56"/>
    <path d="M170 32 V44 H213 V56"/><path d="M170 32 V44 H300 V56"/>
  </g>
  <rect class="fb" x="1" y="56" width="77" height="40" rx="5"/>
  <text class="ft sm" x="39" y="72">what is this</text><text class="ft sm" x="39" y="84">what goes in it</text>
  <rect class="fb" x="88" y="56" width="77" height="40" rx="5"/>
  <text class="ft sm" x="126" y="72">this just</text><text class="ft sm" x="126" y="84">happened to me</text>
  <rect class="fb" x="175" y="56" width="77" height="40" rx="5"/>
  <text class="ft sm" x="213" y="72">who am I</text><text class="ft sm" x="213" y="84">what do I need</text>
  <rect class="fb" x="262" y="56" width="77" height="40" rx="5"/>
  <text class="ft sm" x="300" y="72">what does</text><text class="ft sm" x="300" y="84">this word mean</text>
  <g class="fl"><path d="M39 96 V114"/><path d="M126 96 V114"/><path d="M213 96 V114"/><path d="M300 96 V114"/></g>
  <rect class="fb out" x="1" y="114" width="77" height="24" rx="5"/><text class="ft sm" x="39" y="130">document</text>
  <rect class="fb out" x="88" y="114" width="77" height="24" rx="5"/><text class="ft sm" x="126" y="130">situation</text>
  <rect class="fb out" x="175" y="114" width="77" height="24" rx="5"/><text class="ft sm" x="213" y="130">audience</text>
  <rect class="fb out" x="262" y="114" width="77" height="24" rx="5"/><text class="ft sm" x="300" y="130">glossary</text>
  <text class="ft sm mute" x="170" y="158">exactly one lane per query — an overlap means one page too many</text>
</svg>
      <p class="mcap">One demand, four question shapes, four owners. The register on this page is the audit: if two rows could be satisfied by the same answer, they are one page and one of them should not exist.</p>
    </div>
    <div>
      <svg class="mfig" viewBox="0 0 340 168" role="img" aria-label="Diagram: the job from the register, the owned queries from Voicescope and the size limits from Vectorscope feed a page brief, which produces a page whose every H2 section is one retrieval chunk">
  <rect class="fb" x="2" y="14" width="98" height="32" rx="5"/>
  <text class="ft sm" x="51" y="29">the one job</text><text class="ft sm mute" x="51" y="40">from the register</text>
  <rect class="fb" x="2" y="68" width="98" height="32" rx="5"/>
  <text class="ft sm" x="51" y="83">owned queries</text><text class="ft sm mute" x="51" y="94">from Voicescope</text>
  <rect class="fb" x="2" y="122" width="98" height="32" rx="5"/>
  <text class="ft sm" x="51" y="137">size limits</text><text class="ft sm mute" x="51" y="148">from Vectorscope</text>
  <g class="fl"><path d="M100 30 L136 76"/><path d="M100 84 H136"/><path d="M100 138 L136 92"/></g>
  <rect class="fb key" x="136" y="62" width="66" height="44" rx="6"/>
  <text class="ft" x="169" y="88">page brief</text>
  <g class="fl"><path d="M202 84 H236"/></g>
  <rect class="fb out" x="236" y="18" width="102" height="132" rx="6"/>
  <text class="ft sm mute" x="287" y="34">one page</text>
  <rect class="fbar h2" x="246" y="42" width="82" height="14" rx="3"/>
  <rect class="fbar h2" x="246" y="64" width="82" height="14" rx="3"/>
  <rect class="fbar h2" x="246" y="86" width="82" height="14" rx="3"/>
  <rect class="fbar h2" x="246" y="108" width="82" height="14" rx="3"/>
  <rect class="fbar h2" x="246" y="130" width="82" height="14" rx="3"/>
</svg>
      <p class="mcap">What each page is written from. The job comes from the register, the queries from Voicescope, the limits from Vectorscope — and the page that comes out is a stack of sections, each one a whole retrieval chunk.</p>
    </div>
  </div>
  <h4>The four question shapes</h4>
  <ul class="maxes">
    <li><b>What is this, and what goes in it</b><span>A document exists and the reader wants it explained. Owned by the nine document pages.</span></li>
    <li><b>This just happened to me</b><span>A circumstance, described in full sentences, usually without naming any document. Owned by the four situation pages.</span></li>
    <li><b>Who am I, and what do I need</b><span>The reader knows their role and not their paperwork. Owned by the two audience pages.</span></li>
    <li><b>What does this word mean</b><span>One term, one answer, no action attached. Owned by the five glossary pages.</span></li>
  </ul>
  <h4>The brief a page is written from</h4>
  <p>Put those inputs together and the instruction for a single page is short, because almost all of it is constraint rather than subject. This is the skeleton behind every page in this cluster, and it is the shape worth reaching for on any page meant to be retrieved rather than merely published — the subject line is the only one that changes between them.</p>
  <div class="pskel">
    <div><b>ROLE</b><span>One page, one job, one question shape. Anything outside it is a link, not a section.</span></div>
    <div><b>JOB</b><span>The single sentence from the register. Every section is tested against it and dropped if it serves a different one.</span></div>
    <div><b>OWNS</b><span>The queries this page answers outright, including the spoken phrasings that never mention the head term.</span></div>
    <div><b>HANDS OFF</b><span>The adjacent jobs, each named with the page that owns it, so the temptation to answer them here is already spent.</span></div>
    <div><b>SHAPE</b><span>H2 is the cut line. Answer in the first sentences, evidence after, no pronoun pointing up the page, ${CHUNK_CHARS.toLocaleString("en-US")} characters a section.</span></div>
    <div><b>CLOSE</b><span>What the reader does wrong, then what the reader is shown, then where they go next.</span></div>
    <div><b>NEVER</b><span>A number presented as national when it is state law, and any claim the product cannot stand behind.</span></div>
  </div>
</article>

<div class="method">

  <article class="mcard">
    <div class="mh"><span class="mk">Voicescope</span><span class="mkind">before the writing</span>
      <a class="tryout" href="https://www.getlooploop.com/voicescope" target="_blank" rel="noopener">Try it online ↗</a></div>
    <p class="mlede">Reconstructs how a keyword turns into a full sentence when it is spoken to an assistant rather than typed into a search box. It takes one head term and crosses it with four axes of circumstance — never all four at once — then groups the results by the job somebody is doing rather than by how similar the wording is.</p>
    <svg class="mfig" viewBox="0 0 340 196" role="img" aria-label="Diagram: one head term is crossed with four axes of circumstance, producing spoken questions, most of which no longer contain the term itself">
  <rect class="fb key" x="6" y="80" width="70" height="34" rx="6"/>
  <text class="ft" x="41" y="101">head term</text>
  <g class="fl">
    <path d="M76 97 L110 24"/><path d="M76 97 L110 64"/><path d="M76 97 L110 104"/><path d="M76 97 L110 144"/>
  </g>
  <rect class="fb" x="110" y="10" width="104" height="28" rx="5"/>
  <text class="ft" x="162" y="28">urgency</text>
  <rect class="fb" x="110" y="50" width="104" height="28" rx="5"/>
  <text class="ft" x="162" y="68">device &amp; setup</text>
  <rect class="fb" x="110" y="90" width="104" height="28" rx="5"/>
  <text class="ft" x="162" y="108">the document</text>
  <rect class="fb" x="110" y="130" width="104" height="28" rx="5"/>
  <text class="ft" x="162" y="148">what is going wrong</text>
  <g class="fl">
    <path d="M214 24 L246 47"/><path d="M214 64 L246 47"/><path d="M214 104 L246 99"/><path d="M214 144 L246 151"/>
  </g>
  <rect class="fb out" x="246" y="30" width="88" height="34" rx="6"/>
  <path class="fr" d="M256 44 H316 M256 52 H300"/>
  <rect class="fb out" x="246" y="82" width="88" height="34" rx="6"/>
  <path class="fr" d="M256 96 H320 M256 104 H292"/>
  <rect class="fb out has" x="246" y="134" width="88" height="34" rx="6"/>
  <path class="fr" d="M256 148 H310 M256 156 H304"/>
  <circle class="fd" cx="330" cy="140" r="3.5"/>
</svg>
    <p class="mcap">One term, four axes, questions grouped by job. The marked output still contains the head term; the others describe the problem instead.</p>
    <h4>The four axes</h4>
    <ul class="maxes">
      <li><b>Urgency</b><span>How much time there is — right now, on the move, against a deadline.</span></li>
      <li><b>Device and setup</b><span>A phone with nothing installed asks a different question from a desk.</span></li>
      <li><b>The specific document</b><span>Not “a document” but the lease the agent is waiting for this afternoon.</span></li>
      <li><b>What is going wrong</b><span>The actual fear: fix one word, hide a number, did it really delete.</span></li>
    </ul>
    <blockquote class="mq">“A question still containing the head term is one your existing page probably answers. A question that describes the problem instead is the one your competitor has not written yet.”</blockquote>
    <h4>What it changed on these pages</h4>
    <p>Every page carries a block of these hypotheses, ${voices} across the cluster, and they are labelled as hypotheses because nothing here claims anybody has measured them. More consequentially, the questions that drop the head term are the reason the four situation pages exist at all: “my tenant is two months behind” is not a phrasing of “notice to vacate”, so it gets its own page rather than a section on the document page. The FAQ on each page is phrased the same way — as somebody would ask it out loud, not as a heading would be written.</p>
  </article>

  <article class="mcard">
    <div class="mh"><span class="mk">Vectorscope</span><span class="mkind">after the writing</span>
      <a class="tryout" href="https://www.getlooploop.com/vectorscope" target="_blank" rel="noopener">Try it online ↗</a></div>
    <p class="mlede">Reads a URL the way a retrieval system does: fetch, extract, chunk, embed, group. It chunks on headings first, using the H2 and H3 structure as the cut lines, then compares neighbouring blocks and cuts again where the meaning shifts. What comes back is the set of passages your page actually becomes once it is indexed — which is rarely the set of sections you thought you wrote.</p>
    <svg class="mfig" viewBox="0 0 340 196" role="img" aria-label="Diagram: a five-stage pipeline of fetch, extract, chunk, embed and group, above a row of passage bars measured against the per-chunk character cap, one of which exceeds it">
  <rect class="fb" x="4" y="8" width="56" height="26" rx="5"/><text class="ft" x="32" y="25">fetch</text>
  <rect class="fb" x="72" y="8" width="56" height="26" rx="5"/><text class="ft" x="100" y="25">extract</text>
  <rect class="fb key" x="140" y="8" width="56" height="26" rx="5"/><text class="ft" x="168" y="25">chunk</text>
  <rect class="fb" x="208" y="8" width="56" height="26" rx="5"/><text class="ft" x="236" y="25">embed</text>
  <rect class="fb" x="276" y="8" width="56" height="26" rx="5"/><text class="ft" x="304" y="25">group</text>
  <g class="fl">
    <path d="M60 21 H72"/><path d="M128 21 H140"/><path d="M196 21 H208"/><path d="M264 21 H276"/>
  </g>
  <path class="fcap" d="M4 74 H336"/>
  <text class="ft cap" x="336" y="68">per-chunk cap</text>
  <rect class="fbar" x="12" y="96" width="26" height="84" rx="3"/>
  <rect class="fbar" x="52" y="112" width="26" height="68" rx="3"/>
  <rect class="fbar" x="92" y="88" width="26" height="92" rx="3"/>
  <rect class="fbar over" x="132" y="60" width="26" height="120" rx="3"/>
  <rect class="fbar" x="172" y="104" width="26" height="76" rx="3"/>
  <rect class="fbar" x="212" y="92" width="26" height="88" rx="3"/>
  <rect class="fbar" x="252" y="120" width="26" height="60" rx="3"/>
  <rect class="fbar" x="292" y="100" width="26" height="80" rx="3"/>
  <path class="fbase" d="M4 180 H336"/>
</svg>
    <p class="mcap">The pipeline, and the passages it produces measured against the per-chunk ceiling. A passage over the line is split mid-answer, so half an answer is what gets retrieved.</p>
    <h4>What it measures</h4>
    <ul class="maxes">
      <li><b>Chunks beyond cap</b><span>Passages over the retrieval limit, invisible to indexing however good they are.</span></li>
      <li><b>Extraction ratio</b><span>How much fetched HTML survives as readable text rather than navigation and boilerplate.</span></li>
      <li><b>Group coherence</b><span>One large cluster means repetition; many single-passage groups mean the subject keeps changing.</span></li>
      <li><b>Question retrieval</b><span>Which passage a real query actually returns, rather than which one you hoped it would.</span></li>
      <li><b>Noindex detection</b><span>Whether the page asks to be left out of the index in the first place.</span></li>
    </ul>
    <blockquote class="mq">Answers have to sit “under a heading that names the question, high enough on the page to survive the retrieval cap”.</blockquote>
    <h4>What it changed on these pages</h4>
    <p>The H2 is the cut line, so every H2 section here is written to stand alone: its own heading, its own answer, its own context, its own next action. The direct answer sits in the first sentence or two under the heading, before the evidence rather than after it, with no pronouns pointing back up the page. Sections are sized against a ${CHUNK_CHARS.toLocaleString("en-US")}-character ceiling per chunk and ${CHUNK_CAP} chunks per page, and the build refuses to emit a page that breaks either. The panel at the foot of every page re-measures all of it from the rendered DOM when you load it, so the numbers are the page you are looking at rather than something stored at build time.</p>
  </article>

</div>
<h2>Intent ownership</h2>
<p class="sub">The anti-cannibalisation register. If two rows below could be satisfied by the same answer, they are the same page and one of them should not exist.</p>
${block({ table: { c: ["The job somebody is doing", "Page that owns it", "Layer"], r: rows } }, from)}
</div>`;

  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: "BizDraft", url: ORIGIN + "/", inLanguage: "en-US" };
  return shell({
    cur: from,
    title: "Rental agreements cluster · BizDraft",
    desc: "Twenty interlinked pages on US residential rental agreements: the documents, the situations, the audiences and the glossary, each owning exactly one search intent.",
    head: `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    body
  });
}


const README = `# BizDraft — US residential rental cluster

A complete static site. ${PATHS.length} content pages plus the cluster map, one directory per URL,
no build step and no dependencies. Open \`index.html\` and click through.

## Structure

\`\`\`
index.html                     cluster map + intent-ownership register
agreements/real-estate/        category hub
  <document>/                  9 document pages
use-cases/<situation>/         4 situation pages
for-business/landlords/        audience hub
industries/property-management/
glossary/<term>/               5 glossary pages
assets/                        styles.css, site.js, logos, favicon
sitemap.xml, robots.txt
\`\`\`

Every page is a self-contained HTML file sharing one stylesheet and one 9 KB script.
The script does four things and nothing else: theme switching, the mobile page tree,
the scroll spy, and the two features below.

## Two things on every page

**How it was built** — the button in the header turns on an overlay. Every structural block
gets a numbered pin; opening one says what that block is, which rule produced it
(Voicescope, Vectorscope, intent ownership, E-E-A-T) and the constraint it has to stay inside.

**Retrieval read** — the panel at the foot of each page measures the page *as rendered*, in the
browser, when you load it. Nothing is stored or precomputed. It reports chunk count against the
26-per-page ceiling, the longest section against the 2,000-character ceiling, the extraction
ratio (body text as a share of all readable text), and a ledger of every passage a heading-aware
chunker would produce. Collapsed \`<details>\` are counted, because an extractor reads them.

## Links and deployment

This build uses **${LINK_STYLE}** links.

- \`file\` (the default) writes \`.../index.html\` into every href, so the site works by
  double-clicking from disk. \`file://\` will not serve a directory index on its own.
- \`pretty\` writes directory URLs (\`/glossary/security-deposit/\`) for a real web server.

Either way \`<link rel="canonical">\` and \`sitemap.xml\` carry the pretty URL, so what search
engines index does not change. To regenerate:

\`\`\`
node build.mjs <output-folder> pretty
\`\`\`

\`serve.cmd\` starts a local server at http://localhost:4321 if you want the real URLs while
reviewing.

## Editing the content

The pages are generated from five data files in the source project
(\`data/docs-a.js\`, \`docs-b.js\`, \`situations.js\`, \`audience.js\`, \`glossary.js\`).
Each page is one object: \`path\`, \`kind\`, \`title\`, \`lede\`, \`job\`, \`voice[]\`, \`secs[]\`,
\`mistakes\`, \`flags\`,
\`faq[]\`, \`rel[]\`, \`cta\`. Editing those and re-running the build regenerates everything,
including the sitemap, the breadcrumbs and the structured data. The build throws on a broken
internal link rather than emitting one.

## The rules this cluster is built to

- One page, one job. The register on the cluster map lists all ${PATHS.length} jobs; two that
  could share an answer would be one page.
- The chunker splits on \`h1\` and \`h2\` only, so every H2 section is written to stand alone:
  heading, direct answer, evidence, next action.
- Voice-query hypotheses cross the head term with urgency, who is asking and on what, the thing
  in front of them, and what hurts — never all four at once. They are hypotheses about phrasing,
  never measured search volume.
- No figure is stated as national when it is set by state or city law.

## Not legal advice

The content describes how US residential rental documents usually work. Landlord–tenant law is
state and often city law. Nothing here is legal advice.
`;

/* ---------- write ---------- */
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });

const written = [];
function write(rel_, html) {
  const full = path.join(OUT, rel_);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  written.push(rel_);
}

write("index.html", renderHome());
for (const p of PATHS) write(path.join(p.replace(/^\//, ""), "index.html"), renderPage(PAGES[p]));

/* assets, under the hashed names the pages just referenced */
for (const name of Object.keys(ASSET_SRC))
  fs.writeFileSync(path.join(OUT, "assets/" + ASSET_NAME[name]), ASSET_SRC[name], "utf8");

/* sitemap + robots */
const urls = ["/"].concat(PATHS);
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${ORIGIN}${u === "/" ? "/" : u + "/"}</loc><changefreq>monthly</changefreq><priority>${u === "/" ? "1.0" : (u.split("/").length <= 3 ? "0.8" : "0.6")}</priority></url>`).join("\n") +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

/* generated files that are not pages, tracked so a later build can clean them up */
const EXTRA = Object.keys(ASSET_SRC).map(n => "assets/" + ASSET_NAME[n])
  .concat(["sitemap.xml", "robots.txt", "serve.cmd", "README.md"]);

/* a local server, for anyone who wants the real directory URLs while reviewing */
fs.writeFileSync(path.join(OUT, "serve.cmd"),
  "@echo off\r\nREM Serves this folder at http://localhost:4321 with real directory URLs.\r\n" +
  "where node >nul 2>nul && (npx --yes serve -l 4321 \"%~dp0\") || (py -m http.server 4321 -d \"%~dp0\")\r\n");

fs.writeFileSync(path.join(OUT, "README.md"), README);

/* Files are written over the top rather than the folder being wiped, so nothing the build
   does not own is ever at risk. Stale pages from an earlier run are removed by name, using
   the manifest that run left behind — and a delete that is refused is reported, not fatal. */
const MANIFEST = path.join(OUT, ".build-manifest.json");
const nowOwned = written.concat(EXTRA).map(f => f.replace(/\\/g, "/"));
let stale = [];
try {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  stale = (prev.files || []).filter(f => !nowOwned.includes(f));
} catch (e) { /* first run */ }
const couldNotRemove = [];
for (const f of stale) {
  try {
    fs.rmSync(path.join(OUT, f), { force: true });
    const dir = path.dirname(path.join(OUT, f));
    if (dir !== OUT && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  } catch (e) { couldNotRemove.push(f); }
}
fs.writeFileSync(MANIFEST, JSON.stringify({ built: new Date().toISOString(), linkStyle: LINK_STYLE, files: nowOwned }, null, 1));

console.log("wrote " + written.length + " html files to " + OUT + " (link style: " + LINK_STYLE + ")");
if (stale.length) console.log("removed " + (stale.length - couldNotRemove.length) + " stale file(s) from the previous build");
if (couldNotRemove.length) console.log("could not remove (left in place): " + couldNotRemove.join(", "));
for (const w of written) console.log("  " + w.replace(/\\/g, "/"));
