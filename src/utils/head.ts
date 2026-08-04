/**
 * Per-route document metadata.
 *
 * The app is client-rendered, so this runs after the HTML arrives. Crawlers
 * that execute JavaScript and every link unfurler that does the same will see
 * the right title, description and preview image; the ones that only read the
 * raw response fall back to the defaults in `index.html`. Pre-rendering the
 * routes at build time is the fix for that, and this hook is what it would
 * feed off.
 */

import { useEffect } from "react";
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
};

export function useHead({
  title,
  description,
  image,
  path,
  type = "website",
  publishedAt,
  modifiedAt,
}: Head): void {
  useEffect(() => {
    const url = `${SITE.blog}${path === "/" ? "" : path}`;

    document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("property", "og:image", image ? `${SITE.blog}${image}` : null);
    setMeta("property", "article:published_time", publishedAt ?? null);
    setMeta("property", "article:modified_time", modifiedAt ?? null);

    setCanonical(url);

    // Reported from here rather than from the router so that the view is only
    // counted once the route has decided what it is, with its real title.
    trackPageView(path, title);
  }, [title, description, image, path, type, publishedAt, modifiedAt]);
}

/** Creates the tag on first use, updates it after that, removes it when null. */
function setMeta(keyName: "name" | "property", key: string, value: string | null): void {
  const selector = `meta[${keyName}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (value === null) {
    existing?.remove();
    return;
  }

  const tag = existing ?? document.head.appendChild(document.createElement("meta"));
  tag.setAttribute(keyName, key);
  tag.content = value;
}

function setCanonical(url: string): void {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const tag = existing ?? document.head.appendChild(document.createElement("link"));
  tag.rel = "canonical";
  tag.href = url;
}
