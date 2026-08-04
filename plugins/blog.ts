/**
 * The whole blog build step, in one plugin.
 *
 * Authoring a post means dropping a `.md` file into `content/posts/`. This
 * plugin turns that directory into three things:
 *
 *   - one ES module per post, exporting `meta`, `html` and `toc`. They are
 *     imported lazily, so every post body is its own chunk and the home page
 *     never downloads a word of them.
 *   - `virtual:blog`, the metadata-only index the listing and teaser render
 *     from. Titles and dates are small enough to ship eagerly; bodies are not.
 *   - `rss.xml`, `sitemap.xml` and the `404.html` history fallback, written
 *     into the build output.
 */

import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { optionalList, parseFrontmatter, readingTime, requireString, slugify } from "./frontmatter";
import { disposeHighlighter, renderMarkdown } from "./render";
import type { PostMeta, PostStatus, PostTone } from "./types";

const VIRTUAL_ID = "virtual:blog";
const RESOLVED_VIRTUAL_ID = "\0virtual:blog";

const TONES: readonly PostTone[] = ["lime", "aqua", "violet", "citrus"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type BlogOptions = {
  /** Directory of `.md` posts, relative to the project root. */
  dir: string;
  /** Absolute origin, used for feed and sitemap links. No trailing slash. */
  site: string;
  /** Feed and sitemap metadata. */
  title: string;
  description: string;
  author: string;
  /**
   * Whether the dev server renders drafts and scheduled posts, badged, so they
   * can be read back while being written. Defaults to `true`.
   *
   * Set it to `false` to make `npm run dev` show exactly what a build would:
   * unpublished posts then disappear locally too, and the way to preview one is
   * to flip it back. A build ignores this entirely - it never ships them.
   */
  previewUnpublished?: boolean;
};

export function blog(options: BlogOptions): Plugin {
  let config: ResolvedConfig;
  let postsDir: string;

  /** True only on the dev server, and only when previewing is switched on. */
  const previewing = () => config.command === "serve" && options.previewUnpublished !== false;

  /** Reads and validates every post on disk, newest first. */
  async function readPosts(): Promise<PostMeta[]> {
    const entries = await fs.readdir(postsDir).catch(() => [] as string[]);
    const files = entries.filter((name) => name.endsWith(".md")).sort();

    const posts = await Promise.all(
      files.map(async (name) => {
        const raw = await fs.readFile(path.join(postsDir, name), "utf8");
        return toMeta(raw, name);
      }),
    );

    return posts
      .filter((post) => post.status === "published" || previewing())
      .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  }

  return {
    name: "blog",
    enforce: "pre",

    configResolved(resolved) {
      config = resolved;
      postsDir = path.resolve(resolved.root, options.dir);
    },

    // Posts live outside `src`, so the dev server has to be told to watch them.
    configureServer(server) {
      server.watcher.add(postsDir);

      const invalidate = (file: string) => {
        if (!file.startsWith(postsDir)) return;

        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);

        // Adding or deleting a post changes the index, and a body edit changes
        // a chunk no HMR boundary owns, so both are a reload.
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", invalidate);
      server.watcher.on("unlink", invalidate);
      server.watcher.on("change", invalidate);

      /*
       * The feed and the sitemap are written by `writeBundle`, which only runs
       * on a build, so in dev those paths would hit nothing. Vite's SPA
       * fallback then answers them with index.html, the router finds no route
       * for `/rss.xml` and renders the 404 page - a confusing way to discover
       * that a link works in production.
       *
       * Registered here rather than in the returned post-hook so it runs before
       * Vite's internal middlewares, and therefore before that fallback.
       */
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/rss.xml" && url !== "/sitemap.xml") return next();

        readPosts().then(
          (posts) => {
            res.setHeader("Content-Type", "application/xml; charset=utf-8");
            // Rebuilt per request, so an edit to a post shows up on reload.
            res.setHeader("Cache-Control", "no-store");
            res.end(
              url === "/rss.xml" ? renderFeed(posts, options) : renderSitemap(posts, options),
            );
          },
          // Almost always malformed front matter. Vite's overlay reports it
          // with the filename and the reason.
          (error) => next(error),
        );
      });
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
    },

    async load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return;

      const posts = await readPosts();
      const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();

      return (
        `export const posts = ${JSON.stringify(posts)};\n` +
        `export const tags = ${JSON.stringify(tags)};\n`
      );
    },

    async transform(code, id) {
      const file = id.split("?")[0];
      if (!file.endsWith(".md") || !file.startsWith(postsDir)) return;

      const name = path.basename(file);
      const meta = toMeta(code, name);

      // An unpublished post is still matched by the glob that builds the lazy
      // importers, so without this its text would be bundled into the deployed
      // site and could be read by anyone who guessed the chunk filename. That
      // is the whole point of scheduling, so in a build it compiles to nothing.
      if (meta.status !== "published" && !previewing()) {
        return {
          code:
            `export const meta = ${JSON.stringify(meta)};\n` +
            `export const html = "";\n` +
            `export const toc = [];\n`,
          map: null,
        };
      }

      const { body } = parseFrontmatter(code, name);
      const { html, toc } = await renderMarkdown(body, name);

      return {
        code:
          `export const meta = ${JSON.stringify(meta)};\n` +
          `export const html = ${JSON.stringify(html)};\n` +
          `export const toc = ${JSON.stringify(toc)};\n`,
        map: null,
      };
    },

    async writeBundle() {
      const posts = await readPosts();
      const outDir = path.resolve(config.root, config.build.outDir);

      await fs.writeFile(path.join(outDir, "rss.xml"), renderFeed(posts, options), "utf8");
      await fs.writeFile(path.join(outDir, "sitemap.xml"), renderSitemap(posts, options), "utf8");

      // GitHub Pages has no rewrite rules, so a hard load of /blog/<slug> is a
      // 404. Serving the app as the 404 body lets the router take over and
      // render the right page.
      await fs.copyFile(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
    },

    async closeBundle() {
      await disposeHighlighter();
    },
  };
}

