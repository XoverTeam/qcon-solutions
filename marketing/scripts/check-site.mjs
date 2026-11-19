#!/usr/bin/env node
// Pre-publish checks for the built marketing site (run after `npm run build`):
//   node scripts/check-site.mjs        (or: npm run check)
// Fails (exit 1) on: broken internal links, missing titles/descriptions/canonicals, bad JSON-LD,
// duplicate titles or descriptions, guides missing from the sitemap, leftover placeholders.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
const guidesDir = path.join(root, "src/content/guides");
// Routes and files served by the React app on the same domain, not by this site (checked live 19 Nov 2026).
const APP_ROUTES = new Set(["/login", "/register", "/contact-support", "/privacy-policy", "/dashboard", "/onboarding",
  "/favicon-32.png", "/apple-touch-icon.png"]);

const errors = [];
const fail = (msg) => errors.push(msg);

if (!fs.existsSync(dist)) { console.error("dist/ not found. Run `npm run build` first."); process.exit(1); }

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith(".html") && !f.endsWith("404.html") && !path.basename(f).startsWith("google"));

function resolves(href) {
  const clean = decodeURI(href.split("#")[0].split("?")[0]);
  if (!clean || clean === "/") return true;
  if (APP_ROUTES.has(clean.replace(/\/$/, ""))) return true;
  const p = path.join(dist, clean);
  return [p, p + ".html", path.join(p, "index.html")].some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
}

const titles = new Map(), descs = new Map();
for (const f of htmlFiles) {
  const rel = "/" + path.relative(dist, f);
  const html = fs.readFileSync(f, "utf8");
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail(`${rel}: no <title>`);
  if (!desc) fail(`${rel}: no meta description`);
  if (!/rel="canonical"/.test(html)) fail(`${rel}: no canonical link`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rel}: must have exactly one <h1>`);
  if (title) titles.set(title, [...(titles.get(title) || []), rel]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), rel]);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(`${rel}: invalid JSON-LD`); }
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (href.startsWith("//")) continue;
    if (!resolves(href)) fail(`${rel}: broken internal link ${href}`);
  }
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "");
  for (const bad of ["TODO", "TBD", "lorem ipsum", "[citation needed]", "XX%", "RMXX"]) {
    if (text.toLowerCase().includes(bad.toLowerCase())) fail(`${rel}: contains placeholder "${bad}"`);
  }
}
for (const [t, where] of titles) if (where.length > 1) fail(`duplicate title "${t}": ${where.join(", ")}`);
for (const [d, where] of descs) if (where.length > 1) fail(`duplicate description: ${where.join(", ")}`);

// Every guide must be built and listed in the sitemap.
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
for (const f of fs.readdirSync(guidesDir).filter((n) => n.endsWith(".md") && !n.startsWith("_"))) {
  const src = fs.readFileSync(path.join(guidesDir, f), "utf8");
  if (/^draft:\s*true/m.test(src)) continue;
  const slug = f.replace(/\.md$/, "");
  if (!fs.existsSync(path.join(dist, "guides", slug + ".html"))) fail(`guide ${slug} was not built`);
  if (!sitemap.includes(`/guides/${slug}<`)) fail(`guide ${slug} missing from sitemap.xml`);
  if (!/^### Sources/m.test(src) && !/markup-vs-margin/.test(slug)) fail(`guide ${slug} has no "### Sources" section`);
  const pub = (src.match(/^published:\s*(\S+)/m) || [])[1];
  if (pub && new Date(pub) > new Date(Date.now() + 36e5 * 24)) fail(`guide ${slug} has a future published date ${pub}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  - ` + errors.join("\n  - "));
  process.exit(1);
}
console.log(`✓ ${htmlFiles.length} pages checked: links, titles, descriptions, canonicals, JSON-LD, sitemap all OK`);
