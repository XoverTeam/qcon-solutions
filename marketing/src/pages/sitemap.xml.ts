import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Public pages only. The logged-in app pages are excluded (and blocked in robots.txt).
export const GET: APIRoute = async ({ site }) => {
  const guides = await getCollection("guides", ({ data }) => !data.draft);
  const today = new Date().toISOString().slice(0, 10);
  const urls: { loc: string; lastmod: string }[] = [
    { loc: "/", lastmod: today },
    { loc: "/quotation-software-malaysia", lastmod: "2026-11-11" },
    ...(guides.length ? [{ loc: "/guides/", lastmod: today }] : []),
    ...guides.map((g) => ({
      loc: `/guides/${g.id}`,
      lastmod: (g.data.updated ?? g.data.published).toISOString().slice(0, 10),
    })),
    // Pages still served by the React app
    { loc: "/contact-support", lastmod: "2026-11-02" },
    { loc: "/privacy-policy", lastmod: "2026-11-02" },
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${new URL(u.loc, site).href}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
