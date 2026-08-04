import { posts, tags } from "virtual:blog";
import type { PostMeta, PostModule } from "../../plugins/types";

export type { PostMeta, PostModule };
export type { PostStatus, TocEntry } from "../../plugins/types";

/**
 * Every post the current build publishes, newest first. Metadata only - no
 * bodies. In `npm run dev` this also carries drafts and scheduled posts, so
 * they can be previewed; a production build has neither.
 */
export const POSTS: PostMeta[] = posts;

/** Every tag in use, alphabetical. */
export const POST_TAGS: string[] = tags;

/**
 * One lazy importer per post file. Not eager: a post body is the largest thing
 * on the site, and nobody should download all of them to read one.
 */
const LOADERS = import.meta.glob<PostModule>("/content/posts/*.md");

const BY_SLUG = new Map(
  Object.entries(LOADERS).map(([file, load]) => [file.replace(/^.*\/(.+)\.md$/, "$1"), load]),
);

export function findPost(slug: string): PostMeta | undefined {
  return POSTS.find((post) => post.slug === slug);
}

/**
 * Resolves to `undefined` for an unknown slug, which the router renders as 404.
 *
 * The glob matches every file in the directory, unpublished ones included, so
 * the index - not the filesystem - decides what has a page. In a build `POSTS`
 * holds only published posts, and a scheduled slug is as unknown as a typo.
 */
export function loadPost(slug: string): Promise<PostModule> | undefined {
  if (!findPost(slug)) return undefined;
  return BY_SLUG.get(slug)?.();
}

/** The posts published either side of `slug`, for the read-next footer. */
export function neighbours(slug: string): { previous?: PostMeta; next?: PostMeta } {
  const index = POSTS.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    // POSTS is newest first, so the *older* post is the one after it.
    previous: POSTS[index + 1],
    next: POSTS[index - 1],
  };
}

/** `2024-01-22` -> `22 January 2024`, rendered the same in every timezone. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
