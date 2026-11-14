import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type TitleBlockProps = {
  title: ReactNode;
  /** The line under the title. */
  subtitle?: ReactNode;
  /** The dateline under the title, in the mono face: a date, a duration. */
  meta?: ReactNode;
  className?: string;
};

/**
 * The top of a page, set like the first page of a paper: the title, a line
 * under it and its date. The notes index, a note and the 404 page open with
 * one; the home page's title is the name in the running head, so it opens
 * with its abstract instead.
 */
export function TitleBlock({ title, meta, subtitle, className }: TitleBlockProps) {
  return (
    <header className={cn("pt-14 sm:pt-20", className)}>
      <h1 className="text-[2.375rem] leading-[1.08] font-semibold tracking-[-0.012em] text-balance sm:text-[2.875rem]">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-[1.1875rem] text-muted sm:text-[1.3125rem]">{subtitle}</p>
      )}

      {/* Under the title, where a paper dates itself, rather than above it as
          a label: nothing sits over a heading on this site. */}
      {meta && <div className="mt-3">{meta}</div>}
    </header>
  );
}
