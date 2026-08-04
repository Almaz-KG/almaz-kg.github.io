/**
 * A history router in one file.
 *
 * The site has three routes and no data loading, so a routing library would be
 * more configuration than code. This exposes the two things the app actually
 * needs - read the current path, change it - plus a delegated click handler so
 * that plain `<a href="/blog/...">` anchors, including the ones inside rendered
 * markdown, navigate without a reload.
 *
 * Deep links work on GitHub Pages because the build writes `404.html` as a copy
 * of `index.html`; see `plugins/blog.ts`.
 */

import { useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Set<Listener>();

/** Scroll offset per history entry, so going back lands where you left. */
const scrollPositions = new Map<string, number>();

/** Trailing slashes are trimmed so `/blog/` and `/blog` are one route. */
function normalize(pathname: string): string {
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string {
  return normalize(window.location.pathname);
}

/** The current path, re-rendering the component whenever it changes. */
export function usePath(): string {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** `to` may carry a hash, e.g. `/#projects` from a link inside a post. */
export function navigate(to: string, options: { replace?: boolean } = {}): void {
  const [rawPath, hash] = to.split("#");
  const target = normalize(rawPath || "/");
  const href = hash ? `${target}#${hash}` : target;

  if (target === getSnapshot() && !hash && !options.replace) return;

  scrollPositions.set(getSnapshot(), window.scrollY);

  if (options.replace) {
    window.history.replaceState(null, "", href);
  } else {
    window.history.pushState(null, "", href);
  }

  emit();

  if (!hash) {
    // Synchronously, before the browser paints the new route: deferring this by
    // even one frame shows the incoming page scrolled to wherever the outgoing
    // one happened to be. `instant` because the alternative is watching a
    // smooth scroll fly past a page you have not read yet.
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  // An anchor, on the other hand, cannot be measured until the route it lives
  // in has been laid out.
  afterRender(() => document.getElementById(hash)?.scrollIntoView());
}

/** Runs once the new route has been committed, laid out and painted. */
function afterRender(task: () => void): void {
  requestAnimationFrame(() => requestAnimationFrame(task));
}

window.addEventListener("popstate", () => {
  const restore = scrollPositions.get(getSnapshot()) ?? 0;
  emit();
  // Waits for layout, or the page is still too short to scroll back to where
  // the reader left it.
  afterRender(() => window.scrollTo({ top: restore, behavior: "instant" }));
});

/**
 * Turns same-origin left clicks into client-side navigation, and leaves
 * everything else - new tabs, downloads, external hosts, in-page anchors - to
 * the browser.
 */
window.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
  if (anchor.getAttribute("rel")?.includes("external")) return;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return;

  // Real files - /rss.xml, /cv.pdf - are served by the host, not routed.
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

  // `#section` on the current page is the browser's job, not the router's.
  if (url.hash && normalize(url.pathname) === getSnapshot()) return;

  event.preventDefault();
  navigate(url.pathname + url.hash);
});
