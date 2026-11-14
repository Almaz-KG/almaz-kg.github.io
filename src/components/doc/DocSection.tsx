import type { ReactNode } from "react";
import { sectionNumber, type SectionId } from "@/data/sections";

type DocSectionProps = {
  id: SectionId;
  title: string;
  children: ReactNode;
};

/**
 * A numbered section of the home page. The number is the section's own link,
 * so it can be copied and shared, and hangs in the margin on wide screens the
 * way a paper's does.
 */
export function DocSection({ id, title, children }: DocSectionProps) {
  const number = sectionNumber(id);

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-8">
      <h2
        id={`${id}-title`}
        className="hang text-[1.4375rem] leading-tight font-semibold tracking-[-0.005em] sm:text-[1.5625rem]"
      >
        <a href={`#${id}`} className="hang-number" aria-label={`Section ${number}`}>
          {number}
        </a>
        {title}
      </h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}
