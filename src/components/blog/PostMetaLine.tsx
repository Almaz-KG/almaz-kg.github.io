import type { PostMeta, PostStatus } from "@/data/posts";
import { formatDate } from "@/data/posts";
import { TONE_TEXT } from "@/utils/tones";
import { cn } from "@/utils/cn";

/**
 * How an unpublished post is labelled. Only ever rendered by the dev server:
 * a build has no posts in these states to render.
 */
const BADGE: Record<Exclude<PostStatus, "published">, { label: string; tone: string }> = {
  draft: { label: "draft", tone: TONE_TEXT.citrus },
  scheduled: { label: "scheduled", tone: TONE_TEXT.violet },
};

/** `21 Jan 2024 · 7 min read`, with a status flag when the post is not live. */
export function PostMetaLine({ post, className }: { post: PostMeta; className?: string }) {
  const badge = post.status === "published" ? null : BADGE[post.status];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-faint",
        className,
      )}
    >
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span className="h-1 w-1 rounded-full bg-copy/20" />
      <span>{post.readingTime} min read</span>

      {badge && (
        <span className={cn("rounded-full border border-current/40 px-2 py-0.5", badge.tone)}>
          {badge.label}
        </span>
      )}
    </div>
  );
}
