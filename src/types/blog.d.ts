/**
 * Types for the modules `plugins/blog.ts` generates. Neither of these exists on
 * disk as TypeScript, so they are declared here for the compiler.
 */

/** The metadata-only index, built from `content/posts/` at build time. */
declare module "virtual:blog" {
  import type { PostMeta } from "../../plugins/types";

  /** Newest first. Drafts are included in dev and dropped from the build. */
  export const posts: PostMeta[];

  /** Every tag used by `posts`, alphabetical. */
  export const tags: string[];
}

/** A compiled post. Imported lazily so each body lands in its own chunk. */
declare module "*.md" {
  import type { PostMeta, TocEntry } from "../../plugins/types";

  export const meta: PostMeta;
  export const html: string;
  export const toc: TocEntry[];
}
