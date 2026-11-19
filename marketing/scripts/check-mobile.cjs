#!/usr/bin/env node
// Optional check (needs Playwright + Chromium): every page fits a 390px phone screen without sideways scrolling
// and has no JavaScript errors. Run after `npm run build`:  node scripts/check-mobile.cjs
const http = require("http"), fs = require("fs"), path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch { console.log("Playwright not installed; mobile check skipped."); process.exit(0); }

const dist = path.join(__dirname, "..", "dist");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".xml": "application/xml" };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  let f = path.join(dist, u.endsWith("/") ? u + "index.html" : u);
  if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
}).listen(0, async () => {
  const port = server.address().port;
  const pages = ["/", "/guides/", ...fs.readdirSync(path.join(dist, "guides")).filter((n) => n.endsWith(".html") && n !== "index.html").map((n) => "/guides/" + n.replace(/\.html$/, ""))];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  const problems = [];
  page.on("pageerror", (e) => problems.push(`${page.url()}: JS error ${e.message}`));
  for (const p of pages) {
    await page.goto(`http://localhost:${port}${p}`, { waitUntil: "load" });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 1) problems.push(`${p}: ${over}px wider than a phone screen`);
  }
  await browser.close(); server.close();
  if (problems.length) { console.error("✗ " + problems.join("\n✗ ")); process.exit(1); }
  console.log(`✓ ${pages.length} pages fit a phone screen, no JS errors`);
});
