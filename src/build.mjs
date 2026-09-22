/* Static site generator — turns the page data into real HTML files, one directory per URL. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
function asset(from, file) {
  const depth = from === "/" ? 0 : from.split("/").filter(Boolean).length;
  return (depth === 0 ? "./" : "../".repeat(depth)) + "assets/" + file;
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

  const article = `<div class="wrap"><article id="article">
<div class="crumb" aria-label="Breadcrumb">${crumbs.join("")}</div>
<div class="kind" data-ann="kind">${esc(KIND_LABEL[p.kind] || p.kind)}</div>
<h1>${rich(p.h1 || p.title, from)}</h1>
<p class="lede">${rich(p.lede, from)}</p>
${p.job ? `<div class="job" data-ann="job"><span class="k">The one job this page owns</span><span class="v">${rich(p.job, from)}</span></div>` : ""}
${voice}${body}${mistakesSec}${flagsSec}${faq}${relSec}${cta}
<div class="disc" data-ann="disc"><strong>Not legal advice.</strong> ${rich(p.disc ||
    "This page describes how residential rental documents usually work in the United States. Residential tenancy is governed by state and often city law, and a rule that is usual is not universal. Check your own state and city before you sign, and speak to a landlord–tenant attorney for anything contested.", from)}</div>
${scope}
</article>${aside}</div>`;

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

/* assets */
fs.copyFileSync(path.join(HERE, "logo-on-light.svg"), path.join(OUT, "assets/logo-on-light.svg"));
fs.copyFileSync(path.join(HERE, "logo-on-dark.svg"), path.join(OUT, "assets/logo-on-dark.svg"));
fs.writeFileSync(path.join(OUT, "assets/styles.css"), fs.readFileSync(path.join(HERE, "build-assets/styles.css"), "utf8"));
fs.writeFileSync(path.join(OUT, "assets/site.js"), fs.readFileSync(path.join(HERE, "build-assets/site.js"), "utf8"));
fs.writeFileSync(path.join(OUT, "assets/favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#FFB000"/><path d="M9 8h9.2c3.5 0 5.6 1.8 5.6 4.6 0 1.9-1 3.2-2.6 3.8 2 .5 3.2 2 3.2 4.1 0 3.1-2.3 5.1-6 5.1H9V8Zm4.3 6.6h4c1.3 0 2.1-.7 2.1-1.8s-.8-1.7-2.1-1.7h-4v3.5Zm0 7.2h4.4c1.5 0 2.4-.8 2.4-2s-.9-1.9-2.4-1.9h-4.4v3.9Z" fill="#241E14"/></svg>`);

/* sitemap + robots */
const urls = ["/"].concat(PATHS);
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${ORIGIN}${u === "/" ? "/" : u + "/"}</loc><changefreq>monthly</changefreq><priority>${u === "/" ? "1.0" : (u.split("/").length <= 3 ? "0.8" : "0.6")}</priority></url>`).join("\n") +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

/* generated files that are not pages, tracked so a later build can clean them up */
const EXTRA = ["assets/logo-on-light.svg", "assets/logo-on-dark.svg", "assets/styles.css",
  "assets/site.js", "assets/favicon.svg", "sitemap.xml", "robots.txt", "serve.cmd", "README.md"];

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
