import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/utils/motion";

/** Ignore sub-pixel scroll rounding when deciding whether an end is reached. */
const EPSILON = 4;

type Options = {
  /** Gap between cards, in pixels — must match the track's `gap-*` class. */
  gap?: number;
  /** Selector for a single card inside the track; sets the paging step. */
  cardSelector?: string;
};

/**
 * Drives a horizontally scrollable track: reports where it sits so a scrollbar
 * and arrows can be rendered, and pages it a full screenful at a time.
 */
export function useCarousel<T extends HTMLElement>({
  gap = 0,
  cardSelector = "[data-card]",
}: Options = {}) {
  const trackRef = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [thumbSize, setThumbSize] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;

    setProgress(max > 0 ? Math.min(1, Math.max(0, x / max)) : 0);
    setThumbSize(el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1);
    setCanPrev(x > EPSILON);
    setCanNext(x < max - EPSILON);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollByPage = useCallback(
    (dir: 1 | -1) => {
      const el = trackRef.current;
      if (!el) return;

      const card = el.querySelector<HTMLElement>(cardSelector);
      const step = card ? card.offsetWidth + gap : el.clientWidth;
      const perPage = Math.max(1, Math.floor(el.clientWidth / step));

      el.scrollBy({
        left: dir * step * perPage,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [gap, cardSelector],
  );

  return { trackRef, progress, thumbSize, canPrev, canNext, scrollByPage };
}
