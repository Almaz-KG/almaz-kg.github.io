/**
 * The contract between the build-time blog plugin and the app.
 *
 * These types are the single source of truth for what a post is: the plugin
 * produces them, `src/types/blog.d.ts` declares the generated modules in terms
 * of them, and the components consume them. They are erased at build time, so
 * importing them from `src` costs nothing at runtime.
 */

import type { TocEntry } from "./render";

export type { TocEntry };

/** Accent colours, mirroring `src/utils/tones.ts`. */
export type PostTone = "lime" | "aqua" | "violet" | "citrus";

/**
 * Whether a post is live, derived rather than written.
 *
 * Two independent controls produce it, so that "not finished" and "not yet"
 * stay separate concerns:
 *
 *   - `draft: true` in the front matter holds a post back regardless of date.
 *     This is the one you set while the writing is still bad.
 *   - a `date` in the future schedules it. The post goes live on the first
 *     build on or after that date.
 *
 * Only `published` posts exist in a production build. The other two are visible
 * in `npm run dev`, with a badge, and are stripped from the build completely.
 */
export type PostStatus = "published" | "scheduled" | "draft";

/** Everything the blog index needs, without the weight of the post body. */
export type PostMeta = {
  /** Filename without the extension; the last segment of `/blog/<slug>`. */
  slug: string;
  title: string;
  description: string;
  /**
   * ISO `YYYY-MM-DD`, as written in the front matter. This is the publication
   * date, not the date the file was created: setting it in the future is how a
   * post is scheduled.
   */
  date: string;
  /** ISO `YYYY-MM-DD` of the last meaningful edit, when there has been one. */
  updated?: string;
  tags: string[];
  /** Absolute path into `static/`, e.g. `/assets/images/posts/content-pipeline.svg`. */
  cover?: string;
  coverAlt?: string;
  /** `contain` pads a logo inside the frame; `cover` fills it. Default `cover`. */
  coverFit: "contain" | "cover";
  tone: PostTone;
  /** Whole minutes, floor 1. */
  readingTime: number;
  /** Derived from `draft` and `date`; see `PostStatus`. */
  status: PostStatus;
};

/** The shape a `.md` file compiles to. */
export type PostModule = {
  meta: PostMeta;
  /** Rendered, sanitiser-free HTML: the input is this repo's own markdown. */
  html: string;
  toc: TocEntry[];
};
