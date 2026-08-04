import { BlogIndex } from "./BlogIndex";
import { NotFound } from "./NotFound";
import { PostPage } from "./PostPage";

/**
 * Everything that is not the home page. Loaded as one lazy chunk, so a visitor
 * who never opens the blog never downloads it - and one who does gets the index
 * and a post without a second round trip.
 */
export function BlogRoute({ path }: { path: string }) {
  if (path === "/blog") return <BlogIndex />;

  const slug = /^\/blog\/([^/]+)$/.exec(path)?.[1];
  if (slug) return <PostPage slug={slug} />;

  return <NotFound />;
}
