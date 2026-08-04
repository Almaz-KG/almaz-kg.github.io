import type { TocEntry } from "@/data/posts";
import { useActiveHeading } from "@/utils/hooks/useActiveHeading";
import { cn } from "@/utils/cn";

/** Sticky contents rail, shown beside the text on wide screens only. */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const active = useActiveHeading(entries);

  if (entries.length < 3) return null;

  return (
    <aside className="hidden xl:block">
      <nav aria-label="On this page" className="sticky top-24">
        <p className="font-mono text-[10px] tracking-[0.24em] text-faint uppercase">On this page</p>

        <ul className="mt-4 space-y-1 border-l border-hair">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className={cn(
                  "-ml-px block border-l py-1 text-[13px] leading-snug transition-colors",
                  entry.depth === 3 ? "pr-2 pl-6" : "pr-2 pl-4",
                  active === entry.id
                    ? "border-lime text-copy"
                    : "border-transparent text-faint hover:text-copy",
                )}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
