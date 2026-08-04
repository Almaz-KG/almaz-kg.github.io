import type { PostMeta } from "@/data/posts";
import { TONE_GRADIENT } from "@/utils/tones";
import { cn } from "@/utils/cn";

type PostCoverProps = {
  post: PostMeta;
  className?: string;
  /** Cover images are decorative in lists, where the title already links out. */
  decorative?: boolean;
};

/**
 * The post's cover image, or - when it has none - a tinted plate carrying its
 * first tag, so a coverless post still reads as a card rather than a gap.
 */
export function PostCover({ post, className, decorative = false }: PostCoverProps) {
  if (!post.cover) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border bg-gradient-to-br",
          TONE_GRADIENT[post.tone],
          className,
        )}
      >
        <span className="font-mono text-[11px] tracking-[0.28em] text-faint uppercase">
          {post.tags[0] ?? "note"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={post.cover}
      alt={decorative ? "" : (post.coverAlt ?? post.title)}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
      className={cn(
        "rounded-2xl border border-hair bg-inset",
        // A logo needs breathing room inside the frame; a photograph fills it.
        post.coverFit === "contain" ? "object-contain p-6" : "object-cover",
        className,
      )}
    />
  );
}
