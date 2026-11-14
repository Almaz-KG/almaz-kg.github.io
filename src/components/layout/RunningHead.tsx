import { ThemeToggle } from "@/components/ThemeToggle";
import { CV_HREF, SITE } from "@/data/content";
import { usePath } from "@/utils/router";
import { cn } from "@/utils/cn";

/**
 * The running head every page starts with, as a printed document has: whose
 * it is on the left, where else to go on the right. It scrolls away with the
 * page; nothing here is worth a fixed bar over the text.
 */
export function RunningHead() {
  const path = usePath();
  const inNotes = path === "/blog" || path.startsWith("/blog/");

  return (
    <header className="page">
      {/* Inside the column, so the rule under it spans exactly the text, as the
          rules of the tables below do. */}
      <div className="column">
        <div className="flex items-baseline gap-6 border-b border-hair pt-6 pb-3">
          <a
            href="/"
            aria-current={path === "/" ? "page" : undefined}
            className="link-quiet small-caps text-copy"
          >
            {SITE.name}
          </a>

          <nav aria-label="Site" className="ml-auto flex items-baseline gap-5 sm:gap-6">
            <a
              href="/blog"
              aria-current={path === "/blog" ? "page" : undefined}
              className={cn("link-quiet small-caps", inNotes ? "text-copy" : "text-muted")}
            >
              Notes
            </a>
            <a href={CV_HREF} className="link-quiet small-caps text-muted">
              CV
            </a>
            <span className="self-center">
              <ThemeToggle />
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}
