import { Dot } from "@/components/doc/Dot";
import { SITE } from "@/data/content";
import { formatDate } from "@/data/posts";

const REVISION = __SITE_REVISION__;

/**
 * The end of every page: what it is set in, what it is built with, and which
 * commit this copy of it is, the way a technical document carries its revision.
 */
export function Colophon() {
  return (
    <footer className="page mt-20 pb-12">
      <div className="column">
        <div className="border-t border-hair pt-5 text-[0.875rem] leading-relaxed text-faint">
          <p>Built with React, Vite and AI companions.</p>

          <p className="mt-1">
            © {REVISION.date.slice(0, 4) || "2026"} {SITE.name}
            {REVISION.date && (
              <>
                <Dot />
                <time dateTime={REVISION.date} className="whitespace-nowrap">
                  {formatDate(REVISION.date)}
                </time>
              </>
            )}
            <Dot />
            <a href={SITE.source}>Source</a>
            <Dot />
            <a href="/rss.xml">RSS</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
