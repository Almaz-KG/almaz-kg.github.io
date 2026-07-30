import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { BOOKS } from "../data/content";
import { Reveal, Section, SectionHeading } from "./ui";
import { cn } from "../utils/cn";

const TONE: Record<string, string> = {
  lime: "from-lime/25 to-lime/5 border-lime/25",
  aqua: "from-aqua/25 to-aqua/5 border-aqua/25",
  violet: "from-violet/30 to-violet/5 border-violet/25",
  citrus: "from-citrus/25 to-citrus/5 border-citrus/25",
};

const GLOW: Record<string, string> = {
  lime: "group-hover:shadow-[0_18px_40px_-18px_rgba(182,255,46,0.55)]",
  aqua: "group-hover:shadow-[0_18px_40px_-18px_rgba(47,240,208,0.55)]",
  violet: "group-hover:shadow-[0_18px_40px_-18px_rgba(139,123,255,0.55)]",
  citrus: "group-hover:shadow-[0_18px_40px_-18px_rgba(255,122,69,0.55)]",
};

const GAP = 16; // matches gap-4 on the track

function Arrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous books" : "Next books"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300",
        disabled
          ? "cursor-not-allowed opacity-25"
          : "hover:border-lime/50 hover:text-lime active:scale-95",
      )}
    >
      <span aria-hidden className="text-lg leading-none">
        {dir === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}

export function Shelf() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [thumb, setThumb] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;
    setProgress(max > 0 ? Math.min(1, Math.max(0, x / max)) : 0);
    setThumb(el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1);
    setCanPrev(x > 4);
    setCanNext(x < max - 4);
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

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + GAP : el.clientWidth;
    const perPage = Math.max(1, Math.floor(el.clientWidth / step));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step * perPage, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Section id="shelf">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          index="04"
          kicker="Bookshelf"
          title={
            <>
              What&apos;s on my <span className="text-gradient">book shelf</span>.
            </>
          }
          intro="Every year I pick a reading list and actually work through it — summaries, notes and all."
        />
        <Reveal delay={140} className="hidden items-center gap-2 sm:flex">
          <Arrow dir="prev" onClick={() => page(-1)} disabled={!canPrev} />
          <Arrow dir="next" onClick={() => page(1)} disabled={!canNext} />
        </Reveal>
      </div>

      {/* the whole track reveals as one unit: cards parked off to the right are
          clipped by the scroll container, so a per-card observer would leave
          them stuck at opacity 0 until they were scrolled into view */}
      <Reveal delay={120} className="mt-12">
        <div
          ref={trackRef}
          style={{ "--fade-l": canPrev ? "22px" : "0px", "--fade-r": canNext ? "7%" : "0%" } as CSSProperties}
          className="no-scrollbar edge-fade flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-7 py-4"
        >
          {BOOKS.map((b) => (
            <a
              key={b.title}
              data-card
              href={b.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${b.title} by ${b.author} — view on Amazon`}
              className="group w-[132px] flex-none snap-start sm:w-[148px] lg:w-[160px]"
            >
              <div
                className={cn(
                  "relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br",
                  "transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-1",
                  "group-focus-visible:-translate-y-2 group-focus-visible:ring-2 group-focus-visible:ring-lime",
                  TONE[b.tone],
                  GLOW[b.tone],
                )}
              >
                {/* covers vary in aspect ratio, so contain them against the tone
                    gradient rather than cropping the title off the artwork */}
                <img
                  src={b.cover}
                  alt={`${b.title} — book cover`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
                <span
                  aria-hidden
                  className="absolute top-1.5 right-2 text-xs text-white/0 transition-colors duration-300 group-hover:text-white/90"
                >
                  ↗
                </span>
              </div>
              <span className="mt-3 block font-mono text-[10px] leading-tight tracking-wider text-white/40 uppercase transition-colors duration-300 group-hover:text-white/70">
                {b.author}
              </span>
            </a>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 flex items-center gap-5">
        <div className="relative h-px flex-1 bg-white/10">
          <div
            className="absolute inset-y-0 rounded-full bg-lime/70 transition-[left] duration-150 ease-out"
            style={{ width: `${thumb * 100}%`, left: `${progress * (1 - thumb) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
          {BOOKS.length} books
        </span>
      </div>
    </Section>
  );
}
