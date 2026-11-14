import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type TitleBlockProps = {
  title: ReactNode;
  /** The line under the title: a role, a byline. */
  subtitle?: ReactNode;
  /** The dateline under the title, in the mono face: a date, a duration. */
  meta?: ReactNode;
  /** Anything between the subtitle and the abstract, e.g. the author's links. */
  children?: ReactNode;
  /** The opening paragraph, introduced by a run-in "Abstract." */
  abstract?: ReactNode;
  className?: string;
};

/**
 * The top of a page, set like the first page of a paper: the title, who it is
 * by, and an abstract that says what follows. Every page opens with one, so
 * the home page, the notes index and a note read as one document set.
 */
export function TitleBlock({
  title,
  meta,
  subtitle,
  children,
  abstract,
  className,
}: TitleBlockProps) {
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

      {children}

      {abstract && (
        <p className="mt-9">
          <span className="small-caps mr-[0.4em] font-semibold">Abstract.</span>
          {abstract}
        </p>
      )}
    </header>
  );
}
