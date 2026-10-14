/**
 * Writes one HTML file per route into `dist/`, after `vite build` has produced
 * the client bundle and `vite build --ssr` the server one.
 *
 * Why this exists: GitHub Pages has no rewrite rules. Before this step the site
 * was a single `index.html`, and every other address - `/blog`, every post - was
 * answered by `404.html` with the HTTP status 404. Browsers rendered it fine;
 * search engines read the status, dropped the page, and indexed nothing. The
 * raw HTML was also an empty `<div id="root">`, which crawlers that do not run
 * JavaScript see as a blank page.
 *
 * Each route now has a real file with its text and its own `<head>`, served
 * with a 200. The browser hydrates it instead of rendering from scratch.
 *
 * File names follow GitHub Pages' lookup for an extensionless path, which tries
 * `<path>.html`: `/blog` is `blog.html` and `/blog/<slug>` is `blog/<slug>.html`.
 * Neither gains a trailing slash, so the canonical URLs stay as they were.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type ServerEntry = typeof import("../src/entry-server");

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SERVER_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");

const HEAD_MARKER = "<!--app-head-->";
const ROOT_MARKER = '<div id="root"><!--app-html--></div>';

/**
 * Addresses the previous, Hugo-built version of this site published, mapped to
 * where their reader should land now. The posts themselves were retired, so
 * they point at the notes index rather than at a page with the same content.
 *
 * Written as `<path>/index.html` because Hugo's URLs ended in a slash.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/posts/": "/blog",
  "/posts/architecture-of-bittorrent-project/": "/blog",
  "/posts/data-coffee-podcast/": "/blog",
  "/posts/dbt-model-dry-run/": "/blog",
  "/posts/implementing-x-in-rust-announce/": "/blog",
  "/posts/list-of-rust-interview-questions-senior/": "/blog",
  "/posts/platform-engineering-and-cognitive-load/": "/blog",
  "/archives/": "/blog",
  "/about/": "/",
  "/projects/": "/",
};

async function main(): Promise<void> {
  const template = await fs.readFile(path.join(DIST, "index.html"), "utf8");
  for (const marker of [HEAD_MARKER, ROOT_MARKER]) {
    if (!template.includes(marker)) {
      throw new Error(`dist/index.html has no ${marker}; it is the slot the pre-render fills.`);
    }
  }

  const server = (await import(pathToFileURL(SERVER_ENTRY).href)) as ServerEntry;

  const pages = [...server.routes(), server.NOT_FOUND_PATH];
  for (const route of pages) {
    const { html, head } = await server.render(route);

    const page = template
      .replace(HEAD_MARKER, () => head)
      .replace(ROOT_MARKER, () => `<div id="root" data-path="${route}">${html}</div>`);

    await write(fileFor(route, server.NOT_FOUND_PATH), page);
  }

  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    await write(path.join(from, "index.html"), redirectPage(`${server.SITE.blog}${to}`));
  }

  console.log(
    `prerender: ${pages.length} pages, ${Object.keys(LEGACY_REDIRECTS).length} redirects`,
  );
}

function fileFor(route: string, notFound: string): string {
  if (route === "/") return "index.html";
  if (route === notFound) return "404.html";
  return `${route.slice(1)}.html`;
}

/**
 * GitHub Pages cannot answer with a 301, so this is the next best thing: an
 * immediate meta refresh, which Google treats as a permanent redirect, plus a
 * canonical link and a plain link for anything that follows neither.
 */
function redirectPage(target: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Moved</title>
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
  </head>
  <body>
    <p>This page has moved to <a href="${target}">${target}</a>.</p>
  </body>
</html>
`;
}

async function write(relative: string, content: string): Promise<void> {
  const file = path.join(DIST, relative);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
}

await main();
