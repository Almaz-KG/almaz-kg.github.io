import type { TocEntry } from "@/data/posts";
import { useActiveHeading } from "@/utils/hooks/useActiveHeading";
import { cn } from "@/utils/cn";

/**
 * The note's contents, numbered the way its body numbers its sections
 * (`chapter` and `section` counters in src/prose.css): 1, 1.1, 1.2, 2. The
 * section being read is set in ink, the rest recede.
 */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const active = useActiveHeading(entries);

  if (entries.length < 3) return null;

  return (
    <nav aria-label="Contents" className="text-[0.9375rem] leading-snug">
      <p className="small-caps font-semibold">Contents</p>

      <ol className="mt-3 space-y-1.5">
        {numbered(entries).map(({ entry, number }) => {
          const current = active === entry.id;

          return (
            <li key={entry.id} className={cn(entry.depth === 3 && "pl-6")}>
              <a
                href={`#${entry.id}`}
                aria-current={current ? "location" : undefined}
                className={cn("link-quiet flex gap-2.5", current ? "text-copy" : "text-muted")}
              >
                <span
                  className={cn(
                    "figures-tabular shrink-0",
                    entry.depth === 2 ? "w-4" : "w-6",
                    current ? "text-accent" : "text-faint",
                  )}
                >
                  {number}
                </span>
                <span className="text-pretty">{entry.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** `1`, `1.1`, `1.2`, `2`: the numbers the body's counters give the same headings. */
function numbered(entries: TocEntry[]): { entry: TocEntry; number: string }[] {
  let chapter = 0;
  let section = 0;

  return entries.map((entry) => {
    if (entry.depth === 2) {
      chapter += 1;
      section = 0;
      return { entry, number: String(chapter) };
    }
    section += 1;
    return { entry, number: `${chapter}.${section}` };
  });
}
