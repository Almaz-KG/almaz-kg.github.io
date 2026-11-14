import { ThemeToggle } from "@/components/ThemeToggle";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { CV_HREF, SITE } from "@/data/content";
import { usePath } from "@/utils/router";
import { cn } from "@/utils/cn";

/**
 * The running head every page starts with, as a printed document has: whose
 * it is on the left; where else to go, where else to find the author and the
 * theme on the right. It scrolls away with the page; nothing here is worth a
 * fixed bar over the text.
 *
 * It is the only place the name and the contact links are set, on every page,
 * so nothing below repeats them. On the home page the name is the page's title,
 * so there it is the `h1`: the page opens straight with its abstract.
 */
export function RunningHead() {
  const path = usePath();
  const home = path === "/";
  const inNotes = path === "/blog" || path.startsWith("/blog/");

  return (
    <header className="page">
      {/* Inside the column, so the rule under it spans exactly the text, as the
          rules of the tables below do. */}
      <div className="column">
        {/* One line where it fits. Where it does not, on a phone, the right
            side wraps under the name and starts on the column's edge. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-hair pt-6 pb-3">
          {home ? (
            <h1 className="small-caps text-copy">{SITE.name}</h1>
          ) : (
            <a href="/" className="link-quiet small-caps text-copy">
              {SITE.name}
            </a>
          )}

          <div className="flex items-baseline gap-5 sm:gap-6">
            <nav aria-label="Site" className="flex items-baseline gap-5 sm:gap-6">
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
            </nav>
            <SocialLinks className="self-center" />
            <span className="self-center">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
