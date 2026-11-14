import { useEffect, useRef } from "react";
import { PostMetaLine } from "@/components/doc/PostMetaLine";
import { TitleBlock } from "@/components/doc/TitleBlock";
import { SITE } from "@/data/content";
import { findPost, type PostMeta, type PostModule } from "@/data/posts";
import { cn } from "@/utils/cn";
import { useHead } from "@/utils/head";
import { mountDeck } from "@/utils/deck";
import { usePost } from "@/utils/hooks/usePost";
import { scrollToIdSettling } from "@/utils/scroll";
import { NotFound } from "./NotFound";
import { PostFooter } from "./PostFooter";
import { Toc } from "./Toc";

export function PostPage({ slug }: { slug: string }) {
  const state = usePost(slug);
  const meta = findPost(slug);

  if (state.status === "missing" || !meta) return <NotFound />;

  // Keyed on the slug so switching notes remounts rather than reconciling one
  // body into another, which would leave the old scroll position mid-article.
  // While the body's chunk is on its way the title block is already there:
  // everything in it comes from the build-time index, not from the chunk.
  return (
    <PostView key={slug} meta={meta} post={state.status === "ready" ? state.post : undefined} />
  );
}

function PostView({ meta, post }: { meta: PostMeta; post?: PostModule }) {
  const body = useRef<HTMLDivElement>(null);
  const html = post?.html;

  useHead({
    title: `${meta.title} - ${SITE.name}`,
    description: meta.description,
    image: meta.cover,
    path: `/blog/${meta.slug}`,
    type: "article",
    publishedAt: meta.date,
    modifiedAt: meta.updated,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: meta.title,
      description: meta.description,
      url: `${SITE.url}/blog/${meta.slug}`,
      mainEntityOfPage: `${SITE.url}/blog/${meta.slug}`,
      datePublished: meta.date,
      dateModified: meta.updated ?? meta.date,
      keywords: meta.tags.join(", "),
      ...(meta.cover ? { image: `${SITE.url}${meta.cover}` } : {}),
      author: { "@type": "Person", name: SITE.name, url: `${SITE.url}/` },
    },
  });

  // A deep link names a heading that does not exist yet: the body is a lazy
  // chunk, so the browser looked for the fragment and gave up long before this
  // markup was committed. Asking again once it is here is the whole fix.
  useEffect(() => {
    if (html) scrollToIdSettling(window.location.hash.slice(1));
  }, [html]);

  useEffect(
    () => (meta.deck && html && body.current ? mountDeck(body.current) : undefined),
    [meta.deck, html],
  );

  // The cover is the note's link preview (`image` in useHead above), not a
  // figure on the page. Nor is the description set here as an abstract: it is
  // the note's card in the index and its link preview, and on the page the
  // note opens with its own first paragraph, a concrete scene. Set above that
  // paragraph, the description only says the same thing twice.
  const head = (
    <TitleBlock title={<Title text={meta.title} />} meta={<PostMetaLine post={meta} updated />} />
  );

  /*
   * The HTML is compiled from this repository's own markdown at build time,
   * never from user input, so there is nothing here to sanitise. Until the
   * chunk arrives the body holds a screen of space, so the colophon does not
   * jump up under the title.
   */
  const content = html ? (
    <div
      ref={body}
      className={cn("mt-9", !meta.deck && "prose")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <div className="mt-9 min-h-screen" />
  );

  if (meta.deck) {
    // A note that walks through a talk shows its slides in a viewer wider than
    // the text, the way a paper sets a figure across both columns. The title,
    // the text under each slide and the end matter keep the column; see
    // `.page-deck` in src/deck.css. The slides are the note's own contents,
    // so there is no contents rail.
    return (
      <article className="page page-deck">
        <div className="column">{head}</div>
        {content}
        <div className="column">
          <PostFooter post={meta} />
        </div>
      </article>
    );
  }

  return (
    <article className="page">
      <div className="column">
        {head}

        {/* The contents sit in the right margin beside the body, from the first
            line of it, and follow the reader down. Only from `xl`: narrower,
            the margin is not there to hold them. */}
        <div className="relative">
          {content}
          <PostFooter post={meta} />

          {post && (
            <aside className="absolute top-0 bottom-0 left-full ml-[calc(var(--gutter)+2rem)] hidden w-52 xl:block">
              <div className="sticky top-8 max-h-[calc(100svh-4rem)] overflow-y-auto">
                <Toc entries={post.toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * A title with a series prefix - "XKE S1: How LLMs are trained" - breaks after
 * the colon when it has to break at all, so the prefix and the title proper
 * each stay whole.
 */
function Title({ text }: { text: string }) {
  const match = /^(.+?:)\s+(.+)$/.exec(text);
  if (!match) return text;

  return (
    <>
      {match[1]} <span className="inline-block">{match[2]}</span>
    </>
  );
}
