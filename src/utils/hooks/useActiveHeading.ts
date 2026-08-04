import { useEffect, useState } from "react";
import type { TocEntry } from "@/data/posts";

/**
 * Which contents entry to highlight: the last heading whose top has passed the
 * reading line, a quarter of the way down the viewport.
 *
 * Driven by a scroll listener rather than IntersectionObserver because the
 * question is "which section am I in", and a heading can be well above the
 * viewport - and so intersecting nothing - while its section is still the one
 * being read.
 */
export function useActiveHeading(toc: TocEntry[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;

    const update = () => {
      const line = window.innerHeight * 0.25;
      let current: string | null = null;

      for (const entry of toc) {
        const top = document.getElementById(entry.id)?.getBoundingClientRect().top;
        if (top === undefined || top > line) break;
        current = entry.id;
      }

      // Before the first heading, the intro is what is on screen; at the very
      // bottom the last section wins even if its heading never crossed the line.
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;

      setActive(atBottom ? (toc.at(-1)?.id ?? current) : current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [toc]);

  return active;
}
