import { POSTS, type PostMeta } from "@/data/posts";
import { PostMetaLine } from "@/components/doc/PostMetaLine";

/**
 * Notes listed the way a paper lists its references: a bracketed number, the
 * title, one line on what it is about, and when. The number is the note's
 * place in the series, oldest first, so it stays the same as new notes arrive
 * and says how many there are without a counter anywhere.
 */
export function NoteList({ posts, className }: { posts: PostMeta[]; className?: string }) {
  return (
    <ol className={className} reversed>
      {posts.map((post) => (
        // The number behaves as a section number does: inline before the title
        // on a phone, hanging in the margin from `lg` so the titles line up
        // with the text.
        <li key={post.slug} className="py-3 first:pt-0">
          <p className="hang">
            <span aria-hidden="true" className="hang-number text-faint">
              [{seriesNumber(post)}]
            </span>
            <a href={`/blog/${post.slug}`} className="link-quiet font-semibold text-copy">
              {post.title}
            </a>
          </p>
          <p className="mt-0.5 text-muted">{post.description}</p>
          <PostMetaLine post={post} className="mt-1" />
        </li>
      ))}
    </ol>
  );
}

/** 1 for the oldest published note. POSTS is newest first. */
function seriesNumber(post: PostMeta): number {
  return POSTS.length - POSTS.findIndex((p) => p.slug === post.slug);
}
