# BizDraft — US residential rental cluster

A complete static site. 22 content pages plus the cluster map, one directory per URL,
no build step and no dependencies. Open `index.html` and click through.

## Structure

```
index.html                     cluster map + intent-ownership register
agreements/real-estate/        category hub
  <document>/                  9 document pages
use-cases/<situation>/         4 situation pages
for-business/landlords/        audience hub
industries/property-management/
glossary/<term>/               5 glossary pages
assets/                        styles.css, site.js, logos, favicon
sitemap.xml, robots.txt
```

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
chunker would produce. Collapsed `<details>` are counted, because an extractor reads them.

## Links and deployment

This build uses **pretty** links.

- `file` (the default) writes `.../index.html` into every href, so the site works by
  double-clicking from disk. `file://` will not serve a directory index on its own.
- `pretty` writes directory URLs (`/glossary/security-deposit/`) for a real web server.

Either way `<link rel="canonical">` and `sitemap.xml` carry the pretty URL, so what search
engines index does not change. To regenerate:

```
node build.mjs <output-folder> pretty
```

`serve.cmd` starts a local server at http://localhost:4321 if you want the real URLs while
reviewing.

## Editing the content

The pages are generated from five data files in the source project
(`data/docs-a.js`, `docs-b.js`, `situations.js`, `audience.js`, `glossary.js`).
Each page is one object: `path`, `kind`, `title`, `lede`, `job`, `voice[]`, `secs[]`,
`mistakes`, `flags`,
`faq[]`, `rel[]`, `cta`. Editing those and re-running the build regenerates everything,
including the sitemap, the breadcrumbs and the structured data. The build throws on a broken
internal link rather than emitting one.

## The rules this cluster is built to

- One page, one job. The register on the cluster map lists all 22 jobs; two that
  could share an answer would be one page.
- The chunker splits on `h1` and `h2` only, so every H2 section is written to stand alone:
  heading, direct answer, evidence, next action.
- Voice-query hypotheses cross the head term with urgency, who is asking and on what, the thing
  in front of them, and what hurts — never all four at once. They are hypotheses about phrasing,
  never measured search volume.
- No figure is stated as national when it is set by state or city law.

## Not legal advice

The content describes how US residential rental documents usually work. Landlord–tenant law is
state and often city law. Nothing here is legal advice.
