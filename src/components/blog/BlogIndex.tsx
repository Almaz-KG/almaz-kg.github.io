import type { MouseEvent } from "react";
import { NoteList } from "@/components/doc/NoteList";
import { TitleBlock } from "@/components/doc/TitleBlock";
import { POSTS, POST_TAGS } from "@/data/posts";
import { useHead } from "@/utils/head";
import { navigate, useSearchParam } from "@/utils/router";
import { cn } from "@/utils/cn";

const TITLE = "Notes - Almaz Murzabekov";
const DESCRIPTION =
  "Notes on data platforms, distributed systems, Rust and the parts of infrastructure that only make sense once you have been burned by them.";

export function BlogIndex() {
  useHead({ title: TITLE, description: DESCRIPTION, path: "/blog" });

  // The filter lives in the URL, so a project can link straight to its notes
  // and a filtered view can be shared.
  const tag = useSearchParam("tag");

  // A tag nothing is filed under yet - a project whose first note is still
  // being written - still shows as the current filter above the empty state,
  // rather than leaving "all" marked over a list that is not all.
  const tags = tag && !POST_TAGS.includes(tag) ? [...POST_TAGS, tag] : POST_TAGS;
  const visible = tag ? POSTS.filter((post) => post.tags.includes(tag)) : POSTS;

  return (
    <div className="page">
      <div className="column">
        <TitleBlock
          title="Notes"
          subtitle="Working notes on data platforms, distributed systems, AI and Rust."
        />

        {tags.length > 0 && (
          // Set as a paper's keywords line, each keyword a filter.
          <nav aria-label="Filter notes by tag" className="mt-8 text-muted">
            <span className="small-caps mr-[0.4em] font-semibold text-copy">Keywords.</span>
            <FilterLink current={tag === null} href="/blog">
              all
            </FilterLink>
            {tags.map((name) => (
              <span key={name}>
                {", "}
                <FilterLink current={tag === name} href={`/blog?tag=${encodeURIComponent(name)}`}>
                  {name}
                </FilterLink>
              </span>
            ))}
          </nav>
        )}

        {visible.length === 0 ? (
          <p className="mt-10 text-muted">
            {tag ? (
              <>
                Nothing is filed under <em>{tag}</em> yet.
              </>
            ) : (
              "No notes published yet. The first one is being written."
            )}
          </p>
        ) : (
          <NoteList posts={visible} className="mt-10" />
        )}

        <p className="mt-12 text-muted">
          New notes arrive in the <a href="/rss.xml">RSS feed</a>.
        </p>
      </div>
    </div>
  );
}

/**
 * A filter is a link, so it can be opened in a new tab and copied, but a click
 * replaces the history entry rather than adding one per tag tried.
 */
function FilterLink({
  current,
  href,
  children,
}: {
  current: boolean;
  href: string;
  children: string;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(href, { replace: true });
  }

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={current ? "true" : undefined}
      className={cn(current && "text-copy no-underline")}
    >
      {children}
    </a>
  );
}
