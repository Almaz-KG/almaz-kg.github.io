import type { PostMeta, PostStatus } from "@/data/posts";
import { formatDate } from "@/data/posts";
import { cn } from "@/utils/cn";
import { Dot } from "./Dot";

/**
 * How an unpublished post is labelled. Only ever rendered by the dev server:
 * a build has no posts in these states to render.
 */
const BADGE: Record<Exclude<PostStatus, "published">, string> = {
  draft: "draft",
  scheduled: "scheduled",
};

type PostMetaLineProps = {
  post: PostMeta;
  /** Whether to add when the note was last revised, if it has been. */
  updated?: boolean;
  className?: string;
};

/**
 * `29 September 2026 · 12 min`, in the mono face because it is data. Tags are
 * words rather than data, and a note lists them in its end matter.
 */
export function PostMetaLine({ post, updated = false, className }: PostMetaLineProps) {
  const badge = post.status === "published" ? null : BADGE[post.status];

  return (
    <p className={cn("font-mono text-[0.875rem] text-faint", className)}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <Dot className="" />
      {post.readingTime} min
      {updated && post.updated && (
        <>
          <Dot className="" />
          revised <time dateTime={post.updated}>{formatDate(post.updated)}</time>
        </>
      )}
      {badge && <span className="ml-3 text-accent">[{badge}]</span>}
    </p>
  );
}
