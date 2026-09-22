/* Static server for the generated cluster.
   No dependencies: the whole site is flat files, and the only thing a server
   has to get right here is the directory URLs the build emits in `pretty`
   mode — /agreements/real-estate/ has to resolve to that folder's index.html,
   and every other spelling of a page has to redirect to that one URL so the
   canonical in the <head> and the sitemap agree with what is actually served. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const ROOT = __dirname;
const PORT = process.env.PORT || 4321;

/* Build inputs and housekeeping files live in the repo but are not the site. */
const HIDDEN = new Set(["src", "node_modules", "server.js", "package.json", "package-lock.json"]);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

/* HTML is revalidated on every request so a deploy is visible at once; the
   assets keep their filenames across builds, so they get a short TTL rather
   than an immutable one that would strand a reader on an old stylesheet. */
function cacheFor(type) {
  return type.startsWith("text/html") ? "no-cache" : "public, max-age=3600";
}

function resolve(urlPath) {
  const rel = path.normalize(decodeURIComponent(urlPath)).replace(/^[/\\]+/, "");
  const full = path.join(ROOT, rel);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  const segments = rel.split(/[/\\]/).filter(Boolean);
  if (segments.some(s => s.startsWith(".") || HIDDEN.has(s))) return null;
  return full;
}

function send(req, res, status, body, type, extra) {
  const headers = Object.assign({ "Content-Type": type }, extra || {});
  if (req.method === "HEAD") { res.writeHead(status, headers); return res.end(); }

  const accepts = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  if (accepts && COMPRESSIBLE.test(type) && body.length > 1024) {
    body = zlib.gzipSync(body);
    headers["Content-Encoding"] = "gzip";
    headers["Vary"] = "Accept-Encoding";
  }
  headers["Content-Length"] = body.length;
  res.writeHead(status, headers);
  res.end(body);
}

function notFound(req, res) {
  send(req, res, 404, Buffer.from("404 — no such page\n"), "text/plain; charset=utf-8");
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(req, res, 405, Buffer.from("405\n"), "text/plain; charset=utf-8", { Allow: "GET, HEAD" });
  }

  const url = new URL(req.url, "http://localhost");
  let pathname = url.pathname;

  /* One canonical URL per page: /x/index.html and /x both become /x/. */
  if (pathname.endsWith("/index.html")) {
    return send(req, res, 301, Buffer.alloc(0), "text/plain", { Location: pathname.slice(0, -10) + url.search });
  }

  const target = resolve(pathname);
  if (!target) return notFound(req, res);

  let file = target;
  let stat = null;
  try { stat = fs.statSync(file); } catch (e) { /* falls through to the folder check */ }

  if (stat && stat.isDirectory()) {
    if (!pathname.endsWith("/")) {
      return send(req, res, 301, Buffer.alloc(0), "text/plain", { Location: pathname + "/" + url.search });
    }
    file = path.join(file, "index.html");
    try { stat = fs.statSync(file); } catch (e) { return notFound(req, res); }
  }

  if (!stat || !stat.isFile()) {
    /* An extensionless path that is not a folder: try the page a level up. */
    if (!pathname.endsWith("/") && !path.extname(pathname)) {
      const asDir = resolve(pathname + "/");
      if (asDir && fs.existsSync(path.join(asDir, "index.html"))) {
        return send(req, res, 301, Buffer.alloc(0), "text/plain", { Location: pathname + "/" + url.search });
      }
    }
    return notFound(req, res);
  }

  let body;
  try { body = fs.readFileSync(file); } catch (e) { return notFound(req, res); }

  const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  const etag = '"' + crypto.createHash("sha1").update(body).digest("base64").slice(0, 22) + '"';

  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, { ETag: etag, "Cache-Control": cacheFor(type) });
    return res.end();
  }

  send(req, res, 200, body, type, {
    ETag: etag,
    "Cache-Control": cacheFor(type),
    "X-Content-Type-Options": "nosniff",
  });
});

server.listen(PORT, "0.0.0.0", () => console.log("serving " + ROOT + " on :" + PORT));
