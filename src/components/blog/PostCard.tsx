import type { CSSProperties } from "react";
import type { PostMeta } from "@/data/posts";
import { TONE_GLOW } from "@/utils/tones";
import { cn } from "@/utils/cn";
import { PostCover } from "./PostCover";
import { PostMetaLine } from "./PostMetaLine";
import { Tag } from "./Tag";

type PostCardProps = {
  post: PostMeta;
  /** The newest post leads the list at double height, cover above the text. */
  featured?: boolean;
};

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <a
      href={`/blog/${post.slug}`}
      style={{ "--glow": TONE_GLOW[post.tone] } as CSSProperties}
      className="group relative block overflow-hidden rounded-3xl border border-hair bg-sheet transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-lime/35 hover:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.5)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(520px circle at 20% 0%, var(--glow), transparent 70%)",
        }}
      />

      <article
        className={cn(
          "relative gap-5 p-5 sm:p-6",
          featured ? "flex flex-col" : "flex flex-col sm:flex-row sm:items-start sm:gap-6",
        )}
      >
        <PostCover
          post={post}
          decorative
          className={cn(
            "w-full shrink-0",
            featured ? "aspect-[21/9]" : "aspect-[16/10] sm:h-28 sm:w-44 sm:aspect-auto",
          )}
        />

        <div className="min-w-0 flex-1">
          <PostMetaLine post={post} />

          <h3
            className={cn(
              "mt-3 font-semibold tracking-tight text-balance text-copy transition-colors group-hover:text-lime",
              featured ? "text-2xl sm:text-3xl" : "text-xl",
            )}
          >
            {post.title}
          </h3>

          <p
            className={cn(
              "mt-2.5 text-muted",
              featured ? "text-base leading-relaxed" : "text-sm leading-relaxed",
            )}
          >
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
