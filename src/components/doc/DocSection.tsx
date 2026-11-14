import type { ReactNode } from "react";

type DocSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/** A section of the home page: a heading, then whatever it holds. */
export function DocSection({ id, title, children }: DocSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-8">
      <h2
        id={`${id}-title`}
        className="text-[1.4375rem] leading-tight font-semibold tracking-[-0.005em] sm:text-[1.5625rem]"
      >
        {title}
      </h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}
