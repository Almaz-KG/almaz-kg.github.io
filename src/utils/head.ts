/**
 * Per-route document metadata.
 *
 * Every route is pre-rendered at build time (see `scripts/prerender.ts`), and
 * that is what crawlers and link unfurlers read: the raw HTML, with the title,
 * description, canonical URL, Open Graph tags and structured data already in
 * it. `useHead` feeds both sides from one description of the tags:
 *
 *   - during the pre-render, a `HeadProvider` collects what the page asked for
 *     and the build serialises it into `<head>` with `renderHead`;
 *   - in the browser, an effect applies the same tags to the live document, so
 *     client-side navigation keeps them right.
 */

import { createContext, useContext, useEffect } from "react";
import { SITE } from "@/data/content";
import { trackPageView } from "./analytics";

export type Head = {
  title: string;
  description: string;
  /** Absolute path into `static/`, used as the link preview image. */
  image?: string;
  /** Path of the current route, used as the canonical URL. */
  path: string;
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  /** Keeps the page out of search results. For the 404 page. */
  noindex?: boolean;
  /** A schema.org object, emitted as JSON-LD. */
  jsonLd?: Record<string, unknown>;
};

type MetaTag = { attr: "name" | "property"; key: string; value: string | null };

/** The pre-render's collector. Absent in the browser. */
const HeadCollector = createContext<((head: Head) => void) | null>(null);

export const HeadProvider = HeadCollector.Provider;

export function canonicalUrl(path: string): string {
  return `${SITE.blog}${path === "/" ? "/" : path}`;
}

/** Every `<meta>` a route owns. A null value means "this route has none". */
function metaTags(head: Head): MetaTag[] {
  const { title, description, image, path, type = "website", publishedAt, modifiedAt } = head;

  return [
    { attr: "name", key: "description", value: description },
    { attr: "name", key: "robots", value: head.noindex ? "noindex" : null },
    { attr: "property", key: "og:site_name", value: SITE.name },
    { attr: "property", key: "og:title", value: title },
    { attr: "property", key: "og:description", value: description },
    { attr: "property", key: "og:type", value: type },
    { attr: "property", key: "og:url", value: canonicalUrl(path) },
    { attr: "property", key: "og:image", value: image ? `${SITE.blog}${image}` : null },
    { attr: "name", key: "twitter:card", value: image ? "summary_large_image" : "summary" },
    { attr: "property", key: "article:published_time", value: publishedAt ?? null },
    { attr: "property", key: "article:modified_time", value: modifiedAt ?? null },
  ];
}

export function useHead(head: Head): void {
  // Collected during render because that is the only phase the pre-render
  // runs; effects never fire on the server. In the browser this is null.
  const collect = useContext(HeadCollector);
  collect?.(head);

  const { title, path } = head;
  // Serialised so that a structurally equal object written inline in a
  // component does not re-run the effect on every render.
  const key = JSON.stringify(head);

  useEffect(() => {
    const current = JSON.parse(key) as Head;

    document.title = current.title;
    for (const tag of metaTags(current)) setMeta(tag);
    setCanonical(canonicalUrl(current.path));
    setJsonLd(current.jsonLd ?? null);
  }, [key]);

  useEffect(() => {
    // Reported from here rather than from the router so that the view is only
    // counted once the route has decided what it is, with its real title.
    trackPageView(path, title);
  }, [path, title]);
}

/** The `<head>` tags for one pre-rendered page, as an HTML string. */
export function renderHead(head: Head): string {
  const tags = [
    `<title>${escapeHtml(head.title)}</title>`,
    ...metaTags(head)
      .filter((tag) => tag.value !== null)
      .map((tag) => `<meta ${tag.attr}="${tag.key}" content="${escapeHtml(tag.value!)}" />`),
    `<link rel="canonical" href="${escapeHtml(canonicalUrl(head.path))}" />`,
  ];

  if (head.jsonLd) {
    tags.push(`<script type="application/ld+json">${serialiseJsonLd(head.jsonLd)}</script>`);
  }

  return tags.join("\n    ");
}

/** Creates the tag on first use, updates it after that, removes it when null. */
function setMeta({ attr, key, value }: MetaTag): void {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);

  if (value === null) {
    existing?.remove();
    return;
  }

  const tag = existing ?? document.head.appendChild(document.createElement("meta"));
  tag.setAttribute(attr, key);
  tag.content = value;
}

function setCanonical(url: string): void {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const tag = existing ?? document.head.appendChild(document.createElement("link"));
  tag.rel = "canonical";
  tag.href = url;
}

function setJsonLd(value: Record<string, unknown> | null): void {
  const selector = 'script[type="application/ld+json"]';
  const existing = document.head.querySelector<HTMLScriptElement>(selector);

  if (value === null) {
    existing?.remove();
    return;
  }

  const tag = existing ?? document.head.appendChild(document.createElement("script"));
  tag.type = "application/ld+json";
  tag.textContent = serialiseJsonLd(value);
}

/** `<` is escaped so that no string in the data can close the script element. */
function serialiseJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
