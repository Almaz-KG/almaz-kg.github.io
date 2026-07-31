import type { CSSProperties } from "react";
import { Reveal, Section, SectionHeading } from "@/components/ui";
import { BOOKS } from "@/data/content";
import { useCarousel } from "@/utils/hooks/useCarousel";
import { BookCard } from "./BookCard";
import { ShelfArrow } from "./ShelfArrow";
import { ShelfScrollbar } from "./ShelfScrollbar";

/** Matches `gap-4` on the track. */
const GAP = 16;

export function Shelf() {
  const { trackRef, progress, thumbSize, canPrev, canNext, scrollByPage } =
    useCarousel<HTMLDivElement>({ gap: GAP });

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
          <ShelfArrow dir="prev" onClick={() => scrollByPage(-1)} disabled={!canPrev} />
          <ShelfArrow dir="next" onClick={() => scrollByPage(1)} disabled={!canNext} />
        </Reveal>
      </div>

      {/* the whole track reveals as one unit: cards parked off to the right are
          clipped by the scroll container, so a per-card observer would leave
          them stuck at opacity 0 until they were scrolled into view */}
      <Reveal delay={120} className="mt-12">
        <div
          ref={trackRef}
          style={
            {
              "--fade-l": canPrev ? "22px" : "0px",
              "--fade-r": canNext ? "7%" : "0%",
            } as CSSProperties
          }
          className="no-scrollbar edge-fade flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-7 py-4"
        >
          {BOOKS.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      </Reveal>

      <ShelfScrollbar
        progress={progress}
        thumbSize={thumbSize}
        label={`${BOOKS.length} books`}
      />
    </Section>
  );
}
