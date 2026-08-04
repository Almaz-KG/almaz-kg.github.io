import avatar from "@/assets/almaz-avatar.webp";
import { SITE, SOCIALS } from "@/data/content";
import { neighbours, type PostMeta } from "@/data/posts";
import { ShareRow } from "./ShareRow";
import { Tag } from "./Tag";

/** Tags, sharing, who wrote this, and where to go next. */
export function PostFooter({ post }: { post: PostMeta }) {
  const { previous, next } = neighbours(post.slug);

  return (
    <footer className="measure mt-20">
      <div className="border-t border-hair pt-8">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <div className="mt-6">
          <ShareRow post={post} />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-hair bg-inset p-6 sm:flex-row sm:items-start">
        <img
          src={avatar}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-2xl object-cover"
        />

        <div>
          <p className="font-semibold text-copy">{SITE.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {SITE.role}. I build data platforms that survive production, and write down the parts
            that took longer to understand than they should have.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] tracking-wide text-faint transition-colors hover:text-lime"
              >
                {social.label.toLowerCase()}
              </a>
            ))}
          </div>
        </div>
      </div>

      {(previous || next) && (
        <nav aria-label="More notes" className="mt-10 grid gap-4 sm:grid-cols-2">
          <NeighbourLink post={previous} direction="previous" />
          <NeighbourLink post={next} direction="next" />
        </nav>
      )}

      <div className="mt-10 flex justify-center">
        <a
          href="/blog"
          className="font-mono text-[11px] tracking-[0.22em] text-faint uppercase transition-colors hover:text-lime"
        >
          ← all notes
        </a>
      </div>
    </footer>
  );
}

function NeighbourLink({ post, direction }: { post?: PostMeta; direction: "previous" | "next" }) {
  // Keeps the two-column grid balanced when a post is first or last.
  if (!post) return <div className="hidden sm:block" />;

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group rounded-2xl border border-hair bg-inset p-5 transition-colors hover:border-lime/40"
    >
      <span className="font-mono text-[10px] tracking-[0.24em] text-faint uppercase">
        {direction === "previous" ? "← Older" : "Newer →"}
      </span>
      <p className="mt-2 leading-snug font-medium text-balance text-copy transition-colors group-hover:text-lime">
        {post.title}
      </p>
    </a>
  );
}
