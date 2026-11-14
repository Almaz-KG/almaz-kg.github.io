import { Dot } from "@/components/doc/Dot";
import { TitleBlock } from "@/components/doc/TitleBlock";
import { SITE } from "@/data/content";
import { useHead } from "@/utils/head";
import { usePath } from "@/utils/router";

/** Rendered for an unknown path, including one GitHub Pages served as 404.html. */
export function NotFound() {
  const path = usePath();

  useHead({
    title: `Not found - ${SITE.name}`,
    description: "This page does not exist.",
    path,
    noindex: true,
  });

  return (
    <div className="page">
      <div className="column">
        <TitleBlock
          title="Nothing lives at this address."
          subtitle={
            <span className="font-mono text-[0.875em] break-all">
              {path}
              <Dot className="" />
              404
            </span>
          }
        />

        <p className="mt-9">
          The page may have been renamed, or it may never have existed. The{" "}
          <a href="/blog">notes</a> and the <a href="/">home page</a> are where they always were.
        </p>
      </div>
    </div>
  );
}
