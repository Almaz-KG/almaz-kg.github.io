import { useEffect } from "react";
import avatar from "@/assets/almaz-avatar.webp";
import { SITE } from "@/data/content";
import { formatDate, type PostModule } from "@/data/posts";
import { useHead } from "@/utils/head";
import { usePost } from "@/utils/hooks/usePost";
import { scrollToIdSettling } from "@/utils/scroll";
import { BlogNav } from "./BlogNav";
import { NotFound } from "./NotFound";
import { PostCover } from "./PostCover";
import { PostFooter } from "./PostFooter";
import { PostMetaLine } from "./PostMetaLine";
import { Toc } from "./Toc";

export function PostPage({ slug }: { slug: string }) {
  const state = usePost(slug);

  if (state.status === "missing") return <NotFound />;
  if (state.status === "loading") return <PostSkeleton />;

  // Keyed on the slug so switching posts remounts rather than reconciling one
  // body into another, which would leave the old scroll position mid-article.
  return <PostView key={slug} post={state.post} />;
}

/**
 * The article grid: the sheet in the first column, the contents rail in the
 * second. At xl the container is wider than the rest of the site, because that
 * is the only width at which the rail, the sheet's padding and a figure that
 * breaks out past the text all fit without fighting each other.
 */
const ARTICLE =
  "mx-auto grid w-full max-w-6xl gap-12 px-5 pt-24 pb-24 sm:px-8 sm:pt-28 xl:max-w-[78rem] xl:grid-cols-[minmax(0,1fr)_13rem]";

/** The reading sheet. Its inner width is exactly one `measure-wide`. */
const SHEET =
  "min-w-0 rounded-[1.75rem] border border-hair bg-sheet px-5 py-12 sm:px-8 sm:py-14 md:px-12";

function PostView({ post }: { post: PostModule }) {
  const { meta, html, toc } = post;

  useHead({
    title: `${meta.title} - ${SITE.name}`,
    description: meta.description,
    image: meta.cover,
    path: `/blog/${meta.slug}`,
    type: "article",
    publishedAt: meta.date,
    modifiedAt: meta.updated,
  });

  // A deep link names a heading that does not exist yet: the body is a lazy
  // chunk, so the browser looked for the fragment and gave up long before this
  // markup was committed. Asking again now is the whole fix.
  useEffect(() => {
    scrollToIdSettling(window.location.hash.slice(1));
  }, []);

  return (
    <>
      <BlogNav title={meta.title} current="post" />

      <article className={ARTICLE}>
        <div className={SHEET}>
          <header className="measure">
            <PostMetaLine post={meta} />

            <h1 className="mt-4 text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-copy sm:text-5xl">
              {meta.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted">{meta.description}</p>

            <div className="mt-7 flex items-center gap-3 border-t border-hair pt-6">
              <img
                src={avatar}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="font-mono text-[11px] leading-relaxed text-faint">
                <p className="text-muted">{SITE.name}</p>
                {meta.updated && <p>updated {formatDate(meta.updated)}</p>}
              </div>
            </div>
          </header>

          {meta.cover && (
            <figure className="measure-wide mt-12">
              <PostCover post={meta} className="aspect-[21/9] w-full" />
              {meta.coverAlt && (
                <figcaption className="mt-3 text-center font-mono text-xs text-faint">
                  {meta.coverAlt}
                </figcaption>
              )}
            </figure>
          )}

          {/*
            The HTML is compiled from this repository's own markdown at build
            time, never from user input, so there is nothing here to sanitise.
          */}
          <div className="prose mt-14" dangerouslySetInnerHTML={{ __html: html }} />

          <PostFooter post={meta} />
        </div>

        <Toc entries={toc} />
      </article>
    </>
  );
}

/** Holds the layout while the post's chunk arrives, so the nav does not jump. */
function PostSkeleton() {
  return (
    <>
      <BlogNav current="post" />
      <div className={ARTICLE}>
        <div className={SHEET}>
          <div className="measure animate-pulse space-y-4">
            <div className="h-3 w-40 rounded-full bg-copy/10" />
            <div className="h-10 w-full rounded-lg bg-copy/10" />
            <div className="h-10 w-2/3 rounded-lg bg-copy/10" />
            <div className="h-4 w-full rounded-full bg-copy/6" />
            <div className="h-4 w-5/6 rounded-full bg-copy/6" />
          </div>
        </div>
      </div>
    </>
  );
}
