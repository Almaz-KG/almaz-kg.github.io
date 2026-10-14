/**
 * The app, rendered to HTML in Node. Built by `vite build --ssr` and driven by
 * `scripts/prerender.ts`, which writes one file per route.
 *
 * Nothing here ships to the browser. The browser hydrates the result with
 * `main.tsx`, which renders the same tree, so whatever this file wraps around
 * `<App />` has to stay invisible to the markup.
 */

import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import App from "./App";
import { SITE } from "./data/content";
import { POSTS, loadPost } from "./data/posts";
import { HeadProvider, renderHead, type Head } from "./utils/head";
import { setRenderedPath } from "./utils/router";

export { SITE };

/**
 * The path `404.html` is rendered for. Nothing routes to it; any path the app
 * does not know renders the same page, and the host serves this file for all
 * of them.
 */
export const NOT_FOUND_PATH = "/404";

/** Every path that gets its own file, in the order they are written. */
export function routes(): string[] {
  return ["/", "/blog", ...POSTS.map((post) => `/blog/${post.slug}`)];
}

export async function render(path: string): Promise<{ html: string; head: string }> {
  setRenderedPath(path);

  // A post body is a lazy chunk. Loading it first puts it where `usePost`
  // reads synchronously, so the page renders with its text, not a skeleton.
  const slug = /^\/blog\/([^/]+)$/.exec(path)?.[1];
  if (slug) await loadPost(slug);

  let head: Head | undefined;

  // `prerender`, not `renderToString`: the blog is behind `lazy`, and only the
  // static renderer waits for suspended trees instead of emitting fallbacks.
  const { prelude } = await prerenderToNodeStream(
    <HeadProvider value={(collected) => (head = collected)}>
      <StrictMode>
        <App />
      </StrictMode>
    </HeadProvider>,
  );

  let html = "";
  for await (const chunk of prelude) html += chunk;

  if (!head) throw new Error(`${path}: no component called useHead, so it has no <title>.`);

  return { html, head: renderHead(head) };
}
