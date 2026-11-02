import { defineConfig } from "astro/config";

// Static marketing site for https://qcon.solutions
// Built to plain HTML in ./dist and served by the QCON Express server
// in front of the React app (see ../DEPLOY.md).
export default defineConfig({
  site: "https://qcon.solutions",
  output: "static",
  trailingSlash: "ignore",
  build: {
    // "preserve": index pages -> folder/index.html (served at /guides/), others -> name.html (/guides/foo)
    format: "preserve",
    assets: "_site", // keep clear of the React app's /assets folder
  },
  compressHTML: true,
});
