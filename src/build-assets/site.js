/* BizDraft cluster — runtime for the static build.
   Theme, mobile page tree, scroll spy, build-mode annotations, and the retrieval read.
   No router: every page in this cluster is its own HTML file. */
(function () {
  "use strict";

  var CHUNK_CAP = 26;      // CHUNKS_PER_PAGE, pageVectors.ts
  var CHUNK_CHARS = 2000;  // maxChars, chunkPage()
  var MIN_CHUNK = 40;      // MIN_CHUNK_CHARS — below this a section is merged into its neighbour

  /* ---------------- theme ---------------- */
  var TKEY = "bd-theme";
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  try { var saved = localStorage.getItem(TKEY); if (saved) applyTheme(saved); } catch (e) {}
  var themeBtn = document.getElementById("theme");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur === "dark";
    var next = dark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(TKEY, next); } catch (e) {}
  });

  /* ---------------- hero call to action ---------------- */
  var CKEY = "bd-cta";
  function applyCta(v) {
    document.documentElement.setAttribute("data-cta", v);
    var btns = document.querySelectorAll("#ctaseg button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-cta") === v ? "true" : "false");
    }
  }
  function setCta(v) {
    applyCta(v);
    try { localStorage.setItem(CKEY, v); } catch (e) {}
  }
  var savedCta = "pitch";
  try { if (localStorage.getItem(CKEY) === "chat") savedCta = "chat"; } catch (e) {}
  applyCta(savedCta);
  document.addEventListener("click", function (e) {
    var el = e.target;
    while (el && el !== document.body) {
      var to = el.getAttribute && (el.getAttribute("data-cta") || el.getAttribute("data-cta-to"));
      if (to === "pitch" || to === "chat") {
        setCta(to);
        if (el.getAttribute("data-cta-to")) {
          var ta = document.querySelector(".hc-form textarea");
          if (to === "chat" && ta) ta.focus();
        }
        return;
      }
      el = el.parentNode;
    }
  });

  /* ---------------- mobile page tree ---------------- */
  var rail = document.getElementById("rail"), burger = document.getElementById("burger");
  function closeRail() {
    if (rail) rail.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    var s = document.querySelector(".scrim"); if (s) s.remove();
  }
  if (burger) burger.addEventListener("click", function (e) {
    e.stopPropagation();
    if (rail.classList.contains("open")) return closeRail();
    rail.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    var s = document.createElement("div");
    s.className = "scrim"; s.addEventListener("click", closeRail);
    document.body.appendChild(s);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeRail(); closePop(); } });

  /* ---------------- scroll spy ---------------- */
  var toc = document.getElementById("toc");
  if (toc) {
    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var spy = function () {
      var best = null, bestTop = -1e9;
      links.forEach(function (a) {
        var el = document.getElementById(a.getAttribute("data-id")); if (!el) return;
        var t = el.getBoundingClientRect().top - 112;
        if (t <= 0 && t > bestTop) { bestTop = t; best = a; }
      });
      links.forEach(function (a) {
        a.classList.toggle("on", a === best);
        if (a === best) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* ---------------- retrieval read ---------------- */
  function textOf(el) {
    if (!el) return 0;
    var clone = el.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll(".pin, .annpop, #scope"), function (x) { x.remove(); });
    return (clone.textContent || "").replace(/\s+/g, " ").trim().length;
  }

  function fillScope() {
    var host = document.getElementById("scope-body");
    if (!host) return;
    var ledger;
    try { ledger = JSON.parse(host.getAttribute("data-ledger") || "[]"); } catch (e) { return; }

    var secs = Array.prototype.slice.call(document.querySelectorAll("#article section.sec"));
    var rows = [], total = 0, over = 0, tiny = 0;
    secs.forEach(function (el, i) {
      var n = textOf(el), meta = ledger[i] || { h: "", role: "evidence" };
      var head = el.querySelector("h2");
      total += n; if (n > CHUNK_CHARS) over++; if (n < MIN_CHUNK) tiny++;
      rows.push({ i: i, h: (head ? head.textContent : meta.h).trim(), n: n, role: meta.role });
    });

    var artChars = textOf(document.getElementById("article"));
    var chromeChars = textOf(document.querySelector(".top")) +
      textOf(document.getElementById("rail")) +
      textOf(document.querySelector(".aside")) +
      textOf(document.querySelector("footer"));
    var ratio = Math.round((artChars / (artChars + chromeChars)) * 100);
    var chunks = rows.length;
    var longest = rows.reduce(function (a, r) { return Math.max(a, r.n); }, 0);
    var nf = function (n) { return n.toLocaleString("en-US"); };

    function gauge(label, value, unit, pct, cls, note) {
      return '<div class="gauge"><span class="gl">' + label + '</span><span class="gv">' + value +
        (unit ? " <small>" + unit + "</small>" : "") + '</span><div class="gbar"><i class="' + cls +
        '" style="width:' + Math.max(3, Math.min(100, pct)) + '%"></i></div><span class="gn">' + note + "</span></div>";
    }

    var g = '<div class="gauges">' +
      gauge("Chunks on this page", chunks, "/ " + CHUNK_CAP, (chunks / CHUNK_CAP) * 100,
        chunks <= CHUNK_CAP ? "ok" : "hot",
        chunks <= CHUNK_CAP ? "Within the per-page ceiling. Nothing on this page falls past the index."
                            : "Over the ceiling — sections past " + CHUNK_CAP + " are never indexed.") +
      gauge("Longest section", nf(longest), "/ " + nf(CHUNK_CHARS) + " ch", (longest / CHUNK_CHARS) * 100,
        longest <= CHUNK_CHARS ? "ok" : "hot",
        longest <= CHUNK_CHARS ? "Every section fits one chunk whole."
                               : "One section will be split mid-answer by the sentence splitter.") +
      gauge("Extraction ratio", ratio, "%", ratio, ratio >= 60 ? "ok" : "hot",
        "Body text as a share of all readable text on the page. Navigation, rail and footer are the rest.") +
      gauge("Body text", nf(artChars), "ch", Math.min(100, (artChars / 20000) * 100), "",
        "Across " + chunks + " passages, averaging " + nf(Math.round(total / Math.max(1, chunks))) + " characters each.") +
      "</div>";

    var list = '<div class="chunks">' + rows.map(function (r) {
      var pct = Math.min(100, (r.n / CHUNK_CHARS) * 100);
      var idx = r.i < 10 ? "0" + r.i : String(r.i);
      return '<div class="chunkrow"><span class="ci">' + idx + "</span>" +
        '<span class="ch">' + r.h + '<span class="cr">' + r.role + "</span></span>" +
        '<span class="chunkbar"><i class="' + (r.n > CHUNK_CHARS ? "warn" : "") + '" style="width:' + pct + '%"></i></span>' +
        '<span class="cc">' + nf(r.n) + "</span></div>";
    }).join("") + "</div>";

    var note = '<p class="scope-note">Each row is one passage a heading-aware chunker would produce from this page, because the split follows <code>h1</code> and <code>h2</code> only — an <code>h3</code> stays inside its parent chunk. The bar is that passage against the <code>' +
      nf(CHUNK_CHARS) + '</code>-character ceiling; a passage over it is split by the sentence splitter with a 200-character overlap, which is how an answer ends up in two places and is retrieved in neither. The role is inferred from what the section contains, not declared: a section with a table reads as a comparison, one with a numbered list as a sequence.' +
      (over ? " <strong>" + over + " section(s) on this page exceed the ceiling.</strong>" : "") +
      (tiny ? " <strong>" + tiny + " section(s) fall below the " + MIN_CHUNK + "-character floor and would be merged into a neighbour.</strong>" : "") +
      "</p>";

    host.innerHTML = g + list + note;
  }

  /* ---------------- build mode ---------------- */
  var ANN = {
    kind: { t: "Page-type stamp", src: "Intent ownership",
      p: "Six page types exist in this cluster and each answers a different shape of question. A document page answers “what is this and what goes in it”. A situation page answers “this just happened to me”. A glossary page answers “what does this word mean”.",
      r: "Rule: one type per URL. A page that needs two stamps is two pages." },
    job: { t: "The one job this page owns", src: "Anti-cannibalisation",
      p: "Written before the page was, and registered in the table on the cluster map. It is the test for every section below: if a section is not serving this job, it belongs on the page that owns that job instead.",
      r: "Rule: two pages whose jobs could be satisfied by one answer are one page." },
    voice: { t: "Voice-query hypotheses", src: "Voicescope",
      p: "Generated by crossing the page's head term with four circumstances — urgency, who is asking and on what, the thing in front of them, and what actually hurts — never all four in one question. Most of them deliberately do not contain the keyword, because people describe the problem rather than the jargon.",
      r: "These are hypotheses about phrasing, not measured search volume. Nothing here claims anybody has asked it." },
    h2: { t: "Retrieval chunk boundary", src: "Vectorscope",
      p: "The chunker splits on H1 and H2 only — an H3 does not start a new chunk. So every H2 here opens a passage that has to stand alone: its own heading, its own answer, its own context, its own next action.",
      r: "Constraint: one H2 section, one retrieval chunk, up to " + CHUNK_CHARS + " characters. Longer and it gets split mid-answer." },
    answer: { t: "The direct answer", src: "Vectorscope",
      p: "The first one or two sentences under the H2 answer the heading outright, with a full subject, predicate and object and no pronouns pointing at an earlier paragraph. This is the sentence a retrieval system lifts, and it has to make sense with everything around it stripped away.",
      r: "Rule: the answer sits before the evidence, never after it and never split across hero, FAQ and footer." },
    hcta: { t: "Two ways in, above the fold", src: "Content rules",
      p: "The same offer put twice: a guided route for somebody who wants to be asked the questions, and a plain-language field for somebody who already knows what they need and would rather say it. The switch is in the header, and the field is seeded with an example written for this document rather than a generic one.",
      r: "Rule: one of the two is visible at a time, and the default survives the script failing to load." },
    mistakes: { t: "Common mistakes", src: "E-E-A-T",
      p: "Everything here is something the reader does to themselves: a step skipped, a document not kept, a clause agreed to without reading it. Each entry names the act first and the consequence second, because the act is what somebody recognises in their own behaviour.",
      r: "Rule: every entry is inside the reader's control. If they can only notice it happening to them, it is a red flag instead." },
    flags: { t: "Red flags", src: "E-E-A-T",
      p: "The mirror of the block above: signals coming from the other side of the deal — a clause in a document handed over, a demand that does not sound right, a pattern in how somebody is behaving. The reader's job here is to spot it, not to avoid doing it.",
      r: "Rule: every entry is something the reader is shown rather than something they do. Anything they control belongs in common mistakes." },
    faq: { t: "FAQ block", src: "SEO + GEO",
      p: "Each question is phrased the way somebody would ask it out loud, and each answer is complete on its own rather than pointing back up the page. The block is also emitted as FAQPage structured data in the head of this file.",
      r: "Rule: a complete answer per question. An answer that only makes sense after reading the page is not an answer." },
    rel: { t: "Outbound links, with the reason", src: "Intent ownership",
      p: "Every link says why you would follow it rather than just naming the target. These are the edges of the knowledge graph: this page hands a reader to the page that owns the adjacent job, instead of trying to answer that job itself.",
      r: "Rule: descriptive anchor text. Nothing in this cluster links with the words “click here” or “read more”." },
    cta: { t: "Two separate calls to action", src: "Content rules",
      p: "The primary button goes into the product. The secondary goes to the next page in the cluster. They are deliberately different actions, because a reader who is still learning should have somewhere to go that is not a signup.",
      r: "Rule: the SEO CTA and the app CTA are never the same button." },
    disc: { t: "Scope limit", src: "E-E-A-T",
      p: "Every page states what it is not, and where the reader has to check something local. Landlord–tenant law is state and often city law, so any figure stated as universal would be wrong somewhere.",
      r: "Rule: no claim the product cannot support, and no number presented as national when it is not." },
    scope: { t: "Retrieval read of this page", src: "Vectorscope",
      p: "Measured from the rendered DOM of the page you are looking at, not from stored numbers: each H2 section's text is counted and compared with the per-chunk ceiling, and the section count is compared with the per-page ceiling.",
      r: "Constraints: " + CHUNK_CAP + " chunks per page, " + CHUNK_CHARS + " characters per chunk, " + MIN_CHUNK + " characters below which a section is merged away." }
  };

  var buildOn = false;
  function closePop() {
    var pop = document.querySelector(".annpop"); if (pop) pop.remove();
    Array.prototype.forEach.call(document.querySelectorAll('.pin[aria-expanded="true"]'), function (b) {
      b.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("click", closePop);

  function markFirsts() {
    var an = document.querySelector("#article .answer[data-ann='answer']");
    if (an) an.setAttribute("data-first", "1");
  }

  function placePins() {
    Array.prototype.forEach.call(document.querySelectorAll(".pin"), function (p) { p.remove(); });
    closePop();
    if (!buildOn) return;
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll("#article [data-ann]"), function (el) {
      var key = el.getAttribute("data-ann");
      if (!ANN[key]) return;
      if ((key === "h2" || key === "answer") && el.getAttribute("data-first") !== "1") return;
      n++;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      var b = document.createElement("button");
      b.className = "pin"; b.textContent = String(n); b.type = "button";
      b.setAttribute("aria-expanded", "false");
      b.setAttribute("aria-label", "Explain: " + ANN[key].t);
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = b.getAttribute("aria-expanded") === "true";
        closePop();
        if (open) return;
        b.setAttribute("aria-expanded", "true");
        var a = ANN[key], pop = document.createElement("div");
        pop.className = "annpop";
        pop.innerHTML = '<button type="button" aria-label="Close">×</button><span class="src"></span><h6></h6><p></p><span class="rule"></span>';
        pop.querySelector(".src").textContent = a.src;
        pop.querySelector("h6").textContent = a.t;
        pop.querySelector("p").textContent = a.p;
        pop.querySelector(".rule").textContent = a.r;
        pop.querySelector("button").addEventListener("click", closePop);
        pop.addEventListener("click", function (ev) { ev.stopPropagation(); });
        pop.style.top = "calc(100% + 8px)"; pop.style.left = "0";
        el.appendChild(pop);
        if (pop.getBoundingClientRect().right > window.innerWidth - 12) {
          pop.style.left = "auto"; pop.style.right = "0";
        }
      });
      el.appendChild(b);
    });
  }

  var buildBtn = document.getElementById("build");
  if (buildBtn) {
    buildBtn.addEventListener("click", function () {
      buildOn = !buildOn;
      buildBtn.setAttribute("aria-pressed", String(buildOn));
      document.body.classList.toggle("build", buildOn);
      try { localStorage.setItem("bd-build", buildOn ? "1" : "0"); } catch (e) {}
      placePins();
    });
    try {
      if (localStorage.getItem("bd-build") === "1") {
        buildOn = true; buildBtn.setAttribute("aria-pressed", "true"); document.body.classList.add("build");
      }
    } catch (e) {}
  }
  window.addEventListener("resize", function () { if (buildOn) closePop(); });

  markFirsts();
  fillScope();
  placePins();
})();
