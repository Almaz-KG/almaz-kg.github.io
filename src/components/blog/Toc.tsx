import type { TocEntry } from "@/data/posts";
import { useActiveHeading } from "@/utils/hooks/useActiveHeading";
import { cn } from "@/utils/cn";

/** Sticky contents rail, shown beside the text on wide screens only. */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const active = useActiveHeading(entries);

  if (entries.length < 3) return null;

  // The body numbers its chapters (see the `chapter` counter in prose.css), so
  // the rail numbers the same ones - otherwise the two read as different maps.
  let chapter = 0;

  return (
    <aside className="hidden xl:block">
      <nav aria-label="On this page" className="sticky top-24">
        <p className="font-mono text-[10px] tracking-[0.24em] text-faint uppercase">On this page</p>

        <ul className="mt-4 space-y-1 border-l border-hair">
          {entries.map((entry) => {
            const number = entry.depth === 2 ? String(++chapter).padStart(2, "0") : null;

            return (
              <li key={entry.id} className={cn(number && chapter > 1 && "pt-3")}>
                <a
                  href={`#${entry.id}`}
                  className={cn(
                    "-ml-px flex items-baseline gap-2 border-l py-1 text-[13px] leading-snug transition-colors",
                    // Sub-entries indent to where a chapter's title starts, past
                    // its number, so the rail reads as one hanging column.
                    entry.depth === 3 ? "pr-2 pl-9" : "pr-2 pl-4",
                    active === entry.id
                      ? "border-lime text-copy"
                      : "border-transparent text-faint hover:text-copy",
                  )}
                >
                  {number && (
                    <span className="shrink-0 font-mono text-[10px] text-lime/80">{number}</span>
                  )}
                  <span>{entry.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
