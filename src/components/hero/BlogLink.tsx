/**
 * The way into the blog. The only filled control in the hero's badge row, so
 * that the one link leaving the landing page is the one the eye lands on.
 *
 * Padding matches `ResumeLink` so the two sit on the same baseline at every
 * width, including the taller mobile tap target.
 */
export function BlogLink() {
  return (
    <a
      href="/blog"
      className="inline-flex shrink-0 items-center rounded-full border border-lime/45 bg-lime/10 px-3.5 py-2.5 font-mono text-[11px] tracking-wider text-lime uppercase transition-colors hover:bg-lime/20 sm:px-3 sm:py-1.5"
    >
      Blog
    </a>
  );
}
