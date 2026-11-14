import avatar from "@/assets/almaz-avatar.webp";
import { Dot } from "@/components/doc/Dot";
import { SITE, SOCIALS } from "@/data/content";
import { neighbours, type PostMeta } from "@/data/posts";
import { linkProps } from "@/utils/links";
import { ShareRow } from "./ShareRow";

/**
 * The end matter of a note, in the order a paper has it: what it is filed
 * under, who wrote it, and what to read next.
 */
export function PostFooter({ post }: { post: PostMeta }) {
  const { previous, next } = neighbours(post.slug);

  return (
    <footer className="mt-16 border-t border-hair pt-6">
      {post.tags.length > 0 && (
        <p className="text-muted">
          Filed under{" "}
          {post.tags.map((tag, i) => (
            <span key={tag}>
              {i > 0 && ", "}
              <a href={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</a>
            </span>
          ))}
          .
        </p>
      )}

      <div className="mt-2">
        <ShareRow post={post} />
      </div>

      {/* An author's note, set the way a journal sets one: a small portrait
          beside a paragraph, the name run in. */}
      <div className="mt-10 grid grid-cols-[4rem_minmax(0,1fr)] gap-x-5">
        <img
          src={avatar}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="h-16 w-16 border border-hair object-cover"
        />
        <div className="text-[1rem] leading-normal">
          <p>
            <span className="small-caps font-semibold">{SITE.name}</span> builds data platforms that
            do not fit on one machine, and writes down the parts that took longer to understand than
            they should have.
          </p>
          <p className="mt-1.5">
            {SOCIALS.map((social, i) => (
              <span key={social.label}>
                {i > 0 && <Dot />}
                <a {...linkProps(social.href)}>{social.label}</a>
              </span>
            ))}
          </p>
        </div>
      </div>

      {(previous || next) && (
        <nav aria-label="More notes" className="mt-10 space-y-1.5">
          <Neighbour post={next} label="Newer" />
          <Neighbour post={previous} label="Older" />
        </nav>
      )}

      <p className="mt-8">
        <a href="/blog">All notes</a>
      </p>
    </footer>
  );
}

function Neighbour({ post, label }: { post?: PostMeta; label: string }) {
  if (!post) return null;

  return (
    <p>
      <span className="small-caps mr-[0.4em] text-faint">{label}</span>
      <a href={`/blog/${post.slug}`} className="link-quiet font-semibold">
        {post.title}
      </a>
    </p>
  );
}