/** Front matter -> validated `PostMeta`. Throws with the filename on bad input. */
function toMeta(raw: string, file: string): PostMeta {
  const { data, body } = parseFrontmatter(raw, file);
  const slug = file.replace(/\.md$/, "");

  const date = requireString(data, "date", file);
  if (!ISO_DATE.test(date)) {
    throw new Error(`${file}: \`date\` must be written as YYYY-MM-DD, got "${date}".`);
  }

  const updated = typeof data.updated === "string" ? data.updated.trim() : undefined;
  if (updated && !ISO_DATE.test(updated)) {
    throw new Error(`${file}: \`updated\` must be written as YYYY-MM-DD, got "${updated}".`);
  }

  const tone = typeof data.tone === "string" ? data.tone.trim() : "";
  if (tone && !TONES.includes(tone as PostTone)) {
    throw new Error(`${file}: unknown \`tone\` "${tone}", expected one of ${TONES.join(", ")}.`);
  }

  const cover = typeof data.cover === "string" ? data.cover.trim() : undefined;
  if (cover && !cover.startsWith("/")) {
    throw new Error(`${file}: \`cover\` must be an absolute path into static/, got "${cover}".`);
  }

  const coverFit = typeof data.coverFit === "string" ? data.coverFit.trim() : "cover";
  if (coverFit !== "contain" && coverFit !== "cover") {
    throw new Error(`${file}: \`coverFit\` must be "contain" or "cover", got "${coverFit}".`);
  }

  return {
    slug: slugify(slug),
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    date,
    ...(updated ? { updated } : {}),
    tags: optionalList(data, "tags"),
    ...(cover ? { cover } : {}),
    ...(typeof data.coverAlt === "string" ? { coverAlt: data.coverAlt } : {}),
    coverFit,
    // Without an explicit tone, the slug picks one, so a post keeps the same
    // accent colour no matter what else is published around it.
    tone: (tone as PostTone) || TONES[hash(slug) % TONES.length],
    readingTime: readingTime(body),
    status: statusOf(date, data.draft === true),
  };
}

/**
 * `draft` beats the calendar: a post you have marked unfinished stays
 * unfinished even once its date arrives.
 *
 * Dates are compared as plain `YYYY-MM-DD` strings against today in UTC, which
 * sorts correctly and avoids the question of whose midnight counts. A post
 * dated today is published; one dated tomorrow is not.
 */
function statusOf(date: string, draft: boolean): PostStatus {
  if (draft) return "draft";
  return date > new Date().toISOString().slice(0, 10) ? "scheduled" : "published";
}

function renderFeed(posts: PostMeta[], options: BlogOptions): string {
  const items = posts
    .map((post) => {
      const url = `${options.site}/blog/${post.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(options.title)}</title>`,
    `    <link>${options.site}/blog</link>`,
    `    <description>${escapeXml(options.description)}</description>`,
    "    <language>en</language>",
    `    <managingEditor>${escapeXml(options.author)}</managingEditor>`,
    `    <atom:link href="${options.site}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

function renderSitemap(posts: PostMeta[], options: BlogOptions): string {
  const urls = [
    { loc: `${options.site}/`, lastmod: undefined as string | undefined },
    { loc: `${options.site}/blog`, lastmod: posts[0]?.updated ?? posts[0]?.date },
    ...posts.map((post) => ({
      loc: `${options.site}/blog/${post.slug}`,
      lastmod: post.updated ?? post.date,
    })),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ loc, lastmod }) =>
      [
        "  <url>",
        `    <loc>${loc}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n");
}

/** FNV-1a, only ever used to pick an accent colour. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
