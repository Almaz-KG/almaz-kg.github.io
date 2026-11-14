import { type PostMeta } from "@/data/posts";
import { PostMetaLine } from "@/components/doc/PostMetaLine";

/** Notes listed newest first: the title, one line on what it is about, and when. */
export function NoteList({ posts, className }: { posts: PostMeta[]; className?: string }) {
  return (
    <ol className={className}>
      {posts.map((post) => (
        <li key={post.slug} className="py-3 first:pt-0">
          <p>
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
