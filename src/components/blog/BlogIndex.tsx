import { POSTS, POST_TAGS } from "@/data/posts";
import { Reveal } from "@/components/ui";
import { useHead } from "@/utils/head";
import { navigate, useSearchParam } from "@/utils/router";
import { cn } from "@/utils/cn";
import { BlogNav } from "./BlogNav";
import { PostCard } from "./PostCard";

const TITLE = "Notes - Almaz Murzabekov";
const DESCRIPTION =
  "Notes on data platforms, distributed systems, Rust and the parts of infrastructure that only make sense once you have been burned by them.";

export function BlogIndex() {
  useHead({ title: TITLE, description: DESCRIPTION, path: "/blog" });

  // The filter lives in the URL, so a project card can link straight to its
  // notes and a filtered view can be shared.
  const tag = useSearchParam("tag");
  const setTag = (name: string | null) =>
    navigate(name ? `/blog?tag=${encodeURIComponent(name)}` : "/blog", { replace: true });

  // A tag nothing is filed under yet - a project whose first note is still
  // being written - still shows as the active chip above the empty state,
  // rather than leaving "All" lit over a list that is not all.
  const tags = tag && !POST_TAGS.includes(tag) ? [...POST_TAGS, tag] : POST_TAGS;
  const visible = tag ? POSTS.filter((post) => post.tags.includes(tag)) : POSTS;
  const [featured, ...rest] = visible;

  return (
    <>
      <BlogNav current="index" />

      <div className="mx-auto w-full max-w-5xl px-5 pt-28 pb-24 sm:px-8 sm:pt-36 md:pb-32">
        <header className="max-w-2xl">
          <Reveal className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-faint uppercase">
            <span className="text-lime">/blog</span>
            {/* <span className="h-px w-8 bg-hair" />
            <span>{POSTS.length} notes</span> */}
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-copy sm:text-5xl md:text-6xl">
              Things I write down.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              Working notes on data platforms, distributed systems, AI and Rust.
            </p>
          </Reveal>
        </header>

        {tags.length > 0 && (
          <Reveal delay={200}>
            <nav
              aria-label="Filter notes by tag"
              className="no-scrollbar mt-12 flex gap-2 overflow-x-auto pb-1"
            >
              <TagButton active={tag === null} onClick={() => setTag(null)}>
                All
              </TagButton>

              {tags.map((name) => (
                <TagButton key={name} active={tag === name} onClick={() => setTag(name)}>
                  {name}
                </TagButton>
              ))}
            </nav>
          </Reveal>
        )}

        {visible.length === 0 ? (
          <p className="mt-16 font-mono text-sm text-faint">
            Nothing here yet. The first note is being written.
          </p>
        ) : (
          <div className="mt-8 grid gap-5">
            <Reveal>
              <PostCard post={featured} featured />
            </Reveal>

            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={Math.min(i, 4) * 70}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-16 flex justify-center">
          <a
            href="/rss.xml"
            className="font-mono text-[11px] tracking-[0.22em] text-faint uppercase transition-colors hover:text-lime"
          >
            subscribe via rss
          </a>
        </Reveal>
      </div>
    </>
  );
}

function TagButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-wide whitespace-nowrap transition-colors",
        active
          ? "border-lime/50 bg-lime/12 text-lime"
          : "border-hair bg-sheet text-muted hover:border-lime/40 hover:text-copy",
      )}
    >
      {children}
    </button>
  );
}
