# QCON public website (qcon.solutions)

The public pages of qcon.solutions (homepage, guides, 404, sitemap, robots.txt) are built here as
**plain HTML** with [Astro](https://astro.build). Every crawler can read them, including Google, Bing,
ChatGPT, Perplexity and Claude, because none of the content needs JavaScript.

The logged-in app (`/login`, `/register`, `/dashboard`, `/quotation`, …) is **not** here. It's the
React app in `/home/qcon/app` on the server and is unchanged.

```
marketing/
├── src/pages/index.astro          ← homepage (all text is at the top of the file)
├── src/content/guides/*.md        ← one Markdown file per guide/article
├── src/content/guides/_TEMPLATE.md ← copy this to start a new guide
├── src/layouts/Base.astro         ← <head>: title, description, Open Graph, GA4 + Google Ads tags
├── src/pages/sitemap.xml.ts       ← sitemap (guides are added automatically)
├── public/robots.txt, og-image.png, favicon.svg
└── dist/                          ← BUILT SITE, committed to git, served by the server as-is
```

## How it is served

`server/vite.ts` in the app serves `/home/qcon/marketing-src/marketing/dist` **before** the React
app's files:

1. A file exists in `dist`, e.g. `/`, `/guides/...`, `/robots.txt` or `/sitemap.xml` → the static page is served
2. Otherwise → the React app takes over as before (`/login`, `/dashboard`, `/favicon-32.png`, …)
3. An unknown URL → `dist/404.html` with a real 404 status

Signed-in users who open the homepage are still sent to `/dashboard` (a small script in `Base.astro`).

## Adding a guide

1. Copy `src/content/guides/_TEMPLATE.md` to e.g. `src/content/guides/renovation-quotation-template-malaysia.md`
2. Fill in `title`, `description`, `published`, and remove `draft: true`
3. Build and commit (needs Node 22.23+): `npm ci && npm run build && git add -A && git commit -m "Add guide" && git push`
4. On the server: `ssh root@SERVER "sudo -iu qcon git -C /home/qcon/marketing-src pull --ff-only"`. That's all: no app rebuild or restart

The guide appears at `qcon.solutions/guides/<file-name>`, on the `/guides/` list and in the sitemap, and
the footer shows a "Guides" link once there is at least one guide.

## Rolling back

`sudo -iu qcon mv ~/marketing-src ~/marketing-src.off` puts the old React homepage back immediately
(no restart needed). Move it back to restore.
