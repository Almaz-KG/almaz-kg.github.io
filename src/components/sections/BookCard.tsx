import type { Book } from "@/data/content";
import { TONE_GRADIENT, TONE_HOVER_SHADOW } from "@/utils/tones";
import { cn } from "@/utils/cn";

/** A single cover on the shelf, linking out to the book. */
export function BookCard({ book }: { book: Book }) {
  return (
    <a
      data-card
      href={book.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${book.title} by ${book.author} — view on Amazon`}
      className="group w-[132px] flex-none snap-start sm:w-[148px] lg:w-[160px]"
    >
      <div
        className={cn(
          "relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br",
          "transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-1",
          "group-focus-visible:-translate-y-2 group-focus-visible:ring-2 group-focus-visible:ring-lime",
          TONE_GRADIENT[book.tone],
          TONE_HOVER_SHADOW[book.tone],
        )}
      >
        {/* covers vary in aspect ratio, so contain them against the tone
            gradient rather than cropping the title off the artwork */}
        <img
          src={book.cover}
          alt={`${book.title} — book cover`}
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
        {book.author}
      </span>
    </a>
  );
}
