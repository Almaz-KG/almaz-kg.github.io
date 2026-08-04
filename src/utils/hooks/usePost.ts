import { useEffect, useState } from "react";
import { findPost, loadPost, type PostModule } from "@/data/posts";

type PostState =
  { status: "loading" } | { status: "ready"; post: PostModule } | { status: "missing" };

/**
 * Fetches the chunk holding one post's body.
 *
 * The import is per-post, so navigating between notes downloads only the note
 * being opened. An unknown slug resolves to `missing`, which the page renders
 * as a 404 rather than an error.
 */
export function usePost(slug: string): PostState {
  // The body is the only part that has to be fetched. Whether the slug exists
  // at all is a lookup in the build-time index, so it is answered during render
  // instead of being pushed through state by the effect below.
  const known = findPost(slug) !== undefined;
  const [loaded, setLoaded] = useState<{ slug: string; post: PostModule } | null>(null);

  useEffect(() => {
    const load = loadPost(slug);
    if (!load) return;

    let current = true;

    load.then(
      (post) => current && setLoaded({ slug, post }),
      // A failed chunk request is almost always a stale deploy: the HTML in
      // this tab points at hashed files that no longer exist. Reloading gets
      // the current build, and the post opens.
      () => current && window.location.reload(),
    );

    return () => {
      current = false;
    };
  }, [slug]);

  if (!known) return { status: "missing" };
  // The slug is carried alongside the module so that navigating from one post
  // to another reports `loading` immediately, rather than showing the previous
  // body for the render before the new chunk arrives.
  if (loaded?.slug === slug) return { status: "ready", post: loaded.post };
  return { status: "loading" };
}
